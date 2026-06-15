import React, { useState, useEffect } from 'react';
import OperationAudit from './OperationAudit';

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
}) {
  const [activeTab, setActiveTab] = useState('monitoring');
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

  // States for attendance QR Scanner simulation
  const [scannerCollabEmail, setScannerCollabEmail] = useState('');
  const [scannerExpectedTime, setScannerExpectedTime] = useState('07:00 AM');
  const [scannerTimeMode, setScannerTimeMode] = useState('realtime');
  const [scannerSimTime, setScannerSimTime] = useState('07:05');
  const [scannerCustomExpTime, setScannerCustomExpTime] = useState('07:00');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

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
    teamMembers.forEach(member => {
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

  // States for adding team member
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Barista');
  const [newMemberStore, setNewMemberStore] = useState(() => {
    return user && user.role === 'Administrador' ? user.store : 'Barranco';
  });

  // New states for Monitoreo Avanzado
  const [filterArea, setFilterArea] = useState('GENERAL');
  const [viewMode, setViewMode] = useState('DIARIO');
  const [selectedDateStr, setSelectedDateStr] = useState('2026-06-12');
  const [selectedCollaborator, setSelectedCollaborator] = useState('TODOS');

  // Reset collaborator filter when changing department
  useEffect(() => {
    setSelectedCollaborator('TODOS');
  }, [filterArea]);

  const visibleMembers = user.role === 'Administrador'
    ? teamMembers.filter(m => m.store === user.store && ['Barista', 'Cocina', 'Servicio'].includes(m.role))
    : teamMembers;

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
    
    if (newYear === 2026 && newMonth === 5 && newDay >= 1 && newDay <= 12) {
      setSelectedDateStr(`2026-06-${newDay.toString().padStart(2, '0')}`);
    }
  };

  const getTasksForSelectedDate = () => {
    if (selectedDateStr === '2026-06-12') {
      return checklists;
    }
    const completedIds = MOCK_HISTORY[selectedDateStr]?.completedIds || [];
    return checklists.map(t => {
      const isCompleted = completedIds.includes(t.id);
      return {
        ...t,
        completado: isCompleted,
        evidencia: isCompleted ? (t.requiere_foto ? MOCK_PHOTO_URL : null) : null
      };
    });
  };

  const getComplianceForStats = (areaCode, dateStr, collaborator = 'TODOS') => {
    const tasksForDate = dateStr === '2026-06-12'
      ? checklists
      : checklists.map(t => ({
          ...t,
          completado: (MOCK_HISTORY[dateStr]?.completedIds || []).includes(t.id)
        }));

    const filtered = tasksForDate.filter(t => {
      const matchArea = areaCode === 'GENERAL' || t.area === areaCode;
      const matchCollab = isTaskAssignedTo(t.id, collaborator);
      return matchArea && matchCollab;
    });
    const total = filtered.length;
    const completed = filtered.filter(t => t.completado).length;
    return total > 0 ? (completed / total) * 100 : 0;
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
    if (!newMemberName || !newMemberEmail) return;
    
    onAddTeamMember({
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole,
      store: newMemberStore,
    });

    setNewMemberName('');
    setNewMemberEmail('');
    alert(`Colaborador ${newMemberName} agregado con éxito.`);
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
    const storesList = ['Barranco', 'Miraflores', 'San Isidro'];
    
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {storesList.map(storeName => {
            const storeMembers = teamMembers.filter(m => m.store === storeName);
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
    const statsByStore = getStorePunctualityStats();
    const tiendaTardona = statsByStore.length > 0 ? statsByStore[0].store : 'N/A';
    const tardonaMinutes = statsByStore.length > 0 ? statsByStore[0].avgDelay.toFixed(1) : '0';

    const topPerformers = teamMembers
      .filter(m => ['Barista', 'Cocina', 'Servicio'].includes(m.role))
      .map(m => {
        const avgDelay = calculateAverageDelay(m.arrivalLogs || []);
        const logsCount = (m.arrivalLogs || []).length;
        return { name: m.name, role: m.role, store: m.store, avgDelay, logsCount };
      })
      .filter(m => m.logsCount >= 3)
      .sort((a, b) => a.avgDelay - b.avgDelay)
      .slice(0, 3);

    const observationTeam = teamMembers
      .filter(m => ['Barista', 'Cocina', 'Servicio'].includes(m.role))
      .map(m => {
        const avgDelay = calculateAverageDelay(m.arrivalLogs || []);
        const logsCount = (m.arrivalLogs || []).length;
        const trainingDone = Object.values(m.trainingProgress || {}).filter(status => status === 'Completado').length;
        return { name: m.name, role: m.role, store: m.store, avgDelay, trainingDone, logsCount };
      })
      .filter(m => m.avgDelay > 5 || m.trainingDone < 4)
      .sort((a, b) => b.avgDelay - a.avgDelay);

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
              {(100 - (teamMembers.reduce((acc, m) => acc + calculateAverageDelay(m.arrivalLogs || []), 0) / teamMembers.length) * 5).toFixed(1)}%
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
          </div>
        </div>
      </div>
    );
  };

  const renderIncidentsDashboard = () => {
    const userStore = user.store;
    const isStoreAdmin = user.role === 'Administrador';

    const filtered = (incidents || []).filter(inc => {
      // Store filter
      if (isStoreAdmin) {
        if (inc.store !== userStore) return false;
      } else {
        if (incStoreFilter !== 'Todas' && inc.store !== incStoreFilter) return false;
      }
      
      // Status filter
      if (incStatusFilter !== 'Todos' && inc.status !== incStatusFilter) return false;
      
      // Urgency filter
      if (incUrgencyFilter !== 'Todos' && inc.urgency !== incUrgencyFilter) return false;
      
      // Type filter
      if (incTypeFilter !== 'Todos' && inc.type !== incTypeFilter) return false;
      
      return true;
    });

    // Stats
    const totalCount = filtered.length;
    const pendingCount = filtered.filter(inc => inc.status === 'Pendiente').length;
    const processCount = filtered.filter(inc => inc.status === 'En Proceso').length;
    const escalatedCount = filtered.filter(inc => inc.status === 'Escalado').length;
    const resolvedCount = filtered.filter(inc => inc.status === 'Resuelto').length;

    // Unique stores for filters (only for non-admins)
    const uniqueStores = Array.from(new Set([...(incidents || []).map(inc => inc.store), 'Barranco', 'Miraflores', 'San Isidro']));

    const handleSaveResponse = (incidentId) => {
      const text = incResponseTexts[incidentId] || '';
      if (!text.trim()) {
        alert('Por favor, escribe una respuesta antes de guardar.');
        return;
      }
      onRespondIncident(incidentId, text.trim(), user.role);
      
      setIncSuccessMsg(`¡Respuesta registrada con éxito para la incidencia ${incidentId}!`);
      setTimeout(() => setIncSuccessMsg(''), 5000);
    };

    const handleResolve = (incidentId) => {
      const text = incResponseTexts[incidentId] || '';
      if (text.trim()) {
        onRespondIncident(incidentId, text.trim(), user.role);
      }
      onUpdateIncidentStatus(incidentId, 'Resuelto', `${user.name} (${user.role})`);
      
      setIncSuccessMsg(`¡Incidencia ${incidentId} marcada como RESUELTA!`);
      setTimeout(() => setIncSuccessMsg(''), 5000);
    };

    const handleEscalate = (incidentId) => {
      const text = incResponseTexts[incidentId] || '';
      if (text.trim()) {
        onRespondIncident(incidentId, text.trim(), user.role);
      }
      onUpdateIncidentStatus(incidentId, 'Escalado');
      
      setIncSuccessMsg(`¡Incidencia ${incidentId} escalada a Supervisión!`);
      setTimeout(() => setIncSuccessMsg(''), 5000);
    };

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
            💼 Rol: {user.role} {isStoreAdmin && `(${userStore})`}
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

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
          <div className="card glass" style={{ padding: '15px', textAlign: 'center', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Filtrados</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginTop: '5px' }}>{totalCount}</div>
          </div>
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
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase' }}>✓ Resueltos</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--success)', marginTop: '5px' }}>{resolvedCount}</div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="card glass" style={{ padding: '15px', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', border: '1px solid var(--border)' }}>
          <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>🔍 Filtros rápidos:</strong>
          
          {/* Store Filter */}
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

          {/* Status Filter */}
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
              <option value="Resuelto">✓ Resuelto</option>
            </select>
          </div>

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

              const formattedDate = new Date(inc.date).toLocaleString('es-PE', {
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
              });

              const currentDraft = incResponseTexts[inc.id] || '';

              return (
                <div
                  key={inc.id}
                  className="card animate-scale-in"
                  style={{
                    padding: '20px',
                    border: `1px solid ${statusBorder}`,
                    backgroundColor: inc.status === 'Resuelto' ? 'rgba(16, 185, 129, 0.01)' : 'var(--bg-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                  }}
                >
                  {/* Card Top Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '11px', letterSpacing: '0.5px' }}>
                          {inc.id} • {inc.type.toUpperCase()}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: 'rgba(0,0,0,0.04)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-main)' }}>
                          📍 Sede: {inc.store}
                        </span>
                      </div>
                      <h3 style={{ margin: '6px 0 0 0', fontSize: '15px', color: 'var(--text-main)', fontWeight: 800 }}>
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
                    </div>
                  </div>

                  {/* Description */}
                  <div style={{
                    backgroundColor: 'var(--bg-main)',
                    padding: '12px 15px',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    fontSize: '12.5px',
                    color: 'var(--text-main)',
                    lineHeight: '1.5'
                  }}>
                    <strong>Descripción del problema:</strong>
                    <p style={{ margin: '6px 0 0 0', whiteSpace: 'pre-line' }}>{inc.description}</p>
                  </div>

                  {/* Reporter details */}
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '5px' }}>
                    <span>Reportado por: <strong>{inc.reporterName}</strong> ({inc.reporterRole}) • {inc.reporterEmail}</span>
                    <span>Fecha de reporte: {formattedDate}</span>
                  </div>

                  {/* Thread details / communication history */}
                  {(inc.adminResponse || inc.supervisorResponse || inc.status === 'Resuelto') && (
                    <div style={{
                      borderTop: '1px dashed var(--border)',
                      paddingTop: '15px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      backgroundColor: 'rgba(0,0,0,0.01)',
                      padding: '12px 15px',
                      borderRadius: '8px'
                    }}>
                      <h4 style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        💬 Historial de Seguimiento:
                      </h4>

                      {/* Admin response block */}
                      {inc.adminResponse ? (
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          borderLeft: '3px solid var(--secondary)',
                          paddingLeft: '10px',
                          backgroundColor: 'rgba(0,0,0,0.02)',
                          padding: '8px 10px',
                          borderRadius: '0 6px 6px 0'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '11px' }}>
                              💬 Respuesta del Administrador (Diana Valdivia):
                            </span>
                            <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                              {new Date(inc.adminResponseAt).toLocaleString('es-PE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-main)', lineHeight: 1.4 }}>
                            {inc.adminResponse}
                          </p>
                        </div>
                      ) : (
                        inc.status !== 'Resuelto' && (
                          <div style={{ fontSize: '11.5px', fontStyle: 'italic', color: 'var(--text-muted)', paddingLeft: '10px' }}>
                            ⏳ Sin respuesta registrada de Administración de tienda todavía.
                          </div>
                        )
                      )}

                      {/* Supervisor response block */}
                      {inc.supervisorResponse && (
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          borderLeft: '3px solid var(--primary)',
                          paddingLeft: '10px',
                          backgroundColor: 'rgba(0,0,0,0.02)',
                          padding: '8px 10px',
                          borderRadius: '0 6px 6px 0'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '11px' }}>
                              👤 Respuesta de Supervisión / Gerencia:
                            </span>
                            <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                              {new Date(inc.supervisorResponseAt).toLocaleString('es-PE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-main)', lineHeight: 1.4 }}>
                            {inc.supervisorResponse}
                          </p>
                        </div>
                      )}

                      {/* Resolution details block */}
                      {inc.status === 'Resuelto' && (
                        <div style={{
                          marginTop: '5px',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          backgroundColor: 'var(--success-light)',
                          color: 'var(--success)',
                          fontWeight: 700,
                          fontSize: '12px',
                          border: '1px solid var(--success)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span>✅</span>
                          <div>
                            <strong>Incidencia Resuelta</strong>
                            <div style={{ fontSize: '10.5px', fontWeight: 'normal', color: 'var(--text-muted)', marginTop: '2px' }}>
                              Cerrada por: <strong>{inc.resolvedBy}</strong> el {new Date(inc.resolvedAt).toLocaleString('es-PE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Forms - Respond / Resolve / Escalate */}
                  {inc.status !== 'Resuelto' && (
                    <div style={{
                      borderTop: '1px solid var(--border)',
                      paddingTop: '15px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)' }}>
                          ✍️ Escribir Respuesta / Seguimiento operativo:
                        </label>
                        <textarea
                          className="input"
                          rows="2"
                          placeholder={
                            isStoreAdmin
                              ? "Escribe la respuesta o plan de acción de la tienda..."
                              : "Escribe la directiva, indicación o respuesta de supervisión..."
                          }
                          value={currentDraft}
                          onChange={(e) => {
                            const val = e.target.value;
                            setIncResponseTexts(prev => ({ ...prev, [inc.id]: val }));
                          }}
                          style={{ resize: 'vertical', minHeight: '60px', fontSize: '12px', fontFamily: 'inherit' }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {/* Guardar Respuesta */}
                        <button
                          onClick={() => handleSaveResponse(inc.id)}
                          className="btn btn-secondary"
                          style={{ padding: '8px 14px', fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          💾 Guardar Respuesta
                        </button>

                        {/* Escalar (Only for admin and if status is not already escalated) */}
                        {isStoreAdmin && inc.status !== 'Escalado' && (
                          <button
                            onClick={() => handleEscalate(inc.id)}
                            className="btn"
                            style={{
                              padding: '8px 14px',
                              fontSize: '11.5px',
                              backgroundColor: '#fffbeb',
                              color: '#d97706',
                              border: '1px solid #fcd34d',
                              fontWeight: 700,
                              cursor: 'pointer',
                              borderRadius: '4px',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            🚨 Escalar a Supervisor
                          </button>
                        )}

                        {/* Resolver */}
                        <button
                          onClick={() => handleResolve(inc.id)}
                          className="btn btn-primary"
                          style={{
                            padding: '8px 14px',
                            fontSize: '11.5px',
                            backgroundColor: 'var(--success)',
                            borderColor: 'var(--success)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          ✓ Marcar como Resuelto
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Subtab menu */}
      <div className="card glass" style={{ padding: '0 12px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
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
          onClick={() => setActiveTab('qr_scanner')}
          style={{
            padding: '14px 20px',
            border: 'none',
            borderBottom: activeTab === 'qr_scanner' ? '3px solid var(--primary)' : '3px solid transparent',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 700,
            color: activeTab === 'qr_scanner' ? 'var(--primary)' : 'var(--text-muted)',
            transition: 'all 0.2s ease',
          }}
        >
          📷 Escanear QR Asistencia
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
        {['Supervisor', 'Gerente'].includes(user.role) && (
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
            {/* Active Gerencia Directives */}
            {directives.length > 0 && (
              <div className="card glass animate-scale-in" style={{ border: '1px solid var(--primary)', backgroundColor: 'rgba(139, 26, 26, 0.02)', display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px 16px' }}>
                <h4 style={{ margin: 0, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', textTransform: 'uppercase', fontWeight: 800 }}>
                  📢 Directivas y Notas de Gerencia General:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {directives.slice(0, 3).map(dir => (
                    <div key={dir.id} style={{ fontSize: '11px', color: 'var(--text-main)', borderLeft: '3px solid var(--primary)', paddingLeft: '8px', lineHeight: '1.4' }}>
                      <strong>{dir.date}</strong> - {dir.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                          <option key={m.email} value={m.name}>☕ {m.name}</option>
                        ))}
                    </>
                  )}
                  {filterArea === 'COCINA' && (
                    <>
                      <option value="TODOS">👥 Todos los Cocineros</option>
                      {visibleMembers
                        .filter(m => m.role === 'Cocina')
                        .map(m => (
                          <option key={m.email} value={m.name}>🍳 {m.name}</option>
                        ))}
                    </>
                  )}
                  {filterArea === 'SALON' && (
                    <>
                      <option value="TODOS">👥 Todos los de Servicio</option>
                      {visibleMembers
                        .filter(m => m.role === 'Servicio')
                        .map(m => (
                          <option key={m.email} value={m.name}>🤵 {m.name}</option>
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
                      max="2026-06-12"
                      value={selectedDateStr}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val >= '2026-06-01' && val <= '2026-06-12') {
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
                      disabled={selectedDateStr === '2026-06-12'}
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
                      backgroundColor: selectedDateStr === '2026-06-12' ? 'var(--success-light)' : 'var(--primary-light)',
                      color: selectedDateStr === '2026-06-12' ? 'var(--success)' : 'var(--primary)',
                      border: '1px solid currentColor'
                    }}>
                      {selectedDateStr === '2026-06-12' ? '🟢 EN VIVO (HOY)' : '⏳ HISTÓRICO'}
                    </span>
                  </div>
                </div>

                {/* Daily checklists feed list */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h3 style={{ margin: 0, color: 'var(--text-main)' }}>
                        Checklists del Día - Tienda: {user.store}
                      </h3>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                        Fecha consultada: <strong style={{ color: 'var(--primary)' }}>
                          {new Date(selectedDateStr + 'T12:00:00').toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </strong>
                        {selectedCollaborator !== 'TODOS' && <span> | Colaborador: <strong style={{ color: 'var(--primary)' }}>{selectedCollaborator}</strong></span>}.
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

        {activeTab === 'audits' && <OperationAudit user={user} teamMembers={teamMembers} onSaveAudit={onSaveAudit} />}

        {activeTab === 'team' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start' }}>
            {/* Team Members List */}
            <div className="card" style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Colaboradores en Tienda</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>Selecciona un colaborador para evaluar su Ruta de Capacitación.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {visibleMembers.map(member => (
                  <button
                    key={member.email}
                    onClick={() => setSelectedUser(member)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: selectedUser?.email === member.email ? '1px solid var(--primary)' : '1px solid var(--border)',
                      backgroundColor: selectedUser?.email === member.email ? 'var(--primary-light)' : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div>
                      <strong style={{ display: 'block', fontSize: '13px', color: 'var(--text-main)' }}>{member.name}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{member.email}</span>
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
              {['Gerente', 'Supervisor', 'Administrador'].includes(user.role) && (
                <form onSubmit={handleAddMember} style={{ borderTop: '1px solid var(--border)', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h4 style={{ margin: 0, color: 'var(--text-main)' }}>Agregar Colaborador</h4>
                  <input
                    type="text"
                    required
                    placeholder="Nombre Completo"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="input"
                    style={{ padding: '8px 12px' }}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Correo electrónico"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="input"
                    style={{ padding: '8px 12px' }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <select
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value)}
                      className="input"
                      style={{ padding: '8px 12px' }}
                    >
                      <option value="Barista">Barista</option>
                      <option value="Cocina">Cocina</option>
                      <option value="Servicio">Servicio</option>
                      {user.role !== 'Administrador' && (
                        <>
                          <option value="Administrador">Administrador</option>
                          <option value="Supervisor">Supervisor</option>
                        </>
                      )}
                    </select>
                    <select
                      value={newMemberStore}
                      onChange={(e) => setNewMemberStore(e.target.value)}
                      disabled={user.role === 'Administrador'}
                      className="input"
                      style={{ padding: '8px 12px', opacity: user.role === 'Administrador' ? 0.7 : 1 }}
                    >
                      <option value="Barranco">Barranco</option>
                      <option value="Miraflores">Miraflores</option>
                      <option value="San Isidro">San Isidro</option>
                      {user.role !== 'Administrador' && <option value="Todas">Todas</option>}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ padding: '8px', fontSize: '13px' }}>
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
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Rol: {selectedUser.role} | Tienda: {selectedUser.store}</span>
                    </div>
                    {/* Move/Transfer Store Selector */}
                    {['Administrador', 'Supervisor', 'Gerente'].includes(user.role) && ['Barista', 'Cocina', 'Servicio'].includes(selectedUser.role) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-main)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>🔄 Trasladar Sede:</span>
                        <select
                          value={selectedUser.store}
                          onChange={(e) => {
                            const newStore = e.target.value;
                            if (confirm(`¿Estás seguro de trasladar a ${selectedUser.name} a la sede de ${newStore}?`)) {
                              onUpdateCollaborator(selectedUser.email, { store: newStore });
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
                      📖 Ruta de Capacitación
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
                        const userStatus = selectedUser.trainingProgress?.[day.id] || 'Pendiente';
                        
                        let badgeColor = { bg: 'var(--bg-main)', text: 'var(--text-muted)', border: 'var(--border)' };
                        if (userStatus === 'Completado') badgeColor = { bg: 'var(--success-light)', text: 'var(--success)', border: 'var(--success)' };
                        if (userStatus === 'En Curso') badgeColor = { bg: 'var(--warning-light)', text: 'var(--warning)', border: 'var(--warning)' };

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
                              {['Pendiente', 'En Curso', 'Completado'].map(status => (
                                <button
                                  key={status}
                                  onClick={() => onApproveTrainingDay(selectedUser.email, day.id, status)}
                                  className="btn"
                                  style={{
                                    fontSize: '9px',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    backgroundColor: userStatus === status ? 'var(--primary)' : 'rgba(255,255,255,0.8)',
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
                                  <th style={{ padding: '10px' }}>Retraso</th>
                                </tr>
                              </thead>
                              <tbody>
                                {logs.length > 0 ? (
                                  logs.map((log, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                      <td style={{ padding: '10px', fontWeight: 600 }}>{log.date}</td>
                                      <td style={{ padding: '10px', color: 'var(--text-muted)' }}>{log.expectedTime}</td>
                                      <td style={{ padding: '10px' }}>{log.time}</td>
                                      <td style={{ padding: '10px' }}>
                                        <span style={{
                                          fontWeight: 800,
                                          color: log.delayMin > 10 ? 'var(--error)' : log.delayMin > 0 ? 'var(--warning)' : 'var(--success)'
                                        }}>
                                          {log.delayMin > 0 ? `+${log.delayMin} min` : 'Puntual'}
                                        </span>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>
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

        {activeTab === 'qr_scanner' && (() => {
          // Calculate helper to convert simulated time formats
          const convert24hTo12h = (time24) => {
            if (!time24) return '';
            const [hoursStr, minutesStr] = time24.split(':');
            let hours = parseInt(hoursStr, 10);
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            return `${hours.toString().padStart(2, '0')}:${minutesStr} ${ampm}`;
          };

          const handleScanSimulate = () => {
            if (!scannerCollabEmail) return;
            
            setIsScanning(true);
            setScanResult(null);

            setTimeout(() => {
              // Finish scan animation
              setIsScanning(false);
              
              const selectedCollab = teamMembers.find(m => m.email === scannerCollabEmail);
              if (!selectedCollab) return;

              let finalTimeStr = '';
              let finalExpectedTimeStr = scannerExpectedTime;
              
              if (scannerExpectedTime === 'CUSTOM') {
                finalExpectedTimeStr = convert24hTo12h(scannerCustomExpTime);
              }

              const now = new Date();
              if (scannerTimeMode === 'realtime') {
                const hours = now.getHours();
                const minutes = now.getMinutes();
                const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
                const displayMinutes = minutes.toString().padStart(2, '0');
                const ampm = hours >= 12 ? 'PM' : 'AM';
                finalTimeStr = `${displayHours.toString().padStart(2, '0')}:${displayMinutes} ${ampm}`;
              } else {
                finalTimeStr = convert24hTo12h(scannerSimTime);
              }

              // Parse delay
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
              const todayStr = now.toISOString().split('T')[0];

              // Call clock in handler
              if (onClockIn) {
                onClockIn(scannerCollabEmail, todayStr, finalTimeStr, finalExpectedTimeStr, delay);
              }

              setScanResult({
                name: selectedCollab.name,
                email: selectedCollab.email,
                time: finalTimeStr,
                expected: finalExpectedTimeStr,
                delay: delay
              });

            }, 1500);
          };

          return (
            <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                <h3 style={{ margin: 0, color: 'var(--primary)' }}>📷 Escáner de Asistencia QR (Tienda)</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  Apunta la cámara de la tableta de la tienda al código QR del colaborador para registrar su asistencia al instante.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginTop: '10px' }}>
                
                {/* Viewfinder simulation column */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                  <div style={{
                    width: '100%',
                    maxWidth: '320px',
                    height: '240px',
                    backgroundColor: '#1c1716',
                    borderRadius: '8px',
                    border: '3px solid var(--border)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-md)'
                  }}>
                    {/* Viewfinder borders overlay */}
                    <div style={{ position: 'absolute', top: '20px', left: '20px', width: '20px', height: '20px', borderTop: '4px solid var(--primary)', borderLeft: '4px solid var(--primary)' }} />
                    <div style={{ position: 'absolute', top: '20px', right: '20px', width: '20px', height: '20px', borderTop: '4px solid var(--primary)', borderRight: '4px solid var(--primary)' }} />
                    <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '20px', height: '20px', borderBottom: '4px solid var(--primary)', borderLeft: '4px solid var(--primary)' }} />
                    <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '20px', height: '20px', borderBottom: '4px solid var(--primary)', borderRight: '4px solid var(--primary)' }} />

                    {/* Scanning red laser line */}
                    {isScanning && (
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        height: '3px',
                        backgroundColor: 'red',
                        boxShadow: '0 0 10px 2px red',
                        top: 0,
                        animation: 'scanLaser 1.5s infinite linear'
                      }} />
                    )}

                    {/* Center content based on state */}
                    {isScanning ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#fff' }}>
                        <span style={{ fontSize: '24px', animation: 'spin 1.5s infinite linear' }}>🔄</span>
                        <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Analizando Código QR...</span>
                      </div>
                    ) : scanResult ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: 'var(--success)', textAlign: 'center', padding: '20px' }}>
                        <span style={{ fontSize: '36px' }}>✓</span>
                        <strong style={{ fontSize: '13px', textTransform: 'uppercase' }}>¡QR Escaneado con Éxito!</strong>
                        <span style={{ fontSize: '11px', color: '#fff', opacity: 0.8 }}>
                          {scanResult.name} registrado
                        </span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#888', textAlign: 'center', padding: '20px' }}>
                        <span style={{ fontSize: '40px' }}>📷</span>
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>Simulador de Cámara Activo</span>
                        <span style={{ fontSize: '10px', opacity: 0.6 }}>Selecciona un colaborador a la derecha</span>
                      </div>
                    )}
                  </div>

                  {/* Inline keyframe animation style */}
                  <style>{`
                    @keyframes scanLaser {
                      0% { top: 10%; }
                      50% { top: 90%; }
                      100% { top: 10%; }
                    }
                    @keyframes spin {
                      from { transform: rotate(0deg); }
                      to { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>

                {/* Simulation controls column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  
                  {/* Select collaborator */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-muted)' }}>1. Selecciona Colaborador a Escanear:</label>
                    <select
                      value={scannerCollabEmail}
                      onChange={(e) => setScannerCollabEmail(e.target.value)}
                      style={{
                        padding: '10px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--bg-card)',
                        color: 'var(--text-main)',
                        fontSize: '12.5px',
                        fontWeight: 600,
                      }}
                    >
                      <option value="">-- Seleccionar Colaborador --</option>
                      {teamMembers.map(member => (
                        <option key={member.email} value={member.email}>
                          {member.name} ({member.role} - Sede: {member.store})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Expected shift/time */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-muted)' }}>2. Hora Esperada de Entrada (Turno):</label>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {[
                        { label: '07:00 AM (Apertura)', val: '07:00 AM' },
                        { label: '08:00 AM (Apertura Salón)', val: '08:00 AM' },
                        { label: '02:00 PM (Tarde/Cierre)', val: '02:00 PM' },
                        { label: 'Personalizado...', val: 'CUSTOM' }
                      ].map(opt => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => setScannerExpectedTime(opt.val)}
                          className="btn"
                          style={{
                            padding: '6px 12px',
                            fontSize: '11px',
                            fontWeight: 600,
                            border: '1px solid var(--border)',
                            backgroundColor: scannerExpectedTime === opt.val ? 'var(--primary)' : 'var(--bg-main)',
                            color: scannerExpectedTime === opt.val ? '#fff' : 'var(--text-main)',
                            cursor: 'pointer',
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {scannerExpectedTime === 'CUSTOM' && (
                      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Especifica hora esperada:</span>
                        <input
                          type="time"
                          value={scannerCustomExpTime}
                          onChange={(e) => setScannerCustomExpTime(e.target.value)}
                          style={{
                            padding: '5px 8px',
                            borderRadius: '4px',
                            border: '1px solid var(--border)',
                            backgroundColor: 'var(--bg-card)',
                            color: 'var(--text-main)',
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Arrival time simulation */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-muted)' }}>3. Hora de Llegada a Registrar:</label>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-main)', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="scannerTimeMode"
                          checked={scannerTimeMode === 'realtime'}
                          onChange={() => setScannerTimeMode('realtime')}
                        />
                        Hora real del sistema
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-main)', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="scannerTimeMode"
                          checked={scannerTimeMode === 'simulated'}
                          onChange={() => setScannerTimeMode('simulated')}
                        />
                        Simular otra hora
                      </label>
                    </div>

                    {scannerTimeMode === 'simulated' && (
                      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Especifica hora de simulación:</span>
                        <input
                          type="time"
                          value={scannerSimTime}
                          onChange={(e) => setScannerSimTime(e.target.value)}
                          style={{
                            padding: '5px 8px',
                            borderRadius: '4px',
                            border: '1px solid var(--border)',
                            backgroundColor: 'var(--bg-card)',
                            color: 'var(--text-main)',
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Trigger Simulation Button */}
                  <div style={{ marginTop: '10px' }}>
                    <button
                      type="button"
                      disabled={isScanning || !scannerCollabEmail}
                      onClick={handleScanSimulate}
                      className="btn"
                      style={{
                        padding: '12px 24px',
                        fontSize: '13px',
                        fontWeight: 700,
                        backgroundColor: !scannerCollabEmail ? 'var(--text-muted)' : 'var(--primary)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: !scannerCollabEmail ? 'not-allowed' : 'pointer',
                        width: '100%',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      📸 Simular Escaneo de Código QR
                    </button>
                  </div>

                </div>

              </div>

              {/* Scan feedback card */}
              {scanResult && (
                <div style={{
                  padding: '15px 20px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--success-light)',
                  border: '1px solid var(--success)',
                  color: 'var(--success)',
                  fontSize: '13px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px',
                  marginTop: '10px'
                }}>
                  <strong>🟢 REGISTRO DE ASISTENCIA QR COMPLETADO:</strong>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginTop: '5px', color: 'var(--text-main)' }}>
                    <div>👤 <strong>Colaborador:</strong> {scanResult.name}</div>
                    <div>📧 <strong>Email:</strong> {scanResult.email}</div>
                    <div>🕒 <strong>Hora Entrada:</strong> {scanResult.time}</div>
                    <div>📅 <strong>Hora Esperada:</strong> {scanResult.expected}</div>
                    <div style={{ fontWeight: 700, color: scanResult.delay > 0 ? 'var(--error)' : 'var(--success)' }}>
                      ⚠️ <strong>Retraso:</strong> {scanResult.delay > 0 ? `+${scanResult.delay} minutos` : 'A tiempo'}
                    </div>
                  </div>
                </div>
              )}

            </div>
          );
        })()}

        {activeTab === 'multistore' && renderMultistoreDashboard()}

        {activeTab === 'managerial_kpis' && renderManagerialDashboard()}

        {activeTab === 'incidents' && renderIncidentsDashboard()}
      </div>
      {/* Modal for previewing photo evidence */}
      {/* Modal for detailed audit log (Veridical Audit) */}
      {selectedAuditLog && (
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
          zIndex: 1000,
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

            {/* Close Button */}
            <button 
              onClick={() => setSelectedAuditLog(null)} 
              className="btn btn-secondary" 
              style={{ alignSelf: 'flex-end', padding: '8px 24px', fontSize: '13px', marginTop: '10px' }}
            >
              Cerrar Reporte
            </button>
          </div>
        </div>
      )}
      {previewPhoto && (
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
          zIndex: 1000,
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
        </div>
      )}
    </div>
  );
}
