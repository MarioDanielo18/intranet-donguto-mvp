import React, { useState } from 'react';

export default function IncidentDetailStandalone({
  user,
  incidentId,
  incidents = [],
  onRespondIncident,
  onUpdateIncidentStatus,
  theme,
  setTheme,
  onClose
}) {
  const inc = (incidents || []).find(i => i.id === incidentId);
  const isStoreAdmin = user.role === 'Administrador';

  // State for response draft, preloaded with any existing response for the role
  const [responseText, setResponseText] = useState(() => {
    if (!inc) return '';
    return isStoreAdmin ? (inc.adminResponse || '') : (inc.supervisorResponse || '');
  });

  const [successMsg, setSuccessMsg] = useState('');

  if (!inc) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-main)',
        color: 'var(--text-main)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        padding: '20px',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div className="card text-center" style={{ padding: '40px', maxWidth: '400px', border: '1px solid var(--border)' }}>
          <h2 style={{ color: 'var(--error)', margin: '0 0 10px 0' }}>⚠️ Ticket No Encontrado</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.5 }}>
            La incidencia con ID <strong>{incidentId}</strong> no existe o ha sido eliminada del sistema.
          </p>
          <button
            onClick={() => onClose()}
            className="btn btn-primary"
            style={{ marginTop: '20px', width: '100%' }}
          >
            Cerrar Detalle ✖
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(inc.date).toLocaleString('es-PE', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

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

  const handleSaveResponse = () => {
    if (!responseText.trim()) {
      alert('Por favor, escribe una respuesta antes de guardar.');
      return;
    }
    onRespondIncident(inc.id, responseText.trim(), user.role);
    setSuccessMsg('¡Respuesta registrada con éxito en el sistema!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleResolve = () => {
    if (responseText.trim()) {
      onRespondIncident(inc.id, responseText.trim(), user.role);
    }
    onUpdateIncidentStatus(inc.id, 'Resuelto', `${user.name} (${user.role})`);
    setSuccessMsg('¡Incidencia marcada como RESUELTA!');
    setTimeout(() => {
      setSuccessMsg('');
    }, 2000);
  };

  const handleEscalate = () => {
    if (responseText.trim()) {
      onRespondIncident(inc.id, responseText.trim(), user.role);
    }
    onUpdateIncidentStatus(inc.id, 'Escalado');
    setSuccessMsg('¡Incidencia escalada a Supervisión con éxito!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-main)',
      color: 'var(--text-main)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Header bar */}
      <header className="incident-header glass" style={{
        borderBottom: '1px solid var(--border)',
        padding: '15px 30px',
        backgroundColor: 'var(--bg-card)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>☕</span>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>
              DON GUTO
            </h1>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.5px' }}>
              PANEL DE DETALLE DE TICKET
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Theme selector */}
          <button
            onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '11px' }}
          >
            {theme === 'light' ? '🌙 Oscuro' : '☀️ Claro'}
          </button>

          {/* User info */}
          <div style={{ textAlign: 'right', fontSize: '12px' }}>
            <strong style={{ color: 'var(--text-main)', display: 'block' }}>{user.name}</strong>
            <span style={{ color: 'var(--text-muted)' }}>
              {user.role} {user.store !== 'Todas' && `| ${user.store}`}
            </span>
          </div>

          {/* Close tab button */}
          <button
            onClick={() => onClose()}
            className="btn"
            style={{
              padding: '8px 16px',
              fontSize: '12.5px',
              backgroundColor: 'var(--error-light)',
              color: 'var(--error)',
              border: '1px solid var(--error)',
              fontWeight: 700,
              cursor: 'pointer',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ✖ Cerrar Detalle
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        flex: 1,
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '30px 20px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {successMsg && (
          <div className="animate-fade-in" style={{
            backgroundColor: 'var(--success-light)',
            color: 'var(--success)',
            padding: '12px 15px',
            borderRadius: '6px',
            border: '1px solid var(--success)',
            fontSize: '13px',
            fontWeight: 'bold',
          }}>
            {successMsg}
          </div>
        )}

        {/* Title and stats bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '15px',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '15px'
        }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.5px' }}>
              INCIDENCIA REGISTRADA • {inc.id}
            </span>
            <h2 style={{ margin: '4px 0 0 0', color: 'var(--text-main)', fontSize: '24px', fontWeight: 800 }}>
              {inc.title}
            </h2>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 700, backgroundColor: 'rgba(0,0,0,0.04)', padding: '5px 12px', borderRadius: '4px', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
              📍 Sede: {inc.store}
            </span>
            <span style={{ fontSize: '12.5px', fontWeight: 700, backgroundColor: 'rgba(0,0,0,0.04)', padding: '5px 12px', borderRadius: '4px', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
              🛠️ Categoría: {inc.type}
            </span>
            {inc.urgency === 'Urgente' && (
              <span style={{ backgroundColor: 'var(--error-light)', color: 'var(--error)', padding: '5px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 800, border: '1px solid var(--error)' }}>
                🚨 URGENTE
              </span>
            )}
            <span style={{
              padding: '5px 14px',
              borderRadius: '12px',
              backgroundColor: statusBg,
              color: statusColor,
              fontWeight: 800,
              fontSize: '11px',
              border: '1px solid currentColor',
              textTransform: 'uppercase'
            }}>
              {inc.status}
            </span>
          </div>
        </div>

        {/* 2-Column details container */}
        <div className="mobile-stack" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '25px',
          alignItems: 'start',
          marginTop: '10px'
        }}>
          {/* Left Column: Information */}
          <div className="card" style={{
            padding: '25px',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            backgroundColor: 'var(--bg-card)'
          }}>
            <div>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                📝 Descripción de la Incidencia
              </h4>
              <div style={{
                backgroundColor: 'var(--bg-main)',
                padding: '20px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                fontSize: '14.5px',
                color: 'var(--text-main)',
                lineHeight: '1.6',
                whiteSpace: 'pre-line'
              }}>
                {inc.description}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                👤 Datos del Reporte
              </h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--text-muted)', fontWeight: 600, width: '40%' }}>Reportado por:</td>
                    <td style={{ padding: '8px 0', color: 'var(--text-main)', fontWeight: 700 }}>{inc.reporterName} ({inc.reporterRole})</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--text-muted)', fontWeight: 600 }}>Correo Electrónico:</td>
                    <td style={{ padding: '8px 0', color: 'var(--text-main)' }}>{inc.reporterEmail}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--text-muted)', fontWeight: 600 }}>Fecha de Reporte:</td>
                    <td style={{ padding: '8px 0', color: 'var(--text-main)' }}>{formattedDate}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 0', color: 'var(--text-muted)', fontWeight: 600 }}>Sede / Local:</td>
                    <td style={{ padding: '8px 0', color: 'var(--text-main)', fontWeight: 700 }}>📍 Sede {inc.store}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Display registered responses in detail card */}
            {(inc.adminResponse || inc.supervisorResponse) && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  💬 Respuestas Registradas
                </h4>

                {inc.adminResponse && (
                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '12px 15px', borderRadius: '6px', borderLeft: '3px solid var(--secondary)', borderTop: '1px solid var(--border)', borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--secondary)', display: 'block', marginBottom: '4px' }}>
                      ADMINISTRADOR DE TIENDA:
                    </span>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.4 }}>
                      {inc.adminResponse}
                    </p>
                    {inc.adminResponseAt && (
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textAlign: 'right', marginTop: '5px' }}>
                        {new Date(inc.adminResponseAt).toLocaleString('es-PE')}
                      </span>
                    )}
                  </div>
                )}

                {inc.supervisorResponse && (
                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '12px 15px', borderRadius: '6px', borderLeft: '3px solid var(--primary)', borderTop: '1px solid var(--border)', borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>
                      SUPERVISIÓN GENERAL:
                    </span>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.4 }}>
                      {inc.supervisorResponse}
                    </p>
                    {inc.supervisorResponseAt && (
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textAlign: 'right', marginTop: '5px' }}>
                        {new Date(inc.supervisorResponseAt).toLocaleString('es-PE')}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Management panel */}
          <div className="card" style={{
            padding: '25px',
            border: `1px solid ${statusBorder}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            backgroundColor: 'var(--bg-card)'
          }}>
            <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              ⚙️ Gestión y Resolución del Ticket
            </h4>

            {inc.status === 'Resuelto' ? (
              <div style={{
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid var(--success)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <span style={{ fontSize: '24px' }}>✓</span>
                <strong style={{ fontSize: '15px' }}>ESTE TICKET ESTÁ RESUELTO</strong>
                <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.4 }}>
                  Resuelto por <strong>{inc.resolvedBy}</strong> el {new Date(inc.resolvedAt).toLocaleDateString('es-PE')} a las {new Date(inc.resolvedAt).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}.
                </p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>
                    ✍️ Escribir Respuesta / Seguimiento operativo:
                  </label>
                  <textarea
                    className="input"
                    rows="6"
                    placeholder={
                      isStoreAdmin
                        ? "Escribe la respuesta o plan de acción de la tienda..."
                        : "Escribe la directiva, indicación o respuesta de supervisión..."
                    }
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    style={{
                      resize: 'vertical',
                      minHeight: '120px',
                      fontSize: '13.5px',
                      fontFamily: 'inherit',
                      padding: '12px',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg-main)',
                      color: 'var(--text-main)'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                  {/* Guardar Respuesta */}
                  <button
                    onClick={handleSaveResponse}
                    className="btn btn-secondary"
                    style={{
                      padding: '12px 18px',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: 700,
                      width: '100%'
                    }}
                  >
                    💾 Guardar Respuesta
                  </button>

                  {/* Escalar (Only for admin and if status is not already escalated) */}
                  {isStoreAdmin && inc.status !== 'Escalado' && (
                    <button
                      onClick={handleEscalate}
                      className="btn"
                      style={{
                        padding: '12px 18px',
                        fontSize: '13px',
                        backgroundColor: '#fffbeb',
                        color: '#d97706',
                        border: '1px solid #fcd34d',
                        fontWeight: 700,
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        width: '100%'
                      }}
                    >
                      🚨 Escalar a Supervisor
                    </button>
                  )}

                  {/* Resolver */}
                  <button
                    onClick={handleResolve}
                    className="btn btn-primary"
                    style={{
                      padding: '12px 18px',
                      fontSize: '13px',
                      backgroundColor: 'var(--success)',
                      borderColor: 'var(--success)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: 700,
                      width: '100%'
                    }}
                  >
                    ✓ Marcar como Resuelto
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
