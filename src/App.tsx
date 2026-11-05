import React, { useState } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { EcoBotChat } from './components/EcoBotChat';
import { OrderCalculator, CartItem } from './components/OrderCalculator';
import { PoliciesModal } from './components/PoliciesModal';
import { STORE_INFO, QUICK_PROMPTS } from './data/storeData';
import {
  Leaf,
  Sparkles,
  Bot,
  Truck,
  RotateCcw,
  ShieldCheck,
  MessageCircle,
  HelpCircle,
  Layers,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'default-item-1',
      productId: 'remera-eco-cotton',
      productName: 'Remera Eco-Cotton',
      color: 'Verde Musgo',
      size: 'M',
      price: 18000,
      quantity: 1,
    },
  ]);

  const [isChatFloatingOpen, setIsChatFloatingOpen] = useState(false);
  const [isPoliciesOpen, setIsPoliciesOpen] = useState(false);
  const [activeExternalPrompt, setActiveExternalPrompt] = useState<string | null>(null);

  // Cart operations
  const handleAddToCart = (item: {
    productId: string;
    productName: string;
    color: string;
    size: string;
    price: number;
  }) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === item.productId && i.color === item.color && i.size === item.size
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + 1,
        };
        return next;
      }
      return [
        ...prev,
        {
          id: `${item.productId}-${item.color}-${item.size}-${Date.now()}`,
          ...item,
          quantity: 1,
        },
      ];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleTriggerChatWithPrompt = (prompt: string) => {
    setActiveExternalPrompt(prompt);
    // Smooth scroll to the main chat or open the floating chat
    const chatElement = document.getElementById('ecobot-section');
    if (chatElement) {
      chatElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsChatFloatingOpen(true);
    }
  };

  const cartTotalItems = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Header */}
      <Header
        onOpenChat={() => {
          const chatElement = document.getElementById('ecobot-section');
          if (chatElement) {
            chatElement.scrollIntoView({ behavior: 'smooth' });
          } else {
            setIsChatFloatingOpen(true);
          }
        }}
        cartCount={cartTotalItems}
        onOpenCart={() => {
          document.getElementById('calculador')?.scrollIntoView({ behavior: 'smooth' });
        }}
        isChatOpen={isChatFloatingOpen}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        {/* Hero Section */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 text-stone-100 p-8 sm:p-12 lg:p-16 shadow-xl border border-emerald-800">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-700/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-700/70 text-xs font-semibold text-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Moda Sustentable · Confección Ética en Vicente López</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Prendas conscientes que cuidan el planeta 🌱
            </h1>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              Bienvenido a <strong className="text-white">VerdeUrbano</strong>. Descubrí nuestra colección boutique elaborada con{' '}
              <span className="text-emerald-300 font-semibold">100% algodón orgánico certificado</span> y{' '}
              <span className="text-emerald-300 font-semibold">botellas PET recicladas</span>. Conocé a{' '}
              <strong>EcoBot</strong>, nuestro asistente virtual oficial listo para ayudarte en cada detalle.
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap gap-4 pt-2 text-xs sm:text-sm font-medium text-emerald-100">
              <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-sm">
                <Leaf className="w-4 h-4 text-emerald-300" />
                <span>100% Orgánico & Reciclado</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-sm">
                <Truck className="w-4 h-4 text-emerald-300" />
                <span>Envíos gratis sobre $45.000</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-sm">
                <Bot className="w-4 h-4 text-emerald-300" />
                <span>Asistente EcoBot en línea</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#ecobot-section"
                className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                <span>Consultar a EcoBot</span>
              </a>

              <a
                href="#catalogo"
                className="px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20 flex items-center gap-2"
              >
                <span>Ver Catálogo Boutique</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => setIsPoliciesOpen(true)}
                className="px-4 py-3.5 rounded-xl text-emerald-200 hover:text-white text-sm font-medium transition-colors cursor-pointer"
              >
                Ver Envíos y Políticas
              </button>
            </div>
          </div>
        </section>

        {/* Catalog Section */}
        <section id="catalogo" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                  Colección Oficial VerdeUrbano
                </h2>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  2 Productos Exclusivos
                </span>
              </div>
              <p className="text-stone-500 text-sm mt-1">
                Materiales puros y reciclados con trazabilidad ética en Vicente López, Buenos Aires.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-stone-600 bg-stone-100 px-4 py-2 rounded-xl">
              <span>💡 Hacé clic en <strong>"Consultar a EcoBot"</strong> para ver talles y disponibilidad</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {STORE_INFO.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAskEcoBot={handleTriggerChatWithPrompt}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>

        {/* Embedded EcoBot Assistant Section */}
        <section id="ecobot-section" className="space-y-6 pt-4">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
              <Bot className="w-3.5 h-3.5" />
              <span>Asistente Virtual Oficial</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Hablá en tiempo real con EcoBot 🌱
            </h2>
            <p className="text-stone-600 text-sm">
              Preguntale sobre prendas, colores, talles, costos de envío a tu localidad y medios de pago.
              EcoBot responde exclusivamente con la base autorizada de VerdeUrbano.
            </p>
          </div>

          {/* Behavior Rules Highlight Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white rounded-2xl border border-stone-200 text-center">
              <span className="text-base block mb-1">🌱</span>
              <strong className="block text-stone-900">Tono Verde</strong>
              <span className="text-stone-500">Amable, motivador y consciente</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-stone-200 text-center">
              <span className="text-base block mb-1">🛡️</span>
              <strong className="block text-stone-900">Rigor Fáctico</strong>
              <span className="text-stone-500">Sin inventar productos ni precios</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-stone-200 text-center">
              <span className="text-base block mb-1">📋</span>
              <strong className="block text-stone-900">Respuestas Claras</strong>
              <span className="text-stone-500">Breves y con viñetas ordenadas</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-stone-200 text-center">
              <span className="text-base block mb-1">💬</span>
              <strong className="block text-stone-900">WhatsApp Directo</strong>
              <span className="text-stone-500">+54 11 9999-8888 para consultas</span>
            </div>
          </div>

          {/* Chat Container */}
          <div className="max-w-3xl mx-auto">
            <EcoBotChat
              isOpen={true}
              externalPrompt={activeExternalPrompt}
              onClearExternalPrompt={() => setActiveExternalPrompt(null)}
              isFloating={false}
            />
          </div>
        </section>

        {/* Order & Shipping Simulator */}
        <section className="space-y-6 pt-4">
          <OrderCalculator
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onConsultEcoBotWithOrder={handleTriggerChatWithPrompt}
          />
        </section>

        {/* Information & Trust Section */}
        <section id="politicas" className="bg-stone-100 rounded-3xl p-8 lg:p-10 border border-stone-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center mb-3">
                <Truck className="w-5 h-5 text-emerald-300" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">Envíos a todo el país</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                ¡Envíos gratis en compras desde $45.000! En compras menores: $3.500 fijo en GBA y CABA, y $5.000 al resto del país.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center mb-3">
                <RotateCcw className="w-5 h-5 text-emerald-300" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">Política de Cambios</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Hasta 30 días de recibida tu compra con prenda y etiqueta sin uso. Costos de envío a cargo del cliente (salvo falla).
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center mb-3">
                <MessageCircle className="w-5 h-5 text-emerald-300" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">Contacto Humano</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                ¿Tenés consultas especiales? Nuestro equipo te atiende por WhatsApp al <strong>+54 11 9999-8888</strong> de Lunes a Viernes de 9 a 18 hs.
              </p>
              <a
                href={STORE_INFO.humanSupport.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-bold hover:underline pt-1"
              >
                <span>Chatear por WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Floating EcoBot Launcher when user scrolls down */}
      {!isChatFloatingOpen && (
        <button
          onClick={() => setIsChatFloatingOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-emerald-800 hover:bg-emerald-900 text-white p-3.5 rounded-2xl shadow-xl flex items-center gap-3 transition-transform hover:scale-105 cursor-pointer border border-emerald-700"
          title="Abrir chat flotante con EcoBot"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-emerald-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div className="text-left hidden sm:block pr-1">
            <span className="block text-xs font-bold leading-tight">EcoBot 🌱</span>
            <span className="block text-[10px] text-emerald-200">Asistente en línea</span>
          </div>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isChatFloatingOpen && (
        <EcoBotChat
          isOpen={true}
          onClose={() => setIsChatFloatingOpen(false)}
          externalPrompt={activeExternalPrompt}
          onClearExternalPrompt={() => setActiveExternalPrompt(null)}
          isFloating={true}
        />
      )}

      {/* Policies Modal */}
      <PoliciesModal
        isOpen={isPoliciesOpen}
        onClose={() => setIsPoliciesOpen(false)}
        onAskEcoBot={handleTriggerChatWithPrompt}
      />

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs py-10 mt-16 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 flex items-center justify-center text-white">
              <Leaf className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">VerdeUrbano - Moda Sustentable</p>
              <p className="text-[11px] text-stone-400">Vicente López, Buenos Aires, Argentina</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-stone-400">
            <button
              onClick={() => setIsPoliciesOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Políticas de Cambio
            </button>
            <a href="#catalogo" className="hover:text-white transition-colors">
              Prendas
            </a>
            <a
              href={STORE_INFO.humanSupport.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors"
            >
              WhatsApp (+54 11 9999-8888)
            </a>
          </div>

          <p className="text-[11px] text-stone-500 text-center sm:text-right">
            EcoBot Asistente Oficial · Comprometidos con el consumo consciente 🌱
          </p>
        </div>
      </footer>
    </div>
  );
}
