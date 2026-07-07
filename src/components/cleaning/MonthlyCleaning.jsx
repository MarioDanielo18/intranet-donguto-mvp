import React from 'react';

const MonthlyCleaning = ({ cleaningTasks, onSaveCleaning }) => {
  const today = new Date();
  const currentDay = today.getDate();
  
  // Custom monthly lock variables matching Don Guto's operational rules for June/July 2026
  const isPastMonth = today.getMonth() > 5 || today.getFullYear() > 2026 || (today.getMonth() === 5 && currentDay > 30);
  const isFutureW5 = currentDay < 29;
  const isW5 = today.getMonth() === 5 && currentDay >= 29 && currentDay <= 30;

  const monthlyTasks = cleaningTasks.filter(t => t.frecuencia === 'MENSUAL');

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
                <span style={{ fontSize: '13px', color: isLocked ? 'var(--text-muted)' : 'var(--text-main)', textAlign: 'left' }}>
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

export default MonthlyCleaning;
