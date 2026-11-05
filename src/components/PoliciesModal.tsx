import React from 'react';
import { STORE_INFO } from '../data/storeData';
import { Truck, RotateCcw, CreditCard, MessageCircle, MapPin, X, ExternalLink } from 'lucide-react';

interface PoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskEcoBot: (topic: string) => void;
}

export const PoliciesModal: React.FC<PoliciesModalProps> = ({
  isOpen,
  onClose,
  onAskEcoBot,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-300">
              🌱
            </div>
            <div>
              <h3 className="text-lg font-bold">Políticas y Envíos Oficiales</h3>
              <p className="text-xs text-emerald-200">VerdeUrbano Moda Sustentable</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-stone-700">
          {/* Ubicación */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center shrink-0 text-stone-700">
              <MapPin className="w-4 h-4 text-emerald-800" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900">Ubicación</h4>
              <p className="text-stone-600 mt-0.5">{STORE_INFO.location}</p>
            </div>
          </div>

          {/* Envíos */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-800">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900">Envíos a todo el país</h4>
              <ul className="list-disc list-inside mt-1 space-y-1 text-stone-600">
                <li>
                  <strong className="text-emerald-800">Envíos gratis</strong> a todo el país en compras superiores a $45.000.
                </li>
                <li>
                  Compras menores a $45.000:
                  <ul className="list-none pl-5 pt-1 space-y-0.5 text-xs">
                    <li>• GBA y CABA: <strong>$3.500</strong> fijo.</li>
                    <li>• Resto del país: <strong>$5.000</strong> fijo.</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>

          {/* Medios de Pago */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-800">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900">Medios de Pago</h4>
              <ul className="list-disc list-inside mt-1 space-y-1 text-stone-600">
                {STORE_INFO.paymentMethods.map((method, idx) => (
                  <li key={idx}>{method}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Política de Cambios */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-800">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900">Política de Cambios</h4>
              <p className="text-stone-600 mt-1 leading-relaxed">
                {STORE_INFO.exchangePolicy}
              </p>
            </div>
          </div>

          {/* Contacto Humano WhatsApp */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-stone-900 text-sm">Atención por WhatsApp</h5>
                <p className="text-xs text-stone-600">
                  {STORE_INFO.humanSupport.whatsapp} · {STORE_INFO.humanSupport.hours}
                </p>
              </div>
            </div>

            <a
              href={STORE_INFO.humanSupport.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors shrink-0"
            >
              <span>Abrir WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onAskEcoBot('¡Hola EcoBot! 🌱 ¿Podrías explicarme en detalle la política de cambios y los plazos?');
            }}
            className="text-xs text-emerald-800 font-semibold hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Consultar sobre cambios a EcoBot</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
