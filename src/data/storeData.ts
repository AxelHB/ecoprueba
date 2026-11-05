export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  colors: string[];
  sizes: string[];
  ecoFeature: string;
  badge: string;
  category: string;
  imageAlt: string;
  colorHexMap: Record<string, string>;
}

export interface StoreInfo {
  brand: string;
  tagline: string;
  location: string;
  shipping: {
    freeThreshold: number;
    gbaCaba: number;
    restOfCountry: number;
    notes: string;
  };
  products: Product[];
  paymentMethods: string[];
  exchangePolicy: string;
  humanSupport: {
    whatsapp: string;
    hours: string;
    link: string;
  };
}

export const STORE_INFO: StoreInfo = {
  brand: 'VerdeUrbano - Moda Sustentable',
  tagline: 'Prendas con propósito, confeccionadas de manera ética en Vicente López.',
  location: 'Vicente López, Buenos Aires, Argentina',
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
      description: '100% algodón orgánico certificado. Suavidad natural, respirabilidad y durabilidad sin pesticidas ni químicos nocivos.',
      price: 18000,
      colors: ['Blanco', 'Negro', 'Verde Musgo'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      ecoFeature: '100% Algodón orgánico certificado 🌱',
      badge: 'Básico Esencial',
      category: 'Remeras',
      imageAlt: 'Remera de algodón orgánico VerdeUrbano',
      colorHexMap: {
        'Blanco': '#F8F9FA',
        'Negro': '#1E1E1E',
        'Verde Musgo': '#4A5D43',
      },
    },
    {
      id: 'buzo-recycled-fleece',
      name: 'Buzo Recycled Fleece',
      description: 'Fabricado con hilo de botellas PET recicladas (equivalente a 12 botellas por buzo). Abrigado, liviano y con impacto ambiental positivo.',
      price: 38000,
      colors: ['Gris Topo', 'Azul Marino'],
      sizes: ['M', 'L', 'XL'],
      ecoFeature: '12 Botellas PET recicladas por prenda ♻️',
      badge: 'Abrigo Sustentable',
      category: 'Buzos',
      imageAlt: 'Buzo de friza reciclada VerdeUrbano',
      colorHexMap: {
        'Gris Topo': '#5A5E6B',
        'Azul Marino': '#1E2A38',
      },
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
    link: 'https://wa.me/541199998888?text=Hola%20VerdeUrbano!%20Vengo%20de%20la%20tienda%20online',
  },
};

export const QUICK_PROMPTS = [
  {
    icon: '👕',
    label: 'Productos y precios',
    prompt: '¡Hola! ¿Qué productos tienen disponibles y cuáles son sus precios y talles?',
  },
  {
    icon: '🚚',
    label: 'Costos de envío',
    prompt: '¿Cuánto cuesta el envío a CABA o al interior del país, y cuándo es gratis?',
  },
  {
    icon: '💳',
    label: 'Medios de pago y cuotas',
    prompt: '¿Qué medios de pago aceptan? ¿Tienen cuotas o descuento por transferencia?',
  },
  {
    icon: '👟',
    label: 'Consultar por otros productos',
    prompt: '¿Tienen pantalones de jean o zapatillas deportivas?',
  },
  {
    icon: '🔄',
    label: 'Política de cambios',
    prompt: 'Si me queda mal el talle, ¿cómo es la política de cambios?',
  },
  {
    icon: '📦',
    label: 'Envío gratis en combo',
    prompt: 'Si llevo una remera y un buzo, ¿tengo envío gratis?',
  },
];
