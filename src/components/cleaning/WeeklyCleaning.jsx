import React, { useState } from 'react';
import CameraEvidence from './CameraEvidence';

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

const WeeklyCleaning = ({ user, cleaningTasks, onSaveCleaning }) => {
  const today = new Date();
  const currentDay = today.getDate();
  const monthWeeks = getWeeksForMonth(today);
  const currentWeekObj = monthWeeks.find(w => w.days.includes(currentDay)) || monthWeeks[0];

  const [selectedWeekId, setSelectedWeekId] = useState(currentWeekObj.id);

  const weeklyTasks = cleaningTasks.filter(t => t.frecuencia === 'SEMANAL').filter(t => !t.role || t.role === user.role);

  const selectedWeek = monthWeeks.find(w => w.id === selectedWeekId) || currentWeekObj;
  
  const completedCountWeek = weeklyTasks.filter(t => t.completedDays[selectedWeekId]).length;
  const totalCountWeek = weeklyTasks.length;
  const weekProgress = totalCountWeek > 0 ? (completedCountWeek / totalCountWeek) * 100 : 0;

  const isFutureWeek = currentDay < selectedWeek.startDay;
  const isPastWeek = currentDay > selectedWeek.endDay;
  const isCurrentWeek = currentDay >= selectedWeek.startDay && currentDay <= selectedWeek.endDay;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Info */}
      <div>
        <h3 style={{ margin: 0, color: 'var(--secondary)' }}>Cronograma de Limpieza Semanal</h3>
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
          Registro de tareas de limpieza profunda programadas por semana para el mes en curso.
        </p>
      </div>

      {/* Week Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '5px 0' }}>
        {monthWeeks.map((week) => {
          const isWeekFuture = currentDay < week.startDay;
          const isWeekCurrent = currentDay >= week.startDay && currentDay <= week.endDay;
          const isSelected = selectedWeekId === week.id;
          
          const completedCount = weeklyTasks.filter(t => t.completedDays[week.id]).length;
          const progress = totalCountWeek > 0 ? (completedCount / totalCountWeek) * 100 : 0;
          
          let badgeText = '';
          let badgeColor = '';
          
          if (isWeekFuture) {
            badgeText = '🔒 Bloqueada';
            badgeColor = 'var(--text-muted)';
          } else if (isWeekCurrent) {
            badgeText = `⚡ Activa (${progress.toFixed(0)}%)`;
            badgeColor = '#7c3aed';
          } else if (progress === 100) {
            badgeText = '✅ 100%';
            badgeColor = 'var(--success)';
          } else {
            badgeText = `❌ ${progress.toFixed(0)}% incompleto`;
            badgeColor = 'var(--error)';
          }
          
          return (
            <button
              key={week.id}
              onClick={() => setSelectedWeekId(week.id)}
              className="btn"
              style={{
                flex: '1 1 120px',
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
                gap: '4px',
                backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-main)',
                color: isSelected ? '#fff' : 'var(--text-main)',
              }}
            >
              <span>{week.label}</span>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                {week.startDay} al {week.endDay}
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

      {/* Week Progress Status Banner */}
      {(() => {
        if (isFutureWeek) {
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
        if (isCurrentWeek) {
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
              <span>⚡ <strong>Registro Habilitado:</strong> Puedes completar las tareas de limpieza profunda semanal durante toda esta semana. Recuerda subir una foto como evidencia para cada tarea.</span>
            </div>
          );
        }
        if (isPastWeek) {
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

      {/* Weekly Checklist Tasks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {weeklyTasks.map((task) => {
          const isCompleted = !!task.completedDays[selectedWeekId];
          const evidenceUrl = task.evidenciaDays ? task.evidenciaDays[selectedWeekId] : null;
          const hasEvidence = !!evidenceUrl;
          const isLocked = isFutureWeek || isPastWeek;
          
          return (
            <div
              key={task.id}
              onClick={() => {
                if (isLocked) return;
                if (!hasEvidence) {
                  document.getElementById(`weekly-camera-input-${task.id}`).click();
                } else {
                  onSaveCleaning(task.id, selectedWeekId, !isCompleted, evidenceUrl);
                }
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: isCompleted ? '1px solid var(--success)' : '1px solid var(--border)',
                backgroundColor: isCompleted 
                  ? 'var(--success-light)' 
                  : isLocked 
                    ? '#fafafa' 
                    : 'var(--bg-card)',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                opacity: isLocked ? 0.75 : 1,
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Checkbox */}
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: isCompleted ? 'none' : '2px solid var(--border)',
                  backgroundColor: isCompleted ? 'var(--success)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  flexShrink: 0,
                }}>
                  {isCompleted ? '✓' : ''}
                </div>

                {/* Description */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: isLocked ? 'var(--text-muted)' : 'var(--text-main)', textAlign: 'left' }}>
                    {task.descripcion}
                  </span>
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
                    whiteSpace: 'nowrap'
                  }}>
                    {hasEvidence ? 'EVIDENCIA CARGADA ✓' : 'FOTO EVIDENCIA REQUERIDA'}
                  </span>
                </div>
              </div>

              {/* Weekly camera capture */}
              {!isLocked && (
                <div style={{ marginLeft: '32px' }}>
                  <CameraEvidence
                    id={`weekly-${task.id}`}
                    evidence={evidenceUrl}
                    onCapture={(compressedBase64) => onSaveCleaning(task.id, selectedWeekId, true, compressedBase64)}
                    onRemove={() => onSaveCleaning(task.id, selectedWeekId, false, null)}
                    label="📸 Abrir Cámara para Evidencia"
                    successLabel="Foto tomada con éxito"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyCleaning;
