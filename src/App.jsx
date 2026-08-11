import React from 'react';
import Login from './components/Login';
const ColaboradorDashboard = React.lazy(() => import('./components/ColaboradorDashboard'));
const SupervisorDashboard = React.lazy(() => import('./components/SupervisorDashboard'));
import IncidentDetailStandalone from './components/IncidentDetailStandalone';
import { useApp, SUPERVISORY_ROLES } from './context/AppContext';

const App = () => {
  const {
    theme, setTheme,
    user, setUser,
    activeTab, setActiveTab,
    checklists,
    cleaningTasks,
    teamMembers,
    auditLogs,
    incidents,
    biometricDevices,
    biometricLogs,
    isDrawerOpen, setIsDrawerOpen,
    selectedDateStr, setSelectedDateStr,
    currentView, setCurrentView,
    detailIncidentId, setDetailIncidentId,
    handleLogin, handleLogout,
    handleSaveTask, handleSaveCleaning,
    handleClockIn, handleApproveTrainingDay,
    handleAddTeamMember, handleApproveCollaborator,
    handleRejectCollaborator, handleSaveAudit,
    handleUpdateCollaborator, handleAddIncident,
    handleRespondIncident, handleUpdateIncidentStatus,
    handleUpdateDevices, handleBiometricScan,
    handleSelectIncident, handleCloseIncidentDetail,
    loadDailyChecklists,
    weeklySchedules, setWeeklySchedules,
    INITIAL_TRAINING_ROUTE
  } = useApp();

  const [touchStartX, setTouchStartX] = React.useState(null);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    const diffX = currentX - touchStartX;

    // If swipe from left to right (diffX > 75) near the left edge (startX < 50), open drawer
    if (touchStartX < 50 && diffX > 75 && !isDrawerOpen) {
      setIsDrawerOpen(true);
      setTouchStartX(null);
    }
    // If swipe from right to left (diffX < -75) inside drawer, close it
    if (diffX < -75 && isDrawerOpen) {
      setIsDrawerOpen(false);
      setTouchStartX(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartX(null);
  };

  // -------------------------------------------------------------------------
  // RENDERER
  // -------------------------------------------------------------------------
  if (currentView === 'incident-detail') {
    if (!user) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'var(--bg-main)'
        }}>
          <Login onLogin={handleLogin} />
        </div>
      );
    }
    return (
      <IncidentDetailStandalone
        user={user}
        incidentId={detailIncidentId}
        incidents={incidents}
        onRespondIncident={handleRespondIncident}
        onUpdateIncidentStatus={handleUpdateIncidentStatus}
        theme={theme}
        setTheme={setTheme}
        onClose={handleCloseIncidentDetail}
      />
    );
  }

  return (
    <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* HEADER BAR */}
      <header className="glass" style={{ borderBottom: '1px solid rgba(139, 26, 26, 0.08)', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)' }}>
        <div className="container header-container" style={{ height: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ backgroundColor: 'var(--primary)', color: '#fff', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '15px', letterSpacing: '0.5px', fontFamily: "'Outfit', 'Inter', sans-serif", boxShadow: '0 2px 8px rgba(139, 26, 26, 0.3)' }}>
              DG
            </div>
            <div>
              <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', display: 'block', letterSpacing: '0.5px', fontFamily: "'Outfit', 'Inter', sans-serif" }}>DON GUTO</span>
              <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginTop: '-3px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Intranet Operativa</span>
            </div>
          </div>

          {/* Desktop Controls Widget (Hidden on mobile) */}
          <div className="header-controls hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
              className="btn btn-secondary"
              style={{
                padding: '6px 12px',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
              title="Cambiar tema de la página"
              aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
            >
              {theme === 'light' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
            </button>

            {user && (
              <div className="user-widget" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div className="user-info" style={{ textAlign: 'right', fontSize: '12px' }}>
                  <strong style={{ color: 'var(--text-main)', display: 'block' }}>{user.name}</strong>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {user.role === 'Auditor' ? 'Auditor de Operaciones' : user.role} | Tienda: <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{user.store}</span>
                  </span>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }}>
                  Salir
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          {user && (
            <div className="show-on-mobile">
              <button 
                onClick={() => setIsDrawerOpen(true)}
                className="hamburger-btn"
                title="Abrir menú"
                aria-label="Abrir menú de navegación"
              >
                ☰
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN VIEW AREA */}
      <main className="container" style={{ flex: 1, padding: '30px 16px' }}>
        {!user ? (
          <Login onLogin={handleLogin} />
        ) : (
          <div className="animate-fade-in">
            {/* Show view based on user role (Lazy Loaded with Suspense) */}
            <React.Suspense fallback={
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '50px', color: 'var(--text-muted)', gap: '15px' }}>
                <div style={{ border: '4px solid rgba(0,0,0,0.1)', borderLeftColor: 'var(--primary)', borderRadius: '50%', width: '36px', height: '36px', animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Cargando Panel...</span>
              </div>
            }>
              {SUPERVISORY_ROLES.includes(user.role) ? (
                <SupervisorDashboard
                  user={user}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  checklists={checklists}
                  cleaningTasks={cleaningTasks}
                  trainingRoute={INITIAL_TRAINING_ROUTE}
                  teamMembers={teamMembers}
                  auditLogs={auditLogs}
                  onApproveTrainingDay={handleApproveTrainingDay}
                  onAddTeamMember={handleAddTeamMember}
                  onSaveAudit={handleSaveAudit}
                  onClockIn={handleClockIn}
                  onUpdateCollaborator={handleUpdateCollaborator}
                  incidents={incidents}
                  onRespondIncident={handleRespondIncident}
                  onUpdateIncidentStatus={handleUpdateIncidentStatus}
                  onAddIncident={handleAddIncident}
                  biometricDevices={biometricDevices}
                  biometricLogs={biometricLogs}
                  onUpdateDevices={handleUpdateDevices}
                  onBiometricScan={handleBiometricScan}
                  onSelectIncident={handleSelectIncident}
                  onApproveCollaborator={handleApproveCollaborator}
                  onRejectCollaborator={handleRejectCollaborator}
                  weeklySchedules={weeklySchedules}
                  setWeeklySchedules={setWeeklySchedules}
                />
              ) : (
                <ColaboradorDashboard
                  user={user}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  checklists={checklists}
                  cleaningTasks={cleaningTasks}
                  trainingRoute={INITIAL_TRAINING_ROUTE.map(d => ({
                    ...d,
                    estado: 'Completado'
                  }))}
                  arrivalLogs={teamMembers.find(m => m.username === user.username)?.arrivalLogs || []}
                  onSaveTask={handleSaveTask}
                  onSaveCleaning={handleSaveCleaning}
                  onApproveTrainingDay={handleApproveTrainingDay}
                  onClockIn={handleClockIn}
                  incidents={incidents}
                  onAddIncident={handleAddIncident}
                  biometricDevices={biometricDevices}
                  onBiometricScan={handleBiometricScan}
                  weeklySchedules={weeklySchedules}
                />
              )}
            </React.Suspense>
          </div>
        )}
      </main>

      {/* SIDEBAR DRAWER (MOBILE-FIRST) */}
      {user && (
        <div className={`drawer-backdrop ${isDrawerOpen ? 'open' : ''}`} onClick={() => setIsDrawerOpen(false)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ backgroundColor: 'var(--primary)', color: '#fff', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '15px', letterSpacing: '0.5px', fontFamily: "'Outfit', 'Inter', sans-serif", boxShadow: '0 2px 8px rgba(139, 26, 26, 0.3)' }}>
                  DG
                </div>
                <div>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#fff', display: 'block', letterSpacing: '0.5px' }}>DON GUTO</span>
                  <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--accent)', display: 'block', marginTop: '-4px', letterSpacing: '1px' }}>INTRANET • MENU</span>
                </div>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', padding: '8px', borderRadius: '6px', transition: 'background 0.2s ease' }}
                aria-label="Cerrar menú de navegación"
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                ✕
              </button>
            </div>

            <div className="drawer-profile">
              <span style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Usuario Activo:</span>
              <strong style={{ fontSize: '15px', color: '#fff', display: 'block' }}>{user.name}</strong>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', display: 'block', marginTop: '2px' }}>
                {user.role} | Tienda: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{user.store}</span>
              </span>
              <button 
                onClick={() => { handleLogout(); setIsDrawerOpen(false); }} 
                className="btn btn-danger" 
                style={{ width: '100%', marginTop: '12px', padding: '8px', fontSize: '12.5px', fontWeight: 700 }}
              >
                Cerrar Sesión 🚪
              </button>
            </div>

            <div className="drawer-section-title">Ajustes</div>
            <button
              onClick={() => { setTheme(prev => prev === 'light' ? 'dark' : 'light'); }}
              className="drawer-btn"
              style={{ marginBottom: '15px' }}
            >
              {theme === 'light' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
            </button>

            <div className="drawer-section-title">Secciones</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '15px' }}>
              {SUPERVISORY_ROLES.includes(user.role) ? (
                <>
                  <button
                    className={`drawer-btn ${activeTab === 'monitoring' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('monitoring'); setIsDrawerOpen(false); }}
                  >
                    📊 Panel de Monitoreo
                  </button>
                  <button
                    className={`drawer-btn ${activeTab === 'audits' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('audits'); setIsDrawerOpen(false); }}
                  >
                    📋 Ficha de Auditoría
                  </button>
                  <button
                    className={`drawer-btn ${activeTab === 'team' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('team'); setIsDrawerOpen(false); }}
                  >
                    👥 Equipo y Capacitación
                  </button>
                  <button
                    className={`drawer-btn ${activeTab === 'staff_attendance' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('staff_attendance'); setIsDrawerOpen(false); }}
                  >
                    ⏰ Control de Asistencia
                  </button>
                  <button
                    className={`drawer-btn ${activeTab === 'punctuality' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('punctuality'); setIsDrawerOpen(false); }}
                  >
                    ⏰ Indicadores de Puntualidad
                  </button>
                  <button
                    className={`drawer-btn ${activeTab === 'logs' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('logs'); setIsDrawerOpen(false); }}
                  >
                    📜 Historial de Auditorías
                  </button>
                  <button
                    className={`drawer-btn ${activeTab === 'incidents' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('incidents'); setIsDrawerOpen(false); }}
                  >
                    ⚠️ Bandeja de Incidencias
                  </button>
                  <button
                    className={`drawer-btn ${activeTab === 'my_attendance' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('my_attendance'); setIsDrawerOpen(false); }}
                  >
                    🕒 Mi Asistencia (Huella)
                  </button>
                  {(user.username === 'mquispetec' || user.username === 'mquispedg') && (
                    <button
                      className={`drawer-btn ${activeTab === 'technical_panel' ? 'active' : ''}`}
                      onClick={() => { setActiveTab('technical_panel'); setIsDrawerOpen(false); }}
                    >
                      🛠️ Panel Técnico
                    </button>
                  )}
                  {['Gerente', 'Supervisor', 'Técnico', 'Auditor'].includes(user.role) && (
                    <button
                      className={`drawer-btn ${activeTab === 'multistore' ? 'active' : ''}`}
                      onClick={() => { setActiveTab('multistore'); setIsDrawerOpen(false); }}
                    >
                      🏢 Dashboard Multitienda
                    </button>
                  )}
                  {['Gerente', 'Supervisor', 'Técnico'].includes(user.role) && (
                    <button
                      className={`drawer-btn ${activeTab === 'managerial_kpis' ? 'active' : ''}`}
                      onClick={() => { setActiveTab('managerial_kpis'); setIsDrawerOpen(false); }}
                    >
                      📈 Panel de Gerencia & KPIs
                    </button>
                  )}
                  {['Gerente', 'Supervisor', 'Administrador', 'Auditor', 'Técnico', 'Operaciones'].includes(user.role) && (
                    <button
                      className={`drawer-btn ${activeTab === 'schedules' ? 'active' : ''}`}
                      onClick={() => { setActiveTab('schedules'); setIsDrawerOpen(false); }}
                    >
                      📅 Planificador de Horarios
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    className={`drawer-btn ${activeTab === 'checklist' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('checklist'); setIsDrawerOpen(false); }}
                  >
                    📝 Checklists Diarios
                  </button>
                  <button
                    className={`drawer-btn ${activeTab === 'cleaning' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('cleaning'); setIsDrawerOpen(false); }}
                  >
                    🧹 Tareas de Limpieza
                  </button>
                  <button
                    className={`drawer-btn ${activeTab === 'route' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('route'); setIsDrawerOpen(false); }}
                  >
                    🎓 Educación
                  </button>
                  {user.role === 'Barista' && (
                    <button
                      className={`drawer-btn ${activeTab === 'sensory' ? 'active' : ''}`}
                      onClick={() => { setActiveTab('sensory'); setIsDrawerOpen(false); }}
                    >
                      ☕ Perfil de Espresso
                    </button>
                  )}
                  <button
                    className={`drawer-btn ${activeTab === 'attendance' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('attendance'); setIsDrawerOpen(false); }}
                  >
                    🕒 Control de Asistencia
                  </button>
                  <button
                    className={`drawer-btn ${activeTab === 'menu' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('menu'); setIsDrawerOpen(false); }}
                  >
                    📋 Carta Digital
                  </button>
                  <button
                    className={`drawer-btn ${activeTab === 'incidents' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('incidents'); setIsDrawerOpen(false); }}
                  >
                    ⚠️ Reportar Incidencia
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
