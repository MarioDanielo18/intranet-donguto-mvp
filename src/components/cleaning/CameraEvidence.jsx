import React from 'react';

const compressImage = (file, maxWidth, maxHeight, quality) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const CameraEvidence = ({
  id,
  evidence,
  onCapture,
  onRemove,
  label = '📸 Abrir Cámara',
  successLabel = 'Foto cargada con éxito',
  disabled = false
}) => {
  const hasEvidence = !!evidence;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Compress to max 800px width/height and 70% quality JPEG
      const compressedDataUrl = await compressImage(file, 800, 800, 0.7);
      onCapture(compressedDataUrl);
    } catch (err) {
      console.warn('[CameraEvidence] Compression failed, falling back to raw image:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        onCapture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      onClick={(e) => e.stopPropagation()} // prevent toggle task check on sub-click
      style={{ display: 'flex', alignItems: 'center', gap: '15px' }}
    >
      {/* Hidden native camera input */}
      <input
        id={`camera-input-${id}`}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        disabled={disabled}
      />

      {!hasEvidence ? (
        <button
          onClick={() => document.getElementById(`camera-input-${id}`).click()}
          className="btn btn-secondary"
          disabled={disabled}
          style={{
            padding: '5px 12px',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'var(--primary)',
            color: '#fff',
            backgroundColor: 'var(--primary)',
            borderRadius: '4px',
            fontWeight: 700,
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1
          }}
        >
          {label}
        </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative', width: '64px', height: '64px' }}>
            <img 
              src={evidence} 
              alt="Evidencia" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }}
            />
            {!disabled && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  backgroundColor: 'var(--error)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                }}
                title="Eliminar evidencia"
              >
                ✕
              </button>
            )}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600 }}>{successLabel}</span>
        </div>
      )}
    </div>
  );
};

export default CameraEvidence;
