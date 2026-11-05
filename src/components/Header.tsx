import React from 'react';
import { Leaf, MessageSquare, ShoppingBag, ShieldCheck, Phone } from 'lucide-react';
import { STORE_INFO } from '../data/storeData';

interface HeaderProps {
  onOpenChat: (initialPrompt?: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  isChatOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenChat,
  cartCount,
  onOpenCart,
  isChatOpen,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Banner with Promotions */}
      <div className="bg-emerald-900 text-stone-100 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium">
              🌿 Envíos gratis a todo el país en compras superiores a $45.000
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-emerald-200">
            <span>💳 3 cuotas sin interés</span>
            <span className="hidden sm:inline">|</span>
            <span>⚡ 10% OFF por Transferencia</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">📍 Vicente López, Buenos Aires</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-sm shadow-emerald-900/10">
            <Leaf className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-stone-900">VerdeUrbano</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Sustentable
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium">Boutique de Moda Ética · Vicente López</p>
          </div>
        </div>

        {/* Quick Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <a href="#catalogo" className="hover:text-emerald-800 transition-colors">
            Catálogo
          </a>
          <a href="#calculador" className="hover:text-emerald-800 transition-colors">
            Calculador & Envíos
          </a>
          <a href="#politicas" className="hover:text-emerald-800 transition-colors">
            Cambios & Envíos
          </a>
          <a
            href={STORE_INFO.humanSupport.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-stone-600 hover:text-emerald-800 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp (+54 11 9999-8888)</span>
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Order / Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3 py-2 rounded-xl text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors text-sm font-medium cursor-pointer"
            title="Ver simulador de orden y envío"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-800" />
            <span className="hidden sm:inline">Tu Orden</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* EcoBot CTA Button */}
          <button
            onClick={() => onOpenChat()}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer ${
              isChatOpen
                ? 'bg-emerald-800 text-white ring-2 ring-emerald-600'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white hover:shadow-md'
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <MessageSquare className="w-4 h-4" />
            <span>Hablar con EcoBot</span>
          </button>
        </div>
      </div>
    </header>
  );
};
