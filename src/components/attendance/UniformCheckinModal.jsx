import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';

export const UniformCheckinModal = ({ user, onClose }) => {
  const { handlePhotoClockIn } = useApp();
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef(null);

  const now = new Date();
  const dateStr = now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const storeName = user?.store || 'Basadre - San Isidro';

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Draw image onto canvas to watermark date, time, and store
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        // Watermark background bar at bottom
        const barHeight = Math.max(50, Math.floor(img.height * 0.12));
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, img.height - barHeight, img.width, barHeight);

        // Watermark text
        const fontSize = Math.max(14, Math.floor(img.height * 0.035));
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.fillStyle = '#4ade80';
        ctx.fillText(`🟢 DON GUTO - ASISTENCIA EN VIVO`, 20, img.height - barHeight + fontSize + 4);

        ctx.font = `${Math.max(12, fontSize - 3)}px sans-serif`;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`📅 ${dateStr}  |  🕒 ${timeStr}  |  📍 Sede: ${storeName}`, 20, img.height - 12);

        const watermarkedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setPhotoPreview(watermarkedDataUrl);
        setErrorMsg('');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmCheckin = () => {
    if (!photoPreview) {
      setErrorMsg('Por favor tómate una foto con tu uniforme antes de confirmar.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      const result = handlePhotoClockIn(user.username, photoPreview);
      setIsSubmitting(false);

      if (result.success) {
        setSuccessMsg('¡Asistencia y foto de uniforme verificadas exitosamente!');
        setTimeout(() => {
          if (onClose) onClose();
        }, 1200);
      } else {
        setErrorMsg(result.message || 'Error al registrar la asistencia');
      }
    }, 500);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 99999,
      padding: '15px'
    }}>
      <div className="card animate-fade-in" style={{
        maxWidth: '480px',
        width: '100%',
        backgroundColor: 'var(--bg-main)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        border: '2px solid var(--primary)'
      }}>
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '20px' }}>📸</span>
            <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '17px' }}>
              Registro Obligatorio de Asistencia
            </h3>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Sede: <strong>{storeName}</strong> • {dateStr}
          </p>
        </div>

        {/* Informative Banner */}
        <div style={{
          backgroundColor: 'var(--primary-light)',
          borderLeft: '4px solid var(--primary)',
          padding: '10px 14px',
          borderRadius: '6px',
          fontSize: '12px',
          color: 'var(--text-main)',
          lineHeight: '1.4'
        }}>
          💡 <strong>Requisito de Inicio de Turno:</strong> Para acceder a tus checklists y tareas diarias, tómate una foto clara mostrando tu uniforme y vestimenta corporativa Don Guto.
        </div>

        {/* Photo Container */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '12px',
          padding: '15px',
          border: '1px dashed var(--border)'
        }}>
          {photoPreview ? (
            <div style={{ position: 'relative', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
              <img
                src={photoPreview}
                alt="Vista previa del uniforme"
                style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', display: 'block' }}
              />
            </div>
          ) : (
            <div style={{
              width: '100%',
              height: '180px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              color: 'var(--text-muted)'
            }}>
              <span style={{ fontSize: '40px' }}>🤳</span>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Cámara Lista</span>
              <span style={{ fontSize: '11px', textAlign: 'center' }}>Presiona el botón inferior para abrir la cámara de tu dispositivo</span>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            capture="user"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="btn btn-secondary"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border)'
            }}
          >
            📸 {photoPreview ? 'Cambiar / Volver a Tomar Foto' : 'Abrir Cámara / Tomar Foto de Uniforme'}
          </button>
        </div>

        {/* Error / Success feedback */}
        {errorMsg && (
          <div style={{
            padding: '10px 14px',
            backgroundColor: 'var(--error-light)',
            color: 'var(--error)',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            textAlign: 'center'
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{
            padding: '10px 14px',
            backgroundColor: 'var(--success-light)',
            color: 'var(--success)',
            borderRadius: '6px',
            fontSize: '12.5px',
            fontWeight: 700,
            textAlign: 'center'
          }}>
            🟢 {successMsg}
          </div>
        )}

        {/* Actions */}
        <button
          type="button"
          onClick={handleConfirmCheckin}
          disabled={!photoPreview || isSubmitting}
          className="btn btn-primary"
          style={{
            padding: '12px',
            fontSize: '14px',
            fontWeight: 800,
            borderRadius: '8px',
            width: '100%',
            opacity: (!photoPreview || isSubmitting) ? 0.5 : 1,
            cursor: (!photoPreview || isSubmitting) ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Registrando...' : '🟢 Confirmar Asistencia e Iniciar Turno'}
        </button>
      </div>
    </div>
  );
};

export default UniformCheckinModal;
