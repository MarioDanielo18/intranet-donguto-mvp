import React, { useState } from 'react';

export const AttendanceLogs = ({ arrivalLogs }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

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
            <th style={{ padding: '8px 10px' }}>Entrada Programada</th>
            <th style={{ padding: '8px 10px' }}>Hora de Entrada</th>
            <th style={{ padding: '8px 10px' }}>Hora de Salida</th>
            <th style={{ padding: '8px 10px' }}>Retraso</th>
            <th style={{ padding: '8px 10px', textAlign: 'center' }}>Total Marcajes</th>
            <th style={{ padding: '8px 10px' }}>Estado</th>
            <th style={{ padding: '8px 10px', textAlign: 'center' }}>Foto Uniforme</th>
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
                <td style={{ padding: '10px 10px' }}>{log.checkOutTime || '--'}</td>
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
                <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                  {log.photoUrl ? (
                    <button
                      onClick={() => setSelectedPhoto(log)}
                      className="btn btn-secondary"
                      style={{
                        padding: '3px 8px',
                        fontSize: '11px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        borderRadius: '4px',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        border: '1px solid var(--primary)'
                      }}
                    >
                      📸 Ver Foto
                    </button>
                  ) : (
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>--</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal Visor de Foto con Timestamp */}
      {selectedPhoto && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '15px'
        }}>
          <div className="card" style={{
            maxWidth: '450px',
            width: '100%',
            backgroundColor: 'var(--bg-main)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--primary)' }}>
                📸 Foto de Uniforme y Vestimenta
              </h4>
              <button
                onClick={() => setSelectedPhoto(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <img
                src={selectedPhoto.photoUrl}
                alt="Foto de uniforme"
                style={{ width: '100%', height: 'auto', maxHeight: '350px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                backgroundColor: 'rgba(0,0,0,0.75)',
                color: '#fff',
                padding: '10px',
                fontSize: '11px',
                display: 'flex',
                flexDirection: 'column',
                gap: '3px'
              }}>
                <span style={{ fontWeight: 800, color: '#4ade80' }}>🟢 VERIFICACIÓN DE UNIFORME Y REGISTRO EN VIVO</span>
                <span>📅 Fecha: <strong>{selectedPhoto.date}</strong> | 🕒 Hora Entrada: <strong>{selectedPhoto.time}</strong></span>
                <span>📍 Sede: <strong>{selectedPhoto.store || 'Basadre - San Isidro'}</strong></span>
              </div>
            </div>

            <button
              onClick={() => setSelectedPhoto(null)}
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px' }}
            >
              Cerrar Visor
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceLogs;
