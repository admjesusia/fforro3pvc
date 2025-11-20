
import React, { useState, useMemo } from 'react';
import { BudgetResult, AiInsight } from './types';
import { getInstallationInsights } from './services/geminiService';
import { calculateBudget, getForroSubCategories, getAvailableColors } from './services/calculationService';
import { CATALOG } from './data/catalog';
import CutDiagram from './components/CutDiagram';
import { 
  IconCalculator, 
  IconRuler, 
  IconCheck, 
  IconEconomy, 
  IconDashboard, 
  IconLoader, 
  IconSafety,
  IconMaximize,
  IconMinimize,
  IconInfo
} from './components/Icons';

function App() {
  // Input State
  const [width, setWidth] = useState<string>('');
  const [length, setLength] = useState<string>('');
  
  // Catalog Filters
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  // Result State
  const [budget, setBudget] = useState<BudgetResult | null>(null);
  const [aiData, setAiData] = useState<AiInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derived Data for Dropdowns
  const subCategories = useMemo(() => getForroSubCategories(), []);
  
  const availableColors = useMemo(() => {
    if (!selectedSubCategory) return [];
    return getAvailableColors(selectedSubCategory);
  }, [selectedSubCategory]);

  const availableProducts = useMemo(() => {
    if (!selectedSubCategory) return [];
    return CATALOG.filter(p => 
      p.category === 'Forro' && 
      p.subCategory === selectedSubCategory &&
      (!selectedColor || p.color === selectedColor)
    );
  }, [selectedSubCategory, selectedColor]);

  // Handlers
  const handleSubCategoryChange = (val: string) => {
    setSelectedSubCategory(val);
    setSelectedColor('');
    setSelectedProductId('');
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(width);
    const l = parseFloat(length);

    if (isNaN(w) || isNaN(l) || w <= 0 || l <= 0) {
      setError("Por favor, insira dimensões válidas.");
      return;
    }
    if (!selectedProductId) {
      setError("Selecione um produto para o forro.");
      return;
    }

    setLoading(true);
    setError(null);
    setBudget(null);
    setAiData(null);

    try {
      const result = await calculateBudget({ width: w, length: l }, selectedProductId);
      setBudget(result);

      // Get AI insights using the product name
      const product = CATALOG.find(p => p.id === selectedProductId);
      // We pass the subCategory as 'material type' for the prompt
      getInstallationInsights(w, l, (product?.subCategory || 'PVC') as any)
        .then(setAiData)
        .catch(console.error);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao calcular.");
    } finally {
      setLoading(false);
    }
  };

  const hasResults = !!budget;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 p-2 rounded-lg">
              <IconDashboard className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Orçamentação <span className="text-brand-600 font-light">Inteligente</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Configuration */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
              <IconRuler className="w-5 h-5 text-brand-600" />
              <h2 className="font-semibold text-slate-800">Configuração do Projeto</h2>
            </div>
            
            <form onSubmit={handleCalculate} className="p-6 space-y-5">
              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase text-slate-500">Largura (m)</label>
                  <div className="relative">
                    <IconMinimize className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="number"
                      step="0.01"
                      min="0.1"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase text-slate-500">Comprimento (m)</label>
                  <div className="relative">
                    <IconMaximize className="w-4 h-4 absolute left-3 top-3 text-slate-400 rotate-90" />
                    <input
                      type="number"
                      step="0.01"
                      min="0.1"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Type Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase text-slate-500">Tipo de Forro</label>
                <select
                  value={selectedSubCategory}
                  onChange={(e) => handleSubCategoryChange(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                >
                  <option value="">Selecione o Tipo...</option>
                  {subCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Color Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase text-slate-500">Cor / Acabamento</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  disabled={!selectedSubCategory}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value="">Todas as cores...</option>
                  {availableColors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>

              {/* Specific Product Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase text-slate-500">Produto Específico</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  disabled={!selectedSubCategory}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white disabled:bg-slate-100 disabled:text-slate-400 text-sm"
                >
                  <option value="">Selecione o produto...</option>
                  {availableProducts.map(p => (
                    <option key={p.id} value={p.id}>
                       {p.name} - R$ {p.price.toFixed(2)}/{p.unit}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                  <IconInfo className="w-4 h-4" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-brand-500/30 disabled:opacity-70"
              >
                {loading ? <IconLoader className="animate-spin" /> : <IconCalculator />}
                <span>Gerar Orçamento</span>
              </button>
            </form>
          </div>
          
          {/* Instructions */}
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
             <h3 className="text-indigo-900 font-semibold mb-2 flex items-center gap-2">
               <IconCheck className="w-4 h-4" /> Como funciona?
             </h3>
             <p className="text-indigo-700 text-sm">
               Selecione o tipo de forro e cor desejada. O sistema cruzará os dados com nosso catálogo para sugerir automaticamente os arremates e acessórios compatíveis (ciclo cromático), garantindo um orçamento preciso e harmônico.
             </p>
          </div>
        </section>

        {/* Right Column: Results */}
        <section className="lg:col-span-8 space-y-6">
          {!hasResults ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <IconDashboard className="w-16 h-16 mb-4 text-slate-300" />
              <p className="text-lg font-medium">Aguardando configuração</p>
            </div>
          ) : (
            <>
              {/* Totals */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                  <p className="text-xs text-slate-500 font-bold uppercase">Área</p>
                  <p className="text-2xl font-bold text-slate-800">{(budget.dimensions.width * budget.dimensions.length).toFixed(2)} m²</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                  <p className="text-xs text-slate-500 font-bold uppercase">Materiais</p>
                  <p className="text-2xl font-bold text-emerald-600">R$ {budget.totalMaterialCost.toFixed(2)}</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 ring-2 ring-brand-100">
                  <p className="text-xs text-brand-600 font-bold uppercase">Total Estimado</p>
                  <p className="text-2xl font-bold text-brand-700">R$ {budget.totalProjectCost.toFixed(2)}</p>
                  <p className="text-xs text-slate-400">+ Mão de Obra (R$ {budget.laborCost.toFixed(2)})</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                  <h3 className="font-bold text-slate-800">Detalhamento de Materiais</h3>
                </div>
                
                <div className="divide-y divide-slate-100">
                  {/* Main */}
                  <div className="p-4 bg-slate-50/50"><h4 className="text-xs font-bold uppercase text-slate-500">Forro (Principal)</h4></div>
                  {budget.mainProducts.map((item, i) => (
                    <div key={`m-${i}`} className="px-6 py-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-slate-800">{item.product.name}</p>
                        <p className="text-xs text-slate-500">{item.obs}</p>
                      </div>
                      <div className="text-right">
                         <p className="font-bold text-slate-700">R$ {item.total.toFixed(2)}</p>
                         <p className="text-xs text-slate-500">{item.quantity} {item.product.unit} x {item.product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}

                  {/* Finishing */}
                  {budget.finishingProducts.length > 0 && (
                    <>
                      <div className="p-4 bg-slate-50/50"><h4 className="text-xs font-bold uppercase text-slate-500">Acabamentos e Arremates</h4></div>
                      {budget.finishingProducts.map((item, i) => (
                        <div key={`f-${i}`} className="px-6 py-3 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-slate-800">{item.product.name}</p>
                            <p className="text-xs text-slate-500">{item.obs}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-700">R$ {item.total.toFixed(2)}</p>
                            <p className="text-xs text-slate-500">{item.quantity} {item.product.unit} x {item.product.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Structure & Access */}
                  {(budget.structureProducts.length > 0 || budget.accessoriesProducts.length > 0) && (
                    <>
                      <div className="p-4 bg-slate-50/50"><h4 className="text-xs font-bold uppercase text-slate-500">Estrutura e Acessórios</h4></div>
                      {[...budget.structureProducts, ...budget.accessoriesProducts].map((item, i) => (
                        <div key={`a-${i}`} className="px-6 py-3 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-slate-800">{item.product.name}</p>
                            <p className="text-xs text-slate-500">{item.obs}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-700">R$ {item.total.toFixed(2)}</p>
                            <p className="text-xs text-slate-500">{item.quantity} {item.product.unit} x {item.product.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* AI & Justification */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-lg">
                    <h3 className="font-bold mb-3 flex items-center gap-2"><IconEconomy className="text-emerald-400"/> Justificativa Automática</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                      {budget.economyJustification}
                    </p>
                    {aiData && (
                      <div className="mt-4 pt-4 border-t border-slate-700">
                        <p className="text-xs font-bold uppercase text-emerald-400 mb-2">Dicas de Instalação (IA)</p>
                        <ul className="space-y-2">
                          {aiData.tips.map((t, i) => <li key={i} className="text-sm text-slate-300">• {t}</li>)}
                        </ul>
                      </div>
                    )}
                 </div>

                 <div>
                    <CutDiagram dimensions={budget.dimensions} />
                 </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
