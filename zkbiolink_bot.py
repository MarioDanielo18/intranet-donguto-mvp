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

def get_latest_downloaded_file(download_dir):
    # Buscar archivos .xlsx o .csv en la carpeta de descargas ordenados por fecha
    files = glob.glob(os.path.join(download_dir, "*.xlsx")) + glob.glob(os.path.join(download_dir, "*.xls")) + glob.glob(os.path.join(download_dir, "*.csv"))
    if not files:
        return None
    return max(files, key=os.path.getmtime)

def parse_and_upload(file_path):
    print(f"[Bot] Analizando el archivo descargado: {os.path.basename(file_path)}")
    try:
        import pandas as pd
        
        # Leer archivo según extensión
        if file_path.endswith('.csv'):
            # Detectar separador común en CSVs de ZKTeco
            df = pd.read_csv(file_path, sep=None, engine='python')
        else:
            df = pd.read_excel(file_path)
            
        print("[Bot] Vista previa de las columnas leídas:")
        print(list(df.columns))
        
        # Intentar identificar las columnas de DNI/ID y Fecha/Hora
        id_col = None
        time_col = None
        
        for col in df.columns:
            col_lower = str(col).lower().strip()
            if any(x in col_lower for x in ['dni', 'biometric_id', 'personal_id', 'user_id', 'no.', 'no', 'código', 'codigo', 'code', 'id', 'documento']):
                id_col = col
            if any(x in col_lower for x in ['fecha/hora', 'timestamp', 'punch_time', 'time', 'datetime', 'date_time', 'marcación', 'marcacion', 'fecha y hora']):
                time_col = col

        if not id_col or not time_col:
            # Fallback a posiciones si los nombres no coinciden
            print("[Bot] Advertencia: No se encontraron nombres estándar de columnas. Usando mapeo por posición.")
            id_col = df.columns[0]
            time_col = df.columns[1] if len(df.columns) > 1 else None
            
        if not id_col or not time_col:
            raise ValueError("No se pudieron identificar las columnas de ID/DNI o Fecha/Hora en el reporte.")

        print(f"[Bot] Mapeando columnas -> ID: '{id_col}', Fecha/Hora: '{time_col}'")
        
        punches = []
        for index, row in df.iterrows():
            bio_id = str(row[id_col]).strip()
            raw_time = row[time_col]
            
            if not bio_id or pd.isna(raw_time):
                continue
                
            # Limpiar DNI del formato flotante si aplica (ej: 12345678.0)
            if bio_id.endswith('.0'):
                bio_id = bio_id[:-2]
                
            # Convertir fecha/hora a formato ISO string
            try:
                if isinstance(raw_time, datetime):
                    dt_obj = raw_time
                else:
                    # Intentar parsear strings comunes
                    dt_str = str(raw_time).strip()
                    # Formatos comunes: YYYY-MM-DD HH:MM:SS o DD/MM/YYYY HH:MM:SS
                    for fmt in ('%Y-%m-%d %H:%M:%S', '%d/%m/%Y %H:%M:%S', '%Y/%m/%d %H:%M:%S', '%d-%m-%m %H:%M:%S'):
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
                print(f"[Bot] No se pudo procesar la fecha '{raw_time}' para la fila {index}: {e}")
                
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
        time.sleep(5)
        
        # Buscar botón de descarga o exportación
        print("[Bot] Buscando botón de exportación...")
        export_buttons = driver.find_elements(By.XPATH, "//*[contains(text(), 'Export') or contains(text(), 'Exportar') or contains(text(), 'Descargar')]")
        
        if not export_buttons:
            # Capturar pantalla en caso de no encontrar para debug en la nube
            driver.save_screenshot(os.path.join(current_dir, "zlink_error_debug.png"))
            print("[Bot] Error: No se encontró el botón de exportación. Verifique 'zlink_error_debug.png'.")
            return
            
        print("[Bot] Ejecutando clic en botón de exportación...")
        export_buttons[0].click()
        
        # Esperar a que se procese la descarga del archivo en el directorio temporal
        print("[Bot] Esperando a que termine la descarga del archivo...")
        time.sleep(10)
        
        downloaded_file = get_latest_downloaded_file(download_dir)
        if downloaded_file:
            # Procesar y enviar
            parse_and_upload(downloaded_file)
            
            # Limpiar archivo para evitar duplicados en la próxima corrida
            try:
                os.remove(downloaded_file)
            except:
                pass
        else:
            print("[Bot] Error: No se detectó ningún archivo nuevo en la carpeta de descargas.")
            
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
