import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RotateCcw, Sparkles, MessageCircle, AlertCircle, X, ExternalLink } from 'lucide-react';
import { QUICK_PROMPTS, STORE_INFO } from '../data/storeData';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface EcoBotChatProps {
  isOpen?: boolean;
  onClose?: () => void;
  externalPrompt?: string | null;
  onClearExternalPrompt?: () => void;
  isFloating?: boolean;
}

const INITIAL_GREETING: ChatMessage = {
  id: 'greeting',
  role: 'assistant',
  text: `¡Hola! Soy **EcoBot** 🌱, el asistente virtual oficial de **VerdeUrbano**. 

Confeccionamos prendas conscientes en Vicente López, Buenos Aires:
- **Remera Eco-Cotton**: 100% algodón orgánico certificado ($18.000).
- **Buzo Recycled Fleece**: elaborado con 12 botellas PET recicladas ($38.000).

Además contamos con **envíos gratis superando los $45.000**, 10% OFF por transferencia bancaria y 3 cuotas sin interés 🚚💳.

¿En qué producto te gustaría que te asesore hoy o cómo puedo ayudarte con tu pedido?`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

export const EcoBotChat: React.FC<EcoBotChatProps> = ({
  isOpen = true,
  onClose,
  externalPrompt,
  onClearExternalPrompt,
  isFloating = false,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle external prompts when clicked from product cards or calculator
  useEffect(() => {
    if (externalPrompt) {
      handleSendMessage(externalPrompt);
      if (onClearExternalPrompt) {
        onClearExternalPrompt();
      }
    }
  }, [externalPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    setErrorNotice(null);
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      // Map messages for the server-side Gemini API endpoint
      const payloadMessages = newMessages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Error del servidor (${res.status})`);
      }

      const data = await res.json();
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: data.reply || 'Disculpa, no pude procesar la respuesta. Por favor intenta de nuevo 🌱.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorNotice(err.message || 'Ocurrió un error al contactar a EcoBot.');
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        ...INITIAL_GREETING,
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setErrorNotice(null);
  };

  // Helper to format text with bullets and bolding
  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split('\n');
    const containsWhatsApp = rawText.includes('+54 11 9999-8888') || rawText.includes('WhatsApp');

    return (
      <div className="space-y-1.5 text-sm leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} className="h-1.5" />;
          }

          // Bullet point format
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const content = trimmed.substring(2);
            return (
              <div key={idx} className="flex items-start gap-2 pl-1 my-0.5">
                <span className="text-emerald-600 font-bold leading-none mt-1">🌱</span>
                <span>{renderInlineStyles(content)}</span>
              </div>
            );
          }

          return <p key={idx}>{renderInlineStyles(trimmed)}</p>;
        })}

        {/* If message references WhatsApp or customer service, show direct WhatsApp button */}
        {containsWhatsApp && (
          <div className="pt-2">
            <a
              href={STORE_INFO.humanSupport.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Contactar por WhatsApp (+54 11 9999-8888)</span>
              <ExternalLink className="w-3 h-3 text-emerald-200" />
            </a>
          </div>
        )}
      </div>
    );
  };

  const renderInlineStyles = (text: string) => {
    // Basic bold parser for **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-stone-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className={`flex flex-col bg-stone-50 border border-stone-200 shadow-xl overflow-hidden ${
        isFloating
          ? 'fixed bottom-5 right-5 w-full sm:w-[420px] h-[600px] max-h-[85vh] rounded-3xl z-50 animate-in fade-in slide-in-from-bottom-4 duration-200'
          : 'w-full h-[650px] rounded-3xl'
      }`}
    >
      {/* Chat Header */}
      <div className="bg-emerald-900 text-stone-100 p-4 flex items-center justify-between border-b border-emerald-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 border border-emerald-600 flex items-center justify-center text-white shadow-inner">
              <Bot className="w-5 h-5 text-emerald-300" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-emerald-900" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm tracking-tight text-white">EcoBot</h3>
              <span className="text-[10px] bg-emerald-700/80 px-1.5 py-0.5 rounded text-emerald-200 font-medium">
                Oficial
              </span>
            </div>
            <p className="text-xs text-emerald-200">
              VerdeUrbano Moda Sustentable · Vicente López
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleResetChat}
            className="p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-800/80 rounded-lg transition-colors cursor-pointer"
            title="Reiniciar conversación"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-800/80 rounded-lg transition-colors cursor-pointer"
              title="Cerrar chat"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="bg-stone-100/90 px-3 py-2 border-b border-stone-200/80 overflow-x-auto no-scrollbar flex items-center gap-1.5">
        <span className="text-[11px] font-semibold text-stone-500 whitespace-nowrap pl-1">
          Preguntas rápidas:
        </span>
        {QUICK_PROMPTS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(item.prompt)}
            disabled={isLoading}
            className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border border-stone-200 hover:border-emerald-300 transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-stone-50/50">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <div
              key={message.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs shadow-xs ${
                  isUser
                    ? 'bg-stone-800 text-stone-200'
                    : 'bg-emerald-800 text-emerald-200'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-stone-800 shadow-xs ${
                  isUser
                    ? 'bg-stone-900 text-stone-100 rounded-tr-xs'
                    : 'bg-white border border-stone-200 rounded-tl-xs'
                }`}
              >
                <div className="text-xs font-bold mb-1 opacity-70">
                  {isUser ? 'Tú' : 'EcoBot'}
                </div>
                {isUser ? (
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                ) : (
                  renderFormattedText(message.text)
                )}
                <div
                  className={`text-[10px] mt-1.5 text-right ${
                    isUser ? 'text-stone-400' : 'text-stone-400'
                  }`}
                >
                  {message.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-emerald-800 text-emerald-200 flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs">
              <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>EcoBot está escribiendo...</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
        )}

        {/* Error notice */}
        {errorNotice && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{errorNotice}</p>
              <button
                onClick={() => handleSendMessage()}
                className="mt-1 underline text-rose-900 font-semibold cursor-pointer"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-3 bg-white border-t border-stone-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Preguntale a EcoBot sobre prendas, envíos o pagos..."
            disabled={isLoading}
            className="flex-1 bg-stone-50 border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs disabled:cursor-not-allowed shrink-0"
            title="Enviar mensaje"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between text-[11px] text-stone-400 px-1">
          <span>Respuestas basadas en datos oficiales de VerdeUrbano</span>
          <span>Vicente López 🌱</span>
        </div>
      </div>
    </div>
  );
};
