import React, { createContext, useContext, useState, useEffect } from 'react';
import checklistsService from '../services/checklistsService';
import attendanceService from '../services/attendanceService';
import incidentsService from '../services/incidentsService';
import schedulesService from '../services/schedulesService';

const AppContext = createContext(null);

export const SUPERVISORY_ROLES = ['Administrador', 'Gerente', 'Supervisor', 'Técnico', 'Auditor', 'Operaciones'];

// Initialize mock data directly from Don Guto excel specs
const INITIAL_CHECKLISTS = [
  // BARISTAS - APERTURA
  { id: 'B-AP-1', area: 'BARRA', tipo_turno: 'APERTURA', descripcion: 'Colocarse el uniforme correctamente, tomarse foto grupal y enviarla por el grupo de tienda.', requiere_foto: true, completado: false },
  { id: 'B-AP-2', area: 'BARRA', tipo_turno: 'APERTURA', descripcion: 'Encender la máquina de espresso y molino. Encender luces de vitrinas de postres y galletas.', requiere_foto: true, completado: false },
  { id: 'B-AP-3', area: 'BARRA', tipo_turno: 'APERTURA', descripcion: 'Enjuagar los trapos en remojo. Secar vajilla del cierre anterior.', requiere_foto: true, completado: false },
  { id: 'B-AP-4', area: 'BARRA', tipo_turno: 'APERTURA', descripcion: 'Purgar la máquina del café con los residuos del día anterior en el molino.', requiere_foto: true, completado: false },
  { id: 'B-AP-5', area: 'BARRA', tipo_turno: 'APERTURA', descripcion: 'Calibrar la máquina de espresso (en base a la identidad Don Guto) y reportar stock de café.', requiere_foto: true, completado: false },
  { id: 'B-AP-6', area: 'BARRA', tipo_turno: 'APERTURA', descripcion: 'Realizar inventario de barra y postres, rotular insumos y hacer requerimiento de pedido (antes 10 am).', requiere_foto: true, completado: false },
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
  { id: 'K-AP-3', area: 'COCINA', tipo_turno: 'APERTURA', descripcion: 'Encender hornos and freidora. Verificar cilindros de gas.', requiere_foto: true, completado: false },
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
  { id: 'CL-4', descripcion: 'Limpieza de visicooler de barra', frecuencia: 'SEMANAL', completedDays: {}, role: 'Barista' },
  { id: 'CL-5', descripcion: 'Limpieza profunda de exhibidora de postres', frecuencia: 'SEMANAL', completedDays: {}, role: 'Barista' },
  { id: 'CL-9', descripcion: 'Limpieza de pared del área de barra', frecuencia: 'SEMANAL', completedDays: {}, role: 'Barista' },
  { id: 'CL-12', descripcion: 'Limpieza de electrodomésticos licuadoras/microondas', frecuencia: 'SEMANAL', completedDays: {}, role: 'Barista' },
  { id: 'CL-13', descripcion: 'Lavado de coctelería y tazas en repisa', frecuencia: 'SEMANAL', completedDays: {}, role: 'Barista' },
  { id: 'CL-14', descripcion: 'Limpieza de dispensador de papel', frecuencia: 'SEMANAL', completedDays: {}, role: 'Servicio' },
  { id: 'CL-17', descripcion: 'Limpieza de vinos y estante de botellas', frecuencia: 'SEMANAL', completedDays: {}, role: 'Servicio' },
  { id: 'CL-M1', descripcion: 'Desincrustación profunda de caldera de máquina espresso', frecuencia: 'MENSUAL', completedDays: {} },
  { id: 'CL-M2', descripcion: 'Limpieza profunda de campanas y extractores cocina', frecuencia: 'MENSUAL', completedDays: {} },
  { id: 'CL-M3', descripcion: 'Sanitización profunda de cisternas y trampas de grasa', frecuencia: 'MENSUAL', completedDays: {} },
];

export const INITIAL_TRAINING_ROUTE = [
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
  { username: 'onavarrodg', password: 'dg.osca.N9405', name: 'Oscar Navarro', role: 'Gerente', store: 'Todas', trainingProgress: {}, arrivalLogs: [] },
  { username: 'gechevarriadg', password: 'dg.gabr.E9087', name: 'Gabriela Echevarría', role: 'Gerente', store: 'Todas', trainingProgress: {}, arrivalLogs: [] },
  { username: 'cnizamadg', password: 'dg.chri.N9633', name: 'Christian Nizama', role: 'Administrador', store: '28 de Julio Miraflores', biometricId: '44179147', trainingProgress: {}, arrivalLogs: [] },
  { username: 'arianadg', password: 'dg.aria.A9928', name: 'Ariana', role: 'Auditor', store: '28 de Julio Miraflores', biometricId: '43588725', trainingProgress: {}, arrivalLogs: [] },
  { username: 'ccuevadg', password: 'dg.chri.C9458', name: 'Christian Cueva', role: 'Administrador', store: 'Todas', biometricId: '71608726', trainingProgress: {}, arrivalLogs: [] },
  { username: 'woviedodg', password: 'dg.wilf.O9580', name: 'Wilfredo Oviedo', role: 'Auditor', store: 'Todas', biometricId: '41670259', trainingProgress: {}, arrivalLogs: [] },
  { username: 'jsisniegasdg', password: 'dg.john.S15832', name: 'John Sisniegas Toralba', role: 'Auditor', store: '28 de Julio Miraflores', email: 'john.sisniegas.t@gmail.com', trainingProgress: {}, arrivalLogs: [] },
  { username: 'jortizdg', password: 'dg.juan.O9040', name: 'Juan Ortiz', role: 'Administrador', store: 'Todas', trainingProgress: {}, arrivalLogs: [] },
  { username: 'mquispedg', password: 'dg.mari.Q9008', name: 'Mario Quispe', role: 'Gerente', store: 'Todas', biometricId: '898691', trainingProgress: {}, arrivalLogs: [] },
  { username: 'mquispetec', password: 'dg.mari.T8997', name: 'Mario Quispe (Técnico)', role: 'Técnico', store: 'Todas', trainingProgress: {}, arrivalLogs: [] },
  { username: 'avasquezdg', password: 'dg.alex.V38314', name: 'Alexander Vásquez Villalobos', role: 'Servicio', store: '28 de Julio Miraflores', email: 'Alexito1836@gmail.com', telefono: '992838314', biometricId: '61096401', trainingProgress: { D1: 'Completado', D2: 'Completado', D3: 'Completado', D4: 'Completado', D5: 'Completado', D6: 'Completado', D7: 'Completado', D8: 'Completado' }, arrivalLogs: [] },
  { username: 'mbravodg', password: 'dg.moni.B75773', name: 'Mónica Daniela Bravo Rodríguez', role: 'Servicio', store: '28 de Julio Miraflores', email: 'Monikbrav7@gmail.com', telefono: '908757732', biometricId: '06587622', trainingProgress: { D1: 'Completado', D2: 'Completado', D3: 'Completado', D4: 'Completado', D5: 'Completado', D6: 'Completado', D7: 'Completado', D8: 'Completado' }, arrivalLogs: [] },
  { username: 'fsotodg', password: 'dg.fran.S04464', name: 'Franchesca Giovana Soto Chávez', role: 'Cocina', store: '28 de Julio Miraflores', email: 'fgschavez@gmail.com', telefono: '958004464', biometricId: '72306939', trainingProgress: { D1: 'Completado', D2: 'Completado', D3: 'Completado', D4: 'Completado', D5: 'Completado', D6: 'Completado', D7: 'Completado', D8: 'Completado' }, arrivalLogs: [] },
  { username: 'psilvadg', password: 'dg.patr.S26393', name: 'Patrick Silva Chávez', role: 'Barista', store: '28 de Julio Miraflores', email: 'murciegus@gmail.com', telefono: '979526393', trainingProgress: { D1: 'Completado', D2: 'Completado', D3: 'Completado', D4: 'Completado', D5: 'Completado', D6: 'Completado', D7: 'Completado', D8: 'Completado' }, arrivalLogs: [] },
  { username: 'jaymadg', password: 'dg.jesu.A22582', name: 'Jesus Ayma Chaparro', role: 'Barista', store: '28 de Julio Miraflores', email: 'jesusaymachaparro@gmail.com', telefono: '912322582', biometricId: '60979426', trainingProgress: { D1: 'Completado', D2: 'Completado', D3: 'Completado', D4: 'Completado', D5: 'Completado', D6: 'Completado', D7: 'Completado', D8: 'Completado' }, arrivalLogs: [] },
  { username: 'amosqueradg', password: 'dg.anto.M43801', name: 'Antonio Mosquera', role: 'Operaciones', store: 'Todas', email: 'antonio.mosquera@donguto.com', telefono: '999943801', biometricId: '43801971', trainingProgress: {}, arrivalLogs: [] },
  { username: 'cvidaldg', password: 'dg.ciro.V85721', name: 'Ciro Svith Vidal Ignacio', role: 'Cocina', store: '28 de Julio Miraflores', biometricId: '61268415', trainingProgress: {}, arrivalLogs: [] },
  { username: 'aolivosdg', password: 'dg.aria.O72619', name: 'Ariana Olivos', role: 'Servicio', store: '28 de Julio Miraflores', biometricId: '147242', trainingProgress: {}, arrivalLogs: [] }
];

const INITIAL_AUDIT_LOGS = [];
const INITIAL_INCIDENTS = [];

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

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('donguto-theme') || 'light');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('donguto-user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('donguto-user');
    if (saved) {
      const u = JSON.parse(saved);
      if (SUPERVISORY_ROLES.includes(u.role)) {
        return (u.username === 'mquispetec' || u.username === 'mquispedg') ? 'technical_panel' : 'monitoring';
      }
    }
    return 'checklist';
  });

  const [checklists, setChecklists] = useState(INITIAL_CHECKLISTS);
  const [lastLoadedDate, setLastLoadedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [cleaningTasks, setCleaningTasks] = useState(() => {
    const saved = localStorage.getItem('donguto-cleaning-tasks');
    if (!saved) return INITIAL_CLEANING_TASKS;
    try {
      const parsed = JSON.parse(saved);
      return INITIAL_CLEANING_TASKS.map(initialTask => {
        const savedTask = parsed.find(t => t.id === initialTask.id);
        if (savedTask) {
          return {
            ...initialTask,
            completedDays: savedTask.completedDays || {},
            evidenciaDays: savedTask.evidenciaDays || {}
          };
        }
        return initialTask;
      });
    } catch (e) {
      return INITIAL_CLEANING_TASKS;
    }
  });
  const [teamMembers, setTeamMembers] = useState(() => {
    const saved = localStorage.getItem('donguto-team');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_TEAM;
  });
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [incidents, setIncidents] = useState(() => {
    const saved = localStorage.getItem('donguto-incidents');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });
  const [biometricDevices, setBiometricDevices] = useState(() => {
    const saved = localStorage.getItem('donguto-biometric-devices');
    return saved ? JSON.parse(saved) : [];
  });
  const [biometricLogs, setBiometricLogs] = useState(() => {
    const saved = localStorage.getItem('donguto-biometric-logs');
    return saved ? JSON.parse(saved) : [];
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFirstSync, setIsFirstSync] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [detailIncidentId, setDetailIncidentId] = useState(null);

  // Date selection states
  const [selectedDateStr, setSelectedDateStr] = useState(() => new Date().toISOString().split('T')[0]);
  const [weeklySchedules, setWeeklySchedules] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('donguto-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('donguto-team', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem('donguto-cleaning-tasks', JSON.stringify(cleaningTasks));
  }, [cleaningTasks]);

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

  // Fetch users & biometric sync from ZK-Device & Supabase
  useEffect(() => {
    const fetchCloudUsers = async () => {
      try {
        const data = await attendanceService.fetchUsers();
        if (data && data.status === 'success' && data.users && data.users.length > 0) {
          let schedulesList = [];
          try {
            const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const end = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const schedRes = await schedulesService.fetchSchedules(start, end);
            if (schedRes && schedRes.status === 'success' && schedRes.schedules) {
              schedulesList = schedRes.schedules;
              setWeeklySchedules(schedRes.schedules);
            }
          } catch (se) {
            console.warn('Failed to fetch schedules:', se);
          }

          const databaseUsers = data.users.map(u => {
            const localCopy = teamMembers.find(p => p.username === u.username);
            return {
              ...u,
              trainingProgress: localCopy ? (localCopy.trainingProgress || {}) : {},
              arrivalLogs: localCopy ? (localCopy.arrivalLogs || []) : []
            };
          });
          
          try {
            const punchesData = await attendanceService.syncZKPunches();
            if (punchesData && punchesData.status === 'success' && punchesData.punches) {
              const updatedUsers = databaseUsers.map(m => {
                const bioId = String(m.biometricId || m.biometric_id || '').trim();
                if (bioId && m.role !== 'Gerente') {
                  const userPunches = punchesData.punches.filter(p => String(p.biometric_id) === bioId);
                  if (userPunches.length === 0) return { ...m, arrivalLogs: [] };
                  
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
                        finalDate = pTime.toISOString().split('T')[0];
                      }
                    }
                    if (!punchesByDate[finalDate]) punchesByDate[finalDate] = [];
                    punchesByDate[finalDate].push(finalTime);
                  });

                  const rebuiltLogs = Object.keys(punchesByDate).map(dateStr => {
                    const sortedPunches = Array.from(new Set(punchesByDate[dateStr]));
                    sortedPunches.sort((a, b) => timeToMinutes(a) - timeToMinutes(b));
                    const earliest = sortedPunches[0];
                    const latest = sortedPunches.length > 1 ? sortedPunches[sortedPunches.length - 1] : null;

                    // Dynamic schedule resolving
                    let expectedTimeStr = '07:00 AM';
                    const userDaySchedule = (schedulesList || []).find(
                      s => String(s.username).trim().toLowerCase() === String(m.username).trim().toLowerCase() && s.fecha === dateStr
                    );

                    if (SUPERVISORY_ROLES.includes(m.role)) {
                      expectedTimeStr = '--';
                    } else if (userDaySchedule && userDaySchedule.hora_entrada && userDaySchedule.hora_entrada !== 'OFF') {
                      const [hStr, mStr] = userDaySchedule.hora_entrada.split(':');
                      const hourNum = parseInt(hStr, 10);
                      const ampm = hourNum >= 12 ? 'PM' : 'AM';
                      const displayHour = hourNum > 12 ? hourNum - 12 : (hourNum === 0 ? 12 : hourNum);
                      expectedTimeStr = `${displayHour.toString().padStart(2, '0')}:${mStr} ${ampm}`;
                    } else {
                      // Smart default based on actual punch time:
                      // If punch is in afternoon (>= 13:00 / 01:00 PM), default expected time for Closing shift is 02:30 PM (14:30)
                      // If punch is in morning (< 13:00), default expected time for Opening shift is 07:00 AM
                      const [timePart, ampmPart] = earliest.split(' ');
                      let [h] = timePart.split(':').map(Number);
                      if (ampmPart === 'PM' && h < 12) h += 12;
                      if (ampmPart === 'AM' && h === 12) h = 0;
                      
                      if (h >= 13) {
                        expectedTimeStr = '02:30 PM';
                      } else {
                        expectedTimeStr = '07:00 AM';
                      }
                    }

                    let delayMin = 0;
                    if (!SUPERVISORY_ROLES.includes(m.role) && (!userDaySchedule || (userDaySchedule.hora_entrada !== 'OFF' && userDaySchedule.hora_entrada !== 'BARRANCO'))) {
                      const [timePart, ampmPart] = earliest.split(' ');
                      let [h, minVal] = timePart.split(':').map(Number);
                      if (ampmPart === 'PM' && h < 12) h += 12;
                      if (ampmPart === 'AM' && h === 12) h = 0;
                      const earliestMins = h * 60 + minVal;

                      const [expTimePart, expAmpmPart] = expectedTimeStr.split(' ');
                      let [eh, em] = expTimePart.split(':').map(Number);
                      if (expAmpmPart === 'PM' && eh < 12) eh += 12;
                      if (expAmpmPart === 'AM' && eh === 12) eh = 0;
                      const expectedMins = eh * 60 + em;

                      const diff = earliestMins - expectedMins;
                      if (diff > 5) {
                        if (userDaySchedule || diff <= 240) {
                          delayMin = diff;
                        }
                      }
                    }

                    return {
                      date: dateStr,
                      time: earliest,
                      checkOutTime: latest,
                      expectedTime: expectedTimeStr,
                      delayMin: delayMin,
                      totalPunches: sortedPunches.length,
                      allPunches: sortedPunches
                    };
                  });
                  return { ...m, arrivalLogs: rebuiltLogs };
                }
                return m;
              });
              setTeamMembers(updatedUsers);
            } else {
              setTeamMembers(databaseUsers);
            }
          } catch (punchErr) {
            console.warn('[Supabase Sync Init] ZK punches sync error:', punchErr);
            setTeamMembers(databaseUsers);
          }
        }
      } catch (err) {
        console.error('[Supabase Sync Init] Error loading users:', err);
      }
    };

    if (isFirstSync) {
      fetchCloudUsers();
      setIsFirstSync(false);
    }
  }, [isFirstSync, teamMembers]);

  // Load checklists from Supabase
  const loadDailyChecklists = async (storeName, targetDate = null) => {
    try {
      const todayStr = targetDate || new Date().toISOString().split('T')[0];
      setLastLoadedDate(todayStr);
      const storeToLoad = storeName || (user?.store === 'Todas' ? '28 de Julio Miraflores' : user?.store) || '28 de Julio Miraflores';
      const data = await checklistsService.fetchChecklists(todayStr, storeToLoad);
      if (data && data.status === 'success') {
        const list = data.records || data.checklists || [];
        setChecklists(INITIAL_CHECKLISTS.map(t => {
          const dbCheck = list.find(item => (item.taskId || item.task_id) === t.id);
          if (dbCheck) {
            return {
              ...t,
              completado: dbCheck.completado,
              evidencia: dbCheck.evidencia || null
            };
          }
          return { ...t, completado: false, evidencia: null };
        }));
      } else {
        setChecklists(INITIAL_CHECKLISTS.map(t => ({ ...t, completado: false, evidencia: null })));
      }
    } catch (err) {
      console.warn('[Checklist Sync] Failed to load checklist from Supabase:', err);
      setChecklists(INITIAL_CHECKLISTS.map(t => ({ ...t, completado: false, evidencia: null })));
    }
  };

  useEffect(() => {
    if (user) {
      loadDailyChecklists(user.store === 'Todas' ? '28 de Julio Miraflores' : user.store);
    }
  }, [user]);

  // Automatically check for 24h date rollover (new day) or tab focus
  useEffect(() => {
    const checkDateRollover = () => {
      const currentDateStr = new Date().toISOString().split('T')[0];
      if (currentDateStr !== lastLoadedDate) {
        console.log(`[Checklist Sync] Date changed from ${lastLoadedDate} to ${currentDateStr}. Resetting daily checklist for the new 24h period...`);
        if (user) {
          loadDailyChecklists(user.store === 'Todas' ? '28 de Julio Miraflores' : user.store, currentDateStr);
        } else {
          setChecklists(INITIAL_CHECKLISTS.map(t => ({ ...t, completado: false, evidencia: null })));
          setLastLoadedDate(currentDateStr);
        }
      }
    };

    const interval = setInterval(checkDateRollover, 30000);
    const handleFocus = () => checkDateRollover();
    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('visibilitychange', handleFocus);
    };
  }, [lastLoadedDate, user]);

  useEffect(() => {
    if (user && activeTab === 'checklist') {
      const todayStr = new Date().toISOString().split('T')[0];
      loadDailyChecklists(user.store === 'Todas' ? '28 de Julio Miraflores' : user.store, todayStr);
    }
  }, [activeTab, user]);

  // Save task in local state and supabase
  const handleSaveTask = async (taskId, completed, finalEvidencia = null) => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (todayStr !== lastLoadedDate) {
      setLastLoadedDate(todayStr);
    }

    setChecklists(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          return { ...t, completado: completed, evidencia: finalEvidencia };
        }
        return t;
      })
    );

    if (user) {
      try {
        const data = await checklistsService.saveChecklistTask({
          taskId,
          date: todayStr,
          completado: completed,
          evidencia: finalEvidencia,
          colaborador: user.name,
          store: user.store === 'Todas' ? '28 de Julio Miraflores' : user.store
        });
        if (data.status === 'success') {
          console.log('[Checklist Sync] Saved successfully to Supabase for date:', todayStr);
        }
      } catch (err) {
        console.warn('[Checklist Sync] Failed to save, using local state fallback:', err);
      }
    }
  };

  const handleSaveCleaning = (taskId, day, completed, evidence = null) => {
    setCleaningTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            completedDays: { ...t.completedDays, [day]: completed },
            evidenciaDays: { ...(t.evidenciaDays || {}), [day]: evidence }
          };
        }
        return t;
      })
    );
  };

  const handleClockIn = (username, date, time, expectedTime, delayMin) => {
    setTeamMembers(prev =>
      prev.map(m => {
        if (m.username === username) {
          const logs = m.arrivalLogs || [];
          const existingIdx = logs.findIndex(l => l.date === date);
          
          if (existingIdx !== -1) {
            const existingLog = logs[existingIdx];
            const allPunches = [...(existingLog.allPunches || [existingLog.time]), time];
            const uniquePunches = Array.from(new Set(allPunches));
            uniquePunches.sort((a, b) => timeToMinutes(a) - timeToMinutes(b));
            
            const earliestTime = uniquePunches[0];
            const latestTime = uniquePunches.length > 1 ? uniquePunches[uniquePunches.length - 1] : null;
            
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
            return { ...m, arrivalLogs: newLogs };
          } else {
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

  const handleApproveTrainingDay = (username, dayId, status) => {
    setTeamMembers(prev =>
      prev.map(m => {
        if (m.username === username) {
          return {
            ...m,
            trainingProgress: { ...m.trainingProgress, [dayId]: status }
          };
        }
        return m;
      })
    );
  };

  const handleAddTeamMember = (newMember) => {
    const userPassword = newMember.password || `${newMember.username}dg`;
    const memberObj = {
      ...newMember,
      password: userPassword,
      trainingProgress: {},
    };

    setTeamMembers(prev => {
      const updated = [...prev, memberObj];
      localStorage.setItem('donguto-team', JSON.stringify(updated));
      return updated;
    });

    attendanceService.createUser(memberObj)
      .catch(err => console.error('[App] Supabase create user error:', err));
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

    attendanceService.deleteUser(username)
      .catch(err => console.error('[App] Supabase delete user error:', err));
  };

  const handleSaveAudit = (auditData) => {
    setAuditLogs(prev => [auditData, ...prev]);
  };

  const handleUpdateCollaborator = (username, updatedFields) => {
    setTeamMembers(prev => prev.map(m => (m.username === username ? { ...m, ...updatedFields } : m)));

    attendanceService.updateUser(username, updatedFields)
      .catch(err => console.error('[App] Supabase update user error:', err));
  };

  const handleAddIncident = (newIncident) => {
    setIncidents(prev => {
      const updated = [newIncident, ...prev];
      incidentsService.saveIncidents(updated).catch(e => console.error(e));
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
      incidentsService.saveIncidents(updated).catch(e => console.error(e));
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
      incidentsService.saveIncidents(updated).catch(e => console.error(e));
      return updated;
    });
  };

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

    const logs = employee.arrivalLogs || [];
    const existingLog = logs.find(l => l.date === punchDateStr);
    if (existingLog) {
      const isDuplicateTime = (existingLog.allPunches || [existingLog.time]).includes(punchTimeStr) || existingLog.time === punchTimeStr || existingLog.checkOutTime === punchTimeStr;
      if (isDuplicateTime) return { success: false, message: 'Asistencia ya registrada para esta hora' };
    }

    let expectedTimeStr = '07:00 AM';
    const userDaySchedule = weeklySchedules.find(
      s => String(s.username).trim().toLowerCase() === String(employee.username).trim().toLowerCase() && s.fecha === punchDateStr
    );

    if (SUPERVISORY_ROLES.includes(employee.role)) {
      expectedTimeStr = '--';
    } else if (userDaySchedule && userDaySchedule.hora_entrada && userDaySchedule.hora_entrada !== 'OFF') {
      const [hStr, mStr] = userDaySchedule.hora_entrada.split(':');
      const hourNum = parseInt(hStr);
      const ampm = hourNum >= 12 ? 'PM' : 'AM';
      const displayHour = hourNum > 12 ? hourNum - 12 : (hourNum === 0 ? 12 : hourNum);
      expectedTimeStr = `${displayHour.toString().padStart(2, '0')}:${mStr} ${ampm}`;
    } else {
      const currentHour = now.getHours();
      if (currentHour >= 13) {
        expectedTimeStr = '02:30 PM';
      } else {
        expectedTimeStr = '07:00 AM';
      }
    }

    let delayMin = 0;
    if (!SUPERVISORY_ROLES.includes(employee.role) && (!userDaySchedule || (userDaySchedule.hora_entrada !== 'OFF' && userDaySchedule.hora_entrada !== 'BARRANCO'))) {
      const [expTimePart, expAmpmPart] = expectedTimeStr.split(' ');
      let [eh, em] = expTimePart.split(':').map(Number);
      if (expAmpmPart === 'PM' && eh < 12) eh += 12;
      if (expAmpmPart === 'AM' && eh === 12) eh = 0;
      const expectedMins = eh * 60 + em;

      const diff = currentMins - expectedMins;
      if (diff > 5) {
        if (userDaySchedule || diff <= 240) {
          delayMin = diff;
        }
      }
    }

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

  const handleLogin = (authenticatedUser) => {
    setUser(authenticatedUser);
    localStorage.setItem('donguto-user', JSON.stringify(authenticatedUser));
    if (SUPERVISORY_ROLES.includes(authenticatedUser.role)) {
      setActiveTab((authenticatedUser.username === 'mquispetec' || authenticatedUser.username === 'mquispedg') ? 'technical_panel' : 'monitoring');
    } else {
      setActiveTab('checklist');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('donguto-user');
    setCurrentView('dashboard');
    setDetailIncidentId(null);
  };

  const handleSelectIncident = (incidentId) => {
    setDetailIncidentId(incidentId);
    setCurrentView('incident-detail');
  };

  const handleCloseIncidentDetail = () => {
    setCurrentView('dashboard');
    setDetailIncidentId(null);
  };

  return (
    <AppContext.Provider value={{
      theme, setTheme,
      user, setUser,
      activeTab, setActiveTab,
      checklists, setChecklists,
      cleaningTasks, setCleaningTasks,
      teamMembers, setTeamMembers,
      auditLogs, setAuditLogs,
      incidents, setIncidents,
      biometricDevices, setBiometricDevices,
      biometricLogs, setBiometricLogs,
      isDrawerOpen, setIsDrawerOpen,
      selectedDateStr, setSelectedDateStr,
      currentView, setCurrentView,
      detailIncidentId, setDetailIncidentId,
      handleLogin, handleLogout,
      handleSaveTask, handleSaveCleaning,
      handleClockIn, handleApproveTrainingDay,
      handleAddTeamMember, handleApproveCollaborator,
      handleRejectCollaborator, handleSaveAudit,
      handleUpdateCollaborator, handleAddIncident,
      handleRespondIncident, handleUpdateIncidentStatus,
      handleUpdateDevices, handleBiometricScan,
      handleSelectIncident, handleCloseIncidentDetail,
      loadDailyChecklists,
      weeklySchedules, setWeeklySchedules,
      INITIAL_TRAINING_ROUTE
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
