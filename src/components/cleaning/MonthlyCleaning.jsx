import React, { useState } from 'react';
import CameraEvidence from './CameraEvidence';

const MonthlyCleaning = ({ user, cleaningTasks, onSaveCleaning }) => {
  const today = new Date();
  const currentDay = today.getDate();

  // Area filter state, default based on user role
  const getUserDefaultArea = (role) => {
    if (role === 'Cocina') return 'COCINA';
    if (role === 'Barista') return 'BARRA';
    if (role === 'Servicio') return 'SALON';
    return 'TODAS';
  };

  const [selectedArea, setSelectedArea] = useState(getUserDefaultArea(user?.role));

  const allMonthlyTasks = cleaningTasks.filter(t => t.frecuencia === 'MENSUAL');
  const filteredTasks = allMonthlyTasks.filter(t => {
    if (selectedArea === 'TODAS') return true;
    return t.area === selectedArea || t.role === (selectedArea === 'COCINA' ? 'Cocina' : selectedArea === 'BARRA' ? 'Barista' : 'Servicio');
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <h3 style={{ margin: 0, color: 'var(--secondary)' }}>Control de Limpieza Mensual</h3>
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
          Registro de tareas de mantenimiento y desinfección mensual profunda por área operativa (Barra, Cocina y Salón).
        </p>
      </div>

      {/* Area Filter Selector Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'TODAS', label: '🌐 TODAS LAS ÁREAS' },
          { id: 'BARRA', label: '☕ BARRA' },
          { id: 'COCINA', label: '🍳 COCINA' },
          { id: 'SALON', label: '💁 SALÓN' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedArea(tab.id)}
            className="btn"
            style={{
              padding: '6px 14px',
              fontSize: '11px',
              fontWeight: 700,
              borderRadius: '20px',
              backgroundColor: selectedArea === tab.id ? 'var(--primary)' : 'var(--bg-main)',
              color: selectedArea === tab.id ? '#fff' : 'var(--text-main)',
              border: selectedArea === tab.id ? 'none' : '1px solid var(--border)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Monthly Active Banner */}
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
        <span>⚡ <strong>Registro de Limpieza Mensual Habilitado:</strong> Registra la limpieza profunda mensual de tu área y adjunta una o varias fotos como evidencia.</span>
      </div>

      {/* Checklist for Monthly Tasks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredTasks.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
            No hay tareas de limpieza mensual configuradas para esta área.
          </p>
        ) : (
          filteredTasks.map((task) => {
            const isCompletedInW5 = !!task.completedDays['W5'];
            const evidenceUrl = task.evidenciaDays ? task.evidenciaDays['W5'] : null;
            const observationText = task.observacionesDays ? task.observacionesDays['W5'] : '';
            const hasEvidence = !!evidenceUrl;

            return (
              <div
                key={task.id}
                onClick={() => {
                  if (!isCompletedInW5 && !hasEvidence) {
                    document.getElementById(`camera-input-monthly-${task.id}`)?.click();
                  } else {
                    onSaveCleaning(task.id, 'W5', !isCompletedInW5, evidenceUrl, observationText);
                  }
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  border: isCompletedInW5 ? '1px solid var(--success)' : '1px solid var(--border)',
                  backgroundColor: isCompletedInW5 ? 'var(--success-light)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Checkbox */}
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
                    <span style={{ fontSize: '13px', color: 'var(--text-main)', textAlign: 'left' }}>
                      {task.descripcion}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      backgroundColor: 'var(--bg-main)',
                      color: 'var(--text-muted)',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      border: '1px solid var(--border)'
                    }}>
                      MENSUAL
                    </span>
                  </div>
                </div>

                {/* Monthly camera capture & observation input */}
                <div style={{ marginLeft: '32px' }}>
                  <CameraEvidence
                    id={`monthly-${task.id}`}
                    evidence={evidenceUrl}
                    observation={observationText}
                    onCapture={(newEvidences) => onSaveCleaning(task.id, 'W5', true, newEvidences, observationText)}
                    onRemove={() => onSaveCleaning(task.id, 'W5', false, null, null)}
                    onObservationChange={(text) => onSaveCleaning(task.id, 'W5', isCompletedInW5, evidenceUrl, text)}
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

export default MonthlyCleaning;
