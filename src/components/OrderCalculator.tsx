import React, { useState } from 'react';
import { STORE_INFO } from '../data/storeData';
import {
  Truck,
  CreditCard,
  Building2,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
}

interface OrderCalculatorProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onConsultEcoBotWithOrder: (query: string) => void;
}

export const OrderCalculator: React.FC<OrderCalculatorProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onConsultEcoBotWithOrder,
}) => {
  const [destination, setDestination] = useState<'caba_gba' | 'resto'>('caba_gba');
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'credit_card'>('transfer');

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isFreeShipping = subtotal >= STORE_INFO.shipping.freeThreshold;
  const shippingCost = isFreeShipping
    ? 0
    : destination === 'caba_gba'
    ? STORE_INFO.shipping.gbaCaba
    : STORE_INFO.shipping.restOfCountry;

  // 10% discount on transfer
  const transferDiscount = paymentMethod === 'transfer' ? subtotal * 0.1 : 0;
  const total = Math.max(0, subtotal - transferDiscount + shippingCost);

  const installmentAmount = Math.round(total / 3);
  const missingForFreeShipping = Math.max(0, STORE_INFO.shipping.freeThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / STORE_INFO.shipping.freeThreshold) * 100));

  const handleAskEcoBotAboutOrder = () => {
    const itemsDescription = cart.map((i) => `${i.quantity}x ${i.productName} (${i.color}, talle ${i.size})`).join(', ');
    const destinationLabel = destination === 'caba_gba' ? 'CABA / GBA' : 'el resto del país';
    const paymentLabel = paymentMethod === 'transfer' ? 'Transferencia (con 10% OFF)' : '3 cuotas sin interés';

    const question = `¡Hola EcoBot! 🌱 Armé un pedido con: ${itemsDescription || 'ninguna prenda aún'}. Destino: ${destinationLabel}. Pago con: ${paymentLabel}. ¿Podrías confirmarme el costo final con envío y descuento según las políticas de VerdeUrbano?`;
    onConsultEcoBotWithOrder(question);
  };

  return (
    <div id="calculador" className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold text-stone-900">Simulador de Pedido y Envíos</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
              Reglas Oficiales
            </span>
          </div>
          <p className="text-sm text-stone-500 mt-1">
            Calculá tu total con envío y descuentos exactos de VerdeUrbano.
          </p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer self-start sm:self-center"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Vaciar pedido</span>
          </button>
        )}
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="my-6 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
        <div className="flex items-center justify-between text-xs font-semibold text-emerald-950 mb-2">
          <div className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-emerald-700" />
            <span>
              {isFreeShipping
                ? '¡Felicitaciones! ¡Tenés ENVÍO GRATIS a todo el país! 🎉'
                : `Te faltan $${missingForFreeShipping.toLocaleString('es-AR')} para tener Envío Gratis`}
            </span>
          </div>
          <span className="text-emerald-800 font-bold">{progressPercent}%</span>
        </div>

        <div className="w-full h-2.5 bg-emerald-200/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[11px] text-emerald-800/80 mt-1.5">
          * Superando los $45.000 el envío es bonificado 100% a cualquier punto de Argentina.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-stone-700 flex items-center justify-between">
            <span>Prendas en tu orden ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
            <span className="text-xs font-normal text-stone-500">Vicente López, BA</span>
          </h4>

          {cart.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300">
              <p className="text-stone-500 text-sm font-medium">
                Tu orden está vacía actualmente.
              </p>
              <p className="text-xs text-stone-400 mt-1">
                Elegí una Remera Eco-Cotton ($18.000) o un Buzo Recycled Fleece ($38.000) arriba.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 bg-stone-50 rounded-2xl border border-stone-200 gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-bold text-stone-900 truncate">
                      {item.productName}
                    </h5>
                    <p className="text-xs text-stone-500">
                      Color: <strong className="text-stone-700">{item.color}</strong> · Talle:{' '}
                      <strong className="text-stone-700">{item.size}</strong>
                    </p>
                    <p className="text-xs font-bold text-emerald-800 mt-0.5">
                      ${item.price.toLocaleString('es-AR')} c/u
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white rounded-xl border border-stone-200 p-0.5 shadow-xs">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                        title="Disminuir"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                        title="Aumentar"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-2 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Eliminar del pedido"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Destination Selector */}
          <div className="pt-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              Destino del Envío:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setDestination('caba_gba')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  destination === 'caba_gba'
                    ? 'border-emerald-700 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-stone-900">GBA y CABA</span>
                  <span className="text-xs font-bold text-emerald-800">
                    {isFreeShipping ? 'GRATIS' : `$${STORE_INFO.shipping.gbaCaba.toLocaleString('es-AR')}`}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Buenos Aires y alrededores cercanos
                </p>
              </button>

              <button
                onClick={() => setDestination('resto')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  destination === 'resto'
                    ? 'border-emerald-700 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-stone-900">Resto del País</span>
                  <span className="text-xs font-bold text-emerald-800">
                    {isFreeShipping ? 'GRATIS' : `$${STORE_INFO.shipping.restOfCountry.toLocaleString('es-AR')}`}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Todas las provincias de Argentina
                </p>
              </button>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              Medio de Pago:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod('transfer')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'transfer'
                    ? 'border-emerald-700 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-sm text-stone-900">Transferencia Bancaria</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    10% OFF
                  </span>
                  <span className="text-xs text-stone-500">en el total de tus prendas</span>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'credit_card'
                    ? 'border-emerald-700 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-sm text-stone-900">Tarjetas de Crédito</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-xs font-extrabold text-stone-800 bg-stone-100 px-2 py-0.5 rounded-full">
                    3 Cuotas Sin Interés
                  </span>
                  <span className="text-xs text-stone-500">todas las tarjetas</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Summary Box */}
        <div className="lg:col-span-5 bg-stone-50 rounded-2xl p-6 border border-stone-200 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-base font-bold text-stone-900 pb-3 border-b border-stone-200">
              Resumen de la Orden
            </h4>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal prendas:</span>
                <span className="font-semibold text-stone-800">
                  ${subtotal.toLocaleString('es-AR')}
                </span>
              </div>

              {transferDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Descuento 10% Transferencia:</span>
                  <span>-${transferDiscount.toLocaleString('es-AR')}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span className="flex items-center gap-1">
                  <span>Envío ({destination === 'caba_gba' ? 'GBA / CABA' : 'Resto del país'}):</span>
                </span>
                <span className={`font-semibold ${isFreeShipping ? 'text-emerald-700' : 'text-stone-800'}`}>
                  {isFreeShipping ? 'GRATIS' : `$${shippingCost.toLocaleString('es-AR')}`}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200">
              <div className="flex items-baseline justify-between">
                <span className="text-base font-bold text-stone-900">Total Final:</span>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-emerald-900">
                    ${total.toLocaleString('es-AR')}
                  </span>
                  {paymentMethod === 'credit_card' && total > 0 && (
                    <p className="text-xs text-stone-600 font-medium mt-0.5">
                      o 3 cuotas fijas de <strong>${installmentAmount.toLocaleString('es-AR')}</strong>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Guarantees according to document */}
            <div className="pt-4 space-y-2 text-xs text-stone-600">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Política de Cambios:</strong> 30 días de recibida con etiqueta y sin uso.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Origen Ético:</strong> Vicente López, Buenos Aires.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-2">
            <button
              onClick={handleAskEcoBotAboutOrder}
              disabled={cart.length === 0}
              className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm disabled:cursor-not-allowed"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Preguntarle a EcoBot sobre este pedido</span>
            </button>
            <p className="text-[11px] text-stone-400 text-center">
              EcoBot verificará disponibilidades, talles y opciones de entrega.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
