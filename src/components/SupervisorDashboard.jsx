import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import OperationAudit from './OperationAudit';

const AUDIT_CRITERIA_LOOKUP = {
  P1: { text: 'El calibrado de la molienda (18g in, 36g out) se realiza antes de abrir.', cat: 'PRECISIÓN' },
  P2: { text: 'El peso de la dosis de espresso se verifica en cada preparación.', cat: 'PRECISIÓN' },
  P3: { text: 'Se utiliza la balanza para calibrar el flujo de extracción constantemente.', cat: 'PRECISIÓN' },
  P4: { text: 'El tiempo de extracción (25-30 seg) está dentro del estándar oficial.', cat: 'PRECISIÓN' },
  P5: { text: 'Se registra la temperatura del agua del grupo (90-94°C) diariamente.', cat: 'PRECISIÓN' },
  
  PR1: { text: 'El personal viste el uniforme completo, limpio y gorro/cabello recogido.', cat: 'PRESENTACIÓN' },
  PR2: { text: 'La vitrina de postres está limpia, ordenada y completamente abastecida.', cat: 'PRESENTACIÓN' },
  PR3: { text: 'Las mesas, sillas y el salón en general están limpios y ordenados.', cat: 'PRESENTACIÓN' },
  PR4: { text: 'La barra de atención está despejada de objetos personales de baristas.', cat: 'PRESENTACIÓN' },
  PR5: { text: 'La música ambiental y el volumen están en el nivel adecuado oficial.', cat: 'PRESENTACIÓN' },
  
  L1: { text: 'Se realiza la limpieza profunda de la máquina de espresso y molinos.', cat: 'LIMPIEZA' },
  L2: { text: 'Los utensilios de barra (jarras, pitchers, spoons) están desinfectados.', cat: 'LIMPIEZA' },
  L3: { text: 'Los servicios higiénicos se limpian y abastecen constantemente.', cat: 'LIMPIEZA' },
  L4: { text: 'El back of store y los equipos operativos están limpios.', cat: 'LIMPIEZA' },
  L5: { text: 'El sistema y cronograma de limpieza mensual está establecido y activo.', cat: 'LIMPIEZA' },
  
  I1: { text: 'Se corrobora una muestra de solo 10 productos y están correctamente subidos al sistema de restaurante.pe.', cat: 'INVENTARIO' },
  I2: { text: 'Verificar que el inventario físico esté alinea con el inventario en el sistema.', cat: 'INVENTARIO' },
  
  H1: { text: 'Bienvenida y recepción del cliente cálida y con sonrisa.', cat: 'HOSPITALIDAD' },
  H2: { text: 'Atención y servicio personalizado de acuerdo al cliente.', cat: 'HOSPITALIDAD' },
  H3: { text: 'Tiempo de respuesta y eficiencia al tomar el pedido.', cat: 'HOSPITALIDAD' },
  H4: { text: 'Actitud, comportamiento y presentación impecable del personal.', cat: 'HOSPITALIDAD' },
  H5: { text: 'Cumple con los 8 pasos del protocolo de servicio (OPS-01).', cat: 'HOSPITALIDAD' },
  
  M1: { text: 'Se da mantenimiento y están en buen estado techos, pisos, paredes.', cat: 'MANTENIMIENTO' },
  M2: { text: 'Los equipos operativos están en buen estado de conservación.', cat: 'MANTENIMIENTO' },
  M3: { text: 'El material publicitario (POP) actual y ayudas de venta están en buen estado.', cat: 'MANTENIMIENTO' },
  M4: { text: 'Se realiza el mantenimiento preventivo programado.', cat: 'MANTENIMIENTO' },
  M5: { text: 'Se realiza el envío y seguimiento de pendientes de mantenimiento.', cat: 'MANTENIMIENTO' },
  
  E1: { text: 'Se cuenta con el plan de entrenamiento para cada puesto.', cat: 'ENTRENAMIENTO' },
  E2: { text: 'Se tienen las Validaciones de Competencia (VC) actualizadas.', cat: 'ENTRENAMIENTO' },
  E3: { text: 'El personal tiene acceso a la carpeta compartida de manuales.', cat: 'ENTRENAMIENTO' },
  E4: { text: 'Se cuenta con el file de personal completo en físico/digital.', cat: 'ENTRENAMIENTO' },
  E5: { text: 'Se tienen las Listas de Verificación (LDV) físicas en tienda.', cat: 'ENTRENAMIENTO' }
};

const MOCK_HISTORY = {
  '2026-06-01': { score: 100, completedIds: ['B-AP-1','B-AP-2','B-AP-3','B-AP-4','B-AP-5','B-AP-6','B-AP-7','B-AP-8','B-AP-9','B-AP-10','B-AP-11','B-AP-12','B-AP-13','B-AP-14','B-AP-15','B-RL-1','B-RL-2','B-RL-3','B-CI-1','B-CI-2','B-CI-3','B-CI-4','B-CI-5','B-CI-6','B-CI-7','B-CI-8','B-CI-9','B-CI-10','B-CI-11','B-CI-12','B-CI-13','B-CI-14','B-CI-15','B-CI-16','B-CI-17','B-CI-18','B-CI-19','B-CI-20','K-AP-1','K-AP-2','K-AP-3','K-AP-4','K-AP-5','K-AP-6','K-AP-7','K-AP-8','K-CI-1','K-CI-2','K-CI-3','K-CI-4','K-CI-5','K-CI-6','S-AP-1','S-AP-2','S-AP-3','S-AP-4','S-AP-5','S-AP-6'] },
  '2026-06-02': { score: 95, completedIds: ['B-AP-1','B-AP-2','B-AP-3','B-AP-4','B-AP-5','B-AP-6','B-AP-7','B-AP-8','B-AP-9','B-AP-10','B-AP-11','B-AP-12','B-AP-13','B-AP-14','B-AP-15','B-RL-1','B-RL-2','B-RL-3','B-CI-1','B-CI-2','B-CI-3','B-CI-4','B-CI-5','B-CI-6','B-CI-7','B-CI-8','B-CI-9','B-CI-10','B-CI-11','B-CI-12','B-CI-13','B-CI-14','B-CI-15','B-CI-16','B-CI-17','B-CI-18','B-CI-19','B-CI-20','K-AP-1','K-AP-2','K-AP-3','K-AP-4','K-AP-5','K-AP-6','K-AP-7','K-AP-8','K-CI-1','K-CI-2','K-CI-3','K-CI-4','K-CI-5','K-CI-6','S-AP-1','S-AP-2','S-AP-3','S-AP-4','S-AP-5'] },
  '2026-06-03': { score: 98, completedIds: ['B-AP-1','B-AP-2','B-AP-3','B-AP-4','B-AP-5','B-AP-6','B-AP-7','B-AP-8','B-AP-9','B-AP-10','B-AP-11','B-AP-12','B-AP-13','B-AP-14','B-AP-15','B-RL-1','B-RL-2','B-RL-3','B-CI-1','B-CI-2','B-CI-3','B-CI-4','B-CI-5','B-CI-6','B-CI-7','B-CI-8','B-CI-9','B-CI-10','B-CI-11','B-CI-12','B-CI-13','B-CI-14','B-CI-15','B-CI-16','B-CI-17','B-CI-18','B-CI-19','B-CI-20','K-AP-1','K-AP-2','K-AP-3','K-AP-4','K-AP-5','K-AP-6','K-AP-7','K-AP-8','K-CI-1','K-CI-2','K-CI-3','K-CI-4','K-CI-5','K-CI-6','S-AP-1','S-AP-2','S-AP-3','S-AP-4','S-AP-5','S-AP-6'] },
  '2026-06-04': { score: 90, completedIds: ['B-AP-1','B-AP-2','B-AP-3','B-AP-4','B-AP-5','B-AP-6','B-AP-7','B-AP-8','B-AP-9','B-AP-10','B-AP-11','B-AP-12','B-AP-13','B-AP-14','B-AP-15','B-RL-1','B-RL-2','B-RL-3','B-CI-1','B-CI-2','B-CI-3','B-CI-4','B-CI-5','B-CI-6','B-CI-7','B-CI-8','B-CI-9','B-CI-10','B-CI-11','B-CI-13','B-CI-14','B-CI-15','B-CI-16','B-CI-17','B-CI-18','B-CI-19','B-CI-20','K-AP-1','K-AP-2','K-AP-3','K-AP-4','K-AP-5','K-AP-6','K-AP-7','K-AP-8','K-CI-1','K-CI-2','K-CI-3','K-CI-4','K-CI-5','S-AP-1','S-AP-2','S-AP-3','S-AP-4','S-AP-5'] },
  '2026-06-05': { score: 85, completedIds: ['B-AP-1','B-AP-2','B-AP-3','B-AP-4','B-AP-5','B-AP-6','B-AP-7','B-AP-8','B-AP-9','B-AP-10','B-AP-11','B-AP-12','B-AP-13','B-AP-14','B-AP-15','B-RL-1','B-RL-2','B-RL-3','B-CI-1','B-CI-2','B-CI-3','B-CI-4','B-CI-5','B-CI-6','B-CI-7','B-CI-8','B-CI-9','B-CI-10','B-CI-11','K-AP-1','K-AP-2','K-AP-3','K-AP-4','K-AP-5','K-AP-6','K-AP-7','K-AP-8','K-CI-1','K-CI-2','K-CI-3','K-CI-4','K-CI-5','K-CI-6','S-AP-1','S-AP-2','S-AP-3','S-AP-4'] },
  '2026-06-06': { score: 92, completedIds: ['B-AP-1','B-AP-2','B-AP-3','B-AP-4','B-AP-5','B-AP-6','B-AP-7','B-AP-8','B-AP-9','B-AP-10','B-AP-11','B-AP-12','B-AP-13','B-AP-14','B-AP-15','B-RL-1','B-RL-2','B-RL-3','B-CI-1','B-CI-2','B-CI-3','B-CI-4','B-CI-5','B-CI-6','B-CI-7','B-CI-8','B-CI-9','B-CI-10','B-CI-11','B-CI-12','B-CI-13','B-CI-14','B-CI-15','B-CI-16','B-CI-17','B-CI-18','B-CI-19','B-CI-20','K-AP-1','K-AP-2','K-AP-3','K-AP-4','K-AP-5','K-AP-6','K-AP-7','K-AP-8','K-CI-1','K-CI-2','K-CI-3','K-CI-4','K-CI-5','K-CI-6','S-AP-1','S-AP-2','S-AP-3','S-AP-4','S-AP-5','S-AP-6'] },
  '2026-06-07': { score: 100, completedIds: ['B-AP-1','B-AP-2','B-AP-3','B-AP-4','B-AP-5','B-AP-6','B-AP-7','B-AP-8','B-AP-9','B-AP-10','B-AP-11','B-AP-12','B-AP-13','B-AP-14','B-AP-15','B-RL-1','B-RL-2','B-RL-3','B-CI-1','B-CI-2','B-CI-3','B-CI-4','B-CI-5','B-CI-6','B-CI-7','B-CI-8','B-CI-9','B-CI-10','B-CI-11','B-CI-12','B-CI-13','B-CI-14','B-CI-15','B-CI-16','B-CI-17','B-CI-18','B-CI-19','B-CI-20','K-AP-1','K-AP-2','K-AP-3','K-AP-4','K-AP-5','K-AP-6','K-AP-7','K-AP-8','K-CI-1','K-CI-2','K-CI-3','K-CI-4','K-CI-5','K-CI-6','S-AP-1','S-AP-2','S-AP-3','S-AP-4','S-AP-5','S-AP-6'] },
  '2026-06-08': { score: 97, completedIds: ['B-AP-1','B-AP-2','B-AP-3','B-AP-4','B-AP-5','B-AP-6','B-AP-7','B-AP-8','B-AP-9','B-AP-10','B-AP-11','B-AP-12','B-AP-13','B-AP-14','B-AP-15','B-RL-1','B-RL-2','B-RL-3','B-CI-1','B-CI-2','B-CI-3','B-CI-4','B-CI-5','B-CI-6','B-CI-7','B-CI-8','B-CI-9','B-CI-10','B-CI-11','B-CI-12','B-CI-13','B-CI-14','B-CI-15','B-CI-16','B-CI-17','B-CI-18','B-CI-19','B-CI-20','K-AP-1','K-AP-2','K-AP-3','K-AP-4','K-AP-5','K-AP-6','K-AP-7','K-AP-8','K-CI-1','K-CI-2','K-CI-3','K-CI-4','K-CI-5','K-CI-6','S-AP-1','S-AP-2','S-AP-3','S-AP-4','S-AP-5'] },
  '2026-06-09': { score: 94, completedIds: ['B-AP-1','B-AP-2','B-AP-3','B-AP-4','B-AP-5','B-AP-6','B-AP-7','B-AP-8','B-AP-9','B-AP-10','B-AP-11','B-AP-12','B-AP-13','B-AP-14','B-AP-15','B-RL-1','B-RL-2','B-RL-3','B-CI-1','B-CI-2','B-CI-3','B-CI-4','B-CI-5','B-CI-6','B-CI-7','B-CI-8','B-CI-9','B-CI-10','B-CI-11','B-CI-12','B-CI-13','B-CI-14','B-CI-15','B-CI-16','B-CI-17','B-CI-18','B-CI-19','B-CI-20','K-AP-1','K-AP-2','K-AP-3','K-AP-4','K-AP-5','K-AP-6','K-AP-7','K-AP-8','K-CI-1','K-CI-2','K-CI-3','K-CI-4','K-CI-5','S-AP-1','S-AP-2','S-AP-3','S-AP-4','S-AP-5','S-AP-6'] },
  '2026-06-10': { score: 80, completedIds: ['B-AP-1','B-AP-2','B-AP-3','B-AP-4','B-AP-5','B-AP-6','B-AP-7','B-AP-8','B-AP-9','B-AP-10','B-AP-11','B-AP-12','B-AP-13','B-AP-14','B-AP-15','B-RL-1','B-RL-2','B-RL-3','B-CI-1','B-CI-2','B-CI-3','B-CI-4','B-CI-5','B-CI-6','B-CI-7','B-CI-8','B-CI-9','B-CI-10','B-CI-11','K-AP-1','K-AP-2','K-AP-3','K-AP-4','K-AP-5','K-AP-7','K-AP-8','K-CI-1','K-CI-2','K-CI-3','K-CI-4','S-AP-1','S-AP-2','S-AP-3','S-AP-4'] },
  '2026-06-11': { score: 98, completedIds: ['B-AP-1','B-AP-2','B-AP-3','B-AP-4','B-AP-5','B-AP-6','B-AP-7','B-AP-8','B-AP-9','B-AP-10','B-AP-11','B-AP-12','B-AP-13','B-AP-14','B-AP-15','B-RL-1','B-RL-2','B-RL-3','B-CI-1','B-CI-2','B-CI-3','B-CI-4','B-CI-5','B-CI-6','B-CI-7','B-CI-8','B-CI-9','B-CI-10','B-CI-11','B-CI-12','B-CI-13','B-CI-14','B-CI-15','B-CI-16','B-CI-17','B-CI-18','B-CI-19','B-CI-20','K-AP-1','K-AP-2','K-AP-3','K-AP-4','K-AP-5','K-AP-6','K-AP-7','K-AP-8','K-CI-1','K-CI-2','K-CI-3','K-CI-4','K-CI-5','K-CI-6','S-AP-1','S-AP-2','S-AP-3','S-AP-4','S-AP-5','S-AP-6'] }
};

const getWeekIdFromDateStr = (dateStr) => {
  const parts = dateStr.split('-');
  const day = parseInt(parts[2], 10);
  if (day <= 7) return 'W1';
  if (day <= 14) return 'W2';
  if (day <= 21) return 'W3';
  if (day <= 28) return 'W4';
  return 'W5';
};

const isTaskAssignedTo = (taskId, collaboratorName) => {
  if (!collaboratorName || collaboratorName === 'TODOS') return true;
  
  if (collaboratorName === 'Mateo Quispe') {
    return taskId.startsWith('B-AP-') || taskId.startsWith('B-RL-');
  }
  if (collaboratorName === 'Carlos Mendoza') {
    return taskId.startsWith('B-CI-');
  }
  
  if (collaboratorName === 'Gabriela Alva') {
    return taskId.startsWith('K-AP-') || taskId.startsWith('K-RL-');
  }
  if (collaboratorName === 'Elena Rojas') {
    return taskId.startsWith('K-CI-');
  }
  
  if (collaboratorName === 'Rodrigo Flores') {
    return taskId.startsWith('S-AP-');
  }
  if (collaboratorName === 'Lucía Díaz') {
    return taskId.startsWith('S-RL-') || taskId.startsWith('S-CI-');
  }
  
  return true;
};

const getTaskResponsible = (taskId) => {
  if (taskId.startsWith('B-AP-') || taskId.startsWith('B-RL-')) return 'Mateo Quispe';
  if (taskId.startsWith('B-CI-')) return 'Carlos Mendoza';
  
  if (taskId.startsWith('K-AP-') || taskId.startsWith('K-RL-')) return 'Gabriela Alva';
  if (taskId.startsWith('K-CI-')) return 'Elena Rojas';
  
  if (taskId.startsWith('S-AP-')) return 'Rodrigo Flores';
  if (taskId.startsWith('S-RL-') || taskId.startsWith('S-CI-')) return 'Lucía Díaz';
  
  return 'Sin asignar';
};

export function generateUsername(primerApellido, segundoApellido) {
  if (!primerApellido || !segundoApellido) return '';
  
  const cleanString = (str) => {
    return str
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z]/g, "");
  };

  const firstLetter = cleanString(primerApellido).charAt(0);
  const secondSurname = cleanString(segundoApellido);
  
  return `${firstLetter}${secondSurname}dg`;
}

export function generateUsernameFromName(nombres, apellidos) {
  if (!nombres || !apellidos) return '';
  
  const cleanString = (str) => {
    return str
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z]/g, "");
  };

  const firstLetter = cleanString(nombres).charAt(0);
  const firstSurname = cleanString(apellidos.split(' ')[0]);
  
  return `${firstLetter}${firstSurname}dg`;
}

export default function SupervisorDashboard({
  user,
  checklists,
  cleaningTasks,
  trainingRoute,
  teamMembers,
  auditLogs,
  onApproveTrainingDay,
  onAddTeamMember,
  onSaveAudit,
  onClockIn,
  onUpdateCollaborator,
  incidents = [],
  onRespondIncident,
  onUpdateIncidentStatus,
  onAddIncident,
  biometricDevices = [],
  biometricLogs = [],
  onUpdateDevices,
  onBiometricScan,
  onSelectIncident,
  onApproveCollaborator,
  onRejectCollaborator,
  activeTab,
  setActiveTab,
}) {
  const approvedMembers = (teamMembers || []).filter(m => !m.pendingApproval);


  // Biometric states for Técnico
  const [techDevices, setTechDevices] = useState(biometricDevices || []);
  const [newDevName, setNewDevName] = useState('');
  const [newDevModel, setNewDevModel] = useState('ZKTeco M1');
  const [newDevSn, setNewDevSn] = useState('');
  const [newDevIp, setNewDevIp] = useState('192.168.1.');
  const [newDevPort, setNewDevPort] = useState('4370');
  const [newDevStore, setNewDevStore] = useState('Barranco');
  
  // Simulator states
  const [simCollabUsername, setSimCollabUsername] = useState('');
  const [simDeviceId, setSimDeviceId] = useState('');
  const [simResult, setSimResult] = useState(null);

  // Sync state with props
  useEffect(() => {
    if (biometricDevices) {
      setTechDevices(biometricDevices);
    }
  }, [biometricDevices]);

  // Set default values for simulator dropdowns
  useEffect(() => {
    if (approvedMembers && approvedMembers.length > 0 && !simCollabUsername) {
      setSimCollabUsername(approvedMembers[0].username);
    }
    if (biometricDevices && biometricDevices.length > 0 && !simDeviceId) {
      setSimDeviceId(biometricDevices[0].id);
    }
  }, [approvedMembers, biometricDevices]);

  const handleAddDevSubmit = (e) => {
    e.preventDefault();
    if (!newDevName.trim() || !newDevIp.trim() || !newDevSn.trim()) {
      alert('Por favor, completa todos los campos requeridos (incluyendo el número de serie).');
      return;
    }

    const ipPattern = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (!ipPattern.test(newDevIp.trim())) {
      alert('Por favor, ingresa una dirección IP válida (ej: 192.168.1.150)');
      return;
    }

    const newDev = {
      id: `DEV-${Date.now().toString().slice(-4)}`,
      name: newDevName.trim(),
      model: newDevModel,
      ip: newDevIp.trim(),
      port: newDevPort.trim(),
      store: newDevStore,
      sn: newDevSn.trim(),
      status: 'Online'
    };

    const updated = [...techDevices, newDev];
    setTechDevices(updated);
    if (onUpdateDevices) {
      onUpdateDevices(updated);
    }
    setNewDevName('');
    setNewDevSn('');
    setNewDevIp('192.168.1.');
    setNewDevPort('4370');
    alert(`Dispositivo "${newDev.name}" registrado con éxito.`);
  };

  const handleDeleteDevice = (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este dispositivo biométrico de la red?')) return;
    const updated = techDevices.filter(d => d.id !== id);
    setTechDevices(updated);
    if (onUpdateDevices) {
      onUpdateDevices(updated);
    }
  };

  const toggleDeviceStatus = (id) => {
    const updated = techDevices.map(d => {
      if (d.id === id) {
        return { ...d, status: d.status === 'Online' ? 'Offline' : 'Online' };
      }
      return d;
    });
    setTechDevices(updated);
    if (onUpdateDevices) {
      onUpdateDevices(updated);
    }
  };

  const handleSimulatePhysicalScan = () => {
    if (!simCollabUsername || !simDeviceId) {
      alert('Por favor, selecciona un colaborador y un dispositivo.');
      return;
    }

    const res = onBiometricScan(simCollabUsername, simDeviceId);
    if (res && res.success) {
      setSimResult({
        success: true,
        message: `¡Marcación física simulada! Colaborador registrado a las ${res.log.time}.`
      });
    } else {
      setSimResult({
        success: false,
        message: res ? res.message : 'Error en la comunicación con la terminal.'
      });
    }
    setTimeout(() => setSimResult(null), 5000);
  };
  const [selectedUser, setSelectedUser] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [selectedAuditLog, setSelectedAuditLog] = useState(null);
  
  // States for Incident Dashboard
  const [incStoreFilter, setIncStoreFilter] = useState('Todas');
  const [incStatusFilter, setIncStatusFilter] = useState('Todos');
  const [incUrgencyFilter, setIncUrgencyFilter] = useState('Todos');
  const [incTypeFilter, setIncTypeFilter] = useState('Todos');
  const [incResponseTexts, setIncResponseTexts] = useState({});
  const [incSuccessMsg, setIncSuccessMsg] = useState('');
  const [incActiveTab, setIncActiveTab] = useState('active'); // 'active' | 'resolved'
  const [baristaStoreFilter, setBaristaStoreFilter] = useState('Todas');
  
  const [collabDetailTab, setCollabDetailTab] = useState('training'); // 'training' | 'attendance'

  const [directives, setDirectives] = useState(() => {
    const saved = localStorage.getItem('donguto-directives');
    return saved ? JSON.parse(saved) : [
      { id: 1, date: '2026-06-10', text: 'Nota de Gerencia: Reforzar el protocolo de bienvenida OPS-01 este fin de semana en todas las tiendas.', autor: 'Gerente General' },
      { id: 2, date: '2026-06-12', text: 'Directiva de Calibración: Asegurar que la calibración del espresso (18g dry input, 36g extraction) se registre antes de las 08:00 AM.', autor: 'Gerente General' }
    ];
  });
  const [newDirectiveText, setNewDirectiveText] = useState('');

  const handleAddDirective = (e) => {
    e.preventDefault();
    if (!newDirectiveText.trim()) return;
    const newDir = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      text: newDirectiveText,
      autor: 'Gerente General'
    };
    const next = [newDir, ...directives];
    setDirectives(next);
    localStorage.setItem('donguto-directives', JSON.stringify(next));
    setNewDirectiveText('');
    alert('Directiva operativa publicada con éxito.');
  };

  // States for my biometric attendance (moved to top level to satisfy Rules of Hooks)
  const [myBioState, setMyBioState] = useState('idle');
  const [myBioFeedback, setMyBioFeedback] = useState('Por favor, coloque su dedo en el lector biométrico.');
  const [myBioProgress, setMyBioProgress] = useState(0);

  // States for technical panel tab (moved to top level to satisfy Rules of Hooks)
  const [techTabSub, setTechTabSub] = useState('users'); // 'users' | 'devices' | 'docs' | 'punches'
  
  // States for system technician user management panel
  const [manageUserNames, setManageUserNames] = useState('');
  const [manageUserApellidos, setManageUserApellidos] = useState('');
  const [manageUserDni, setManageUserDni] = useState('');
  const [manageUserEmail, setManageUserEmail] = useState('');
  const [manageUserTelefono, setManageUserTelefono] = useState('');
  const [manageUserPassword, setManageUserPassword] = useState('');
  const [manageUserRole, setManageUserRole] = useState('Barista');
  const [manageUserStore, setManageUserStore] = useState('Barranco');
  const [manageUserBiometricId, setManageUserBiometricId] = useState('');

  // States for incident creation form in SupervisorDashboard
  const [createIncTitle, setCreateIncTitle] = useState('');
  const [createIncDesc, setCreateIncDesc] = useState('');
  const [createIncType, setCreateIncType] = useState('Mantenimiento');
  const [createIncUrgency, setCreateIncUrgency] = useState('Normal');
  const [createIncStore, setCreateIncStore] = useState(() => {
    return user && user.store !== 'Todas' ? user.store : 'Barranco';
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeIncidentId, setActiveIncidentId] = useState(null);
  const [hoveredIncId, setHoveredIncId] = useState(null);

  // Filter state for monitoring panel
  const [monitoringStoreFilter, setMonitoringStoreFilter] = useState('Todas');

  // Reset tab to training when collaborator changes
  useEffect(() => {
    setCollabDetailTab('training');
  }, [selectedUser]);

  // Attendance stats helpers
  const calculateAverageTime = (logs) => {
    if (!logs || logs.length === 0) return 'N/A';
    let totalMinutes = 0;
    logs.forEach(log => {
      const [timePart, ampm] = log.time.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);
      if (ampm === 'PM' && hours !== 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      totalMinutes += hours * 60 + minutes;
    });
    const avgMinutes = totalMinutes / logs.length;
    let avgHours = Math.floor(avgMinutes / 60);
    const avgMins = Math.round(avgMinutes % 60);
    const displayAmpm = avgHours >= 12 ? 'PM' : 'AM';
    if (avgHours > 12) avgHours -= 12;
    if (avgHours === 0) avgHours = 12;
    return `${avgHours.toString().padStart(2, '0')}:${avgMins.toString().padStart(2, '0')} ${displayAmpm}`;
  };

  const calculateAverageDelay = (logs) => {
    if (!logs || logs.length === 0) return 0;
    const total = logs.reduce((acc, curr) => acc + (curr.delayMin || 0), 0);
    return total / logs.length;
  };

  const getStorePunctualityStats = () => {
    const storeData = {};
    approvedMembers.forEach(member => {
      const storeName = member.store || 'Sin tienda';
      if (!storeData[storeName]) {
        storeData[storeName] = { totalDelay: 0, count: 0 };
      }
      const logs = member.arrivalLogs || [];
      if (logs.length > 0) {
        logs.forEach(log => {
          storeData[storeName].totalDelay += log.delayMin || 0;
          storeData[storeName].count += 1;
        });
      }
    });

    const result = [];
    Object.entries(storeData).forEach(([storeName, data]) => {
      if (storeName === 'Todas') return;
      const avgDelay = data.count > 0 ? data.totalDelay / data.count : 0;
      result.push({
        store: storeName,
        avgDelay: avgDelay,
        totalLogs: data.count
      });
    });

    result.sort((a, b) => b.avgDelay - a.avgDelay);
    return result;
  };

  const handleDownloadAuditPDF = (log) => {
    const safeImgSrc = (src) => {
      if (!src) return '';
      if (src.startsWith('data:image/svg+xml;utf8,') || src.startsWith('data:image/svg+xml,')) {
        try {
          const header = src.startsWith('data:image/svg+xml;utf8,') 
            ? 'data:image/svg+xml;utf8,' 
            : 'data:image/svg+xml,';
          const svgText = src.substring(header.length);
          const base64 = btoa(unescape(encodeURIComponent(svgText)));
          return `data:image/svg+xml;base64,${base64}`;
        } catch (e) {
          console.error('Error encoding SVG:', e);
          return src;
        }
      }
      return src;
    };

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("⚠️ Error: Bloqueador de ventanas emergentes activo.");
      return;
    }
    
    const categoriesMap = {};
    Object.entries(log.detalles || {}).forEach(([critId, val]) => {
      const info = AUDIT_CRITERIA_LOOKUP[critId] || { text: `Criterio ${critId}`, cat: 'OTROS' };
      if (!categoriesMap[info.cat]) {
        categoriesMap[info.cat] = [];
      }
      categoriesMap[info.cat].push({
        id: critId,
        text: info.text,
        cumple: val === true,
        plan: log.actionPlans?.[critId] || null,
        photo: log.evidencePhotos?.[critId] || null
      });
    });
    
    let ratingText = 'Excelente';
    let ratingColor = '#10b981';
    if (log.nota < 70) {
      ratingText = 'Crítico';
      ratingColor = '#ef4444';
    } else if (log.nota < 90) {
      ratingText = 'Regular';
      ratingColor = '#f59e0b';
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=1024">
        <title>Auditoría Operacional - Sede ${log.tienda}</title>
        <style>
          @page {
            size: A4;
            margin: 8mm 12mm;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #2b2b2b;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            line-height: 1.2;
            font-size: 8.5px;
          }
          .page {
            box-sizing: border-box;
            width: 186mm;
            height: 277mm;
            margin: 0 auto;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .header-logo {
            font-size: 16px;
            font-weight: 800;
            color: #fff;
            background-color: #8b1a1a;
            padding: 4px 10px;
            border-radius: 3px;
            display: inline-block;
          }
          .score-badge {
            font-size: 8px;
            font-weight: bold;
            padding: 2px 8px;
            border-radius: 10px;
            color: #fff;
            vertical-align: middle;
          }
          .category-title {
            font-size: 9px;
            font-weight: 800;
            color: #8b1a1a;
            border-bottom: 1.5px solid #8b1a1a;
            padding-bottom: 2px;
            margin-top: 8px;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .main-columns {
            display: flex;
            gap: 15px;
            flex: 1;
          }
          .column {
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          .criterion-card {
            border-bottom: 1px solid #e5e7eb;
            padding: 2.5px 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .criterion-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 6px;
          }
          .criterion-text {
            font-size: 8px;
            font-weight: 600;
            color: #333;
            line-height: 1.1;
          }
          .criterion-status {
            font-size: 7.5px;
            font-weight: bold;
            padding: 1px 3px;
            border-radius: 2px;
            text-transform: uppercase;
            white-space: nowrap;
          }
          .status-cumple {
            background-color: #d1fae5;
            color: #065f46;
          }
          .status-nocumple {
            background-color: #fee2e2;
            color: #991b1b;
          }
          .plan-box {
            background-color: #fff5f5;
            border-left: 1.5px solid #ef4444;
            border-radius: 0 2px 2px 0;
            padding: 2px 4px;
            margin-top: 2px;
            font-size: 7.5px;
            color: #991b1b;
            line-height: 1.1;
          }
          .photo-gallery {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }
          .photo-card {
            border: 1px solid #e5e7eb;
            border-radius: 3px;
            padding: 3px;
            background-color: #f9f9fb;
            width: 70px;
          }
          .photo-img {
            width: 100%;
            height: 45px;
            object-fit: contain;
            background-color: #eaeaea;
            border-radius: 2px;
          }
          .photo-title {
            font-size: 7px;
            font-weight: 700;
            margin-top: 2px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .signatures-container {
            display: flex;
            justify-content: space-between;
            gap: 10px;
          }
          .signature-box {
            text-align: center;
            width: 90px;
          }
          .signature-line {
            border-top: 1px solid #999;
            margin-top: 15px;
            padding-top: 2px;
            font-size: 8px;
            font-weight: 700;
          }
          .signature-img {
            max-height: 25px;
            max-width: 80px;
            object-fit: contain;
          }
          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div style="border-bottom: 2px solid #8b1a1a; padding-bottom: 6px; margin-bottom: 8px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="width: 30%;">
                  <div class="header-logo">DON GUTO</div>
                  <div style="font-size: 7.5px; color: #666; margin-top: 2px; text-transform: uppercase; font-weight: 700;">Control de Calidad & Operaciones</div>
                </td>
                <td style="width: 45%; font-size: 9px; color: #444; line-height: 1.35; border-left: 1px solid #e5e7eb; padding-left: 15px;">
                  <div><strong>Sede Auditada:</strong> ${log.tienda}</div>
                  <div><strong>Fecha y Hora:</strong> ${new Date(log.fecha).toLocaleString('es-PE')}</div>
                  <div><strong>Auditor:</strong> Diana Valdivia Rojas</div>
                  <div><strong>Persona Evaluada:</strong> ${log.colaboradorAuditado || 'N/A'}</div>
                </td>
                <td style="width: 25%; text-align: right;">
                  <div style="font-size: 8px; text-transform: uppercase; color: #666; font-weight: 700; margin-bottom: 2px;">Nota Ponderada</div>
                  <span style="font-size: 20px; font-weight: 800; color: ${ratingColor}; margin-right: 8px;">${log.nota.toFixed(1)}%</span>
                  <span class="score-badge" style="background-color: ${ratingColor}">${ratingText}</span>
                </td>
              </tr>
            </table>
          </div>

          <div class="main-columns">
            <div class="column">
              ${['PRECISIÓN', 'PRESENTACIÓN', 'LIMPIEZA', 'INVENTARIO'].map(catName => {
                const list = categoriesMap[catName] || [];
                if (list.length === 0) return '';
                return `
                  <div class="category-title">${catName}</div>
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    ${list.map(c => `
                      <div class="criterion-card">
                        <div class="criterion-header">
                          <span class="criterion-text">[${c.id}] ${c.text}</span>
                          <span class="criterion-status ${c.cumple ? 'status-cumple' : 'status-nocumple'}">
                            ${c.cumple ? 'Sí' : 'No'}
                          </span>
                        </div>
                        ${c.plan ? `
                          <div class="plan-box">
                            <strong>Plan:</strong> ${c.plan}
                          </div>
                        ` : ''}
                      </div>
                    `).join('')}
                  </div>
                `;
              }).join('')}
            </div>

            <div class="column">
              ${['HOSPITALIDAD', 'MANTENIMIENTO', 'ENTRENAMIENTO'].map(catName => {
                const list = categoriesMap[catName] || [];
                if (list.length === 0) return '';
                return `
                  <div class="category-title">${catName}</div>
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    ${list.map(c => `
                      <div class="criterion-card">
                        <div class="criterion-header">
                          <span class="criterion-text">[${c.id}] ${c.text}</span>
                          <span class="criterion-status ${c.cumple ? 'status-cumple' : 'status-nocumple'}">
                            ${c.cumple ? 'Sí' : 'No'}
                          </span>
                        </div>
                        ${c.plan ? `
                          <div class="plan-box">
                            <strong>Plan:</strong> ${c.plan}
                          </div>
                        ` : ''}
                      </div>
                    `).join('')}
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div style="margin-top: 10px; border-top: 1.5px solid #8b1a1a; padding-top: 8px;">
            <div style="background-color: #f9f9fb; padding: 6px 10px; border-radius: 4px; border: 1px solid #e5e7eb; font-size: 8.5px;">
              <strong>Observaciones Generales:</strong> ${log.comentarios || 'Sin observaciones generales.'}
            </div>

            <div style="display: flex; gap: 20px; margin-top: 8px; align-items: flex-start;">
              <div style="flex: 1.2;">
                ${Object.values(categoriesMap).flatMap(list => list.filter(c => c.photo)).length > 0 ? `
                  <div style="font-size: 9px; font-weight: 800; color: #8b1a1a; text-transform: uppercase; margin-bottom: 4px;">Evidencias Fotográficas</div>
                  <div class="photo-gallery">
                    ${Object.values(categoriesMap).flatMap(list => list.filter(c => c.photo)).map(c => `
                      <div class="photo-card">
                        <img class="photo-img" src="${safeImgSrc(c.photo)}" alt="Evidencia Criterio ${c.id}" />
                        <div class="photo-title">Criterio ${c.id}</div>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
              </div>

              <div style="flex: 1;" class="signatures-container">
                <div class="signature-box">
                  ${log.signatureAuditor ? `<img class="signature-img" src="${safeImgSrc(log.signatureAuditor)}" alt="Firma Auditor" />` : ''}
                  <div class="signature-line">Firma del Auditor</div>
                  <div style="font-size: 7.5px; color: #666; margin-top: 2px;">Diana Valdivia Rojas</div>
                </div>
                <div class="signature-box">
                  ${log.signatureAuditado ? `<img class="signature-img" src="${safeImgSrc(log.signatureAuditado)}" alt="Firma Auditado" />` : ''}
                  <div class="signature-line">Firma del Auditado</div>
                  <div style="font-size: 7.5px; color: #666; margin-top: 2px;">${log.colaboradorAuditado || 'Colaborador'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Auto-trigger native printing and close the temporary window/tab immediately after
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  // States for adding team member
  const [newMemberNames, setNewMemberNames] = useState('');
  const [newMemberApellidos, setNewMemberApellidos] = useState('');
  const [newMemberDni, setNewMemberDni] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberTelefono, setNewMemberTelefono] = useState('');
  const [newMemberPassword, setNewMemberPassword] = useState('');
  const [newMemberBiometricId, setNewMemberBiometricId] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Barista');
  const [newMemberStore, setNewMemberStore] = useState('Barranco');

  // Biometric registration states
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [bioStep, setBioStep] = useState(1); // 1: Select finger/device, 2: Active device/waiting, 3: Success
  const [bioProgress, setBioProgress] = useState(0);
  const [bioScanning, setBioScanning] = useState(false);
  const [currentDniTarget, setCurrentDniTarget] = useState(''); // to know which DNI is enrolling
  const [currentFormTarget, setCurrentFormTarget] = useState('team'); // 'team' or 'tech'

  // Real ZKTeco ADMS Enrollment states
  const [selectedBioDeviceSn, setSelectedBioDeviceSn] = useState('');
  const [selectedBioFingerId, setSelectedBioFingerId] = useState(6); // Default: Right Index (6)
  const [enrollCmdId, setEnrollCmdId] = useState('');
  const [enrollStatusText, setEnrollStatusText] = useState('');
  const [enrollError, setEnrollError] = useState('');

  // ZKBio Zlink File Import states
  const [importingFile, setImportingFile] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const [parsedPunchesCount, setParsedPunchesCount] = useState(0);
  const [parsedPunches, setParsedPunches] = useState([]);

  // Manager's Consolidated Attendance Table states
  const [managerSearchCollab, setManagerSearchCollab] = useState('');
  const [managerStoreFilter, setManagerStoreFilter] = useState('Todas');
  const [managerRoleFilter, setManagerRoleFilter] = useState('Todos');
  const [managerDateFilter, setManagerDateFilter] = useState('');
  const [managerStatusFilter, setManagerStatusFilter] = useState('Todos'); // 'Todos' | 'Puntual' | 'Tardanza'
  const [managerCurrentPage, setManagerCurrentPage] = useState(1);
  const [managerRowsPerPage, setManagerRowsPerPage] = useState(10);

  const FINGERS_LIST = [
    { id: 6, name: 'Índice Derecho (Recomendado)' },
    { id: 7, name: 'Medio Derecho' },
    { id: 8, name: 'Anular Derecho' },
    { id: 9, name: 'Meñique Derecho' },
    { id: 5, name: 'Pulgar Derecho' },
    { id: 3, name: 'Índice Izquierdo' },
    { id: 2, name: 'Medio Izquierdo' },
    { id: 1, name: 'Anular Izquierdo' },
    { id: 0, name: 'Meñique Izquierdo' },
    { id: 4, name: 'Pulgar Izquierdo' }
  ];

  // Polling helper
  const startPollingEnrollStatus = (commandId) => {
    const startTime = Date.now();
    const interval = setInterval(async () => {
      // Timeout after 90 seconds
      if (Date.now() - startTime > 90000) {
        clearInterval(interval);
        setBioScanning(false);
        setEnrollError('El tiempo de espera ha expirado (90s). Por favor, asegúrese de que el lector ZKTeco esté encendido y conectado a internet.');
        return;
      }

      try {
        const res = await fetch(`/api/enroll?action=status&commandId=${commandId}`);
        const data = await res.json();
        if (data.status === 'success') {
          if (data.commandStatus === 'PENDING') {
            setEnrollStatusText('Esperando conexión del lector... (asegúrese de que el lector ZKTeco esté encendido)');
          } else if (data.commandStatus === 'SENT') {
            setEnrollStatusText('🟢 ¡Lector Activado! Coloque su dedo en el lector biométrico. Realice los 3 intentos que le indica la pantalla del dispositivo.');
          } else if (data.commandStatus === 'COMPLETED') {
            clearInterval(interval);
            setBioScanning(false);
            setBioStep(3); // Success
            setEnrollStatusText('¡Registro Biométrico Exitoso!');
          } else if (data.commandStatus === 'FAILED') {
            clearInterval(interval);
            setBioScanning(false);
            setEnrollError('El dispositivo reportó un fallo en el enrolamiento. Por favor, verifique el dedo e inténtelo de nuevo.');
          }
        } else {
          throw new Error(data.error || 'Error al consultar el estado.');
        }
      } catch (err) {
        console.error('Error polling enroll status:', err);
      }
    }, 2000);

    // Store interval ID in a global or state to clear it on modal close
    window.activeBioPollingInterval = interval;
  };

  // Helper to dynamically load SheetJS (XLSX) from CDN
  const loadXLSXLib = () => {
    return new Promise((resolve, reject) => {
      if (window.XLSX) return resolve(window.XLSX);
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
      script.async = true;
      script.onload = () => {
        if (window.XLSX) resolve(window.XLSX);
        else reject(new Error('SheetJS XLSX cargada pero no disponible en el objeto global window.'));
      };
      script.onerror = () => reject(new Error('Error al descargar la librería SheetJS desde el CDN. Revisa tu conexión a internet.'));
      document.head.appendChild(script);
    });
  };

  // Convert Excel serial dates to standard JavaScript Date objects
  const parseExcelSerialDate = (serial) => {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);

    const fractional_day = serial - Math.floor(serial) + 0.0000001; // small offset to prevent rounding errors
    let total_seconds = Math.floor(86400 * fractional_day);

    const seconds = total_seconds % 60;
    total_seconds -= seconds;

    const hours = Math.floor(total_seconds / 3600);
    const minutes = Math.floor(total_seconds / 60) % 60;

    // Use UTC getters for date_info to extract the correct year, month, and date from the serial value timezone-independently
    return new Date(
      date_info.getUTCFullYear(),
      date_info.getUTCMonth(),
      date_info.getUTCDate(),
      hours,
      minutes,
      seconds
    );
  };

  // Parse JSON rows into attendance punches with smart mapping
  const parseZlinkRows = (rows) => {
    if (!Array.isArray(rows) || rows.length === 0) return [];
    
    const firstRow = rows[0];
    const keys = Object.keys(firstRow);
    
    const findKey = (patterns, excludePatterns = []) => {
      return keys.find(k => {
        const lowerK = String(k).toLowerCase().trim();
        const matchesPattern = patterns.some(p => lowerK.includes(p));
        const matchesExclude = excludePatterns.some(p => lowerK.includes(p));
        return matchesPattern && !matchesExclude;
      });
    };

    // Smart identification of columns with exclusion rules to prevent collisions
    const idKey = findKey(['dni', 'biometric_id', 'personal_id', 'user_id', 'no.', 'no', 'código', 'codigo', 'code', 'id', 'documento', 'número de personal', 'numero de personal', 'colaborador', 'usuario']);
    const punchListKey = findKey(['registros de perforación', 'registros de perforacion', 'punch_list', 'lista_marcaciones', 'marcajes']);
    const dateTimeKey = findKey(
      ['fecha/hora', 'fechayhora', 'timestamp', 'punch_time', 'punchtime', 'time', 'datetime', 'date_time', 'marcación', 'marcacion', 'fecha y hora', 'reloj', 'registro'],
      ['registros de perforación', 'registros de perforacion', 'número de', 'numero de', 'cantidad de']
    );
    const dateKey = findKey(['fecha', 'date', 'día', 'dia'], ['fecha/hora', 'fechayhora', 'fecha y hora']);
    const timeKey = findKey(['hora', 'time', 'tiempo'], ['fecha/hora', 'fechayhora', 'fecha y hora', 'registros de perforación', 'registros de perforacion']);

    console.log('[Import Parser] Mapeo de columnas:', { idKey, dateTimeKey, dateKey, timeKey, punchListKey });

    if (!idKey) {
      throw new Error('No se pudo encontrar la columna de identificación del empleado (ej. DNI, ID, Código, No. o Personal ID). Revisa los encabezados de tu archivo.');
    }

    if (!dateTimeKey && (!dateKey || (!timeKey && !punchListKey))) {
      throw new Error('No se pudieron encontrar columnas de Fecha/Hora válidas. El archivo debe contener una columna combinada (Fecha/Hora) o columnas separadas (Fecha y Hora / Lista de perforaciones).');
    }

    const parsed = [];
    rows.forEach((row, idx) => {
      const bioIdRaw = row[idKey];
      if (bioIdRaw === undefined || bioIdRaw === null) return;
      const biometricId = String(bioIdRaw).trim();
      if (!biometricId) return;

      // Handle grouped punch list format (e.g. "17:12, 17:19, 18:10")
      if (dateKey && row[dateKey] && punchListKey && row[punchListKey] !== undefined && row[punchListKey] !== null) {
        const dVal = row[dateKey];
        const listVal = row[punchListKey];
        
        let datePart = '';
        if (typeof dVal === 'number') {
          const parsedD = parseExcelSerialDate(dVal);
          const yr = parsedD.getFullYear();
          const mo = String(parsedD.getMonth() + 1).padStart(2, '0');
          const dy = String(parsedD.getDate()).padStart(2, '0');
          datePart = `${yr}-${mo}-${dy}`;
        } else {
          datePart = String(dVal).trim();
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

        if (listVal !== undefined && listVal !== null) {
          let times = [];
          if (typeof listVal === 'number') {
            // Single punch in Excel interpreted as serial time
            const parsedT = parseExcelSerialDate(listVal);
            const pad = (num) => String(num).padStart(2, '0');
            const timeStr = `${pad(parsedT.getHours())}:${pad(parsedT.getMinutes())}`;
            times = [timeStr];
          } else {
            times = String(listVal).split(/[,;]/);
          }

          times.forEach(t => {
            let timePart = t.trim();
            if (!timePart) return;
            if (timePart.split(':').length === 2) {
              timePart = `${timePart}:00`;
            }
            const punchTimestamp = new Date(`${datePart}T${timePart}`);
            if (punchTimestamp && !isNaN(punchTimestamp.getTime())) {
              parsed.push({
                biometric_id: biometricId,
                timestamp: punchTimestamp.toISOString()
              });
            }
          });
        }
        return;
      }

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
            const yr = parsedD.getFullYear();
            const mo = String(parsedD.getMonth() + 1).padStart(2, '0');
            const dy = String(parsedD.getDate()).padStart(2, '0');
            datePart = `${yr}-${mo}-${dy}`;
          } else {
            datePart = String(dVal).trim();
          }

          if (typeof tVal === 'number') {
            const parsedT = parseExcelSerialDate(tVal);
            const pad = (num) => String(num).padStart(2, '0');
            timePart = `${pad(parsedT.getHours())}:${pad(parsedT.getMinutes())}:${pad(parsedT.getSeconds())}`;
          } else {
            timePart = String(tVal).trim();
          }
          
          // Reformat date if needed (e.g. DD/MM/YYYY to YYYY-MM-DD)
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

          // Force HH:MM:SS format
          if (timePart.split(':').length === 2) {
            timePart = `${timePart}:00`;
          }

          punchTimestamp = new Date(`${datePart}T${timePart}`);
        }
      }

      if (!punchTimestamp || isNaN(punchTimestamp.getTime())) {
        console.warn(`[Import Parser] Fila ${idx + 2} omitida por formato de fecha/hora inválido:`, row);
        return;
      }

      parsed.push({
        biometric_id: biometricId,
        timestamp: punchTimestamp.toISOString()
      });
    });

    return parsed;
  };

  const handleZlinkFileImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImportError('');
    setImportSuccess('');
    setParsedPunches([]);
    setParsedPunchesCount(0);
    setImportingFile(true);

    try {
      const fileName = file.name.toLowerCase();
      const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
      const isCsv = fileName.endsWith('.csv');

      if (!isExcel && !isCsv) {
        throw new Error('Formato de archivo no soportado. Por favor sube un archivo Excel (.xlsx, .xls) o CSV (.csv).');
      }

      let rows = [];

      if (isExcel) {
        const XLSX = await loadXLSXLib();
        const reader = new FileReader();
        
        const data = await new Promise((resolve, reject) => {
          reader.onload = (evt) => resolve(evt.target.result);
          reader.onerror = (err) => reject(err);
          reader.readAsArrayBuffer(file);
        });

        const workbook = XLSX.read(data, { type: 'buffer' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Default parse
        let tempRows = XLSX.utils.sheet_to_json(worksheet, { defval: null });
        
        // Detect if we need to skip a title row (e.g. "Marcajes Totales" in Row 1)
        const keys = tempRows.length > 0 ? Object.keys(tempRows[0]) : [];
        const hasExpectedHeader = keys.some(k => {
          const lk = String(k).toLowerCase();
          return lk.includes('id') || lk.includes('dni') || lk.includes('personal') || lk.includes('código') || lk.includes('codigo') || lk.includes('colaborador');
        });

        if (!hasExpectedHeader && tempRows.length > 0) {
          // Parse starting from Row 2 (range: 1)
          const tempRowsAlt = XLSX.utils.sheet_to_json(worksheet, { range: 1, defval: null });
          const keysAlt = tempRowsAlt.length > 0 ? Object.keys(tempRowsAlt[0]) : [];
          const hasExpectedHeaderAlt = keysAlt.some(k => {
            const lk = String(k).toLowerCase();
            return lk.includes('id') || lk.includes('dni') || lk.includes('personal') || lk.includes('código') || lk.includes('codigo') || lk.includes('colaborador');
          });
          if (hasExpectedHeaderAlt) {
            rows = tempRowsAlt;
          } else {
            rows = tempRows;
          }
        } else {
          rows = tempRows;
        }

      } else {
        // Parse CSV
        const reader = new FileReader();
        const text = await new Promise((resolve, reject) => {
          reader.onload = (evt) => resolve(evt.target.result);
          reader.onerror = (err) => reject(err);
          reader.readAsText(file, 'utf-8');
        });

        const lines = text.split(/\r?\n/).filter(line => line.trim());
        if (lines.length === 0) throw new Error('El archivo CSV está vacío.');

        // Search for the line that has 'ID de persona' or similar header keywords
        let headerIndex = 0;
        for (let i = 0; i < Math.min(lines.length, 5); i++) {
          const l = lines[i].toLowerCase();
          if (l.includes('id de persona') || l.includes('id') || l.includes('dni') || l.includes('personal') || l.includes('código') || l.includes('codigo') || l.includes('colaborador')) {
            headerIndex = i;
            break;
          }
        }

        const headerLine = lines[headerIndex];
        let separator = ',';
        const commas = (headerLine.match(/,/g) || []).length;
        const semicolons = (headerLine.match(/;/g) || []).length;
        const tabs = (headerLine.match(/\t/g) || []).length;

        if (semicolons > commas && semicolons > tabs) separator = ';';
        else if (tabs > commas && tabs > semicolons) separator = '\t';

        const parseCsvLine = (line) => {
          const result = [];
          let current = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === separator && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current.trim());
          return result;
        };

        const headers = parseCsvLine(headerLine);
        rows = lines.slice(headerIndex + 1).map(line => {
          const values = parseCsvLine(line);
          const obj = {};
          headers.forEach((header, index) => {
            obj[header] = values[index] !== undefined ? values[index] : null;
          });
          return obj;
        });
      }

      console.log('[Import] Filas leídas:', rows.length);
      const parsed = parseZlinkRows(rows);
      console.log('[Import] Marcaciones válidas encontradas:', parsed.length);

      if (parsed.length === 0) {
        throw new Error('No se encontraron marcaciones válidas en el archivo. Verifica los DNI/Códigos y el formato de fecha/hora.');
      }

      setParsedPunches(parsed);
      setParsedPunchesCount(parsed.length);
      setImportSuccess(`🟢 Archivo procesado correctamente.\nSe detectaron ${parsed.length} marcaciones válidas listas para importar.\n\nPor favor, presiona el botón "Confirmar e Importar" para cargarlos en la nube.`);

    } catch (err) {
      console.error('[Import Error]:', err);
      setImportError(err.message || 'Error desconocido al procesar el archivo.');
    } finally {
      setImportingFile(false);
      e.target.value = '';
    }
  };

  const handleConfirmImport = async () => {
    if (parsedPunches.length === 0) return;

    setImportingFile(true);
    setImportError('');
    setImportSuccess('');

    const selectedDevice = techDevices.find(d => d.sn === selectedBioDeviceSn) || {
      sn: 'ZLINK-IMPORT',
      name: 'ZKBio Zlink Portal'
    };

    const punchesToUpload = parsedPunches.map(p => {
      return {
        ...p,
        device_id: selectedDevice.sn || 'ZLINK-IMPORT',
        device_name: selectedDevice.name
      };
    });

    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'import',
          punches: punchesToUpload
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Fallo en la comunicación con el servidor.');

      setImportSuccess(`🟢 ¡Éxito de Importación!\nSe registraron ${punchesToUpload.length} marcaciones correctamente en Supabase.\nEl sistema actualizará las estadísticas de ingreso y tardanza en unos segundos de forma automática.`);
      setParsedPunches([]);
      setParsedPunchesCount(0);
      
    } catch (err) {
      console.error('[Confirm Import Error]:', err);
      setImportError(err.message || 'Error al guardar las marcaciones en el servidor.');
    } finally {
      setImportingFile(false);
    }
  };

  const handleClearImportedPunches = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar todas las marcaciones importadas desde Excel? Esto limpiará el historial importado de Supabase.')) {
      return;
    }
    setImportingFile(true);
    setImportError('');
    setImportSuccess('');
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'clear_imported'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Fallo en la comunicación con el servidor.');
      
      setImportSuccess('🧹 Se eliminaron correctamente todas las marcaciones importadas de la base de datos.');
      setParsedPunches([]);
      setParsedPunchesCount(0);
      
      localStorage.removeItem('donguto-biometric-logs');
      
    } catch (err) {
      console.error('[Clear Imported Punches Error]:', err);
      setImportError(err.message || 'Error al eliminar las marcaciones importadas.');
    } finally {
      setImportingFile(false);
    }
  };

  const handleStartRealEnroll = async () => {
    if (!selectedBioDeviceSn) {
      alert('Por favor, selecciona un dispositivo biométrico con Número de Serie.');
      return;
    }
    
    setBioScanning(true);
    setEnrollError('');
    setEnrollStatusText('Enviando orden de enrolamiento al servidor...');
    setBioStep(2); // Step 2: Waiting/Scanning

    try {
      const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'create',
          dni: currentDniTarget,
          fingerId: Number(selectedBioFingerId),
          deviceSn: selectedBioDeviceSn
        })
      });

      const data = await response.json();
      if (data.status === 'success' && data.commandId) {
        setEnrollCmdId(data.commandId);
        setEnrollStatusText('Orden registrada. Esperando que el dispositivo ZKTeco reciba la orden...');
        startPollingEnrollStatus(data.commandId);
      } else {
        throw new Error(data.error || 'No se pudo crear la orden de enrolamiento.');
      }
    } catch (err) {
      setBioScanning(false);
      setEnrollError(err.message);
      setEnrollStatusText('');
    }
  };

  const generateSecurePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%&*';
    
    let pass = '';
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
    pass += upperChars.charAt(Math.floor(Math.random() * upperChars.length));
    pass += numbers.charAt(Math.floor(Math.random() * numbers.length));
    pass += special.charAt(Math.floor(Math.random() * special.length));
    
    const all = chars + upperChars + numbers + special;
    for (let i = 0; i < 4; i++) {
      pass += all.charAt(Math.floor(Math.random() * all.length));
    }
    return pass.split('').sort(() => 0.5 - Math.random()).join('');
  };

  // New states for Monitoreo Avanzado
  const [filterArea, setFilterArea] = useState('GENERAL');
  const [viewMode, setViewMode] = useState('DIARIO');
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCollaborator, setSelectedCollaborator] = useState('TODOS');

  // Reset collaborator filter when changing department
  useEffect(() => {
    setSelectedCollaborator('TODOS');
  }, [filterArea]);

  const [checklistStoreFilter, setChecklistStoreFilter] = useState(user.store === 'Todas' ? 'Todas' : user.store);
  const [dbChecklists, setDbChecklists] = useState([]);
  const [loadingChecklists, setLoadingChecklists] = useState(false);

  const fetchChecklistsFromDb = async (date, store) => {
    setLoadingChecklists(true);
    try {
      const res = await fetch(`/api/checklists?date=${date}&store=${store}`);
      const data = await res.json();
      if (data.status === 'success' && data.records) {
        setDbChecklists(data.records);
      } else {
        setDbChecklists([]);
      }
    } catch (err) {
      console.warn('[Checklist Fetch] Failed, using local fallback:', err);
      setDbChecklists([]);
    } finally {
      setLoadingChecklists(false);
    }
  };

  useEffect(() => {
    fetchChecklistsFromDb(selectedDateStr, checklistStoreFilter);
  }, [selectedDateStr, checklistStoreFilter]);

  const visibleMembers = user.role === 'Administrador'
    ? approvedMembers.filter(m => m.store === user.store && ['Barista', 'Cocina', 'Servicio'].includes(m.role))
    : approvedMembers;

  const visibleLogs = user.role === 'Administrador'
    ? auditLogs.filter(log => log.tienda === user.store)
    : auditLogs;

  const MOCK_PHOTO_URL = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="100%" height="100%" fill="%238b1a1a"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%23ffffff">Evidencia Don Guto</text></svg>';

  const handleNavigateDate = (direction) => {
    const parts = selectedDateStr.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const currentDate = new Date(year, month, day, 12, 0, 0);
    
    if (direction === 'prev') {
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const newYear = currentDate.getFullYear();
    const newMonth = currentDate.getMonth();
    const newDay = currentDate.getDate();
    
    const formattedDate = `${newYear}-${(newMonth + 1).toString().padStart(2, '0')}-${newDay.toString().padStart(2, '0')}`;
    const todayStr = new Date().toISOString().split('T')[0];
    
    if (formattedDate >= '2026-06-01' && formattedDate <= todayStr) {
      setSelectedDateStr(formattedDate);
    }
  };

  const getTasksForSelectedDate = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    // If it is today and we have no database records loaded, fall back to live checklists prop
    if (selectedDateStr === todayStr && dbChecklists.length === 0) {
      return checklists;
    }

    return checklists.map(t => {
      const matched = dbChecklists.find(r => r.taskId === t.id);
      if (matched) {
        return {
          ...t,
          completado: matched.completado,
          evidencia: matched.evidencia
        };
      }

      // For historical dates, fall back to MOCK_HISTORY if no database record exists
      if (selectedDateStr !== todayStr) {
        const isCompleted = (MOCK_HISTORY[selectedDateStr]?.completedIds || []).includes(t.id);
        return {
          ...t,
          completado: isCompleted,
          evidencia: isCompleted ? (t.requiere_foto ? MOCK_PHOTO_URL : null) : null
        };
      }

      return {
        ...t,
        completado: false,
        evidencia: null
      };
    });
  };

  const getStoreComplianceForArea = (storeName, areaCode, dateStr, collaborator = 'TODOS') => {
    const todayStr = new Date().toISOString().split('T')[0];
    const storeDbChecklists = dbChecklists.filter(r => r.store === storeName || r.tienda === storeName);
    
    if (dateStr === todayStr && storeDbChecklists.length === 0) {
      const filteredChecklists = checklists.filter(t => {
        const matchArea = areaCode === 'GENERAL' || t.area === areaCode;
        const matchCollab = isTaskAssignedTo(t.id, collaborator);
        return matchArea && matchCollab;
      });
      const total = filteredChecklists.length;
      const completed = filteredChecklists.filter(t => t.completado).length;
      return total > 0 ? (completed / total) * 100 : 0;
    }

    const tasksForDate = checklists.map(t => {
      const matched = storeDbChecklists.find(r => r.taskId === t.id);
      if (matched) {
        return {
          ...t,
          completado: matched.completado
        };
      }

      if (dateStr !== todayStr) {
        const isCompleted = (MOCK_HISTORY[dateStr]?.completedIds || []).includes(t.id);
        return {
          ...t,
          completado: isCompleted
        };
      }

      return {
        ...t,
        completado: false
      };
    });

    const filtered = tasksForDate.filter(t => {
      const matchArea = areaCode === 'GENERAL' || t.area === areaCode;
      const matchCollab = isTaskAssignedTo(t.id, collaborator);
      return matchArea && matchCollab;
    });
    const total = filtered.length;
    const completed = filtered.filter(t => t.completado).length;
    return total > 0 ? (completed / total) * 100 : 0;
  };

  const getComplianceForStats = (areaCode, dateStr, collaborator = 'TODOS') => {
    if (checklistStoreFilter === 'Todas') {
      const stores = ['Barranco', 'Miraflores', 'San Isidro'];
      const compliances = stores.map(store => getStoreComplianceForArea(store, areaCode, dateStr, collaborator));
      return compliances.reduce((acc, val) => acc + val, 0) / stores.length;
    } else {
      return getStoreComplianceForArea(checklistStoreFilter, areaCode, dateStr, collaborator);
    }
  };

  // Calculate overall metrics per department
  const getDepartmentStats = (areaCode) => {
    const list = checklists.filter(t => t.area === areaCode);
    const total = list.length;
    const completed = list.filter(t => t.completado).length;
    return total > 0 ? (completed / total) * 100 : 0;
  };

  // Calculate total weeks in the current month for compliance stats
  const getWeeksCountForMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    let count = 0;
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dDate = new Date(year, month, d);
      if (dDate.getDay() === 0 || d === lastDay.getDate()) {
        count++;
      }
    }
    return count;
  };
  const totalWeeks = getWeeksCountForMonth(new Date());

  const stats = {
    barra: getDepartmentStats('BARRA'),
    cocina: getDepartmentStats('COCINA'),
    salon: getDepartmentStats('SALON'),
    limpieza: (cleaningTasks.reduce((acc, t) => acc + Object.values(t.completedDays).filter(Boolean).length, 0) / (cleaningTasks.length * totalWeeks)) * 100,
  };

  const getQuincenalStatus = () => {
    const storeKey = user.role === 'Administrador' ? user.store : 'Barranco';
    const storeLogs = auditLogs.filter(log => log.tienda === storeKey);
    const today = new Date('2026-06-12T12:00:00Z'); // simulated today
    
    if (storeLogs.length === 0) {
      return { status: 'PENDIENTE', daysPast: 999, label: '🔴 VENCIDA (SIN REGISTRO)', lastDateStr: 'Nunca', daysRemaining: 0 };
    }
    
    const sorted = [...storeLogs].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    const lastDate = new Date(sorted[0].fecha);
    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + 15);
    const daysRemaining = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 15) {
      return { 
        status: 'VENCIDA', 
        daysPast: diffDays, 
        label: '🔴 VENCIDA / URGENTE', 
        lastDateStr: lastDate.toLocaleDateString(),
        daysRemaining: daysRemaining
      };
    }
    return { 
      status: 'AL_DIA', 
      daysPast: diffDays, 
      label: '🟢 AL DÍA', 
      lastDateStr: lastDate.toLocaleDateString(),
      daysRemaining: daysRemaining
    };
  };

  const auditStatus = getQuincenalStatus();

  const selectedDateStats = {
    barra: getComplianceForStats('BARRA', selectedDateStr, filterArea === 'BARRA' ? selectedCollaborator : 'TODOS'),
    cocina: getComplianceForStats('COCINA', selectedDateStr, filterArea === 'COCINA' ? selectedCollaborator : 'TODOS'),
    salon: getComplianceForStats('SALON', selectedDateStr, filterArea === 'SALON' ? selectedCollaborator : 'TODOS'),
    limpieza: stats.limpieza,
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberNames.trim() || !newMemberApellidos.trim() || !newMemberDni.trim() || !newMemberPassword.trim()) {
      alert('Por favor, completa Nombres, Apellidos, DNI y Contraseña.');
      return;
    }
    
    const fullName = `${newMemberNames.trim()} ${newMemberApellidos.trim()}`;
    const generatedUser = generateUsernameFromName(newMemberNames, newMemberApellidos);
    
    if (!generatedUser) {
      alert('Error al generar el nombre de usuario.');
      return;
    }
    
    if (teamMembers.some(m => m.username === generatedUser)) {
      alert(`El usuario generado "${generatedUser}" ya existe.`);
      return;
    }

    onAddTeamMember({
      name: fullName,
      username: generatedUser,
      password: newMemberPassword.trim(),
      apellidos: newMemberApellidos.trim(),
      dni: newMemberDni.trim(),
      email: newMemberEmail.trim() || null,
      telefono: newMemberTelefono.trim() || null,
      role: newMemberRole,
      store: newMemberStore,
      biometricId: newMemberBiometricId.trim() || null,
      pendingApproval: false,
      addedBy: user.name,
      addedByUsername: user.username,
      dateAdded: new Date().toISOString()
    });

    setNewMemberNames('');
    setNewMemberApellidos('');
    setNewMemberDni('');
    setNewMemberEmail('');
    setNewMemberTelefono('');
    setNewMemberPassword('');
    setNewMemberBiometricId('');
    
    alert(`Colaborador ${fullName} agregado con éxito.\nUsuario generado: ${generatedUser}`);
  };

  const renderCalendarioView = () => {
    const weekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const daysInJune = 30;

    // Calculate Week 1 (June 1 - 7) average
    let sumW1 = 0;
    for (let d = 1; d <= 7; d++) {
      const dateStr = `2026-06-${d.toString().padStart(2, '0')}`;
      sumW1 += getComplianceForStats(filterArea, dateStr, selectedCollaborator);
    }
    const avgW1 = sumW1 / 7;

    // Calculate Week 2 (June 8 - 14, data available for 8-12)
    let sumW2 = 0;
    let daysW2 = 0;
    for (let d = 8; d <= 12; d++) {
      const dateStr = `2026-06-${d.toString().padStart(2, '0')}`;
      sumW2 += getComplianceForStats(filterArea, dateStr, selectedCollaborator);
      daysW2++;
    }
    const avgW2 = daysW2 > 0 ? sumW2 / daysW2 : 0;

    // Calculate June monthly average (June 1 - 12)
    let sumMonth = 0;
    for (let d = 1; d <= 12; d++) {
      const dateStr = `2026-06-${d.toString().padStart(2, '0')}`;
      sumMonth += getComplianceForStats(filterArea, dateStr, selectedCollaborator);
    }
    const avgMonth = sumMonth / 12;

    // Calculate 2026 Yearly average (weighted Jan-May as 90.8% and June as calculated)
    const avgYear = (90.8 * 5 + avgMonth) / 6;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Calendar Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Calendario de Cumplimiento - Junio 2026</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                Visualización de cumplimiento del departamento: <strong style={{ color: 'var(--primary)' }}>{filterArea}</strong>
                {selectedCollaborator !== 'TODOS' && <span> | Colaborador: <strong style={{ color: 'var(--primary)' }}>{selectedCollaborator}</strong></span>}.
                Haz clic en un día registrado para ver su checklist detallado.
              </p>
            </div>
            
            {/* Color Legend */}
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', fontSize: '11px', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
                <span>Excelente (&ge;90%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--warning)' }} />
                <span>Regular (70-89%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--error)' }} />
                <span>Alerta (&lt;70%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--text-muted)', opacity: 0.3 }} />
                <span>Sin registrar</span>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {/* Weekdays header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontWeight: 700, fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', paddingBottom: '5px' }}>
              {weekdays.map(w => (
                <div key={w} style={{ padding: '8px 0' }}>{w}</div>
              ))}
            </div>

            {/* Days grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
              {Array.from({ length: daysInJune }, (_, i) => {
                const day = i + 1;
                const dateStr = `2026-06-${day.toString().padStart(2, '0')}`;
                const hasData = day <= 12;
                
                let pct = 0;
                let bg = 'var(--bg-main)';
                let color = 'var(--text-muted)';
                let border = '1px solid var(--border)';
                let statusLabel = 'Sin datos';
                
                if (hasData) {
                  pct = getComplianceForStats(filterArea, dateStr, selectedCollaborator);
                  if (pct >= 90) {
                    bg = 'var(--success-light)';
                    color = 'var(--success)';
                    border = '1px solid var(--success)';
                    statusLabel = 'Excelente';
                  } else if (pct >= 70) {
                    bg = 'var(--warning-light)';
                    color = 'var(--warning)';
                    border = '1px solid var(--warning)';
                    statusLabel = 'Regular';
                  } else {
                    bg = 'var(--error-light)';
                    color = 'var(--error)';
                    border = '1px solid var(--error)';
                    statusLabel = 'Alerta';
                  }
                }

                return (
                  <div
                    key={day}
                    onClick={() => {
                      if (hasData) {
                        setSelectedDateStr(dateStr);
                        setViewMode('DIARIO');
                      }
                    }}
                    className={hasData ? "animate-scale-in" : ""}
                    style={{
                      height: '90px',
                      padding: '10px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: bg,
                      border: border,
                      color: color,
                      cursor: hasData ? 'pointer' : 'default',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      opacity: hasData ? 1 : 0.45,
                      transition: 'all 0.2s ease',
                      boxShadow: hasData ? 'var(--shadow-sm)' : 'none',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      if (hasData) {
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (hasData) {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '15px', fontWeight: 800 }}>{day}</span>
                      {hasData && (
                        <span style={{
                          fontSize: '8px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          backgroundColor: color,
                          color: '#fff',
                          padding: '1px 4px',
                          borderRadius: '3px'
                        }}>
                          {statusLabel}
                        </span>
                      )}
                    </div>
                    
                    {hasData ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>{pct.toFixed(0)}%</span>
                        <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Cumplido</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Pendiente</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Aggregates Dashboard Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
          {/* Week 1 Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Promedio Semana 1</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: avgW1 >= 90 ? 'var(--success)' : avgW1 >= 70 ? 'var(--warning)' : 'var(--error)' }}>
                {avgW1.toFixed(1)}%
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>01 - 07 Jun</span>
            </div>
            <div style={{ height: '4px', backgroundColor: 'var(--bg-main)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${avgW1}%`, height: '100%', backgroundColor: avgW1 >= 90 ? 'var(--success)' : avgW1 >= 70 ? 'var(--warning)' : 'var(--error)' }} />
            </div>
          </div>

          {/* Week 2 Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Promedio Semana 2</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: avgW2 >= 90 ? 'var(--success)' : avgW2 >= 70 ? 'var(--warning)' : 'var(--error)' }}>
                {avgW2.toFixed(1)}%
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>08 - 12 Jun (Activo)</span>
            </div>
            <div style={{ height: '4px', backgroundColor: 'var(--bg-main)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${avgW2}%`, height: '100%', backgroundColor: avgW2 >= 90 ? 'var(--success)' : avgW2 >= 70 ? 'var(--warning)' : 'var(--error)' }} />
            </div>
          </div>

          {/* Monthly Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Promedio Mensual (Junio)</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: avgMonth >= 90 ? 'var(--success)' : avgMonth >= 70 ? 'var(--warning)' : 'var(--error)' }}>
                {avgMonth.toFixed(1)}%
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Junio 2026</span>
            </div>
            <div style={{ height: '4px', backgroundColor: 'var(--bg-main)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${avgMonth}%`, height: '100%', backgroundColor: avgMonth >= 90 ? 'var(--success)' : avgMonth >= 70 ? 'var(--warning)' : 'var(--error)' }} />
            </div>
          </div>

          {/* Yearly Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Promedio Anual (2026)</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: avgYear >= 90 ? 'var(--success)' : avgYear >= 70 ? 'var(--warning)' : 'var(--error)' }}>
                {avgYear.toFixed(1)}%
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Proyección 2026</span>
            </div>
            <div style={{ height: '4px', backgroundColor: 'var(--bg-main)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${avgYear}%`, height: '100%', backgroundColor: avgYear >= 90 ? 'var(--success)' : avgYear >= 70 ? 'var(--warning)' : 'var(--error)' }} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWeeklyCleaningChecklist = () => {
    const weekId = getWeekIdFromDateStr(selectedDateStr);
    
    const getWeekLabel = (wId) => {
      if (wId === 'W1') return 'Semana 1: 01 - 07 Jun';
      if (wId === 'W2') return 'Semana 2: 08 - 14 Jun (En curso)';
      if (wId === 'W3') return 'Semana 3: 15 - 21 Jun';
      if (wId === 'W4') return 'Semana 4: 22 - 28 Jun';
      return `Semana: ${wId}`;
    };

    const getCleaningTasks = () => {
      const allTasks = [];
      
      cleaningTasks.forEach(t => {
        let area = 'BARRA';
        let responsible = 'Mateo Quispe';
        
        if (['CL-K1', 'CL-K2', 'CL-K3', 'CL-K4', 'CL-M2'].includes(t.id)) {
          area = 'COCINA';
          responsible = ['CL-K2', 'CL-K4', 'CL-M2'].includes(t.id) ? 'Elena Rojas' : 'Gabriela Alva';
        } else if (['CL-S1', 'CL-S2', 'CL-S3', 'CL-S4'].includes(t.id)) {
          area = 'SALON';
          responsible = ['CL-S2', 'CL-S4'].includes(t.id) ? 'Lucía Díaz' : 'Rodrigo Flores';
        } else {
          area = 'BARRA';
          responsible = ['CL-3', 'CL-9', 'CL-13', 'CL-14', 'CL-17', 'CL-M3'].includes(t.id) ? 'Carlos Mendoza' : 'Mateo Quispe';
        }
        
        allTasks.push({
          ...t,
          area,
          responsible
        });
      });
      
      return allTasks;
    };

    const isCompleted = (task, wId) => {
      const taskState = cleaningTasks.find(t => t.id === task.id);
      if (taskState && taskState.completedDays) {
        if (taskState.completedDays[wId] !== undefined) {
          return taskState.completedDays[wId];
        }
      }
      if (wId === 'W1') return true;
      return false;
    };

    const filteredCleaning = getCleaningTasks().filter(t => {
      const matchArea = filterArea === 'GENERAL' || t.area === filterArea;
      const matchCollab = selectedCollaborator === 'TODOS' || t.responsible === selectedCollaborator;
      return matchArea && matchCollab;
    });

    const weeklyTasks = filteredCleaning.filter(t => t.frecuencia === 'SEMANAL');
    const monthlyTasks = filteredCleaning.filter(t => t.frecuencia === 'MENSUAL');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Weekly Cleaning Card */}
        {weeklyTasks.length > 0 && (
          <div className="card animate-scale-in" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '15px' }}>
                🧹 Cronograma de Limpieza Semanal ({getWeekLabel(weekId)})
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                Tareas semanales de limpieza profunda programadas.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {['BARRA', 'COCINA', 'SALON'].map(areaKey => {
                const areaTasks = weeklyTasks.filter(t => t.area === areaKey);
                if (areaTasks.length === 0) return null;
                
                const areaColor = areaKey === 'BARRA' ? 'var(--primary)' : areaKey === 'COCINA' ? 'var(--secondary)' : '#d97706';
                
                return (
                  <div key={areaKey} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h4 style={{ margin: '0 0 5px 0', borderBottom: `2px solid ${areaColor}`, paddingBottom: '4px', color: areaColor, fontSize: '12px', fontWeight: 800 }}>
                      {areaKey}
                    </h4>
                    <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', paddingRight: '4px' }}>
                      {areaTasks.map(t => {
                        const done = isCompleted(t, weekId);
                        return (
                          <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', fontSize: '12px', borderBottom: '1px solid var(--bg-main)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                              <span style={{ color: 'var(--text-main)' }}>{t.descripcion}</span>
                              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>👤 Responsable: {t.responsible}</span>
                            </div>
                            <span style={{ fontWeight: 800, color: done ? 'var(--success)' : 'var(--error)' }}>
                              {done ? '✓ Realizado' : '✗ Pendiente'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Monthly Cleaning Card */}
        {monthlyTasks.length > 0 && (
          <div className="card animate-scale-in" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '15px' }}>
                📅 Control de Limpieza Mensual (Semana 5: 29 al 30 de Junio)
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                Las tareas mensuales se realizan únicamente en la última semana del mes y se cierran al finalizar el mes.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {['BARRA', 'COCINA', 'SALON'].map(areaKey => {
                const areaTasks = monthlyTasks.filter(t => t.area === areaKey);
                if (areaTasks.length === 0) return null;
                
                const areaColor = areaKey === 'BARRA' ? 'var(--primary)' : areaKey === 'COCINA' ? 'var(--secondary)' : '#d97706';
                
                return (
                  <div key={areaKey} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h4 style={{ margin: '0 0 5px 0', borderBottom: `2px solid ${areaColor}`, paddingBottom: '4px', color: areaColor, fontSize: '12px', fontWeight: 800 }}>
                      {areaKey}
                    </h4>
                    <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', paddingRight: '4px' }}>
                      {areaTasks.map(t => {
                        const done = isCompleted(t, 'W5');
                        const today = new Date();
                        const currentDay = today.getDate();
                        const isPastMonth = today.getMonth() > 5 || today.getFullYear() > 2026 || (today.getMonth() === 5 && currentDay > 30);
                        const isFutureW5 = currentDay < 29;

                        let statusColor = 'var(--error)';
                        let statusText = '✗ Pendiente';
                        if (done) {
                          statusColor = 'var(--success)';
                          statusText = '✓ Realizado';
                        } else if (isPastMonth) {
                          statusColor = 'var(--error)';
                          statusText = '🚨 Expirado ("Ya fue")';
                        } else if (isFutureW5) {
                          statusColor = 'var(--text-muted)';
                          statusText = '⏳ Inactivo (Semana 5)';
                        }

                        return (
                          <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', fontSize: '12px', borderBottom: '1px solid var(--bg-main)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                              <span style={{ color: 'var(--text-main)' }}>{t.descripcion}</span>
                              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>👤 Responsable: {t.responsible}</span>
                            </div>
                            <span style={{ fontWeight: 800, color: statusColor }}>
                              {statusText}
                            </span>
                          </div>
                        );
                      })}
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

  const renderMultistoreDashboard = () => {
    const storesList = monitoringStoreFilter === 'Todas'
      ? ['Barranco', 'Miraflores', 'San Isidro']
      : [monitoringStoreFilter];
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, color: 'var(--primary)' }}>Centro de Control Multitienda (Monitoreo Supervisor)</h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
              Consolidado en tiempo real del desempeño operativo, asistencia y auditorías de todas las sedes de Don Guto.
            </p>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: 'var(--success-light)', color: 'var(--success)', padding: '4px 10px', borderRadius: '12px', border: '1px solid var(--success)' }}>
            🟢 SISTEMA EN LÍNEA (ACTUALIZADO)
          </span>
        </div>

        {/* Store Filter Selector */}
        <div className="card glass" style={{ padding: '15px', display: 'flex', gap: '15px', alignItems: 'center', border: '1px solid var(--border)' }}>
          <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>🏢 Filtrar Monitoreo por Sede:</strong>
          <select
            value={monitoringStoreFilter}
            onChange={(e) => setMonitoringStoreFilter(e.target.value)}
            className="input"
            style={{ padding: '5px 10px', fontSize: '12.5px', height: '32px', minWidth: '180px', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer' }}
          >
            <option value="Todas">🏢 Todas las sedes (General)</option>
            <option value="Barranco">Sede Barranco</option>
            <option value="Miraflores">Sede Miraflores</option>
            <option value="San Isidro">Sede San Isidro</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {storesList.map(storeName => {
            const storeMembers = approvedMembers.filter(m => m.store === storeName);
            const storeLogs = auditLogs.filter(log => log.tienda === storeName);
            
            const avgAuditScore = storeLogs.length > 0
              ? storeLogs.reduce((acc, log) => acc + log.nota, 0) / storeLogs.length
              : null;
            
            let lastAuditDateStr = 'Nunca';
            let auditStatusLabel = '⚠️ Sin Auditoría';
            let auditStatusColor = 'var(--warning)';
            
            if (storeLogs.length > 0) {
              const sortedLogs = [...storeLogs].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
              const lastAuditDate = new Date(sortedLogs[0].fecha);
              lastAuditDateStr = lastAuditDate.toLocaleDateString();
              
              const today = new Date('2026-06-12T12:00:00Z');
              const diffDays = Math.ceil(Math.abs(today - lastAuditDate) / (1000 * 60 * 60 * 24));
              if (diffDays > 15) {
                auditStatusLabel = `🔴 Vencida por ${diffDays} días`;
                auditStatusColor = 'var(--error)';
              } else {
                auditStatusLabel = `🟢 Al día (Hace ${diffDays} días)`;
                auditStatusColor = 'var(--success)';
              }
            }

            let totalDelay = 0;
            let totalArrivals = 0;
            storeMembers.forEach(member => {
              const logs = member.arrivalLogs || [];
              logs.forEach(log => {
                totalDelay += log.delayMin || 0;
                totalArrivals += 1;
              });
            });
            const avgDelay = totalArrivals > 0 ? totalDelay / totalArrivals : 0;
            const punctualityRate = totalArrivals > 0 
              ? (storeMembers.reduce((acc, m) => {
                  const onTimeLogs = (m.arrivalLogs || []).filter(l => (l.delayMin || 0) <= 5).length;
                  return acc + onTimeLogs;
                }, 0) / totalArrivals) * 100
              : 100;

            let totalTasks = 0;
            let completedTasks = 0;
            storeMembers.forEach(m => {
              const tasks = checklists.filter(t => isTaskAssignedTo(t.id, m.name));
              totalTasks += tasks.length;
              completedTasks += tasks.filter(t => t.completado).length;
            });
            const checklistCompliance = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

            let storeStatus = 'Estable';
            let storeStatusBg = 'var(--success-light)';
            let storeStatusColor = 'var(--success)';
            let storeBorder = '1px solid var(--border)';
            if (avgDelay > 10 || (avgAuditScore && avgAuditScore < 85)) {
              storeStatus = 'Alerta Operativa';
              storeStatusBg = 'var(--error-light)';
              storeStatusColor = 'var(--error)';
              storeBorder = '1px solid var(--error)';
            } else if (avgDelay > 5 || checklistCompliance < 80) {
              storeStatus = 'Atención Requerida';
              storeStatusBg = 'var(--warning-light)';
              storeStatusColor = 'var(--warning)';
              storeBorder = '1px solid var(--warning)';
            }

            return (
              <div key={storeName} className="card animate-scale-in" style={{ border: storeBorder, padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                  <div>
                    <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Sede {storeName}</h3>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{storeMembers.length} Colaboradores Activos</span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 800, backgroundColor: storeStatusBg, color: storeStatusColor, padding: '3px 8px', borderRadius: '4px' }}>
                    {storeStatus}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Auditoría Promedio</span>
                    <strong style={{ fontSize: '20px', color: 'var(--primary)', display: 'block', margin: '4px 0' }}>
                      {avgAuditScore ? `${avgAuditScore.toFixed(1)}%` : 'Sin Datos'}
                    </strong>
                    <span style={{ fontSize: '10px', color: auditStatusColor, fontWeight: 700 }}>{auditStatusLabel}</span>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Retraso Promedio</span>
                    <strong style={{ fontSize: '20px', color: avgDelay > 10 ? 'var(--error)' : avgDelay > 5 ? 'var(--warning)' : 'var(--success)', display: 'block', margin: '4px 0' }}>
                      {avgDelay.toFixed(1)} min
                    </strong>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Puntualidad: {punctualityRate.toFixed(0)}%</span>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Checklist Hoy</span>
                    <strong style={{ fontSize: '20px', color: 'var(--text-main)', display: 'block', margin: '4px 0' }}>
                      {checklistCompliance.toFixed(0)}%
                    </strong>
                    <div style={{ width: '100%', backgroundColor: 'var(--border)', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${checklistCompliance}%`, backgroundColor: 'var(--primary)', height: '100%' }} />
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Última Auditoría</span>
                    <strong style={{ fontSize: '13px', color: 'var(--text-main)', display: 'block', margin: '8px 0 4px 0', fontWeight: 700 }}>
                      {lastAuditDateStr}
                    </strong>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Registros: {storeLogs.length} auditorías</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '5px' }}>
                    <span>Apertura de Barra:</span>
                    <strong style={{ color: 'var(--text-main)' }}>
                      {storeMembers.some(m => m.role === 'Barista') ? '🟢 Calibrada' : '⚪ Sin Barista'}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>IP Autorizada Conexión:</span>
                    <strong style={{ color: 'var(--text-main)', fontSize: '11px' }}>
                      {storeName === 'Barranco' ? '200.121.45.67' : storeName === 'Miraflores' ? '190.235.88.99' : '190.180.12.34'}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderManagerialDashboard = () => {
    const getManagerConsolidatedLogs = () => {
      const allLogs = [];
      approvedMembers.forEach(member => {
        const logs = member.arrivalLogs || [];
        logs.forEach(log => {
          allLogs.push({
            ...log,
            employeeName: member.name,
            employeeRole: member.role,
            employeeStore: member.store,
            biometricId: member.biometricId || member.biometric_id || log.biometricId
          });
        });
      });

      // Sort: newest date first, then by earliest arrival time of that day
      allLogs.sort((a, b) => {
        if (a.date !== b.date) {
          return b.date.localeCompare(a.date);
        }
        return a.time.localeCompare(b.time);
      });

      // Apply filters
      return allLogs.filter(log => {
        const matchesSearch = !managerSearchCollab.trim() || 
          log.employeeName.toLowerCase().includes(managerSearchCollab.toLowerCase());
        
        const matchesStore = managerStoreFilter === 'Todas' || 
          log.employeeStore === managerStoreFilter;
          
        const matchesRole = managerRoleFilter === 'Todos' || 
          log.employeeRole === managerRoleFilter;
          
        const matchesDate = !managerDateFilter || 
          log.date === managerDateFilter;
          
        let matchesStatus = true;
        if (managerStatusFilter === 'Puntual') {
          matchesStatus = (log.delayMin || 0) === 0;
        } else if (managerStatusFilter === 'Tardanza') {
          matchesStatus = (log.delayMin || 0) > 0;
        }
        
        return matchesSearch && matchesStore && matchesRole && matchesDate && matchesStatus;
      });
    };

    const statsByStore = getStorePunctualityStats();
    const tiendaTardona = statsByStore.length > 0 ? statsByStore[0].store : 'N/A';
    const tardonaMinutes = statsByStore.length > 0 ? statsByStore[0].avgDelay.toFixed(1) : '0';

    const topPerformers = approvedMembers
      .filter(m => ['Barista', 'Cocina', 'Servicio'].includes(m.role))
      .map(m => {
        const avgDelay = calculateAverageDelay(m.arrivalLogs || []);
        const logsCount = (m.arrivalLogs || []).length;
        return { name: m.name, role: m.role, store: m.store, avgDelay, logsCount };
      })
      .filter(m => m.logsCount >= 3)
      .sort((a, b) => a.avgDelay - b.avgDelay)
      .slice(0, 3);

    const observationTeam = approvedMembers
      .filter(m => ['Barista', 'Cocina', 'Servicio'].includes(m.role))
      .map(m => {
        const avgDelay = calculateAverageDelay(m.arrivalLogs || []);
        const logsCount = (m.arrivalLogs || []).length;
        const trainingDone = Object.values(m.trainingProgress || {}).filter(status => status === 'Completado').length;
        return { name: m.name, role: m.role, store: m.store, avgDelay, trainingDone, logsCount };
      })
      .filter(m => m.avgDelay > 5 || m.trainingDone < 4)
      .sort((a, b) => b.avgDelay - a.avgDelay);

    // Barista performance calculations for the manager dashboard
    const filteredBaristas = approvedMembers.filter(m => {
      if (m.role !== 'Barista') return false;
      return baristaStoreFilter === 'Todas' || m.store === baristaStoreFilter;
    });

    let avgGeneralTraining = 0;
    let avgGeneralPunctuality = 0;

    if (filteredBaristas.length > 0) {
      const sumTraining = filteredBaristas.reduce((acc, m) => {
        const completed = Object.values(m.trainingProgress || {}).filter(val => val === 'Completado').length;
        return acc + (completed / 5) * 100;
      }, 0);
      avgGeneralTraining = sumTraining / filteredBaristas.length;

      const sumPunctuality = filteredBaristas.reduce((acc, m) => {
        const arrivals = m.arrivalLogs || [];
        const onTime = arrivals.filter(l => (l.delayMin || 0) <= 5).length;
        const rate = arrivals.length > 0 ? (onTime / arrivals.length) * 100 : 100;
        return acc + rate;
      }, 0);
      avgGeneralPunctuality = sumPunctuality / filteredBaristas.length;
    }

    const proposals = [
      {
        id: 1,
        title: `Optimización Horaria en Sede ${tiendaTardona}`,
        description: `La sede de ${tiendaTardona} presenta el mayor índice de tardanzas con un promedio de ${tardonaMinutes} minutos de retraso por colaborador. Se propone implementar un bono mensual de puntualidad o ajustar el horario de entrada a las 06:45 AM con 15 minutos de tolerancia para la apertura.`,
        urgency: 'ALTA'
      },
      {
        id: 2,
        title: 'Mantenimiento del Extractor en Barranco',
        description: 'La auditoría operacional de Barranco reporta el criterio M4 (mantenimiento preventivo) como desmarcado debido a fallas en el extractor de cocina. Se recomienda programar la visita técnica del proveedor antes del 20 de junio para evitar riesgos de sanidad.',
        urgency: 'MEDIA'
      },
      {
        id: 3,
        title: 'Conciliación restaurante.pe & Stock Físico',
        description: 'El nuevo control de inventario de 10 productos en restaurante.pe requiere que los administradores realicen el cuadre semanal físico. Se propone unificar la plantilla de inventario de Excel actual con el sistema web para reducir la brecha de mermas.',
        urgency: 'MEDIA'
      }
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
        <div>
          <h2 style={{ margin: 0, color: 'var(--primary)' }}>Panel de Análisis Gerencial & Propuesta de Mejoras</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Herramientas ejecutivas exclusivas para el Gerente General. Monitorea el rendimiento del equipo e implementa planes de mejora.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', padding: '15px', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Colaborador Más Puntual</span>
            <strong style={{ fontSize: '18px', color: 'var(--success)', display: 'block', margin: '4px 0' }}>
              {topPerformers.length > 0 ? topPerformers[0].name : 'Cargando...'}
            </strong>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Retraso: {topPerformers.length > 0 ? topPerformers[0].avgDelay.toFixed(1) : 0} min (Sede: {topPerformers.length > 0 ? topPerformers[0].store : 'N/A'})
            </span>
          </div>

          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', padding: '15px', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Sede con Mayor Retraso</span>
            <strong style={{ fontSize: '18px', color: 'var(--error)', display: 'block', margin: '4px 0' }}>
              Sede {tiendaTardona}
            </strong>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Retraso Promedio: {tardonaMinutes} min</span>
          </div>

          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', padding: '15px', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Puntualidad General</span>
            <strong style={{ fontSize: '18px', color: 'var(--primary)', display: 'block', margin: '4px 0' }}>
              {(100 - (approvedMembers.reduce((acc, m) => acc + calculateAverageDelay(m.arrivalLogs || []), 0) / approvedMembers.length) * 5).toFixed(1)}%
            </strong>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>En base al historial de asistencia</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h3 style={{ margin: 0, color: 'var(--secondary)' }}>💡 Propuestas de Mejora Operativa</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {proposals.map(prop => (
                  <div key={prop.id} style={{ border: '1px solid var(--border)', padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-main)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>{prop.title}</strong>
                      <span style={{ 
                        fontSize: '9px', 
                        fontWeight: 800, 
                        backgroundColor: prop.urgency === 'ALTA' ? 'var(--error-light)' : 'var(--primary-light)',
                        color: prop.urgency === 'ALTA' ? 'var(--error)' : 'var(--primary)',
                        padding: '2px 6px',
                        borderRadius: '3px'
                      }}>
                        Prioridad: {prop.urgency}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{prop.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h3 style={{ margin: 0, color: 'var(--secondary)' }}>📢 Publicar Directiva de Gerencia General</h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                Las directivas publicadas se mostrarán de forma inmediata en el panel de monitoreo de los administradores y supervisores de tienda.
              </p>
              <form onSubmit={handleAddDirective} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <textarea
                  value={newDirectiveText}
                  onChange={(e) => setNewDirectiveText(e.target.value)}
                  placeholder="Ej: Asegurar que el cuadre de caja de cierre se reporte con foto del comprobante POS de Visa/Mastercard antes de las 10:15 pm..."
                  rows="3"
                  className="input"
                  style={{ padding: '8px 12px', fontFamily: 'inherit', resize: 'vertical' }}
                  required
                />
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end', padding: '6px 15px', fontSize: '12px' }}>
                  Publicar Directiva
                </button>
              </form>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Historial de Directivas Publicadas</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '150px', overflowY: 'auto' }}>
                  {directives.map(dir => (
                    <div key={dir.id} style={{ fontSize: '11px', padding: '6px', borderBottom: '1px solid var(--bg-main)' }}>
                      <strong>{dir.date}</strong>: {dir.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h3 style={{ margin: 0, color: 'var(--success)' }}>🏆 Colaboradores Más Destacados</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {topPerformers.map(collab => (
                  <div key={collab.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-main)' }}>
                    <div>
                      <strong style={{ fontSize: '12px', color: 'var(--text-main)', display: 'block' }}>{collab.name}</strong>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{collab.role} - Sede: {collab.store}</span>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--success)' }}>
                      Retraso: {collab.avgDelay.toFixed(1)}m
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h3 style={{ margin: 0, color: 'var(--warning)' }}>⚠️ Colaboradores en Observación / Plan de Apoyo</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto' }}>
                {observationTeam.map(collab => {
                  const hasDelayAlert = collab.avgDelay > 5;
                  const hasTrainingAlert = collab.trainingDone < 4;
                  
                  return (
                    <div key={collab.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-main)' }}>
                      <div>
                        <strong style={{ fontSize: '12px', color: 'var(--text-main)', display: 'block' }}>{collab.name}</strong>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{collab.role} - Sede: {collab.store}</span>
                      </div>
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {hasDelayAlert && (
                          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--error)' }}>
                            Retraso: {collab.avgDelay.toFixed(1)}m
                          </span>
                        )}
                        {hasTrainingAlert && (
                          <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--primary)' }}>
                            Falta Inducción
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BARISTAS PERFORMANCE AND TRAINING WIDGET */}
            <div className="card animate-scale-in" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <h3 style={{ margin: 0, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ☕ Progreso y Calificación de Baristas
                </h3>
                <select
                  value={baristaStoreFilter}
                  onChange={(e) => setBaristaStoreFilter(e.target.value)}
                  className="input"
                  style={{ padding: '4px 8px', fontSize: '11px', height: '28px', minWidth: '130px', cursor: 'pointer', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '4px' }}
                >
                  <option value="Todas">🏢 Todas las sedes</option>
                  <option value="Barranco">Sede Barranco</option>
                  <option value="Miraflores">Sede Miraflores</option>
                  <option value="San Isidro">Sede San Isidro</option>
                </select>
              </div>

              {/* General Store Averages Card */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: 'var(--bg-main)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>Capacitación Promedio</span>
                  <strong style={{ fontSize: '18px', color: 'var(--primary)', display: 'block', marginTop: '4px' }}>
                    {avgGeneralTraining.toFixed(1)}%
                  </strong>
                </div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>Puntualidad Promedio</span>
                  <strong style={{ fontSize: '18px', color: 'var(--success)', display: 'block', marginTop: '4px' }}>
                    {avgGeneralPunctuality.toFixed(1)}%
                  </strong>
                </div>
              </div>

              {/* Baristas list/table */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto' }}>
                {filteredBaristas.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No hay baristas registrados en esta sede.
                  </div>
                ) : (
                  filteredBaristas.map(m => {
                    const totalDays = 5;
                    const completedDays = Object.values(m.trainingProgress || {}).filter(status => status === 'Completado').length;
                    const trainingPercent = (completedDays / totalDays) * 100;

                    const arrivals = m.arrivalLogs || [];
                    const onTimeArrivals = arrivals.filter(l => (l.delayMin || 0) <= 5).length;
                    const punctualityPercent = arrivals.length > 0 ? (onTimeArrivals / arrivals.length) * 100 : 100;

                    const baristaAudits = auditLogs.filter(log => log.colaboradorAuditado === m.name);
                    const avgAuditScore = baristaAudits.length > 0
                      ? baristaAudits.reduce((acc, log) => acc + log.nota, 0) / baristaAudits.length
                      : null;

                    return (
                      <div key={m.username} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px', backgroundColor: 'var(--bg-card)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong style={{ fontSize: '12px', color: 'var(--text-main)' }}>{m.name}</strong>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '8px' }}>Sede: {m.store}</span>
                          </div>
                          {avgAuditScore !== null && (
                            <span style={{ fontSize: '10px', fontWeight: 800, backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px' }}>
                              Auditoría: {avgAuditScore.toFixed(0)}%
                            </span>
                          )}
                        </div>

                        {/* Progress Indicators */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                          {/* Training Progress Bar */}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', marginBottom: '3px' }}>
                              <span>Capacitación</span>
                              <strong>{trainingPercent.toFixed(0)}%</strong>
                            </div>
                            <div style={{ height: '5px', backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: '2.5px', overflow: 'hidden' }}>
                              <div style={{ width: `${trainingPercent}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '2.5px' }} />
                            </div>
                          </div>

                          {/* Punctuality Progress Bar */}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', marginBottom: '3px' }}>
                              <span>Puntualidad</span>
                              <strong>{punctualityPercent.toFixed(0)}%</strong>
                            </div>
                            <div style={{ height: '5px', backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: '2.5px', overflow: 'hidden' }}>
                              <div style={{ width: `${punctualityPercent}%`, height: '100%', backgroundColor: 'var(--success)', borderRadius: '2.5px' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* REGISTRO CONSOLIDADO DE ASISTENCIA BIOMÉTRICA CON FILTROS */}
        <div className="card animate-scale-in" style={{ padding: '24px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
            <div>
              <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
                📋 Registro Consolidado de Asistencia Biométrica
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                Historial completo de marcaciones registradas por huella dactilar (primer y último registro del día).
              </p>
            </div>
            <div style={{ fontSize: '11px', fontWeight: 800, backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '12px', border: '1px solid var(--primary)' }}>
              ⚡ {getManagerConsolidatedLogs().length} Registros Encontrados
            </div>
          </div>

          {/* FILTERS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '12px',
            backgroundColor: 'var(--bg-main)',
            padding: '15px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>👤 Buscar Colaborador:</label>
              <input
                type="text"
                placeholder="Nombre..."
                value={managerSearchCollab}
                onChange={(e) => {
                  setManagerSearchCollab(e.target.value);
                  setManagerCurrentPage(1);
                }}
                className="input"
                style={{ padding: '6px 10px', fontSize: '12px', height: '32px' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>🏢 Sede / Tienda:</label>
              <select
                value={managerStoreFilter}
                onChange={(e) => {
                  setManagerStoreFilter(e.target.value);
                  setManagerCurrentPage(1);
                }}
                className="input"
                style={{ padding: '4px 8px', fontSize: '12px', height: '32px', cursor: 'pointer' }}
              >
                <option value="Todas">🏢 Todas las sedes</option>
                <option value="Barranco">Sede Barranco</option>
                <option value="Miraflores">Sede Miraflores</option>
                <option value="San Isidro">Sede San Isidro</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>🤵 Cargo / Rol:</label>
              <select
                value={managerRoleFilter}
                onChange={(e) => {
                  setManagerRoleFilter(e.target.value);
                  setManagerCurrentPage(1);
                }}
                className="input"
                style={{ padding: '4px 8px', fontSize: '12px', height: '32px', cursor: 'pointer' }}
              >
                <option value="Todos">👥 Todos los roles</option>
                <option value="Barista">☕ Barista</option>
                <option value="Cocina">🍳 Cocina</option>
                <option value="Servicio">🤵 Servicio (Salón)</option>
                <option value="Administrador">👑 Administrador</option>
                <option value="Gerente">📊 Gerente</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>📅 Filtrar por Fecha:</label>
              <input
                type="date"
                value={managerDateFilter}
                onChange={(e) => {
                  setManagerDateFilter(e.target.value);
                  setManagerCurrentPage(1);
                }}
                className="input"
                style={{ padding: '4px 8px', fontSize: '12px', height: '32px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>⏰ Puntualidad:</label>
              <select
                value={managerStatusFilter}
                onChange={(e) => {
                  setManagerStatusFilter(e.target.value);
                  setManagerCurrentPage(1);
                }}
                className="input"
                style={{ padding: '4px 8px', fontSize: '12px', height: '32px', cursor: 'pointer' }}
              >
                <option value="Todos">⏰ Todos los estados</option>
                <option value="Puntual">🟢 Puntual</option>
                <option value="Tardanza">🔴 Con Retraso</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          {(() => {
            const filteredLogs = getManagerConsolidatedLogs();
            const totalRecords = filteredLogs.length;
            const totalPages = Math.ceil(totalRecords / managerRowsPerPage) || 1;
            const startIndex = (managerCurrentPage - 1) * managerRowsPerPage;
            const pageRecords = filteredLogs.slice(startIndex, startIndex + managerRowsPerPage);

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '6px' }}>
                  <table style={{ width: '100%', fontSize: '12.5px', borderCollapse: 'collapse', textAlign: 'left', minWidth: '950px' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '10px 12px', fontWeight: 700 }}>Colaborador</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700 }}>Sede</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700 }}>Rol</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700 }}>Fecha</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700 }}>Programado</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700 }}>Entrada</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700 }}>Salida</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700 }}>Tardanza</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700, textAlign: 'center' }}>Total</th>
                        {user.role === 'Técnico' && <th style={{ padding: '10px 12px', fontWeight: 700 }}>Marcaciones Registradas</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {pageRecords.length > 0 ? (
                        pageRecords.map((log, idx) => {
                          const delayVal = log.delayMin || 0;
                          return (
                            <tr key={idx} style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.2s ease' }}>
                              <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--text-main)' }}>{log.employeeName}</td>
                              <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{log.employeeStore}</td>
                              <td style={{ padding: '10px 12px' }}>
                                <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--bg-main)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                                  {log.employeeRole}
                                </span>
                              </td>
                              <td style={{ padding: '10px 12px', fontWeight: 600 }}>{log.date}</td>
                              <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{log.expectedTime}</td>
                              <td style={{ padding: '10px 12px', color: 'var(--success)', fontWeight: 600 }}>{log.time}</td>
                              <td style={{ padding: '10px 12px' }}>{log.checkOutTime || '--'}</td>
                              <td style={{ padding: '10px 12px' }}>
                                <span style={{
                                  fontWeight: 800,
                                  fontSize: '11px',
                                  color: delayVal > 15 ? 'var(--error)' : delayVal > 0 ? 'var(--warning)' : 'var(--success)'
                                }}>
                                  {delayVal > 0 
                                    ? (delayVal >= 60 
                                        ? `+${Math.floor(delayVal / 60)}h ${delayVal % 60}min` 
                                        : `+${delayVal} min`) 
                                    : 'Puntual'}
                                </span>
                              </td>
                              <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700 }}>{log.totalPunches || 1}</td>
                              {user.role === 'Técnico' && (
                                <td style={{ padding: '10px 12px', fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', fontFamily: 'monospace' }}>
                                  {log.allPunches || log.time}
                                </td>
                              )}
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={user.role === 'Técnico' ? 10 : 9} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            No se encontraron marcaciones que coincidan con los filtros seleccionados.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION */}
                {totalRecords > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingTop: '5px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Mostrando <strong>{startIndex + 1}</strong> - <strong>{Math.min(startIndex + managerRowsPerPage, totalRecords)}</strong> de <strong>{totalRecords}</strong> registros
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        onClick={() => setManagerCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={managerCurrentPage === 1}
                        className="btn"
                        style={{ padding: '4px 10px', fontSize: '11px', border: '1px solid var(--border)', cursor: 'pointer', borderRadius: '4px', backgroundColor: 'var(--bg-card)', color: managerCurrentPage === 1 ? 'var(--text-muted)' : 'var(--text-main)' }}
                      >
                        ◀ Ant.
                      </button>
                      
                      <span style={{ fontSize: '12px', color: 'var(--text-main)', fontWeight: 700 }}>
                        {managerCurrentPage} / {totalPages}
                      </span>
                      
                      <button
                        onClick={() => setManagerCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={managerCurrentPage === totalPages}
                        className="btn"
                        style={{ padding: '4px 10px', fontSize: '11px', border: '1px solid var(--border)', cursor: 'pointer', borderRadius: '4px', backgroundColor: 'var(--bg-card)', color: managerCurrentPage === totalPages ? 'var(--text-muted)' : 'var(--text-main)' }}
                      >
                        Sig. ▶
                      </button>

                      <select
                        value={managerRowsPerPage}
                        onChange={(e) => {
                          setManagerRowsPerPage(Number(e.target.value));
                          setManagerCurrentPage(1);
                        }}
                        className="input"
                        style={{ padding: '2px 4px', fontSize: '11px', height: '24px', width: '50px', cursor: 'pointer', marginLeft: '5px' }}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    );
  };

  const renderIncidentsDashboard = () => {
    const userStore = user.store;
    const isStoreAdmin = user.role === 'Administrador';

    // Store filter helper to calculate overall statistics
    const storeFiltered = (incidents || []).filter(inc => {
      if (isStoreAdmin) {
        return inc.store === userStore;
      } else {
        return incStoreFilter === 'Todas' || inc.store === incStoreFilter;
      }
    });

    const pendingCount = storeFiltered.filter(inc => inc.status === 'Pendiente').length;
    const processCount = storeFiltered.filter(inc => inc.status === 'En Proceso').length;
    const escalatedCount = storeFiltered.filter(inc => inc.status === 'Escalado').length;
    const resolvedCount = storeFiltered.filter(inc => inc.status === 'Resuelto').length;

    // Filter incidents list based on current tab and filters
    const filtered = storeFiltered.filter(inc => {
      // Tab filter
      if (incActiveTab === 'active') {
        if (inc.status === 'Resuelto') return false;
      } else {
        if (inc.status !== 'Resuelto') return false;
      }

      // Status filter (only applicable for active tab)
      if (incActiveTab === 'active' && incStatusFilter !== 'Todos' && inc.status !== incStatusFilter) return false;
      
      // Urgency filter
      if (incUrgencyFilter !== 'Todos' && inc.urgency !== incUrgencyFilter) return false;
      
      // Type filter
      if (incTypeFilter !== 'Todos' && inc.type !== incTypeFilter) return false;
      
      return true;
    });

    // Unique stores for filters (only for non-admins)
    const uniqueStores = Array.from(new Set([...(incidents || []).map(inc => inc.store), 'Barranco', 'Miraflores', 'San Isidro']));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2 style={{ margin: 0, color: 'var(--primary)' }}>Bandeja de Incidencias Operativas</h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
              {isStoreAdmin 
                ? `Gestión de fallos, insumos y operaciones para la sede ${userStore}.`
                : 'Monitoreo y resolución de reportes operativos de todas las sedes de Don Guto.'}
            </p>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '12px', border: '1px solid var(--primary)' }}>
            💼 Rol: {user.role === 'Auditor' ? 'Auditor de Operaciones' : user.role} {isStoreAdmin && `(${userStore})`}
          </span>
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

        {/* Incident Creation Form */}
        <div style={{ marginBottom: '10px' }}>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: 700,
              backgroundColor: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {showCreateForm ? '✖ Cancelar Registro' : '➕ Reportar / Crear Nueva Incidencia'}
          </button>

          {showCreateForm && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!createIncTitle.trim() || !createIncDesc.trim()) {
                  alert('Por favor, ingresa un título y una descripción.');
                  return;
                }

                const newInc = {
                  id: `INC-${Date.now().toString().slice(-4)}`,
                  date: new Date().toISOString(),
                  reporterEmail: user.email,
                  reporterName: user.name,
                  reporterRole: user.role,
                  store: user.store !== 'Todas' ? user.store : createIncStore,
                  type: createIncType,
                  title: createIncTitle.trim(),
                  description: createIncDesc.trim(),
                  urgency: createIncUrgency,
                  status: 'Pendiente',
                  adminResponse: '',
                  adminResponseAt: '',
                  supervisorResponse: '',
                  supervisorResponseAt: '',
                  resolvedBy: '',
                  resolvedAt: ''
                };

                if (onAddIncident) {
                  onAddIncident(newInc);
                  setCreateIncTitle('');
                  setCreateIncDesc('');
                  setShowCreateForm(false);
                  setIncSuccessMsg('¡Incidencia registrada con éxito en el sistema!');
                  setTimeout(() => setIncSuccessMsg(''), 5000);
                } else {
                  alert('Error: No se pudo registrar la incidencia.');
                }
              }}
              className="card animate-scale-in"
              style={{
                marginTop: '15px',
                padding: '20px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                📝 Formulario de Reporte de Incidencia
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                {user.store === 'Todas' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>1. Seleccionar Sede afectada:</label>
                    <select
                      value={createIncStore}
                      onChange={(e) => setCreateIncStore(e.target.value)}
                      className="input"
                      style={{ padding: '8px', fontSize: '12.5px', height: '38px', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '4px' }}
                    >
                      <option value="Barranco">Sede Barranco</option>
                      <option value="Miraflores">Sede Miraflores</option>
                      <option value="San Isidro">Sede San Isidro</option>
                    </select>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>1. Sede afectada:</label>
                    <div style={{ padding: '8px 12px', fontSize: '12.5px', backgroundColor: 'rgba(0,0,0,0.04)', border: '1px solid var(--border)', borderRadius: '4px', height: '38px', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                      📍 Sede {user.store}
                    </div>
                  </div>
                )}

                {/* Category Selection */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>2. Categoría:</label>
                  <select
                    value={createIncType}
                    onChange={(e) => setCreateIncType(e.target.value)}
                    className="input"
                    style={{ padding: '8px', fontSize: '12.5px', height: '38px', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '4px' }}
                  >
                    <option value="Mantenimiento">🛠️ Mantenimiento / Infraestructura</option>
                    <option value="Insumos">📦 Insumos / Desabastecimiento</option>
                    <option value="Operaciones">📋 Operaciones / Turnos</option>
                    <option value="Otros">❓ Otros</option>
                  </select>
                </div>

                {/* Urgency selection */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>3. Prioridad / Urgencia:</label>
                  <select
                    value={createIncUrgency}
                    onChange={(e) => setCreateIncUrgency(e.target.value)}
                    className="input"
                    style={{ padding: '8px', fontSize: '12.5px', height: '38px', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '4px' }}
                  >
                    <option value="Normal">⚠️ Normal (Resolución en 24-48h)</option>
                    <option value="Urgente">🚨 Urgente (Atención Inmediata)</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>4. Asunto / Título corto:</label>
                <input
                  type="text"
                  placeholder="Ej: Fuga de agua en barra, Falta leche fresca, Falla de molino principal..."
                  value={createIncTitle}
                  onChange={(e) => setCreateIncTitle(e.target.value)}
                  className="input"
                  style={{ padding: '8px 12px', fontSize: '12.5px', border: '1px solid var(--border)', borderRadius: '4px', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
                />
              </div>

              {/* Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>5. Detalles y Descripción:</label>
                <textarea
                  placeholder="Describe de forma clara el problema, ubicación, insumo faltante o equipo afectado..."
                  value={createIncDesc}
                  onChange={(e) => setCreateIncDesc(e.target.value)}
                  className="input"
                  rows="3"
                  style={{ padding: '10px', fontSize: '12.5px', border: '1px solid var(--border)', borderRadius: '4px', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', resize: 'vertical' }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '10px 20px', fontSize: '13px', fontWeight: 700, alignSelf: 'flex-start', cursor: 'pointer' }}
              >
                💾 Registrar Incidencia en Sistema
              </button>
            </form>
          )}
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
          <div className="card glass" style={{ padding: '15px', textAlign: 'center', border: '1px solid var(--warning)' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--warning)', textTransform: 'uppercase' }}>⏳ Pendientes</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--warning)', marginTop: '5px' }}>{pendingCount}</div>
          </div>
          <div className="card glass" style={{ padding: '15px', textAlign: 'center', border: '1px solid var(--primary)' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>⚙️ En Proceso</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)', marginTop: '5px' }}>{processCount}</div>
          </div>
          <div className="card glass" style={{ padding: '15px', textAlign: 'center', border: '1px solid #d97706' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#d97706', textTransform: 'uppercase' }}>🚨 Escalados</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#d97706', marginTop: '5px' }}>{escalatedCount}</div>
          </div>
          <div className="card glass" style={{ padding: '15px', textAlign: 'center', border: '1px solid var(--success)' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase' }}>✅ Casos Resueltos</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--success)', marginTop: '5px' }}>{resolvedCount}</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid var(--border)', gap: '10px', marginTop: '10px' }}>
          <button
            onClick={() => setIncActiveTab('active')}
            style={{
              padding: '10px 20px',
              fontSize: '13.5px',
              fontWeight: 'bold',
              background: 'none',
              border: 'none',
              borderBottom: incActiveTab === 'active' ? '3px solid var(--primary)' : '3px solid transparent',
              color: incActiveTab === 'active' ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            ⏳ Incidencias Activas ({pendingCount + processCount + escalatedCount})
          </button>
          <button
            onClick={() => setIncActiveTab('resolved')}
            style={{
              padding: '10px 20px',
              fontSize: '13.5px',
              fontWeight: 'bold',
              background: 'none',
              border: 'none',
              borderBottom: incActiveTab === 'resolved' ? '3px solid var(--success)' : '3px solid transparent',
              color: incActiveTab === 'resolved' ? 'var(--success)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            ✅ Casos Resueltos ({resolvedCount})
          </button>
        </div>

        {/* Filters Bar */}
        <div className="card glass" style={{ padding: '15px', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', border: '1px solid var(--border)' }}>
          <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>🔍 Filtros rápidos:</strong>
          
          {!isStoreAdmin ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '120px' }}>
              <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)' }}>Sede:</label>
              <select
                value={incStoreFilter}
                onChange={(e) => setIncStoreFilter(e.target.value)}
                className="input"
                style={{ padding: '5px 10px', fontSize: '12px', height: '32px', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer' }}
              >
                <option value="Todas">🏢 Todas las sedes</option>
                {uniqueStores.map(store => (
                  <option key={store} value={store}>{store}</option>
                ))}
              </select>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '120px' }}>
              <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)' }}>Sede:</label>
              <div style={{ padding: '5px 10px', fontSize: '12px', height: '32px', backgroundColor: 'rgba(0,0,0,0.05)', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '4px', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                📍 {userStore} (Fijo)
              </div>
            </div>
          )}

          {/* Status Filter (Only visible when active tab is selected) */}
          {incActiveTab === 'active' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '120px' }}>
              <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)' }}>Estado:</label>
              <select
                value={incStatusFilter}
                onChange={(e) => setIncStatusFilter(e.target.value)}
                className="input"
                style={{ padding: '5px 10px', fontSize: '12px', height: '32px', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer' }}
              >
                <option value="Todos">📄 Todos los estados</option>
                <option value="Pendiente">⏳ Pendiente</option>
                <option value="En Proceso">⚙️ En Proceso</option>
                <option value="Escalado">🚨 Escalado</option>
              </select>
            </div>
          )}

          {/* Category Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '120px' }}>
            <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)' }}>Categoría:</label>
            <select
              value={incTypeFilter}
              onChange={(e) => setIncTypeFilter(e.target.value)}
              className="input"
              style={{ padding: '5px 10px', fontSize: '12px', height: '32px', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer' }}
            >
              <option value="Todos">🛠️ Todas las categorías</option>
              <option value="Mantenimiento">🛠️ Mantenimiento</option>
              <option value="Insumos">📦 Insumos / Stock 86</option>
              <option value="Operaciones">📋 Operaciones</option>
              <option value="Otros">❓ Otros</option>
            </select>
          </div>

          {/* Urgency Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '120px' }}>
            <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)' }}>Urgencia:</label>
            <select
              value={incUrgencyFilter}
              onChange={(e) => setIncUrgencyFilter(e.target.value)}
              className="input"
              style={{ padding: '5px 10px', fontSize: '12px', height: '32px', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer' }}
            >
              <option value="Todos">⚠️ Todas las urgencias</option>
              <option value="Normal">⚠️ Normal</option>
              <option value="Urgente">🚨 Urgente</option>
            </select>
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setIncStoreFilter('Todas');
              setIncStatusFilter('Todos');
              setIncUrgencyFilter('Todos');
              setIncTypeFilter('Todos');
            }}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '11px', height: '32px', display: 'flex', alignItems: 'center', alignSelf: 'flex-end' }}
          >
            🧹 Limpiar Filtros
          </button>
        </div>

        {/* Incidents List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filtered.length === 0 ? (
            <div className="card text-center" style={{ padding: '40px', color: 'var(--text-muted)', border: '1px dashed var(--border)' }}>
              📭 No hay incidencias que coincidan con los filtros seleccionados.
            </div>
          ) : (
            filtered.map(inc => {
              let statusBg = 'var(--bg-main)';
              let statusColor = 'var(--text-muted)';
              let statusBorder = 'var(--border)';
              
              if (inc.status === 'Pendiente') {
                statusBg = 'var(--warning-light)';
                statusColor = 'var(--warning)';
                statusBorder = 'var(--warning)';
              } else if (inc.status === 'En Proceso') {
                statusBg = 'var(--primary-light)';
                statusColor = 'var(--primary)';
                statusBorder = 'var(--primary)';
              } else if (inc.status === 'Escalado') {
                statusBg = 'var(--warning-light)';
                statusColor = '#d97706';
                statusBorder = '#d97706';
              } else if (inc.status === 'Resuelto') {
                statusBg = 'var(--success-light)';
                statusColor = 'var(--success)';
                statusBorder = 'var(--success)';
              }

              const isHovered = hoveredIncId === inc.id;

              return (
                <a
                  key={inc.id}
                  href={`?view=incident-detail&id=${inc.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectIncident(inc.id);
                  }}
                  className="card animate-scale-in"
                  onMouseEnter={() => setHoveredIncId(inc.id)}
                  onMouseLeave={() => setHoveredIncId(null)}
                  style={{
                    padding: '15px 20px',
                    border: `1px solid ${isHovered ? 'var(--primary)' : statusBorder}`,
                    backgroundColor: isHovered ? 'var(--bg-main)' : 'var(--bg-card)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: isHovered ? 'translateY(-2px)' : 'none',
                    boxShadow: isHovered ? 'var(--shadow-md)' : 'none',
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '11px', letterSpacing: '0.5px' }}>
                        {inc.id} • {inc.type.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: 'rgba(0,0,0,0.04)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-main)' }}>
                        📍 Sede: {inc.store}
                      </span>
                    </div>
                    <h3 style={{ margin: '4px 0 0 0', fontSize: '14.5px', color: 'var(--text-main)', fontWeight: 800 }}>
                      {inc.title}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {inc.urgency === 'Urgente' && (
                      <span style={{ backgroundColor: 'var(--error-light)', color: 'var(--error)', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 800, border: '1px solid var(--error)' }}>
                        🚨 URGENTE
                      </span>
                    )}
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '12px',
                      backgroundColor: statusBg,
                      color: statusColor,
                      fontWeight: 800,
                      fontSize: '10px',
                      border: '1px solid currentColor',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {inc.status}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700, marginLeft: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Gestionar ➜
                    </span>
                  </div>
                </a>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const renderMyAttendanceTab = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const memberObj = approvedMembers.find(m => m.username === user.username);
    const logs = memberObj?.arrivalLogs || [];
    const clockedInToday = logs.some(l => l.date === todayStr);
    const todaysLog = logs.find(l => l.date === todayStr);


    const triggerMyBioScan = () => {
      if (myBioState !== 'idle') return;
      
      setMyBioState('scanning');
      setMyBioFeedback('Leyendo huella... Mantenga el dedo en el lector.');
      setMyBioProgress(0);

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setMyBioProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setMyBioState('verifying');
          setMyBioFeedback('Verificando firma digital...');

          setTimeout(() => {
            const device = biometricDevices.find(d => (user.store === 'Todas' || d.store === user.store) && d.status === 'Online') || biometricDevices[0];
            const res = onBiometricScan(user.username, device ? device.id : 'DEV-001');
            
            if (res && res.success) {
              setMyBioState('success');
              setMyBioFeedback('¡Acceso Autorizado! Asistencia registrada con éxito.');
              setTimeout(() => {
                setMyBioState('idle');
                setMyBioFeedback('Por favor, coloque su dedo en el lector biométrico.');
              }, 3000);
            } else {
              setMyBioState('error');
              setMyBioFeedback(res ? res.message : 'Error en la verificación.');
              setTimeout(() => {
                setMyBioState('idle');
                setMyBioFeedback('Por favor, coloque su dedo en el lector biométrico.');
              }, 3000);
            }
          }, 1000);
        }
      }, 150);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
        <div style={{ borderBottom: '2px solid var(--border)', paddingBottom: '10px' }}>
          <h3 style={{ margin: 0, color: 'var(--primary)' }}>Registro de Entrada Biométrica (Mi Rol: {user.role})</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Marca tu asistencia diaria utilizando el escáner biométrico conectado en tu sede ({user.store}).
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px', alignItems: 'start' }}>
          {/* Biometric Scan Card */}
          <div className="card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', border: '1px solid var(--border)' }}>
            <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-main)' }}>Escáner de Huella Digital Táctil</h4>
            
            {clockedInToday && (
              <div style={{
                padding: '12px 20px',
                borderRadius: '8px',
                backgroundColor: 'var(--success-light)',
                border: '1px solid var(--success)',
                color: 'var(--success)',
                textAlign: 'center',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <strong style={{ fontSize: '13px' }}>🟢 Asistencia Activa</strong>
                <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', marginTop: '4px', borderTop: '1px solid rgba(22, 163, 74, 0.2)', paddingTop: '4px' }}>
                  <span>Entrada: <strong>{todaysLog?.time}</strong></span>
                  <span>Salida: <strong>{todaysLog?.checkOutTime || '--'}</strong></span>
                  <span>Marcajes: <strong>{todaysLog?.totalPunches || 1}</strong></span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', width: '100%' }}>
              {/* Fingerprint scan circle */}
              <div 
                onClick={triggerMyBioScan}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  border: `4px solid ${
                    myBioState === 'success' ? 'var(--success)' : myBioState === 'error' ? 'var(--error)' : myBioState === 'scanning' ? 'var(--primary)' : 'var(--border)'
                  }`,
                  backgroundColor: myBioState === 'scanning' ? 'rgba(139,26,26,0.05)' : 'var(--bg-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: myBioState === 'idle' ? 'pointer' : 'not-allowed',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                }}
              >
                {myBioState === 'scanning' && (
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '3px',
                    backgroundColor: 'var(--primary)',
                    boxShadow: '0 0 8px var(--primary)',
                    top: `${myBioProgress}%`,
                    left: 0,
                    transition: 'top 0.15s linear',
                  }} />
                )}

                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke={
                  myBioState === 'success' ? 'var(--success)' : myBioState === 'error' ? 'var(--error)' : myBioState === 'scanning' ? 'var(--primary)' : 'var(--text-muted)'
                } strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 10a2 2 0 0 0-2 2M14 14a4 4 0 0 0-4-4M2 12a10 10 0 0 1 18 0M10 17v-1a2 2 0 1 1 4 0v1" />
                  <path d="M12 2a10 10 0 0 0-10 10M12 22a10 10 0 0 0 10-10" />
                  <path d="M6 12a6 6 0 0 1 12 0M8 12a4 4 0 0 1 8 0" />
                </svg>
              </div>

              <button
                onClick={triggerMyBioScan}
                disabled={myBioState !== 'idle'}
                className="btn"
                style={{
                  padding: '8px 20px',
                  fontSize: '12px',
                  fontWeight: 700,
                  backgroundColor: myBioState === 'idle' ? 'var(--primary)' : 'var(--bg-main)',
                  color: myBioState === 'idle' ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: myBioState === 'idle' ? 'pointer' : 'not-allowed'
                }}
              >
                {myBioState === 'idle' ? '☝️ Simular Colocar Dedo' : 'Procesando Marcación...'}
              </button>

              <div style={{ fontSize: '12px', color: myBioState === 'success' ? 'var(--success)' : myBioState === 'error' ? 'var(--error)' : 'var(--text-muted)', fontWeight: 600, textAlign: 'center', minHeight: '34px' }}>
                {myBioFeedback}
              </div>
            </div>
          </div>

          {/* History Card */}
          <div className="card" style={{ padding: '20px', border: '1px solid var(--border)' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-main)' }}>Mi Historial de Marcaciones Biométricas</h4>
            {logs.length === 0 ? (
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0 }}>Aún no has registrado marcaciones en el sistema.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '6px' }}>Fecha</th>
                      <th style={{ padding: '6px' }}>Hora de Entrada</th>
                      <th style={{ padding: '6px' }}>Hora de Salida</th>
                      <th style={{ padding: '6px' }}>Hora Esperada</th>
                      <th style={{ padding: '6px' }}>Tardanza</th>
                      <th style={{ padding: '6px', textAlign: 'center' }}>Total Marcajes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...logs].reverse().map((log, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '8px 6px', fontWeight: 600 }}>{log.date}</td>
                        <td style={{ padding: '8px 6px' }}>{log.time}</td>
                        <td style={{ padding: '8px 6px' }}>{log.checkOutTime || '--'}</td>
                        <td style={{ padding: '8px 6px', color: 'var(--text-muted)' }}>{log.expectedTime}</td>
                        <td style={{ padding: '8px 6px', fontWeight: 700, color: log.delayMin > 0 ? 'var(--error)' : 'var(--success)' }}>
                          {log.delayMin > 0 
                            ? (log.delayMin >= 60 
                                ? `+${Math.floor(log.delayMin / 60)}h ${log.delayMin % 60}min` 
                                : `+${log.delayMin} min`) 
                            : '0 min'}
                        </td>
                        <td style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 600 }}>
                          {log.totalPunches || 1}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTechnicalPanelTab = () => {

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
        <div style={{ borderBottom: '2px solid var(--border)', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2 style={{ margin: 0, color: 'var(--primary)' }}>🖥️ Consola de Dispositivos e Integración Biométrica</h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
              Área de administración de cuentas de usuario, hardware y conectividad de red de los terminales de huella dactilar.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setTechTabSub('users')}
              className="btn"
              style={{
                padding: '6px 12px',
                fontSize: '11px',
                backgroundColor: techTabSub === 'users' ? 'var(--primary)' : 'var(--bg-main)',
                color: techTabSub === 'users' ? '#fff' : 'var(--text-main)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              👥 Cuentas y Contraseñas
            </button>
            <button
              onClick={() => setTechTabSub('devices')}
              className="btn"
              style={{
                padding: '6px 12px',
                fontSize: '11px',
                backgroundColor: techTabSub === 'devices' ? 'var(--primary)' : 'var(--bg-main)',
                color: techTabSub === 'devices' ? '#fff' : 'var(--text-main)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ⚙️ Dispositivos y Sincronizador
            </button>
            <button
              onClick={() => setTechTabSub('docs')}
              className="btn"
              style={{
                padding: '6px 12px',
                fontSize: '11px',
                backgroundColor: techTabSub === 'docs' ? 'var(--primary)' : 'var(--bg-main)',
                color: techTabSub === 'docs' ? '#fff' : 'var(--text-main)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              📘 Manual de Integración Física
            </button>
            <button
              onClick={() => setTechTabSub('punches')}
              className="btn"
              style={{
                padding: '6px 12px',
                fontSize: '11px',
                backgroundColor: techTabSub === 'punches' ? 'var(--primary)' : 'var(--bg-main)',
                color: techTabSub === 'punches' ? '#fff' : 'var(--text-main)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              📋 Historial de Marcaciones
            </button>
          </div>
        </div>

        {/* SUBTAB 1: USER MANAGEMENT */}
        {techTabSub === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }} className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px', alignItems: 'start' }}>
              
              {/* Left Column: Create User Form */}
              <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-main)' }}>👤 Crear Nuevo Usuario de Acceso</h4>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!manageUserNames.trim() || !manageUserApellidos.trim() || !manageUserDni.trim() || !manageUserPassword.trim()) {
                    alert('Por favor, completa Nombres, Apellidos, DNI y Contraseña.');
                    return;
                  }
                  
                  const fullName = `${manageUserNames.trim()} ${manageUserApellidos.trim()}`;
                  const generatedUser = generateUsernameFromName(manageUserNames, manageUserApellidos);
                  
                  if (teamMembers.some(m => m.username === generatedUser)) {
                    alert(`El usuario generado "${generatedUser}" ya existe.`);
                    return;
                  }

                  onAddTeamMember({
                    name: fullName,
                    username: generatedUser,
                    password: manageUserPassword.trim(),
                    apellidos: manageUserApellidos.trim(),
                    dni: manageUserDni.trim(),
                    email: manageUserEmail.trim() || null,
                    telefono: manageUserTelefono.trim() || null,
                    role: manageUserRole,
                    store: manageUserStore,
                    biometricId: manageUserBiometricId.trim() || null,
                    pendingApproval: false,
                    addedBy: user.name,
                    addedByUsername: user.username,
                    dateAdded: new Date().toISOString()
                  });

                  alert(`Usuario ${generatedUser} creado con éxito.`);
                  
                  setManageUserNames('');
                  setManageUserApellidos('');
                  setManageUserDni('');
                  setManageUserEmail('');
                  setManageUserTelefono('');
                  setManageUserPassword('');
                  setManageUserBiometricId('');
                }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>Nombres:</label>
                      <input
                        type="text"
                        required
                        className="input"
                        placeholder="Ej: Mateo"
                        value={manageUserNames}
                        onChange={(e) => setManageUserNames(e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>Apellidos:</label>
                      <input
                        type="text"
                        required
                        className="input"
                        placeholder="Ej: Quispe López"
                        value={manageUserApellidos}
                        onChange={(e) => setManageUserApellidos(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>DNI:</label>
                      <input
                        type="text"
                        required
                        maxLength={8}
                        className="input"
                        placeholder="8 dígitos"
                        value={manageUserDni}
                        onChange={(e) => setManageUserDni(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>Teléfono:</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="Opcional"
                        value={manageUserTelefono}
                        onChange={(e) => setManageUserTelefono(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>Correo Electrónico:</label>
                    <input
                      type="email"
                      className="input"
                      placeholder="ejemplo@donguto.com"
                      value={manageUserEmail}
                      onChange={(e) => setManageUserEmail(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>Rol de Acceso:</label>
                      <select
                        className="input"
                        value={manageUserRole}
                        onChange={(e) => setManageUserRole(e.target.value)}
                        style={{ padding: '8px' }}
                      >
                        <option value="Barista">Barista</option>
                        <option value="Cocina">Cocina</option>
                        <option value="Servicio">Servicio</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Supervisor">Supervisor</option>
                        <option value="Gerente">Gerente General</option>
                        <option value="Técnico">Técnico de Sistemas</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>Sede Asignada:</label>
                      <select
                        className="input"
                        value={manageUserStore}
                        onChange={(e) => setManageUserStore(e.target.value)}
                        style={{ padding: '8px' }}
                      >
                        <option value="Barranco">Barranco</option>
                        <option value="Miraflores">Miraflores</option>
                        <option value="San Isidro">San Isidro</option>
                        <option value="Todas">Todas (Multitienda)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>Contraseña:</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        required
                        className="input"
                        placeholder="Contraseña"
                        value={manageUserPassword}
                        onChange={(e) => setManageUserPassword(e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const pass = generateSecurePassword();
                          setManageUserPassword(pass);
                        }}
                        className="btn btn-secondary"
                        style={{ padding: '8px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
                      >
                        ⚡ Generar
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '5px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (!manageUserDni.trim() || manageUserDni.trim().length < 8) {
                          alert('Por favor, ingresa un DNI válido de 8 dígitos antes de activar el lector biométrico.');
                          return;
                        }
                        setCurrentDniTarget(manageUserDni.trim());
                        setCurrentFormTarget('tech');
                        setBioStep(1);
                        setBioProgress(0);

                        const devicesWithSn = techDevices.filter(d => d.sn);
                        if (devicesWithSn.length > 0) {
                          setSelectedBioDeviceSn(devicesWithSn[0].sn);
                        } else {
                          setSelectedBioDeviceSn('');
                        }
                        setSelectedBioFingerId(6);
                        setEnrollError('');
                        setEnrollStatusText('');
                        setBioScanning(false);

                        setIsBioModalOpen(true);
                      }}
                      className="btn"
                      style={{
                        padding: '10px',
                        fontSize: '12px',
                        fontWeight: 700,
                        backgroundColor: manageUserBiometricId ? 'var(--success-light)' : 'rgba(239, 68, 68, 0.1)',
                        color: manageUserBiometricId ? 'var(--success)' : 'var(--error)',
                        border: manageUserBiometricId ? '1px solid var(--success)' : '1px solid var(--error)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      {manageUserBiometricId ? '🟢 Huella Enrolada (ID: ' + manageUserBiometricId + ')' : '🧬 Activar Lector Biométrico (3 Intentos)'}
                    </button>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', padding: '10px', fontWeight: 'bold' }}>
                    ➕ Registrar y Guardar en la Nube
                  </button>
                </form>
              </div>

              {/* Right Column: User list with CRUD options */}
              <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-main)' }}>👥 Listado General de Cuentas de Acceso</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '550px', overflowY: 'auto', paddingRight: '5px' }}>
                  {teamMembers.map(m => (
                    <div
                      key={m.username}
                      style={{
                        padding: '12px 15px',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        backgroundColor: 'var(--bg-main)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '12.5px',
                        gap: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-main)' }}>{m.name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          Usuario: <strong>{m.username}</strong> | Clave: <strong>{m.password || 'demo123'}</strong>
                        </span>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '3px' }}>
                          <span style={{ backgroundColor: 'var(--primary)', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                            {m.role.toUpperCase()}
                          </span>
                          <span style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)', fontSize: '9px', padding: '2px 6px', borderRadius: '4px' }}>
                            📍 Sede: {m.store}
                          </span>
                          {m.biometricId && (
                            <span style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)', border: '1px solid var(--success)', fontSize: '9px', fontWeight: 700, padding: '1px 5px', borderRadius: '4px' }}>
                              🧬 Huella ID: {m.biometricId}
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => {
                            const newPass = prompt(`Modificar contraseña de ${m.username}:`, m.password || 'demo123');
                            if (newPass !== null && newPass.trim() !== '') {
                              onUpdateCollaborator(m.username, { password: newPass.trim() });
                              alert('Contraseña modificada con éxito.');
                            }
                          }}
                          className="btn"
                          style={{
                            padding: '3px 8px',
                            fontSize: '10px',
                            cursor: 'pointer',
                            backgroundColor: 'var(--bg-card)',
                            color: 'var(--text-main)',
                            border: '1px solid var(--border)',
                            borderRadius: '4px'
                          }}
                        >
                          🔑 Cambiar Clave
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const newBio = prompt(`Modificar ID Biométrico para ${m.name}:`, m.biometricId || '');
                            if (newBio !== null) {
                              onUpdateCollaborator(m.username, { biometricId: newBio.trim() || null });
                              alert('ID Biométrico actualizado.');
                            }
                          }}
                          className="btn"
                          style={{
                            padding: '3px 8px',
                            fontSize: '10px',
                            cursor: 'pointer',
                            backgroundColor: 'var(--bg-card)',
                            color: 'var(--text-main)',
                            border: '1px solid var(--border)',
                            borderRadius: '4px'
                          }}
                        >
                          🧬 Asignar Huella
                        </button>

                        {m.username !== 'tecnicodg' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`¿Estás seguro de ELIMINAR permanentemente la cuenta de ${m.name} (${m.username})?`)) {
                                onRejectCollaborator(m.username);
                                alert('Usuario eliminado.');
                              }
                            }}
                            style={{
                              border: 'none',
                              background: 'none',
                              color: 'var(--error)',
                              fontSize: '11px',
                              cursor: 'pointer',
                              fontWeight: 700,
                              textDecoration: 'underline',
                              marginTop: '2px'
                            }}
                          >
                            Eliminar Cuenta
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SUBTAB 2: DEVICES */}
        {techTabSub === 'devices' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px', alignItems: 'start' }}>
              
              {/* Left Column: Biometric Devices CRUD */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* List of Registered Devices */}
                <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid var(--border)' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-main)' }}>📟 Lectoras Biométricas de Sede</h4>
                  
                  {techDevices.length === 0 ? (
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>No hay dispositivos registrados.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {techDevices.map(dev => (
                        <div
                          key={dev.id}
                          style={{
                            padding: '12px',
                            border: '1px solid var(--border)',
                            borderRadius: '6px',
                            backgroundColor: 'var(--bg-main)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '12.5px'
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <strong style={{ color: 'var(--text-main)' }}>{dev.name}</strong>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              IP: {dev.ip}:{dev.port} | Modelo: {dev.model}{dev.sn ? ` | SN: ${dev.sn}` : ''}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>
                              Sede Asignada: {dev.store}
                            </span>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                            <button
                              onClick={() => toggleDeviceStatus(dev.id)}
                              style={{
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: 800,
                                padding: '3px 8px',
                                color: '#fff',
                                backgroundColor: dev.status === 'Online' ? 'var(--success)' : 'var(--text-muted)',
                                cursor: 'pointer'
                              }}
                            >
                              {dev.status === 'Online' ? 'ONLINE 🟢' : 'OFFLINE 🔴'}
                            </button>
                            
                            <button
                              onClick={() => handleDeleteDevice(dev.id)}
                              style={{
                                border: 'none',
                                backgroundColor: 'transparent',
                                color: 'var(--error)',
                                fontSize: '10px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                textDecoration: 'underline'
                              }}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Device Form */}
                <form onSubmit={handleAddDevSubmit} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid var(--border)' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-main)' }}>➕ Vincular Nuevo Lector (ZKTeco)</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>Nombre del Lector:</label>
                    <input
                      type="text"
                      required
                      className="input"
                      placeholder="Ej: Lector Principal - Miraflores"
                      value={newDevName}
                      onChange={(e) => setNewDevName(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>Número de Serie (SN) para ADMS Cloud:</label>
                    <input
                      type="text"
                      required
                      className="input"
                      placeholder="Ej: jchpxowbxxfrivrloqkg o el SN físico de su equipo"
                      value={newDevSn}
                      onChange={(e) => setNewDevSn(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>Modelo:</label>
                      <select
                        className="input"
                        value={newDevModel}
                        onChange={(e) => setNewDevModel(e.target.value)}
                        style={{ padding: '8px' }}
                      >
                        <option value="ZKTeco M1">ZKTeco M1 (ADMS Cloud)</option>
                        <option value="ZKTeco K40">ZKTeco K40</option>
                        <option value="ZKTeco LX50">ZKTeco LX50</option>
                        <option value="ZKTeco MB20">ZKTeco MB20</option>
                        <option value="DigitalPersona USB">DigitalPersona USB</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>Sede:</label>
                      <select
                        className="input"
                        value={newDevStore}
                        onChange={(e) => setNewDevStore(e.target.value)}
                        style={{ padding: '8px' }}
                      >
                        <option value="Barranco">Barranco</option>
                        <option value="Miraflores">Miraflores</option>
                        <option value="San Isidro">San Isidro</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>Dirección IP Local:</label>
                      <input
                        type="text"
                        required
                        className="input"
                        placeholder="192.168.1.150"
                        value={newDevIp}
                        onChange={(e) => setNewDevIp(e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>Puerto:</label>
                      <input
                        type="number"
                        required
                        className="input"
                        value={newDevPort}
                        onChange={(e) => setNewDevPort(e.target.value)}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px', fontSize: '12px' }}>
                    🔌 Enlazar Lector a Intranet
                  </button>
                </form>

                {/* ZKBio Zlink File Import Card */}
                <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid var(--border)' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📥 Importar Asistencias de ZKBio Zlink
                  </h4>
                  <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    Sube el reporte consolidado en formato Excel (.xlsx, .xls) o CSV exportado desde Minerva IoT / ZKBio Zlink. El sistema sincronizará las marcaciones automáticamente.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>Asociar al Lector/Sede:</label>
                    <select
                      value={selectedBioDeviceSn}
                      onChange={(e) => setSelectedBioDeviceSn(e.target.value)}
                      className="input"
                      style={{ padding: '8px' }}
                    >
                      <option value="">-- Usar Lector por Defecto (ZKBio Zlink) --</option>
                      {techDevices.filter(d => d.sn).map(d => (
                        <option key={d.id} value={d.sn}>
                          {d.name} (SN: {d.sn} - {d.store})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{
                    border: '2px dashed var(--border)',
                    borderRadius: '6px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: 'var(--bg-main)',
                    position: 'relative',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => document.getElementById('zlink-file-input').click()}
                  >
                    <input
                      type="file"
                      id="zlink-file-input"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleZlinkFileImport}
                      style={{ display: 'none' }}
                    />
                    <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>📁</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-main)', fontWeight: 700 }}>
                      Haga clic para buscar el archivo
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                      Soporta .xlsx, .xls y .csv
                    </span>
                  </div>

                  {importingFile && (
                    <div style={{ fontSize: '12px', color: 'var(--primary)', textAlign: 'center', fontWeight: 'bold' }}>
                      ⏳ Procesando archivo, por favor espere...
                    </div>
                  )}

                  {importError && (
                    <div style={{
                      padding: '10px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid var(--error)',
                      color: 'var(--error)',
                      fontSize: '11.5px',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}>
                      🔴 {importError}
                    </div>
                  )}

                  {importSuccess && (
                    <div style={{
                      padding: '10px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid var(--success)',
                      color: 'var(--success)',
                      fontSize: '11.5px',
                      fontWeight: 'bold',
                      textAlign: 'left',
                      whiteSpace: 'pre-line'
                    }}>
                      {importSuccess}
                    </div>
                  )}

                  {parsedPunchesCount > 0 && (
                    <button
                      type="button"
                      onClick={handleConfirmImport}
                      disabled={importingFile}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '10px', fontSize: '12.5px', marginTop: '5px' }}
                    >
                      🚀 Confirmar e Importar {parsedPunchesCount} Marcas
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleClearImportedPunches}
                    disabled={importingFile}
                    className="btn"
                    style={{
                      width: '100%',
                      padding: '8px',
                      fontSize: '11.5px',
                      marginTop: '5px',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: 'var(--error)',
                      border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}
                  >
                    🗑️ Borrar Historial de Excel Importado (ZLINK-IMPORT)
                  </button>
                </div>

              </div>

              {/* Right Column: Simulator & Logs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Physical Scan Simulator Console */}
                <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid var(--primary)', backgroundColor: 'rgba(139, 26, 26, 0.01)' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    ⚡ Consola Simuladora de Transmisión de Hardware
                  </h4>
                  <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    Simula la reception de un pulso de asistencia física desde la lectora biométrica conectada. Sirve para certificar que el log entra a la base de datos y actualiza la intranet.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>Colaborador / Huella:</label>
                      <select
                        value={simCollabUsername}
                        onChange={(e) => setSimCollabUsername(e.target.value)}
                        className="input"
                        style={{ padding: '8px' }}
                      >
                        {approvedMembers.map(m => (
                          <option key={m.username} value={m.username}>
                            {m.name} ({m.role} - {m.store})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>Lector de Origen:</label>
                      <select
                        value={simDeviceId}
                        onChange={(e) => setSimDeviceId(e.target.value)}
                        className="input"
                        style={{ padding: '8px' }}
                      >
                        {techDevices.map(d => (
                          <option key={d.id} value={d.id} disabled={d.status === 'Offline'}>
                            {d.name} ({d.status})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSimulatePhysicalScan}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '10px', fontSize: '12.5px' }}
                  >
                    📡 Enviar Marcación (Simular ZK Hardware Push)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('¿Estás seguro de que deseas limpiar la memoria local de asistencia? Esto obligará al navegador a recargar y sincronizar datos limpios desde Supabase.')) {
                        localStorage.removeItem('donguto-team');
                        localStorage.removeItem('donguto-biometric-logs');
                        window.location.reload();
                      }
                    }}
                    className="btn"
                    style={{ width: '100%', padding: '8px', fontSize: '11.5px', marginTop: '10px', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                  >
                    🧹 Limpiar Caché de Asistencia Local
                  </button>

                  {simResult && (
                    <div style={{
                      padding: '10px',
                      borderRadius: '4px',
                      backgroundColor: simResult.success ? 'var(--success-light)' : 'var(--error-light)',
                      border: `1px solid ${simResult.success ? 'var(--success)' : 'var(--error)'}`,
                      color: simResult.success ? 'var(--success)' : 'var(--error)',
                      fontSize: '11.5px',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}>
                      {simResult.message}
                    </div>
                  )}
                </div>

                {/* Real-time event log */}
                <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid var(--border)' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-main)' }}>📜 Transmisiones Recientes del Servidor de Huellas</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '310px', overflowY: 'auto', paddingRight: '5px' }}>
                    {biometricLogs.length === 0 ? (
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>No hay transmisiones registradas en esta sesión.</p>
                    ) : (
                      biometricLogs.map((log) => (
                        <div
                          key={log.id}
                          style={{
                            padding: '10px',
                            border: '1px solid var(--border)',
                            borderRadius: '4px',
                            backgroundColor: 'var(--bg-main)',
                            fontSize: '11.5px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                            <span style={{ color: 'var(--primary)' }}>{log.id} • {log.name}</span>
                            <span style={{ color: 'var(--success)' }}>{log.status.toUpperCase()}</span>
                          </div>
                          <div style={{ color: 'var(--text-main)' }}>
                            Marcó entrada en <strong>{log.deviceName}</strong> (Sede: {log.store}).
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Usuario: {log.username}</span>
                            <span>{new Date(log.date).toLocaleString('es-PE')}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {techTabSub === 'docs' && (
          /* Technical Manual / Docs Tab */
          <div className="card animate-scale-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: 0, color: 'var(--secondary)', fontSize: '16px' }}>📘 Guía de Cableado e Integración de Hardware</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '13px', lineHeight: 1.5, textAlign: 'left' }}>
              <p style={{ margin: 0 }}>
                Para integrar un reloj control biométrico físico **ZKTeco K40 (o similar)** y lograr que las huellas registradas se transmitan en tiempo real a la intranet sin pagar licencias costosas, sigue estos pasos técnicos:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '3px solid var(--primary)', paddingLeft: '12px', backgroundColor: 'var(--bg-main)', padding: '12px', borderRadius: '0 4px 4px 0' }}>
                <strong style={{ color: 'var(--text-main)', fontSize: '14px' }}>⚙️ Paso 1: Configurar la Base de Datos (SQL en Supabase)</strong>
                <span>Crea la tabla en tu base de datos utilizando el editor SQL de Supabase para alojar los logs del lector:</span>
                <pre style={{
                  margin: '8px 0 0 0',
                  padding: '10px',
                  backgroundColor: '#2c2523',
                  color: '#fff',
                  borderRadius: '4px',
                  overflowX: 'auto',
                  fontSize: '11.5px',
                  fontFamily: 'monospace'
                }}>
{`CREATE TABLE public.asistencia_biometrica (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email VARCHAR(100) NOT NULL,
  device_id VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  verification_mode INTEGER, -- 1: Huella, 2: Clave, 3: Tarjeta
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);`}
                </pre>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '3px solid var(--secondary)', paddingLeft: '12px', backgroundColor: 'var(--bg-main)', padding: '12px', borderRadius: '0 4px 4px 0' }}>
                <strong style={{ color: 'var(--text-main)', fontSize: '14px' }}>📡 Paso 2: Configurar la red del Lector ZKTeco</strong>
                <ol style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>Conecta el ZKTeco K40 al router de la sede por Wi-Fi o Cable Ethernet.</li>
                  <li>Asígnale una **IP Estática** (ej. \`192.168.1.150\`).</li>
                  <li>Registra a los colaboradores en el dispositivo biométrico asignándoles un ID de usuario que coincida con su código o correo.</li>
                </ol>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '3px solid #d97706', paddingLeft: '12px', backgroundColor: 'var(--bg-main)', padding: '12px', borderRadius: '0 4px 4px 0' }}>
                <strong style={{ color: 'var(--text-main)', fontSize: '14px' }}>🚀 Paso 3: Lanzar el Script de Sincronización (Node.js)</strong>
                <span>En la computadora de caja/POS de cada sede (o en un servidor local centralizado), instala las dependencias y ejecuta el siguiente daemon que escucha al lector biométrico y escribe directo a Supabase:</span>
                <pre style={{
                  margin: '8px 0 0 0',
                  padding: '10px',
                  backgroundColor: '#2c2523',
                  color: '#fff',
                  borderRadius: '4px',
                  overflowX: 'auto',
                  fontSize: '11.5px',
                  fontFamily: 'monospace'
                }}>
{`const ZKLib = require('zkteco-js'); // npm i zkteco-js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://tu-proyecto.supabase.co', 'tu-anon-key');

async function main() {
  const ip = '192.168.1.150'; // IP del lector en Sede
  const device = new ZKLib(ip, 4370, 10000, 4000);

  try {
    await device.createSocket();
    console.log('Conectado a ZKTeco K40 con éxito.');

    // Escuchar marcaciones físicas
    device.getAttendance(async (err, log) => {
      if (err) return console.error(err);
      
      // Obtener el usuario del empleado asociado al ID del lector
      const username = mapUserIdToUsername(log.deviceUserId); 
      
      console.log(\`Marcación recibida para: \${username}\`);
      
      // Escribir en base de datos. Esto disparará la actualización en Vercel
      await supabase.from('asistencia_biometrica').insert([{
        user_username: username,
        device_id: 'DEV-001',
        verification_mode: log.verified
      }]);
    });
  } catch (err) {
    console.error('Error de conexión:', err);
  }
}
main();`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {techTabSub === 'punches' && (
          /* Consolidated table for technician (always shows raw punches column) */
          <div className="card animate-scale-in" style={{ padding: '24px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
              <div>
                <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
                  📋 Registro Consolidado de Asistencia Biométrica (Consola Técnica)
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                  Historial completo de marcaciones dactilares incluyendo logs de perforación detallados para auditorías de hardware.
                </p>
              </div>
              <div style={{ fontSize: '11px', fontWeight: 800, backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '12px', border: '1px solid var(--primary)' }}>
                ⚡ {getManagerConsolidatedLogs().length} Registros Encontrados
              </div>
            </div>

            {/* FILTERS */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '12px',
              backgroundColor: 'var(--bg-main)',
              padding: '15px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>👤 Buscar Colaborador:</label>
                <input
                  type="text"
                  placeholder="Nombre..."
                  value={managerSearchCollab}
                  onChange={(e) => {
                    setManagerSearchCollab(e.target.value);
                    setManagerCurrentPage(1);
                  }}
                  className="input"
                  style={{ padding: '6px 10px', fontSize: '12px', height: '32px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>🏢 Sede / Tienda:</label>
                <select
                  value={managerStoreFilter}
                  onChange={(e) => {
                    setManagerStoreFilter(e.target.value);
                    setManagerCurrentPage(1);
                  }}
                  className="input"
                  style={{ padding: '4px 8px', fontSize: '12px', height: '32px', cursor: 'pointer' }}
                >
                  <option value="Todas">🏢 Todas las sedes</option>
                  <option value="Barranco">Sede Barranco</option>
                  <option value="Miraflores">Sede Miraflores</option>
                  <option value="San Isidro">Sede San Isidro</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>🤵 Cargo / Rol:</label>
                <select
                  value={managerRoleFilter}
                  onChange={(e) => {
                    setManagerRoleFilter(e.target.value);
                    setManagerCurrentPage(1);
                  }}
                  className="input"
                  style={{ padding: '4px 8px', fontSize: '12px', height: '32px', cursor: 'pointer' }}
                >
                  <option value="Todos">👥 Todos los roles</option>
                  <option value="Barista">☕ Barista</option>
                  <option value="Cocina">🍳 Cocina</option>
                  <option value="Servicio">🤵 Servicio (Salón)</option>
                  <option value="Administrador">👑 Administrador</option>
                  <option value="Gerente">📊 Gerente</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>📅 Filtrar por Fecha:</label>
                <input
                  type="date"
                  value={managerDateFilter}
                  onChange={(e) => {
                    setManagerDateFilter(e.target.value);
                    setManagerCurrentPage(1);
                  }}
                  className="input"
                  style={{ padding: '4px 8px', fontSize: '12px', height: '32px', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>⏰ Puntualidad:</label>
                <select
                  value={managerStatusFilter}
                  onChange={(e) => {
                    setManagerStatusFilter(e.target.value);
                    setManagerCurrentPage(1);
                  }}
                  className="input"
                  style={{ padding: '4px 8px', fontSize: '12px', height: '32px', cursor: 'pointer' }}
                >
                  <option value="Todos">⏰ Todos los estados</option>
                  <option value="Puntual">🟢 Puntual</option>
                  <option value="Tardanza">🔴 Con Retraso</option>
                </select>
              </div>
            </div>

            {/* TABLE */}
            {(() => {
              const filteredLogs = getManagerConsolidatedLogs();
              const totalRecords = filteredLogs.length;
              const totalPages = Math.ceil(totalRecords / managerRowsPerPage) || 1;
              const startIndex = (managerCurrentPage - 1) * managerRowsPerPage;
              const pageRecords = filteredLogs.slice(startIndex, startIndex + managerRowsPerPage);

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '6px' }}>
                    <table style={{ width: '100%', fontSize: '12.5px', borderCollapse: 'collapse', textAlign: 'left', minWidth: '950px' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                          <th style={{ padding: '10px 12px', fontWeight: 700 }}>Colaborador</th>
                          <th style={{ padding: '10px 12px', fontWeight: 700 }}>Sede</th>
                          <th style={{ padding: '10px 12px', fontWeight: 700 }}>Rol</th>
                          <th style={{ padding: '10px 12px', fontWeight: 700 }}>Fecha</th>
                          <th style={{ padding: '10px 12px', fontWeight: 700 }}>Programado</th>
                          <th style={{ padding: '10px 12px', fontWeight: 700 }}>Entrada</th>
                          <th style={{ padding: '10px 12px', fontWeight: 700 }}>Salida</th>
                          <th style={{ padding: '10px 12px', fontWeight: 700 }}>Tardanza</th>
                          <th style={{ padding: '10px 12px', fontWeight: 700, textAlign: 'center' }}>Total</th>
                          <th style={{ padding: '10px 12px', fontWeight: 700 }}>Marcaciones Registradas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageRecords.length > 0 ? (
                          pageRecords.map((log, idx) => {
                            const delayVal = log.delayMin || 0;
                            return (
                              <tr key={idx} style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.2s ease' }}>
                                <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--text-main)' }}>{log.employeeName}</td>
                                <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{log.employeeStore}</td>
                                <td style={{ padding: '10px 12px' }}>
                                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--bg-main)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                                    {log.employeeRole}
                                  </span>
                                </td>
                                <td style={{ padding: '10px 12px', fontWeight: 600 }}>{log.date}</td>
                                <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{log.expectedTime}</td>
                                <td style={{ padding: '10px 12px', color: 'var(--success)', fontWeight: 600 }}>{log.time}</td>
                                <td style={{ padding: '10px 12px' }}>{log.checkOutTime || '--'}</td>
                                <td style={{ padding: '10px 12px' }}>
                                  <span style={{
                                    fontWeight: 800,
                                    fontSize: '11px',
                                    color: delayVal > 15 ? 'var(--error)' : delayVal > 0 ? 'var(--warning)' : 'var(--success)'
                                  }}>
                                    {delayVal > 0 
                                      ? (delayVal >= 60 
                                          ? `+${Math.floor(delayVal / 60)}h ${delayVal % 60}min` 
                                          : `+${delayVal} min`) 
                                      : 'Puntual'}
                                  </span>
                                </td>
                                <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700 }}>{log.totalPunches || 1}</td>
                                <td style={{ padding: '10px 12px', fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', fontFamily: 'monospace' }}>
                                  {log.allPunches || log.time}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="10" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                              No se encontraron marcaciones que coincidan con los filtros seleccionados.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* PAGINATION */}
                  {totalRecords > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingTop: '5px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Mostrando <strong>{startIndex + 1}</strong> - <strong>{Math.min(startIndex + managerRowsPerPage, totalRecords)}</strong> de <strong>{totalRecords}</strong> registros
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          onClick={() => setManagerCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={managerCurrentPage === 1}
                          className="btn"
                          style={{ padding: '4px 10px', fontSize: '11px', border: '1px solid var(--border)', cursor: 'pointer', borderRadius: '4px', backgroundColor: 'var(--bg-card)', color: managerCurrentPage === 1 ? 'var(--text-muted)' : 'var(--text-main)' }}
                        >
                          ◀ Ant.
                        </button>
                        
                        <span style={{ fontSize: '12px', color: 'var(--text-main)', fontWeight: 700 }}>
                          {managerCurrentPage} / {totalPages}
                        </span>
                        
                        <button
                          onClick={() => setManagerCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={managerCurrentPage === totalPages}
                          className="btn"
                          style={{ padding: '4px 10px', fontSize: '11px', border: '1px solid var(--border)', cursor: 'pointer', borderRadius: '4px', backgroundColor: 'var(--bg-card)', color: managerCurrentPage === totalPages ? 'var(--text-muted)' : 'var(--text-main)' }}
                        >
                          Sig. ▶
                        </button>

                        <select
                          value={managerRowsPerPage}
                          onChange={(e) => {
                            setManagerRowsPerPage(Number(e.target.value));
                            setManagerCurrentPage(1);
                          }}
                          className="input"
                          style={{ padding: '2px 4px', fontSize: '11px', height: '24px', width: '50px', cursor: 'pointer', marginLeft: '5px' }}
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Subtab menu */}
      <div className="card glass dashboard-tabs" style={{ padding: '0 12px', display: 'flex', gap: '5px' }}>
        <button
          onClick={() => setActiveTab('monitoring')}
          style={{
            padding: '14px 20px',
            border: 'none',
            borderBottom: activeTab === 'monitoring' ? '3px solid var(--primary)' : '3px solid transparent',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 700,
            color: activeTab === 'monitoring' ? 'var(--primary)' : 'var(--text-muted)',
            transition: 'all 0.2s ease',
          }}
        >
          Panel de Monitoreo
        </button>
        <button
          onClick={() => setActiveTab('audits')}
          style={{
            padding: '14px 20px',
            border: 'none',
            borderBottom: activeTab === 'audits' ? '3px solid var(--primary)' : '3px solid transparent',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 700,
            color: activeTab === 'audits' ? 'var(--primary)' : 'var(--text-muted)',
            transition: 'all 0.2s ease',
          }}
        >
          Ficha de Auditoría
        </button>
        <button
          onClick={() => setActiveTab('team')}
          style={{
            padding: '14px 20px',
            border: 'none',
            borderBottom: activeTab === 'team' ? '3px solid var(--primary)' : '3px solid transparent',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 700,
            color: activeTab === 'team' ? 'var(--primary)' : 'var(--text-muted)',
            transition: 'all 0.2s ease',
          }}
        >
          Equipo y Capacitación
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          style={{
            padding: '14px 20px',
            border: 'none',
            borderBottom: activeTab === 'logs' ? '3px solid var(--primary)' : '3px solid transparent',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 700,
            color: activeTab === 'logs' ? 'var(--primary)' : 'var(--text-muted)',
            transition: 'all 0.2s ease',
          }}
        >
          Historial de Auditorías
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
          ⚠️ Bandeja de Incidencias
        </button>
        {['Administrador', 'Supervisor', 'Gerente', 'Auditor'].includes(user.role) && (
          <button
            onClick={() => setActiveTab('my_attendance')}
            style={{
              padding: '14px 20px',
              border: 'none',
              borderBottom: activeTab === 'my_attendance' ? '3px solid var(--primary)' : '3px solid transparent',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 700,
              color: activeTab === 'my_attendance' ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
            }}
          >
            ☝️ Mi Asistencia (Huella)
          </button>
        )}
        {['Técnico', 'Supervisor', 'Gerente'].includes(user.role) && (
          <button
            onClick={() => setActiveTab('technical_panel')}
            style={{
              padding: '14px 20px',
              border: 'none',
              borderBottom: activeTab === 'technical_panel' ? '3px solid var(--primary)' : '3px solid transparent',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 700,
              color: activeTab === 'technical_panel' ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
            }}
          >
            🛠️ Panel Técnico
          </button>
        )}
        {['Supervisor', 'Gerente', 'Auditor'].includes(user.role) && (
          <button
            onClick={() => setActiveTab('multistore')}
            style={{
              padding: '14px 20px',
              border: 'none',
              borderBottom: activeTab === 'multistore' ? '3px solid var(--primary)' : '3px solid transparent',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 700,
              color: activeTab === 'multistore' ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
            }}
          >
            🏢 Dashboard Multitienda
          </button>
        )}
        {user.role === 'Gerente' && (
          <button
            onClick={() => setActiveTab('managerial_kpis')}
            style={{
              padding: '14px 20px',
              border: 'none',
              borderBottom: activeTab === 'managerial_kpis' ? '3px solid var(--primary)' : '3px solid transparent',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 700,
              color: activeTab === 'managerial_kpis' ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
            }}
          >
            📊 Panel de Gerencia & KPIs
          </button>
        )}
      </div>

      {/* View Content */}
      <div className="animate-fade-in">
        {activeTab === 'monitoring' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Filter and View mode toolbar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '15px',
              padding: '15px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              marginBottom: '5px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                {user.store === 'Todas' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>🏢 Sede:</span>
                    <select
                      value={checklistStoreFilter}
                      onChange={(e) => setChecklistStoreFilter(e.target.value)}
                      className="input"
                      style={{
                        padding: '5px 10px',
                        fontSize: '12.5px',
                        height: '34px',
                        backgroundColor: 'var(--bg-main)',
                        color: 'var(--text-main)',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        minWidth: '140px'
                      }}
                    >
                      <option value="Todas">🏢 Todas las sedes</option>
                      <option value="Barranco">Sede Barranco</option>
                      <option value="Miraflores">Sede Miraflores</option>
                      <option value="San Isidro">Sede San Isidro</option>
                    </select>
                  </div>
                )}

                {/* Department Filter Selector */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { key: 'GENERAL', label: 'General' },
                    { key: 'BARRA', label: 'Baristas (Barra)' },
                    { key: 'COCINA', label: 'Cocina' },
                    { key: 'SALON', label: 'Servicio (Salón)' }
                  ].map(area => (
                    <button
                      key={area.key}
                      onClick={() => setFilterArea(area.key)}
                      className="btn"
                      style={{
                        padding: '8px 16px',
                        fontSize: '13px',
                        borderRadius: '20px',
                        backgroundColor: filterArea === area.key ? 'var(--primary)' : 'var(--bg-main)',
                        color: filterArea === area.key ? '#fff' : 'var(--text-main)',
                        border: filterArea === area.key ? '1px solid var(--primary)' : '1px solid var(--border)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {area.key === 'GENERAL' ? '🌐' : area.key === 'BARRA' ? '☕' : area.key === 'COCINA' ? '🍳' : area.key === 'SALON' ? '🍽️' : ''} {area.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Mode Toggle */}
              <div style={{ display: 'flex', gap: '5px', backgroundColor: 'var(--bg-main)', padding: '4px', borderRadius: '25px', border: '1px solid var(--border)' }}>
                {[
                  { key: 'DIARIO', label: '📅 Vista Diaria' },
                  { key: 'CALENDARIO', label: '🗓️ Calendario' }
                ].map(mode => (
                  <button
                    key={mode.key}
                    onClick={() => setViewMode(mode.key)}
                    style={{
                      padding: '6px 16px',
                      fontSize: '13px',
                      fontWeight: 700,
                      borderRadius: '20px',
                      border: 'none',
                      backgroundColor: viewMode === mode.key ? 'var(--bg-card)' : 'transparent',
                      color: viewMode === mode.key ? 'var(--primary)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      boxShadow: viewMode === mode.key ? 'var(--shadow-sm)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Collaborator Filter Selector */}
            {filterArea !== 'GENERAL' && (
              <div className="animate-scale-in" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 15px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                alignSelf: 'flex-start',
                width: '100%',
                maxWidth: '450px'
              }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>👤 Filtrar por Colaborador:</span>
                <select
                  value={selectedCollaborator}
                  onChange={(e) => setSelectedCollaborator(e.target.value)}
                  className="input"
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    height: '32px',
                    borderRadius: '4px',
                    flex: 1,
                    backgroundColor: 'var(--bg-main)',
                    color: 'var(--text-main)',
                    border: '1px solid var(--border)',
                    cursor: 'pointer'
                  }}
                >
                  {filterArea === 'BARRA' && (
                    <>
                      <option value="TODOS">👥 Todos los Baristas</option>
                      {visibleMembers
                        .filter(m => m.role === 'Barista')
                        .map(m => (
                          <option key={m.username} value={m.name}>☕ {m.name}</option>
                        ))}
                    </>
                  )}
                  {filterArea === 'COCINA' && (
                    <>
                      <option value="TODOS">👥 Todos los Cocineros</option>
                      {visibleMembers
                        .filter(m => m.role === 'Cocina')
                        .map(m => (
                          <option key={m.username} value={m.name}>🍳 {m.name}</option>
                        ))}
                    </>
                  )}
                  {filterArea === 'SALON' && (
                    <>
                      <option value="TODOS">👥 Todos los de Servicio</option>
                      {visibleMembers
                        .filter(m => m.role === 'Servicio')
                        .map(m => (
                          <option key={m.username} value={m.name}>🤵 {m.name}</option>
                        ))}
                    </>
                  )}
                </select>
              </div>
            )}

            {viewMode === 'DIARIO' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {user.role === 'Administrador' && (
                  <div className="card glass animate-scale-in" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '15px', border: '1px solid var(--primary)', padding: '16px', backgroundColor: 'rgba(139, 26, 26, 0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '24px' }}>⏰</span>
                      <div>
                        <h4 style={{ margin: 0, color: 'var(--text-main)', fontSize: '14px', fontWeight: 800 }}>Control de Auto-evaluación Quincenal (Obligatorio)</h4>
                        <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                          Los administradores de tienda deben auto-auditarse cada 15 días de forma obligatoria. Última auditoría: <strong>{auditStatus.daysPast === 999 ? 'Ninguna' : `${auditStatus.lastDateStr} (hace ${auditStatus.daysPast} días)`}</strong>.
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: '4px',
                        backgroundColor: auditStatus.status === 'AL_DIA' ? 'var(--success-light)' : 'var(--error-light)',
                        color: auditStatus.status === 'AL_DIA' ? 'var(--success)' : 'var(--error)',
                        border: '1px solid currentColor',
                        textTransform: 'uppercase'
                      }}>
                        {auditStatus.label}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        📅 Auditoría oficial del Gerente General: <strong>30 de Junio</strong> (Quedan 18 días).
                      </span>
                    </div>
                  </div>
                )}

                {/* Live Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                  {[
                    { name: 'Barra (Baristas)', val: selectedDateStats.barra, color: 'var(--primary)' },
                    { name: 'Cocina', val: selectedDateStats.cocina, color: 'var(--secondary)' },
                    { name: 'Servicio (Salón)', val: selectedDateStats.salon, color: '#d97706' },
                    { name: 'Limpieza del Mes', val: selectedDateStats.limpieza, color: 'var(--success)' },
                  ].map(item => (
                    <div key={item.name} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>{item.name}</span>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '24px', fontWeight: 800, color: item.color }}>{item.val.toFixed(0)}%</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                          {selectedDateStr === '2026-06-12' ? 'Cumplimiento hoy' : 'Cumplimiento histórico'}
                        </span>
                      </div>
                      <div style={{ height: '6px', backgroundColor: 'var(--bg-main)', borderRadius: '3px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                        <div style={{ width: `${item.val}%`, height: '100%', backgroundColor: item.color, transition: 'width 0.4s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tienda Mas Tardona Widget */}
                {(() => {
                  const storeStats = getStorePunctualityStats();
                  const isGlobalView = user.store === 'Todas';
                  
                  if (!isGlobalView) {
                    const myStoreStat = storeStats.find(s => s.store === user.store) || { store: user.store, avgDelay: 0, totalLogs: 0 };
                    
                    // Calculate member delay ranking for this store
                    const storeMembers = approvedMembers.filter(m => m.store === user.store && ['Barista', 'Cocina', 'Servicio'].includes(m.role));
                    const memberStats = storeMembers.map(m => {
                      const logs = m.arrivalLogs || [];
                      const avg = calculateAverageDelay(logs);
                      return {
                        name: m.name,
                        avgDelay: avg,
                        totalLogs: logs.length
                      };
                    }).sort((a, b) => b.avgDelay - a.avgDelay);
                    
                    let ratingText = 'Excelente';
                    let ratingColor = 'var(--success)';
                    let ratingBg = 'var(--success-light)';
                    if (myStoreStat.avgDelay >= 15) {
                      ratingText = 'Crítico / Alerta';
                      ratingColor = 'var(--error)';
                      ratingBg = 'var(--error-light)';
                    } else if (myStoreStat.avgDelay >= 5) {
                      ratingText = 'Aceptable';
                      ratingColor = 'var(--warning)';
                      ratingBg = 'var(--warning-light)';
                    }
                    
                    return (
                      <div className="card glass animate-scale-in" style={{ padding: '20px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '5px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                          <div>
                            <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              ⏰ Indicadores de Puntualidad: Sede {user.store}
                            </h3>
                            <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                              Retraso promedio y rendimiento del personal en tu sede.
                            </p>
                          </div>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            backgroundColor: ratingBg,
                            color: ratingColor,
                            border: `1px solid ${ratingColor}`
                          }}>
                            Estatus: {ratingText}
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                          <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '5px', backgroundColor: 'var(--bg-main)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
                            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Retraso Promedio Sede</span>
                            <span style={{ fontSize: '32px', fontWeight: 800, color: ratingColor }}>{myStoreStat.avgDelay.toFixed(1)} min</span>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Basado en {myStoreStat.totalLogs} marcaciones</span>
                          </div>
                          
                          <div style={{ flex: '2 1 300px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>📊 Ranking de Retraso de Colaboradores (Mayor a Menor)</span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', paddingRight: '5px' }}>
                              {memberStats.length === 0 ? (
                                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>No hay datos de colaboradores en esta sede.</p>
                              ) : (
                                memberStats.map(m => {
                                  const maxVal = Math.max(...memberStats.map(x => x.avgDelay), 1);
                                  const percentage = (m.avgDelay / maxVal) * 100;
                                  return (
                                    <div key={m.name} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                                        <span style={{ fontWeight: 600 }}>{m.name}</span>
                                        <span style={{ fontWeight: 700, color: m.avgDelay > 5 ? 'var(--error)' : 'var(--text-muted)' }}>
                                          {m.avgDelay.toFixed(1)} min ({m.totalLogs} marcaciones)
                                        </span>
                                      </div>
                                      <div style={{ height: '6px', backgroundColor: 'var(--bg-main)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{
                                          width: `${percentage}%`,
                                          height: '100%',
                                          backgroundColor: m.avgDelay > 10 ? 'var(--error)' : m.avgDelay > 5 ? 'var(--warning)' : 'var(--success)',
                                          borderRadius: '3px'
                                        }} />
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  // Global multi-store comparison view (Gerente, Auditor, Supervisor)
                  const tardiestStore = storeStats[0];
                  return (
                    <div className="card glass animate-scale-in" style={{ padding: '20px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '5px' }}>
                      <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🚨 Comparativa de Puntualidad y Tienda Más Tardona
                      </h3>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                        Comparativa del retraso promedio en minutos acumulado por sede (basado en registros reales de asistencia).
                      </p>
                      
                      {tardiestStore && (
                        <div style={{ padding: '12px 15px', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid var(--error)', color: 'var(--error)', fontSize: '12.5px', fontWeight: 700 }}>
                          ⚠️ <strong>Sede con Mayor Retraso:</strong> {tardiestStore.store.toUpperCase()} — Retraso Promedio de <strong>{tardiestStore.avgDelay.toFixed(1)} minutos</strong>.
                        </div>
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '5px' }}>
                        {storeStats.map(item => {
                          const maxVal = Math.max(...storeStats.map(s => s.avgDelay), 1);
                          const percentage = (item.avgDelay / maxVal) * 100;
                          const isTardiest = item.store === tardiestStore?.store;
                          
                          return (
                            <div key={item.store} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                                <strong style={{ color: isTardiest ? 'var(--error)' : 'var(--text-main)' }}>
                                  Sede {item.store} {isTardiest && '🚨 (Personal llega más tarde)'}
                                </strong>
                                <span style={{ fontWeight: 800, color: isTardiest ? 'var(--error)' : 'var(--success)' }}>
                                  Retraso Promedio: {item.avgDelay.toFixed(1)} min ({item.totalLogs} marcaciones)
                                </span>
                              </div>
                              <div style={{ height: '12px', backgroundColor: 'var(--bg-main)', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                <div style={{
                                  width: `${percentage}%`,
                                  height: '100%',
                                  backgroundColor: isTardiest ? 'var(--error)' : 'var(--success)',
                                  borderRadius: '6px',
                                  transition: 'width 0.8s ease'
                                }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Date Navigation & Control block */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 20px',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  flexWrap: 'wrap',
                  gap: '15px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={() => handleNavigateDate('prev')}
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)' }}
                      disabled={selectedDateStr === '2026-06-01'}
                    >
                      ← Anterior
                    </button>
                    
                    <input
                      type="date"
                      min="2026-06-01"
                      max={new Date().toISOString().split('T')[0]}
                      value={selectedDateStr}
                      onChange={(e) => {
                        const val = e.target.value;
                        const todayStr = new Date().toISOString().split('T')[0];
                        if (val >= '2026-06-01' && val <= todayStr) {
                          setSelectedDateStr(val);
                        }
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--bg-card)',
                        color: 'var(--text-main)',
                        fontFamily: 'inherit',
                        fontWeight: 700,
                        fontSize: '13px',
                        textAlign: 'center',
                        width: '150px'
                      }}
                    />

                    <button
                      onClick={() => handleNavigateDate('next')}
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)' }}
                      disabled={selectedDateStr === new Date().toISOString().split('T')[0]}
                    >
                      Siguiente →
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 800,
                      padding: '6px 12px',
                      borderRadius: '4px',
                      backgroundColor: selectedDateStr === new Date().toISOString().split('T')[0] ? 'var(--success-light)' : 'var(--primary-light)',
                      color: selectedDateStr === new Date().toISOString().split('T')[0] ? 'var(--success)' : 'var(--primary)',
                      border: '1px solid currentColor'
                    }}>
                      {selectedDateStr === new Date().toISOString().split('T')[0] ? '🟢 EN VIVO (HOY)' : '⏳ HISTÓRICO'}
                    </span>
                  </div>
                </div>

                {/* Daily checklists feed list */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h3 style={{ margin: 0, color: 'var(--text-main)' }}>
                        Checklists del Día - Sede: {user.store === 'Todas' ? (
                          <select
                            value={checklistStoreFilter}
                            onChange={(e) => setChecklistStoreFilter(e.target.value)}
                            className="input"
                            style={{ 
                              padding: '2px 8px', 
                              fontSize: '13px', 
                              height: '28px', 
                              marginLeft: '8px', 
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              color: 'var(--primary)',
                              backgroundColor: 'var(--bg-card)',
                              border: '1px solid var(--border)',
                              borderRadius: '4px'
                            }}
                          >
                            <option value="Todas">Todas las sedes</option>
                            <option value="Barranco">Barranco</option>
                            <option value="Miraflores">Miraflores</option>
                            <option value="San Isidro">San Isidro</option>
                          </select>
                        ) : (
                          <span style={{ color: 'var(--primary)' }}>{user.store}</span>
                        )}
                      </h3>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                        Fecha consultada: <strong style={{ color: 'var(--primary)' }}>
                          {new Date(selectedDateStr + 'T12:00:00').toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </strong>
                        {selectedCollaborator !== 'TODOS' && <span> | Colaborador: <strong style={{ color: 'var(--primary)' }}>{selectedCollaborator}</strong></span>}.
                        {loadingChecklists && <span style={{ marginLeft: '10px', fontStyle: 'italic', color: 'var(--text-muted)' }}>⌛ Cargando...</span>}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                    {/* Barra Column */}
                    {(filterArea === 'GENERAL' || filterArea === 'BARRA') && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <h4 style={{ margin: '0 0 5px 0', borderBottom: '2px solid var(--primary)', paddingBottom: '4px', color: 'var(--primary)' }}>BARRA</h4>
                        <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', paddingRight: '4px' }}>
                          {getTasksForSelectedDate()
                            .filter(t => t.area === 'BARRA')
                            .filter(t => isTaskAssignedTo(t.id, filterArea === 'BARRA' ? selectedCollaborator : 'TODOS'))
                            .map(t => (
                              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', fontSize: '12px', borderBottom: '1px solid var(--bg-main)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                  <span style={{ color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '240px' }} title={t.descripcion}>{t.descripcion}</span>
                                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>👤 Responsable: {getTaskResponsible(t.id)}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  {t.evidencia && (
                                    <button
                                      onClick={() => setPreviewPhoto({ task: t.descripcion, img: t.evidencia, area: t.area })}
                                      style={{
                                        padding: '2px 6px',
                                        backgroundColor: 'var(--primary-light)',
                                        color: 'var(--primary)',
                                        border: '1px solid var(--primary)',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '9px',
                                        fontWeight: 'bold'
                                      }}
                                    >
                                      📸 Foto
                                    </button>
                                  )}
                                  <span style={{ fontWeight: 800, color: t.completado ? 'var(--success)' : 'var(--error)' }}>
                                    {t.completado ? '✓ Completado' : '✗ Falta'}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Cocina Column */}
                    {(filterArea === 'GENERAL' || filterArea === 'COCINA') && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <h4 style={{ margin: '0 0 5px 0', borderBottom: '2px solid var(--secondary)', paddingBottom: '4px', color: 'var(--secondary)' }}>COCINA</h4>
                        <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', paddingRight: '4px' }}>
                          {getTasksForSelectedDate()
                            .filter(t => t.area === 'COCINA')
                            .filter(t => isTaskAssignedTo(t.id, filterArea === 'COCINA' ? selectedCollaborator : 'TODOS'))
                            .map(t => (
                              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', fontSize: '12px', borderBottom: '1px solid var(--bg-main)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                  <span style={{ color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '240px' }} title={t.descripcion}>{t.descripcion}</span>
                                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>👤 Responsable: {getTaskResponsible(t.id)}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  {t.evidencia && (
                                    <button
                                      onClick={() => setPreviewPhoto({ task: t.descripcion, img: t.evidencia, area: t.area })}
                                      style={{
                                        padding: '2px 6px',
                                        backgroundColor: 'var(--primary-light)',
                                        color: 'var(--primary)',
                                        border: '1px solid var(--primary)',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '9px',
                                        fontWeight: 'bold'
                                      }}
                                    >
                                      📸 Foto
                                    </button>
                                  )}
                                  <span style={{ fontWeight: 800, color: t.completado ? 'var(--success)' : 'var(--error)' }}>
                                    {t.completado ? '✓ Completado' : '✗ Falta'}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Salón Column */}
                    {(filterArea === 'GENERAL' || filterArea === 'SALON') && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <h4 style={{ margin: '0 0 5px 0', borderBottom: '2px solid #d97706', paddingBottom: '4px', color: '#d97706' }}>SALÓN</h4>
                        <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', paddingRight: '4px' }}>
                          {getTasksForSelectedDate()
                            .filter(t => t.area === 'SALON')
                            .filter(t => isTaskAssignedTo(t.id, filterArea === 'SALON' ? selectedCollaborator : 'TODOS'))
                            .map(t => (
                              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', fontSize: '12px', borderBottom: '1px solid var(--bg-main)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                  <span style={{ color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '240px' }} title={t.descripcion}>{t.descripcion}</span>
                                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>👤 Responsable: {getTaskResponsible(t.id)}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  {t.evidencia && (
                                    <button
                                      onClick={() => setPreviewPhoto({ task: t.descripcion, img: t.evidencia, area: t.area })}
                                      style={{
                                        padding: '2px 6px',
                                        backgroundColor: 'var(--primary-light)',
                                        color: 'var(--primary)',
                                        border: '1px solid var(--primary)',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '9px',
                                        fontWeight: 'bold'
                                      }}
                                    >
                                      📸 Foto
                                    </button>
                                  )}
                                  <span style={{ fontWeight: 800, color: t.completado ? 'var(--success)' : 'var(--error)' }}>
                                    {t.completado ? '✓ Completado' : '✗ Falta'}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {renderWeeklyCleaningChecklist()}
              </div>
            ) : (
              renderCalendarioView()
            )}
          </div>
        )}

        {activeTab === 'audits' && <OperationAudit user={user} teamMembers={approvedMembers} onSaveAudit={onSaveAudit} />}

        {activeTab === 'team' && (
          <div className="mobile-stack" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start' }}>
            {/* Pending Approvals Section for Supervisor / Gerente */}
            {['Supervisor', 'Gerente', 'Auditor'].includes(user.role) && (teamMembers || []).filter(m => m.pendingApproval).length > 0 && (
              <div className="card glass animate-scale-in" style={{ flex: '1 1 100%', border: '1px solid var(--warning)', display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: 'var(--bg-card)' }}>
                <div style={{ borderBottom: '1px solid var(--warning-light)', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ margin: 0, color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      🔔 Aprobaciones de Colaboradores Pendientes
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                      Los siguientes colaboradores fueron registrados por administradores y requieren validación.
                    </p>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 800, backgroundColor: 'var(--warning-light)', color: 'var(--warning)', padding: '3px 10px', borderRadius: '12px', border: '1px solid var(--warning)' }}>
                    {(teamMembers || []).filter(m => m.pendingApproval).length} Pendiente(s)
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(teamMembers || []).filter(m => m.pendingApproval).map(member => (
                    <div
                      key={member.username}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 18px',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        backgroundColor: 'var(--bg-main)',
                        flexWrap: 'wrap',
                        gap: '15px'
                      }}
                    >
                      <div>
                        <strong style={{ display: 'block', fontSize: '14px', color: 'var(--text-main)' }}>{member.name}</strong>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                          👤 Usuario: {member.username} | 🛠️ {member.role} | 📍 Sede: {member.store}
                        </span>
                        <span style={{ display: 'block', fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
                          ✍️ Solicitado por: <strong>{member.addedBy || 'Administrador'}</strong>
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            if (confirm(`¿Aprobar la incorporación de ${member.name} al equipo?`)) {
                              onApproveCollaborator(member.username);
                            }
                          }}
                          className="btn"
                          style={{
                            padding: '8px 14px',
                            fontSize: '12px',
                            backgroundColor: 'var(--success)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'all 0.2s'
                          }}
                        >
                          ✓ Aprobar
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Rechazar el registro de ${member.name}? Se borrará del sistema.`)) {
                              onRejectCollaborator(member.username);
                            }
                          }}
                          className="btn"
                          style={{
                            padding: '8px 14px',
                            fontSize: '12px',
                            backgroundColor: 'var(--error-light)',
                            color: 'var(--error)',
                            border: '1px solid var(--error)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'all 0.2s'
                          }}
                        >
                          ✗ Rechazar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Approvals Section for Administrador */}
            {user.role === 'Administrador' && (teamMembers || []).filter(m => m.pendingApproval && m.store === user.store).length > 0 && (
              <div className="card glass animate-scale-in" style={{ flex: '1 1 100%', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: 'var(--bg-card)' }}>
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                  <h3 style={{ margin: 0, color: 'var(--text-muted)' }}>
                    ⏳ Solicitudes de Registro Pendientes
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                    Colaboradores que registraste que están esperando la aprobación de Pedro Supervisor.
                  </p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(teamMembers || []).filter(m => m.pendingApproval && m.store === user.store).map(member => (
                    <div
                      key={member.username}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 15px',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        backgroundColor: 'var(--bg-main)',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}
                    >
                      <div>
                        <strong style={{ display: 'block', fontSize: '13.5px', color: 'var(--text-main)' }}>{member.name}</strong>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          👤 Usuario: {member.username} | 🛠️ {member.role}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        color: '#d97706',
                        backgroundColor: '#fffbeb',
                        padding: '5px 12px',
                        borderRadius: '12px',
                        border: '1px solid #fcd34d',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        ⏳ Esperando Aprobación
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Team Members List */}
            <div className="card" style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Colaboradores en Tienda</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>Selecciona un colaborador para ver su Educación y Capacitación.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {visibleMembers.map(member => (
                  <button
                    key={member.username}
                    onClick={() => setSelectedUser(member)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: selectedUser?.username === member.username ? '1px solid var(--primary)' : '1px solid var(--border)',
                      backgroundColor: selectedUser?.username === member.username ? 'var(--primary-light)' : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div>
                      <strong style={{ display: 'block', fontSize: '13px', color: 'var(--text-main)' }}>{member.name}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>👤 {member.username}</span>
                    </div>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      backgroundColor: 'var(--bg-main)',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      border: '1px solid var(--border)'
                    }}>
                      {member.role}
                    </span>
                  </button>
                ))}
              </div>

              {/* Add New Member Form */}
              {['Gerente', 'Supervisor', 'Técnico', 'Auditor'].includes(user.role) && (
                <form onSubmit={handleAddMember} style={{ borderTop: '1px solid var(--border)', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h4 style={{ margin: 0, color: 'var(--text-main)' }}>Agregar Colaborador</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Nombres:</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Mateo"
                        value={newMemberNames}
                        onChange={(e) => setNewMemberNames(e.target.value)}
                        className="input"
                        style={{ padding: '8px 12px' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Apellidos:</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Quispe López"
                        value={newMemberApellidos}
                        onChange={(e) => setNewMemberApellidos(e.target.value)}
                        className="input"
                        style={{ padding: '8px 12px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>DNI (Será su ID Biométrico):</label>
                      <input
                        type="text"
                        required
                        maxLength={8}
                        placeholder="8 dígitos"
                        value={newMemberDni}
                        onChange={(e) => setNewMemberDni(e.target.value.replace(/\D/g, ''))}
                        className="input"
                        style={{ padding: '8px 12px' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Teléfono:</label>
                      <input
                        type="text"
                        placeholder="Opcional"
                        value={newMemberTelefono}
                        onChange={(e) => setNewMemberTelefono(e.target.value.replace(/\D/g, ''))}
                        className="input"
                        style={{ padding: '8px 12px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Correo Electrónico:</label>
                    <input
                      type="email"
                      placeholder="ejemplo@donguto.com"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      className="input"
                      style={{ padding: '8px 12px' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Área / Rol:</label>
                      <select
                        value={newMemberRole}
                        onChange={(e) => setNewMemberRole(e.target.value)}
                        className="input"
                        style={{ padding: '8px 12px' }}
                      >
                        <option value="Barista">Barista</option>
                        <option value="Cocina">Cocina</option>
                        <option value="Servicio">Servicio</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Supervisor">Supervisor</option>
                        <option value="Gerente">Gerente General</option>
                        <option value="Técnico">Técnico de Sistemas</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sede:</label>
                      <select
                        value={newMemberStore}
                        onChange={(e) => setNewMemberStore(e.target.value)}
                        className="input"
                        style={{ padding: '8px 12px' }}
                      >
                        <option value="Barranco">Barranco</option>
                        <option value="Miraflores">Miraflores</option>
                        <option value="San Isidro">San Isidro</option>
                        <option value="Todas">Todas</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Contraseña:</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        required
                        placeholder="Contraseña"
                        value={newMemberPassword}
                        onChange={(e) => setNewMemberPassword(e.target.value)}
                        className="input"
                        style={{ padding: '8px 12px', flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const pass = generateSecurePassword();
                          setNewMemberPassword(pass);
                        }}
                        className="btn btn-secondary"
                        style={{ padding: '8px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
                      >
                        ⚡ Generar
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '5px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newMemberDni.trim() || newMemberDni.trim().length < 8) {
                          alert('Por favor, ingresa un DNI válido de 8 dígitos antes de activar el lector biométrico.');
                          return;
                        }
                        setCurrentDniTarget(newMemberDni.trim());
                        setCurrentFormTarget('team');
                        setBioStep(1);
                        setBioProgress(0);

                        const devicesWithSn = techDevices.filter(d => d.sn);
                        if (devicesWithSn.length > 0) {
                          setSelectedBioDeviceSn(devicesWithSn[0].sn);
                        } else {
                          setSelectedBioDeviceSn('');
                        }
                        setSelectedBioFingerId(6);
                        setEnrollError('');
                        setEnrollStatusText('');
                        setBioScanning(false);

                        setIsBioModalOpen(true);
                      }}
                      className="btn"
                      style={{
                        padding: '10px',
                        fontSize: '12px',
                        fontWeight: 700,
                        backgroundColor: newMemberBiometricId ? 'var(--success-light)' : 'rgba(239, 68, 68, 0.1)',
                        color: newMemberBiometricId ? 'var(--success)' : 'var(--error)',
                        border: newMemberBiometricId ? '1px solid var(--success)' : '1px solid var(--error)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      {newMemberBiometricId ? '🟢 Huella Enrolada (ID: ' + newMemberBiometricId + ')' : '🧬 Activar Lector Biométrico (3 Intentos)'}
                    </button>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ padding: '10px', fontSize: '13px', fontWeight: 'bold', marginTop: '5px' }}>
                    Crear Colaborador
                  </button>
                </form>
              )}
            </div>

            {/* Selected User Details */}
            <div className="card" style={{ flex: '2 1 450px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {selectedUser ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h3 style={{ margin: 0 }}>Ficha de Colaborador: {selectedUser.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        <span>Rol: {selectedUser.role} | Tienda: {selectedUser.store} | ID Biométrico:</span>
                        <strong style={{ color: selectedUser.biometricId ? 'var(--secondary)' : 'var(--text-muted)' }}>
                          {selectedUser.biometricId || 'No asignado'}
                        </strong>
                        {['Administrador', 'Supervisor', 'Gerente', 'Auditor'].includes(user.role) && (
                          <button
                            type="button"
                            onClick={() => {
                              const newBioId = prompt(`Ingresa el nuevo ID Biométrico para ${selectedUser.name} (debe coincidir con el ID registrado en el lector físico ZKTeco):`, selectedUser.biometricId || '');
                              if (newBioId !== null) {
                                onUpdateCollaborator(selectedUser.username, { biometricId: newBioId.trim() });
                                setSelectedUser(prev => ({ ...prev, biometricId: newBioId.trim() }));
                                alert(`ID Biométrico actualizado a: ${newBioId.trim() || 'No asignado'}`);
                              }
                            }}
                            style={{
                              border: 'none',
                              background: 'none',
                              color: 'var(--primary)',
                              fontSize: '11px',
                              cursor: 'pointer',
                              padding: '0 2px',
                              textDecoration: 'underline',
                              fontWeight: 700
                            }}
                          >
                            Editar ID
                          </button>
                        )}
                      </div>
                    </div>
                    {/* Move/Transfer Store Selector */}
                    {['Administrador', 'Supervisor', 'Gerente', 'Auditor'].includes(user.role) && ['Barista', 'Cocina', 'Servicio'].includes(selectedUser.role) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-main)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>🔄 Trasladar Sede:</span>
                        <select
                          value={selectedUser.store}
                          onChange={(e) => {
                            const newStore = e.target.value;
                            if (confirm(`¿Estás seguro de trasladar a ${selectedUser.name} a la sede de ${newStore}?`)) {
                              onUpdateCollaborator(selectedUser.username, { store: newStore });
                              setSelectedUser(prev => ({ ...prev, store: newStore }));
                              alert(`${selectedUser.name} ha sido trasladado a la sede de ${newStore} con éxito.`);
                            }
                          }}
                          className="input"
                          style={{ padding: '2px 6px', fontSize: '11px', height: '26px', width: '110px', cursor: 'pointer', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                        >
                          <option value="Barranco">Barranco</option>
                          <option value="Miraflores">Miraflores</option>
                          <option value="San Isidro">San Isidro</option>
                          {user.role !== 'Administrador' && <option value="Todas">Todas</option>}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Sub-tabs selector for detail card */}
                  <div style={{ display: 'flex', gap: '5px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                    <button
                      onClick={() => setCollabDetailTab('training')}
                      className="btn"
                      style={{
                        padding: '6px 12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: collabDetailTab === 'training' ? 'var(--primary)' : 'var(--bg-main)',
                        color: collabDetailTab === 'training' ? '#fff' : 'var(--text-main)',
                        border: collabDetailTab === 'training' ? '1px solid var(--primary)' : '1px solid var(--border)',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      📖 Educación / Capacitación
                    </button>
                    <button
                      onClick={() => setCollabDetailTab('attendance')}
                      className="btn"
                      style={{
                        padding: '6px 12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: collabDetailTab === 'attendance' ? 'var(--primary)' : 'var(--bg-main)',
                        color: collabDetailTab === 'attendance' ? '#fff' : 'var(--text-main)',
                        border: collabDetailTab === 'attendance' ? '1px solid var(--primary)' : '1px solid var(--border)',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      ⏰ Control de Asistencia
                    </button>
                  </div>

                  {collabDetailTab === 'training' ? (
                    /* TRAINING INDUCTION VIEW */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {trainingRoute.map(day => {
                        const userStatus = 'Completado';
                        
                        let badgeColor = { bg: 'var(--bg-main)', text: 'var(--text-muted)', border: 'var(--border)' };
                        if (userStatus === 'Completado') badgeColor = { bg: 'var(--success-light)', text: 'var(--success)', border: 'var(--success)' };
                        if (userStatus === 'En Curso') badgeColor = { bg: 'var(--warning-light)', text: 'var(--warning)', border: 'var(--warning)' };
                        if (userStatus === 'Reprobado') badgeColor = { bg: 'var(--error-light)', text: 'var(--error)', border: 'var(--error)' };

                        return (
                          <div
                            key={day.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '12px 16px',
                              border: `1px solid ${badgeColor.border}`,
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: badgeColor.bg,
                              gap: '15px',
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <strong style={{ fontSize: '13px', color: 'var(--primary)', display: 'block' }}>{day.dia} - {day.titulo}</strong>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{day.descripcion}</span>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '4px' }}>
                              {['Pendiente', 'En Curso', 'Completado', 'Reprobado'].map(status => (
                                <button
                                  key={status}
                                  onClick={() => onApproveTrainingDay(selectedUser.username, day.id, status)}
                                  className="btn"
                                  style={{
                                    fontSize: '9px',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    backgroundColor: userStatus === status ? (status === 'Reprobado' ? 'var(--error)' : 'var(--primary)') : 'rgba(255,255,255,0.8)',
                                    color: userStatus === status ? '#fff' : 'var(--text-main)',
                                    border: '1px solid var(--border)',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* ATTENDANCE CONTROL VIEW */
                    (() => {
                      const logs = selectedUser.arrivalLogs || [];
                      const avgTime = calculateAverageTime(logs);
                      const avgDelay = calculateAverageDelay(logs);
                      
                      let levelBadge = { bg: 'var(--success-light)', text: 'var(--success)', border: 'var(--success)', label: 'Puntualidad Excelente' };
                      if (avgDelay > 10) {
                        levelBadge = { bg: 'var(--error-light)', text: 'var(--error)', border: 'var(--error)', label: 'Impuntualidad Crítica' };
                      } else if (avgDelay > 4) {
                        levelBadge = { bg: 'var(--warning-light)', text: 'var(--warning)', border: 'var(--warning)', label: 'Tardanza Leve' };
                      }

                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '5px' }} className="animate-fade-in">
                          {/* Stats cards */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div style={{ border: '1px solid var(--border)', padding: '12px', borderRadius: '6px', textAlign: 'center', backgroundColor: 'var(--bg-main)' }}>
                              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Hora de Llegada Promedio</span>
                              <strong style={{ fontSize: '18px', color: 'var(--text-main)' }}>{avgTime}</strong>
                            </div>
                            <div style={{ border: '1px solid var(--border)', padding: '12px', borderRadius: '6px', textAlign: 'center', backgroundColor: 'var(--bg-main)' }}>
                              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Retraso Promedio</span>
                              <strong style={{ fontSize: '18px', color: avgDelay > 5 ? 'var(--error)' : 'var(--success)' }}>{avgDelay.toFixed(1)} min</strong>
                            </div>
                          </div>

                          <div style={{
                            padding: '10px 12px',
                            borderRadius: '4px',
                            backgroundColor: levelBadge.bg,
                            color: levelBadge.text,
                            border: `1px solid ${levelBadge.border}`,
                            fontSize: '12px',
                            fontWeight: 800,
                            textAlign: 'center'
                          }}>
                            ⚡ Calificación: {levelBadge.label}
                          </div>

                          {/* Table of logs */}
                          <div style={{ border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
                              <thead>
                                <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
                                  <th style={{ padding: '10px' }}>Fecha</th>
                                  <th style={{ padding: '10px' }}>Entrada Programada</th>
                                  <th style={{ padding: '10px' }}>Hora Llegada</th>
                                  <th style={{ padding: '10px' }}>Hora Salida</th>
                                  <th style={{ padding: '10px' }}>Retraso</th>
                                  <th style={{ padding: '10px', textAlign: 'center' }}>Total Marcajes</th>
                                </tr>
                              </thead>
                              <tbody>
                                {logs.length > 0 ? (
                                  logs.map((log, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                      <td style={{ padding: '10px', fontWeight: 600 }}>{log.date}</td>
                                      <td style={{ padding: '10px', color: 'var(--text-muted)' }}>{log.expectedTime}</td>
                                      <td style={{ padding: '10px' }}>{log.time}</td>
                                      <td style={{ padding: '10px' }}>{log.checkOutTime || '--'}</td>
                                      <td style={{ padding: '10px' }}>
                                        <span style={{
                                          fontWeight: 800,
                                          color: log.delayMin > 10 ? 'var(--error)' : log.delayMin > 0 ? 'var(--warning)' : 'var(--success)'
                                        }}>
                                          {log.delayMin > 0 
                                            ? (log.delayMin >= 60 
                                                ? `+${Math.floor(log.delayMin / 60)}h ${log.delayMin % 60}min` 
                                                : `+${log.delayMin} min`) 
                                            : 'Puntual'}
                                        </span>
                                      </td>
                                      <td style={{ padding: '10px', textAlign: 'center', fontWeight: 600 }}>
                                        {log.totalPunches || 1}
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                      Sin marcaciones de llegada registradas.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })()
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', minHeight: '300px', flexDirection: 'column' }}>
                  <span>Selecciona un colaborador de la lista para ver sus detalles de asistencia y capacitación.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Historial de Auditorías Operacionales</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>Registros históricos de evaluaciones operacionales realizadas en tienda.</p>
            </div>

            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Tienda</th>
                    <th>Fecha</th>
                    <th>Nota Ponderada</th>
                    <th>Comentarios</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleLogs.length > 0 ? (
                    visibleLogs.map((log, i) => (
                      <tr 
                        key={i} 
                        onClick={() => setSelectedAuditLog(log)}
                        style={{ cursor: 'pointer' }}
                        title="Haz clic para ver el detalle de la auditoría verídica"
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-main)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={{ fontWeight: 700 }}>{log.tienda}</td>
                        <td>{new Date(log.fecha).toLocaleDateString()} {new Date(log.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                        <td>
                          <span style={{
                            fontWeight: 800,
                            color: log.nota >= 90 ? 'var(--success)' : log.nota >= 70 ? 'var(--warning)' : 'var(--error)',
                            backgroundColor: log.nota >= 90 ? 'var(--success-light)' : log.nota >= 70 ? 'var(--warning-light)' : 'var(--error-light)',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            border: '1px solid currentColor'
                          }}>
                            {log.nota.toFixed(1)}%
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{log.comentarios || 'Sin observaciones'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay auditorías registradas en este período.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}



        {activeTab === 'multistore' && renderMultistoreDashboard()}

        {activeTab === 'managerial_kpis' && renderManagerialDashboard()}

        {activeTab === 'incidents' && renderIncidentsDashboard()}

        {activeTab === 'my_attendance' && renderMyAttendanceTab()}

        {activeTab === 'technical_panel' && renderTechnicalPanelTab()}
      </div>
      {/* Modal for previewing photo evidence */}
      {/* Modal for detailed audit log (Veridical Audit) */}
      {selectedAuditLog && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          backdropFilter: 'blur(4px)',
          padding: '20px'
        }} onClick={() => setSelectedAuditLog(null)}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-main)',
            border: '1px solid var(--border)',
            padding: '24px',
            borderRadius: 'var(--radius-md)',
            maxWidth: '650px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxShadow: 'var(--shadow-lg)'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--primary)' }}>Reporte de Auditoría Operacional</h3>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Sede: <strong>{selectedAuditLog.tienda}</strong> | Fecha: {new Date(selectedAuditLog.fecha).toLocaleString('es-PE')}
                  {selectedAuditLog.colaboradorAuditado && <span> | Evaluado: <strong>{selectedAuditLog.colaboradorAuditado}</strong></span>}
                </span>
              </div>
              <button onClick={() => setSelectedAuditLog(null)} style={{ border: 'none', backgroundColor: 'transparent', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold', color: 'var(--text-muted)' }}>✕</button>
            </div>

            {/* Score & General Status */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-main)', padding: '15px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Puntaje de Auditoría</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: selectedAuditLog.nota >= 90 ? 'var(--success)' : selectedAuditLog.nota >= 70 ? 'var(--warning)' : 'var(--error)' }}>
                  {selectedAuditLog.nota.toFixed(1)}%
                </div>
              </div>
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: '4px',
                color: '#fff',
                backgroundColor: selectedAuditLog.nota >= 90 ? 'var(--success)' : selectedAuditLog.nota >= 70 ? 'var(--warning)' : 'var(--error)'
              }}>
                {selectedAuditLog.nota >= 90 ? 'Excelente' : selectedAuditLog.nota >= 70 ? 'Regular / Alerta' : 'Crítico / Plan de Acción Urgente'}
              </span>
            </div>

            {/* General Comments */}
            <div>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Comentarios / Observaciones:</h4>
              <p style={{ margin: 0, fontSize: '13px', fontStyle: 'italic', backgroundColor: 'var(--bg-main)', padding: '10px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                {selectedAuditLog.comentarios || 'Sin observaciones generales.'}
              </p>
            </div>

            {/* Action Plans (Planes de Acción) */}
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>⚠️ Planes de Acción Generados:</h4>
              {selectedAuditLog.actionPlans && Object.keys(selectedAuditLog.actionPlans).length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Object.entries(selectedAuditLog.actionPlans).map(([critId, planText]) => (
                    <div key={critId} style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '10px', borderLeft: '3px solid var(--error)', backgroundColor: 'var(--bg-main)', borderRadius: '0 4px 4px 0', fontSize: '12px' }}>
                      <strong>Criterio ID: {critId}</strong>
                      <span style={{ color: 'var(--text-main)' }}>{planText}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--success)', fontWeight: 600 }}>✓ No se generaron planes de acción obligatorios. ¡Todos los criterios auditados están conformes!</p>
              )}
            </div>

            {/* Evidence Photos Grid */}
            {selectedAuditLog.evidencePhotos && Object.keys(selectedAuditLog.evidencePhotos).length > 0 && (
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>📸 Evidencias Fotográficas Cargadas:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                  {Object.entries(selectedAuditLog.evidencePhotos).map(([critId, imgData]) => (
                    <div key={critId} style={{ border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', backgroundColor: 'var(--bg-main)', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderBottom: '1px solid var(--border)' }}>
                        <img src={imgData} alt={`Criterio ${critId}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      </div>
                      <span style={{ fontSize: '9px', fontWeight: 800, padding: '4px 6px', textAlign: 'center', color: 'var(--text-muted)' }}>Criterio: {critId}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Digital Signatures (Firmas Digitales) */}
            {selectedAuditLog.signatureAuditor && selectedAuditLog.signatureAuditado && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>✒️ Firmas Digitales de Conformidad:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-around', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                    <div style={{ border: '1px dashed var(--border)', borderRadius: '4px', padding: '5px', backgroundColor: 'var(--bg-main)', height: '60px', width: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={selectedAuditLog.signatureAuditor} alt="Firma Auditor" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-main)' }}>Firma del Auditor</span>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                      {selectedAuditLog.colaboradorAuditado === 'Diana Valdivia' ? 'Gerente General (Don Guto)' : 'Administrador (Diana Valdivia)'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                    <div style={{ border: '1px dashed var(--border)', borderRadius: '4px', padding: '5px', backgroundColor: 'var(--bg-main)', height: '60px', width: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={selectedAuditLog.signatureAuditado} alt="Firma Auditado" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-main)' }}>Firma de {selectedAuditLog.colaboradorAuditado || 'Auditado'}</span>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                      {selectedAuditLog.colaboradorAuditado === 'Diana Valdivia' ? 'Administrador de Tienda' : 'Colaborador'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px', borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
              <button 
                onClick={() => handleDownloadAuditPDF(selectedAuditLog)} 
                className="btn btn-primary"
                style={{ padding: '8px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                📥 Descargar PDF Oficial
              </button>
              <button 
                onClick={() => setSelectedAuditLog(null)} 
                className="btn btn-secondary" 
                style={{ padding: '8px 20px', fontSize: '13px' }}
              >
                Cerrar Reporte
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
      {previewPhoto && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          backdropFilter: 'blur(4px)',
          padding: '20px'
        }} onClick={() => setPreviewPhoto(null)}>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            maxWidth: '500px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            boxShadow: 'var(--shadow-lg)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text-main)' }}>Evidencia Fotográfica</h3>
              <button onClick={() => setPreviewPhoto(null)} style={{ border: 'none', backgroundColor: 'transparent', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>
            <div style={{ textAlign: 'left', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div><strong>Área:</strong> <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{previewPhoto.area}</span></div>
              <div><strong>Tarea:</strong> {previewPhoto.task}</div>
            </div>
            <div style={{ border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
              <img src={previewPhoto.img} alt="Evidencia" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
            <button onClick={() => setPreviewPhoto(null)} className="btn btn-secondary" style={{ alignSelf: 'flex-end', padding: '6px 16px', fontSize: '12px' }}>
              Cerrar
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Biometric Enrolment Wizard Modal */}
      {isBioModalOpen && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          backdropFilter: 'blur(8px)',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#111827',
            color: '#f3f4f6',
            border: '1px solid #374151',
            padding: '28px',
            borderRadius: '12px',
            maxWidth: '450px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            textAlign: 'center'
          }}>
            <style>{`
              @keyframes scanLaser {
                0% { top: 0%; }
                50% { top: 100%; }
                100% { top: 0%; }
              }
              @keyframes pulse {
                0% { transform: scale(0.95); opacity: 0.5; }
                50% { transform: scale(1.05); opacity: 0.8; }
                100% { transform: scale(0.95); opacity: 0.5; }
              }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderBottom: '1px solid #374151', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🧬 Enrolamiento de Huella - ZKTeco M1
              </h3>
              <button
                onClick={() => {
                  if (bioStep === 2 && !confirm('¿Estás seguro de cancelar el enrolamiento biométrico en curso?')) return;
                  if (window.activeBioPollingInterval) {
                    clearInterval(window.activeBioPollingInterval);
                  }
                  setIsBioModalOpen(false);
                  setBioScanning(false);
                }}
                style={{ border: 'none', backgroundColor: 'transparent', fontSize: '18px', cursor: 'pointer', color: '#9ca3af', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>

            {/* Visual Scan Step Indicator */}
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', margin: '10px 0' }}>
              {[1, 2, 3].map(stepNum => {
                const isActive = bioStep >= stepNum;
                const isCompleted = bioStep > stepNum;
                return (
                  <div key={stepNum} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: isCompleted ? '#10b981' : (isActive ? '#3b82f6' : '#374151'),
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      border: isActive ? '2px solid #60a5fa' : '2px solid transparent',
                      transition: 'all 0.3s ease'
                    }}>
                      {isCompleted ? '✓' : stepNum}
                    </div>
                    <span style={{ fontSize: '9px', color: isActive ? '#f3f4f6' : '#9ca3af' }}>
                      {stepNum === 1 ? 'Configurar' : stepNum === 2 ? 'Escanear' : 'Completado'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Animated Scanner Graphic */}
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: 'rgba(59, 130, 246, 0.08)',
              border: bioStep === 3 ? '3px solid #10b981' : (bioScanning ? '3px solid #f59e0b' : '3px solid #3b82f6'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: bioStep === 3 ? '0 0 20px rgba(16, 185, 129, 0.3)' : '0 0 15px rgba(59, 130, 246, 0.15)',
              margin: '15px 0'
            }}>
              {bioScanning && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '50%',
                  border: '2px solid #f59e0b',
                  animation: 'pulse 1.2s infinite'
                }} />
              )}
              
              {bioScanning && (
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '3px',
                  backgroundColor: '#f59e0b',
                  boxShadow: '0 0 8px #f59e0b',
                  top: '0%',
                  animation: 'scanLaser 1.5s infinite linear'
                }} />
              )}

              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke={bioStep === 3 ? '#10b981' : (bioScanning ? '#f59e0b' : '#3b82f6')}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: bioScanning ? 0.6 : 1, transition: 'all 0.3s ease' }}
              >
                <path d="M2 12a10 10 0 0 1 13-9.5" />
                <path d="M5 19.5A9 9 0 0 1 18.5 7" />
                <path d="M8 22.5A8 8 0 0 1 22 12" />
                <path d="M12 15a3 3 0 0 1-3-3" />
                <path d="M15 15a4 4 0 0 0-3-4" />
                <path d="M18 15a5 5 0 0 0-4-5" />
                <path d="M21 15a6 6 0 0 0-5-6" />
                <path d="M12 18v2" />
              </svg>
            </div>

            {/* Content Switcher depending on BioStep */}
            <div style={{ width: '100%', minHeight: '120px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {enrollError && (
                <div style={{
                  padding: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid var(--error)',
                  borderRadius: '6px',
                  color: '#fca5a5',
                  fontSize: '12px',
                  textAlign: 'left'
                }}>
                  <strong>⚠️ Error:</strong> {enrollError}
                </div>
              )}

              {bioStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                  <div style={{ fontSize: '13px', borderBottom: '1px solid #374151', paddingBottom: '8px', marginBottom: '4px' }}>
                    <span>Enrolar colaborador con DNI: </span>
                    <strong style={{ color: '#10b981', fontSize: '14px' }}>{currentDniTarget}</strong>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af' }}>1. Seleccionar Lector Físico Destino:</label>
                    {techDevices.filter(d => d.sn).length === 0 ? (
                      <div style={{ fontSize: '11px', color: '#f87171' }}>
                        No hay lectores configurados con Número de Serie (SN). Primero registre un dispositivo con SN en la pestaña de administración.
                      </div>
                    ) : (
                      <select
                        className="input"
                        value={selectedBioDeviceSn}
                        onChange={(e) => setSelectedBioDeviceSn(e.target.value)}
                        style={{ padding: '8px', backgroundColor: '#1f2937', color: '#fff', border: '1px solid #4b5563', borderRadius: '4px', width: '100%' }}
                      >
                        {techDevices.filter(d => d.sn).map(dev => (
                          <option key={dev.id} value={dev.sn}>
                            {dev.name} (SN: {dev.sn})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af' }}>2. Seleccionar Dedo a Enrolar:</label>
                    <select
                      className="input"
                      value={selectedBioFingerId}
                      onChange={(e) => setSelectedBioFingerId(Number(e.target.value))}
                      style={{ padding: '8px', backgroundColor: '#1f2937', color: '#fff', border: '1px solid #4b5563', borderRadius: '4px', width: '100%' }}
                    >
                      {FINGERS_LIST.map(finger => (
                        <option key={finger.id} value={finger.id}>
                          {finger.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {bioStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <strong style={{ fontSize: '14px', color: '#f59e0b' }}>
                    Escaneando en Dispositivo
                  </strong>
                  <p style={{ fontSize: '12.5px', color: '#9ca3af', margin: 0, lineHeight: '1.4' }}>
                    Dedo indicado: <strong style={{ color: '#fff' }}>
                      {FINGERS_LIST.find(f => f.id === selectedBioFingerId)?.name}
                    </strong>
                  </p>
                  <p style={{ fontSize: '12px', color: '#e5e7eb', backgroundColor: '#1f2937', padding: '12px', borderRadius: '6px', border: '1px solid #374151', minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {enrollStatusText}
                  </p>
                  <div style={{ fontSize: '11px', color: '#9ca3af', fontStyle: 'italic' }}>
                    (El lector ZKTeco K40/M1 parpadeará pidiéndole al colaborador colocar su dedo 3 veces)
                  </div>
                </div>
              )}

              {bioStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <strong style={{ fontSize: '15px', color: '#10b981' }}>¡Enrolamiento Exitoso!</strong>
                  <p style={{ fontSize: '12.5px', color: '#9ca3af', margin: 0 }}>
                    La huella del dedo <strong>{FINGERS_LIST.find(f => f.id === selectedBioFingerId)?.name}</strong> se ha guardado en el dispositivo y enlazado al DNI <strong>{currentDniTarget}</strong>.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ width: '100%', marginTop: '10px' }}>
              {bioStep === 1 && (
                <button
                  type="button"
                  disabled={techDevices.filter(d => d.sn).length === 0}
                  onClick={handleStartRealEnroll}
                  className="btn"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    backgroundColor: techDevices.filter(d => d.sn).length === 0 ? '#374151' : '#3b82f6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: techDevices.filter(d => d.sn).length === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  🚀 Iniciar Captura Real en Lector
                </button>
              )}

              {bioStep === 2 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.activeBioPollingInterval) {
                      clearInterval(window.activeBioPollingInterval);
                    }
                    setBioScanning(false);
                    setBioStep(1);
                    setEnrollError('');
                    setEnrollStatusText('');
                  }}
                  className="btn"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    backgroundColor: '#dc2626',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Cancelar Captura / Reintentar
                </button>
              )}

              {bioStep === 3 && (
                <button
                  type="button"
                  onClick={() => {
                    if (currentFormTarget === 'team') {
                      setNewMemberBiometricId(currentDniTarget);
                    } else {
                      setManageUserBiometricId(currentDniTarget);
                    }
                    setIsBioModalOpen(false);
                  }}
                  className="btn"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    backgroundColor: '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Finalizar Enrolamiento
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
