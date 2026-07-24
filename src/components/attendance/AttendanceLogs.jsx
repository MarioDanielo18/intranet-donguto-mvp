import React from 'react';

export const AttendanceLogs = ({ arrivalLogs }) => {
  if (!arrivalLogs || arrivalLogs.length === 0) {
    return (
      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
        No tienes marcaciones de asistencia registradas.
      </p>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
            <th style={{ padding: '8px 10px' }}>Fecha</th>
            <th style={{ padding: '8px 10px' }}>Hora Esperada</th>
            <th style={{ padding: '8px 10px' }}>Hora de Marcaje</th>
            <th style={{ padding: '8px 10px' }}>Retraso</th>
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
                <td style={{ padding: '10px 10px', color: 'var(--text-muted)' }}>{log.expectedTime}</td>
                <td style={{ padding: '10px 10px', fontWeight: 600 }}>{log.time}</td>
                <td style={{ padding: '10px 10px', fontWeight: 700, color: log.delayMin > 0 ? 'var(--error)' : 'var(--success)' }}>
                  {log.delayMin > 0 
                    ? (log.delayMin >= 60 
                        ? `+${Math.floor(log.delayMin / 60)} hr ${log.delayMin % 60} min` 
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
  );
};

export default AttendanceLogs;
