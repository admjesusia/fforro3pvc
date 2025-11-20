
export interface Product {
  id: string;
  name: string;
  category: 'Forro' | 'Arremate' | 'Acessorio' | 'Estrutura';
  subCategory?: string; // e.g., 'PVC', 'PVC Canelado', 'Moldura', etc.
  dimensions: {
    width?: number; // meters
    length?: number; // meters
    thickness?: number; // mm
    diameter?: string; // for screws/drills
  };
  color: string;
  price: number;
  unit: string; // 'br' (barra), 'un' (unidade), 'm2', 'cx' (caixa)
  compatibleColors?: string[]; // For logic matching
}

export interface Dimensions {
  width: number;
  length: number;
}

export interface MaterialItem {
  product: Product;
  quantity: number;
  total: number;
  obs?: string;
}

export interface BudgetResult {
  id: string;
  mainProducts: MaterialItem[];
  finishingProducts: MaterialItem[];
  structureProducts: MaterialItem[];
  accessoriesProducts: MaterialItem[];
  totalMaterialCost: number;
  laborCost: number;
  totalProjectCost: number;
  dimensions: Dimensions;
  wasteFactor: number;
  economyJustification: string;
}

export interface AiInsight {
  tips: string[];
  economyJustification: string;
}
