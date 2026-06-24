import React, { useState, useEffect } from 'react';
import SensoryProfile from './SensoryProfile';
import CartaDigital from './CartaDigital';

const MANUALS_BY_DAY = {
  D1: {
    title: 'Manual de Identidad de la Marca y Cultura Don Guto',
    codigo: 'DG-MAN-D1',
    sections: [
      {
        subtitle: '1. Origen e Historia',
        content: 'Don Guto Coffee Company nació con la convicción de valorizar el esfuerzo del caficultor peruano. Nuestro café de especialidad proviene directamente de parcelas seleccionadas de Cajamarca (Jaén y San Ignacio), cultivadas a más de 1600 msnm. Cada grano es el resultado de un riguroso comercio justo y de prácticas de cultivo sostenible.'
      },
      {
        subtitle: '2. Misión y Visión',
        content: 'Misión: Conectar la riqueza y esfuerzo del origen cajamarquino con la taza perfecta, brindando una experiencia sensorial memorable y hospitalaria en cada visita.\nVisión: Liderar el mercado de cafeterías de especialidad en el Perú, siendo reconocidos por la consistencia de nuestra calibración y la calidez de nuestro servicio.'
      },
      {
        subtitle: '3. Reglamento Operativo e Higiene',
        content: '• Puntualidad Estricta: El ingreso al turno debe registrarse 10 minutos antes de la hora programada con el uniforme completo.\n• Higiene de Manos: Lavado y desinfección obligatoria cada 20 minutos y después de cada cambio de actividad.\n• Uniforme Oficial: Polo institucional limpio, mandil de cuero colocado correctamente, calzado cerrado antideslizante, cabello recogido y uso estricto de gorra o cofia. Queda prohibido el uso de anillos, pulseras o esmalte de uñas en barra o cocina.'
      }
    ]
  },
  D2: {
    title: 'Estaciones de Barra, Menú y Visita Técnica',
    codigo: 'DG-MAN-D2',
    sections: [
      {
        subtitle: '1. Arquitectura de la Barra',
        content: 'Nuestra barra de espresso está equipada con tecnología de punta para garantizar la consistencia:\n• Máquina La Marzocco (Linea PB o KB90): Opera a una presión de caldera de 9 bar y temperatura constante de 93.3°C.\n• Molinos Mahlkönig E65S Grind-by-Weight: Dosificadores de alta precisión para molienda bajo demanda.\n• Compactador Puqpress: Asegura un apisonamiento (tamping) perfectamente nivelado y a presión constante de 15 kg.'
      },
      {
        subtitle: '2. El Menú de Don Guto',
        content: '• Espresso y Americano: Concentraciones puras de café.\n• Bebidas de Leche: Macchiato, Cortado, Flat White, Cappuccino y Latte, variando únicamente en volumen de taza y proporción de leche microespumada.\n• Bebidas Especiales y Refrescantes: Cold brew infusionado por 16 horas en frío, jarabes artesanales y refrescantes de la casa.\n• Métodos Filtrados: V60, Chemex y Aeropress, calibrados con agua a 90°C-92°C.'
      }
    ]
  },
  D3: {
    title: 'Estudio Autónomo de Recetas y Manuales',
    codigo: 'DG-MAN-D3',
    sections: [
      {
        subtitle: '1. Receta del Espresso de la Casa (Cajamarca)',
        content: 'La calibración diaria de nuestro espresso debe respetar los siguientes parámetros:\n• Dosis de Café Seco (In): 18.0 gramos (tolerancia de +/- 0.1g).\n• Rendimiento en Líquido (Yield / Out): 36.0g a 39.5g en taza.\n• Tiempo de Extracción: 25 a 29 segundos.\n• Ratio de Extracción: 1:2.0 a 1:2.2.'
      },
      {
        subtitle: '2. Estándares de Texturización de Leche',
        content: '• Temperatura de Servicio: 60°C a 65°C. La leche nunca debe superar los 70°C, ya que se queman sus azúcares naturales (lactosa) y altera el sabor.\n• Calidad de Crema: Microespuma elástica, densa y brillante, sin burbujas visibles en superficie. Espesor de crema sugerido: 0.5 cm para Latte y 1 cm para Cappuccino.'
      },
      {
        subtitle: '3. Rotulado y Tiempos de Vida Útil',
        content: 'Todo insumo preparado debe llevar etiqueta de rotulado con: Nombre de insumo, fecha de preparación, hora, iniciales del colaborador y fecha de vencimiento. Tiempos máximos de vida útil:\n• Jarabes Simples/Saborizados: 7 días en refrigeración.\n• Fudge y Salsa de Chocolate: 5 días en refrigeración.\n• Coulis de Fresa: 3 días en refrigeración.'
      }
    ]
  },
  D4: {
    title: 'Evaluación Teórica Aprobatoria',
    codigo: 'DG-MAN-D4',
    sections: [
      {
        subtitle: '1. Estructura y Temarios Clave',
        content: 'La evaluación teórica consta de 20 preguntas que evalúan:\n• Teoría básica del café de especialidad (procesos de lavado, natural, variedades).\n• Parámetros de calibración (dosis, yield, tiempos y resolución de problemas de extracción).\n• Estándares de servicio al cliente de Don Guto y secuencia de hospitalidad.\n• Protocolos de limpieza profunda de maquinaria de barra con químicos certificados (Pulycaff).'
      },
      {
        subtitle: '2. Instrucciones para la Aprobación',
        content: 'El examen se realiza de manera virtual. Requiere una calificación mínima aprobatoria del 85% (17/20 respuestas correctas). En caso de no alcanzar la nota, el colaborador tiene derecho a una sola retroalimentación por parte del supervisor y una segunda oportunidad de evaluación antes de poder ingresar a realizar prácticas guiadas en barra.'
      }
    ]
  },
  D5: {
    title: 'Día Sombra I: Soporte y Flujo de Barra',
    codigo: 'DG-MAN-D5',
    sections: [
      {
        subtitle: '1. El Rol de Sombra (Shadowing)',
        content: 'Durante tu primer turno de 8 horas, tu función es observar de manera atenta y pasiva la dinámica operativa de un Barista Senior. Analiza cómo gestiona las comandas múltiples, la velocidad de preparación y la comunicación verbal y corporal con el equipo de salón y el cliente.'
      },
      {
        subtitle: '2. Labores de Soporte Inmediato',
        content: 'Aunque no operarás directamente la máquina de espresso, serás el soporte clave de la barra:\n• Abastecimiento de vasos para llevar, tapas, servilletas y cucharitas.\n• Secado y pulido minucioso del menaje de vidrio y cerámica.\n• Limpieza y desinfección constante de mesas desocupadas del salón.\n• Rotulado de insumos frescos y ordenamiento del stock en visicooler.'
      }
    ]
  },
  D6: {
    title: 'Día Sombra II: Práctica Técnica Guiada',
    codigo: 'DG-MAN-D6',
    sections: [
      {
        subtitle: '1. Calibración en Tiempo Real',
        content: 'Aprenderás a ajustar la molienda del café de Cajamarca según factores ambientales (humedad y temperatura). Si el café sale muy rápido y agrio (sub-extracción), ajustarás el molino a una molienda más fina. Si gotea muy lento y resulta amargo (sobre-extracción), ajustarás a molienda más gruesa.'
      },
      {
        subtitle: '2. Distribución y Apisonado (Tamping)',
        content: 'Práctica de la técnica de distribución uniforme del café molido en el porta-filtro. Se realiza el tamping aplicando presión corporal nivelada en ángulo de 90° para evitar la formación de canalizaciones (zonas donde el agua pasa preferentemente y extrae mal el café).'
      },
      {
        subtitle: '3. Fundamentos de Latte Art',
        content: 'Introducción al vertido de leche microespumada. Práctica de la técnica de caída (distancia y flujo) para crear una base de crema perfecta, seguida de la aproximación y vertido rápido para dibujar figuras clásicas (corazón y roseta) en tazas de cappuccino y latte.'
      }
    ]
  },
  D7: {
    title: 'Día de Prueba: Operación Autónoma',
    codigo: 'DG-MAN-D7',
    sections: [
      {
        subtitle: '1. Rúbrica y Criterios de Evaluación',
        content: 'El supervisor evaluará tu desempeño autónomo de 8 horas en barra bajo los siguientes criterios:\n• Habilidad Técnica: Consistencia en la calibración y preparación de bebidas de leche.\n• Velocidad de Servicio: Capacidad de preparar comandas de hasta 4 bebidas simultáneas en menos de 5 minutos durante la hora punta.\n• Higiene: Limpieza inmediata del vaporizador tras cada uso, mantenimiento del counter seco e impecable.\n• Hospitalidad: Sonreír al cliente, explicar brevemente el origen de Cajamarca y despedir amablemente.'
      },
      {
        subtitle: '2. Gestión Completa del Turno',
        content: 'Debes demostrar autonomía en todas las fases:\n• Apertura y calibración sensorial inicial.\n• Registro de inventarios y control de stock.\n• Preparación de bebidas del menú oficial.\n• Cierre completo de estación (lavado de grupos con Pulycaff, limpieza de tolvas y remojo de trapos).'
      }
    ]
  },
  D8: {
    title: 'Firma de Contrato y Bienvenida Oficial',
    codigo: 'DG-MAN-D8',
    sections: [
      {
        subtitle: '1. Retroalimentación de la Prueba',
        content: 'Reunión personalizada de 30 minutos con el Supervisor y Administrador. Se analizan los resultados de la prueba práctica del Día 7, se destacan tus fortalezas operativas y se definen oportunidades de mejora específicas para tu desarrollo dentro de la barra de Don Guto.'
      },
      {
        subtitle: '2. Entrega del Kit y Asignación de Turnos',
        content: '• Asignación de horarios semanales definitivos de acuerdo a la disponibilidad y necesidades de la tienda.\n• Entrega física del kit de uniformes de Don Guto Coffee Company: 2 polos corporativos de algodón y 1 mandil de cuero premium ajustable.'
      },
      {
        subtitle: '3. Firma Formal del Contrato',
        content: 'Revisión y firma del contrato de trabajo formal con el detalle de beneficios sociales, vacaciones y responsabilidades. ¡Bienvenido oficialmente al equipo de Don Guto, comprometidos con hacer de cada taza una obra de arte!'
      }
    ]
  }
};


const STORE_WIFI_IPS = {
  'Barranco': '200.121.45.67',
  'Miraflores': '190.235.88.99',
  'San Isidro': '181.65.12.34'
};

export default function ColaboradorDashboard({
  user,
  checklists,
  cleaningTasks,
  trainingRoute,
  onSaveTask,
  onSaveCleaning,
  onApproveTrainingDay,
  arrivalLogs = [],
  onClockIn,
  incidents = [],
  onAddIncident,
  biometricDevices = [],
  onBiometricScan,
  activeTab,
  setActiveTab,
}) {
  const [bioScanState, setBioScanState] = useState('idle'); // 'idle' | 'scanning' | 'verifying' | 'success' | 'error'
  const [bioFeedback, setBioFeedback] = useState('Por favor, coloque su dedo en el lector biométrico.');
  const [bioProgress, setBioProgress] = useState(0);
  const [bioDevice, setBioDevice] = useState('');

  // Native Camera Change Handler for Checklist Evidence
  const handleNativeCameraChange = (e, taskId) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      // Send base64 data to parent to save in state and mark task completed
      onSaveTask(taskId, true, reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Auto-select device based on user's store
  useEffect(() => {
    if (biometricDevices && biometricDevices.length > 0) {
      const match = biometricDevices.find(d => d.store === user.store && d.status === 'Online');
      if (match) {
        setBioDevice(match.id);
      } else {
        setBioDevice(biometricDevices[0].id);
      }
    }
  }, [biometricDevices, user.store]);

  const triggerFingerprintScan = () => {
    if (bioScanState !== 'idle') return;
    if (!bioDevice) {
      setBioFeedback('Error: No se encontró ningún dispositivo biométrico activo.');
      return;
    }

    setBioScanState('scanning');
    setBioFeedback('Leyendo huella dactilar... Mantenga su dedo sobre el escáner.');
    setBioProgress(0);

    let progress = 0;
    const scanInterval = setInterval(() => {
      progress += 10;
      setBioProgress(progress);
      if (progress >= 100) {
        clearInterval(scanInterval);
        
        setBioScanState('verifying');
        setBioFeedback('Verificando coincidencia en el servidor biométrico...');
        
        setTimeout(() => {
          if (onBiometricScan) {
            const res = onBiometricScan(user.username, bioDevice);
            if (res && res.success) {
              setBioScanState('success');
              setBioFeedback(`¡Identidad Verificada! Bienvenido, ${user.name}. Asistencia registrada.`);
              setTimeout(() => {
                setBioScanState('idle');
                setBioFeedback('Por favor, coloque su dedo en el lector biométrico.');
              }, 3000);
            } else {
              setBioScanState('error');
              setBioFeedback(res ? res.message : 'Error en la verificación biométrica.');
              setTimeout(() => {
                setBioScanState('idle');
                setBioFeedback('Por favor, coloque su dedo en el lector biométrico.');
              }, 3000);
            }
          } else {
            setBioScanState('success');
            setBioFeedback('¡Identidad Verificada (Modo Demo)! Asistencia registrada.');
            setTimeout(() => {
              setBioScanState('idle');
              setBioFeedback('Por favor, coloque su dedo en el lector biométrico.');
            }, 3000);
          }
        }, 1200);
      }
    }, 150);
  };
  const [shiftType, setShiftType] = useState('APERTURA');
  const [selectedDayMaterial, setSelectedDayMaterial] = useState(null);
  const [cleaningSubTab, setCleaningSubTab] = useState('semanal'); // 'semanal' | 'mensual'

  const [incTitle, setIncTitle] = useState('');
  const [incType, setIncType] = useState('Mantenimiento');
  const [incUrgency, setIncUrgency] = useState('Normal');
  const [incDesc, setIncDesc] = useState('');
  const [incSuccessMsg, setIncSuccessMsg] = useState('');
  const [incidentSubTab, setIncidentSubTab] = useState('instructions'); // 'instructions' | 'register' | 'my_reports' | 'store_history'

  const [userIp, setUserIp] = useState('Obteniendo IP...');
  const [selectedWifi, setSelectedWifi] = useState('external'); // 'Barranco' | 'Miraflores' | 'San Isidro' | 'external'

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setUserIp(data.ip))
      .catch(() => setUserIp('186.20.145.88')); // Fallback mock user IP
  }, []);

  const [currentTime, setCurrentTime] = useState(new Date());
  const defaultExpectedTime = user.role === 'Servicio' ? '08:00 AM' : '07:00 AM';
  const [expectedTime, setExpectedTime] = useState(defaultExpectedTime);
  const [timeMode, setTimeMode] = useState('realtime');
  const [simulatedTime, setSimulatedTime] = useState('07:05');
  const [customExpectedTime, setCustomExpectedTime] = useState('07:00');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const convert24hTo12h = (time24) => {
    if (!time24) return '';
    const [hoursStr, minutesStr] = time24.split(':');
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours.toString().padStart(2, '0')}:${minutesStr} ${ampm}`;
  };

  const [examMode, setExamMode] = useState(false);
  const [examAnswers, setExamAnswers] = useState({});
  const [examTimer, setExamTimer] = useState(2700); // 45 minutes in seconds
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examScore, setExamScore] = useState(0);

  const EXAM_QUESTIONS = [
    {
      id: 1,
      q: '1. ¿Cuál es el ratio de extracción ideal para el espresso de Cajamarca en Don Guto?',
      options: [
        { label: 'A) 1:1 a 1:1.5', val: 'A' },
        { label: 'B) 1:2 a 1:2.2 (18g dry input para 36.0g a 39.5g de líquido)', val: 'B' },
        { label: 'C) 1:3 a 1:3.5', val: 'C' },
        { label: 'D) 1:2.5 a 1:3.0', val: 'D' }
      ],
      correct: 'B'
    },
    {
      id: 2,
      q: '2. ¿Cuál es el rango de tiempo de extracción óptimo para calibrar el espresso?',
      options: [
        { label: 'A) 15 a 20 segundos', val: 'A' },
        { label: 'B) 20 a 25 segundos', val: 'B' },
        { label: 'C) 25 a 29 segundos (tiempo óptimo de taza)', val: 'C' },
        { label: 'D) 30 a 35 segundos', val: 'D' }
      ],
      correct: 'C'
    },
    {
      id: 3,
      q: '3. ¿A qué temperatura se debe texturizar la leche para las bebidas de Don Guto?',
      options: [
        { label: 'A) 50°C a 55°C', val: 'A' },
        { label: 'B) 60°C a 65°C (para mantener el dulzor óptimo de la lactosa)', val: 'B' },
        { label: 'C) 70°C a 75°C', val: 'C' },
        { label: 'D) 80°C a 85°C', val: 'D' }
      ],
      correct: 'B'
    },
    {
      id: 4,
      q: '4. ¿De qué provincias de Cajamarca proviene el café de especialidad de Don Guto?',
      options: [
        { label: 'A) Chota y Cutervo', val: 'A' },
        { label: 'B) Jaén y San Ignacio', val: 'B' },
        { label: 'C) Celendín y Cajabamba', val: 'C' },
        { label: 'D) Contumazá y Hualgayoc', val: 'D' }
      ],
      correct: 'B'
    },
    {
      id: 5,
      q: '5. ¿Cuál es la regla de marcado para los Checklists Diarios (Apertura, Relevo, Cierre)?',
      options: [
        { label: 'A) Se pueden completar en cualquier momento de la semana.', val: 'A' },
        { label: 'B) Se deben completar estrictamente en tiempo real en el día en curso; no se permite marcado retroactivo.', val: 'B' },
        { label: 'C) Solo se marcan los fines de semana.', val: 'C' },
        { label: 'D) Se pueden marcar al día siguiente con justificación.', val: 'D' }
      ],
      correct: 'B'
    },
    {
      id: 6,
      q: '6. ¿Qué químico se utiliza para lavar los grupos y porta-filtros de la máquina de espresso?',
      options: [
        { label: 'A) Detergente común de vajilla', val: 'A' },
        { label: 'B) Cloro/Lejía diluida', val: 'B' },
        { label: 'C) Pulicaff / Pulycaff', val: 'C' },
        { label: 'D) Vinagre blanco con bicarbonato', val: 'D' }
      ],
      correct: 'C'
    },
    {
      id: 7,
      q: '7. ¿Cuánto tiempo dura una salsa de chocolate/fudge artesanal rotulada en refrigeración?',
      options: [
        { label: 'A) 3 días', val: 'A' },
        { label: 'B) 5 días', val: 'B' },
        { label: 'C) 7 días', val: 'C' },
        { label: 'D) 10 días', val: 'D' }
      ],
      correct: 'B'
    },
    {
      id: 8,
      q: '8. ¿Cuánto tiempo dura el coulis de fresa rotulado en refrigeración?',
      options: [
        { label: 'A) 3 días', val: 'A' },
        { label: 'B) 5 días', val: 'B' },
        { label: 'C) 7 días', val: 'C' },
        { label: 'D) 10 días', val: 'D' }
      ],
      correct: 'A'
    },
    {
      id: 9,
      q: '9. ¿Qué sucede si un checklist diario de actividades queda vacío al finalizar la jornada laboral (11:59 PM)?',
      options: [
        { label: 'A) Se traslada automáticamente al día siguiente.', val: 'A' },
        { label: 'B) Se registra como "Falta de Cumplimiento" (0 pts) afectando el expediente.', val: 'B' },
        { label: 'C) No pasa nada, el supervisor lo completa por ti.', val: 'C' },
        { label: 'D) Se puede completar el fin de semana sin penalidad.', val: 'D' }
      ],
      correct: 'B'
    },
    {
      id: 10,
      q: '10. ¿Cuál es el estándar de tiempo de Don Guto para despachar una comanda de 4 bebidas en hora punta?',
      options: [
        { label: 'A) Menos de 3 minutos', val: 'A' },
        { label: 'B) Menos de 5 minutos', val: 'B' },
        { label: 'C) Menos de 8 minutos', val: 'C' },
        { label: 'D) Menos de 10 minutos', val: 'D' }
      ],
      correct: 'B'
    }
  ];

  const handleGradeExam = () => {
    let correctCount = 0;
    EXAM_QUESTIONS.forEach(q => {
      if (examAnswers[q.id] === q.correct) {
        correctCount++;
      }
    });
    const finalScore = (correctCount / EXAM_QUESTIONS.length) * 100;
    setExamScore(finalScore);
    setExamSubmitted(true);
    
    if (finalScore >= 85) {
      if (onApproveTrainingDay) {
        onApproveTrainingDay(user.username, 'D4', 'Completado');
      }
    } else {
      if (onApproveTrainingDay) {
        onApproveTrainingDay(user.username, 'D4', 'Reprobado');
      }
    }
  };

  useEffect(() => {
    let interval = null;
    if (examMode && !examSubmitted && examTimer > 0) {
      interval = setInterval(() => {
        setExamTimer(prev => prev - 1);
      }, 1000);
    } else if (examTimer === 0 && !examSubmitted) {
      handleGradeExam();
    }
    return () => clearInterval(interval);
  }, [examMode, examSubmitted, examTimer]);

  const handleCloseModal = () => {
    setSelectedDayMaterial(null);
    setExamMode(false);
    setExamAnswers({});
    setExamTimer(2700);
    setExamSubmitted(false);
    setExamScore(0);
  };

  const handleIncidentSubmit = (e) => {
    e.preventDefault();
    if (!incTitle.trim() || !incDesc.trim()) return;

    const newInc = {
      id: `INC-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString(),
      reporterUsername: user.username,
      reporterName: user.name,
      reporterRole: user.role,
      store: user.store,
      type: incType,
      title: incTitle.trim(),
      description: incDesc.trim(),
      urgency: incUrgency,
      status: 'Pendiente',
      adminResponse: '',
      adminResponseAt: '',
      supervisorResponse: '',
      supervisorResponseAt: '',
      resolvedBy: '',
      resolvedAt: ''
    };

    onAddIncident(newInc);
    setIncTitle('');
    setIncDesc('');
    setIncSuccessMsg('¡Incidencia registrada con éxito y notificada al Administrador!');
    setTimeout(() => setIncSuccessMsg(''), 5000);
  };

  const renderIncidentsSection = () => {
    const sortedStoreIncidents = [...(incidents || [])]
      .filter(inc => inc.store === user.store)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const myIncidents = [...(incidents || [])]
      .filter(inc => inc.reporterUsername === user.username || inc.reporterEmail === user.username)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const renderIncidentList = (list, noDataMsg) => {
      if (list.length === 0) {
        return (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-main)', border: '1px dashed var(--border)', borderRadius: '8px' }}>
            {noDataMsg}
          </div>
        );
      }

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '550px', overflowY: 'auto', paddingRight: '5px' }}>
          {list.map(inc => {
            let statusBg = 'var(--bg-main)';
            let statusColor = 'var(--text-muted)';
            
            if (inc.status === 'Pendiente') {
              statusBg = 'var(--warning-light)';
              statusColor = 'var(--warning)';
            } else if (inc.status === 'En Proceso') {
              statusBg = 'var(--primary-light)';
              statusColor = 'var(--primary)';
            } else if (inc.status === 'Escalado') {
              statusBg = 'var(--warning-light)';
              statusColor = '#d97706';
            } else if (inc.status === 'Resuelto') {
              statusBg = 'var(--success-light)';
              statusColor = 'var(--success)';
            }

            const formattedDate = new Date(inc.date).toLocaleString('es-PE', {
              day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
            });

            return (
              <div
                key={inc.id}
                className="card"
                style={{
                  padding: '16px',
                  border: `1px solid ${inc.status === 'Resuelto' ? 'var(--success)' : 'var(--border)'}`,
                  backgroundColor: inc.status === 'Resuelto' ? 'var(--success-light)' : 'var(--bg-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  fontSize: '12.5px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '5px' }}>
                  <div>
                    <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '11px', display: 'block' }}>{inc.id} • {inc.type.toUpperCase()}</span>
                    <strong style={{ fontSize: '13px', color: 'var(--text-main)', display: 'block', marginTop: '2px' }}>{inc.title}</strong>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {inc.urgency === 'Urgente' && (
                      <span style={{ backgroundColor: 'var(--error-light)', color: 'var(--error)', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 800, border: '1px solid var(--error)' }}>🚨 URGENTE</span>
                    )}
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '10px',
                      backgroundColor: statusBg,
                      color: statusColor,
                      fontWeight: 800,
                      fontSize: '9px',
                      border: '1px solid currentColor',
                      textTransform: 'uppercase'
                    }}>
                      {inc.status}
                    </span>
                  </div>
                </div>

                <p style={{ margin: 0, color: 'var(--text-main)', lineHeight: 1.4, fontSize: '12px', backgroundColor: 'rgba(0,0,0,0.02)', padding: '8px 10px', borderRadius: '4px' }}>
                  {inc.description}
                </p>

                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Por: <strong>{inc.reporterName} ({inc.reporterRole})</strong></span>
                  <span>{formattedDate}</span>
                </div>

                {(inc.adminResponse || inc.supervisorResponse || inc.status === 'Resuelto') && (
                  <div style={{
                    borderTop: '1px dashed var(--border)',
                    paddingTop: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    backgroundColor: 'rgba(0,0,0,0.01)',
                    padding: '10px',
                    borderRadius: '6px'
                  }}>
                    {inc.adminResponse ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '11px' }}>💬 Respuesta del Administrador (Sede):</span>
                        <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-main)', lineHeight: 1.4 }}>
                          {inc.adminResponse}
                        </p>
                        <span style={{ fontSize: '9px', color: 'var(--text-muted)', textAlign: 'right' }}>
                          {new Date(inc.adminResponseAt).toLocaleString('es-PE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ) : (
                      inc.status !== 'Resuelto' && (
                        <div style={{ fontSize: '11px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                          ⏳ Esperando respuesta del Administrador de tienda...
                        </div>
                      )
                    )}

                    {inc.supervisorResponse && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', borderTop: inc.adminResponse ? '1px dotted var(--border)' : 'none', paddingTop: inc.adminResponse ? '8px' : 0 }}>
                        <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '11px' }}>👤 Respuesta de Supervisión (General):</span>
                        <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-main)', lineHeight: 1.4 }}>
                          {inc.supervisorResponse}
                        </p>
                        <span style={{ fontSize: '9px', color: 'var(--text-muted)', textAlign: 'right' }}>
                          {new Date(inc.supervisorResponseAt).toLocaleString('es-PE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}

                    {inc.status === 'Resuelto' && (
                      <div style={{
                        marginTop: '5px',
                        padding: '6px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'var(--success-light)',
                        color: 'var(--success)',
                        fontWeight: 700,
                        fontSize: '11px',
                        textAlign: 'center',
                        border: '1px solid var(--success)'
                      }}>
                        ✓ Resuelto por {inc.resolvedBy} el {new Date(inc.resolvedAt).toLocaleDateString('es-PE')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
        <div style={{ borderBottom: '2px solid var(--border)', paddingBottom: '10px' }}>
          <h3 style={{ margin: 0, color: 'var(--primary)' }}>Centro de Reportes & Incidencias ({user.store})</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Reporta fallos mecánicos, insumos faltantes o incidencias en tienda. Solo el Administrador de tu sede y Supervisión verán estos reportes.
          </p>
        </div>

        {/* Sub-Tab Navigation Bar */}
        <div className="card glass" style={{ padding: '0 10px', display: 'flex', gap: '5px', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
          {[
            { id: 'instructions', label: '📖 Instrucciones de Uso' },
            { id: 'register', label: '📝 Registrar Nueva' },
            { id: 'my_reports', label: '👤 Mis Incidencias Generadas' },
            { id: 'store_history', label: '📋 Historial de la Sede' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setIncidentSubTab(tab.id)}
              style={{
                padding: '12px 16px',
                border: 'none',
                borderBottom: incidentSubTab === tab.id ? '3px solid var(--primary)' : '3px solid transparent',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 700,
                color: incidentSubTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {incSuccessMsg && (
          <div style={{
            backgroundColor: 'var(--success-light)',
            color: 'var(--success)',
            padding: '12px 15px',
            borderRadius: '6px',
            border: '1px solid var(--success)',
            fontSize: '13px',
            fontWeight: 'bold',
          }}>
            {incSuccessMsg}
          </div>
        )}

        <div style={{ width: '100%' }}>
          {incidentSubTab === 'instructions' && (
            <div className="card" style={{ padding: '25px', border: '1px solid var(--border)', maxWidth: '750px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--primary)', fontWeight: 800, borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                📖 Guía e Instrucciones de Uso para Reportar Incidencias
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12.5px', lineHeight: 1.5 }}>
                <p style={{ margin: 0 }}>
                  Este módulo permite reportar fallos, carencias o problemas operativos de forma directa al Administrador de tu sede y a la mesa técnica. Por favor, lee atentamente los siguientes estándares para garantizar una atención rápida y eficiente:
                </p>

                {/* Urgency section */}
                <div style={{ padding: '12px 15px', borderRadius: '6px', backgroundColor: 'var(--bg-main)', borderLeft: '4px solid var(--primary)' }}>
                  <strong style={{ color: 'var(--text-main)', fontSize: '13px', display: 'block', marginBottom: '6px' }}>🔴 Niveles de Urgencia:</strong>
                  <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <li>
                      <strong>⚠️ Normal (Impacto leve/moderado)</strong>: Problemas que no detienen la operación de la tienda de forma inmediata. Se atienden en los plazos estándar de mantenimiento o reabastecimiento (ej. focos parpadeando, repisas flojas, requerimiento de útiles de limpieza, desgaste de utensilios).
                    </li>
                    <li>
                      <strong>🚨 Urgente (Impacto crítico/operativo)</strong>: Situaciones que impiden vender o producir de manera correcta, afectando directamente la experiencia del cliente o la seguridad del local. Se atienden con máxima prioridad de forma inmediata (ej. máquina de café espresso rota, campana extractora o cocina inoperativa, corte de luz local, terminales de pago caídos, fugas de gas o agua severas).
                    </li>
                  </ul>
                </div>

                {/* Title standard section */}
                <div style={{ padding: '12px 15px', borderRadius: '6px', backgroundColor: 'var(--bg-main)', borderLeft: '4px solid var(--secondary)' }}>
                  <strong style={{ color: 'var(--text-main)', fontSize: '13px', display: 'block', marginBottom: '6px' }}>📝 Estándar Obligatorio para Títulos:</strong>
                  <p style={{ margin: '0 0 6px 0' }}>
                    Para que la administración identifique de un vistazo el origen y tipo de fallo, debes redactar los títulos siguiendo esta plantilla estándar:
                  </p>
                  <div style={{
                    padding: '8px 12px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(0,0,0,0.03)',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    fontWeight: 700,
                    textAlign: 'center',
                    border: '1px dashed var(--border)',
                    color: 'var(--primary)',
                    marginBottom: '8px'
                  }}>
                    [ÁREA / ESTACIÓN] - [Problema principal resumido]
                  </div>
                  <strong style={{ display: 'block', marginBottom: '4px', fontSize: '11.5px' }}>Ejemplos correctos:</strong>
                  <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                    <li>"BARRA - Fuga de agua en manguera de vapor La Marzocco"</li>
                    <li>"COCINA - Freidora de papas no calienta el aceite"</li>
                    <li>"SALÓN - Tablet de comandas no se conecta al Wi-Fi"</li>
                    <li>"SSHH - Pérdida de agua constante en inodoro de caballeros"</li>
                  </ul>
                </div>
              </div>

              <button 
                onClick={() => setIncidentSubTab('register')}
                className="btn btn-primary" 
                style={{ alignSelf: 'center', padding: '10px 25px', fontSize: '12.5px', marginTop: '10px' }}
              >
                Ir a Registrar Incidencia ✍️
              </button>
            </div>
          )}

          {incidentSubTab === 'register' && (
            <form onSubmit={handleIncidentSubmit} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid var(--border)', maxWidth: '650px', margin: '0 auto' }}>
              <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📝 Formulario de Registro de Incidencia
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Título de Incidencia:</label>
                  <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 600 }}>Formato estándar: [ÁREA] - [Problema]</span>
                </div>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="Ej: [BARRA] - Fuga de agua en manguera de vapor"
                  value={incTitle}
                  onChange={(e) => setIncTitle(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Categoría:</label>
                  <select
                    className="input"
                    value={incType}
                    onChange={(e) => setIncType(e.target.value)}
                    style={{ padding: '9px 12px' }}
                  >
                    <option value="Mantenimiento">🛠️ Mantenimiento</option>
                    <option value="Insumos">📦 Insumos / Stock 86</option>
                    <option value="Operaciones">📋 Operaciones</option>
                    <option value="Otros">❓ Otros / Dudas</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Urgencia:</label>
                  <select
                    className="input"
                    value={incUrgency}
                    onChange={(e) => setIncUrgency(e.target.value)}
                    style={{ padding: '9px 12px' }}
                  >
                    <option value="Normal">⚠️ Normal</option>
                    <option value="Urgente">🚨 Urgente</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Descripción Detallada:</label>
                <textarea
                  required
                  className="input"
                  rows="4"
                  placeholder="Describe qué ocurrió, en qué estación y cuál es el impacto (ej: no podemos preparar jugos frozen, afecta el servicio)..."
                  value={incDesc}
                  onChange={(e) => setIncDesc(e.target.value)}
                  style={{ resize: 'vertical', minHeight: '80px', fontFamily: 'inherit' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px', marginTop: '5px' }}>
                🚀 Enviar Reporte a Administración
              </button>
            </form>
          )}

          {incidentSubTab === 'my_reports' && (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: 'var(--text-main)' }}>
                👤 Mis Incidencias Generadas (Reportadas por Mí)
              </h4>
              {renderIncidentList(myIncidents, 'No has registrado ninguna incidencia personal aún.')}
            </div>
          )}

          {incidentSubTab === 'store_history' && (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: 'var(--text-main)' }}>
                📋 Historial Operativo de la Sede ({user.store})
              </h4>
              {renderIncidentList(sortedStoreIncidents, 'No hay incidencias registradas en esta sede.')}
            </div>
          )}
        </div>
      </div>
    );
  };



  // Calculate weeks of the current month (Monday to Sunday)
  const getWeeksForMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    const weeks = [];
    let currentWeek = [];
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dDate = new Date(year, month, d);
      currentWeek.push(d);
      if (dDate.getDay() === 0 || d === lastDay.getDate()) {
        weeks.push({
          id: `W${weeks.length + 1}`,
          label: `Semana ${weeks.length + 1}`,
          startDay: currentWeek[0],
          endDay: currentWeek[currentWeek.length - 1],
          days: [...currentWeek],
        });
        currentWeek = [];
      }
    }
    return weeks;
  };

  const today = new Date();
  const currentDay = today.getDate();
  const monthWeeks = getWeeksForMonth(today);
  const currentWeekObj = monthWeeks.find(w => w.days.includes(currentDay)) || monthWeeks[0];

  const [selectedWeekId, setSelectedWeekId] = useState(currentWeekObj.id);

  const getAreaName = (role) => {
    if (role === 'Barista') return 'BARRA';
    if (role === 'Cocina') return 'COCINA';
    return 'SALON';
  };

  const area = getAreaName(user.role);

  // Get active checklists
  const activeChecklist = checklists.filter(
    t => t.area === area && t.tipo_turno === shiftType
  );

  const totalTasks = activeChecklist.length;
  const completedTasks = activeChecklist.filter(t => t.completado).length;
  const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Handle file attachment converting to Base64
  const handleFileChange = (e, taskId) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      // Send base64 data to parent to save in state and mark task completed
      onSaveTask(taskId, true, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveEvidence = (e, taskId) => {
    e.stopPropagation(); // prevent triggering task toggle
    onSaveTask(taskId, false, null);
  };

  // Render check buttons and photo uploads
  const renderChecklist = () => {
    if (totalTasks === 0) return <p>No hay tareas configuradas para esta sección.</p>;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} className="animate-fade-in">
        {activeChecklist.map((task) => {
          const hasEvidence = !!task.evidencia;
          return (
            <div
              key={task.id}
              onClick={() => {
                // If it requires photo and has no photo, don't check it directly. Force native camera.
                if (task.requiere_foto && !hasEvidence) {
                  document.getElementById(`camera-input-${task.id}`).click();
                } else {
                  onSaveTask(task.id, !task.completado, task.evidencia);
                }
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: task.completado ? '1px solid var(--success)' : '1px solid var(--border)',
                backgroundColor: task.completado ? 'var(--success-light)' : 'var(--bg-card)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Checked Box */}
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: 'var(--radius-sm)',
                  border: task.completado ? 'none' : '2px solid var(--border)',
                  backgroundColor: task.completado ? 'var(--success)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  flexShrink: 0,
                }}>
                  {task.completado ? '✓' : ''}
                </div>

                {/* Description */}
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-main)' }}>{task.descripcion}</span>
                  {task.requiere_foto && (
                    <span style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      backgroundColor: hasEvidence ? 'var(--success-light)' : 'var(--primary-light)',
                      color: hasEvidence ? 'var(--success)' : 'var(--primary)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      marginLeft: '8px',
                      display: 'inline-block',
                      border: '1px solid currentColor',
                    }}>
                      {hasEvidence ? 'EVIDENCIA CARGADA ✓' : 'FOTO EVIDENCIA REQUERIDA'}
                    </span>
                  )}
                </div>
              </div>

              {/* Photo Capture Container */}
              {task.requiere_foto && (
                <div 
                  onClick={(e) => e.stopPropagation()} // prevent toggle task check on sub-click
                  style={{ marginLeft: '32px', display: 'flex', alignItems: 'center', gap: '15px' }}
                >
                  {/* Hidden native camera input */}
                  <input
                    id={`camera-input-${task.id}`}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: 'none' }}
                    onChange={(e) => handleNativeCameraChange(e, task.id)}
                  />

                  {!hasEvidence ? (
                    <button
                      onClick={() => document.getElementById(`camera-input-${task.id}`).click()}
                      className="btn btn-secondary"
                      style={{
                        padding: '5px 12px',
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        borderStyle: 'solid',
                        borderWidth: '1px',
                        borderColor: 'var(--primary)',
                        color: '#fff',
                        backgroundColor: 'var(--primary)',
                        borderRadius: '4px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      📸 Abrir Cámara del Dispositivo
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ position: 'relative', width: '64px', height: '64px' }}>
                        <img 
                          src={task.evidencia} 
                          alt="Evidencia" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }}
                        />
                        <button
                          onClick={(e) => handleRemoveEvidence(e, task.id)}
                          style={{
                            position: 'absolute',
                            top: '-6px',
                            right: '-6px',
                            backgroundColor: 'var(--error)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            width: '18px',
                            height: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '9px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-sm)',
                          }}
                          title="Eliminar evidencia"
                        >
                          ✕
                        </button>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600 }}>Foto tomada con éxito</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  // Render Cleaning Calendar by Weeks (with future weeks blocked relative to Lima, Peru time)
  const renderCleaningCalendar = () => {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const currentMonthName = monthNames[today.getMonth()];

    const weeklyTasks = cleaningTasks.filter(t => t.frecuencia === 'SEMANAL');
    const monthlyTasks = cleaningTasks.filter(t => t.frecuencia === 'MENSUAL');

    const renderWeeklySubTab = () => {
      const selectedWeekObj = monthWeeks.find(w => w.id === selectedWeekId);
      const isFutureWeek = selectedWeekObj ? currentDay < selectedWeekObj.startDay : false;
      const completedCount = weeklyTasks.filter(t => t.completedDays[selectedWeekId]).length;
      const totalCount = weeklyTasks.length;
      const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '15px', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
            <div>
              <h3 style={{ margin: 0, color: 'var(--secondary)' }}>Cronograma de Limpieza Semanal</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                Registro de tareas de limpieza profunda programadas por semana para el mes de <strong>{currentMonthName} {today.getFullYear()}</strong>.
              </p>
            </div>
            
            {!isFutureWeek && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '250px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Avance {selectedWeekObj?.label}:</span>
                <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--success)', transition: 'width 0.3s ease' }} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--success)' }}>{progress.toFixed(0)}%</span>
              </div>
            )}
          </div>

          {/* Weeks Navigation Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '10px 0' }}>
            {monthWeeks.map((week) => {
              const isCurrent = currentDay >= week.startDay && currentDay <= week.endDay;
              const isFuture = currentDay < week.startDay;
              const isSelected = selectedWeekId === week.id;
              
              const completedCountWeek = weeklyTasks.filter(t => t.completedDays[week.id]).length;
              const totalCountWeek = weeklyTasks.length;
              const weekProgress = totalCountWeek > 0 ? (completedCountWeek / totalCountWeek) * 100 : 0;
              
              let badgeText = '';
              let badgeColor = '';
              
              if (isFuture) {
                badgeText = '🔒 Bloqueada';
                badgeColor = 'var(--text-muted)';
              } else if (currentDay >= week.startDay && currentDay < week.endDay) {
                badgeText = '⏳ Solo Domingo';
                badgeColor = 'var(--text-muted)';
              } else if (currentDay === week.endDay) {
                badgeText = `⚡ Hoy Domingo (${weekProgress.toFixed(0)}%)`;
                badgeColor = '#d97706';
              } else if (weekProgress === 100) {
                badgeText = '✅ 100%';
                badgeColor = 'var(--success)';
              } else {
                badgeText = `❌ ${weekProgress.toFixed(0)}% incompleto`;
                badgeColor = 'var(--error)';
              }
              
              let btnStyle = {
                padding: '10px 16px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              };
              
              if (isSelected) {
                btnStyle = {
                  ...btnStyle,
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  borderColor: 'var(--primary)',
                  boxShadow: 'var(--shadow-sm)'
                };
              } else if (isFuture) {
                btnStyle = {
                  ...btnStyle,
                  backgroundColor: '#f9f9f9',
                  color: '#bbb',
                  borderColor: '#eee',
                };
              } else {
                btnStyle = {
                  ...btnStyle,
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-main)',
                };
              }
              
              return (
                <button
                  key={week.id}
                  onClick={() => setSelectedWeekId(week.id)}
                  style={btnStyle}
                >
                  <span style={{ fontSize: '13px', fontWeight: 700 }}>
                    {week.label} {isCurrent && '📍'}
                  </span>
                  <span style={{ fontSize: '10px', opacity: 0.8 }}>
                    {week.startDay} al {week.endDay} de {currentMonthName.substring(0, 3)}
                  </span>
                  <span style={{ 
                    fontSize: '9.5px', 
                    fontWeight: 800, 
                    color: isSelected ? '#fff' : badgeColor, 
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.04)', 
                    padding: '2px 8px', 
                    borderRadius: '10px', 
                    marginTop: '4px',
                    border: isSelected ? 'none' : `1px solid ${badgeColor}`
                  }}>
                    {badgeText}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Week Status Bar */}
          {(() => {
            const selectedWeek = monthWeeks.find(w => w.id === selectedWeekId);
            if (!selectedWeek) return null;
            const isFuture = currentDay < selectedWeek.startDay;
            const isPast = currentDay > selectedWeek.endDay;
            const isCurrentPendingSunday = currentDay >= selectedWeek.startDay && currentDay < selectedWeek.endDay;
            
            if (isFuture) {
              return (
                <div style={{
                  padding: '12px 15px',
                  borderRadius: '6px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fee2e2',
                  color: '#991b1b',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>🔒 Esta semana está bloqueada porque pertenece al futuro. No puedes registrar tareas por adelantado.</span>
                </div>
              );
            }
            if (isCurrentPendingSunday) {
              return (
                <div style={{
                  padding: '12px 15px',
                  borderRadius: '6px',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #dbeafe',
                  color: '#1e40af',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>🔒 El registro está inhabilitado. De acuerdo a las reglas de Don Guto, las tareas de limpieza profunda semanal solo se pueden marcar el último día de la semana (Domingo {selectedWeek.endDay} de Jun).</span>
                </div>
              );
            }
            if (currentDay === selectedWeek.endDay) {
              return (
                <div style={{
                  padding: '12px 15px',
                  borderRadius: '6px',
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #d1fae5',
                  color: '#065f46',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>⚡ Registro Habilitado. Hoy es Domingo ({selectedWeek.endDay} de Jun). Por favor, marca las tareas de limpieza completadas.</span>
                </div>
              );
            }
            if (isPast) {
              return (
                <div style={{
                  padding: '12px 15px',
                  borderRadius: '6px',
                  backgroundColor: '#fffbeb',
                  border: '1px solid #fef3c7',
                  color: '#b45309',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>⚠️ Esta semana ha finalizado. El registro de limpieza está cerrado y no se pueden modificar las tareas (Historial de Limpieza).</span>
                </div>
              );
            }
            return null;
          })()}

          {/* Checklist for Selected Week */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {weeklyTasks.map((task) => {
              const isCompletedInSelectedWeek = !!task.completedDays[selectedWeekId];
              const selectedWeekObj = monthWeeks.find(w => w.id === selectedWeekId);
              const isLocked = selectedWeekObj ? currentDay !== selectedWeekObj.endDay : true;
              
              return (
                <div
                  key={task.id}
                  onClick={() => {
                    if (isLocked) return;
                    onSaveCleaning(task.id, selectedWeekId, !isCompletedInSelectedWeek);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    border: isCompletedInSelectedWeek ? '1px solid var(--success)' : '1px solid var(--border)',
                    backgroundColor: isCompletedInSelectedWeek 
                      ? 'var(--success-light)' 
                      : isLocked 
                        ? '#fafafa' 
                        : 'var(--bg-card)',
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    opacity: isLocked ? 0.75 : 1,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: isCompletedInSelectedWeek ? 'none' : '2px solid var(--border)',
                    backgroundColor: isCompletedInSelectedWeek ? 'var(--success)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    flexShrink: 0,
                  }}>
                    {isCompletedInSelectedWeek ? '✓' : ''}
                  </div>

                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: isLocked ? 'var(--text-muted)' : 'var(--text-main)', textAlign: 'left' }}>{task.descripcion}</span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      backgroundColor: 'var(--bg-main)',
                      color: 'var(--text-muted)',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      border: '1px solid var(--border)'
                    }}>
                      {task.frecuencia}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    const renderMonthlySubTab = () => {
      const isPastMonth = today.getMonth() > 5 || today.getFullYear() > 2026 || (today.getMonth() === 5 && currentDay > 30);
      const isFutureW5 = currentDay < 29;
      const isW5 = today.getMonth() === 5 && currentDay >= 29 && currentDay <= 30;

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--secondary)' }}>Control de Limpieza Mensual</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
              Estas tareas se realizan únicamente durante la última semana de Junio (del 29 al 30 de Junio) y se bloquean una vez finalizado el mes.
            </p>
          </div>

          {/* Monthly Lock Banners */}
          {isFutureW5 && (
            <div style={{
              padding: '12px 15px',
              borderRadius: '6px',
              backgroundColor: '#fffbeb',
              border: '1px solid #fef3c7',
              color: '#b45309',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>⏳ <strong>Registro Inactivo:</strong> Las tareas de limpieza mensual se habilitarán únicamente a partir del lunes 29 de Junio (Semana 5).</span>
            </div>
          )}

          {isW5 && (
            <div style={{
              padding: '12px 15px',
              borderRadius: '6px',
              backgroundColor: '#ecfdf5',
              border: '1px solid #d1fae5',
              color: '#065f46',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>⚡ <strong>Registro Habilitado:</strong> Por favor, marca las tareas de limpieza mensual que has completado en este turno.</span>
            </div>
          )}

          {isPastMonth && (
            <div style={{
              padding: '12px 15px',
              borderRadius: '6px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fee2e2',
              color: '#991b1b',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>🚨 <strong>Registro Bloqueado ("Ya fue"):</strong> El período para registrar las tareas mensuales de limpieza finalizó el 30 de Junio. No se admiten modificaciones.</span>
            </div>
          )}

          {/* Checklist for Monthly Tasks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {monthlyTasks.map((task) => {
              const isCompletedInW5 = !!task.completedDays['W5'];
              const isLocked = !isW5;

              return (
                <div
                  key={task.id}
                  onClick={() => {
                    if (isLocked) return;
                    onSaveCleaning(task.id, 'W5', !isCompletedInW5);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    border: isCompletedInW5 ? '1px solid var(--success)' : '1px solid var(--border)',
                    backgroundColor: isCompletedInW5 
                      ? 'var(--success-light)' 
                      : isLocked 
                        ? '#fafafa' 
                        : 'var(--bg-card)',
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    opacity: isLocked ? 0.75 : 1,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: isCompletedInW5 ? 'none' : '2px solid var(--border)',
                    backgroundColor: isCompletedInW5 ? 'var(--success)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    flexShrink: 0,
                  }}>
                    {isCompletedInW5 ? '✓' : ''}
                  </div>

                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: isLocked ? 'var(--text-muted)' : 'var(--text-main)', textAlign: 'left' }}>{task.descripcion}</span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      backgroundColor: isCompletedInW5 ? 'var(--success-light)' : isPastMonth ? 'var(--error-light)' : 'var(--bg-main)',
                      color: isCompletedInW5 ? 'var(--success)' : isPastMonth ? 'var(--error)' : 'var(--text-muted)',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      border: '1px solid currentColor',
                      textTransform: 'uppercase'
                    }}>
                      {isCompletedInW5 ? 'Realizado' : isPastMonth ? 'Expirado' : 'Mensual'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
        {/* Cleaning Subtabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
          <button
            onClick={() => setCleaningSubTab('semanal')}
            className="btn"
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 700,
              backgroundColor: cleaningSubTab === 'semanal' ? 'var(--primary)' : 'var(--bg-main)',
              color: cleaningSubTab === 'semanal' ? '#fff' : 'var(--text-main)',
              border: cleaningSubTab === 'semanal' ? '1px solid var(--primary)' : '1px solid var(--border)',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🧹 Limpieza Semanal
          </button>
          <button
            onClick={() => setCleaningSubTab('mensual')}
            className="btn"
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 700,
              backgroundColor: cleaningSubTab === 'mensual' ? 'var(--primary)' : 'var(--bg-main)',
              color: cleaningSubTab === 'mensual' ? '#fff' : 'var(--text-main)',
              border: cleaningSubTab === 'mensual' ? '1px solid var(--primary)' : '1px solid var(--border)',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            📅 Limpieza Mensual
          </button>
        </div>

        {cleaningSubTab === 'semanal' ? renderWeeklySubTab() : renderMonthlySubTab()}
      </div>
    );
  };

  // Render Training Route (8 days)
  const renderTrainingRoute = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
          <h3 style={{ margin: 0, color: 'var(--secondary)' }}>Ruta de Inducción y Capacitación</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
            Cronograma de 8 días de capacitación técnica en tienda. Aprobado por el Supervisor.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
          {trainingRoute.map((day) => {
            const isCompleted = day.estado === 'Completado';
            const isInProgress = day.estado === 'En Curso';
            const isLocked = false; // Habilitado temporalmente por requerimiento del usuario
            
            let statusColor = { bg: 'var(--bg-main)', text: 'var(--text-muted)', border: 'var(--border)' };
            if (isCompleted) statusColor = { bg: 'var(--success-light)', text: 'var(--success)', border: 'var(--success)' };
            if (isInProgress) statusColor = { bg: 'var(--warning-light)', text: 'var(--warning)', border: 'var(--warning)' };
            if (isLocked) statusColor = { bg: 'var(--bg-main)', text: 'var(--text-muted)', border: 'var(--border)' };

            return (
              <div
                key={day.id}
                onClick={() => {
                  if (isLocked) {
                    alert('Este día se encuentra bloqueado. Comunícate con el Administrador o Supervisor para que te dé de alta ("levante") en esta capacitación.');
                    return;
                  }
                  setSelectedDayMaterial(day);
                }}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${statusColor.border}`,
                  backgroundColor: statusColor.bg,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: 'var(--shadow-sm)',
                  opacity: isLocked ? 0.55 : 1,
                }}
                className={isLocked ? "" : "training-route-card"}
              >
                <style dangerouslySetInnerHTML={{__html: `
                  .training-route-card {
                    transition: all 0.2s ease !important;
                  }
                  .training-route-card:hover {
                    transform: translateY(-3px);
                    box-shadow: var(--shadow-md) !important;
                    border-color: var(--primary) !important;
                  }
                `}} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '14px' }}>{day.dia}</span>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: statusColor.text,
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    border: `1px solid ${statusColor.border}`
                  }}>
                    {isLocked ? '🔒 Bloqueado' : day.estado}
                  </span>
                </div>
                
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '12px', color: 'var(--text-main)' }}>{day.titulo}</h4>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>{day.descripcion}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '8px', marginTop: '6px' }}>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '9.5px', fontWeight: 600 }}>
                    <span style={{ color: 'var(--text-muted)' }}>⏱ {day.duracion}</span>
                    <span style={{ color: 'var(--text-muted)' }}>📍 {day.modalidad}</span>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    📋 Ver Manual & Video →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Tab Menu Header */}
      <div className="card glass dashboard-tabs" style={{ padding: '0 12px', display: 'flex', gap: '5px' }}>
        <button
          onClick={() => setActiveTab('checklist')}
          style={{
            padding: '14px 20px',
            border: 'none',
            borderBottom: activeTab === 'checklist' ? '3px solid var(--primary)' : '3px solid transparent',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 700,
            color: activeTab === 'checklist' ? 'var(--primary)' : 'var(--text-muted)',
            transition: 'all 0.2s ease',
          }}
        >
          Checklists Diarios
        </button>
        <button
          onClick={() => setActiveTab('cleaning')}
          style={{
            padding: '14px 20px',
            border: 'none',
            borderBottom: activeTab === 'cleaning' ? '3px solid var(--primary)' : '3px solid transparent',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 700,
            color: activeTab === 'cleaning' ? 'var(--primary)' : 'var(--text-muted)',
            transition: 'all 0.2s ease',
          }}
        >
          Tareas de Limpieza
        </button>
        <button
          onClick={() => setActiveTab('route')}
          style={{
            padding: '14px 20px',
            border: 'none',
            borderBottom: activeTab === 'route' ? '3px solid var(--primary)' : '3px solid transparent',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 700,
            color: activeTab === 'route' ? 'var(--primary)' : 'var(--text-muted)',
            transition: 'all 0.2s ease',
          }}
        >
          Ruta de Capacitación
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          style={{
            padding: '14px 20px',
            border: 'none',
            borderBottom: activeTab === 'attendance' ? '3px solid var(--primary)' : '3px solid transparent',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 700,
            color: activeTab === 'attendance' ? 'var(--primary)' : 'var(--text-muted)',
            transition: 'all 0.2s ease',
          }}
        >
          Control de Asistencia
        </button>
        {user.role === 'Barista' && (
          <button
            onClick={() => setActiveTab('sensory')}
            style={{
              padding: '14px 20px',
              border: 'none',
              borderBottom: activeTab === 'sensory' ? '3px solid var(--primary)' : '3px solid transparent',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 700,
              color: activeTab === 'sensory' ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
            }}
          >
            Perfil de Espresso
          </button>
        )}
        <button
          onClick={() => setActiveTab('menu')}
          style={{
            padding: '14px 20px',
            border: 'none',
            borderBottom: activeTab === 'menu' ? '3px solid var(--primary)' : '3px solid transparent',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 700,
            color: activeTab === 'menu' ? 'var(--primary)' : 'var(--text-muted)',
            transition: 'all 0.2s ease',
          }}
        >
          Carta Digital
        </button>
        <button
          onClick={() => setActiveTab('incidents')}
          style={{
            padding: '14px 20px',
            border: 'none',
            borderBottom: activeTab === 'incidents' ? '3px solid var(--primary)' : '3px solid transparent',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 700,
            color: activeTab === 'incidents' ? 'var(--primary)' : 'var(--text-muted)',
            transition: 'all 0.2s ease',
          }}
        >
          Reportar Incidencia
        </button>

      </div>

      {/* Main View Area */}
      <div className="card animate-fade-in" style={{ minHeight: '350px' }}>
        {activeTab === 'checklist' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Strict Daily Compliance Banner */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              padding: '12px 15px',
              borderRadius: '6px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fee2e2',
              color: '#991b1b',
              fontSize: '12.5px',
              fontWeight: 600,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '5px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--primary)' }}>
                  📅 Control Diario de Actividades: {new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span style={{ fontSize: '10px', backgroundColor: 'var(--primary)', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                  Tiempo Real (Lima, PE)
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '11.5px', color: '#7f1d1d', fontWeight: 500, lineHeight: 1.4 }}>
                🚨 <strong>REGLA OPERATIVA DE DON GUTO:</strong> Los checklists de Apertura, Relevo y Cierre se deben completar estrictamente dentro del día de trabajo en curso. No se permite el marcado retroactivo (ni ayer ni mañana). Las tareas vacías al finalizar la jornada laboral (11:59 PM) se registrarán automáticamente como <strong>Falta de Cumplimiento</strong> en el expediente del colaborador.
              </p>
            </div>

            {/* Shift selector and progress */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '15px', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['APERTURA', 'RELEVO', 'CIERRE'].map(type => (
                  <button
                    key={type}
                    onClick={() => setShiftType(type)}
                    className="btn"
                    style={{
                      padding: '6px 16px',
                      fontSize: '12px',
                      backgroundColor: shiftType === type ? 'var(--primary)' : 'var(--bg-main)',
                      color: shiftType === type ? '#fff' : 'var(--text-main)',
                      border: shiftType === type ? 'none' : '1px solid var(--border)',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Progress bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '250px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Avance:</span>
                <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: 'var(--success)', transition: 'width 0.3s ease' }} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--success)' }}>{progressPercent.toFixed(0)}%</span>
              </div>
            </div>

            {/* Checklist items list */}
            {renderChecklist()}
          </div>
        )}

        {activeTab === 'cleaning' && renderCleaningCalendar()}

        {activeTab === 'route' && renderTrainingRoute()}

        {activeTab === 'sensory' && user.role === 'Barista' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }} className="animate-fade-in">
            <SensoryProfile />
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ borderBottom: '2px solid var(--border)', paddingBottom: '10px' }}>
                <h3 style={{ margin: 0, color: 'var(--primary)' }}>Guía de Calibración Sensorial de Espresso</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                  Consejos operacionales para corregir desviaciones de extracción y lograr la taza equilibrada de Don Guto.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', borderRadius: '4px', border: '1px solid #fee2e2', backgroundColor: '#fef2f2' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#991b1b' }}>🍋 Acidez Alta / Sabor Agrio (Sub-extracción)</span>
                  <p style={{ margin: 0, fontSize: '11.5px', color: '#7f1d1d', lineHeight: 1.4 }}>
                    Si el espresso se extrae demasiado rápido y tiene un sabor agrio, metálico o salado, indica sub-extracción. Muele más fino o aumenta el rendimiento (yield) en taza.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', borderRadius: '4px', border: '1px solid #fef3c7', backgroundColor: '#fffbeb' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#92400e' }}>🍂 Amargor Alto / Sabor Seco (Sobre-extracción)</span>
                  <p style={{ margin: 0, fontSize: '11.5px', color: '#78350f', lineHeight: 1.4 }}>
                    Si el café tarda mucho en salir y deja un sabor amargo o seco, indica sobre-extracción. Muele más grueso o detén la extracción antes (menor yield).
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', borderRadius: '4px', border: '1px solid #dbeafe', backgroundColor: '#eff6ff' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#1e40af' }}>☕ Ratios y Dulzor (Cajamarca Don Guto)</span>
                  <p style={{ margin: 0, fontSize: '11.5px', color: '#1e3a8a', lineHeight: 1.4 }}>
                    El espresso de Don Guto debe calibrarse en un ratio de 1:2 a 1:2.2: 18.0g de café seco para obtener de 36.0g a 39.5g de líquido en 25-29 segundos.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', borderRadius: '4px', border: '1px solid #dcfce7', backgroundColor: '#f0fdf4' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#166534' }}>🥛 Texturizado de Leche y Crema</span>
                  <p style={{ margin: 0, fontSize: '11.5px', color: '#14532d', lineHeight: 1.4 }}>
                    Calienta la leche a 60°C - 65°C para una crema microespumada brillante y elástica. Temperaturas mayores queman la leche y destruyen la lactosa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (() => {
          const todayStr = currentTime.toISOString().split('T')[0];
          const clockedInToday = arrivalLogs.some(log => log.date === todayStr);
          const todaysLog = arrivalLogs.find(log => log.date === todayStr);

          const allowedIp = STORE_WIFI_IPS[user.store] || '';
          const currentIp = selectedWifi === 'external' ? userIp : STORE_WIFI_IPS[selectedWifi];
          const isConnectedToStoreWifi = currentIp === allowedIp;

          // Punctuality calculations for this collaborator
          const totalLogs = arrivalLogs.length;

          const getAvgArrivalTime = () => {
            if (arrivalLogs.length === 0) return 'N/A';
            let totalMinutes = 0;
            arrivalLogs.forEach(log => {
              const timeStr = log.time;
              const [time, ampm] = timeStr.split(' ');
              let [hours, minutes] = time.split(':').map(Number);
              if (ampm === 'PM' && hours < 12) hours += 12;
              if (ampm === 'AM' && hours === 12) hours = 0;
              totalMinutes += hours * 60 + minutes;
            });
            const avgMinutes = totalMinutes / arrivalLogs.length;
            let avgHours = Math.floor(avgMinutes / 60);
            const avgMins = Math.round(avgMinutes % 60);
            const displayAmpm = avgHours >= 12 ? 'PM' : 'AM';
            if (avgHours > 12) avgHours -= 12;
            if (avgHours === 0) avgHours = 12;
            return `${avgHours.toString().padStart(2, '0')}:${avgMins.toString().padStart(2, '0')} ${displayAmpm}`;
          };

          const avgDelay = totalLogs > 0 
            ? arrivalLogs.reduce((acc, curr) => acc + (curr.delayMin || 0), 0) / totalLogs 
            : 0;

          let punctLevel = 'Excelente 🟢';
          let punctColor = 'var(--success)';
          if (avgDelay > 15) {
            punctLevel = 'Crítico 🚨';
            punctColor = 'var(--error)';
          } else if (avgDelay > 5) {
            punctLevel = 'Tolerable ⚠️';
            punctColor = '#d97706';
          }

          const handleClockInClick = () => {
            let finalTimeStr = '';
            let finalExpectedTimeStr = expectedTime;
            
            if (expectedTime === 'CUSTOM') {
              finalExpectedTimeStr = convert24hTo12h(customExpectedTime);
            }

            if (timeMode === 'realtime') {
              const hours = currentTime.getHours();
              const minutes = currentTime.getMinutes();
              const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
              const displayMinutes = minutes.toString().padStart(2, '0');
              const ampm = hours >= 12 ? 'PM' : 'AM';
              finalTimeStr = `${displayHours.toString().padStart(2, '0')}:${displayMinutes} ${ampm}`;
            } else {
              finalTimeStr = convert24hTo12h(simulatedTime);
            }

            // Calculate delayMin
            const [timePart, ampmPart] = finalTimeStr.split(' ');
            let [h, m] = timePart.split(':').map(Number);
            if (ampmPart === 'PM' && h < 12) h += 12;
            if (ampmPart === 'AM' && h === 12) h = 0;
            const currentMins = h * 60 + m;

            const [expTimePart, expAmpmPart] = finalExpectedTimeStr.split(' ');
            let [eh, em] = expTimePart.split(':').map(Number);
            if (expAmpmPart === 'PM' && eh < 12) eh += 12;
            if (expAmpmPart === 'AM' && eh === 12) eh = 0;
            const expectedMins = eh * 60 + em;

            const delay = Math.max(0, currentMins - expectedMins);

            if (onClockIn) {
              onClockIn(user.username, todayStr, finalTimeStr, finalExpectedTimeStr, delay);
            }
          };

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
              <div style={{ borderBottom: '2px solid var(--border)', paddingBottom: '10px' }}>
                <h3 style={{ margin: 0, color: 'var(--primary)' }}>Control de Asistencia del Colaborador</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                  Registra tu hora de llegada a la tienda y visualiza tu historial de puntualidad.
                </p>
              </div>

              {/* Attendance Statistics Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
                <div className="card" style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '5px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>HORA PROM. LLEGADA</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>{getAvgArrivalTime()}</span>
                </div>
                <div className="card" style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '5px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>RETRASO PROMEDIO</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: avgDelay > 5 ? 'var(--error)' : 'var(--success)' }}>
                    {avgDelay.toFixed(1)} min
                  </span>
                </div>
                <div className="card" style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '5px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>NIVEL DE PUNTUALIDAD</span>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: punctColor }}>{punctLevel}</span>
                </div>
                <div className="card" style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '5px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL MARCACIONES</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>{totalLogs} días</span>
                </div>
              </div>

              {/* Clock In Panel */}
              <div className="card" style={{ padding: '20px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🕒 Registrar Entrada del Día
                </h4>

                {clockedInToday && (
                  <div style={{
                    padding: '12px 20px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--success-light)',
                    border: '1px solid var(--success)',
                    color: 'var(--success)',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    textAlign: 'center'
                  }}>
                    <strong style={{ fontSize: '13px' }}>🟢 Asistencia Activa</strong>
                    <div style={{ fontSize: '12.5px', display: 'flex', justifyContent: 'space-between', marginTop: '4px', borderTop: '1px solid rgba(22, 163, 74, 0.2)', paddingTop: '4px' }}>
                      <span>Entrada: <strong>{todaysLog?.time}</strong></span>
                      <span>Salida: <strong>{todaysLog?.checkOutTime || '--'}</strong></span>
                      <span>Marcajes: <strong>{todaysLog?.totalPunches || 1}</strong></span>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px', padding: '10px', width: '100%' }}>
                  <h5 style={{ margin: 0, fontSize: '14px', color: 'var(--text-main)', fontWeight: 700 }}>
                    ☝️ Registro Asistencia con Lector Biométrico
                  </h5>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '380px' }}>
                    Coloca tu dedo en el lector biométrico físico (ZKTeco K40) conectado en tu sede para registrar tu ingreso o salida.
                  </p>
                  
                  {/* Fingerprint scan circle */}
                  <div 
                    style={{
                      width: '130px',
                      height: '130px',
                      borderRadius: '50%',
                      border: `4px solid ${
                        bioScanState === 'success' ? 'var(--success)' : bioScanState === 'error' ? 'var(--error)' : bioScanState === 'scanning' ? 'var(--primary)' : 'var(--border)'
                      }`,
                      backgroundColor: bioScanState === 'scanning' ? 'rgba(139,26,26,0.05)' : 'var(--bg-main)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'default',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      marginTop: '10px',
                      boxShadow: 'var(--shadow-md)',
                    }}
                  >
                    {bioScanState === 'scanning' && (
                      <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '3px',
                        backgroundColor: 'var(--primary)',
                        boxShadow: '0 0 8px var(--primary)',
                        top: `${bioProgress}%`,
                        left: 0,
                        transition: 'top 0.15s linear',
                      }} />
                    )}

                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke={
                      bioScanState === 'success' ? 'var(--success)' : bioScanState === 'error' ? 'var(--error)' : bioScanState === 'scanning' ? 'var(--primary)' : 'var(--text-muted)'
                    } strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 10a2 2 0 0 0-2 2M14 14a4 4 0 0 0-4-4M2 12a10 10 0 0 1 18 0M10 17v-1a2 2 0 1 1 4 0v1" />
                      <path d="M12 2a10 10 0 0 0-10 10M12 22a10 10 0 0 0 10-10" />
                      <path d="M6 12a6 6 0 0 1 12 0M8 12a4 4 0 0 1 8 0" />
                    </svg>
                  </div>

                  <div style={{ fontSize: '12px', color: bioScanState === 'success' ? 'var(--success)' : bioScanState === 'error' ? 'var(--error)' : 'var(--text-muted)', fontWeight: 600, textAlign: 'center', minHeight: '34px', maxWidth: '340px', marginTop: '15px' }}>
                    {bioFeedback}
                  </div>
                </div>
              </div>

              {/* Attendance Logs History Table */}
              <div className="card" style={{ padding: '20px', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: 'var(--text-main)' }}>
                  📋 Historial de Asistencia
                </h4>
                {arrivalLogs.length === 0 ? (
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>No tienes marcaciones de asistencia registradas.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                          <th style={{ padding: '8px 10px' }}>Fecha</th>
                          <th style={{ padding: '8px 10px' }}>Hora de Entrada</th>
                          <th style={{ padding: '8px 10px' }}>Hora de Salida</th>
                          <th style={{ padding: '8px 10px' }}>Hora Esperada</th>
                          <th style={{ padding: '8px 10px' }}>Retraso (Min)</th>
                          <th style={{ padding: '8px 10px', textAlign: 'center' }}>Total Marcajes</th>
                          <th style={{ padding: '8px 10px' }}>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...arrivalLogs].reverse().map((log, idx) => {
                          let statusText = 'Puntual';
                          let statusBg = 'var(--success-light)';
                          let statusColor = 'var(--success)';
                          
                          if (log.delayMin > 15) {
                            statusText = 'Crítico';
                            statusBg = 'var(--error-light)';
                            statusColor = 'var(--error)';
                          } else if (log.delayMin > 0) {
                            statusText = 'Tolerable';
                            statusBg = 'var(--warning-light)';
                            statusColor = '#d97706';
                          }

                          return (
                            <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                              <td style={{ padding: '10px 10px', fontWeight: 600 }}>{log.date}</td>
                              <td style={{ padding: '10px 10px' }}>{log.time}</td>
                              <td style={{ padding: '10px 10px' }}>{log.checkOutTime || '--'}</td>
                              <td style={{ padding: '10px 10px', color: 'var(--text-muted)' }}>{log.expectedTime}</td>
                              <td style={{ padding: '10px 10px', fontWeight: 700, color: log.delayMin > 0 ? 'var(--error)' : 'var(--success)' }}>
                                {log.delayMin > 0 
                                  ? (log.delayMin >= 60 
                                      ? `+${Math.floor(log.delayMin / 60)}h ${log.delayMin % 60}min` 
                                      : `+${log.delayMin} min`) 
                                  : '0 min'}
                              </td>
                              <td style={{ padding: '10px 10px', textAlign: 'center', fontWeight: 600 }}>
                                {log.totalPunches || 1}
                              </td>
                              <td style={{ padding: '10px 10px' }}>
                                <span style={{
                                  padding: '3px 8px',
                                  borderRadius: '4px',
                                  fontSize: '10.5px',
                                  fontWeight: 700,
                                  backgroundColor: statusBg,
                                  color: statusColor,
                                  border: '1px solid currentColor',
                                  display: 'inline-block'
                                }}>
                                  {statusText}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
        {activeTab === 'menu' && (
          <CartaDigital user={user} />
        )}
        {activeTab === 'incidents' && renderIncidentsSection()}
      </div>

      {/* Modal de Capacitación (PDF + Video) */}
      {selectedDayMaterial && (() => {
        const manual = MANUALS_BY_DAY[selectedDayMaterial.id];
        return (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(44, 37, 35, 0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            animation: 'fadeIn 0.2s ease-out'
          }} onClick={handleCloseModal}>
            <div style={{
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '1100px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border)',
              overflow: 'hidden',
              animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }} onClick={(e) => e.stopPropagation()}>
              
              {/* Header de Modal */}
              <div style={{
                padding: '16px 24px',
                borderBottom: '1px solid var(--border)',
                backgroundColor: 'var(--bg-card)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    backgroundColor: 'var(--primary)',
                    color: '#fff',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    letterSpacing: '0.5px'
                  }}>
                    {selectedDayMaterial.id}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-main)', fontWeight: 800 }}>
                      {selectedDayMaterial.titulo}
                    </h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                      Materia de Inducción Técnica Oficial — Estado: <strong style={{ color: selectedDayMaterial.estado === 'Completado' ? 'var(--success)' : selectedDayMaterial.estado === 'En Curso' ? 'var(--warning)' : 'var(--text-muted)' }}>{selectedDayMaterial.estado}</strong>
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '20px',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.15s ease'
                  }}
                  title="Cerrar"
                >
                  ✕
                </button>
              </div>

              {/* Contenido Dividido u Hoja de Examen */}
              {examMode && selectedDayMaterial.id === 'D4' ? (
                /* EXAM INTERFACE */
                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'row',
                  overflow: 'hidden',
                  backgroundColor: '#eae4dc'
                }} className="modal-split-container">
                  
                  <style dangerouslySetInnerHTML={{__html: `
                    @media (max-width: 800px) {
                      .modal-split-container {
                        flex-direction: column !important;
                        overflow-y: auto !important;
                      }
                      .modal-left-pdf, .modal-right-video {
                        width: 100% !important;
                        max-height: none !important;
                        overflow-y: visible !important;
                      }
                    }
                    @media (max-width: 600px) {
                      .modal-left-pdf {
                        padding: 10px !important;
                      }
                      .pdf-page-container {
                        padding: 25px 15px !important;
                        min-height: auto !important;
                      }
                      .modal-right-video {
                        padding: 15px !important;
                      }
                    }
                  `}} />

                  {/* Left Column: Exam Questions Sheet */}
                  <div className="modal-left-pdf" style={{
                    width: '60%',
                    padding: '24px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: '#eae4dc',
                    borderRight: '1px solid var(--border)',
                    maxHeight: 'calc(90vh - 70px)',
                  }}>
                    {/* Exam Sheet container */}
                    <div className="pdf-page-container" style={{
                      backgroundColor: '#fffcf7',
                      width: '100%',
                      maxWidth: '650px',
                      padding: '40px 30px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.12)',
                      borderRadius: '4px',
                      border: '1px solid #dcd3c9',
                      fontFamily: "sans-serif",
                      color: '#2a2220',
                      lineHeight: 1.5,
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '25px',
                      flexShrink: 0
                    }}>
                      <div style={{ textAlign: 'center', borderBottom: '2px solid #8b1a1a', paddingBottom: '12px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#8b1a1a', display: 'block' }}>DON GUTO COFFEE COMPANY</span>
                        <h4 style={{ margin: '5px 0 0 0', fontSize: '16px', fontWeight: 'bold', color: 'var(--text-main)', textTransform: 'uppercase' }}>
                          Examen de Certificación Teórica
                        </h4>
                        <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Evaluación Técnica para Baristas — Tiempo Límite: 45 min</span>
                      </div>

                      {examSubmitted ? (
                        /* EXAM RESULTS VIEW */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <h3 style={{ fontSize: '14px', color: examScore >= 85 ? 'var(--success)' : 'var(--error)', margin: 0, fontWeight: 800 }}>
                            {examScore >= 85 ? '🎉 ¡Examen Aprobado!' : '❌ Examen Desaprobado'}
                          </h3>
                          <p style={{ fontSize: '12px', margin: 0, color: 'var(--text-main)' }}>
                            Revisión de respuestas obtenidas ({EXAM_QUESTIONS.filter(q => examAnswers[q.id] === q.correct).length} de 10 correctas):
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
                            {EXAM_QUESTIONS.map(q => {
                              const isCorrect = examAnswers[q.id] === q.correct;
                              const selectedOpt = q.options.find(o => o.val === examAnswers[q.id]);
                              const correctOpt = q.options.find(o => o.val === q.correct);
                              return (
                                <div key={q.id} style={{ padding: '12px', borderRadius: '6px', backgroundColor: isCorrect ? 'var(--success-light)' : 'var(--error-light)', border: `1px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}` }}>
                                  <strong style={{ fontSize: '12px', display: 'block', color: 'var(--text-main)' }}>{q.q}</strong>
                                  <span style={{ fontSize: '11px', display: 'block', marginTop: '6px', color: isCorrect ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>
                                    {isCorrect ? '✓ Respuesta Correcta' : `✗ Tu respuesta: ${selectedOpt ? selectedOpt.label : 'No respondida'}`}
                                  </span>
                                  {!isCorrect && (
                                    <span style={{ fontSize: '11px', display: 'block', marginTop: '3px', color: 'var(--success)', fontWeight: 600 }}>
                                      ✓ Respuesta correcta oficial: {correctOpt.label}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        /* EXAM QUESTIONS VIEW */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                          {EXAM_QUESTIONS.map(q => {
                            const selectedVal = examAnswers[q.id];
                            return (
                              <div key={q.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
                                <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>{q.q}</strong>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  {q.options.map(opt => (
                                    <label
                                      key={opt.val}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '8px',
                                        fontSize: '12px',
                                        color: 'var(--text-main)',
                                        cursor: 'pointer',
                                        padding: '6px 8px',
                                        borderRadius: '4px',
                                        backgroundColor: selectedVal === opt.val ? 'var(--primary-light)' : 'transparent',
                                        transition: 'background-color 0.15s ease'
                                      }}
                                    >
                                      <input
                                        type="radio"
                                        name={`question-${q.id}`}
                                        value={opt.val}
                                        checked={selectedVal === opt.val}
                                        onChange={() => setExamAnswers(prev => ({ ...prev, [q.id]: opt.val }))}
                                        style={{ marginTop: '2px', cursor: 'pointer' }}
                                      />
                                      <span>{opt.label}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Timer & Controls */}
                  <div className="modal-right-video" style={{
                    width: '40%',
                    padding: '24px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    backgroundColor: 'var(--bg-card)',
                    maxHeight: 'calc(90vh - 70px)'
                  }}>
                    <div style={{ borderBottom: '2px solid var(--primary)', paddingBottom: '8px' }}>
                      <h4 style={{ margin: 0, color: 'var(--text-main)', fontSize: '13px', fontWeight: 800 }}>
                        ⏱️ Panel de Control del Examen
                      </h4>
                    </div>

                    {/* Timer Display */}
                    {!examSubmitted && (
                      <div style={{
                        backgroundColor: 'var(--primary)',
                        borderRadius: 'var(--radius-md)',
                        padding: '20px',
                        color: '#fff',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        boxShadow: 'var(--shadow-sm)',
                      }}>
                        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>Tiempo Restante:</span>
                        <div style={{
                          fontSize: '32px',
                          fontWeight: 900,
                          fontFamily: 'monospace',
                          animation: examTimer < 300 ? 'pulse-soft 1s infinite' : 'none',
                          color: examTimer < 300 ? '#fca5a5' : '#fff'
                        }}>
                          {(() => {
                            const min = Math.floor(examTimer / 60);
                            const sec = examTimer % 60;
                            return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
                          })()}
                        </div>
                        {examTimer < 300 && (
                          <span style={{ fontSize: '10px', color: '#fca5a5', fontWeight: 'bold' }}>⚠️ ¡Quedan menos de 5 minutos!</span>
                        )}
                      </div>
                    )}

                    {/* Progress details */}
                    <div className="card" style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span>Preguntas Respondidas:</span>
                        <strong>{Object.keys(examAnswers).length} de 10</strong>
                      </div>
                      <div style={{ height: '8px', backgroundColor: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                        <div style={{
                          width: `${(Object.keys(examAnswers).length / 10) * 100}%`,
                          height: '100%',
                          backgroundColor: 'var(--primary)',
                          transition: 'width 0.2s ease'
                        }} />
                      </div>
                    </div>

                    {/* Score display (if submitted) */}
                    {examSubmitted && (
                      <div style={{
                        backgroundColor: examScore >= 85 ? 'var(--success-light)' : 'var(--error-light)',
                        borderRadius: 'var(--radius-md)',
                        padding: '20px',
                        border: `1px solid ${examScore >= 85 ? 'var(--success)' : 'var(--error)'}`,
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Nota Final:</span>
                        <div style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          backgroundColor: '#fff',
                          border: `4px solid ${examScore >= 85 ? 'var(--success)' : 'var(--error)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                          fontWeight: 900,
                          color: examScore >= 85 ? 'var(--success)' : 'var(--error)'
                        }}>
                          {examScore}%
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: examScore >= 85 ? 'var(--success)' : 'var(--error)' }}>
                          {examScore >= 85 ? 'APROBADO (Mínimo: 85%)' : 'REPROBADO (Mínimo: 85%)'}
                        </span>
                        <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                          {examScore >= 85 
                            ? '🎉 ¡Felicitaciones! Has aprobado satisfactoriamente y tu estado ha sido actualizado a "Completado".'
                            : '❌ No has alcanzado el 85% aprobatorio requerido. Se comunicará contigo el administrador para coordinar los siguientes pasos.'}
                        </p>
                      </div>
                    )}

                    {/* Exam Controls */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
                      {!examSubmitted ? (
                        <>
                          <button
                            onClick={handleGradeExam}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '12px' }}
                          >
                            📝 Enviar y Calificar Examen
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('¿Estás seguro de que deseas salir del examen? Se perderán todas tus respuestas actuales.')) {
                                setExamMode(false);
                                setExamAnswers({});
                                setExamTimer(2700);
                              }
                            }}
                            className="btn btn-secondary"
                            style={{ width: '100%', padding: '10px' }}
                          >
                            Cancelar Examen
                          </button>
                        </>
                      ) : (
                        <>
                          {examScore < 85 ? (
                            <div style={{
                              padding: '12px',
                              borderRadius: '6px',
                              backgroundColor: 'var(--error-light)',
                              border: '1px solid var(--error)',
                              color: 'var(--error)',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              textAlign: 'center',
                              lineHeight: 1.4,
                              marginBottom: '5px'
                            }}>
                              ⚠️ Examen Reprobado. Se comunicará contigo el administrador para habilitar un nuevo intento.
                            </div>
                          ) : null}
                          <button
                            onClick={handleCloseModal}
                            className="btn btn-secondary"
                            style={{ width: '100%', padding: '10px' }}
                          >
                            Finalizar y Cerrar
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                </div>
              ) : (
                /* NORMAL SPLIT MATERIAL VIEW */
                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'row',
                  overflow: 'hidden',
                  backgroundColor: '#eae4dc'
                }} className="modal-split-container">
                  <style dangerouslySetInnerHTML={{__html: `
                    @media (max-width: 800px) {
                      .modal-split-container {
                        flex-direction: column !important;
                        overflow-y: auto !important;
                      }
                      .modal-left-pdf, .modal-right-video {
                        width: 100% !important;
                        max-height: none !important;
                        overflow-y: visible !important;
                      }
                      .pdf-page-container {
                        box-shadow: none !important;
                        border-radius: 0 !important;
                        margin: 0 !important;
                        border: none !important;
                      }
                    }
                    @media (max-width: 600px) {
                      .modal-left-pdf {
                        padding: 10px !important;
                      }
                      .pdf-page-container {
                        padding: 25px 15px !important;
                        min-height: auto !important;
                      }
                      .modal-right-video {
                        padding: 15px !important;
                      }
                    }
                  `}} />

                  {/* Columna Izquierda: Simulación de PDF (A4 Page) */}
                  <div className="modal-left-pdf" style={{
                    width: '55%',
                    padding: '24px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: '#eae4dc',
                    borderRight: '1px solid var(--border)',
                    maxHeight: 'calc(90vh - 70px)'
                  }}>
                    {/* Contenedor A4 Simulado */}
                    <div className="pdf-page-container" style={{
                      backgroundColor: '#fffcf7',
                      width: '100%',
                      maxWidth: '600px',
                      padding: '40px 30px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.12)',
                      borderRadius: '4px',
                      border: '1px solid #dcd3c9',
                      fontFamily: "'Courier New', Courier, monospace",
                      color: '#2a2220',
                      lineHeight: 1.6,
                      position: 'relative',
                      minHeight: '650px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      flexShrink: 0
                    }}>
                      
                      {/* Marca de agua / Sello aprobado */}
                      <div style={{
                        position: 'absolute',
                        top: '25%',
                        left: '15%',
                        right: '15%',
                        border: '4px double rgba(139, 26, 26, 0.15)',
                        color: 'rgba(139, 26, 26, 0.15)',
                        transform: 'rotate(-25deg)',
                        fontSize: '32px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        padding: '10px',
                        pointerEvents: 'none',
                        userSelect: 'none',
                        textTransform: 'uppercase',
                        letterSpacing: '2px'
                      }}>
                        Aprobado por Don Guto
                      </div>

                      <div>
                        {/* Encabezado PDF */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderBottom: '2px solid #8b1a1a',
                          paddingBottom: '8px',
                          marginBottom: '20px'
                        }}>
                          <div>
                            <span style={{ fontSize: '11px', fontWeight: 800, color: '#8b1a1a', display: 'block', fontFamily: 'sans-serif' }}>DON GUTO COFFEE CO.</span>
                            <span style={{ fontSize: '8px', color: 'var(--text-muted)', display: 'block', marginTop: '2px', fontFamily: 'sans-serif' }}>INTRANET DE OPERACIONES & CAPACITACIÓN</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#7d706c', fontFamily: 'sans-serif' }}>CÓD: {manual?.codigo || 'DG-MAN-GEN'}</span>
                            <span style={{ fontSize: '8px', color: 'var(--text-muted)', display: 'block', fontFamily: 'sans-serif' }}>VIGENCIA: 2026</span>
                          </div>
                        </div>

                        {/* Título de Página */}
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#2a2220', textTransform: 'uppercase', textDecoration: 'underline' }}>
                            {manual?.title || selectedDayMaterial.titulo}
                          </h4>
                          <span style={{ fontSize: '10px', color: '#7d706c' }}>Manual Oficial del Barista - {selectedDayMaterial.duracion} ({selectedDayMaterial.modalidad})</span>
                        </div>

                        {/* Secciones de Contenido */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '12px' }}>
                          {manual?.sections.map((section, idx) => (
                            <div key={idx} style={{ textAlign: 'left' }}>
                              <h5 style={{ margin: '0 0 6px 0', fontSize: '12.5px', fontWeight: 'bold', color: '#8b1a1a' }}>
                                {section.subtitle}
                              </h5>
                              <div style={{ whiteSpace: 'pre-wrap', color: '#3c3230', fontSize: '11.5px', paddingLeft: '8px', borderLeft: '2px solid #ebdcd5' }}>
                                {section.content}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pie de Página PDF */}
                      <div style={{
                        borderTop: '1px solid #ebdcd5',
                        paddingTop: '10px',
                        marginTop: '40px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '9px',
                        color: 'var(--text-muted)',
                        fontFamily: 'sans-serif'
                      }}>
                        <span>© 2026 Don Guto Coffee Company. Prohibida su copia.</span>
                        <span>Pág. 1 de 1</span>
                      </div>

                    </div>

                    {/* Acciones del PDF simulado */}
                    <div style={{ marginTop: '15px', display: 'flex', gap: '10px', width: '100%', maxWidth: '600px', justifyContent: 'center', flexShrink: 0 }}>
                      {selectedDayMaterial.id === 'D4' ? (
                        /* ACCIONES DÍA 4: DAR EXAMEN */
                        selectedDayMaterial.estado === 'Completado' ? (
                          <div style={{ textAlign: 'center', color: 'var(--success)', fontWeight: 'bold', fontSize: '13px', padding: '10px 0' }}>
                            ✓ Has aprobado este examen teórico anteriormente con un puntaje superior al 85%.
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              if (confirm('¿Estás seguro de que deseas iniciar el examen de certificación? Una vez iniciado, comenzará a correr el tiempo límite de 45 minutos.')) {
                                setExamMode(true);
                              }
                            }}
                            className="btn btn-primary"
                            style={{ padding: '10px 20px', fontSize: '13px', width: '100%', display: 'flex', gap: '8px', justifyContent: 'center' }}
                          >
                            ✍️ Iniciar Examen Teórico de Certificación (Límite: 45 min)
                          </button>
                        )
                      ) : (
                        /* ACCIONES NORMALES DE MANUAL */
                        <>
                          <button
                            onClick={() => window.print()}
                            className="btn btn-secondary"
                            style={{ padding: '6px 14px', fontSize: '11px', backgroundColor: '#fff', border: '1px solid #c8b8af' }}
                          >
                            🖨 Imprimir Documento
                          </button>
                          <button
                            onClick={() => alert('Simulación: Descargando archivo PDF completo en segundo plano...')}
                            className="btn btn-primary"
                            style={{ padding: '6px 14px', fontSize: '11px' }}
                          >
                            💾 Descargar PDF Oficial
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Columna Derecha: Video Tutorial */}
                  <div className="modal-right-video" style={{
                    width: '45%',
                    padding: '24px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    backgroundColor: 'var(--bg-card)',
                    maxHeight: 'calc(90vh - 70px)'
                  }}>
                    <div style={{ borderBottom: '2px solid var(--primary)', paddingBottom: '8px' }}>
                      <h4 style={{ margin: 0, color: 'var(--text-main)', fontSize: '13px', fontWeight: 800 }}>
                        🎥 Video de Entrenamiento Práctico
                      </h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '10.5px', color: 'var(--text-muted)' }}>
                        Soporte audiovisual complementario para la inducción diaria.
                      </p>
                    </div>

                    {/* Reproductor de Video responsivo */}
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      paddingBottom: '56.25%', /* 16:9 ratio */
                      height: 0,
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid var(--border)',
                      boxShadow: 'var(--shadow-sm)',
                      backgroundColor: '#000'
                    }}>
                      <iframe
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          border: 'none'
                        }}
                        src="https://www.youtube.com/embed/g6jU9S704nU"
                        title="Curso de Barista Profesional - Don Guto"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>

                    {/* Notas Rápidas de Video */}
                    <div style={{
                      backgroundColor: 'var(--bg-main)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px 15px',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--secondary)' }}>
                        📝 Apuntes Operativos de Video:
                      </span>
                      <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '10.5px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', lineHeight: 1.4 }}>
                        <li><strong>Limpieza de vaporizador:</strong> Limpiar con trapo húmedo inmediatamente antes y después de texturizar, y purgar por 1 segundo.</li>
                        <li><strong>Calidad de la crema:</strong> Mover suavemente la jarra en círculos para homogeneizar la espuma con el líquido antes del vertido.</li>
                        <li><strong>Extracción perfecta:</strong> Observa la caída del espresso, debe comenzar oscura y pasar a tonos avellana (crema de tigre).</li>
                      </ul>
                    </div>

                    {/* Mensaje Informativo */}
                    <div style={{
                      fontSize: '10px',
                      color: 'var(--text-muted)',
                      textAlign: 'center',
                      borderTop: '1px solid var(--border)',
                      paddingTop: '12px',
                      marginTop: 'auto'
                    }}>
                      <span>¿Tienes dudas técnicas? Escríbele al Supervisor para una sesión práctica de reforzamiento.</span>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        );
      })()}



    </div>
  );
}

