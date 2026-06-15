import React, { useState } from 'react';

export default function CartaDigital({ user }) {
  const [viewerType, setViewerType] = useState('drive'); // 'drive' | 'local'
  
  const localPdfUrl = '/CARTA_A3_COMPLETA.pdf';
  const drivePdfUrl = 'https://drive.google.com/file/d/1-otSyDTiVuZ9AsqiJrwIUCJoBuN4ykxp/preview';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
      
      {/* Header Panel */}
      <div style={{ borderBottom: '2px solid var(--border)', paddingBottom: '10px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}>
        <div>
          <h3 style={{ margin: 0, color: 'var(--primary)' }}>Visor de la Carta Digital</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Visualiza la carta completa oficial del local (formato PDF). Optimizado para computadoras y dispositivos móviles.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <a 
            href={localPdfUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            📥 Descargar / Imprimir PDF
          </a>
        </div>
      </div>

      {/* Mobile Advice Banner */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '15px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--primary-light)',
        border: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>📱</span>
          <strong style={{ fontSize: '13px', color: 'var(--primary)' }}>¿Estás usando un celular o tablet?</strong>
        </div>
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-main)', lineHeight: 1.4 }}>
          Para una mejor experiencia en pantallas pequeñas, te recomendamos abrir la carta en pantalla completa. Esto te permitirá hacer zoom y navegar cómodamente en las secciones:
        </p>
        <div style={{ marginTop: '8px' }}>
          <a
            href={drivePdfUrl.replace('/preview', '/view?usp=drivesdk')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{
              padding: '8px 14px',
              fontSize: '11.5px',
              display: 'inline-flex',
              textDecoration: 'none',
              fontWeight: 'bold',
              backgroundColor: '#fff',
              borderColor: 'var(--primary)',
              color: 'var(--primary)'
            }}
          >
            ⚡ Abrir Carta en Pantalla Completa
          </a>
        </div>
      </div>

      {/* Viewer Options Selector */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        padding: '10px 15px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border)',
        backgroundColor: 'var(--bg-card)'
      }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>OPCIONES DEL VISOR:</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setViewerType('drive')}
            className="btn"
            style={{
              padding: '6px 12px',
              fontSize: '11px',
              backgroundColor: viewerType === 'drive' ? 'var(--primary)' : 'var(--bg-main)',
              color: viewerType === 'drive' ? '#fff' : 'var(--text-main)',
              border: viewerType === 'drive' ? 'none' : '1px solid var(--border)',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Visor Google Drive (Recomendado para Móviles)
          </button>
          <button
            onClick={() => setViewerType('local')}
            className="btn"
            style={{
              padding: '6px 12px',
              fontSize: '11px',
              backgroundColor: viewerType === 'local' ? 'var(--primary)' : 'var(--bg-main)',
              color: viewerType === 'local' ? '#fff' : 'var(--text-main)',
              border: viewerType === 'local' ? 'none' : '1px solid var(--border)',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Visor Directo PDF (Ideal para Computadoras)
          </button>
        </div>
      </div>

      {/* PDF Viewport Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '75vh',
        minHeight: '500px',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-md)'
      }}>
        {viewerType === 'drive' ? (
          <iframe
            src={drivePdfUrl}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            allow="autoplay"
            title="Carta Digital de Don Guto (Google Drive)"
          />
        ) : (
          <object
            data={localPdfUrl}
            type="application/pdf"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              padding: '20px',
              textAlign: 'center',
              gap: '15px'
            }}>
              <span style={{ fontSize: '48px' }}>📄</span>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                Tu navegador no soporta la previsualización directa de PDFs. No te preocupes, puedes abrirlo haciendo clic abajo:
              </p>
              <a 
                href={localPdfUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ padding: '8px 16px', textDecoration: 'none' }}
              >
                Abrir Archivo PDF
              </a>
            </div>
          </object>
        )}
      </div>

    </div>
  );
}
