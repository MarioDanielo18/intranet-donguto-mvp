import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const usernameLower = username.toLowerCase().trim();

    try {
      // 1. Try Supabase login via Vercel serverless function
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameLower, password: password })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.status === 'success') {
          setLoading(false);
          onLogin(data.user);
          return;
        }
        
        // If server indicates fallback (Supabase not configured), proceed to local check
        if (data.status !== 'fallback') {
          setLoading(false);
          setError(data.error || 'Credenciales inválidas');
          return;
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        setLoading(false);
        setError(errData.error || 'Usuario o contraseña incorrectos');
        return;
      }
    } catch (apiErr) {
      console.warn('[Login] API connection error, falling back to local verification:', apiErr);
    }

    // 2. Local fallback verification (checks localStorage & default team)
    setTimeout(() => {
      setLoading(false);
      
      const savedTeam = localStorage.getItem('donguto-team');
      const team = savedTeam ? JSON.parse(savedTeam) : [];
      
      const matchedUser = team.find(m => m.username === usernameLower);
      
      if (matchedUser) {
        if (matchedUser.pendingApproval) {
          setError('Tu cuenta está pendiente de aprobación por el Supervisor.');
          return;
        }
        
        // Validate password (defaulting to demo123 for backward compatibility)
        const expectedPassword = matchedUser.password || 'demo123';
        if (expectedPassword === password) {
          onLogin(matchedUser);
        } else {
          setError('Contraseña incorrecta.');
        }
      } else {
        setError('Usuario no registrado. Verifica tus credenciales o contacta al Técnico.');
      }
    }, 500);
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
              onClick={() => { setUsername('qlopezdg'); setPassword('baristadg'); }}
              className="btn btn-secondary"
              style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '4px' }}
            >
              Barista (qlopezdg)
            </button>
            <button
              onClick={() => { setUsername('aruizdg'); setPassword('cocinadg'); }}
              className="btn btn-secondary"
              style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '4px' }}
            >
              Cocina (aruizdg)
            </button>
            <button
              onClick={() => { setUsername('fpinedodg'); setPassword('serviciodg'); }}
              className="btn btn-secondary"
              style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '4px' }}
            >
              Servicio (fpinedodg)
            </button>
            <button
              onClick={() => { setUsername('vrojasdg'); setPassword('admindg'); }}
              className="btn btn-secondary"
              style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '4px' }}
            >
              Admin (vrojasdg)
            </button>
            <button
              onClick={() => { setUsername('mquispedg'); setPassword('gerentedg'); }}
              className="btn btn-secondary"
              style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '4px' }}
            >
              Gerente (mquispedg)
            </button>
            <button
              onClick={() => { setUsername('tecnicodg'); setPassword('tecnicodg'); }}
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
