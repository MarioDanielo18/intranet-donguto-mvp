import React, { useState } from 'react';

const INITIAL_MENU_ITEMS = [
  // CAFETERÍA DE ESPECIALIDAD
  {
    id: 'M-1',
    category: 'Cafetería de Especialidad',
    name: 'Espresso Don Guto',
    price: 'S/. 7.50',
    description: 'Extracción clásica del café de especialidad de Cajamarca. Cuerpo balanceado, notas de chocolate, caramelo y acidez cítrica brillante.',
    ingredients: '18g de café molido seco, 36g de líquido en taza (Ratio 1:2), extraído en 26 segundos a 93°C.',
    allergens: [],
    time: '2 min',
    icon: '☕'
  },
  {
    id: 'M-2',
    category: 'Cafetería de Especialidad',
    name: 'Café Americano',
    price: 'S/. 8.50',
    description: 'Doble shot de espresso vertido sobre agua caliente a 90°C. Ideal para resaltar las notas limpias y florales del origen.',
    ingredients: 'Espresso doble Don Guto (36g), 150ml de agua caliente filtrada.',
    allergens: [],
    time: '2 min',
    icon: '🥤'
  },
  {
    id: 'M-3',
    category: 'Cafetería de Especialidad',
    name: 'Flat White',
    price: 'S/. 11.00',
    description: 'Doble ristretto corto con leche emulsionada sedosa y una capa muy fina de microespuma. Mayor concentración y sabor intenso a café.',
    ingredients: 'Doble ristretto (30g), 120ml de leche entera fresca emulsionada a 60°C. Servido en taza de 6oz.',
    allergens: ['Lácteos'],
    time: '3 min',
    icon: '🥛'
  },
  {
    id: 'M-4',
    category: 'Cafetería de Especialidad',
    name: 'Cappuccino Tradicional',
    price: 'S/. 10.50',
    description: 'Espresso con leche texturizada que crea una densa y persistente corona de microespuma (1 cm de espesor). Textura cremosa.',
    ingredients: 'Espresso simple (18g), leche entera emulsionada a 62°C con espuma consistente. Taza de 8oz.',
    allergens: ['Lácteos'],
    time: '3 min',
    icon: '☕'
  },
  {
    id: 'M-5',
    category: 'Cafetería de Especialidad',
    name: 'Café Latte',
    price: 'S/. 10.50',
    description: 'Espresso simple combinado con abundante leche caliente y una fina capa de crema elástica, ideal para dibujos de Latte Art.',
    ingredients: 'Espresso simple (18g), 200ml de leche emulsionada sedosa a 63°C. Servido en taza de 10oz.',
    allergens: ['Lácteos'],
    time: '3 min',
    icon: '🥛'
  },
  {
    id: 'M-6',
    category: 'Cafetería de Especialidad',
    name: 'Método V60 / Filtrado',
    price: 'S/. 12.00',
    description: 'Café de especialidad extraído mediante goteo artesanal. Resalta un cuerpo ligero, acidez limpia y notas complejas.',
    ingredients: '15g de café Cajamarca molienda media, 250ml de agua a 91°C en ratio 1:16.6. Tiempo de extracción de 3 min.',
    allergens: [],
    time: '4 min',
    icon: '🧪'
  },
  {
    id: 'M-7',
    category: 'Cafetería de Especialidad',
    name: 'Cold Brew Nitro-Soft',
    price: 'S/. 11.50',
    description: 'Café infusionado en frío por 16 horas. De textura sedosa, sabor naturalmente dulce, baja acidez y muy refrescante.',
    ingredients: 'Café Cajamarca concentrado macerado en frío, servido con hielo.',
    allergens: [],
    time: '2 min',
    icon: '🥃'
  },
  // BEBIDAS REFRESCANTES & AUTOR
  {
    id: 'M-8',
    category: 'Bebidas & Autor',
    name: 'Espresso Tonic',
    price: 'S/. 12.00',
    description: 'Una combinación burbujeante y refrescante de agua tónica premium con un doble shot de espresso frío encima y rodaja de limón.',
    ingredients: 'Espresso doble Don Guto (enfriado), 150ml de agua tónica premium, hielo, rodaja de limón o naranja.',
    allergens: [],
    time: '2 min',
    icon: '🍹'
  },
  {
    id: 'M-9',
    category: 'Bebidas & Autor',
    name: 'Limonada Don Guto',
    price: 'S/. 8.00',
    description: 'Limonada de la casa batida, refrescante y endulzada con nuestro jarabe de goma artesanal.',
    ingredients: 'Zumo de limón fresco, agua filtrada, jarabe de goma artesanal, hielo.',
    allergens: [],
    time: '2 min',
    icon: '🍋'
  },
  {
    id: 'M-10',
    category: 'Bebidas & Autor',
    name: 'Té Frutal de la Casa',
    price: 'S/. 9.50',
    description: 'Infusión fría de hibisco y frutos rojos con jarabe artesanal de durazno, servido con hojas de menta fresca.',
    ingredients: 'Infusión de frutos rojos, jarabe de durazno artesanal, zumo de limón, menta fresca, hielo.',
    allergens: [],
    time: '3 min',
    icon: '🍹'
  },
  {
    id: 'M-11',
    category: 'Bebidas & Autor',
    name: 'Chocolate Caliente 70%',
    price: 'S/. 10.00',
    description: 'Bebida reconfortante elaborada con pasta de cacao al 70% de Cajamarca y leche cremosa. Sabor robusto a chocolate real.',
    ingredients: 'Cacao cajamarquino al 70%, leche entera emulsionada, jarabe artesanal dulce.',
    allergens: ['Lácteos'],
    time: '3 min',
    icon: '🍫'
  },
  // PASTELERÍA & PANADERÍA
  {
    id: 'M-12',
    category: 'Pastelería & Panadería',
    name: 'Galleta Choco-Chips con Sal de Mar',
    price: 'S/. 6.50',
    description: 'Galleta artesanal horneada con trozos generosos de chocolate oscuro al 60% y un toque de sal marina en escamas para balancear.',
    ingredients: 'Harina de trigo, trozos de chocolate oscuro, mantequilla de pastelería, azúcar rubia, sal de mar.',
    allergens: ['Gluten', 'Lácteos'],
    time: '1 min',
    icon: '🍪'
  },
  {
    id: 'M-13',
    category: 'Pastelería & Panadería',
    name: 'Torta de Chocolate Don Guto',
    price: 'S/. 12.00',
    description: 'Nuestra famosa porción de torta húmeda de chocolate con doble relleno de fudge artesanal. Suave, densa e irresistible.',
    ingredients: 'Bizcochuelo de cacao al 100%, relleno de fudge de leche artesanal y cobertura de fudge.',
    allergens: ['Gluten', 'Lácteos', 'Huevo'],
    time: '1 min',
    icon: '🍰'
  },
  {
    id: 'M-14',
    category: 'Pastelería & Panadería',
    name: 'Croissant de Mantequilla',
    price: 'S/. 7.00',
    description: 'Hojaldre de estilo francés, sumamente crujiente por fuera y aireado por dentro, elaborado con 100% mantequilla pura.',
    ingredients: 'Masa hojaldrada francesa fermentada, mantequilla, horneado del día.',
    allergens: ['Gluten', 'Lácteos'],
    time: '2 min (caliente)',
    icon: '🥐'
  },
  {
    id: 'M-15',
    category: 'Pastelería & Panadería',
    name: 'Muffin de Arándanos Silvestres',
    price: 'S/. 8.00',
    description: 'Muffin esponjoso relleno de arándanos enteros frescos y cubierto con un crujiente crumble de vainilla.',
    ingredients: 'Arándanos frescos, harina de repostería, mantequilla, crumble crujiente.',
    allergens: ['Gluten', 'Lácteos', 'Huevo'],
    time: '1 min',
    icon: '🧁'
  },
  // SÁNDWICHES & SALADOS
  {
    id: 'M-16',
    category: 'Sándwiches & Salados',
    name: 'Sándwich Caprese en Pan Focaccia',
    price: 'S/. 14.50',
    description: 'Focaccia artesanal con aceite de oliva, rellena de láminas de queso mozzarella premium, rodajas de tomate, albahaca y pesto artesanal.',
    ingredients: 'Pan focaccia de la casa, mozzarella fresca, tomate italiano, albahaca de huerto, pesto de nueces y albahaca.',
    allergens: ['Gluten', 'Lácteos', 'Frutos secos'],
    time: '5 min (plancha)',
    icon: '🥪'
  },
  {
    id: 'M-17',
    category: 'Sándwiches & Salados',
    name: 'Croissant de Jamón y Queso Edam',
    price: 'S/. 11.00',
    description: 'Nuestro croissant de mantequilla calentado a la plancha, relleno de jamón inglés seleccionado y queso edam derretido.',
    ingredients: 'Croissant de mantequilla, jamón inglés premium, queso edam derretido.',
    allergens: ['Gluten', 'Lácteos'],
    time: '4 min (plancha)',
    icon: '🥐'
  },
  {
    id: 'M-18',
    category: 'Sándwiches & Salados',
    name: 'Pan con Asado de Res Glaseado',
    price: 'S/. 16.50',
    description: 'Asado de res cocido lentamente en su salsa demi-glace por 6 horas, deshilachado y servido caliente en pan ciabatta crocante.',
    ingredients: 'Carne de res estofada, reducción demi-glace, salsa criolla ligera opcional, pan ciabatta de costra dura.',
    allergens: ['Gluten'],
    time: '6 min (horno/plancha)',
    icon: '🥖'
  }
];

export default function CartaDigital({ user }) {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Manage mock live stock / availability state: true = available, false = out of stock (86)
  const [availability, setAvailability] = useState(() => {
    const saved = localStorage.getItem('donguto-menu-availability');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS.reduce((acc, item) => {
      acc[item.id] = true; // all default available
      return acc;
    }, {});
  });

  const toggleAvailability = (itemId) => {
    setAvailability(prev => {
      const updated = {
        ...prev,
        [itemId]: !prev[itemId]
      };
      localStorage.setItem('donguto-menu-availability', JSON.stringify(updated));
      return updated;
    });
  };

  const categories = ['Todas', 'Cafetería de Especialidad', 'Bebidas & Autor', 'Pastelería & Panadería', 'Sándwiches & Salados'];

  // Filter items based on category and search query
  const filteredItems = INITIAL_MENU_ITEMS.filter(item => {
    const matchCategory = selectedCategory === 'Todas' || item.category === selectedCategory;
    const cleanQuery = searchQuery.toLowerCase().trim();
    const matchSearch = cleanQuery === '' || 
      item.name.toLowerCase().includes(cleanQuery) ||
      item.description.toLowerCase().includes(cleanQuery) ||
      item.ingredients.toLowerCase().includes(cleanQuery) ||
      item.allergens.some(a => a.toLowerCase().includes(cleanQuery));
    return matchCategory && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
      
      {/* Header Info */}
      <div style={{ borderBottom: '2px solid var(--border)', paddingBottom: '10px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}>
        <div>
          <h3 style={{ margin: 0, color: 'var(--primary)' }}>Carta Digital & Fichas Técnicas</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Consulta de precios, ingredientes, alérgenos y tiempos. Los colaboradores pueden marcar productos como <strong>Agotados (86)</strong>.
          </p>
        </div>
        
        {/* Quick manual download info */}
        <div style={{
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          fontSize: '11px',
          fontWeight: 700,
          padding: '6px 12px',
          borderRadius: '20px',
          border: '1px solid var(--primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          📋 Carta Física QR en Salón: Activa
        </div>
      </div>

      {/* Search and Filters panel */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        backgroundColor: 'var(--bg-card)',
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="input"
            placeholder="🔍 Buscar por nombre, insumos, alérgenos (ej: 'Leche', 'Gluten', 'Espresso')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>

        {/* Category filter buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="btn"
              style={{
                padding: '6px 12px',
                fontSize: '11.5px',
                backgroundColor: selectedCategory === cat ? 'var(--primary)' : 'var(--bg-main)',
                color: selectedCategory === cat ? '#fff' : 'var(--text-main)',
                border: selectedCategory === cat ? 'none' : '1px solid var(--border)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Items */}
      {filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          No se encontraron productos con los filtros seleccionados.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {filteredItems.map(item => {
            const isAvailable = availability[item.id] !== false;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: isAvailable ? '1px solid var(--border)' : '1px dashed var(--error)',
                  backgroundColor: 'var(--bg-card)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  opacity: isAvailable ? 1 : 0.85,
                  boxShadow: 'var(--shadow-sm)'
                }}
                className="menu-card-item"
              >
                <style dangerouslySetInnerHTML={{__html: `
                  .menu-card-item:hover {
                    transform: translateY(-3px);
                    box-shadow: var(--shadow-md) !important;
                    border-color: var(--primary) !important;
                  }
                `}} />

                {/* Card Top */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    {/* Emoji + Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '24px' }}>{item.icon}</span>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>{item.name}</h4>
                        <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>{item.category}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary)' }}>{item.price}</span>
                  </div>

                  {/* Description */}
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4, height: '40px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {item.description}
                  </p>
                </div>

                {/* Card Bottom / Badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '10px', marginTop: '4px' }}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {item.allergens.slice(0, 2).map(all => (
                      <span key={all} style={{ fontSize: '9px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                        {all}
                      </span>
                    ))}
                    {item.allergens.length === 0 && (
                      <span style={{ fontSize: '9px', backgroundColor: 'var(--success-light)', color: 'var(--success)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                        Libre Alérgenos
                      </span>
                    )}
                  </div>

                  {/* Stock State Badge */}
                  <span style={{
                    fontSize: '9.5px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '12px',
                    backgroundColor: isAvailable ? 'var(--success-light)' : 'var(--error-light)',
                    color: isAvailable ? 'var(--success)' : 'var(--error)',
                    border: '1px solid currentColor',
                    textTransform: 'uppercase'
                  }}>
                    {isAvailable ? 'Disponible' : 'AGOTADO (86)'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (() => {
        const isAvailable = availability[selectedItem.id] !== false;
        return (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(44, 37, 35, 0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            animation: 'fadeIn 0.2s ease-out'
          }} onClick={() => setSelectedItem(null)}>
            
            <div style={{
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '550px',
              width: '100%',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border)',
              overflow: 'hidden',
              animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }} onClick={(e) => e.stopPropagation()}>
              
              {/* Modal Header */}
              <div style={{
                padding: '20px',
                borderBottom: '1px solid var(--border)',
                backgroundColor: 'var(--bg-card)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '32px' }}>{selectedItem.icon}</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text-main)', fontWeight: 800 }}>
                      {selectedItem.name}
                    </h3>
                    <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{selectedItem.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '20px',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Price and Preparation Time */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>PRECIO DE VENTA</span>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)' }}>{selectedItem.price}</span>
                  </div>
                  <div className="card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>TIEMPO DE PREPARACIÓN</span>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--secondary)' }}>⏱️ {selectedItem.time}</span>
                  </div>
                </div>

                {/* Description */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>DESCRIPCIÓN DE CARTA:</span>
                  <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-main)', lineHeight: 1.5 }}>
                    {selectedItem.description}
                  </p>
                </div>

                {/* Ingredients & Specs (Ficha Técnica) */}
                <div style={{
                  padding: '15px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--primary-light)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <span style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.5px' }}>
                    📝 FICHA TÉCNICA (INGREDIENTES & GRAMAJES):
                  </span>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-main)', lineHeight: 1.5, fontWeight: 500 }}>
                    {selectedItem.ingredients}
                  </p>
                </div>

                {/* Allergens Warn */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>ALÉRGENOS DECLARADOS:</span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {selectedItem.allergens.length === 0 ? (
                      <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        🟢 Producto libre de alérgenos comunes (Gluten, Lácteos, Huevos, Frutos Secos).
                      </span>
                    ) : (
                      selectedItem.allergens.map(all => (
                        <span key={all} style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: '#fffbeb',
                          color: '#d97706',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: '1px solid #fef3c7',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          ⚠️ Contiene {all}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Stock Toggle Action */}
                <div style={{
                  borderTop: '1px solid var(--border)',
                  paddingTop: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>ESTADO OPERATIVO EN SEDE (BARRANCO):</span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: isAvailable ? 'var(--success-light)' : 'var(--error-light)',
                    border: `1px solid ${isAvailable ? 'var(--success)' : 'var(--error)'}`
                  }}>
                    <div>
                      <strong style={{ fontSize: '12.5px', color: 'var(--text-main)', display: 'block' }}>
                        {isAvailable ? 'Disponible para Venta' : 'Producto Agotado (Código 86)'}
                      </strong>
                      <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                        {isAvailable ? 'Se muestra activo en carta y comandas.' : 'Alerta enviada a salón y caja.'}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => toggleAvailability(selectedItem.id)}
                      className="btn"
                      style={{
                        padding: '6px 14px',
                        fontSize: '11.5px',
                        backgroundColor: isAvailable ? 'var(--error)' : 'var(--success)',
                        color: '#fff',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      {isAvailable ? 'Marcar Agotado (86)' : 'Habilitar Stock'}
                    </button>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '12px 20px',
                borderTop: '1px solid var(--border)',
                backgroundColor: 'var(--bg-card)',
                textAlign: 'right'
              }}>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="btn btn-secondary"
                  style={{ padding: '6px 16px', fontSize: '12px' }}
                >
                  Cerrar
                </button>
              </div>

            </div>

          </div>
        );
      })()}

    </div>
  );
}
