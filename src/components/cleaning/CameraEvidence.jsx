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
  observation = '',
  onCapture,
  onRemove,
  onObservationChange,
  label = '📸 Tomar / Añadir Foto',
  successLabel = 'Evidencias cargadas',
  maxPhotos = 4,
  disabled = false
}) => {
  // Parse evidence prop to array
  const parseEvidences = (ev) => {
    if (!ev) return [];
    if (Array.isArray(ev)) return ev;
    if (typeof ev === 'string') {
      if (ev.startsWith('[')) {
        try {
          return JSON.parse(ev);
        } catch (e) {
          return [ev];
        }
      }
      return [ev];
    }
    return [];
  };

  const photoList = parseEvidences(evidence);
  const canAddMore = photoList.length < maxPhotos;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const compressedDataUrl = await compressImage(file, 800, 800, 0.7);
      const updatedList = [...photoList, compressedDataUrl];
      onCapture(updatedList.length === 1 ? updatedList[0] : JSON.stringify(updatedList));
    } catch (err) {
      console.warn('[CameraEvidence] Compression failed, falling back to raw image:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedList = [...photoList, reader.result];
        onCapture(updatedList.length === 1 ? updatedList[0] : JSON.stringify(updatedList));
      };
      reader.readAsDataURL(file);
    }
    e.target.value = ''; // Reset input so re-selecting same file works
  };

  const handleRemovePhoto = (indexToRemove) => {
    const updatedList = photoList.filter((_, idx) => idx !== indexToRemove);
    if (updatedList.length === 0) {
      onRemove();
    } else {
      onCapture(updatedList.length === 1 ? updatedList[0] : JSON.stringify(updatedList));
    }
  };

  return (
    <div 
      onClick={(e) => e.stopPropagation()} 
      style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '6px' }}
    >
      {/* Hidden native camera input */}
      <input
        id={`camera-input-${id}`}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        disabled={disabled || !canAddMore}
      />

      {/* Photo Gallery Strip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {photoList.map((photoUrl, idx) => (
          <div key={idx} style={{ position: 'relative', width: '64px', height: '64px' }}>
            <img 
              src={photoUrl} 
              alt={`Evidencia ${idx + 1}`} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }}
            />
            {!disabled && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemovePhoto(idx);
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
                title="Eliminar esta foto"
              >
                ✕
              </button>
            )}
            <span style={{
              position: 'absolute',
              bottom: '2px',
              left: '2px',
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: '#fff',
              fontSize: '8px',
              padding: '1px 3px',
              borderRadius: '2px',
              fontWeight: 'bold'
            }}>
              #{idx + 1}
            </span>
          </div>
        ))}

        {canAddMore && !disabled && (
          <button
            onClick={() => document.getElementById(`camera-input-${id}`).click()}
            className="btn btn-secondary"
            disabled={disabled}
            style={{
              padding: '6px 12px',
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
              cursor: 'pointer',
            }}
          >
            {label} {photoList.length > 0 ? `(${photoList.length}/${maxPhotos})` : ''}
          </button>
        )}
      </div>

      {/* Observation Comment Input */}
      {onObservationChange && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
          <span style={{ fontSize: '11px' }}>📝</span>
          <input
            type="text"
            placeholder="Añadir observación o detalle adicional (opcional)..."
            value={observation}
            onChange={(e) => onObservationChange(e.target.value)}
            disabled={disabled}
            style={{
              flex: 1,
              padding: '5px 10px',
              fontSize: '11.5px',
              borderRadius: '4px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-main)'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CameraEvidence;
