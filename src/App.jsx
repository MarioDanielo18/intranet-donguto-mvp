import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import ColaboradorDashboard from './components/ColaboradorDashboard';
import SupervisorDashboard from './components/SupervisorDashboard';
import IncidentDetailStandalone from './components/IncidentDetailStandalone';

// Initialize mock data directly from Don Guto excel specs
const INITIAL_CHECKLISTS = [
  // BARISTAS - APERTURA
  { id: 'B-AP-1', area: 'BARRA', tipo_turno: 'APERTURA', descripcion: 'Colocarse el uniforme correctamente, tomarse foto grupal y enviarla por el grupo de tienda.', requiere_foto: true, completado: false },
  { id: 'B-AP-2', area: 'BARRA', tipo_turno: 'APERTURA', descripcion: 'Encender la máquina de espresso y molino. Encender luces de vitrinas de postres y galletas.', requiere_foto: true, completado: false },
  { id: 'B-AP-3', area: 'BARRA', tipo_turno: 'APERTURA', descripcion: 'Enjuagar los trapos en remojo. Secar vajilla del cierre anterior.', requiere_foto: true, completado: false },
  { id: 'B-AP-4', area: 'BARRA', tipo_turno: 'APERTURA', descripcion: 'Purgar la máquina del café con los residuos del día anterior en el molino.', requiere_foto: true, completado: false },
  { id: 'B-AP-5', area: 'BARRA', tipo_turno: 'APERTURA', descripcion: 'Calibrar la máquina de espresso (en base a la identidad Don Guto) y reportar stock de café.', requiere_foto: true, completado: false },
  { id: 'B-AP-6', area: 'BARRA', tipo_turno: 'APERTURA', descripcion: 'Realizar inventario de barra and postres, rotular insumos y hacer requerimiento de pedido (antes 10 am).', requiere_foto: true, completado: false },
  { id: 'B-AP-7', area: 'BARRA', tipo_turno: 'APERTURA', descripcion: 'Revisar el check list de limpieza profunda y verificar su cumplimiento.', requiere_foto: true, completado: false },
  { id: 'B-AP-8', area: 'BARRA', tipo_turno: 'APERTURA', descripcion: 'Verificar insumos altamente perecibles (postres) con su ficha técnica y fechas de vencimiento.', requiere_foto: true, completado: false },
  { id: 'B-AP-9', area: 'BARRA', tipo_turno: 'APERTURA', descripcion: 'Revisar el stock y calidad de salsas (coulis, fudge, jarabes de refrescantes).', requiere_foto: true, completado: false },
  { id: 'B-AP-10', area: 'BARRA', tipo_turno: 'APERTURA', descripcion: 'Informar los productos agotados o sugeridos (86 - 85) al equipo de servicio y administración.', requiere_foto: true, completado: false },
  { id: 'B-AP-11', area: 'BARRA', tipo_turno: 'APERTURA', descripcion: 'Abastecer y decorar postres/galletas en exhibidoras. Abastecer menaje para llevar.', requiere_foto: true, completado: false },
  { id: 'B-AP-12', area: 'BARRA', tipo_turno: 'APERTURA', descripcion: 'Preparar cold brew (si es necesario).', requiere_foto: true, completado: false },
  { id: 'B-AP-13', area: 'BARRA', tipo_turno: 'APERTURA', descripcion: 'Mantener limpieza y orden dentro del turno.', requiere_foto: true, completado: false },
  { id: 'B-AP-14', area: 'BARRA', tipo_turno: 'APERTURA', descripcion: 'Lavar vajilla de barra y postres.', requiere_foto: true, completado: false },
  { id: 'B-AP-15', area: 'BARRA', tipo_turno: 'APERTURA', descripcion: 'Seguir estrictamente las recetas de barra para bebidas.', requiere_foto: true, completado: false },
  
  // BARISTAS - RELEVO
  { id: 'B-RL-1', area: 'BARRA', tipo_turno: 'RELEVO', descripcion: 'Entregar el turno al personal del cierre comunicando 86, 85 y venta sugestiva.', requiere_foto: true, completado: false },
  { id: 'B-RL-2', area: 'BARRA', tipo_turno: 'RELEVO', descripcion: 'Entregar mesas de trabajo, máquina de café limpia y menaje lavado y secado.', requiere_foto: true, completado: false },
  { id: 'B-RL-3', area: 'BARRA', tipo_turno: 'RELEVO', descripcion: 'Limpieza de área: Barrido, trapeado y cambio de bolsas de basura.', requiere_foto: true, completado: false },
  
  // BARISTAS - CIERRE
  { id: 'B-CI-1', area: 'BARRA', tipo_turno: 'CIERRE', descripcion: 'Ordenar y abastecer la vitrina de postres y galletas.', requiere_foto: true, completado: false },
  { id: 'B-CI-2', area: 'BARRA', tipo_turno: 'CIERRE', descripcion: 'Lavar y secar vajilla de barra.', requiere_foto: true, completado: false },
  { id: 'B-CI-3', area: 'BARRA', tipo_turno: 'CIERRE', descripcion: 'Pre-inventario del área de refrigeración y congelación en hoja aparte.', requiere_foto: true, completado: false },
  { id: 'B-CI-4', area: 'BARRA', tipo_turno: 'CIERRE', descripcion: 'Limpiar un grupo de la máquina de espresso a las 9:30 pm.', requiere_foto: true, completado: false },
  { id: 'B-CI-5', area: 'BARRA', tipo_turno: 'CIERRE', descripcion: 'Poner trapos y secadores a remojar en 2 bowls (separados).', requiere_foto: true, completado: false },
  { id: 'B-CI-6', area: 'BARRA', tipo_turno: 'CIERRE', descripcion: 'Limpiar el otro grupo a las 9:55 pm.', requiere_foto: true, completado: false },
  { id: 'B-CI-7', area: 'BARRA', tipo_turno: 'CIERRE', descripcion: 'Limpiar la máquina de espresso a detalle.', requiere_foto: true, completado: false },
  { id: 'B-CI-8', area: 'BARRA', tipo_turno: 'CIERRE', descripcion: 'Hacer el inventario final en el formato y registrar mermas.', requiere_foto: true, completado: false },
  { id: 'B-CI-9', area: 'BARRA', tipo_turno: 'CIERRE', descripcion: 'Colocar café sobrante en tolva en frasco y limpiar la tolva del molino.', requiere_foto: true, completado: false },
  { id: 'B-CI-10', area: 'BARRA', tipo_turno: 'CIERRE', descripcion: 'Apagar máquina espresso, molino, luces de vitrina y botar basura.', requiere_foto: true, completado: false },
  { id: 'B-CI-11', area: 'BARRA', tipo_turno: 'CIERRE', descripcion: 'Trapear el piso del área con agua y detergente.', requiere_foto: true, completado: false },
  { id: 'B-CI-12', area: 'BARRA', tipo_turno: 'CIERRE', descripcion: 'Enviar evidencia fotográfica del cierre en el grupo general de Whatsapp.', requiere_foto: true, completado: false },
  { id: 'B-CI-13', area: 'BARRA', tipo_turno: 'CIERRE', descripcion: 'Subir estados a redes personales etiquetando a la marca (min 3 veces/semana).', requiere_foto: true, completado: false },
  { id: 'B-CI-14', area: 'BARRA', tipo_turno: 'CIERRE', descripcion: 'Atender dentro de los estándares de servicio y recetas de la marca.', requiere_foto: true, completado: false },
  { id: 'B-CI-15', area: 'BARRA', tipo_turno: 'CIERRE', descripcion: 'Realizar la limpieza profunda de la exhibidora de galletas.', requiere_foto: true, completado: false },
  { id: 'B-CI-16', area: 'BARRA', tipo_turno: 'CIERRE', descripcion: 'Realizar la limpieza de la vitrina de postres.', requiere_foto: true, completado: false },
  { id: 'B-CI-17', area: 'BARRA', tipo_turno: 'CIERRE', descripcion: 'Realizar la limpieza de la mesa de trabajo de barra.', requiere_foto: true, completado: false },
  { id: 'B-CI-18', area: 'BARRA', tipo_turno: 'CIERRE', descripcion: 'Realizar la limpieza por debajo del horno de barra.', requiere_foto: true, completado: false },
  { id: 'B-CI-19', area: 'BARRA', tipo_turno: 'CIERRE', descripcion: 'Realizar el lavado de los tachos de basura del área de barra.', requiere_foto: true, completado: false },
  { id: 'B-CI-20', area: 'BARRA', tipo_turno: 'CIERRE', descripcion: 'Lavar los filtros de café y porta-filtros con Pulicaff.', requiere_foto: true, completado: false },
  
  // COCINA - APERTURA
  { id: 'K-AP-1', area: 'COCINA', tipo_turno: 'APERTURA', descripcion: 'Colocarse el uniforme correctamente (polo, mandil, gorra) y desinfectarse.', requiere_foto: true, completado: false },
  { id: 'K-AP-2', area: 'COCINA', tipo_turno: 'APERTURA', descripcion: 'Guardar accesorios personales (pulseras, relojes) antes de ingresar.', requiere_foto: true, completado: false },
  { id: 'K-AP-3', area: 'COCINA', tipo_turno: 'APERTURA', descripcion: 'Encender hornos y freidora. Verificar cilindros de gas.', requiere_foto: true, completado: false },
  { id: 'K-AP-4', area: 'COCINA', tipo_turno: 'APERTURA', descripcion: 'Revisar equipos de frío (conservadores a 3°-4°C y congeladores a -16° a -18°C).', requiere_foto: true, completado: false },
  { id: 'K-AP-5', area: 'COCINA', tipo_turno: 'APERTURA', descripcion: 'Lavar y desinfectar tablas de picar, mesas de trabajo y trapos.', requiere_foto: true, completado: false },
  { id: 'K-AP-6', area: 'COCINA', tipo_turno: 'APERTURA', descripcion: 'Hacer inventario de cocina y emitir requerimiento de pedidos (si aplica).', requiere_foto: true, completado: false },
  { id: 'K-AP-7', area: 'COCINA', tipo_turno: 'APERTURA', descripcion: 'Revisar fechas de vencimiento y rotulado de materias primas.', requiere_foto: true, completado: false },
  { id: 'K-AP-8', area: 'COCINA', tipo_turno: 'APERTURA', descripcion: 'Tener listo el mice and place de verduras, filetes y salsas fechadas.', requiere_foto: true, completado: false },

  // COCINA - RELEVO
  { id: 'K-RL-1', area: 'COCINA', tipo_turno: 'RELEVO', descripcion: 'Entregar el turno al personal del cierre: Comunicando los 86, 85 y sugestiva.', requiere_foto: true, completado: false },
  { id: 'K-RL-2', area: 'COCINA', tipo_turno: 'RELEVO', descripcion: 'Entregar las áreas limpias y ordenadas: Mesas de trabajo, máquinas de fríos, cocina, menaje lavado y secado.', requiere_foto: true, completado: false },
  { id: 'K-RL-3', area: 'COCINA', tipo_turno: 'RELEVO', descripcion: 'Limpieza de área: Barrido y trapeado / Cambio de bolsas de basura.', requiere_foto: true, completado: false },

  // COCINA - CIERRE
  { id: 'K-CI-1', area: 'COCINA', tipo_turno: 'CIERRE', descripcion: 'Limpiar y desinfectar utensilios de cocina.', requiere_foto: true, completado: false },
  { id: 'K-CI-2', area: 'COCINA', tipo_turno: 'CIERRE', descripcion: 'Abastecimiento de insumos y producción para el turno siguiente.', requiere_foto: true, completado: false },
  { id: 'K-CI-3', area: 'COCINA', tipo_turno: 'CIERRE', descripcion: 'Guardar insumos y rotularlos correctamente con fecha de vencimiento.', requiere_foto: true, completado: false },
  { id: 'K-CI-4', area: 'COCINA', tipo_turno: 'CIERRE', descripcion: 'Lavado de tachos internos y trapeado general del piso de cocina.', requiere_foto: true, completado: false },
  { id: 'K-CI-5', area: 'COCINA', tipo_turno: 'CIERRE', descripcion: 'Registrar la merma de cocina en el formato físico.', requiere_foto: true, completado: false },
  { id: 'K-CI-6', area: 'COCINA', tipo_turno: 'CIERRE', descripcion: 'Sacar la basura y apagar todos los hornos, freidora y gas.', requiere_foto: true, completado: false },

  // SALON - APERTURA
  { id: 'S-AP-1', area: 'SALON', tipo_turno: 'APERTURA', descripcion: 'Colocarse el uniforme correctamente - polo de la marca, mandil de la marca, toca y gorra de la marca.', requiere_foto: true, completado: false },
  { id: 'S-AP-2', area: 'SALON', tipo_turno: 'APERTURA', descripcion: 'Luces de salon encendidas, tablet, musica(playlist y volumen correcto) computadora, aplicaciones y cuadre de caja - Informar al administrador si existe alguna anomalia o necesidad de mantenimiento.', requiere_foto: true, completado: false },
  { id: 'S-AP-3', area: 'SALON', tipo_turno: 'APERTURA', descripcion: 'Limpieza de mesas y sillas - Limpieza con limpiatodo de mesas y verificar que las sillas y sillon esten libres de residuos.', requiere_foto: true, completado: false },
  { id: 'S-AP-4', area: 'SALON', tipo_turno: 'APERTURA', descripcion: 'Limpieza de salón, terraza y directorios - Barrido y trapeado.', requiere_foto: true, completado: false },
  { id: 'S-AP-5', area: 'SALON', tipo_turno: 'APERTURA', descripcion: 'Limpieza de SSHH. - Limpieza de inodoros y caños (con limpiatodo y lejia), porta papel toalla, porta jabon, dispensador de papel higienico, tapa de tacho y toda superficie, pulido de espejos, lavar con cepillo y lejia la parte interna del inodoro, verificar que haya papel higienico y papel toalla. Barrido y trapeado con limpia todo y lejia.', requiere_foto: true, completado: false },
  { id: 'S-AP-6', area: 'SALON', tipo_turno: 'APERTURA', descripcion: 'Limpieza y abastecimiento de estacion - Limpieza de mobiliario, abastecimiento de servilletas, sorbetes, cubiertos, sal, pimienta y azucar.', requiere_foto: true, completado: false },
  { id: 'S-AP-7', area: 'SALON', tipo_turno: 'APERTURA', descripcion: 'Atender - en base a los pasos de servicios de la marca y entregar los QR para las reseñas.', requiere_foto: true, completado: false },
  { id: 'S-AP-8', area: 'SALON', tipo_turno: 'APERTURA', descripcion: 'Pizarra del dia - Actualizar pizarra ya sea de desayuno, plato del dia y promociones del día (verificar que la pizarra este siempre limpia y ordenada).', requiere_foto: true, completado: false },
  { id: 'S-AP-9', area: 'SALON', tipo_turno: 'APERTURA', descripcion: 'Inventario de Servicio: Azucares, productos descartable, contrometros de visa - ticketera, producto de limpieza y cucharitas de espreso, americano y vasos lata.', requiere_foto: true, completado: false },

  // SALON - RELEVO
  { id: 'S-RL-1', area: 'SALON', tipo_turno: 'RELEVO', descripcion: 'Limpieza de SSHH. - Limpieza de inodoros, lavatorios, piso y abastecimiento de papel, jabón.', requiere_foto: true, completado: false },
  { id: 'S-RL-2', area: 'SALON', tipo_turno: 'RELEVO', descripcion: 'Limpieza de salón y terraza - Barrido y trapeado para el cambio de turno.', requiere_foto: true, completado: false },

  // SALON - CIERRE
  { id: 'S-CI-1', area: 'SALON', tipo_turno: 'CIERRE', descripcion: 'Limpieza de mesas y sillas - Limpieza con limpiatodo de mesas y verificar que las sillas y sillon esten libres de residuos.', requiere_foto: true, completado: false },
  { id: 'S-CI-2', area: 'SALON', tipo_turno: 'CIERRE', descripcion: 'Limpieza de salón, terraza y directorios - Barrido y trapeado.', requiere_foto: true, completado: false },
  { id: 'S-CI-3', area: 'SALON', tipo_turno: 'CIERRE', descripcion: 'Limpieza de SSHH. - Limpieza de inodoros y caños (con limpiatodo y lejia), porta papel toalla, porta jabon, dispensador de papel higienico, tapa de tacho y toda superficie, pulido de espejos, lavar con cepillo y lejia la parte interna del inodoro, verificar que haya papel higienico y papel toalla. Barrido y trapeado con limpia todo y lejia.', requiere_foto: true, completado: false },
  { id: 'S-CI-4', area: 'SALON', tipo_turno: 'CIERRE', descripcion: 'Inventario de Servicio: Azucares, productos descartable, contrometros de visa - ticketera, producto de limpieza y cucharitas de espreso, americano y vasos lata.', requiere_foto: true, completado: false },
  { id: 'S-CI-5', area: 'SALON', tipo_turno: 'CIERRE', descripcion: 'Atender - en base a los pasos de servicios de la marca y entregar los QR para las reseñas.', requiere_foto: true, completado: false },
  { id: 'S-CI-6', area: 'SALON', tipo_turno: 'CIERRE', descripcion: 'Apagado de luces de salon encendidas, tablet, musica, computadora y cuadre de caja - Informar al administrador si existe alguna anomalia o necesidad de mantenimiento.', requiere_foto: true, completado: false },
];

const INITIAL_CLEANING_TASKS = [
  { id: 'CL-1', descripcion: 'Limpieza de mueble en general y menaje', frecuencia: 'SEMANAL', completedDays: {} },
  { id: 'CL-2', descripcion: 'Limpieza y pulido de vitrina de lunas', frecuencia: 'SEMANAL', completedDays: {} },
  { id: 'CL-3', descripcion: 'Limpieza de máquina de hielo por fuera/dentro', frecuencia: 'MENSUAL', completedDays: {} },
  { id: 'CL-4', descripcion: 'Limpieza de visicooler de barra', frecuencia: 'SEMANAL', completedDays: {} },
  { id: 'CL-5', descripcion: 'Limpieza profunda de exhibidora de postres', frecuencia: 'SEMANAL', completedDays: {} },
  { id: 'CL-9', descripcion: 'Limpieza de pared del área de barra', frecuencia: 'SEMANAL', completedDays: {} },
  { id: 'CL-12', descripcion: 'Limpieza de electrodomésticos licuadoras/microondas', frecuencia: 'SEMANAL', completedDays: {} },
  { id: 'CL-13', descripcion: 'Lavado de coctelería y tazas en repisa', frecuencia: 'SEMANAL', completedDays: {} },
  { id: 'CL-14', descripcion: 'Limpieza de dispensador de papel', frecuencia: 'SEMANAL', completedDays: {} },
  { id: 'CL-17', descripcion: 'Limpieza de vinos y estante de botellas', frecuencia: 'SEMANAL', completedDays: {} },
  { id: 'CL-M1', descripcion: 'Desincrustación profunda de caldera de máquina espresso', frecuencia: 'MENSUAL', completedDays: {} },
  { id: 'CL-M2', descripcion: 'Limpieza profunda de campanas y extractores cocina', frecuencia: 'MENSUAL', completedDays: {} },
  { id: 'CL-M3', descripcion: 'Sanitización profunda de cisternas y trampas de grasa', frecuencia: 'MENSUAL', completedDays: {} },
];

const INITIAL_TRAINING_ROUTE = [
  { id: 'D1', dia: 'Día 1', titulo: 'Identidad de la Marca y Cultura Don Guto', descripcion: 'Inducción integral a Don Guto Coffee Company: historia de la marca, organigrama de la tienda, visión de liderar el café de especialidad con calidez, misión de conectar el origen de Cajamarca con la taza perfecta, valores (excelencia, pasión y honestidad) y reglamento interno de desinfección y puntualidad.', duracion: '1.30 h', modalidad: 'Virtual o Presencial', estado: 'Pendiente' },
  { id: 'D2', dia: 'Día 2', titulo: 'Estaciones de Barra, Menú y Visita Técnica', descripcion: 'Recorrido técnico guiado por el counter, área de espresso La Marzocco, calibración del molino, y exhibidoras de postres. Estudio de funciones en visitas técnicas y memorización de productos estrella: perfiles del café de Cajamarca, filtrados tradicionales y pastelería artesanal.', duracion: '1.30 h', modalidad: 'Presencial', estado: 'Pendiente' },
  { id: 'D3', dia: 'Día 3', titulo: 'Estudio Autónomo de Carta y Manuales Operativos', descripcion: 'Jornada libre programada para el estudio independiente de la carta de bebidas y alimentos, y los manuales operativos de Don Guto: flujos de atención al cliente, estándares de limpieza e higiene, y políticas internas de la tienda.', duracion: 'Estudio', modalidad: 'Personal', estado: 'Pendiente' },
  { id: 'D4', dia: 'Día 4', titulo: 'Evaluación Teórica Aprobatoria', descripcion: 'Examen digital sobre la teoría del café, ratios de extracción del espresso (1:2 a 1:2.2), tiempos óptimos (25-29 segundos), recetas de bebidas y estándares de servicio al cliente. Requiere una calificación mínima aprobatoria del 85% para avanzar a barra.', duracion: '1 h', modalidad: 'Virtual', estado: 'Pendiente' },
  { id: 'D5', dia: 'Día 5', titulo: 'Día Sombra I: Soporte de Barra y Recetas', descripcion: 'Primer turno práctico de 8 horas en tienda. Observación pasiva de las rutinas de un Barista Senior y estudio del recetario oficial de Don Guto: dosificaciones de espresso (18g dry input), temperaturas de emulsión de leche (60°C-65°C) y preparación de refrescantes. Soporte directo en tareas básicas.', duracion: '8 h', modalidad: 'Presencial', estado: 'Pendiente' },
  { id: 'D6', dia: 'Día 6', titulo: 'Día Sombra II: Práctica Técnica Guiada', descripcion: 'Segundo turno práctico de 8 horas en barra. Práctica supervisada en compactación (tamping) nivelada, purga de grupos, texturizado de microespuma elástica para latte art, control de extracción de espresso Cajamarca y lectura ágil de comandas.', duracion: '8 h', modalidad: 'Presencial', estado: 'Pendiente' },
  { id: 'D7', dia: 'Día 7', titulo: 'Día de Prueba: Operación Autónoma', descripcion: 'Evaluación final práctica de 8 horas. Ejecución individual autónoma del turno completo bajo supervisión indirecta del jefe de barra. Evaluación de destreza técnica, velocidad en horas punta de flujo de clientes y hospitalidad Don Guto.', duracion: '8 h', modalidad: 'Presencial', estado: 'Pendiente' },
  { id: 'D8', dia: 'Día 8', titulo: 'Firma de Contrato y Bienvenida Oficial', descripcion: 'Reunión de cierre del proceso de inducción: feedback de la evaluación, asignación de horarios definitivos de turnos de tienda, entrega oficial del kit de uniformes Don Guto (polo de la marca y mandil de cuero), firma de contrato y bienvenida formal al equipo.', duracion: '2 h', modalidad: 'Presencial', estado: 'Pendiente' },
];

const INITIAL_MOCK_TEAM = [
  // ADMINISTRATIVOS Y GERENCIA DE LA CARTA ORGANIZACIONAL
  {
    username: 'onavarrodg',
    password: 'dg.osca.N9405',
    name: 'Oscar Navarro',
    role: 'Gerente',
    store: 'Todas',
    trainingProgress: {},
    arrivalLogs: []
  },
  {
    username: 'gechevarriadg',
    password: 'dg.gabr.E9087',
    name: 'Gabriela Echevarría',
    role: 'Gerente',
    store: 'Todas',
    trainingProgress: {},
    arrivalLogs: []
  },
  {
    username: 'cnizamadg',
    password: 'dg.chri.N9633',
    name: 'Christian Nizama',
    role: 'Administrador',
    store: '28 de Julio Miraflores',
    trainingProgress: {},
    arrivalLogs: []
  },
  {
    username: 'arianadg',
    password: 'dg.aria.A9928',
    name: 'Ariana',
    role: 'Auditor',
    store: '28 de Julio Miraflores',
    trainingProgress: {},
    arrivalLogs: []
  },
  {
    username: 'ccuevadg',
    password: 'dg.chri.C9458',
    name: 'Christian Cueva',
    role: 'Administrador',
    store: 'Todas',
    trainingProgress: {},
    arrivalLogs: []
  },
  {
    username: 'woviedodg',
    password: 'dg.wilf.O9580',
    name: 'Wilfredo Oviedo',
    role: 'Auditor',
    store: 'Todas',
    trainingProgress: {},
    arrivalLogs: []
  },
  {
    username: 'jortizdg',
    password: 'dg.juan.O9040',
    name: 'Juan Ortiz',
    role: 'Administrador',
    store: 'Todas',
    trainingProgress: {},
    arrivalLogs: []
  },

  // COLABORADORES REALES
  {
    username: 'avasquezdg',
    password: 'dg.alex.V38314',
    name: 'Alexander Vásquez Villalobos',
    role: 'Servicio',
    store: '28 de Julio Miraflores',
    email: 'Alexito1836@gmail.com',
    telefono: '992838314',
    trainingProgress: {},
    arrivalLogs: []
  },
  {
    username: 'ddazadg',
    password: 'dg.daye.D65912',
    name: 'Dayerlin Carolina Daza Vargas',
    role: 'Barista',
    store: '28 de Julio Miraflores',
    email: 'dayerlincarolina.dv@gmail.com',
    telefono: '963365912',
    trainingProgress: {},
    arrivalLogs: []
  },
  {
    username: 'mbravodg',
    password: 'dg.moni.B75773',
    name: 'Mónica Daniela Bravo Rodríguez',
    role: 'Servicio',
    store: '28 de Julio Miraflores',
    email: 'Monikbrav7@gmail.com',
    telefono: '908757732',
    trainingProgress: {},
    arrivalLogs: []
  },
  {
    username: 'aocampodg',
    password: 'dg.alex.O37809',
    name: 'Alexis Ocampo Rodríguez',
    role: 'Cocina',
    store: '28 de Julio Miraflores',
    email: 'Alexisjo@gmail.com',
    telefono: '945837809',
    trainingProgress: {},
    arrivalLogs: []
  },
  {
    username: 'fsotodg',
    password: 'dg.fran.S04464',
    name: 'Franchesca Giovana Soto Chávez',
    role: 'Cocina',
    store: '28 de Julio Miraflores',
    email: 'fgschavez@gmail.com',
    telefono: '958004464',
    trainingProgress: {},
    arrivalLogs: []
  },
  {
    username: 'eegocheagadg',
    password: 'dg.emil.E54227',
    name: 'Emily Egocheaga Ormeño',
    role: 'Cocina',
    store: '28 de Julio Miraflores',
    email: 'egocheaga888@gmail.com',
    telefono: '904054227',
    trainingProgress: {},
    arrivalLogs: []
  },
  {
    username: 'psilvadg',
    password: 'dg.patr.S26393',
    name: 'Patrick Silva Chávez',
    role: 'Barista',
    store: '28 de Julio Miraflores',
    email: 'murciegus@gmail.com',
    telefono: '979526393',
    trainingProgress: {},
    arrivalLogs: []
  },
  {
    username: 'jaymadg',
    password: 'dg.jesu.A22582',
    name: 'Jesus Ayma Chaparro',
    role: 'Barista',
    store: '28 de Julio Miraflores',
    email: 'jesusaymachaparro@gmail.com',
    telefono: '912322582',
    trainingProgress: {},
    arrivalLogs: []
  },
  {
    username: 'rlaurentedg',
    password: 'dg.ruth.L53898',
    name: 'Ruth Sarahi Laurente Olivera',
    role: 'Barista',
    store: '28 de Julio Miraflores',
    email: 'Sarahilaurente.7@gmail.com',
    telefono: '982953898',
    trainingProgress: {},
    arrivalLogs: []
  }
];

const INITIAL_AUDIT_LOGS = [];

const INITIAL_INCIDENTS = [];

export default function App() {
  // Clear old mock data once on production startup to ensure clean slate
  if (!localStorage.getItem('donguto-prod-v4')) {
    localStorage.removeItem('donguto-team');
    localStorage.removeItem('donguto-incidents');
    localStorage.removeItem('donguto-biometric-devices');
    localStorage.removeItem('donguto-biometric-logs');
    localStorage.setItem('donguto-prod-v4', 'true');
  }

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('donguto-user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('donguto-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('donguto-user');
    }
  }, [user]);

  const [currentView, setCurrentView] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('view') === 'incident-detail' ? 'incident-detail' : 'dashboard';
  });

  const [detailIncidentId, setDetailIncidentId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || null;
  });

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setCurrentView(params.get('view') === 'incident-detail' ? 'incident-detail' : 'dashboard');
      setDetailIncidentId(params.get('id') || null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectIncident = (incidentId) => {
    setCurrentView('incident-detail');
    setDetailIncidentId(incidentId);
    const newUrl = `${window.location.pathname}?view=incident-detail&id=${incidentId}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  const handleCloseIncidentDetail = () => {
    setCurrentView('dashboard');
    setDetailIncidentId(null);
    window.history.pushState({ path: window.location.pathname }, '', window.location.pathname);
  };

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('donguto-theme') || 'light';
  });

  const [isDevCollapsed, setIsDevCollapsed] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    const diffX = currentX - touchStartX;

    // If swipe from left to right (diffX > 75) near the left edge (startX < 50), open drawer
    if (touchStartX < 50 && diffX > 75 && !isDrawerOpen) {
      setIsDrawerOpen(true);
      setTouchStartX(null);
    }
    // If swipe from right to left (diffX < -75) inside drawer, close it
    if (diffX < -75 && isDrawerOpen) {
      setIsDrawerOpen(false);
      setTouchStartX(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartX(null);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('donguto-theme', theme);
  }, [theme]);
  
  // App state database simulation
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('donguto-user');
    if (saved) {
      const u = JSON.parse(saved);
      if (['Administrador', 'Gerente', 'Supervisor', 'Técnico', 'Auditor'].includes(u.role)) {
        return u.role === 'Técnico' ? 'technical_panel' : 'monitoring';
      }
    }
    return 'checklist';
  });

  const [checklists, setChecklists] = useState(INITIAL_CHECKLISTS);
  const [cleaningTasks, setCleaningTasks] = useState(INITIAL_CLEANING_TASKS);
  const [teamMembers, setTeamMembers] = useState(() => {
    const saved = localStorage.getItem('donguto-team');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_TEAM;
  });

  useEffect(() => {
    localStorage.setItem('donguto-team', JSON.stringify(teamMembers));
  }, [teamMembers]);

  // Load team members from Supabase database if configured
  useEffect(() => {
    const fetchCloudUsers = async () => {
      try {
        const res = await fetch('/api/manage-users');
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.status === 'success' && data.users && data.users.length > 0) {
          setTeamMembers(prev => {
            return data.users.map(u => {
              const localCopy = prev.find(p => p.username === u.username);
              return {
                ...u,
                trainingProgress: localCopy ? (localCopy.trainingProgress || {}) : {},
                arrivalLogs: localCopy ? (localCopy.arrivalLogs || []) : []
              };
            });
          });
        }
      } catch (err) {
        console.warn('[App] Failed to load users from Supabase, using localStorage fallback:', err);
      }
    };
    fetchCloudUsers();
  }, []);

  const loadDailyChecklists = async (storeName) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const res = await fetch(`/api/checklists?date=${todayStr}&store=${storeName}`);
      const data = await res.json();
      if (data && data.status === 'success' && data.records) {
        setChecklists(prev =>
          prev.map(t => {
            const matched = data.records.find(r => r.taskId === t.id);
            if (matched) {
              return {
                ...t,
                completado: matched.completado,
                evidencia: matched.evidencia
              };
            }
            return {
              ...t,
              completado: false,
              evidencia: null
            };
          })
        );
      }
    } catch (err) {
      console.warn('[Checklist Sync] Failed to load checklist from Supabase:', err);
    }
  };

  useEffect(() => {
    if (user) {
      loadDailyChecklists(user.store === 'Todas' ? '28 de Julio Miraflores' : user.store);
    }
  }, [user]);

  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [incidents, setIncidents] = useState(() => {
    const saved = localStorage.getItem('donguto-incidents');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  // Keep incidents synchronized across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'donguto-incidents') {
        const saved = localStorage.getItem('donguto-incidents');
        if (saved) {
          setIncidents(JSON.parse(saved));
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Biometric states
  const INITIAL_BIOMETRIC_DEVICES = [];

  const INITIAL_BIOMETRIC_LOGS = [];

  const [biometricDevices, setBiometricDevices] = useState(() => {
    const saved = localStorage.getItem('donguto-biometric-devices');
    return saved ? JSON.parse(saved) : INITIAL_BIOMETRIC_DEVICES;
  });

  const [isFirstSync, setIsFirstSync] = useState(true);

  const [biometricLogs, setBiometricLogs] = useState(() => {
    const saved = localStorage.getItem('donguto-biometric-logs');
    return saved ? JSON.parse(saved) : INITIAL_BIOMETRIC_LOGS;
  });

  const handleUpdateDevices = (updatedDevices) => {
    setBiometricDevices(updatedDevices);
    localStorage.setItem('donguto-biometric-devices', JSON.stringify(updatedDevices));
  };

  const handleBiometricScan = (usernameOrId, deviceId, customTime = null, customDate = null, punchId = null) => {
    const searchVal = String(usernameOrId).trim();
    const employee = teamMembers.find(m => String(m.username) === searchVal || String(m.biometricId) === searchVal);
    if (!employee) return { success: false, message: 'Colaborador no encontrado' };

    const device = biometricDevices.find(d => d.id === deviceId);
    const deviceName = device ? device.name : 'Dispositivo Desconocido';
    const store = employee.store === 'Todas' ? (device ? device.store : '28 de Julio Miraflores') : employee.store;

    let punchDateStr, punchTimeStr;
    let currentMins;

    if (customTime && customDate) {
      punchDateStr = customDate;
      punchTimeStr = customTime;
      
      const [timePart, ampmPart] = customTime.split(' ');
      let [h, m] = timePart.split(':').map(Number);
      if (ampmPart === 'PM' && h < 12) h += 12;
      if (ampmPart === 'AM' && h === 12) h = 0;
      currentMins = h * 60 + m;
    } else {
      const now = new Date();
      punchDateStr = now.toISOString().split('T')[0];
      
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
      const displayMinutes = minutes.toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      punchTimeStr = `${displayHours.toString().padStart(2, '0')}:${displayMinutes} ${ampm}`;
      
      const [timePart, ampmPart] = punchTimeStr.split(' ');
      let [h, m] = timePart.split(':').map(Number);
      if (ampmPart === 'PM' && h < 12) h += 12;
      if (ampmPart === 'AM' && h === 12) h = 0;
      currentMins = h * 60 + m;
    }

    // Check if already clocked in on that date to avoid duplicate times (same minute)
    const logs = employee.arrivalLogs || [];
    const existingLog = logs.find(l => l.date === punchDateStr);
    if (existingLog) {
      const isDuplicateTime = (existingLog.allPunches || [existingLog.time]).includes(punchTimeStr) || existingLog.time === punchTimeStr || existingLog.checkOutTime === punchTimeStr;
      if (isDuplicateTime) {
        return { success: false, message: 'Asistencia ya registrada para esta hora' };
      }
    }

    // Expected time based on employee role
    let expectedTimeStr = '07:00 AM';
    if (employee.role === 'Servicio') expectedTimeStr = '08:00 AM';
    else if (['Administrador', 'Supervisor', 'Gerente', 'Técnico', 'Auditor'].includes(employee.role)) expectedTimeStr = '08:00 AM';

    const [expTimePart, expAmpmPart] = expectedTimeStr.split(' ');
    let [eh, em] = expTimePart.split(':').map(Number);
    if (expAmpmPart === 'PM' && eh < 12) eh += 12;
    if (expAmpmPart === 'AM' && eh === 12) eh = 0;
    const expectedMins = eh * 60 + em;

    const delayMin = Math.max(0, currentMins - expectedMins);

    handleClockIn(employee.username, punchDateStr, punchTimeStr, expectedTimeStr, delayMin);

    let logDate;
    if (customTime && customDate) {
      try {
        const [timePart, ampmPart] = customTime.split(' ');
        let [h, m] = timePart.split(':').map(Number);
        if (ampmPart === 'PM' && h < 12) h += 12;
        if (ampmPart === 'AM' && h === 12) h = 0;
        logDate = new Date(`${customDate}T${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`).toISOString();
      } catch (e) {
        logDate = new Date().toISOString();
      }
    } else {
      logDate = new Date().toISOString();
    }

    const newLog = {
      id: punchId || `BLOG-${Date.now().toString().slice(-4)}`,
      date: logDate,
      name: employee.name,
      username: employee.username,
      role: employee.role,
      store: store,
      deviceId: deviceId,
      deviceName: deviceName,
      status: 'Success'
    };

    setBiometricLogs(prev => {
      const next = [newLog, ...prev];
      localStorage.setItem('donguto-biometric-logs', JSON.stringify(next));
      return next;
    });

    return { success: true, log: newLog };
  };

  useEffect(() => {
    window.triggerBiometricPunch = (username, deviceId = 'DEV-001') => {
      const res = handleBiometricScan(username, deviceId);
      console.log('Biometric Punch result:', res);
      return res;
    };
    return () => {
      delete window.triggerBiometricPunch;
    };
  }, [teamMembers, biometricDevices]);

  const rebuildBiometricArrivalLogs = (punchesList) => {
    setTeamMembers(prev => {
      // Find all team members that have a biometric ID
      const biometricUserIds = prev
        .map(m => String(m.biometricId || m.biometric_id || '').trim())
        .filter(Boolean);
        
      if (biometricUserIds.length === 0) return prev;
      
      return prev.map(m => {
        const bioId = String(m.biometricId || m.biometric_id || '').trim();
        if (bioId) {
          // Rebuild arrivalLogs from scratch for this biometric user using punchesList
          const userPunches = punchesList.filter(p => String(p.biometric_id) === bioId);
          if (userPunches.length === 0) {
            return { ...m, arrivalLogs: [] };
          }
          
          // Group userPunches by date
          const punchesByDate = {};
          userPunches.forEach(p => {
            let finalTime = p.time;
            let finalDate = p.date;
            
            if (p.timestamp) {
              const pTime = new Date(p.timestamp);
              if (pTime && !isNaN(pTime.getTime())) {
                const hours = pTime.getHours();
                const minutes = pTime.getMinutes();
                const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
                const displayMinutes = minutes.toString().padStart(2, '0');
                const ampm = hours >= 12 ? 'PM' : 'AM';
                finalTime = `${displayHours.toString().padStart(2, '0')}:${displayMinutes} ${ampm}`;
                
                const year = pTime.getFullYear();
                const month = String(pTime.getMonth() + 1).padStart(2, '0');
                const day = String(pTime.getDate()).padStart(2, '0');
                finalDate = `${year}-${month}-${day}`;
              }
            }
            
            if (!punchesByDate[finalDate]) {
              punchesByDate[finalDate] = [];
            }
            if (!punchesByDate[finalDate].includes(finalTime)) {
              punchesByDate[finalDate].push(finalTime);
            }
          });
          
          // Expected time based on employee role
          let expectedTimeStr = '07:00 AM';
          if (m.role === 'Servicio') expectedTimeStr = '08:00 AM';
          else if (['Administrador', 'Supervisor', 'Gerente', 'Técnico', 'Auditor'].includes(m.role)) expectedTimeStr = '08:00 AM';
          
          const [expTimePart, expAmpmPart] = expectedTimeStr.split(' ');
          let [eh, em] = expTimePart.split(':').map(Number);
          if (expAmpmPart === 'PM' && eh < 12) eh += 12;
          if (expAmpmPart === 'AM' && eh === 12) eh = 0;
          const expectedMins = eh * 60 + em;
          
          // Convert grouped punches into arrivalLogs format
          const newLogs = Object.keys(punchesByDate).map(dateStr => {
            const uniqueTimes = punchesByDate[dateStr];
            uniqueTimes.sort((a, b) => timeToMinutes(a) - timeToMinutes(b));
            
            const earliestTime = uniqueTimes[0];
            const latestTime = uniqueTimes.length > 1 ? uniqueTimes[uniqueTimes.length - 1] : null;
            
            // Calculate delayMin using the earliest time of the day
            const [timePart, ampmPart] = earliestTime.split(' ');
            let [h, mPart] = timePart.split(':').map(Number);
            if (ampmPart === 'PM' && h < 12) h += 12;
            if (ampmPart === 'AM' && h === 12) h = 0;
            const earliestMins = h * 60 + mPart;
            
            const delayMin = Math.max(0, earliestMins - expectedMins);
            
            return {
              date: dateStr,
              time: earliestTime,
              expectedTime: expectedTimeStr,
              delayMin: delayMin,
              checkOutTime: latestTime,
              totalPunches: uniqueTimes.length,
              allPunches: uniqueTimes
            };
          });
          
          // Sort daily logs chronologically
          newLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
          return {
            ...m,
            arrivalLogs: newLogs
          };
        }
        return m;
      });
    });
  };

  useEffect(() => {
    let active = true;
    const processedPunchIds = new Set(biometricLogs.map(log => log.id || log.punch_id).filter(Boolean));
    let lastProcessedLocalId = null;

    const checkLocalPunches = async () => {
      try {
        const response = await fetch('http://localhost:5000/latest-punch', {
          mode: 'cors',
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (!response.ok) return;
        const data = await response.json();
        if (data && data.punch_id && data.punch_id !== lastProcessedLocalId) {
          lastProcessedLocalId = data.punch_id;
          const res = handleBiometricScan(data.biometric_id || data.username, data.device_id || 'DEV-001');
          console.log('Automated Local Biometric Punch triggered for:', data.biometric_id || data.username, 'Result:', res);
        }
      } catch (err) {
        // Silent catch: local server might not be running
      }
    };

    const checkCloudPunches = async () => {
      try {
        const response = await fetch('/api/sync-zk', {
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (!response.ok) return;
        const data = await response.json();
        if (data && data.status === 'success' && data.punches) {
          if (isFirstSync) {
            // Rebuild all logs from the database records on startup
            rebuildBiometricArrivalLogs(data.punches);
            setIsFirstSync(false);
            
            // Also populate biometricLogs from the cloud punches
            const initialBioLogs = data.punches.map(punch => {
              let finalTime = punch.time;
              let finalDate = punch.date;
              let logDateStr = new Date().toISOString();
              
              if (punch.timestamp) {
                logDateStr = punch.timestamp;
                const pTime = new Date(punch.timestamp);
                if (pTime && !isNaN(pTime.getTime())) {
                  const hours = pTime.getHours();
                  const minutes = pTime.getMinutes();
                  const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
                  const displayMinutes = minutes.toString().padStart(2, '0');
                  const ampm = hours >= 12 ? 'PM' : 'AM';
                  finalTime = `${displayHours.toString().padStart(2, '0')}:${displayMinutes} ${ampm}`;
                  
                  const year = pTime.getFullYear();
                  const month = String(pTime.getMonth() + 1).padStart(2, '0');
                  const day = String(pTime.getDate()).padStart(2, '0');
                  finalDate = `${year}-${month}-${day}`;
                }
              }
              
              const searchVal = String(punch.biometric_id).trim();
              const employee = teamMembers.find(m => String(m.username) === searchVal || String(m.biometricId) === searchVal);
              
              return {
                id: punch.punch_id,
                date: logDateStr,
                name: employee ? employee.name : (punch.username || `ID ${punch.biometric_id}`),
                username: employee ? employee.username : '',
                role: employee ? employee.role : 'Barista',
                store: employee ? employee.store : '28 de Julio Miraflores',
                deviceId: punch.device_id || 'DEV-001',
                deviceName: punch.device_name || 'ZKTeco M1',
                status: 'Success'
              };
            });
            setBiometricLogs(initialBioLogs);
            localStorage.setItem('donguto-biometric-logs', JSON.stringify(initialBioLogs));
          } else {
            // Normal incremental check
            data.punches.forEach(punch => {
              const punchId = punch.punch_id;
              if (punchId && !processedPunchIds.has(punchId)) {
                processedPunchIds.add(punchId);
                
                let finalTime = punch.time;
                let finalDate = punch.date;
                
                if (punch.timestamp) {
                  const pTime = new Date(punch.timestamp);
                  if (pTime && !isNaN(pTime.getTime())) {
                    const hours = pTime.getHours();
                    const minutes = pTime.getMinutes();
                    const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
                    const displayMinutes = minutes.toString().padStart(2, '0');
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    finalTime = `${displayHours.toString().padStart(2, '0')}:${displayMinutes} ${ampm}`;
                    
                    const year = pTime.getFullYear();
                    const month = String(pTime.getMonth() + 1).padStart(2, '0');
                    const day = String(pTime.getDate()).padStart(2, '0');
                    finalDate = `${year}-${month}-${day}`;
                  }
                }
                
                const res = handleBiometricScan(
                  punch.biometric_id || punch.username,
                  punch.device_id || 'DEV-001',
                  finalTime,
                  finalDate,
                  punchId
                );
                console.log('Automated Cloud Biometric Punch synced for:', punch.biometric_id || punch.username, 'Result:', res);
              }
            });
          }
        }
      } catch (err) {
        // Silent catch: cloud API might fail or be offline
      }
    };

    const interval = setInterval(() => {
      if (active) {
        checkLocalPunches();
        checkCloudPunches();
      }
    }, 3000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [teamMembers, biometricDevices, biometricLogs, isFirstSync]);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    if (['Administrador', 'Gerente', 'Supervisor', 'Técnico', 'Auditor'].includes(loggedInUser.role)) {
      setActiveTab(loggedInUser.role === 'Técnico' ? 'technical_panel' : 'monitoring');
    } else {
      setActiveTab('checklist');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('checklist');
  };

  // -------------------------------------------------------------------------
  // DATABASE WRITERS / MUTATORS
  // -------------------------------------------------------------------------
  
  // Toggle checkmark on daily checklists
  // Toggle checkmark on daily checklists and save evidence
  const handleSaveTask = async (taskId, completed, evidencia = null) => {
    const finalEvidencia = completed ? (evidencia || 'evidence_image_upload_simulated.png') : null;
    
    // 1. Optimistic UI update in React state
    setChecklists(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            completado: completed,
            evidencia: finalEvidencia
          };
        }
        return t;
      })
    );

    // 2. Persist in Supabase if user is logged in
    if (user) {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const res = await fetch('/api/checklists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskId: taskId,
            date: todayStr,
            completado: completed,
            evidencia: finalEvidencia,
            colaborador: user.name,
            store: user.store === 'Todas' ? '28 de Julio Miraflores' : user.store
          })
        });
        const data = await res.json();
        if (data.status === 'success') {
          console.log('[Checklist Sync] Saved successfully to Supabase');
        }
      } catch (err) {
        console.warn('[Checklist Sync] Failed to save checklist, using local state fallback:', err);
      }
    }
  };

  // Toggle monthly cleaning calendar days
  const handleSaveCleaning = (taskId, day, completed) => {
    setCleaningTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            completedDays: {
              ...t.completedDays,
              [day]: completed,
            },
          };
        }
        return t;
      })
    );
  };

  // Helper to convert time strings (AM/PM or 24h) to minutes from midnight for sorting
  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const clean = timeStr.trim().toUpperCase();
    const is12Hour = clean.endsWith('AM') || clean.endsWith('PM');
    if (is12Hour) {
      const parts = clean.split(' ');
      const timePart = parts[0];
      const ampm = parts[1];
      let [h, m] = timePart.split(':').map(Number);
      if (ampm === 'PM' && h < 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      return h * 60 + (m || 0);
    } else {
      const [h, m] = clean.split(':').map(Number);
      return h * 60 + (m || 0);
    }
  };

  // Clock-in attendance registration
  const handleClockIn = (username, date, time, expectedTime, delayMin) => {
    setTeamMembers(prev =>
      prev.map(m => {
        if (m.username === username) {
          const logs = m.arrivalLogs || [];
          const existingIdx = logs.findIndex(l => l.date === date);
          
          if (existingIdx !== -1) {
            // Update existing daily log
            const existingLog = logs[existingIdx];
            const allPunches = [...(existingLog.allPunches || [existingLog.time]), time];
            // Deduplicate punches by time string
            const uniquePunches = Array.from(new Set(allPunches));
            
            // Sort punches chronologically
            uniquePunches.sort((a, b) => timeToMinutes(a) - timeToMinutes(b));
            
            const earliestTime = uniquePunches[0];
            const latestTime = uniquePunches.length > 1 ? uniquePunches[uniquePunches.length - 1] : null;
            
            // Recalculate delayMin using the earliest time of the day
            const [timePart, ampmPart] = earliestTime.split(' ');
            let [h, mPart] = timePart.split(':').map(Number);
            if (ampmPart === 'PM' && h < 12) h += 12;
            if (ampmPart === 'AM' && h === 12) h = 0;
            const earliestMins = h * 60 + mPart;
            
            const [expTimePart, expAmpmPart] = (existingLog.expectedTime || expectedTime).split(' ');
            let [eh, em] = expTimePart.split(':').map(Number);
            if (expAmpmPart === 'PM' && eh < 12) eh += 12;
            if (expAmpmPart === 'AM' && eh === 12) eh = 0;
            const expectedMins = eh * 60 + em;
            
            const newDelayMin = Math.max(0, earliestMins - expectedMins);
            
            const updatedLog = {
              ...existingLog,
              time: earliestTime,
              checkOutTime: latestTime,
              totalPunches: uniquePunches.length,
              allPunches: uniquePunches,
              delayMin: newDelayMin
            };
            
            const newLogs = [...logs];
            newLogs[existingIdx] = updatedLog;
            return {
              ...m,
              arrivalLogs: newLogs
            };
          } else {
            // Add new daily log
            return {
              ...m,
              arrivalLogs: [...logs, {
                date,
                time,
                expectedTime,
                delayMin,
                checkOutTime: null,
                totalPunches: 1,
                allPunches: [time]
              }]
            };
          }
        }
        return m;
      })
    );
  };

  // Approve a training day for an employee
  const handleApproveTrainingDay = (username, dayId, status) => {
    setTeamMembers(prev =>
      prev.map(m => {
        if (m.username === username) {
          return {
            ...m,
            trainingProgress: {
              ...m.trainingProgress,
              [dayId]: status,
            },
          };
        }
        return m;
      })
    );
  };

  // Add new employee to simulated db
  const handleAddTeamMember = (newMember) => {
    const userPassword = newMember.password || `${newMember.username}dg`;
    
    const memberObj = {
      ...newMember,
      password: userPassword,
      trainingProgress: {},
    };

    setTeamMembers(prev => {
      const updated = [
        ...prev,
        memberObj,
      ];
      localStorage.setItem('donguto-team', JSON.stringify(updated));
      return updated;
    });

    // Write to Supabase in the background
    fetch('/api/manage-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create',
        username: memberObj.username,
        password: memberObj.password,
        name: memberObj.name,
        role: memberObj.role,
        store: memberObj.store,
        biometricId: memberObj.biometricId || null
      })
    }).catch(err => console.error('[App] Supabase create user error:', err));
  };

  const handleApproveCollaborator = (username) => {
    setTeamMembers(prev => {
      const updated = prev.map(m => m.username === username ? { ...m, pendingApproval: false } : m);
      localStorage.setItem('donguto-team', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRejectCollaborator = (username) => {
    setTeamMembers(prev => {
      const updated = prev.filter(m => m.username !== username);
      localStorage.setItem('donguto-team', JSON.stringify(updated));
      return updated;
    });

    // Delete from Supabase in the background
    fetch('/api/manage-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete',
        username: username
      })
    }).catch(err => console.error('[App] Supabase delete user error:', err));
  };

  // Save operational audit log
  const handleSaveAudit = (auditData) => {
    setAuditLogs(prev => [auditData, ...prev]);
  };

  // Move collaborator to a different store or update their details
  const handleUpdateCollaborator = (username, updatedFields) => {
    setTeamMembers(prev =>
      prev.map(m => (m.username === username ? { ...m, ...updatedFields } : m))
    );

    // Update in Supabase in the background
    fetch('/api/manage-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update',
        username: username,
        password: updatedFields.password,
        name: updatedFields.name,
        role: updatedFields.role,
        store: updatedFields.store,
        biometricId: updatedFields.biometricId
      })
    }).catch(err => console.error('[App] Supabase update user error:', err));
  };

  const handleAddIncident = (newIncident) => {
    setIncidents(prev => {
      const updated = [newIncident, ...prev];
      localStorage.setItem('donguto-incidents', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRespondIncident = (incidentId, responseText, responderRole) => {
    setIncidents(prev => {
      const updated = prev.map(inc => {
        if (inc.id === incidentId) {
          const timestamp = new Date().toISOString();
          if (responderRole === 'Administrador') {
            return {
              ...inc,
              adminResponse: responseText,
              adminResponseAt: timestamp,
              status: inc.status === 'Pendiente' ? 'En Proceso' : inc.status
            };
          } else {
            return {
              ...inc,
              supervisorResponse: responseText,
              supervisorResponseAt: timestamp,
              status: inc.status === 'Pendiente' || inc.status === 'Escalado' || inc.status === 'En Proceso' ? 'En Proceso' : inc.status
            };
          }
        }
        return inc;
      });
      localStorage.setItem('donguto-incidents', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateIncidentStatus = (incidentId, newStatus, resolvedBy = '') => {
    setIncidents(prev => {
      const updated = prev.map(inc => {
        if (inc.id === incidentId) {
          const timestamp = new Date().toISOString();
          return {
            ...inc,
            status: newStatus,
            resolvedBy: newStatus === 'Resuelto' ? (resolvedBy || inc.resolvedBy) : inc.resolvedBy,
            resolvedAt: newStatus === 'Resuelto' ? timestamp : inc.resolvedAt
          };
        }
        return inc;
      });
      localStorage.setItem('donguto-incidents', JSON.stringify(updated));
      return updated;
    });
  };

  // -------------------------------------------------------------------------
  // RENDERER
  // -------------------------------------------------------------------------
  if (currentView === 'incident-detail') {
    if (!user) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'var(--bg-main)'
        }}>
          <Login onLogin={handleLogin} />
        </div>
      );
    }
    return (
      <IncidentDetailStandalone
        user={user}
        incidentId={detailIncidentId}
        incidents={incidents}
        onRespondIncident={handleRespondIncident}
        onUpdateIncidentStatus={handleUpdateIncidentStatus}
        theme={theme}
        setTheme={setTheme}
        onClose={handleCloseIncidentDetail}
      />
    );
  }

  return (
    <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* HEADER BAR */}
      <header className="glass" style={{ borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container header-container" style={{ height: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ backgroundColor: 'var(--primary)', color: '#fff', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px' }}>
              DG
            </div>
            <div>
              <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', display: 'block', letterSpacing: '0.5px' }}>DON GUTO</span>
              <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginTop: '-4px', letterSpacing: '1px' }}>INTRANET • ONLINE</span>
            </div>
          </div>

          {/* Desktop Controls Widget (Hidden on mobile) */}
          <div className="header-controls hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
              className="btn btn-secondary"
              style={{
                padding: '6px 12px',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
              title="Cambiar tema de la página"
            >
              {theme === 'light' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
            </button>


            {user && (
              <div className="user-widget" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div className="user-info" style={{ textAlign: 'right', fontSize: '12px' }}>
                  <strong style={{ color: 'var(--text-main)', display: 'block' }}>{user.name}</strong>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {user.role === 'Auditor' ? 'Auditor de Operaciones' : user.role} | Tienda: <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{user.store}</span>
                  </span>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }}>
                  Salir
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          {user && (
            <div className="show-on-mobile">
              <button 
                onClick={() => setIsDrawerOpen(true)}
                className="hamburger-btn"
                title="Abrir menú"
              >
                ☰
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN VIEW AREA */}
      <main className="container" style={{ flex: 1, padding: '30px 16px' }}>
        {!user ? (
          <Login onLogin={handleLogin} />
        ) : (
          <div className="animate-fade-in">
            {/* Show view based on user role */}
            {['Administrador', 'Gerente', 'Supervisor', 'Técnico', 'Auditor'].includes(user.role) ? (
              <SupervisorDashboard
                user={user}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                checklists={checklists}
                cleaningTasks={cleaningTasks}
                trainingRoute={INITIAL_TRAINING_ROUTE}
                teamMembers={teamMembers}
                auditLogs={auditLogs}
                onApproveTrainingDay={handleApproveTrainingDay}
                onAddTeamMember={handleAddTeamMember}
                onSaveAudit={handleSaveAudit}
                onClockIn={handleClockIn}
                onUpdateCollaborator={handleUpdateCollaborator}
                incidents={incidents}
                onRespondIncident={handleRespondIncident}
                onUpdateIncidentStatus={handleUpdateIncidentStatus}
                onAddIncident={handleAddIncident}
                biometricDevices={biometricDevices}
                biometricLogs={biometricLogs}
                onUpdateDevices={handleUpdateDevices}
                onBiometricScan={handleBiometricScan}
                onSelectIncident={handleSelectIncident}
                onApproveCollaborator={handleApproveCollaborator}
                onRejectCollaborator={handleRejectCollaborator}
              />
            ) : (
              <ColaboradorDashboard
                user={user}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                checklists={checklists}
                cleaningTasks={cleaningTasks}
                trainingRoute={INITIAL_TRAINING_ROUTE.map(d => ({
                  ...d,
                  estado: 'Completado'
                }))}
                arrivalLogs={teamMembers.find(m => m.username === user.username)?.arrivalLogs || []}
                onSaveTask={handleSaveTask}
                onSaveCleaning={handleSaveCleaning}
                onApproveTrainingDay={handleApproveTrainingDay}
                onClockIn={handleClockIn}
                incidents={incidents}
                onAddIncident={handleAddIncident}
                biometricDevices={biometricDevices}
                onBiometricScan={handleBiometricScan}
              />
            )}
          </div>
        )}
      </main>

      {/* SIDEBAR DRAWER (MOBILE-FIRST) */}
      {user && (
        <div className={`drawer-backdrop ${isDrawerOpen ? 'open' : ''}`} onClick={() => setIsDrawerOpen(false)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ backgroundColor: 'var(--primary)', color: '#fff', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px' }}>
                  DG
                </div>
                <div>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#fff', display: 'block', letterSpacing: '0.5px' }}>DON GUTO</span>
                  <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--accent)', display: 'block', marginTop: '-4px', letterSpacing: '1px' }}>INTRANET • MENU</span>
                </div>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', padding: '5px' }}
              >
                ✕
              </button>
            </div>

            <div className="drawer-profile">
              <span style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Usuario Activo:</span>
              <strong style={{ fontSize: '15px', color: '#fff', display: 'block' }}>{user.name}</strong>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', display: 'block', marginTop: '2px' }}>
                {user.role} | Tienda: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{user.store}</span>
              </span>
              <button 
                onClick={() => { handleLogout(); setIsDrawerOpen(false); }} 
                className="btn btn-danger" 
                style={{ width: '100%', marginTop: '12px', padding: '8px', fontSize: '12.5px', fontWeight: 700 }}
              >
                Cerrar Sesión 🚪
              </button>
            </div>

            <div className="drawer-section-title">Ajustes</div>
            <button
              onClick={() => { setTheme(prev => prev === 'light' ? 'dark' : 'light'); }}
              className="drawer-btn"
              style={{ marginBottom: '15px' }}
            >
              {theme === 'light' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
            </button>

            <div className="drawer-section-title">Secciones</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '15px' }}>
              {['Administrador', 'Gerente', 'Supervisor', 'Técnico', 'Auditor'].includes(user.role) ? (
                <>
                  <button
                    className={`drawer-btn ${activeTab === 'monitoring' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('monitoring'); setIsDrawerOpen(false); }}
                  >
                    📊 Panel de Monitoreo
                  </button>
                  <button
                    className={`drawer-btn ${activeTab === 'audits' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('audits'); setIsDrawerOpen(false); }}
                  >
                    📋 Ficha de Auditoría
                  </button>
                  <button
                    className={`drawer-btn ${activeTab === 'team' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('team'); setIsDrawerOpen(false); }}
                  >
                    👥 Equipo y Capacitación
                  </button>
                  <button
                    className={`drawer-btn ${activeTab === 'logs' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('logs'); setIsDrawerOpen(false); }}
                  >
                    📜 Historial de Auditorías
                  </button>
                  <button
                    className={`drawer-btn ${activeTab === 'incidents' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('incidents'); setIsDrawerOpen(false); }}
                  >
                    ⚠️ Bandeja de Incidencias
                  </button>
                  <button
                    className={`drawer-btn ${activeTab === 'my_attendance' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('my_attendance'); setIsDrawerOpen(false); }}
                  >
                    🕒 Mi Asistencia (Huella)
                  </button>
                  {user.role === 'Técnico' && (
                    <button
                      className={`drawer-btn ${activeTab === 'technical_panel' ? 'active' : ''}`}
                      onClick={() => { setActiveTab('technical_panel'); setIsDrawerOpen(false); }}
                    >
                      🛠️ Panel Técnico
                    </button>
                  )}
                  {['Gerente', 'Supervisor', 'Técnico', 'Auditor'].includes(user.role) && (
                    <button
                      className={`drawer-btn ${activeTab === 'multistore' ? 'active' : ''}`}
                      onClick={() => { setActiveTab('multistore'); setIsDrawerOpen(false); }}
                    >
                      🏢 Dashboard Multitienda
                    </button>
                  )}
                  {['Gerente', 'Supervisor', 'Técnico'].includes(user.role) && (
                    <button
                      className={`drawer-btn ${activeTab === 'managerial_kpis' ? 'active' : ''}`}
                      onClick={() => { setActiveTab('managerial_kpis'); setIsDrawerOpen(false); }}
                    >
                      📈 Panel de Gerencia & KPIs
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    className={`drawer-btn ${activeTab === 'checklist' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('checklist'); setIsDrawerOpen(false); }}
                  >
                    📝 Checklists Diarios
                  </button>
                  <button
                    className={`drawer-btn ${activeTab === 'cleaning' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('cleaning'); setIsDrawerOpen(false); }}
                  >
                    🧹 Tareas de Limpieza
                  </button>
                  <button
                    className={`drawer-btn ${activeTab === 'route' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('route'); setIsDrawerOpen(false); }}
                  >
                    🎓 Educación
                  </button>
                  {user.role === 'Barista' && (
                    <button
                      className={`drawer-btn ${activeTab === 'sensory' ? 'active' : ''}`}
                      onClick={() => { setActiveTab('sensory'); setIsDrawerOpen(false); }}
                    >
                      ☕ Perfil de Espresso
                    </button>
                  )}
                  <button
                    className={`drawer-btn ${activeTab === 'attendance' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('attendance'); setIsDrawerOpen(false); }}
                  >
                    🕒 Control de Asistencia
                  </button>
                  <button
                    className={`drawer-btn ${activeTab === 'menu' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('menu'); setIsDrawerOpen(false); }}
                  >
                    📋 Carta Digital
                  </button>
                  <button
                    className={`drawer-btn ${activeTab === 'incidents' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('incidents'); setIsDrawerOpen(false); }}
                  >
                    ⚠️ Reportar Incidencia
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
