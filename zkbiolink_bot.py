import os
import sys
import time
import glob
import json
import urllib.request
import ssl
from datetime import datetime

# =========================================================================
# CONFIGURACIÓN DEL BOT (SE RECOMIENDA PASAR POR VARIABLES DE ENTORNO O EDITAR AQUÍ)
# =========================================================================
ZLINK_EMAIL = os.environ.get("ZLINK_EMAIL", "tu-correo@donguto.com")
ZLINK_PASSWORD = os.environ.get("ZLINK_PASSWORD", "tu-contraseña-zlink")
VERCEL_API_URL = "https://intranet-livid.vercel.app/api/enroll"

print("=================================================================")
print("🤖 BOT RPA de Sincronización Automática ZKBio Zlink -> Intranet")
print("=================================================================")

def install_dependencies():
    print("[Bot] Verificando dependencias necesarias...")
    try:
        import selenium
        import pandas
        import openpyxl
        print("[Bot] Dependencias listas.")
    except ImportError:
        print("[Bot] Faltan librerías. Instalando selenium, pandas y openpyxl...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "selenium", "pandas", "openpyxl", "webdriver-manager"])
        print("[Bot] Instalación completada con éxito.")

def wait_for_download(download_dir, timeout=20):
    print(f"[Bot] Esperando a que se complete la descarga en {download_dir}...")
    start_time = time.time()
    while time.time() - start_time < timeout:
        # Buscar archivos temporales de descarga de Chrome
        temp_files = glob.glob(os.path.join(download_dir, "*.crdownload")) + glob.glob(os.path.join(download_dir, "*.tmp"))
        # Buscar archivos válidos finalizados
        valid_files = glob.glob(os.path.join(download_dir, "*.xlsx")) + glob.glob(os.path.join(download_dir, "*.xls")) + glob.glob(os.path.join(download_dir, "*.csv"))
        
        if valid_files and not temp_files:
            latest = max(valid_files, key=os.path.getmtime)
            print(f"[Bot] Descarga completada con éxito: {os.path.basename(latest)}")
            return latest
        time.sleep(2)
    return None

def parse_and_upload(file_path):
    print(f"[Bot] Analizando el archivo descargado: {os.path.basename(file_path)}")
    try:
        import pandas as pd
        
        # Leer archivo según extensión
        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path, sep=None, engine='python')
        else:
            df = pd.read_excel(file_path)
            
        print("[Bot] Columnas leídas:")
        columns = [str(c).strip() for c in df.columns]
        print(columns)
        
        def find_col(patterns, exclude_patterns=[]):
            for col in columns:
                lower_c = col.lower()
                if any(p in lower_c for p in patterns) and not any(ep in lower_c for ep in exclude_patterns):
                    return col
            return None

        # Identificar columnas con las mismas reglas del intranet
        id_col = find_col(['dni', 'biometric_id', 'personal_id', 'user_id', 'no.', 'no', 'código', 'codigo', 'code', 'id', 'documento', 'número de personal', 'numero de personal', 'colaborador', 'usuario'])
        punch_list_col = find_col(['registros de perforación', 'registros de perforacion', 'punch_list', 'lista_marcaciones', 'marcajes'])
        date_time_col = find_col(
            ['fecha/hora', 'fechayhora', 'timestamp', 'punch_time', 'punchtime', 'time', 'datetime', 'date_time', 'marcación', 'marcacion', 'fecha y hora', 'reloj', 'registro'],
            ['registros de perforación', 'registros de perforacion', 'número de', 'numero de', 'cantidad de']
        )
        date_col = find_col(['fecha', 'date', 'día', 'dia'], ['fecha/hora', 'fechayhora', 'fecha y hora'])
        time_col = find_col(['hora', 'time', 'tiempo'], ['fecha/hora', 'fechayhora', 'fecha y hora', 'registros de perforación', 'registros de perforacion'])

        print(f"[Bot] Columnas identificadas -> ID: '{id_col}', DateTime: '{date_time_col}', Date: '{date_col}', Time: '{time_col}', PunchList: '{punch_list_col}'")

        if not id_col:
            raise ValueError("No se pudo identificar la columna de DNI/ID de usuario.")

        punches = []

        for index, row in df.iterrows():
            bio_id = str(row[id_col]).strip()
            if not bio_id or bio_id == 'nan' or bio_id == 'None':
                continue
            
            # Limpiar flotantes
            if bio_id.endswith('.0'):
                bio_id = bio_id[:-2]

            # Caso A: Lista de perforaciones agrupadas por fecha
            if date_col and row[date_col] and punch_list_col and str(row[punch_list_col]).strip() != 'nan':
                d_val = row[date_col]
                list_val = str(row[punch_list_col]).strip()
                
                # Parsear fecha
                if isinstance(d_val, datetime):
                    date_str = d_val.strftime("%Y-%m-%d")
                elif hasattr(d_val, 'strftime'):
                    date_str = d_val.strftime("%Y-%m-%d")
                else:
                    dt_str = str(d_val).split(' ')[0].strip()
                    # Convertir dd/mm/yyyy o yyyy-mm-dd
                    if '/' in dt_str:
                        parts = dt_str.split('/')
                        if len(parts) == 3:
                            if len(parts[0]) == 4:
                                date_str = f"{parts[0]}-{parts[1].zfill(2)}-{parts[2].zfill(2)}"
                            else:
                                date_str = f"{parts[2]}-{parts[1].zfill(2)}-{parts[0].zfill(2)}"
                    else:
                        date_str = dt_str
                
                # Parsear lista de horas (ej: "07:36" o "09:19, 18:10")
                times = [t.strip() for t in list_val.split(',') if t.strip()]
                for t_val in times:
                    # Combinar fecha y hora
                    try:
                        combined_str = f"{date_str} {t_val}"
                        for fmt in ('%Y-%m-%d %H:%M:%S', '%Y-%m-%d %H:%M', '%Y-%m-%d %I:%M %p', '%Y-%m-%d %I:%M%p'):
                            try:
                                dt_obj = datetime.strptime(combined_str, fmt)
                                break
                            except ValueError:
                                continue
                        else:
                            dt_obj = pd.to_datetime(combined_str)
                            
                        iso_timestamp = dt_obj.strftime("%Y-%m-%dT%H:%M:%S.000Z")
                        punches.append({
                            "biometric_id": bio_id,
                            "timestamp": iso_timestamp,
                            "device_id": "ZLINK-CLOUD-BOT",
                            "device_name": "Minerva Cloud RPA Bot"
                        })
                    except Exception as ex:
                        print(f"[Bot] Error combinando {date_str} {t_val}: {ex}")

            # Caso B: Columna combinada de Fecha y Hora o fecha/hora separadas individuales
            elif date_time_col or (date_col and (time_col or date_time_col)):
                raw_time = row[date_time_col] if date_time_col else row[date_col]
                # Si están separadas, combinamos
                if date_col and time_col and not date_time_col:
                    raw_time = f"{row[date_col]} {row[time_col]}"
                    
                if pd.isna(raw_time):
                    continue

                try:
                    if isinstance(raw_time, datetime):
                        dt_obj = raw_time
                    elif hasattr(raw_time, 'strftime'):
                        dt_obj = raw_time
                    else:
                        dt_str = str(raw_time).strip()
                        for fmt in ('%Y-%m-%d %H:%M:%S', '%d/%m/%Y %H:%M:%S', '%Y/%m/%d %H:%M:%S', '%Y-%m-%d %H:%M'):
                            try:
                                dt_obj = datetime.strptime(dt_str, fmt)
                                break
                            except ValueError:
                                continue
                        else:
                            dt_obj = pd.to_datetime(dt_str)
                    
                    iso_timestamp = dt_obj.strftime("%Y-%m-%dT%H:%M:%S.000Z")
                    punches.append({
                        "biometric_id": bio_id,
                        "timestamp": iso_timestamp,
                        "device_id": "ZLINK-CLOUD-BOT",
                        "device_name": "Minerva Cloud RPA Bot"
                    })
                except Exception as e:
                    print(f"[Bot] No se pudo procesar fecha/hora '{raw_time}': {e}")
                    
        if not punches:
            print("[Bot] No se encontraron marcaciones válidas para cargar.")
            return

        print(f"[Bot] Se detectaron {len(punches)} marcaciones listas. Subiendo a la Intranet...")
        
        # Enviar a la Intranet
        payload = {
            "action": "import",
            "punches": punches
        }
        
        req = urllib.request.Request(
            VERCEL_API_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        
        # Omitir verificación SSL si Vercel tiene certificados autoproclamados en entornos locales
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        
        with urllib.request.urlopen(req, context=ctx) as response:
            res_body = response.read().decode("utf-8")
            print(f"[Bot] Sincronización exitosa con la Intranet. Respuesta: {res_body}")
            
    except Exception as e:
        print(f"[Bot] Error al analizar e importar el archivo: {e}")

def run_rpa_flow():
    # Asegurar dependencias
    install_dependencies()
    
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from webdriver_manager.chrome import ChromeDriverManager
    from selenium.webdriver.chrome.service import Service

    # Definir directorio temporal de descargas
    current_dir = os.path.dirname(os.path.abspath(__file__))
    download_dir = os.path.join(current_dir, "zlink_downloads")
    if not os.path.exists(download_dir):
        os.makedirs(download_dir)

    print(f"[Bot] Iniciando navegador Chrome (Descargas en: {download_dir})...")
    
    # Configurar opciones de Chrome
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument("--headless=new") # Ejecutar sin interfaz gráfica en la nube
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_experimental_option("prefs", {
        "download.default_directory": download_dir,
        "download.prompt_for_download": False,
        "download.directory_upgrade": True,
        "safebrowsing.enabled": True
    })

    # Iniciar Driver
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    try:
        print("[Bot] Conectando a ZKBio Zlink...")
        driver.get("https://zlink.minervaiot.com")
        
        wait = WebDriverWait(driver, 20)
        
        # Iniciar Sesión
        print(f"[Bot] Ingresando credenciales para {ZLINK_EMAIL}...")
        email_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='email']")))
        email_input.clear()
        email_input.send_keys(ZLINK_EMAIL)
        
        password_input = driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        password_input.clear()
        password_input.send_keys(ZLINK_PASSWORD)
        
        submit_btn = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_btn.click()
        
        print("[Bot] Esperando carga del Dashboard...")
        time.sleep(8) # Esperar a la autenticación de Minerva
        
        # Navegar a los reportes de asistencia
        print("[Bot] Navegando a la sección de reportes de marcaciones...")
        driver.get("https://zlink.minervaiot.com/#/attendance/punch-records")
        time.sleep(8)
        
        # DEBUG: Imprimir URL actual y título de página
        current_url = driver.current_url
        print(f"[Bot] URL actual tras navegación: {current_url}")
        print(f"[Bot] Título de la página: {driver.title}")
        driver.save_screenshot(os.path.join(current_dir, "zlink_page_debug.png"))
        
        # Listar todos los botones para encontrar el botón de exportación
        print("[Bot] Listando todos los botones (button) de la página:")
        buttons = driver.find_elements(By.TAG_NAME, "button")
        for idx, btn in enumerate(buttons):
            try:
                print(f"  Botón {idx}: text='{btn.text}', class='{btn.get_attribute('class')}', html='{btn.get_attribute('outerHTML')[:180]}'")
            except Exception as e:
                print(f"  Botón {idx}: Error: {e}")

        # Listar todos los íconos/elementos clickeables cerca de "Historial de exportación"
        print("[Bot] Listando elementos con textos comunes (Export, Descargar, Informes, etc.):")
        elements = driver.find_elements(By.XPATH, "//*[contains(text(), 'Export') or contains(text(), 'Exportar') or contains(text(), 'Descargar') or contains(text(), 'Informes') or contains(text(), 'Marcajes')]")
        for idx, el in enumerate(elements):
            try:
                print(f"  Elemento {idx}: tag='{el.tag_name}', text='{el.text}', html='{el.get_attribute('outerHTML')[:180]}'")
            except Exception as e:
                print(f"  Elemento {idx}: Error: {e}")

        # Intentar clickear el botón de exportación por íconos comunes de Minerva (el-icon-download u otros)
        print("[Bot] Buscando botón de exportación por iconos/clases...")
        export_buttons = driver.find_elements(By.XPATH, "//*[contains(text(), 'Export') or contains(text(), 'Exportar') or contains(text(), 'Descargar')]")
        
        if not export_buttons:
            # Si no se encontró por texto, buscar botones que tengan clases de descarga (ej: el-icon-download, icon-download, etc.)
            print("[Bot] No se encontró por texto, intentando buscar por clase de icono el-icon-download...")
            export_buttons = driver.find_elements(By.CSS_SELECTOR, ".el-icon-download, .icon-download, button .download, button[title*='Export'], button[title*='descarg']")
            
        if not export_buttons:
            # Buscar botones que contengan un SVG
            print("[Bot] Intentando buscar botones que contengan un SVG o elementos de icono...")
            export_buttons = driver.find_elements(By.XPATH, "//button[./svg] | //button[descendant::i]")
            
        if not export_buttons:
            driver.save_screenshot(os.path.join(current_dir, "zlink_error_debug.png"))
            print("[Bot] Error: No se encontró el botón de exportación. Verifique 'zlink_error_debug.png' y la lista de botones arriba.")
            return
            
        print(f"[Bot] Se encontraron {len(export_buttons)} posibles botones de exportación. Intentando hacer clic en el primero...")
        try:
            export_buttons[0].click()
            print("[Bot] Clic ejecutado en el primer botón de exportación.")
        except Exception as click_err:
            print(f"[Bot] Error haciendo clic normal, intentando clic por JavaScript: {click_err}")
            driver.execute_script("arguments[0].click();", export_buttons[0])
            print("[Bot] Clic por JavaScript ejecutado.")
            
        # Esperar 2 segundos por si abre un dropdown o menú de exportación (ej: Excel / PDF)
        time.sleep(2)
        
        # Buscar opciones de formato en dropdowns/menús (ej: "Excel", "Exportar a Excel", "XLSX", etc.)
        dropdown_options = driver.find_elements(By.XPATH, "//*[contains(text(), 'Excel') or contains(text(), 'xlsx') or contains(text(), 'Exportar a Excel')]")
        if dropdown_options:
            print(f"[Bot] Se detectó un menú de exportación con {len(dropdown_options)} opciones. Clickeando la opción Excel...")
            clicked_option = False
            for opt in dropdown_options:
                try:
                    if opt.is_displayed():
                        print(f"[Bot] Clickeando opción de exportación visible: '{opt.text}'")
                        opt.click()
                        clicked_option = True
                        break
                except:
                    continue
            if not clicked_option:
                try:
                    driver.execute_script("arguments[0].click();", dropdown_options[0])
                    print("[Bot] Clic por JavaScript ejecutado en la primera opción del menú.")
                except Exception as opt_err:
                    print(f"[Bot] No se pudo hacer clic en la opción del menú: {opt_err}")

        # Esperar a que se procese la descarga del archivo en el directorio temporal
        downloaded_file = wait_for_download(download_dir, timeout=25)
        if downloaded_file:
            # Procesar y enviar
            parse_and_upload(downloaded_file)
            
            # Limpiar archivo para evitar duplicados en la próxima corrida
            try:
                os.remove(downloaded_file)
            except:
                pass
        else:
            driver.save_screenshot(os.path.join(current_dir, "zlink_error_debug.png"))
            print("[Bot] Error: No se detectó ningún archivo nuevo completado en la carpeta de descargas.")
            
    except Exception as e:
        print(f"[Bot] Ocurrió un error durante la simulación de navegación: {e}")
        try:
            driver.save_screenshot(os.path.join(current_dir, "zlink_error_debug.png"))
            print("[Bot] Se guardó captura del error en 'zlink_error_debug.png'.")
        except:
            pass
    finally:
        driver.quit()
        print("[Bot] Navegador cerrado.")

if __name__ == "__main__":
    if ZLINK_EMAIL == "tu-correo@donguto.com" or ZLINK_PASSWORD == "tu-contraseña-zlink":
        print("[Alerta] Por favor, configura tus credenciales de Zlink en las variables de entorno ZLINK_EMAIL y ZLINK_PASSWORD antes de correr el script.")
    run_rpa_flow()
