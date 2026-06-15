import React, { useState, useRef, useEffect } from 'react';

const SignatureCanvas = ({ label, onSave }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#8b1a1a'; // Don Guto primary brand color
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onSave(canvas.toDataURL());
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onSave(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: '1 1 200px', minWidth: '220px' }}>
      <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>{label}</label>
      <div style={{ position: 'relative', border: '2px dashed var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', backgroundColor: 'var(--bg-main)' }}>
        <canvas
          ref={canvasRef}
          width={300}
          height={100}
          style={{ display: 'block', width: '100%', height: '100px', cursor: 'crosshair', touchAction: 'none' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            clear();
          }}
          className="btn"
          style={{
            position: 'absolute',
            bottom: '4px',
            right: '4px',
            padding: '2px 6px',
            fontSize: '9px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};


const AUDIT_CATEGORIES = [
  {
    name: 'PRECISIÓN',
    weight: 25,
    key: 'precision',
    prefix: 'P',
    criteria: [
      { id: 'P1', text: 'Todos los productos del menú están disponibles y activos.' },
      { id: 'P2', text: 'La presentación es correcta en el emplatado o taza.', requiere_foto: true },
      { id: 'P3', text: 'El cajero es preciso (cuadre de caja correcto, cobros correctos).' },
      { id: 'P4', text: 'Los tiempos de servicio cumplen con el estándar.' },
      { id: 'P5', text: 'Los sistemas de velocidad de servicio están establecidos y activos.' },
    ],
  },
  {
    name: 'CALIDAD',
    weight: 20,
    key: 'calidad',
    prefix: 'C',
    criteria: [
      { id: 'C1', text: 'Los alimentos están completamente cocinados y a temperatura.' },
      { id: 'C2', text: 'Se mantienen las temperaturas de frío y calor estándar.', requiere_foto: true },
      { id: 'C3', text: 'No cuentan con productos vencidos o sin rotulado.' },
      { id: 'C4', text: 'Preparación y frescura correcta de materias primas.' },
      { id: 'C5', text: 'Retención y vida útil de ingredientes establecida.' },
    ],
  },
  {
    name: 'LIMPIEZA',
    weight: 15,
    key: 'limpieza',
    prefix: 'L',
    criteria: [
      { id: 'L1', text: 'La propiedad exterior e ingresos de tienda están limpios.' },
      { id: 'L2', text: 'El área de servicio/salón está limpia y ordenada.' },
      { id: 'L3', text: 'Los servicios higiénicos se limpian y abastecen constantemente.', requiere_foto: true },
      { id: 'L4', text: 'El back of store y los equipos operativos están limpios.' },
      { id: 'L5', text: 'El sistema y cronograma de limpieza mensual está establecido y activo.' },
    ],
  },
  {
    name: 'INVENTARIO',
    weight: 10,
    key: 'inventario',
    prefix: 'I',
    criteria: [
      { id: 'I1', text: 'Se corrobora una muestra de solo 10 productos y están correctamente subidos al sistema de restaurante.pe.' },
      { id: 'I2', text: 'Verificar que el inventario físico esté alineado con el inventario en el sistema.', requiere_foto: true },
    ],
  },
  {
    name: 'HOSPITALIDAD',
    weight: 10,
    key: 'hospitalidad',
    prefix: 'H',
    criteria: [
      { id: 'H1', text: 'Bienvenida y recepción del cliente cálida y con sonrisa.' },
      { id: 'H2', text: 'Atención y servicio personalizado de acuerdo al cliente.' },
      { id: 'H3', text: 'Tiempo de respuesta y eficiencia al tomar el pedido.' },
      { id: 'H4', text: 'Actitud, comportamiento y presentación impecable del personal.' },
      { id: 'H5', text: 'Cumple con los 8 pasos del protocolo de servicio (OPS-01).' },
    ],
  },
  {
    name: 'MANTENIMIENTO',
    weight: 10,
    key: 'mantenimiento',
    prefix: 'M',
    criteria: [
      { id: 'M1', text: 'Se da mantenimiento y están en buen estado techos, pisos, paredes.' },
      { id: 'M2', text: 'Los equipos operativos están en buen estado de conservación.', requiere_foto: true },
      { id: 'M3', text: 'El material publicitario (POP) actual y ayudas de venta están en buen estado.' },
      { id: 'M4', text: 'Se realiza el mantenimiento preventivo programado.' },
      { id: 'M5', text: 'Se realiza el envío y seguimiento de pendientes de mantenimiento.' },
    ],
  },
  {
    name: 'ENTRENAMIENTO',
    weight: 10,
    key: 'entrenamiento',
    prefix: 'E',
    criteria: [
      { id: 'E1', text: 'Se cuenta con el plan de entrenamiento para cada puesto.' },
      { id: 'E2', text: 'Se tienen las Validaciones de Competencia (VC) actualizadas.' },
      { id: 'E3', text: 'El personal tiene acceso a la carpeta compartida de manuales.' },
      { id: 'E4', text: 'Se cuenta con el file de personal completo en físico/digital.', requiere_foto: true },
      { id: 'E5', text: 'Se tienen las Listas de Verificación (LDV) físicas en tienda.' },
    ],
  },
];

const CAFETERIA_PRODUCTS = [
  "Espresso Doble", "Café Americano", "Cappuccino 8oz", "Café Latte 12oz", "Flat White",
  "Macchiato", "Cold Brew Tradicional", "Cold Brew Tonic", "Café Filtrado V60", "Café Filtrado Chemex",
  "Mocaccino", "Chocolate Caliente", "Té Matcha Latte", "Infusión de Hierbas", "Café en Grano Don Guto (250g)",
  "Croissant de Mantequilla", "Pain au Chocolat", "Empanada de Carne", "Empanada de Pollo", "Carrot Cake",
  "Slice de Red Velvet", "Slice de Cheesecake de Fresa", "Galleta Chocochips", "Alfajor de la Casa", "Sandwich Caprese",
  "Sandwich Pollo & Tocino", "Tostón con Palta", "Jugo de Naranja Natural", "Limonada Imperial", "Hielo Purificado"
];

export default function OperationAudit({ user, teamMembers, onSaveAudit }) {
  const [store, setStore] = useState(() => {
    return user && user.role === 'Administrador' ? user.store : 'Barranco';
  });
  const [activeTab, setActiveTab] = useState('precision');
  const [checkedIds, setCheckedIds] = useState({});
  const [comments, setComments] = useState('');
  
  // New States for Verifiable Auditing
  const [actionPlans, setActionPlans] = useState({});
  const [evidencePhotos, setEvidencePhotos] = useState({});
  const [signatureAuditor, setSignatureAuditor] = useState(null);
  const [signatureAuditado, setSignatureAuditado] = useState(null);
  const [auditedCollaborator, setAuditedCollaborator] = useState('');
  const [selectedInventoryProducts, setSelectedInventoryProducts] = useState([]);

  const storeCollaborators = teamMembers 
    ? teamMembers.filter(m => m.store === store) 
    : [];

  const handleUploadPhoto = (id, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEvidencePhotos(prev => ({ ...prev, [id]: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSimulatePhoto = (id) => {
    const simulatedPhoto = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="100%" height="100%" fill="%23a78bfa"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="12" fill="%23ffffff">Foto Evidencia Criterio ${id}</text></svg>`;
    setEvidencePhotos(prev => ({ ...prev, [id]: simulatedPhoto }));
  };

  // Calculate scores
  const getCategoryScore = (category) => {
    const total = category.criteria.length;
    const checked = category.criteria.filter(c => checkedIds[c.id]).length;
    return (checked / total) * 100;
  };

  const getWeightedScore = (category) => {
    const score = getCategoryScore(category);
    return (score / 100) * category.weight;
  };

  const totalWeightedScore = AUDIT_CATEGORIES.reduce((acc, cat) => {
    return acc + getWeightedScore(cat);
  }, 0);

  const handleToggleProduct = (productName) => {
    setSelectedInventoryProducts(prev => {
      let next;
      if (prev.includes(productName)) {
        next = prev.filter(p => p !== productName);
      } else {
        if (prev.length >= 10) {
          alert("⚠️ Ya has seleccionado 10 productos. Desmarca alguno si deseas cambiarlo.");
          return prev;
        }
        next = [...prev, productName];
      }
      
      const isNowChecked = next.length === 10;
      setCheckedIds(prevChecked => {
        const nextChecked = { ...prevChecked, I1: isNowChecked };
        if (isNowChecked) {
          setActionPlans(prevPlans => {
            const nextPlans = { ...prevPlans };
            delete nextPlans['I1'];
            return nextPlans;
          });
        }
        return nextChecked;
      });
      
      return next;
    });
  };

  const toggleCheck = (id) => {
    setCheckedIds(prev => {
      const nextChecked = !prev[id];
      const newCheckedIds = { ...prev, [id]: nextChecked };
      
      // Clean up action plans / photo evidence if state changes
      if (nextChecked) {
        setActionPlans(prevPlans => {
          const nextPlans = { ...prevPlans };
          delete nextPlans[id];
          return nextPlans;
        });
      } else {
        setEvidencePhotos(prevPhotos => {
          const nextPhotos = { ...prevPhotos };
          delete nextPhotos[id];
          return nextPhotos;
        });
      }
      
      return newCheckedIds;
    });
  };

  const handleSave = () => {
    // Rigid operational validations to ensure truthfulness
    if (!auditedCollaborator) {
      alert('⚠️ Campo requerido: Por favor seleccione la persona auditada.');
      return;
    }

    const missingPhotos = [];
    const missingPlans = [];

    AUDIT_CATEGORIES.forEach(cat => {
      cat.criteria.forEach(c => {
        const isChecked = !!checkedIds[c.id];
        if (isChecked && c.requiere_foto && !evidencePhotos[c.id]) {
          missingPhotos.push(c.id);
        }
        if (!isChecked && !actionPlans[c.id]) {
          missingPlans.push(c.id);
        }
      });
    });

    if (missingPhotos.length > 0) {
      alert(`⚠️ Evidencia requerida: Falta adjuntar fotografía para los criterios cumplidos: ${missingPhotos.join(', ')}`);
      return;
    }

    if (missingPlans.length > 0) {
      alert(`⚠️ Planes de acción requeridos: Por favor describe el plan de acción para los criterios desmarcados: ${missingPlans.join(', ')}`);
      return;
    }

    if (!signatureAuditor) {
      alert('⚠️ Firma requerida: Falta la firma del Auditor.');
      return;
    }

    if (!signatureAuditado) {
      alert('⚠️ Firma requerida: Falta la firma del Auditado.');
      return;
    }

    const auditData = {
      tienda: store,
      colaboradorAuditado: auditedCollaborator,
      fecha: new Date().toISOString(),
      nota: totalWeightedScore,
      detalles: checkedIds,
      actionPlans,
      evidencePhotos,
      signatureAuditor,
      signatureAuditado,
      comentarios: comments,
      selectedInventoryProducts,
    };
    
    onSaveAudit(auditData);

    // Reset check list and states
    setCheckedIds({});
    setActionPlans({});
    setEvidencePhotos({});
    setComments('');
    setAuditedCollaborator('');
    setSelectedInventoryProducts([]);
    
    // Note: Canvas components will reset themselves on state clear/redraw
    alert(`Auditoría guardada con éxito. Nota Ponderada: ${totalWeightedScore.toFixed(1)}%`);
  };

  const getScoreColorClass = (score) => {
    if (score >= 90) return { bg: 'var(--success-light)', text: 'var(--success)', border: 'var(--success)' };
    if (score >= 70) return { bg: 'var(--warning-light)', text: 'var(--warning)', border: 'var(--warning)' };
    return { bg: 'var(--error-light)', text: 'var(--error)', border: 'var(--error)' };
  };

  const colors = getScoreColorClass(totalWeightedScore);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
      {/* Dynamic Urgent Banner for Administrador */}
      {user && user.role === 'Administrador' && (
        <div className="card glass animate-scale-in" style={{ display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid var(--error)', padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.05)', color: 'var(--error)' }}>
          <span style={{ fontSize: '24px' }}>⚠️</span>
          <div>
            <h4 style={{ margin: 0, color: 'var(--error)', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase' }}>CONTROL DE GESTIÓN OBLIGATORIO</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-main)', lineHeight: '1.4' }}>
              Esta auto-evaluación es de carácter <strong>URGENTE</strong> y debe realizarse cada <strong>15 días (quincenal)</strong>. El Gerente General auditará esta tienda oficialmente al finalizar el mes (<strong>30 de Junio</strong>) para validar el cumplimiento de los estándares.
            </p>
          </div>
        </div>
      )}

      {/* Top Banner & Score */}
      <div className="card glass" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--primary)' }}>
            {user && user.role === 'Administrador' 
              ? 'Ficha de Auditoría Operacional (Auto-evaluación Preventiva)' 
              : 'Ficha de Auditoría Gerencial (Evaluación Completa)'}
          </h2>
          <p style={{ margin: '4px 0 12px 0', fontSize: '12px', color: 'var(--text-muted)', maxWidth: '500px' }}>
            {user && user.role === 'Administrador'
              ? 'Evaluación interna de estándares operativos realizada por el Administrador para controlar los procesos de sus colaboradores.'
              : 'Auditoría oficial del Gerente General para evaluar la gestión del Administrador de Tienda y la operación general de la sede.'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Tienda a Evaluar:</label>
            <select
              value={store}
              onChange={(e) => setStore(e.target.value)}
              disabled={user && user.role === 'Administrador'}
              className="input"
              style={{ width: '150px', padding: '6px 12px' }}
            >
              <option value="Barranco">Barranco</option>
              <option value="Miraflores">Miraflores</option>
              <option value="San Isidro">San Isidro</option>
            </select>
          </div>
        </div>

        {/* Dynamic Score Display */}
        <div style={{
          backgroundColor: colors.bg,
          color: colors.text,
          border: `2px solid ${colors.text}`,
          borderRadius: 'var(--radius-md)',
          padding: '12px 24px',
          textAlign: 'center',
          minWidth: '180px',
          transition: 'all 0.3s ease',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Puntaje Ponderado</div>
          <div style={{ fontSize: '36px', fontWeight: 800 }}>{totalWeightedScore.toFixed(1)}%</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start' }}>
        {/* Category Accordion / Tab selector */}
        <div className="card" style={{ flex: '1 1 250px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h4 style={{ margin: '8px 12px', color: 'var(--text-muted)' }}>Categorías de Auditoría</h4>
          {AUDIT_CATEGORIES.map(cat => {
            const catScore = getCategoryScore(cat);
            const wScore = getWeightedScore(cat);
            const isActive = activeTab === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveTab(cat.key)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: isActive ? '1px solid var(--primary)' : '1px solid var(--border)',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', fontWeight: 600 }}>
                  <span style={{ color: isActive ? 'var(--primary)' : 'var(--text-main)' }}>{cat.name}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>({cat.weight}%)</span>
                </div>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>Cumplimiento: {catScore.toFixed(0)}%</span>
                  <span style={{ fontWeight: 600, color: 'var(--secondary)' }}>+{wScore.toFixed(1)}%</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Criteria Checklist */}
        <div className="card" style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {AUDIT_CATEGORIES.map(cat => {
            if (cat.key !== activeTab) return null;
            return (
              <div key={cat.key} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, color: 'var(--secondary)' }}>Criterios de {cat.name}</h3>
                  <span style={{ fontSize: '12px', fontWeight: 600, backgroundColor: 'var(--bg-main)', padding: '4px 8px', borderRadius: '4px' }}>
                    Peso: {cat.weight}% del total
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {cat.criteria.map(c => {
                    const isChecked = !!checkedIds[c.id];
                    return (
                      <div
                        key={c.id}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          padding: '12px',
                          borderRadius: 'var(--radius-sm)',
                          border: isChecked ? '1px solid var(--success)' : '1px solid var(--border)',
                          backgroundColor: isChecked ? 'var(--success-light)' : 'transparent',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {/* Clickable Header for Checkbox + Label */}
                        <div 
                          onClick={() => {
                            if (c.id === 'I1') {
                              alert("ℹ️ Este criterio se marca automáticamente al seleccionar exactamente 10 productos de la lista inferior.");
                            } else {
                              toggleCheck(c.id);
                            }
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: c.id === 'I1' ? 'default' : 'pointer', width: '100%' }}
                        >
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: isChecked ? 'none' : '2px solid var(--border)',
                            backgroundColor: isChecked ? 'var(--success)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '11px',
                            flexShrink: 0,
                          }}>
                            {isChecked ? '✓' : ''}
                          </div>
                          <div style={{ flex: 1 }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                              ID: {c.id} {c.requiere_foto && <span style={{ color: 'var(--primary)', marginLeft: '6px' }}>📸 Foto Requerida</span>}
                            </span>
                            <span style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: 600 }}>{c.text}</span>
                          </div>
                        </div>

                        {/* Cafeteria Products selector for I1 */}
                        {c.id === 'I1' && (
                          <div 
                            onClick={(e) => e.stopPropagation()} 
                            style={{
                              marginTop: '12px',
                              padding: '12px',
                              backgroundColor: 'var(--bg-main)',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border)',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
                                📋 PRODUCTOS DE CAFETERÍA (SELECCIONA EXACTAMENTE 10)
                              </span>
                              <span style={{ 
                                fontSize: '11px', 
                                fontWeight: 800, 
                                backgroundColor: selectedInventoryProducts.length === 10 ? 'var(--success-light)' : 'var(--primary-light)',
                                color: selectedInventoryProducts.length === 10 ? 'var(--success)' : 'var(--primary)',
                                padding: '3px 8px',
                                borderRadius: '12px',
                                border: `1px solid ${selectedInventoryProducts.length === 10 ? 'var(--success)' : 'var(--primary)'}`
                              }}>
                                {selectedInventoryProducts.length} / 10 Seleccionados
                              </span>
                            </div>
                            
                            <div style={{ 
                              display: 'grid', 
                              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', 
                              gap: '6px', 
                              maxHeight: '180px', 
                              overflowY: 'auto',
                              paddingRight: '4px',
                              fontSize: '11px'
                            }}>
                              {CAFETERIA_PRODUCTS.map(prod => {
                                const isSelected = selectedInventoryProducts.includes(prod);
                                return (
                                  <button
                                    key={prod}
                                    type="button"
                                    onClick={() => handleToggleProduct(prod)}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'flex-start',
                                      gap: '6px',
                                      padding: '5px 8px',
                                      borderRadius: '4px',
                                      border: isSelected ? '1px solid var(--success)' : '1px solid var(--border)',
                                      backgroundColor: isSelected ? 'var(--success-light)' : 'var(--bg-card)',
                                      color: isSelected ? 'var(--success)' : 'var(--text-main)',
                                      cursor: 'pointer',
                                      fontWeight: isSelected ? 700 : 500,
                                      textAlign: 'left',
                                      transition: 'all 0.15s ease',
                                    }}
                                  >
                                    <span style={{ fontSize: '11px' }}>{isSelected ? '✅' : '⬜'}</span>
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={prod}>
                                      {prod}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Foto Evidencia input if checked & requires photo */}
                        {isChecked && c.requiere_foto && (
                          <div 
                            onClick={(e) => e.stopPropagation()} 
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              alignItems: 'center',
                              gap: '10px',
                              marginTop: '4px',
                              paddingTop: '8px',
                              borderTop: '1px dashed var(--border)',
                              fontSize: '12px'
                            }}
                          >
                            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>📸 Foto Evidencia:</span>
                            {evidencePhotos[c.id] ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img src={evidencePhotos[c.id]} alt="Evidencia" style={{ height: '45px', borderRadius: '4px', border: '1px solid var(--border)', objectFit: 'contain' }} />
                                <button 
                                  onClick={() => setEvidencePhotos(prev => {
                                    const next = { ...prev };
                                    delete next[c.id];
                                    return next;
                                  })}
                                  className="btn"
                                  style={{ padding: '2px 8px', fontSize: '10px', backgroundColor: 'var(--error-light)', color: 'var(--error)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                  Quitar
                                </button>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  id={`file-${c.id}`} 
                                  onChange={(e) => handleUploadPhoto(c.id, e)} 
                                  style={{ display: 'none' }} 
                                />
                                <label 
                                  htmlFor={`file-${c.id}`} 
                                  className="btn btn-secondary"
                                  style={{ padding: '4px 10px', fontSize: '11px', margin: 0, display: 'inline-block', cursor: 'pointer' }}
                                >
                                  Subir Foto
                                </label>
                                <span style={{ color: 'var(--text-muted)' }}>ó</span>
                                <button 
                                  onClick={() => handleSimulatePhoto(c.id)}
                                  className="btn btn-secondary"
                                  style={{ padding: '4px 10px', fontSize: '11px', color: 'var(--primary)', borderColor: 'var(--primary)' }}
                                >
                                  ⚡ Simular Captura
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Action Plan input if unchecked */}
                        {!isChecked && (
                          <div 
                            onClick={(e) => e.stopPropagation()} 
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                              marginTop: '4px',
                              paddingTop: '8px',
                              borderTop: '1px dashed var(--border)'
                            }}
                          >
                            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span>⚠️ Plan de Acción Obligatorio:</span>
                            </label>
                            <input 
                              type="text"
                              placeholder="Ej: Programar reparación del extractor / Capacitar al personal..."
                              value={actionPlans[c.id] || ''}
                              onChange={(e) => setActionPlans(prev => ({ ...prev, [c.id]: e.target.value }))}
                              className="input"
                              style={{ padding: '6px 10px', fontSize: '12px', width: '100%' }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Comments, Person Audited, and Signatures */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
              {/* Selector for Audited Collaborator */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: '1 1 250px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Persona Auditada (Evaluado):</label>
                <select
                  value={auditedCollaborator}
                  onChange={(e) => setAuditedCollaborator(e.target.value)}
                  className="input"
                  style={{ padding: '8px 12px', width: '100%', height: '38px', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer' }}
                  required
                >
                  <option value="">-- Seleccionar Colaborador --</option>
                  {user && user.role === 'Gerente' && (
                    <option value="Diana Valdivia">Diana Valdivia (Administrador - Barranco)</option>
                  )}
                  {storeCollaborators.map(m => (
                    <option key={m.email} value={m.name}>{m.name} ({m.role})</option>
                  ))}
                </select>
              </div>

              {/* Comments box */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: '2 1 300px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Observaciones de la Auditoría:</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="input"
                  rows="2"
                  placeholder="Escribe comentarios sobre limpieza, capacitación, mantenimiento..."
                  style={{ resize: 'vertical', fontFamily: 'inherit', padding: '8px 12px', height: '38px', minHeight: '38px' }}
                />
              </div>
            </div>

            {/* Instruction message for sharing the device */}
            <div style={{ 
              padding: '10px 12px', 
              borderRadius: 'var(--radius-sm)', 
              backgroundColor: auditedCollaborator ? 'rgba(59, 130, 246, 0.08)' : 'rgba(0, 0, 0, 0.02)', 
              border: auditedCollaborator ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid var(--border)',
              fontSize: '12px',
              transition: 'all 0.3s ease'
            }}>
              {auditedCollaborator ? (
                <span>
                  👤 <strong>Instrucción de Firma:</strong> Por favor, ceda el dispositivo físico a <strong>{auditedCollaborator}</strong> para que estampe su firma digital en el cuadro derecho de conformidad.
                </span>
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>
                  ⚠️ <strong>Atención:</strong> Debe seleccionar el colaborador evaluado arriba para habilitar la firma digital de conformidad de ambas partes.
                </span>
              )}
            </div>
          </div>

          {/* Signatures Panels */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', borderTop: '1px solid var(--border)', paddingTop: '15px', marginTop: '5px' }}>
            <SignatureCanvas 
              key={`sig-auditor-${checkedIds ? Object.keys(checkedIds).length : 0}`}
              label={user && user.role === 'Administrador' ? 'Firma del Administrador (Auditor)' : 'Firma del Gerente General'} 
              onSave={setSignatureAuditor} 
            />
            <SignatureCanvas 
              key={`sig-auditado-${checkedIds ? Object.keys(checkedIds).length : 0}`}
              label={auditedCollaborator ? `Firma de ${auditedCollaborator}` : 'Firma de Persona Auditada'} 
              onSave={setSignatureAuditado} 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              onClick={() => {
                setCheckedIds({});
                setActionPlans({});
                setEvidencePhotos({});
                setComments('');
                setSelectedInventoryProducts([]);
              }}
              className="btn btn-secondary"
            >
              Restaurar Criterios
            </button>
            <button onClick={handleSave} className="btn btn-primary">
              Guardar Auditoría
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
