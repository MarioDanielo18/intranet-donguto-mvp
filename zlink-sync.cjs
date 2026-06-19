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

    // Accept terms and conditions checkbox (specifically targeting name="agreement")
    console.log("☑️ Aceptando acuerdo de usuario y políticas (agreement)...");
    const agreementCheckboxWrapper = page.locator('.ant-checkbox-wrapper:has(input[name="agreement"]), .ant-checkbox-wrapper:has-text("agree"), label:has-text("agree")').first();
    await agreementCheckboxWrapper.waitFor({ state: 'visible', timeout: 10000 });
    await agreementCheckboxWrapper.click({ force: true });

    // Verify checkbox status in logs
    const isChecked = await page.locator('input[name="agreement"]').isChecked();
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

    console.log("🔍 Buscando tarjeta de informe 'Eventos'...");
    const eventosCard = page.locator('text="Eventos", .el-card:has-text("Eventos"), div:has-text("Eventos")').first();
    await eventosCard.waitFor({ state: 'visible', timeout: 20000 });
    await destroyModals(page);
    console.log("🖱️ Abriendo informe de Eventos...");
    await eventosCard.click({ force: true });

    console.log("⏳ Cargando vista de informe de Eventos...");
    await page.waitForTimeout(8000); // Wait for the table and filters to load

    // Click on search or calculate if required
    console.log("📥 Buscando botón de exportación...");
    const exportButton = page.locator('button:has-text("Exportar"), button:has-text("Export"), .el-button:has-text("Export"), .el-button:has-text("Exportar")').first();
    await exportButton.waitFor({ state: 'visible', timeout: 20000 });

    console.log("⏳ Iniciando la descarga del archivo de marcaciones...");
    await destroyModals(page);
    const [ download ] = await Promise.all([
      page.waitForEvent('download', { timeout: 45000 }),
      exportButton.click({ force: true })
    ]);

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
