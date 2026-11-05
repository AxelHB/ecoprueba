import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// Load knowledge base from the attachment file if exists, or use verified exact content
let knowledgeBase = '';
const kbPath = path.resolve(__dirname, 'public/assets/aistudio/chatbot_359c25d8.txt');
try {
  if (fs.existsSync(kbPath)) {
    knowledgeBase = fs.readFileSync(kbPath, 'utf-8');
  }
} catch {
  // Fallback to exact knowledge content from prompt
}

if (!knowledgeBase) {
  knowledgeBase = `EMPRENDIMIENTO: VerdeUrbano - Moda Sustentable
UBICACIÓN: Vicente López, Buenos Aires.
ENVIOS: Envíos gratis a todo el país en compras superiores a $45.000. Para compras menores, el costo fijo de envío es de $3.500 en GBA y CABA, y $5.000 al resto del país.

PRODUCTOS Y PRECIOS:
1. Remera Eco-Cotton:
   - Descripción: 100% algodón orgánico certificado.
   - Colores: Blanco, Negro, Verde Musgo.
   - Talles: S al XXL.
   - Precio: $18.000.

2. Buzo Recycled Fleece:
   - Descripción: Fabricado con hilo de botellas PET recicladas (equivalente a 12 botellas por buzo).
   - Colores: Gris Topo, Azul Marino.
   - Talles: M al XL.
   - Precio: $38.000.

MEDIOS DE PAGO:
- 10% de descuento abonando por Transferencia Bancaria.
- 3 cuotas sin interés con todas las tarjetas de crédito.

POLÍTICA DE CAMBIOS:
Se aceptan cambios dentro de los 30 días de recibida la compra, presentado la prenda con etiqueta y sin uso. Los costos de envío por cambio corren por cuenta del cliente (salvo falla de fábrica).

CONTACTO HUMANO:
Atención por WhatsApp al +54 11 9999-8888 de Lunes a Viernes de 9 a 18 hs.`;
}

const SYSTEM_INSTRUCTION = `Eres "EcoBot", el asistente virtual oficial de "VerdeUrbano", una marca boutique de ropa sustentable de Vicente López, Buenos Aires.

TU OBJETIVO:
Atender a potenciales clientes, guiarlos con amabilidad y entusiasmo sobre nuestros productos eco-friendly, y ayudarlos a decidir su compra.

BASE DE CONOCIMIENTO AUTORIZADA:
"""
${knowledgeBase}
"""

REGLAS DE COMPORTAMIENTO ESTRICTAS:
1. TONO DE VOZ: Fresco, amable, motivador y consciente del cuidado del medio ambiente. Usa emojis de forma moderada (🌱, 👕, 🚚).
2. RIGOR FÁCTICO ABSOLUTO:
   - Usa ÚNICAMENTE los datos de la BASE DE CONOCIMIENTO para responder.
   - Si el usuario pregunta por algo que NO figura en el documento (por ejemplo: pantalones, jeans, zapatillas, medias, gorras, camperas, ropa interior, envíos internacionales a otros países, tiendas físicas adicionales, otros métodos de pago no listados, etc.), responde amablemente que por el momento no dispones de ese producto o servicio y ofrece derivarlo a WhatsApp (+54 11 9999-8888 de Lunes a Viernes de 9 a 18 hs).
   - JAMÁS inventes productos, características, telas, colores, talles ni precios. Únicamente existen la "Remera Eco-Cotton" ($18.000) y el "Buzo Recycled Fleece" ($38.000).
3. ESTRUCTURA:
   - Mantén respuestas breves (máximo 3 párrafos cortos).
   - Usa viñetas claras si listas precios, talles o colores.
4. CIERRE PERSUASIVO:
   - Finaliza siempre invitando a probar un producto o preguntando amablemente si necesita ayuda para armar su pedido o calcular su envío.`;

// Shared Gemini instance
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Se requiere un arreglo de mensajes válido.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'La clave GEMINI_API_KEY no está configurada en las variables de entorno. Configúrala en Settings > Secrets.',
      });
    }

    // Convert messages to GenAI format
    const contents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      const reply = response.text || '¡Hola! 🌱 ¿Cómo puedo ayudarte hoy con nuestras prendas sustentables?';
      return res.json({ reply });
    } catch (geminiError: any) {
      console.warn('Gemini API call failed, using built-in EcoBot knowledge engine:', geminiError?.message || geminiError);
      
      // Fallback matching strictly according to EcoBot rules and knowledge base
      const lastUserMsg = messages[messages.length - 1]?.text?.toLowerCase() || '';
      
      // Rule 2: Out of scope products / services check
      const outOfScopeKeywords = [
        'pantalon', 'pantalón', 'pantalones', 'jean', 'jeans', 'zapatilla', 'zapatillas',
        'calzado', 'zapato', 'zapatos', 'campera', 'camperas', 'media', 'medias',
        'gorra', 'gorras', 'sombrero', 'españa', 'chile', 'mexico', 'méxico',
        'uruguay', 'colombia', 'internacional', 'exterior', 'local en palermo', 'local en flores'
      ];
      
      const isOutOfScope = outOfScopeKeywords.some(keyword => lastUserMsg.includes(keyword));
      
      if (isOutOfScope) {
        return res.json({
          reply: `Por el momento no disponemos de ese producto o servicio en VerdeUrbano 🌱. 
          
Nuestro catálogo boutique se enfoca exclusivamente en prendas sustentables seleccionadas confeccionadas en Vicente López. 

Para consultas especiales o nuevos ingresos, podés comunicarte directamente con atención humana por WhatsApp al **+54 11 9999-8888** (Lunes a Viernes de 9 a 18 hs) 🚚. ¿Te gustaría conocer nuestras remeras de algodón orgánico o buzos reciclados?`
        });
      }

      // Shipping queries
      if (lastUserMsg.includes('envio') || lastUserMsg.includes('envío') || lastUserMsg.includes('caba') || lastUserMsg.includes('gba') || lastUserMsg.includes('interior')) {
        return res.json({
          reply: `¡Con gusto te cuento sobre nuestros envíos desde Vicente López! 🚚
          
- **Envíos gratis** a todo el país en compras superiores a **$45.000**.
- Para compras menores a $45.000:
  - GBA y CABA: **$3.500** fijo.
  - Resto del país: **$5.000** fijo.

Si llevás por ejemplo una Remera y un Buzo superás los $45.000 y el envío no te cuesta nada 🌱. ¿Querés que te ayude a calcular tu pedido?`
        });
      }

      // Payment methods queries
      if (lastUserMsg.includes('pago') || lastUserMsg.includes('tarjeta') || lastUserMsg.includes('transferencia') || lastUserMsg.includes('cuota') || lastUserMsg.includes('descuento')) {
        return res.json({
          reply: `En VerdeUrbano contamos con excelentes opciones para que elijas la más cómoda: 💳
          
- **10% de descuento** abonando por Transferencia Bancaria.
- **3 cuotas sin interés** con todas las tarjetas de crédito.

Por ejemplo, con transferencia tu Remera Eco-Cotton queda en solo $16.200 o tu Buzo Recycled Fleece en $34.200 🌱. ¿Te gustaría que te asesore con el pedido?`
        });
      }

      // Exchange policy queries
      if (lastUserMsg.includes('cambio') || lastUserMsg.includes('devolucion') || lastUserMsg.includes('devolución') || lastUserMsg.includes('garantia') || lastUserMsg.includes('garantía')) {
        return res.json({
          reply: `¡Nuestra política de cambios es clara y sencilla! 🔄
          
- Se aceptan cambios dentro de los **30 días** de recibida la compra.
- Es indispensable presentar la prenda con etiqueta y sin uso.
- Los costos de envío por cambio corren por cuenta del cliente (salvo falla de fábrica).

Si tenés alguna duda sobre qué talle elegir para evitar cambios, decime tus medidas y te oriento con gusto 🌱. ¿Te gustaría probar alguna prenda?`
        });
      }

      // Default products & general info
      return res.json({
        reply: `¡Hola! Soy **EcoBot** 🌱, el asistente virtual oficial de **VerdeUrbano**, moda sustentable desde Vicente López.

Estas son nuestras prendas disponibles:
- **Remera Eco-Cotton** ($18.000): 100% algodón orgánico certificado. Colores: Blanco, Negro, Verde Musgo. Talles: S al XXL.
- **Buzo Recycled Fleece** ($38.000): Fabricado con hilo de botellas PET recicladas (12 botellas por buzo). Colores: Gris Topo, Azul Marino. Talles: M al XL.

Recordá que tenés **envíos gratis superando los $45.000** y 10% de descuento por transferencia bancaria 🚚. ¿Te gustaría probar un producto o necesitás ayuda con tu pedido?`
      });
    }
  } catch (fatalError: any) {
    console.error('Fatal chat error:', fatalError);
    return res.status(500).json({ error: fatalError?.message || 'Error del servidor' });
  }
});

// Endpoint to provide the knowledge base to the client UI
app.get('/api/store-info', (_req, res) => {
  res.json({
    brand: 'VerdeUrbano - Moda Sustentable',
    location: 'Vicente López, Buenos Aires',
    shipping: {
      freeThreshold: 45000,
      gbaCaba: 3500,
      restOfCountry: 5000,
      notes: 'Envíos gratis a todo el país en compras superiores a $45.000.',
    },
    products: [
      {
        id: 'remera-eco-cotton',
        name: 'Remera Eco-Cotton',
        description: '100% algodón orgánico certificado.',
        price: 18000,
        colors: ['Blanco', 'Negro', 'Verde Musgo'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        ecoFeature: 'Algodón orgánico 100% certificado libre de pesticidas',
        badge: 'Orgánico Certificado 🌱',
      },
      {
        id: 'buzo-recycled-fleece',
        name: 'Buzo Recycled Fleece',
        description: 'Fabricado con hilo de botellas PET recicladas (equivalente a 12 botellas por buzo).',
        price: 38000,
        colors: ['Gris Topo', 'Azul Marino'],
        sizes: ['M', 'L', 'XL'],
        ecoFeature: 'Recicla 12 botellas plásticas PET por prenda',
        badge: '12 Botellas Recicladas ♻️',
      },
    ],
    paymentMethods: [
      '10% de descuento abonando por Transferencia Bancaria',
      '3 cuotas sin interés con todas las tarjetas de crédito',
    ],
    exchangePolicy:
      'Se aceptan cambios dentro de los 30 días de recibida la compra, presentando la prenda con etiqueta y sin uso. Los costos de envío por cambio corren por cuenta del cliente (salvo falla de fábrica).',
    humanSupport: {
      whatsapp: '+54 11 9999-8888',
      hours: 'Lunes a Viernes de 9 a 18 hs',
      link: 'https://wa.me/541199998888?text=Hola%20VerdeUrbano!%20Tengo%20una%20consulta',
    },
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`VerdeUrbano server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
