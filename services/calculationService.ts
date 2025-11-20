
import { BudgetResult, Dimensions, MaterialItem, Product } from '../types';
import { CATALOG } from '../data/catalog';

interface CalculationOptions {
  wasteMargin: number; // 0.0 to 1.0 (e.g., 0.1 for 10%)
  structureType: 'Metálica' | 'Madeira';
}

// Helper to finding products
const findProduct = (
  category: string, 
  subCategory: string | null, 
  color: string | null
): Product | undefined => {
  // Attempt 1: Exact match
  const exactMatch = CATALOG.find(p => {
    const catMatch = p.category === category;
    const subMatch = subCategory ? p.subCategory?.includes(subCategory) : true;
    const colorMatch = color ? p.color.toLowerCase() === color.toLowerCase() : true;
    
    return catMatch && subMatch && colorMatch;
  });

  if (exactMatch) return exactMatch;

  // Attempt 2: Fallback to Branco/Generic if specific color not found
  // This is mostly for Arremates where we might want a neutral color if the specific wood color isn't available
  if (color) {
    return CATALOG.find(p => {
      const catMatch = p.category === category;
      const subMatch = subCategory ? p.subCategory?.includes(subCategory) : true;
      // Fallback: same category/sub but Generic color 'Branco'
      return catMatch && subMatch && p.color === 'Branco';
    });
  }

  return undefined;
};

export const getAvailableColors = (subCategory: string): string[] => {
  const colors = new Set<string>();
  CATALOG.forEach(p => {
    if (p.category === 'Forro' && p.subCategory === subCategory) {
      colors.add(p.color);
    }
  });
  return Array.from(colors);
};

export const getForroSubCategories = (): string[] => {
  const subs = new Set<string>();
  CATALOG.forEach(p => {
    if (p.category === 'Forro' && p.subCategory) {
      subs.add(p.subCategory);
    }
  });
  return Array.from(subs);
};

export const calculateBudget = async (
  dimensions: Dimensions,
  selectedForroId: string,
  options: CalculationOptions = { wasteMargin: 0.10, structureType: 'Metálica' }
): Promise<BudgetResult> => {
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const { width, length } = dimensions;
  const { structureType } = options;
  const mainProduct = CATALOG.find(p => p.id === selectedForroId);

  if (!mainProduct) {
    throw new Error("Produto principal não encontrado.");
  }

  const mainMaterials: MaterialItem[] = [];
  const finishingProducts: MaterialItem[] = [];
  const structureProducts: MaterialItem[] = [];
  const accessoriesProducts: MaterialItem[] = [];

  // --- 1. MAIN MATERIAL (FORRO) ---
  // Logic: Area / Board Area + Waste OR Width/StripWidth * Length
  // Robust Logic:
  // 1. Determine flow direction (usually parallel to longest side to minimize joints, 
  //    or parallel to shortest to minimize sag if structure is weak, but usually aesthetics dictate Longest).
  //    Let's assume installation parallel to Length.
  
  const stripWidth = mainProduct.dimensions.width || 0.20; // Default 20cm
  const stripLength = mainProduct.dimensions.length || 6.0; // Default 6m
  
  const numStripsWidth = Math.ceil(width / stripWidth);
  const totalLinearMeters = numStripsWidth * length;
  
  // Total bars needed
  const barsNeededRaw = totalLinearMeters / stripLength;
  const barsNeeded = Math.ceil(barsNeededRaw * (1 + options.wasteMargin));
  
  mainMaterials.push({
    product: mainProduct,
    quantity: barsNeeded,
    total: barsNeeded * mainProduct.price,
    obs: `Cobertura de ${(width * length).toFixed(2)}m² (considerando perdas)`
  });

  // --- 2. FINISHING (ARREMATES) ---
  // Perimeter
  const perimeter = 2 * (width + length);
  
  // Logic: Find Arremate compatible with Main Product Color
  // Preference hierarchy: Moldura (more value) > Stily > U (Simple)
  // Let's default to "Moldura" or "Stily" if available for Premium, "U" for standard/simple.
  
  let arremateType = 'Tipo U'; // Default
  if (mainProduct.subCategory?.includes('Premium') || mainProduct.subCategory?.includes('Madeirado')) {
    arremateType = 'Moldura'; // Try Moldura first for premium
  }
  
  // Find matching color arremate
  let arremateProduct = CATALOG.find(p => 
    p.category === 'Arremate' && 
    (p.subCategory?.includes(arremateType) || p.subCategory?.includes('Stily')) && 
    p.color === mainProduct.color
  );
  
  // If not found, fallback to 'Tipo U' with same color
  if (!arremateProduct) {
    arremateProduct = CATALOG.find(p => 
      p.category === 'Arremate' && 
      p.subCategory?.includes('Tipo U') && 
      p.color === mainProduct.color
    );
  }
  
  // If still not found, fallback to White/Neutral Moldura or U
  if (!arremateProduct) {
    arremateProduct = CATALOG.find(p => 
      p.category === 'Arremate' && 
      p.subCategory?.includes('Tipo U') && 
      p.color === 'Branco'
    );
  }

  if (arremateProduct) {
    const arremateLen = arremateProduct.dimensions.length || 6.0;
    const arrematesNeeded = Math.ceil((perimeter * 1.05) / arremateLen); // 5% margin
    
    finishingProducts.push({
      product: arremateProduct,
      quantity: arrematesNeeded,
      total: arrematesNeeded * arremateProduct.price,
      obs: `Perímetro: ${perimeter.toFixed(2)}m`
    });

    // Add Corners (Cantoneiras) if Madeirado/Premium and available
    const cornerProduct = CATALOG.find(p => 
      p.category === 'Arremate' && 
      p.subCategory?.includes('Cantoneira') && 
      p.color === mainProduct.color
    );
    
    if (cornerProduct) {
      // Usually 4 corners, but sold by bar (3m). 1 bar is enough for 4 corners usually.
      finishingProducts.push({
        product: cornerProduct,
        quantity: 1,
        total: cornerProduct.price,
        obs: 'Para cantos internos/externos'
      });
    } else {
      // Generic corner internal
      const cantoInt = CATALOG.find(p => p.subCategory === 'Canto' && p.color === 'Branco');
      if (cantoInt) {
         finishingProducts.push({
          product: cantoInt,
          quantity: 4,
          total: 4 * cantoInt.price,
          obs: 'Cantos internos (unid)'
        });
      }
    }
  }

  // --- 3. STRUCTURE (ESTRUTURA) ---
  // Grid spacing 0.60m. Structure lines run perpendicular to PVC.
  // If PVC is along Length, Structure is along Width.
  const structureSpacing = 0.60;
  const numStructureLines = Math.floor(length / structureSpacing) - 1; // Approx
  const structureLinearMeters = Math.max(0, numStructureLines * width);
  
  if (structureType === 'Metálica') {
    const metalon = CATALOG.find(p => p.id === 'GEN_METALON');
    if (metalon) {
      const metalonBars = Math.ceil(structureLinearMeters / (metalon.dimensions.length || 6));
      if (metalonBars > 0) {
        structureProducts.push({
          product: metalon,
          quantity: metalonBars,
          total: metalonBars * metalon.price,
          obs: `Estrutura Metalon a cada ${structureSpacing}m`
        });
      }
    }
    
    // Hangers (Gancheira/Tirante) for Metal Structure
    const gancheira = CATALOG.find(p => p.id === '25');
    if (gancheira) {
      const numHangers = Math.ceil((width * length) / 1.5);
      accessoriesProducts.push({
        product: gancheira,
        quantity: numHangers,
        total: numHangers * gancheira.price,
        obs: 'Sustentação para metalon'
      });
    }

  } else {
    // Madeira (Sarrafo)
    const sarrafo = CATALOG.find(p => p.id === 'GEN_SARRAFO');
    if (sarrafo) {
      const sarrafoBars = Math.ceil(structureLinearMeters / (sarrafo.dimensions.length || 3));
      if (sarrafoBars > 0) {
        structureProducts.push({
          product: sarrafo,
          quantity: sarrafoBars,
          total: sarrafoBars * sarrafo.price,
          obs: `Sarrafo de madeira a cada ${structureSpacing}m`
        });
      }
    }
    // Wood structure typically nailed or screwed to beams, assuming simple fixation if no specific hanger needed
    // or include generic fixation logic if needed. For now, no 'Gancheira' added for wood.
  }

  // --- 4. ACCESSORIES ---
  // Parafusos Fixação PVC -> Estrutura
  let screwProduct;
  let screwObs = 'Fixação PVC na estrutura';
  
  if (structureType === 'Metálica') {
    // Use Drywall Screw (Ponta Agulha)
    screwProduct = CATALOG.find(p => p.id === '45'); // Ponta Agulha 3.5x25
    screwObs = 'Ponta Agulha (PVC em Metal)';
  } else {
    // Use Wood Screw (Parafuso Ripa)
    screwProduct = CATALOG.find(p => p.id === '77'); // Parafuso Ripa 3.5x12
    screwObs = 'Parafuso Ripa (PVC em Madeira)';
  }

  if (screwProduct) {
    // Approx 20 screws per m2
    const numScrews = Math.ceil(width * length * 20);
    accessoriesProducts.push({
      product: screwProduct,
      quantity: numScrews,
      total: numScrews * screwProduct.price,
      obs: `${screwObs} (~20/m²)`
    });
  }
  
  // Fixação Parede (Chip Chata + Bucha implied) for finishing profiles
  const wallScrew = CATALOG.find(p => p.id === '44');
  if (wallScrew) {
    // Perimter / 0.5m
    const numWallScrews = Math.ceil(perimeter / 0.5);
    accessoriesProducts.push({
      product: wallScrew,
      quantity: numWallScrews,
      total: numWallScrews * wallScrew.price,
      obs: 'Fixação arremates (parede)'
    });
  }

  // --- TOTALS ---
  const totalMat = [
    ...mainMaterials,
    ...finishingProducts,
    ...structureProducts,
    ...accessoriesProducts
  ].reduce((acc, item) => acc + item.total, 0);

  const laborRate = 35.00; // Fixed estimate from previous code
  const laborCost = width * length * laborRate;

  // Justification Logic
  let justification = `Otimização baseada nas dimensões (${width}x${length}m) com estrutura ${structureType.toLowerCase()}. `;
  if (mainProduct.subCategory?.includes('Madeirado')) {
    justification += `A escolha do forro ${mainProduct.color} foi combinada automaticamente com arremates da mesma linha para harmonia estética. `;
  } else {
    justification += "Cálculo de aproveitamento de réguas com corte otimizado. ";
  }
  
  if (arremateProduct && arremateProduct.subCategory) {
    justification += `Inclui acabamento ${arremateProduct.subCategory} compatível.`;
  }

  return {
    id: Date.now().toString(),
    mainProducts: mainMaterials,
    finishingProducts,
    structureProducts,
    accessoriesProducts,
    totalMaterialCost: totalMat,
    laborCost,
    totalProjectCost: totalMat + laborCost,
    dimensions,
    wasteFactor: options.wasteMargin * 100,
    economyJustification: justification
  };
};
