import React from 'react';

export const IncidentList = ({ list, noDataMsg }) => {
  if (list.length === 0) {
    return (
      <div 
        style={{ 
          padding: '30px', 
          textAlign: 'center', 
          color: 'var(--text-muted)', 
          backgroundColor: 'var(--bg-main)', 
          border: '1px dashed var(--border)', 
          borderRadius: '8px' 
        }}
      >
        {noDataMsg}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '550px', overflowY: 'auto', paddingRight: '5px' }}>
      {list.map(inc => {
        let statusBg = 'var(--bg-main)';
        let statusColor = 'var(--text-muted)';
        
        if (inc.status === 'Pendiente') {
          statusBg = 'var(--warning-light)';
          statusColor = 'var(--warning)';
        } else if (inc.status === 'En Proceso') {
          statusBg = 'var(--primary-light)';
          statusColor = 'var(--primary)';
        } else if (inc.status === 'Escalado') {
          statusBg = 'var(--warning-light)';
          statusColor = '#d97706';
        } else if (inc.status === 'Resuelto') {
          statusBg = 'var(--success-light)';
          statusColor = 'var(--success)';
        }

        const formattedDate = new Date(inc.date).toLocaleString('es-PE', {
          day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
        });

        return (
          <div
            key={inc.id}
            className="card"
            style={{
              padding: '16px',
              border: `1px solid ${inc.status === 'Resuelto' ? 'var(--success)' : 'var(--border)'}`,
              backgroundColor: inc.status === 'Resuelto' ? 'var(--success-light)' : 'var(--bg-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '12.5px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '5px' }}>
              <div>
                <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '11px', display: 'block' }}>{inc.id} • {inc.type.toUpperCase()}</span>
                <strong style={{ fontSize: '13px', color: 'var(--text-main)', display: 'block', marginTop: '2px' }}>{inc.title}</strong>
              </div>
              
              <div style={{ display: 'flex', gap: '5px' }}>
                {inc.urgency === 'Urgente' && (
                  <span style={{ backgroundColor: 'var(--error-light)', color: 'var(--error)', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 800, border: '1px solid var(--error)' }}>🚨 URGENTE</span>
                )}
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '10px',
                  backgroundColor: statusBg,
                  color: statusColor,
                  fontWeight: 800,
                  fontSize: '9px',
                  border: '1px solid currentColor',
                  textTransform: 'uppercase'
                }}>
                  {inc.status}
                </span>
              </div>
            </div>

            <p style={{ margin: 0, color: 'var(--text-main)', lineHeight: 1.4, fontSize: '12px', backgroundColor: 'rgba(0,0,0,0.02)', padding: '8px 10px', borderRadius: '4px' }}>
              {inc.description}
            </p>

            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Por: <strong>{inc.reporterName} ({inc.reporterRole})</strong></span>
              <span>{formattedDate}</span>
            </div>

            {(inc.adminResponse || inc.supervisorResponse || inc.status === 'Resuelto') && (
              <div style={{
                borderTop: '1px dashed var(--border)',
                paddingTop: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                backgroundColor: 'rgba(0,0,0,0.01)',
                padding: '10px',
                borderRadius: '6px'
              }}>
                {inc.adminResponse ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <span style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '11px' }}>💬 Respuesta del Administrador (Sede):</span>
                    <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-main)', lineHeight: 1.4 }}>
                      {inc.adminResponse}
                    </p>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)', textAlign: 'right' }}>
                      {new Date(inc.adminResponseAt).toLocaleString('es-PE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ) : (
                  inc.status !== 'Resuelto' && (
                    <div style={{ fontSize: '11px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                      ⏳ Esperando respuesta del Administrador de tienda...
                    </div>
                  )
                )}

                {inc.supervisorResponse && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', borderTop: inc.adminResponse ? '1px dotted var(--border)' : 'none', paddingTop: inc.adminResponse ? '8px' : 0 }}>
                    <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '11px' }}>👤 Respuesta de Supervisión (General):</span>
                    <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-main)', lineHeight: 1.4 }}>
                      {inc.supervisorResponse}
                    </p>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)', textAlign: 'right' }}>
                      {new Date(inc.supervisorResponseAt).toLocaleString('es-PE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}

                {inc.status === 'Resuelto' && (
                  <div style={{
                    marginTop: '5px',
                    padding: '6px 8px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--success-light)',
                    color: 'var(--success)',
                    fontWeight: 700,
                    fontSize: '11px',
                    textAlign: 'center',
                    border: '1px solid var(--success)'
                  }}>
                    ✓ Resuelto por {inc.resolvedBy} el {new Date(inc.resolvedAt).toLocaleDateString('es-PE')}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default IncidentList;
