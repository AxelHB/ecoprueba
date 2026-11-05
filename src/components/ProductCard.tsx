import React, { useState } from 'react';
import { Product } from '../data/storeData';
import { Sparkles, MessageSquare, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAskEcoBot: (question: string) => void;
  onAddToCart: (item: {
    productId: string;
    productName: string;
    color: string;
    size: string;
    price: number;
  }) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAskEcoBot,
  onAddToCart,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart({
      productId: product.id,
      productName: product.name,
      color: selectedColor,
      size: selectedSize,
      price: product.price,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const handleAskEcoBot = () => {
    const question = `¡Hola EcoBot! 🌱 Me interesa la ${product.name} en color ${selectedColor} (talle ${selectedSize}). ¿Podrías contarme sobre sus materiales sustentables y formas de pago?`;
    onAskEcoBot(question);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
      <div>
        {/* Visual Header / Card Hero */}
        <div className="relative p-6 bg-gradient-to-br from-stone-100 to-stone-200/70 border-b border-stone-200/80">
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-800 text-stone-100 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              {product.badge}
            </span>
            <span className="text-xs font-medium text-stone-600 bg-white/80 px-2.5 py-1 rounded-full backdrop-blur-sm">
              {product.category}
            </span>
          </div>

          {/* Product Icon & Visual preview based on selected color */}
          <div className="h-48 rounded-2xl flex flex-col items-center justify-center p-6 transition-colors duration-300 relative overflow-hidden bg-white/70 shadow-inner">
            <div
              className="w-24 h-24 rounded-2xl shadow-lg border-2 border-white flex flex-col items-center justify-center transition-all duration-300 transform group-hover:scale-105"
              style={{
                backgroundColor: product.colorHexMap[selectedColor] || '#4A5D43',
                color: selectedColor === 'Blanco' ? '#1E1E1E' : '#FFFFFF',
              }}
            >
              <span className="text-3xl">{product.id.includes('remera') ? '👕' : '🧥'}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider mt-1 px-1.5 py-0.5 rounded bg-black/20 text-white">
                {selectedColor}
              </span>
            </div>

            <div className="mt-3 text-center">
              <span className="text-xs text-stone-600 font-medium">Color seleccionado:</span>{' '}
              <strong className="text-xs text-stone-800">{selectedColor}</strong>
            </div>

            {/* Eco Tag Badge */}
            <div className="absolute bottom-2 left-3 right-3 text-center">
              <p className="text-[11px] text-emerald-800 font-medium bg-emerald-50 py-1 px-2.5 rounded-lg border border-emerald-100">
                {product.ecoFeature}
              </p>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-xl font-bold text-stone-900">{product.name}</h3>
            <span className="text-xl font-extrabold text-emerald-800 whitespace-nowrap">
              ${product.price.toLocaleString('es-AR')}
            </span>
          </div>

          <p className="text-sm text-stone-600 leading-relaxed mb-5">
            {product.description}
          </p>

          {/* Color Selection */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Colores Disponibles:
            </label>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => {
                const isSelected = selectedColor === color;
                const hex = product.colorHexMap[color] || '#4A5D43';
                return (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/80 text-emerald-950 font-semibold ring-2 ring-emerald-600/30'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-stone-300 shrink-0"
                      style={{ backgroundColor: hex }}
                    />
                    <span>{color}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Talles Disponibles:
            </label>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center border ${
                      isSelected
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 pt-0 flex flex-col gap-2.5">
        <button
          onClick={handleAddToCart}
          className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            justAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-stone-900 hover:bg-stone-800 text-white shadow-sm hover:shadow'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4 text-emerald-200" />
              <span>¡Agregado al pedido!</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Agregar al Pedido · ${product.price.toLocaleString('es-AR')}</span>
            </>
          )}
        </button>

        <button
          onClick={handleAskEcoBot}
          className="w-full py-2 px-4 rounded-xl font-medium text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Consultar detalles a EcoBot 🌱</span>
        </button>
      </div>
    </div>
  );
};
