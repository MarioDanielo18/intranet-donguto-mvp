const { chromium } = require('playwright');
const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read configuration from environment variables
const ZLINK_EMAIL = process.env.ZLINK_EMAIL;
const ZLINK_PASSWORD = process.env.ZLINK_PASSWORD;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!ZLINK_EMAIL || !ZLINK_PASSWORD || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Error: Faltan variables de entorno esenciales (ZLINK_EMAIL, ZLINK_PASSWORD, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Helper to destroy any popup modals blocking clicks
const destroyModals = async (page) => {
  try {
    await page.evaluate(() => {
      const selectors = [
        '.ant-modal-root', '.ant-modal-wrap', '.ant-modal-mask', '.ant-modal',
        '.modal-backdrop', '.modal', '.fade', '.show',
        '[class*="modal"]', '[class*="popup"]', '[class*="dialog"]', '[class*="mask"]'
      ];
      selectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => el.remove());
        } catch (e) {}
      });
      document.body.style.pointerEvents = 'auto';
      document.body.style.overflow = 'auto';
    });
  } catch (e) {
    console.warn("⚠️ Advertencia: No se pudieron eliminar los modales:", e);
  }
};

(async () => {
  console.log("🚀 Iniciando navegador virtual Chromium...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    acceptDownloads: true
  });
  const page = await context.newPage();

  try {
    console.log("🌐 Navegando a ZKBio Zlink...");
    await page.goto('https://zlink.minervaiot.com/', { waitUntil: 'networkidle', timeout: 60000 });

    console.log("📝 Rellenando credenciales de inicio de sesión...");
    
    // Find username/email input
    const emailInput = page.locator('input[type="text"], input[type="email"], input[placeholder*="correo"], input[placeholder*="Email"], input[placeholder*="usuario"]').first();
    await emailInput.waitFor({ state: 'visible', timeout: 30000 });
    await emailInput.fill(ZLINK_EMAIL);

    // Find password input
    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.fill(ZLINK_PASSWORD);

    console.log("⏳ Esperando que la página esté estable e interactiva...");
    await page.waitForTimeout(2500);

    // Accept terms and conditions checkbox (specifically targeting name="agreement")
    console.log("☑️ Aceptando acuerdo de usuario y políticas (agreement)...");
    const inputLocator = page.locator('input[name="agreement"]').first();
    const checkboxWrapper = page.locator('.ant-checkbox-wrapper:has(input[name="agreement"])').first();
    const checkboxSquare = page.locator('.ant-checkbox-wrapper:has(input[name="agreement"]) .ant-checkbox-inner').first();

    await inputLocator.waitFor({ state: 'attached', timeout: 20000 });
    
    // Destroy modals/overlays early to clear pointer-event blocks before clicking
    await destroyModals(page).catch(() => {});
    
    let isChecked = false;
    for (let attempt = 1; attempt <= 5; attempt++) {
      isChecked = await inputLocator.isChecked();
      if (isChecked) {
        console.log(`✅ El checkbox ya está marcado (Intento ${attempt}).`);
        break;
      }
      
      console.log(`☑️ Intentando marcar checkbox (Intento ${attempt}/5)...`);
      
      // Attempt 1: Call input.click() in JS page context (bypasses overlays and layouts, triggers event handlers cleanly)
      console.log("   👉 Intentando input.click() programático...");
      await page.evaluate(() => {
        try {
          const input = document.querySelector('input[name="agreement"]');
          if (input && !input.checked) {
            input.click();
          }
        } catch (e) {
          console.error("Error en input.click() programático:", e);
        }
      }).catch(() => {});
      isChecked = await inputLocator.isChecked();
      if (isChecked) break;

      // Attempt 2: React property tracker update (backup programmatic set without double-toggling via click dispatch)
      console.log("   👉 Intentando setter de prototipo React y change event...");
      await page.evaluate(() => {
        try {
          const input = document.querySelector('input[name="agreement"]');
          if (input && !input.checked) {
            const checkedDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'checked');
            if (checkedDescriptor && checkedDescriptor.set) {
              checkedDescriptor.set.call(input, true);
            } else {
              input.checked = true;
            }
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        } catch (e) {
          console.error("Error en React property setter:", e);
        }
      }).catch(() => {});
      isChecked = await inputLocator.isChecked();
      if (isChecked) break;

      // Attempt 3: Click on the inner styled checkbox square
      console.log("   👉 Intentando click en el cuadro del checkbox (.ant-checkbox-inner)...");
      await checkboxSquare.click({ timeout: 3000 }).catch(() => {});
      isChecked = await inputLocator.isChecked();
      if (isChecked) break;

      // Attempt 4: Standard Playwright click on wrapper label
      console.log("   👉 Intentando click en el wrapper label...");
      await checkboxWrapper.click({ timeout: 3000 }).catch(() => {});
      isChecked = await inputLocator.isChecked();
      if (isChecked) break;

      // Attempt 5: Playwright check on input
      console.log("   👉 Intentando .check() de Playwright...");
      await inputLocator.check({ force: true, timeout: 3000 }).catch(() => {});
      isChecked = await inputLocator.isChecked();
      if (isChecked) break;
      
      // Wait a bit before next attempt
      await page.waitForTimeout(1500);
    }

    console.log("Checkbox marked status:", isChecked ? "✅ Checked" : "❌ Unchecked");
    await page.waitForTimeout(1000);

    // Click submit button
    const loginButton = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Iniciar"), button:has-text("Login"), .login-form-button').first();
    await destroyModals(page);
    console.log("🖱️ Presionando botón de inicio de sesión...");
    await loginButton.click({ force: true });

    console.log("⏳ Esperando redirección tras inicio de sesión...");
    // Wait for the URL to change to indicate successful login (must NOT be /login or /user/login)
    await page.waitForURL(url => {
      const u = url.href.toLowerCase();
      return u.includes('zlink.minervaiot.com') && !u.endsWith('/login') && !u.includes('/user/login');
    }, { timeout: 30000 }).catch(async (e) => {
      console.error("❌ Error de inicio de sesión: No se redirigió fuera de la página de login.");
      
      // Look for error alerts on the page
      try {
        const pageText = await page.innerText('body');
        console.log("\n--- CONTENIDO DE LA PÁGINA DE ERROR ---");
        console.log(pageText.slice(0, 1500));
        console.log("----------------------------------------\n");
      } catch (innerErr) {}

      // Dump raw HTML of the login form
      try {
        const formHtml = await page.evaluate(() => {
          const form = document.querySelector('form') || document.querySelector('.login-form') || document.querySelector('[class*="login"]') || document.body;
          return form.outerHTML;
        });
        console.log("\n--- HTML DEL FORMULARIO DE INGRESO ---");
        console.log(formHtml.slice(0, 5000));
        console.log("---------------------------------------\n");
      } catch (innerErr) {}
      
      throw new Error("Inicio de sesión fallido. Verifica tus secretos ZLINK_EMAIL y ZLINK_PASSWORD.");
    });
    await page.waitForTimeout(5000); // Give the dashboard some time to load cookies and session

    console.log("📊 Navegando directamente a la pantalla de Informes...");
    await page.goto('https://zlink.minervaiot.com/zkbio_att/attendance/report', { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(5000);

    // Check if we are on the reports page, otherwise screenshot
    const currentUrl = page.url();
    console.log("Página actual:", currentUrl);

    console.log("🔍 Buscando tarjeta de informe...");
    let eventosCard = null;
    const mainContent = page.locator('main, .ant-layout-content, .main-content, #content, [class*="content"]').first();
    
    // Check if mainContent exists and contains matching elements
    let hasMainContent = false;
    try {
      if (await mainContent.count() > 0) {
        const testLocator = mainContent.locator('div, span, p, a, button')
          .filter({ hasText: /^(Transaction|Transactions|Eventos|Events)$/i })
          .filter({ visible: true });
        if (await testLocator.count() > 0) {
          console.log("🔍 Tarjeta encontrada dentro del contenedor principal.");
          eventosCard = testLocator.first();
          hasMainContent = true;
        }
      }
    } catch (e) {
      console.warn("Advertencia al buscar en mainContent:", e);
    }

    if (!hasMainContent) {
      console.log("🔍 Contenedor principal no disponible o vacío. Buscando en toda la página (fallback)...");
      eventosCard = page.locator('div, span, p, a, button')
        .filter({ hasText: /^(Transaction|Transactions|Eventos|Events)$/i })
        .filter({ visible: true })
        .first();
    }

    await eventosCard.waitFor({ state: 'visible', timeout: 20000 }).catch(async (e) => {
      console.error("❌ Error al esperar la tarjeta de Eventos:", e);
      try {
        const bodyText = await page.innerText('body');
        console.log("\n--- CONTENIDO DE TEXTO DE LA PÁGINA DE INFORMES ---");
        console.log(bodyText.slice(0, 3000));
        console.log("---------------------------------------------------\n");
      } catch (innerErr) {}
      
      try {
        const htmlContent = await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll('a, button, [class*="card"], [class*="menu"], h1, h2, h3, h4, h5, div[class*="item"]'));
          return elements.map(el => `<${el.tagName.toLowerCase()} class="${el.className}">${(el.innerText || el.textContent || '').trim().slice(0, 100)}</${el.tagName.toLowerCase()}>`).join('\n');
        });
        console.log("\n--- ELEMENTOS INTERACTIVOS Y MENÚS EN LA PÁGINA ---");
        console.log(htmlContent.slice(0, 3000));
        console.log("-------------------------------------------\n");
      } catch (innerErr) {}
      
      throw e;
    });
    await destroyModals(page);
    console.log("🖱️ Abriendo informe de Eventos...");
    await eventosCard.click({ force: true });

    console.log("⏳ Cargando vista de informe de Eventos...");
    await page.waitForTimeout(8000); // Wait for the table and filters to load

    // Click on search or calculate if required
    console.log("📥 Buscando botón de exportación...");
    const exportButton = page.locator('button:has-text("Exportar"), button:has-text("Export"), .el-button:has-text("Export"), .el-button:has-text("Exportar")').first();
    await exportButton.waitFor({ state: 'visible', timeout: 20000 });

    console.log("⏳ Solicitando generación del archivo de marcaciones (Export)...");
    await destroyModals(page);
    await exportButton.click({ force: true });
    
    // Give the server a moment to register the task and load the File Center page
    console.log("⏳ Esperando navegación al Centro de Archivos (File Center)...");
    await page.waitForTimeout(5000);
    
    let download;
    try {
      let downloadButton = null;
      let downloadUrl = page.url();
      console.log("Página del Centro de Archivos:", downloadUrl);
      
      // We will poll the File Center table up to 12 times (60 seconds total)
      for (let attempt = 1; attempt <= 12; attempt++) {
        console.log(`🔍 Buscando botón de descarga en File Center (Intento ${attempt}/12)...`);
        
        // Look for a download link/button in the table (e.g. text "Download", "Descargar", or an ant-btn with download text)
        downloadButton = page.locator('button:has-text("Download"), button:has-text("Descargar"), a:has-text("Download"), a:has-text("Descargar"), .ant-btn:has-text("Download"), .ant-btn:has-text("Descargar")').first();
        
        if (await downloadButton.count() > 0 && await downloadButton.isVisible()) {
          console.log("✅ ¡Botón de descarga encontrado!");
          break;
        }
        
        // Check current page status for logging
        const pageText = await page.innerText('body');
        if (pageText.includes('No data') || pageText.includes('Sin datos') || pageText.includes('No hay datos')) {
          console.log("   ⚠️ Aún no hay datos en el listado de exportación. Esperando...");
        } else if (pageText.includes('Generating') || pageText.includes('Generando') || pageText.includes('Processing') || pageText.includes('En proceso')) {
          console.log("   ⏳ El archivo se está generando en el servidor. Esperando...");
        } else {
          console.log("   ❓ La tarea no se visualiza o el estado es desconocido. Esperando...");
        }
        
        await page.waitForTimeout(5000);
        
        // Reload the page to refresh the File Center list
        console.log("   🔄 Recargando la página para actualizar el Centro de Archivos...");
        await page.reload({ waitUntil: 'networkidle' }).catch(() => {});
      }

      if (!downloadButton || await downloadButton.count() === 0) {
        throw new Error("No se pudo generar o encontrar el archivo de descarga en el Centro de Archivos en 60 segundos.");
      }

      console.log("📥 Iniciando descarga física del archivo...");
      const downloadPromise = page.waitForEvent('download', { timeout: 45000 });
      await downloadButton.click({ force: true });
      download = await downloadPromise;
    } catch (e) {
      console.error("❌ Error al esperar la descarga en el Centro de Archivos:", e);
      try {
        const bodyText = await page.innerText('body');
        console.log("\n--- CONTENIDO DE TEXTO DE LA PÁGINA AL TIEMPO DE LA FALLA ---");
        console.log(bodyText.slice(0, 3000));
        console.log("---------------------------------------------------------------\n");
      } catch (innerErr) {}
      
      try {
        const modalsHtml = await page.evaluate(() => {
          const modals = Array.from(document.querySelectorAll('.ant-modal, .el-dialog, [class*="modal"], [class*="dialog"], [class*="popup"], [class*="message"], .ant-notification, .el-notification'));
          return modals.map(m => `<div class="${m.className}">${(m.innerText || m.textContent || '').trim()}</div>`).join('\n');
        });
        console.log("\n--- MODALES / DIÁLOGOS DETECTADOS ---");
        console.log(modalsHtml || "Ningún modal detectado.");
        console.log("-------------------------------------\n");
      } catch (innerErr) {}

      try {
        const allButtons = await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button, a.el-button, a.ant-btn'));
          return btns.map(b => `<button class="${b.className}">${(b.innerText || b.textContent || '').trim()}</button>`).join('\n');
        });
        console.log("\n--- BOTONES DISPONIBLES EN LA PÁGINA ---");
        console.log(allButtons || "Ningún botón detectado.");
        console.log("----------------------------------------\n");
      } catch (innerErr) {}
      
      throw e;
    }

    const downloadPath = path.join(__dirname, 'temp_events.xlsx');
    await download.saveAs(downloadPath);
    console.log("✅ Archivo descargado exitosamente en:", downloadPath);

    // Read download content
    if (!fs.existsSync(downloadPath)) {
      throw new Error("El archivo descargado no existe en el disco.");
    }

    const workbook = XLSX.readFile(downloadPath);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: null });

    console.log(`📊 Se leyeron ${rows.length} filas del archivo excel.`);

    if (rows.length === 0) {
      console.log("⚠️ El informe no contiene marcaciones. Terminando proceso.");
      await browser.close();
      process.exit(0);
    }

    // Smart Column mapping
    const keys = Object.keys(rows[0]);
    const findKey = (patterns) => {
      return keys.find(k => {
        const lowerK = String(k).toLowerCase().trim();
        return patterns.some(p => lowerK.includes(p));
      });
    };

    const idKey = findKey(['dni', 'biometric_id', 'personal_id', 'user_id', 'no.', 'no', 'código', 'codigo', 'code', 'id', 'documento', 'número de personal', 'numero de personal', 'colaborador', 'usuario']);
    const dateTimeKey = findKey(['fecha/hora', 'fechayhora', 'timestamp', 'punch_time', 'punchtime', 'time', 'datetime', 'date_time', 'marcación', 'marcacion', 'fecha y hora', 'reloj', 'registro']);
    const dateKey = findKey(['fecha', 'date', 'día', 'dia']);
    const timeKey = findKey(['hora', 'time', 'tiempo']);

    console.log("⚙️ Mapeo de columnas detectado:", { idKey, dateTimeKey, dateKey, timeKey });

    if (!idKey) {
      throw new Error("No se pudo identificar la columna de DNI/Código en el archivo descargado. Encabezados: " + keys.join(', '));
    }

    const parseExcelSerialDate = (serial) => {
      const utc_days = Math.floor(serial - 25569);
      const utc_value = utc_days * 86400;
      const date_info = new Date(utc_value * 1000);
      const fractional_day = serial - Math.floor(serial) + 0.0000001;
      let total_seconds = Math.floor(86400 * fractional_day);
      const seconds = total_seconds % 60;
      total_seconds -= seconds;
      const hours = Math.floor(total_seconds / 3600);
      const minutes = Math.floor(total_seconds / 60) % 60;
      return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
    };

    const punchesToSave = [];
    rows.forEach((row, idx) => {
      const bioIdRaw = row[idKey];
      if (bioIdRaw === undefined || bioIdRaw === null) return;
      const biometricId = String(bioIdRaw).trim();
      if (!biometricId) return;

      let punchTimestamp = null;

      if (dateTimeKey && row[dateTimeKey]) {
        const val = row[dateTimeKey];
        if (typeof val === 'number') {
          punchTimestamp = parseExcelSerialDate(val);
        } else {
          punchTimestamp = new Date(val);
        }
      } else {
        const dVal = row[dateKey];
        const tVal = row[timeKey];
        if (dVal && tVal) {
          let datePart = '';
          let timePart = '';

          if (typeof dVal === 'number') {
            const parsedD = parseExcelSerialDate(dVal);
            datePart = parsedD.toISOString().split('T')[0];
          } else {
            datePart = String(dVal).trim();
          }

          if (typeof tVal === 'number') {
            const parsedT = parseExcelSerialDate(tVal);
            timePart = parsedT.toTimeString().split(' ')[0];
          } else {
            timePart = String(tVal).trim();
          }

          if (datePart.includes('/')) {
            const parts = datePart.split('/');
            if (parts.length === 3) {
              if (parts[0].length === 4) {
                datePart = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
              } else {
                datePart = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
              }
            }
          }

          if (timePart.split(':').length === 2) {
            timePart = `${timePart}:00`;
          }

          punchTimestamp = new Date(`${datePart}T${timePart}`);
        }
      }

      if (!punchTimestamp || isNaN(punchTimestamp.getTime())) return;

      const timestampIso = punchTimestamp.toISOString();
      const punchId = `AUTO-${biometricId}-${punchTimestamp.getTime()}`;

      punchesToSave.push({
        punch_id: punchId,
        biometric_id: biometricId,
        timestamp: timestampIso,
        device_id: 'ZLINK-AUTO-SYNC',
        device_name: 'ZKBio Zlink Auto-Sync'
      });
    });

    console.log(`📝 Total marcaciones válidas procesadas: ${punchesToSave.length}`);

    if (punchesToSave.length > 0) {
      console.log(`📤 Subiendo marcaciones a Supabase...`);
      const { data, error } = await supabase
        .from('asistencia_biometrica')
        .upsert(punchesToSave, { onConflict: 'punch_id' });

      if (error) throw error;
      console.log(`✅ ¡Sincronización en la nube completada! Se guardaron ${punchesToSave.length} marcaciones.`);
    } else {
      console.log("⚠️ No se encontraron marcaciones válidas en el archivo.");
    }

    // Cleanup temp file
    try {
      fs.unlinkSync(downloadPath);
    } catch (e) {}

  } catch (err) {
    console.error("❌ Error catastrófico en la ejecución:", err);
    
    // Save screenshot for debugging
    try {
      const screenshotPath = path.join(__dirname, 'error_screenshot.png');
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log("📸 Captura de pantalla de error guardada en:", screenshotPath);
    } catch (e) {
      console.error("No se pudo tomar la captura de pantalla de error:", e);
    }
    
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
