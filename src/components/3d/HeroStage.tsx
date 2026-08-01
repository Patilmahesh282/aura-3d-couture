import React, { useState } from 'react';
import { GarmentCanvas } from './GarmentCanvas';
import { motion } from 'motion/react';
import { Sparkles, Rotate3d, Sun, Moon, Zap, Layers, ChevronRight } from 'lucide-react';
import { Product } from '../../types';

interface HeroStageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onExploreCatalog: () => void;
}

export const HeroStage: React.FC<HeroStageProps> = ({ products, onSelectProduct, onExploreCatalog }) => {
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [environment, setEnvironment] = useState<'studio' | 'cyberpunk' | 'sunset'>('cyberpunk');

  const activeProduct = products[activeProductIndex] || products[0];
  const currentColor = selectedColor || activeProduct.defaultColor;

  return (
    <div id="hero-3d-stage" className="relative w-full h-[640px] md:h-[720px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl my-4">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      {/* R3F 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <GarmentCanvas
          modelType={activeProduct.modelType}
          color={currentColor}
          decal={activeProduct.decalOptions?.[0]}
          autoRotate={true}
          environmentPreset={environment}
          enableFloat={true}
          scale={1.1}
        />
      </div>

      {/* Top Floating Badge & Quick Controls */}
      <div className="absolute top-6 left-6 right-6 z-10 flex flex-wrap items-center justify-between gap-4 pointer-events-auto">
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700/60 shadow-lg text-xs font-semibold text-slate-200">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>Real-time R3F 3D Couture Studio</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </div>

        {/* Environment Preset Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-full border border-slate-700/60 shadow-lg">
          <button
            id="env-cyberpunk-btn"
            onClick={() => setEnvironment('cyberpunk')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              environment === 'cyberpunk'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> Cyber Neon
          </button>
          <button
            id="env-studio-btn"
            onClick={() => setEnvironment('studio')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              environment === 'studio'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" /> Studio Light
          </button>
          <button
            id="env-sunset-btn"
            onClick={() => setEnvironment('sunset')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              environment === 'sunset'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5" /> Sunset Golden
          </button>
        </div>
      </div>

      {/* Main Overlay Content (Left Overlay Info) */}
      <div className="absolute inset-y-0 left-0 z-10 w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-end md:justify-center pointer-events-none">
        <motion.div
          key={activeProduct.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-auto space-y-4 max-w-lg bg-slate-950/40 backdrop-blur-sm p-6 rounded-2xl border border-slate-800/40"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 text-cyan-400 text-xs font-mono border border-cyan-500/20">
            <span>SHOWCASE ITEM #{activeProductIndex + 1} OF {products.length}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            {activeProduct.name}
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            {activeProduct.tagline}
          </p>

          {/* Interactive Color Switcher for 3D Model */}
          <div className="pt-2 flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">3D Color Shade:</span>
            <div className="flex items-center gap-2">
              {activeProduct.colors.map(colorOpt => (
                <button
                  key={colorOpt.hex}
                  onClick={() => setSelectedColor(colorOpt.hex)}
                  title={colorOpt.name}
                  style={{ backgroundColor: colorOpt.hex }}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    currentColor === colorOpt.hex
                      ? 'border-cyan-400 scale-125 ring-2 ring-cyan-500/40'
                      : 'border-slate-700 hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Price & Primary Call To Action */}
          <div className="pt-4 flex items-center gap-4">
            <div>
              <span className="text-2xl md:text-3xl font-black text-white">${activeProduct.price}</span>
              {activeProduct.originalPrice && (
                <span className="ml-2 text-sm text-slate-500 line-through">${activeProduct.originalPrice}</span>
              )}
            </div>

            <button
              id="hero-customize-btn"
              onClick={() => onSelectProduct(activeProduct)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 text-sm"
            >
              <Rotate3d className="w-4 h-4" /> Open 3D Customizer
            </button>

            <button
              id="hero-explore-catalog-btn"
              onClick={onExploreCatalog}
              className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all flex items-center gap-1"
            >
              Catalog <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Carousel Selector for 3D Items */}
      <div className="absolute bottom-6 right-6 z-10 hidden md:flex items-center gap-3 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-xl">
        {products.map((prod, idx) => (
          <button
            key={prod.id}
            id={`hero-thumb-${idx}`}
            onClick={() => {
              setActiveProductIndex(idx);
              setSelectedColor(null);
            }}
            className={`px-3 py-2 rounded-xl text-left transition-all flex items-center gap-2.5 ${
              activeProductIndex === idx
                ? 'bg-cyan-500/20 border border-cyan-500/60 text-white'
                : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: prod.defaultColor }} />
            <div>
              <div className="text-xs font-bold leading-tight line-clamp-1">{prod.name}</div>
              <div className="text-[10px] text-cyan-400 font-mono">${prod.price}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
