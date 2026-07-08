import React, { useState } from 'react';

/**
 * Helper function to sanitize user inputs and prevent HTML/XSS injection.
 */
const sanitizeInput = (text) => {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const IncidentForm = ({ user, onAddIncident, onSubmitSuccess }) => {
  const [incTitle, setIncTitle] = useState('');
  const [incType, setIncType] = useState('Mantenimiento');
  const [incUrgency, setIncUrgency] = useState('Normal');
  const [incDesc, setIncDesc] = useState('');

  const handleIncidentSubmit = (e) => {
    e.preventDefault();
    if (!incTitle.trim() || !incDesc.trim()) return;

    // Apply security sanitization to user inputs
    const sanitizedTitle = sanitizeInput(incTitle.trim());
    const sanitizedDesc = sanitizeInput(incDesc.trim());

    const newInc = {
      id: `INC-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString(),
      reporterUsername: user.username,
      reporterName: user.name,
      reporterRole: user.role,
      store: user.store,
      type: incType,
      title: sanitizedTitle,
      description: sanitizedDesc,
      urgency: incUrgency,
      status: 'Pendiente',
      adminResponse: '',
      adminResponseAt: '',
      supervisorResponse: '',
      supervisorResponseAt: '',
      resolvedBy: '',
      resolvedAt: ''
    };

    onAddIncident(newInc);
    setIncTitle('');
    setIncDesc('');
    
    if (onSubmitSuccess) {
      onSubmitSuccess();
    }
  };

  return (
    <form 
      onSubmit={handleIncidentSubmit} 
      className="card" 
      style={{ 
        padding: '20px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '15px', 
        border: '1px solid var(--border)', 
        maxWidth: '650px', 
        margin: '0 auto',
        backgroundColor: 'var(--bg-card)' 
      }}
    >
      <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        📝 Formulario de Registro de Incidencia
      </h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Título de Incidencia:</label>
          <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 600 }}>Formato estándar: [ÁREA] - [Problema]</span>
        </div>
        <input
          type="text"
          required
          className="input"
          placeholder="Ej: [BARRA] - Fuga de agua en manguera de vapor"
          value={incTitle}
          onChange={(e) => setIncTitle(e.target.value)}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Categoría:</label>
          <select
            className="input"
            value={incType}
            onChange={(e) => setIncType(e.target.value)}
            style={{ padding: '9px 12px' }}
          >
            <option value="Mantenimiento">🛠️ Mantenimiento</option>
            <option value="Insumos">📦 Insumos / Stock 86</option>
            <option value="Operaciones">📋 Operaciones</option>
            <option value="Otros">❓ Otros / Dudas</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Urgencia:</label>
          <select
            className="input"
            value={incUrgency}
            onChange={(e) => setIncUrgency(e.target.value)}
            style={{ padding: '9px 12px' }}
          >
            <option value="Normal">⚠️ Normal</option>
            <option value="Urgente">🚨 Urgente</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Descripción Detallada:</label>
        <textarea
          required
          className="input"
          rows="4"
          placeholder="Describe qué ocurrió, en qué estación y cuál es el impacto (ej: no podemos preparar jugos frozen, afecta el servicio)..."
          value={incDesc}
          onChange={(e) => setIncDesc(e.target.value)}
          style={{ resize: 'vertical', minHeight: '80px', fontFamily: 'inherit' }}
        />
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px', marginTop: '5px', cursor: 'pointer' }}>
        🚀 Enviar Reporte a Administración
      </button>
    </form>
  );
};

export default IncidentForm;
