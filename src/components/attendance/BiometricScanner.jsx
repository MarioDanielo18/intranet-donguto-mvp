import React, { useState, useEffect } from 'react';

export const BiometricScanner = ({ user, biometricDevices, onBiometricScan }) => {
  const [bioFeedback, setBioFeedback] = useState('Por favor, coloque su dedo en el lector biométrico.');
  const [bioProgress, setBioProgress] = useState(0);
  const [bioDevice, setBioDevice] = useState('');
  const [bioScanState, setBioScanState] = useState('idle'); // 'idle' | 'scanning' | 'verifying' | 'success' | 'error'

  // Auto-select device based on user's store
  useEffect(() => {
    if (biometricDevices && biometricDevices.length > 0) {
      const match = biometricDevices.find(d => d.store === user.store && d.status === 'Online');
      if (match) {
        setBioDevice(match.id);
      } else {
        setBioDevice(biometricDevices[0].id);
      }
    }
  }, [biometricDevices, user.store]);

  const triggerFingerprintScan = () => {
    if (bioScanState !== 'idle') return;
    if (!bioDevice) {
      setBioFeedback('Error: No se encontró ningún dispositivo biométrico activo.');
      return;
    }

    setBioScanState('scanning');
    setBioFeedback('Leyendo huella dactilar... Mantenga su dedo sobre el escáner.');
    setBioProgress(0);

    let progress = 0;
    const scanInterval = setInterval(() => {
      progress += 10;
      setBioProgress(progress);
      if (progress >= 100) {
        clearInterval(scanInterval);
        
        setBioScanState('verifying');
        setBioFeedback('Verificando coincidencia en el servidor biométrico...');
        
        setTimeout(() => {
          if (onBiometricScan) {
            const res = onBiometricScan(user.username, bioDevice);
            if (res && res.success) {
              setBioScanState('success');
              setBioFeedback(`¡Identidad Verificada! Bienvenido, ${user.name}. Asistencia registrada.`);
              setTimeout(() => {
                setBioScanState('idle');
                setBioFeedback('Por favor, coloque su dedo en el lector biométrico.');
              }, 3000);
            } else {
              setBioScanState('error');
              setBioFeedback(res ? res.message : 'Error en la verificación biométrica.');
              setTimeout(() => {
                setBioScanState('idle');
                setBioFeedback('Por favor, coloque su dedo en el lector biométrico.');
              }, 3000);
            }
          } else {
            setBioScanState('success');
            setBioFeedback('¡Identidad Verificada (Modo Demo)! Asistencia registrada.');
            setTimeout(() => {
              setBioScanState('idle');
              setBioFeedback('Por favor, coloque su dedo en el lector biométrico.');
            }, 3000);
          }
        }, 1200);
      }
    }, 150);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px', padding: '10px', width: '100%' }}>
      <h5 style={{ margin: 0, fontSize: '14px', color: 'var(--text-main)', fontWeight: 700 }}>
        ☝️ Registro Asistencia con Lector Biométrico
      </h5>
      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '380px' }}>
        Coloca tu dedo en el lector biométrico físico (ZKTeco K40) conectado en tu sede para registrar tu ingreso o salida o haz click en el círculo para simular.
      </p>
      
      {/* Fingerprint scan circle */}
      <div 
        onClick={triggerFingerprintScan}
        style={{
          width: '130px',
          height: '130px',
          borderRadius: '50%',
          border: `4px solid ${
            bioScanState === 'success' ? 'var(--success)' : bioScanState === 'error' ? 'var(--error)' : bioScanState === 'scanning' ? 'var(--primary)' : 'var(--border)'
          }`,
          backgroundColor: bioScanState === 'scanning' ? 'rgba(139,26,26,0.05)' : 'var(--bg-main)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: bioScanState === 'idle' ? 'pointer' : 'default',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          marginTop: '10px',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {bioScanState === 'scanning' && (
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '3px',
            backgroundColor: 'var(--primary)',
            boxShadow: '0 0 8px var(--primary)',
            top: `${bioProgress}%`,
            left: 0,
            transition: 'top 0.15s linear',
          }} />
        )}

        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke={
          bioScanState === 'success' ? 'var(--success)' : bioScanState === 'error' ? 'var(--error)' : bioScanState === 'scanning' ? 'var(--primary)' : 'var(--text-muted)'
        } strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 10a2 2 0 0 0-2 2M14 14a4 4 0 0 0-4-4M2 12a10 10 0 0 1 18 0M10 17v-1a2 2 0 1 1 4 0v1" />
          <path d="M12 2a10 10 0 0 0-10 10M12 22a10 10 0 0 0 10-10" />
          <path d="M6 12a6 6 0 0 1 12 0M8 12a4 4 0 0 1 8 0" />
        </svg>
      </div>

      <div style={{ fontSize: '12px', color: bioScanState === 'success' ? 'var(--success)' : bioScanState === 'error' ? 'var(--error)' : 'var(--text-muted)', fontWeight: 600, textAlign: 'center', minHeight: '34px', maxWidth: '340px', marginTop: '15px' }}>
        {bioFeedback}
      </div>
    </div>
  );
};

export default BiometricScanner;
