import React, { useState, useEffect } from 'react';
import IncidentForm from './incidents/IncidentForm';
import IncidentList from './incidents/IncidentList';
import BiometricScanner from './attendance/BiometricScanner';
import AttendanceLogs from './attendance/AttendanceLogs';
import { createPortal } from 'react-dom';
import SensoryProfile from './SensoryProfile';
import CartaDigital from './CartaDigital';
import DailyChecklist from './cleaning/DailyChecklist';
import WeeklyCleaning from './cleaning/WeeklyCleaning';
import MonthlyCleaning from './cleaning/MonthlyCleaning';

const GENERAL_TRAINING_COURSES = [
  {
    id: 'GEN-1',
    titulo: 'Atención y Servicio al Cliente',
    title: 'Atención y Servicio al Cliente',
    codigo: 'DG-MAN-GEN1',
    duracion: '30 min',
    modalidad: 'Teórico-Práctico',
    descripcion: 'Aprende los protocolos de hospitalidad Don Guto: la bienvenida, la comunicación asertiva, el cobro y la resolución de quejas.',
    videoUrl: 'https://www.youtube.com/embed/PdtP1yGv9jI',
    sections: [
      {
        subtitle: '1. El Saludo Don Guto',
        content: 'La primera impresión es clave. Todo cliente debe recibir un saludo sonriente y entusiasta en los primeros 5 segundos tras ingresar a la tienda. El saludo estándar es: "¡Hola! Bienvenidos a Don Guto. ¿Cómo están hoy?". Mantén contacto visual directo.'
      },
      {
        subtitle: '2. Escucha Activa y Recomendación',
        content: 'Pregunta al cliente por sus gustos. ¿Le gusta el café intenso o suave? ¿Con leche o negro? Utiliza esta información para recomendar un café de especialidad de nuestra carta o uno de los postres artesanales para acompañar.'
      },
      {
        subtitle: '3. Manejo de Clientes Insatisfechos (Protocolo LAST)',
        content: 'Cuando haya un error en el pedido o queja: L (Listen - Escucha con atención sin interrumpir), A (Apologize - Pide disculpas sinceramente por el inconveniente), S (Solve - Ofrece una solución inmediata como cambiar la bebida), T (Thank - Agradece al cliente por hacernos saber del inconveniente para mejorar).'
      }
    ]
  },
  {
    id: 'GEN-2',
    titulo: 'Buenas Prácticas de Manufactura (BPM) e Higiene',
    title: 'Buenas Prácticas de Manufactura (BPM) e Higiene',
    codigo: 'DG-MAN-GEN2',
    duracion: '45 min',
    modalidad: 'Teórico',
    descripcion: 'Normas fundamentales para garantizar la seguridad alimentaria en barra, cocina y salón.',
    videoUrl: 'https://www.youtube.com/embed/Lg_Qz1_H1gA',
    sections: [
      {
        subtitle: '1. Lavado y Desinfección de Manos',
        content: 'El lavado de manos debe realizarse por lo menos cada 30 minutos o inmediatamente después de: cambiar de actividad, usar el servicio higiénico, manipular basura, tocar dinero o tocarse la cara/cabello. Usa agua caliente, jabón desinfectante y frota por 20 segundos.'
      },
      {
        subtitle: '2. Regla FIFO (PEPS - Primero en Entrar, Primero en Salir)',
        content: 'Todo producto o insumo alimentario en barra y cocina debe rotularse con la fecha de preparación y fecha de vencimiento. Lo primero que ingresa al almacén o refrigerador debe ser lo primero que se utiliza para evitar mermas y contaminación.'
      },
      {
        subtitle: '3. Evitar la Contaminación Cruzada',
        content: 'Usa tablas de picar diferentes para carnes/panes y vegetales (Verde para vegetales, Roja para carnes preparadas/embutidos, Blanca para lácteos/pan). Los trapos de limpieza deben desinfectarse en soluciones de cloro y cambiarse diariamente.'
      }
    ]
  },
  {
    id: 'GEN-3',
    titulo: 'Cultura Corporativa y Misión Don Guto',
    title: 'Cultura Corporativa y Misión Don Guto',
    codigo: 'DG-MAN-GEN3',
    duracion: '20 min',
    modalidad: 'Teórico',
    descripcion: 'Conoce los pilares de la marca: café de especialidad de comercio directo y compromiso con la calidad.',
    videoUrl: 'https://www.youtube.com/embed/g6jU9S704nU',
    sections: [
      {
        subtitle: '1. Misión y Valores',
        content: 'Nuestra misión es conectar a los productores de café peruanos de alta calidad con el consumidor urbano, brindando una experiencia excepcional en cada taza. Nuestros valores clave son la Pasión, Integridad, Calidad y Trabajo en Equipo.'
      },
      {
        subtitle: '2. Comercio Directo (Direct Trade)',
        content: 'En Don Guto no compramos café a intermediarios genéricos. Trabajamos directamente con caficultores de Jaén, Villa Rica y Cusco, garantizándoles un pago justo por encima del mercado y fomentando prácticas agrícolas sostenibles.'
      }
    ]
  },
  {
    id: 'GEN-4',
    titulo: 'Seguridad y Salud en el Trabajo',
    title: 'Seguridad y Salud en el Trabajo',
    codigo: 'DG-MAN-GEN4',
    duracion: '30 min',
    modalidad: 'Práctico',
    descripcion: 'Pautas para prevenir quemaduras, cortes, caídas y mantener una ergonomía de barra correcta.',
    videoUrl: 'https://www.youtube.com/embed/3yU2Z-17nOQ',
    sections: [
      {
        subtitle: '1. Prevención de Quemaduras',
        content: 'El vaporizador de la máquina de espresso alcanza temperaturas elevadas. Nunca coloquases las manos cerca de la boquilla mientras vaporizas. Al purgar el vaporizador, dirígelo siempre hacia la bandeja de goteo.'
      },
      {
        subtitle: '2. Ergonomía en Barra',
        content: 'Al compactar el café (tampado), mantén el codo en un ángulo de 90 grados y aplica la fuerza con el hombro, no con la muñeca. Al levantar cajas de leche u otros suministros pesados, dobla las rodillas y mantén la espalda recta.'
      }
    ]
  }
];

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
    title: 'Estudio Autónomo de Carta y Manuales Operativos',
    codigo: 'DG-MAN-D3',
    sections: [
      {
        subtitle: '1. Estudio de la Carta de Bebidas y Alimentos',
        content: 'Estudio detallado de la carta oficial de Don Guto: tipos de bebidas calientes, frías, opciones de pastelería, alérgenos comunes y maridajes sugeridos para guiar al cliente en su compra.'
      },
      {
        subtitle: '2. Manuales de Flujos Operativos y Servicio',
        content: 'Memorización de los flujos de servicio: protocolo de bienvenida al cliente, toma de pedido ágil en caja, flujos de comanda a barra o cocina, entrega de bebidas en mesa, estándares de limpieza de mesas y el protocolo de despedida.'
      },
      {
        subtitle: '3. Políticas Internas y Estándares de Higiene',
        content: 'Estudio del manual de políticas internas: puntualidad estricta (10 minutos antes del turno), uniforme completo en todo momento, y lavado y desinfección obligatoria de manos cada 20 minutos.'
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
    title: 'Día Sombra I: Soporte de Barra y Recetas',
    codigo: 'DG-MAN-D5',
    sections: [
      {
        subtitle: '1. El Rol de Sombra y Práctica de Soporte',
        content: 'Durante tu primer turno práctico de 8 horas en tienda, tu función es observar de manera atenta y pasiva la dinámica operativa de un Barista Senior. Darás soporte clave en tareas básicas: reposición de insumos, secado de vajilla y mantenimiento del counter.'
      },
      {
        subtitle: '2. Estudio de Recetas de Espresso y Texturización',
        content: 'Estudio y práctica en tiempo real del recetario oficial de Don Guto:\n• Dosis de Café Seco (In): 18.0 gramos (tolerancia de +/- 0.1g).\n• Rendimiento en Líquido (Out): 36.0g a 39.5g en taza.\n• Tiempo de Extracción: 25 a 29 segundos.\n• Ratio de Extracción: 1:2.0 a 1:2.2.\n• Texturización de Leche: Temperatura de servicio de 60°C a 65°C, microespuma elástica, densa y brillante, sin burbujas visibles.'
      },
      {
        subtitle: '3. Rotulado de Insumos y Tiempos de Vida Útil',
        content: 'Práctica de rotulado con: Nombre de insumo, fecha/hora de preparación, iniciales del colaborador y fecha de vencimiento. Tiempos máximos de vida útil:\n• Jarabes Simples/Saborizados: 7 días en refrigeración.\n• Fudge y Salsa de Chocolate: 5 días en refrigeración.\n• Coulis de Fresa: 3 días en refrigeración.'
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
  '28 de Julio Miraflores': '190.235.88.99'
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
  const [selectedDayMaterial, setSelectedDayMaterial] = useState(null);
  const [cleaningSubTab, setCleaningSubTab] = useState('semanal'); // 'semanal' | 'mensual'
  const [eduSubTab, setEduSubTab] = useState('general');
  const [incidentSubTab, setIncidentSubTab] = useState('instructions');
  const [incSuccessMsg, setIncSuccessMsg] = useState('');
  const [userIp, setUserIp] = useState('Obteniendo IP...');
  const [selectedWifi, setSelectedWifi] = useState('external'); // '28 de Julio Miraflores' | 'external'

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
      q: '1. ¿Qué opciones de jugos tenemos en la carta?',
      options: [
        { label: 'A) Solo jugo de papaya y naranja embotellado.', val: 'A' },
        { label: 'B) Jugo de Naranja Natural, Limonada Imperial y Jugos de Temporada (fresa/maracuyá con agua o leche).', val: 'B' },
        { label: 'C) Solo refrescos gasificados y agua mineral.', val: 'C' },
        { label: 'D) Licuado de plátano y papaya únicamente.', val: 'D' }
      ],
      correct: 'B'
    },
    {
      id: 2,
      q: '2. Menciona los ingredientes del sándwich Trilogía de Jamones:',
      options: [
        { label: 'A) Jamón de pavo, tocino y lechuga en pan blanco.', val: 'A' },
        { label: 'B) Jamón inglés, jamón del país, jamón serrano y queso fundido en pan de masa madre rústico.', val: 'B' },
        { label: 'C) Jamón cocido, queso edam y mantequilla de ajo.', val: 'C' },
        { label: 'D) Jamón ahumado, piña y queso mozzarella.', val: 'D' }
      ],
      correct: 'B'
    },
    {
      id: 3,
      q: '3. ¿Cuáles son los ingredientes de Teriyaki Chicken y Capresse en la carta?',
      options: [
        { label: 'A) Pollo hervido con mayonesa / Jamón con piña.', val: 'A' },
        { label: 'B) Filete de pollo en salsa teriyaki casera, sésamo y cebollín / Queso mozzarella, rodajas de tomate, albahaca fresca y reducción de balsámico.', val: 'B' },
        { label: 'C) Pollo a la brasa deshilachado / Queso crema con aceitunas y pimientos.', val: 'C' },
        { label: 'D) Pollo crujiente con miel / Queso parmesano con espinaca y ajo.', val: 'D' }
      ],
      correct: 'B'
    },
    {
      id: 4,
      q: '4. ¿Cuáles son los ingredientes de Avocado Chicken Grill?',
      options: [
        { label: 'A) Pollo deshilachado, apio y trozos de palta con aliño de limón.', val: 'A' },
        { label: 'B) Pechuga de pollo a la parrilla, láminas de palta (aguacate) fresca, tomate, lechuga y salsa de la casa.', val: 'B' },
        { label: 'C) Filete de pollo apanado con salsa guacamole y cebolla encurtida.', val: 'C' },
        { label: 'D) Pollo a la plancha, puré de palta picante y queso cheddar.', val: 'D' }
      ],
      correct: 'B'
    },
    {
      id: 5,
      q: '5. Nombra las opciones de frappé de la carta:',
      options: [
        { label: 'A) Frappé de Fresa y Frappé de Mango.', val: 'A' },
        { label: 'B) Frappé de Espresso Clásico, Frappé de Moka, Frappé de Caramelo y Frappé de Oreo.', val: 'B' },
        { label: 'C) Solo Frapuccino de vainilla.', val: 'C' },
        { label: 'D) Frappé de maracuyá y lúcuma.', val: 'D' }
      ],
      correct: 'B'
    },
    {
      id: 6,
      q: '6. ¿Qué topping incluyen los Huevos al Guto?',
      options: [
        { label: 'A) Queso cheddar fundido y trocitos de chorizo.', val: 'A' },
        { label: 'B) Palta en cubos, tocino crocante picado, cebollín y un toque de brotes frescos.', val: 'B' },
        { label: 'C) Champiñones salteados y perejil fresco.', val: 'C' },
        { label: 'D) Huevo frito extra y salsa barbacoa.', val: 'D' }
      ],
      correct: 'B'
    },
    {
      id: 7,
      q: '7. Menciona las opciones de ensaladas de la carta:',
      options: [
        { label: 'A) Ensalada de fideos fría y ensalada rusa tradicional.', val: 'A' },
        { label: 'B) Ensalada César Don Guto, Ensalada Caprese Especial y Ensalada Andina de Quinua.', val: 'B' },
        { label: 'C) Solo ensalada verde simple (lechuga y tomate).', val: 'C' },
        { label: 'D) Ensalada Waldorf de manzana y Ensalada de papa con pollo.', val: 'D' }
      ],
      correct: 'B'
    },
    {
      id: 8,
      q: '8. Describe una pizza de la carta de Don Guto:',
      options: [
        { label: 'A) Pizza americana clásica con masa gruesa industrial, queso mozzarella y jamón de pizzería.', val: 'A' },
        { label: 'B) Pizza de masa madre estirada a mano, salsa pomodoro artesanal, queso mozzarella y toppings premium (como jamón serrano y rúcula).', val: 'B' },
        { label: 'C) Pizza hawaiana con piña en almíbar, cerezas y jamón ahumado dulce.', val: 'C' },
        { label: 'D) Pizza congelada pre-cocida horneada al instante.', val: 'D' }
      ],
      correct: 'B'
    },
    {
      id: 9,
      q: '9. Describe un tostón de la carta de Don Guto:',
      options: [
        { label: 'A) Rodaja de plátano verde frito y aplastado, típico de la selva.', val: 'A' },
        { label: 'B) Rebanada gruesa de pan de masa madre tostada a la plancha con palta machacada, huevo pochado y semillas.', val: 'B' },
        { label: 'C) Pan de molde tostado untado con mantequilla y mermelada comercial.', val: 'C' },
        { label: 'D) Tostada francesa con canela y miel de maple.', val: 'D' }
      ],
      correct: 'B'
    },
    {
      id: 10,
      q: '10. Dime los Pasos de Servicio obligatorios en Don Guto:',
      options: [
        { label: 'A) Saludo corto, entregar ticket y pedir que retiren el pedido en el counter.', val: 'A' },
        { label: 'B) Secuencia de Hospitalidad: Recibir con saludo cálido, entregar la carta sugiriendo especialidades, tomar orden repitiendo detalles, servir el pedido amablemente, consultar conformidad ("¿Todo conforme?") y despedir afectuosamente.', val: 'B' },
        { label: 'C) Atender únicamente a través de la tablet o pantalla táctil de auto-servicio sin interactuar.', val: 'C' },
        { label: 'D) Saludar, cobrar por adelantado y no realizar seguimiento en mesa.', val: 'D' }
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

  const renderCleaningCalendar = () => {
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

        {cleaningSubTab === 'semanal' ? (
          <WeeklyCleaning
            cleaningTasks={cleaningTasks}
            onSaveCleaning={onSaveCleaning}
          />
        ) : (
          <MonthlyCleaning
            cleaningTasks={cleaningTasks}
            onSaveCleaning={onSaveCleaning}
          />
        )}
      </div>
    );
  };

  // Render Training Route (8 days)
  const renderEducationSection = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--secondary)' }}>Centro de Educación y Capacitación</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
              Accede a los manuales de entrenamiento y revisa la ruta de capacitación técnica de baristas.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-main)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <button
              onClick={() => setEduSubTab('general')}
              style={{
                padding: '6px 16px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                backgroundColor: eduSubTab === 'general' ? 'var(--primary)' : 'transparent',
                color: eduSubTab === 'general' ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.2s'
              }}
            >
              📖 Capacitaciones Generales
            </button>
            <button
              onClick={() => setEduSubTab('barista_route')}
              style={{
                padding: '6px 16px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                backgroundColor: eduSubTab === 'barista_route' ? 'var(--primary)' : 'transparent',
                color: eduSubTab === 'barista_route' ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.2s'
              }}
            >
              ☕ Ruta de Baristas (Completado)
            </button>
          </div>
        </div>

        {eduSubTab === 'general' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {GENERAL_TRAINING_COURSES.map(course => (
              <div
                key={course.id}
                style={{
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
                    {course.modalidad}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    ⏱ {course.duracion}
                  </span>
                </div>
                <h4 style={{ margin: 0, color: 'var(--text-main)', fontSize: '14px', fontWeight: 700 }}>{course.titulo}</h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, flex: 1 }}>{course.descripcion}</p>
                <button
                  onClick={() => setSelectedDayMaterial({
                    id: course.id,
                    dia: course.titulo,
                    titulo: course.titulo,
                    sections: course.sections,
                    manualGenerico: true,
                    duracion: course.duracion,
                    modalidad: course.modalidad,
                    estado: 'Completado'
                  })}
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '8px', fontSize: '12px', fontWeight: 'bold' }}
                >
                  📖 Ver Material de Capacitación
                </button>
              </div>
            ))}
          </div>
        )}

        {eduSubTab === 'barista_route' && (
          <div>
            <div style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)', border: '1px solid var(--success)', padding: '10px 15px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>✅ Todos los baristas actuales están plenamente capacitados. La ruta se muestra aprobada en verde.</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
              {trainingRoute.map((day) => {
                const statusColor = { bg: 'var(--success-light)', text: 'var(--success)', border: 'var(--success)' };
                
                return (
                  <div
                    key={day.id}
                    onClick={() => {
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
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                    className="training-route-card"
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
                        Aprobado ✓
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
        )}
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
          Educación
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

            <DailyChecklist
              user={user}
              checklists={checklists}
              onSaveTask={onSaveTask}
            />
          </div>
        )}

        {activeTab === 'cleaning' && renderCleaningCalendar()}

        {activeTab === 'route' && renderEducationSection()}

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

                <BiometricScanner
                  user={user}
                  biometricDevices={biometricDevices}
                  onBiometricScan={onBiometricScan}
                />
              </div>

              {/* Attendance Logs History Table */}
              <div className="card" style={{ padding: '20px', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: 'var(--text-main)' }}>
                  📋 Historial de Asistencia
                </h4>
                <AttendanceLogs arrivalLogs={arrivalLogs} />
              </div>
            </div>
          );
        })()}        {activeTab === 'incidents' && (() => {
          const sortedStoreIncidents = [...(incidents || [])]
            .filter(inc => inc.store === user.store)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

          const myIncidents = [...(incidents || [])]
            .filter(inc => inc.reporterUsername === user.username || inc.reporterEmail === user.username)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
              <div style={{ borderBottom: '2px solid var(--border)', paddingBottom: '10px' }}>
                <h3 style={{ margin: 0, color: 'var(--primary)' }}>Control de Incidencias y Mantenimiento</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                  Reporta averías de equipos, necesidades de insumos o problemas del local al Administrador.
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
                  <IncidentForm 
                    user={user} 
                    onAddIncident={onAddIncident} 
                    onSubmitSuccess={() => {
                      setIncSuccessMsg('¡Incidencia registrada con éxito y notificada al Administrador!');
                      setTimeout(() => setIncSuccessMsg(''), 5000);
                      setIncidentSubTab('my_reports');
                    }}
                  />
                )}

                {incidentSubTab === 'my_reports' && (
                  <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: 'var(--text-main)' }}>
                      👤 Mis Incidencias Generadas (Reportadas por Mí)
                    </h4>
                    <IncidentList list={myIncidents} noDataMsg="No has registrado ninguna incidencia personal aún." />
                  </div>
                )}

                {incidentSubTab === 'store_history' && (
                  <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: 'var(--text-main)' }}>
                      📋 Historial Operativo de la Sede ({user.store})
                    </h4>
                    <IncidentList list={sortedStoreIncidents} noDataMsg="No hay incidencias registradas en esta sede." />
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Modal de Capacitación (PDF + Video) */}
      {selectedDayMaterial && createPortal(
        (() => {
          const manual = selectedDayMaterial.manualGenerico ? selectedDayMaterial : MANUALS_BY_DAY[selectedDayMaterial.id];
          return (
            <div className="edu-modal-backdrop" onClick={handleCloseModal}>
            <style dangerouslySetInnerHTML={{__html: `
              .edu-modal-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(30, 24, 22, 0.75);
                backdrop-filter: blur(6px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999; /* Set extremely high to override top navigation bar */
                padding: 24px;
                animation: eduFadeIn 0.25s ease-out;
              }
              
              .edu-modal-container {
                background-color: var(--bg-main);
                border-radius: var(--radius-lg);
                max-width: 1100px;
                width: 100%;
                max-height: 88vh;
                display: flex;
                flex-direction: column;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
                border: 1px solid var(--border);
                overflow: hidden;
                animation: eduScaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
              }
              
              .modal-split-container {
                flex: 1;
                display: flex;
                flex-direction: row;
                overflow: hidden;
                background-color: #eae4dc;
              }
              
              .modal-left-pdf {
                width: 55%;
                padding: 30px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                align-items: center;
                background-color: #f1ebd9;
                border-right: 1px solid var(--border);
                max-height: calc(88vh - 70px);
              }
              
              .modal-right-video {
                width: 45%;
                padding: 30px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 20px;
                background-color: var(--bg-card);
                max-height: calc(88vh - 70px);
              }
              
              .pdf-page-container {
                background-color: #fffcf7;
                width: 100%;
                max-width: 600px;
                padding: 40px 30px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                border-radius: 6px;
                border: 1px solid #dcd3c9;
                font-family: inherit;
                color: #2a2220;
                line-height: 1.6;
                position: relative;
                min-height: 520px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                flex-shrink: 0;
              }
              
              .edu-modal-close-btn {
                border: none;
                background-color: var(--bg-card);
                border-radius: 50%;
                width: 34px;
                height: 34px;
                font-size: 16px;
                color: var(--text-main);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                border: 1px solid var(--border);
                box-shadow: var(--shadow-sm);
              }
              
              .edu-modal-close-btn:hover {
                background-color: var(--primary);
                color: #fff;
                border-color: var(--primary);
                transform: rotate(90deg);
              }
              
              @keyframes eduFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              
              @keyframes eduScaleIn {
                from { transform: scale(0.95); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
              }
              
              /* Tablets & smaller screens */
              @media (max-width: 950px) {
                .edu-modal-backdrop {
                  padding: 16px;
                }
                .modal-left-pdf, .modal-right-video {
                  padding: 20px;
                }
                .pdf-page-container {
                  padding: 30px 20px;
                }
              }
              
              /* Mobile responsive stacking */
              @media (max-width: 800px) {
                .edu-modal-backdrop {
                  padding: 0 !important;
                }
                .edu-modal-container {
                  max-height: 100vh !important;
                  height: 100% !important;
                  border-radius: 0 !important;
                  border: none !important;
                }
                .modal-split-container {
                  flex-direction: column !important;
                  overflow-y: auto !important;
                }
                .modal-left-pdf, .modal-right-video {
                  width: 100% !important;
                  max-height: none !important;
                  overflow-y: visible !important;
                  padding: 20px !important;
                }
                .modal-left-pdf {
                  border-right: none !important;
                  border-bottom: 2px solid var(--border);
                }
                .pdf-page-container {
                  box-shadow: none !important;
                  border-radius: 0 !important;
                  margin: 0 !important;
                  border: none !important;
                  width: 100% !important;
                  max-width: 100% !important;
                  min-height: auto !important;
                  padding: 10px 0 !important;
                  background-color: transparent !important;
                }
              }
            `}} />
            <div className="edu-modal-container" onClick={(e) => e.stopPropagation()}>
              
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
                  className="edu-modal-close-btn"
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
                  <div className="modal-left-pdf">
                    {/* Exam Sheet container */}
                    <div className="pdf-page-container" style={{ fontFamily: 'sans-serif', gap: '25px' }}>
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
                  <div className="modal-right-video">
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
                <div className="modal-split-container">

                  {/* Columna Izquierda: Simulación de PDF (A4 Page) */}
                  <div className="modal-left-pdf">
                    {/* Contenedor A4 Simulado */}
                    <div className="pdf-page-container" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
                      
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
                  <div className="modal-right-video">
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
                        src={manual?.videoUrl || "https://www.youtube.com/embed/g6jU9S704nU"}
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
      })(),
      document.body
    )}



    </div>
  );
}

