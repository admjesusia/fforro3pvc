import { Product } from '../types';

export const CATALOG: Product[] = [
  // --- FORROS ---
  // PVC Padrão / Liso / Neve
  { id: '62', name: 'Forro PVC 6MM x 6MT Branco', category: 'Forro', subCategory: 'PVC Liso', dimensions: { width: 0.20, length: 6.0 }, color: 'Branco', price: 15.50, unit: 'br' },
  { id: '105', name: 'Forro PVC 200x8MM BRC Neve', category: 'Forro', subCategory: 'PVC Liso', dimensions: { width: 0.20, length: 6.0 }, color: 'Branco Neve', price: 20.00, unit: 'br' },
  { id: '21', name: 'Forro PVC 12MT Branco', category: 'Forro', subCategory: 'PVC Liso', dimensions: { width: 0.20, length: 12.0 }, color: 'Branco', price: 40.00, unit: 'br' }, // Est price adjustment for length
  
  // PVC Madeirado
  { id: '79', name: 'Forro PVC Canelado 20cm Cerejeira', category: 'Forro', subCategory: 'PVC Madeirado', dimensions: { width: 0.20, length: 6.0 }, color: 'Cerejeira', price: 40.00, unit: 'br' },
  { id: '11', name: 'Forro PVC 25cm Imbuia', category: 'Forro', subCategory: 'PVC Madeirado', dimensions: { width: 0.25, length: 6.0 }, color: 'Imbuia', price: 45.00, unit: 'br' },
  { id: '66', name: 'Forro PVC 25cm Cerejeira', category: 'Forro', subCategory: 'PVC Madeirado', dimensions: { width: 0.25, length: 6.0 }, color: 'Cerejeira', price: 45.00, unit: 'br' },
  { id: '100', name: 'Forro PVC Mogno', category: 'Forro', subCategory: 'PVC Madeirado', dimensions: { width: 0.20, length: 6.0 }, color: 'Mogno', price: 45.00, unit: 'br' },
  { id: '67', name: 'Forro PVC Tabaco', category: 'Forro', subCategory: 'PVC Madeirado', dimensions: { width: 0.20, length: 6.0 }, color: 'Tabaco', price: 45.00, unit: 'br' },
  { id: '126', name: 'Forro PVC Amadeirado 6MT Malbec', category: 'Forro', subCategory: 'PVC Madeirado', dimensions: { width: 0.20, length: 6.0 }, color: 'Malbec', price: 60.00, unit: 'br' },

  // PVC Premium / Cores Especiais
  { id: '1', name: 'Forro PVC 25cm Armany', category: 'Forro', subCategory: 'PVC Premium', dimensions: { width: 0.25, length: 6.0 }, color: 'Armany', price: 45.00, unit: 'br' },
  { id: '95', name: 'Forro PVC 25cm Champanhe', category: 'Forro', subCategory: 'PVC Premium', dimensions: { width: 0.25, length: 6.0 }, color: 'Champanhe', price: 45.00, unit: 'br' },
  { id: '97', name: 'Forro PVC 25cm Cinza', category: 'Forro', subCategory: 'PVC Premium', dimensions: { width: 0.25, length: 6.0 }, color: 'Cinza', price: 45.00, unit: 'br' },
  { id: '33', name: 'Forro PVC 20cm Preto', category: 'Forro', subCategory: 'PVC Premium', dimensions: { width: 0.20, length: 6.0 }, color: 'Preto', price: 45.00, unit: 'br' },

  // Painéis
  { id: '118', name: 'Painel 2,90x0,18 Imbuia', category: 'Forro', subCategory: 'Painel', dimensions: { width: 0.18, length: 2.90 }, color: 'Imbuia', price: 100.00, unit: 'un' },
  { id: '117', name: 'Painel Ripado 2,90x0,18 Cerejeira', category: 'Forro', subCategory: 'Painel Ripado', dimensions: { width: 0.18, length: 2.90 }, color: 'Cerejeira', price: 100.00, unit: 'un' },
  { id: '122', name: 'Painel Ripado 2,90x0,18 Preto', category: 'Forro', subCategory: 'Painel Ripado', dimensions: { width: 0.18, length: 2.90 }, color: 'Preto', price: 100.00, unit: 'un' },

  // --- ARREMATES ---
  // Neutros / Brancos
  { id: '38', name: 'Arremate PVC U 6MT Branco', category: 'Arremate', subCategory: 'Tipo U', dimensions: { length: 6.0 }, color: 'Branco', price: 20.00, unit: 'br' },
  { id: '34', name: 'Arremate PVC Moldura 6MT Stili Branco', category: 'Arremate', subCategory: 'Moldura', dimensions: { length: 6.0 }, color: 'Branco', price: 25.00, unit: 'br' },
  { id: '35', name: 'Arremate PVC Moldura 7MT Eco Plast', category: 'Arremate', subCategory: 'Moldura', dimensions: { length: 7.0 }, color: 'Branco', price: 28.00, unit: 'br' },
  
  // Coloridos / Madeirados
  { id: '94', name: 'Arremate H Cerejeira', category: 'Arremate', subCategory: 'Tipo H', dimensions: { length: 6.0 }, color: 'Cerejeira', price: 40.00, unit: 'br' },
  { id: '85', name: 'Arremate U 6MT Cerejeira', category: 'Arremate', subCategory: 'Tipo U', dimensions: { length: 6.0 }, color: 'Cerejeira', price: 36.00, unit: 'br' },
  { id: '76', name: 'Arremate Stily 6MT Cerejeira', category: 'Arremate', subCategory: 'Moldura', dimensions: { length: 6.0 }, color: 'Cerejeira', price: 38.00, unit: 'br' },
  
  { id: '113', name: 'Arremate H Imbuia', category: 'Arremate', subCategory: 'Tipo H', dimensions: { length: 6.0 }, color: 'Imbuia', price: 40.00, unit: 'br' },
  { id: '125', name: 'Arremate U Imbuia', category: 'Arremate', subCategory: 'Tipo U', dimensions: { length: 6.0 }, color: 'Imbuia', price: 38.00, unit: 'br' },
  { id: '7', name: 'Arremate Stily 6MT Imbuia', category: 'Arremate', subCategory: 'Moldura', dimensions: { length: 6.0 }, color: 'Imbuia', price: 40.00, unit: 'br' },
  
  { id: '115', name: 'Arremate H Mogno', category: 'Arremate', subCategory: 'Tipo H', dimensions: { length: 6.0 }, color: 'Mogno', price: 40.00, unit: 'br' },
  { id: '104', name: 'Arremate Tipo U Mogno', category: 'Arremate', subCategory: 'Tipo U', dimensions: { length: 6.0 }, color: 'Mogno', price: 36.00, unit: 'br' },
  
  { id: '99', name: 'Arremate H Tabaco', category: 'Arremate', subCategory: 'Tipo H', dimensions: { length: 6.0 }, color: 'Tabaco', price: 40.00, unit: 'br' },
  { id: '86', name: 'Arremate U 6MT Tabaco', category: 'Arremate', subCategory: 'Tipo U', dimensions: { length: 6.0 }, color: 'Tabaco', price: 36.00, unit: 'br' },
  { id: '123', name: 'Arremate F Tabaco', category: 'Arremate', subCategory: 'Tipo F', dimensions: { length: 6.0 }, color: 'Tabaco', price: 38.00, unit: 'br' },

  { id: '9', name: 'Arremate Stily 6MT Armamy', category: 'Arremate', subCategory: 'Moldura', dimensions: { length: 6.0 }, color: 'Armany', price: 40.00, unit: 'br' },
  { id: '10', name: 'Arremate Moldura Gesso 6MT Armany', category: 'Arremate', subCategory: 'Moldura Gesso', dimensions: { length: 6.0 }, color: 'Armany', price: 45.00, unit: 'br' },
  
  { id: '96', name: 'Arremate Moldura Gesso 6MT Champanhe', category: 'Arremate', subCategory: 'Moldura Gesso', dimensions: { length: 6.0 }, color: 'Champanhe', price: 45.00, unit: 'br' },
  { id: '98', name: 'Arremate Moldura Gesso 7MT Cinza', category: 'Arremate', subCategory: 'Moldura Gesso', dimensions: { length: 7.0 }, color: 'Cinza', price: 45.00, unit: 'br' },
  { id: '82', name: 'Arremate Stily 6MT Preto', category: 'Arremate', subCategory: 'Moldura', dimensions: { length: 6.0 }, color: 'Preto', price: 45.00, unit: 'br' },
  { id: '127', name: 'Roda Forro 6MT Malbec', category: 'Arremate', subCategory: 'Moldura', dimensions: { length: 6.0 }, color: 'Malbec', price: 50.00, unit: 'br' },

  // --- CANTONEIRAS (Cantos Internos/Externos) ---
  { id: '120', name: 'Cantoneira 3MT Cerejeira', category: 'Arremate', subCategory: 'Cantoneira', dimensions: { length: 3.0 }, color: 'Cerejeira', price: 40.00, unit: 'br' },
  { id: '121', name: 'Cantoneira Imbuia', category: 'Arremate', subCategory: 'Cantoneira', dimensions: { length: 3.0 }, color: 'Imbuia', price: 40.00, unit: 'br' },
  { id: '119', name: 'Cantoneira 3MT Preta', category: 'Arremate', subCategory: 'Cantoneira', dimensions: { length: 3.0 }, color: 'Preto', price: 40.00, unit: 'br' },
  { id: '19', name: 'Canto Interno ER Branco', category: 'Arremate', subCategory: 'Canto', dimensions: {}, color: 'Branco', price: 8.00, unit: 'un' },

  // --- ACESSÓRIOS / ESTRUTURA ---
  { id: '25', name: 'Gancheira 3/8 Inox Polida', category: 'Acessorio', subCategory: 'Fixacao', dimensions: {}, color: 'Inox', price: 21.50, unit: 'un' },
  { id: '53', name: 'Torre Pinça 400mm C/2 Furos', category: 'Acessorio', subCategory: 'Fixacao', dimensions: {}, color: 'Zincado', price: 100.00, unit: 'un' }, 
  { id: '45', name: 'Parafuso Drywall Ponta Agulha 3,5x25', category: 'Acessorio', subCategory: 'Parafuso', dimensions: {}, color: 'Preto Fosfatizado', price: 0.10, unit: 'un' },
  { id: '44', name: 'Parafuso Chip Chata 4,0x35 Parede', category: 'Acessorio', subCategory: 'Parafuso', dimensions: {}, color: 'Zincado Amarelo', price: 0.15, unit: 'un' },
  
  // Generic Items for fallback logic (Simulated based on market if not in PDF)
  { id: 'GEN_METALON', name: 'Perfil Estrutural Metalon 15x15 6m', category: 'Estrutura', subCategory: 'Metalon', dimensions: { length: 6.0 }, color: 'Galvanizado', price: 42.00, unit: 'br' },
];