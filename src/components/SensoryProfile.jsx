import React, { useState } from 'react';

const PARAMETERS = [
  { name: 'Crema', meta: 2.5, min: 1, max: 3 },
  { name: 'Aroma', meta: 2.5, min: 1, max: 3 },
  { name: 'Visual', meta: 3.0, min: 1, max: 3 },
  { name: 'Acidez', meta: 1.5, min: 1, max: 3 },
  { name: 'Bitter', meta: 2.0, min: 1, max: 3 },
  { name: 'Cuerpo', meta: 3.0, min: 1, max: 3 },
  { name: 'Retrogusto', meta: 2.5, min: 1, max: 3 },
  { name: 'Dulzor', meta: 2.0, min: 1, max: 3 },
  { name: 'Intensidad', meta: 2.5, min: 1, max: 3 },
  { name: 'Ptj Catador', meta: 3.0, min: 1, max: 3 },
];

export default function SensoryProfile({ readonly = false }) {
  const [values, setValues] = useState(
    PARAMETERS.reduce((acc, p) => ({ ...acc, [p.name]: p.meta }), {})
  );

  const size = 300;
  const center = size / 2;
  const rMax = 100; // max radius for value 3.0

  // Calculate polygon points
  const getPoints = (profileValues) => {
    return PARAMETERS.map((p, i) => {
      const val = profileValues[p.name] || 0;
      const r = (val / 3.0) * rMax;
      const angle = i * (2 * Math.PI / PARAMETERS.length) - Math.PI / 2;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return { x, y, name: p.name };
    });
  };

  const metaPoints = getPoints(PARAMETERS.reduce((acc, p) => ({ ...acc, [p.name]: p.meta }), {}));
  const userPoints = getPoints(values);

  const metaPath = metaPoints.map(p => `${p.x},${p.y}`).join(' ');
  const userPath = userPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Grid lines (circles/decagons representing values 1.0, 2.0, 3.0)
  const gridLevels = [1.0, 2.0, 3.0];

  const handleSliderChange = (name, val) => {
    setValues(prev => ({ ...prev, [name]: parseFloat(val) }));
  };

  return (
    <div className="card glass animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
        <h3 style={{ margin: 0, color: 'var(--primary)' }}>Perfil de Espresso e Identidad del Café</h3>
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
          Calibración diaria y comparación sensorial con el estándar Don Guto.
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center', alignItems: 'center' }}>
        {/* Radar Chart SVG */}
        <div style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
          <svg width={size} height={size} style={{ overflow: 'visible' }}>
            {/* Grid decagons */}
            {gridLevels.map((level, levelIdx) => {
              const pts = PARAMETERS.map((p, i) => {
                const r = (level / 3.0) * rMax;
                const angle = i * (2 * Math.PI / PARAMETERS.length) - Math.PI / 2;
                return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
              }).join(' ');
              return (
                <polygon
                  key={levelIdx}
                  points={pts}
                  fill="none"
                  stroke="#ebdcd5"
                  strokeWidth="1"
                />
              );
            })}

            {/* Axis lines and Labels */}
            {PARAMETERS.map((p, i) => {
              const angle = i * (2 * Math.PI / PARAMETERS.length) - Math.PI / 2;
              const xOuter = center + rMax * Math.cos(angle);
              const yOuter = center + rMax * Math.sin(angle);
              const xLabel = center + (rMax + 20) * Math.cos(angle);
              const yLabel = center + (rMax + 12) * Math.sin(angle);

              return (
                <g key={i}>
                  <line
                    x1={center}
                    y1={center}
                    x2={xOuter}
                    y2={yOuter}
                    stroke="#ebdcd5"
                    strokeWidth="1"
                  />
                  <text
                    x={xLabel}
                    y={yLabel}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="10"
                    fill="var(--text-muted)"
                    fontWeight="600"
                  >
                    {p.name}
                  </text>
                </g>
              );
            })}

            {/* Meta Profile (Standard) */}
            <polygon
              points={metaPath}
              fill="rgba(47, 79, 79, 0.1)"
              stroke="var(--secondary)"
              strokeWidth="2.5"
              strokeDasharray="4,3"
            />

            {/* User Profile (Calibrated) */}
            <polygon
              points={userPath}
              fill="rgba(139, 26, 26, 0.2)"
              stroke="var(--primary)"
              strokeWidth="3"
            />

            {/* Interactive/Data Dots */}
            {userPoints.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="4"
                fill="var(--primary)"
                stroke="#fff"
                strokeWidth="1.5"
              />
            ))}
          </svg>
        </div>

        {/* Sliders Panel */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '15px', fontSize: '12px', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
            <span style={{ color: 'var(--primary)', flex: 1 }}>Calibración Actual (Roja)</span>
            <span style={{ color: 'var(--secondary)' }}>Meta Don Guto (Gris)</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', maxHeight: '220px', overflowY: 'auto', paddingRight: '6px' }}>
            {PARAMETERS.map(p => (
              <div key={p.name} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-main)' }}>{p.name}</span>
                  <span>
                    <strong style={{ color: 'var(--primary)' }}>{values[p.name].toFixed(1)}</strong>
                    <span style={{ color: 'var(--text-muted)', margin: '0 4px' }}>/</span>
                    <span style={{ color: 'var(--text-muted)' }}>{p.meta.toFixed(1)}</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.5"
                  value={values[p.name]}
                  disabled={readonly}
                  onChange={(e) => handleSliderChange(p.name, e.target.value)}
                  style={{
                    width: '100%',
                    accentColor: 'var(--primary)',
                    cursor: readonly ? 'default' : 'pointer',
                    height: '4px',
                    borderRadius: '2px',
                  }}
                />
              </div>
            ))}
          </div>

          {!readonly && (
            <button
              onClick={() => setValues(PARAMETERS.reduce((acc, p) => ({ ...acc, [p.name]: p.meta }), {}))}
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '11px', alignSelf: 'flex-end' }}
            >
              Reestablecer a Meta
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
