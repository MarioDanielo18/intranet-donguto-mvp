import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate database lookup / latency
    setTimeout(() => {
      setLoading(false);
      
      const usernameLower = username.toLowerCase().trim();
      
      // Setup default mock accounts
      if (usernameLower === 'qlopezdg') {
        onLogin({ username: 'qlopezdg', name: 'Mateo Quispe López', role: 'Barista', store: 'Barranco' });
      } else if (usernameLower === 'aruizdg') {
        onLogin({ username: 'aruizdg', name: 'Gabriela Alva Ruiz', role: 'Cocina', store: 'Barranco' });
      } else if (usernameLower === 'fpinedodg') {
        onLogin({ username: 'fpinedodg', name: 'Rodrigo Flores Pinedo', role: 'Servicio', store: 'Barranco' });
      } else if (usernameLower === 'vrojasdg') {
        onLogin({ username: 'vrojasdg', name: 'Diana Valdivia Rojas', role: 'Administrador', store: 'Barranco' });
      } else if (usernameLower === 'sgomezdg') {
        onLogin({ username: 'sgomezdg', name: 'Pedro Supervisor Gómez', role: 'Supervisor', store: 'Todas' });
      } else if (usernameLower === 'dongutodg') {
        onLogin({ username: 'dongutodg', name: 'Don Guto', role: 'Gerente', store: 'Todas' });
      } else if (usernameLower === 'tecnicodg') {
        onLogin({ username: 'tecnicodg', name: 'Técnico de Sistemas', role: 'Técnico', store: 'Todas' });
      } else {
        // Fallback for custom accounts in localStorage
        const savedTeam = localStorage.getItem('donguto-team');
        const team = savedTeam ? JSON.parse(savedTeam) : [];
        const matchedUser = team.find(m => m.username === usernameLower);
        
        if (matchedUser) {
          if (matchedUser.pendingApproval) {
            setError('Tu cuenta está pendiente de aprobación por el Supervisor.');
            return;
          }
          onLogin(matchedUser);
        } else if (usernameLower && password.length >= 4) {
          onLogin({ username: usernameLower, name: 'Usuario Demo', role: 'Barista', store: 'Barranco' });
        } else {
          setError('Usuario no registrado. Usa una cuenta demo (ej: qlopezdg, vrojasdg)');
        }
      }
    }, 800);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100%',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decoration elements */}
      <div style={{
        position: 'absolute',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,26,26,0.15) 0%, rgba(250,247,242,0) 70%)',
        top: '-100px',
        left: '-50px',
        zIndex: -1,
      }} />
      <div style={{
        position: 'absolute',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(47,79,79,0.1) 0%, rgba(250,247,242,0) 70%)',
        bottom: '-150px',
        right: '-100px',
        zIndex: -1,
      }} />

      {/* Glass card container */}
      <div className="card glass animate-scale-in" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '35px 30px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Header with Logo */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'inline-block', padding: '12px 24px', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '1px' }}>DON GUTO</span>
            <div style={{ fontSize: '9px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '2px', marginTop: '-3px' }}>COFFEE COMPANY</div>
          </div>
          <h3 style={{ margin: '20px 0 5px 0', fontSize: '18px', color: 'var(--text-main)' }}>Intranet Operativa</h3>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Ingresa tus credenciales para acceder</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'var(--error-light)',
            color: 'var(--error)',
            border: '1px solid #ffccd0',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            fontSize: '12px',
            marginBottom: '20px',
            lineHeight: 1.4,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Usuario de Acceso</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ej: qlopezdg"
              className="input"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '10px', fontSize: '15px' }}
          >
            {loading ? 'Validando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={{ marginTop: '25px', borderTop: '1px solid var(--border)', paddingTop: '20px', textAlign: 'center' }}>
          <h5 style={{ margin: '0 0 8px 0', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>CUENTAS DEMO DE PRUEBA:</h5>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
            <button
              onClick={() => { setUsername('qlopezdg'); setPassword('demo123'); }}
              className="btn btn-secondary"
              style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '4px' }}
            >
              Barista (qlopezdg)
            </button>
            <button
              onClick={() => { setUsername('aruizdg'); setPassword('demo123'); }}
              className="btn btn-secondary"
              style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '4px' }}
            >
              Cocina (aruizdg)
            </button>
            <button
              onClick={() => { setUsername('fpinedodg'); setPassword('demo123'); }}
              className="btn btn-secondary"
              style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '4px' }}
            >
              Servicio (fpinedodg)
            </button>
            <button
              onClick={() => { setUsername('vrojasdg'); setPassword('demo123'); }}
              className="btn btn-secondary"
              style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '4px' }}
            >
              Admin (vrojasdg)
            </button>
            <button
              onClick={() => { setUsername('dongutodg'); setPassword('demo123'); }}
              className="btn btn-secondary"
              style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '4px' }}
            >
              Gerente (dongutodg)
            </button>
            <button
              onClick={() => { setUsername('tecnicodg'); setPassword('demo123'); }}
              className="btn btn-secondary"
              style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '4px' }}
            >
              Técnico (tecnicodg)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
