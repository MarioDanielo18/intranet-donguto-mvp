import React, { useState } from 'react';
import CameraEvidence from './CameraEvidence';

const DailyChecklist = ({ user, checklists, onSaveTask }) => {
  const [shiftType, setShiftType] = useState('APERTURA');

  const getAreaName = (role) => {
    if (role === 'Barista') return 'BARRA';
    if (role === 'Cocina') return 'COCINA';
    return 'SALON';
  };

  const area = getAreaName(user.role);

  const activeChecklist = checklists.filter(
    t => t.area === area && t.tipo_turno === shiftType
  );

  const totalTasks = activeChecklist.length;
  const completedTasks = activeChecklist.filter(t => t.completado).length;
  const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Shift Selector Tabs */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {['APERTURA', 'RELEVO', 'CIERRE'].map((type) => (
          <button
            key={type}
            onClick={() => setShiftType(type)}
            className="btn"
            style={{
              flex: 1,
              padding: '10px',
              fontWeight: 700,
              fontSize: '12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: shiftType === type ? 'var(--primary)' : 'var(--bg-main)',
              color: shiftType === type ? '#fff' : 'var(--text-main)',
              border: shiftType === type ? 'none' : '1px solid var(--border)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Progress Bar Card */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>Avance del Turno</strong>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--primary)' }}>
            {progressPercent.toFixed(0)}%
          </span>
        </div>
        <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: progressPercent === 100 ? 'var(--success)' : 'var(--primary)',
              transition: 'width 0.4s ease-out',
            }}
          />
        </div>
        <div style={{ marginTop: '8px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
          {completedTasks} de {totalTasks} tareas completadas
        </div>
      </div>

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} className="animate-fade-in">
        {totalTasks === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay tareas configuradas para esta sección.</p>
        ) : (
          activeChecklist.map((task) => {
            const hasEvidence = !!task.evidencia;
            return (
              <div
                key={task.id}
                onClick={() => {
                  if (!task.completado && task.requiere_foto && !hasEvidence) {
                    document.getElementById(`camera-input-${task.id}`)?.click();
                  } else {
                    onSaveTask(task.id, !task.completado, task.evidencia, task.observaciones);
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
                  {/* Checkbox */}
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
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-main)', textAlign: 'left' }}>
                      {task.descripcion}
                    </span>
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
                        whiteSpace: 'nowrap'
                      }}>
                        {hasEvidence ? 'EVIDENCIA CARGADA ✓' : 'FOTO EVIDENCIA REQUERIDA'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Device Camera Capture & Observation Input */}
                <div style={{ marginLeft: '32px' }}>
                  <CameraEvidence
                    id={task.id}
                    evidence={task.evidencia}
                    observation={task.observaciones || ''}
                    onCapture={(newEvidences) => onSaveTask(task.id, true, newEvidences, task.observaciones)}
                    onRemove={() => onSaveTask(task.id, false, null, null)}
                    onObservationChange={(text) => onSaveTask(task.id, task.completado, task.evidencia, text)}
                    label="📸 Tomar / Añadir Foto"
                    successLabel="Fotos tomadas con éxito"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DailyChecklist;
