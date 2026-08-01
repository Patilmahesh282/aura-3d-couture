import React, { useState } from 'react';
import { Product, Size } from '../types';
import { GarmentCanvas } from './3d/GarmentCanvas';
import { RealPhoto360Viewer } from './RealPhoto360Viewer';
import { X, Rotate3d, ShoppingBag, ShieldCheck, Truck, RotateCcw, Zap, Sparkles, Check, Camera } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: Size, selectedColor: string, decal?: string) => void;
  onInstantBuy: (product: Product, size: Size, selectedColor: string, decal?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onInstantBuy
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<Size>('M');
  const [selectedColor, setSelectedColor] = useState<string>(product.defaultColor);
  const [selectedDecal, setSelectedDecal] = useState<string | undefined>(product.decalOptions?.[0]);
  const [environment, setEnvironment] = useState<'studio' | 'cyberpunk' | 'sunset'>('cyberpunk');
  const [viewMode, setViewMode] = useState<'photo360' | '3d'>('photo360');
  const [added, setAdded] = useState(false);

  const stockCount = product.stock[selectedSize] || 0;

  const handleAddToCart = () => {
    if (stockCount <= 0) return;
    onAddToCart(product, selectedSize, selectedColor, selectedDecal);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (stockCount <= 0) return;
    onInstantBuy(product, selectedSize, selectedColor, selectedDecal);
  };

  const photoList = product.realPhotos360 && product.realPhotos360.length > 0
    ? product.realPhotos360
    : [product.imageUrl || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row my-8">
        
        {/* Close Modal Button */}
        <button
          id="close-product-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Interactive Real Photo 360 OR 3D Canvas Studio */}
        <div className="w-full md:w-1/2 h-96 md:h-[620px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
          
          {/* Top Mode Switcher */}
          <div className="absolute top-3 left-3 z-30 flex items-center gap-1 bg-slate-950/90 backdrop-blur-md p-1 rounded-2xl border border-slate-800">
            <button
              id="view-mode-photo360"
              onClick={() => setViewMode('photo360')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 transition-all ${
                viewMode === 'photo360'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" /> Real Garment 360° Photo
            </button>
            <button
              id="view-mode-3d"
              onClick={() => setViewMode('3d')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 transition-all ${
                viewMode === '3d'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Rotate3d className="w-3.5 h-3.5" /> 3D Canvas Orbit
            </button>
          </div>

          {viewMode === 'photo360' ? (
            <div className="w-full h-full">
              <RealPhoto360Viewer
                photos={photoList}
                productName={product.name}
                autoRotate={true}
                showControls={true}
                onOpenStudio3D={() => setViewMode('3d')}
              />
            </div>
          ) : (
            <div className="w-full h-full">
              <GarmentCanvas
                modelType={product.modelType}
                color={selectedColor}
                decal={selectedDecal}
                autoRotate={true}
                environmentPreset={environment}
                enableFloat={true}
                scale={1.15}
                showControls={true}
              />

              {/* Lighting Environment Switcher */}
              <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-center gap-2 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 text-xs">
                <span className="text-slate-400 font-mono text-[10px] uppercase pl-2">3D Studio Lighting:</span>
                <button
                  id="detail-env-cyber"
                  onClick={() => setEnvironment('cyberpunk')}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                    environment === 'cyberpunk' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cyberpunk
                </button>
                <button
                  id="detail-env-studio"
                  onClick={() => setEnvironment('studio')}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                    environment === 'studio' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Studio
                </button>
                <button
                  id="detail-env-sunset"
                  onClick={() => setEnvironment('sunset')}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                    environment === 'sunset' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sunset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Customizer & Product Configuration */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-6 overflow-y-auto max-h-[620px]">
          <div>
            {/* Header info */}
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 uppercase">{product.category}</span>
              <span>• REAL-TIME INVENTORY TRACKED</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white">{product.name}</h2>
            <p className="text-slate-400 text-xs md:text-sm mt-2 leading-relaxed">{product.description}</p>

            {/* Price & Real-time stock status */}
            <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-2xl font-black text-white">${product.price}</span>
                {product.originalPrice && (
                  <span className="ml-2 text-sm text-slate-500 line-through">${product.originalPrice}</span>
                )}
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
                stockCount > 5
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : stockCount > 0
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}>
                <span className={`w-2 h-2 rounded-full ${stockCount > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                {stockCount > 0 ? `${stockCount} units in Size ${selectedSize}` : `Size ${selectedSize} Out of Stock`}
              </div>
            </div>

            {/* Customizer Controls */}
            <div className="mt-6 space-y-5">
              {/* 1. Color Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  1. Fabric Color Finish:
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {product.colors.map(col => (
                    <button
                      key={col.hex}
                      onClick={() => setSelectedColor(col.hex)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
                        selectedColor === col.hex
                          ? 'bg-slate-800 border-cyan-400 text-white shadow'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-700" style={{ backgroundColor: col.hex }} />
                      <span>{col.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Decal / Print Option */}
              {product.decalOptions && product.decalOptions.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    2. Dynamic Graphic Print Decal:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {product.decalOptions.map(decalName => (
                      <button
                        key={decalName}
                        onClick={() => setSelectedDecal(decalName)}
                        className={`px-3 py-2 rounded-xl text-xs font-mono font-bold text-left transition-all ${
                          selectedDecal === decalName
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60'
                            : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {selectedDecal === decalName ? '✓ ' : ''}{decalName}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Size Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  3. Select Size:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['S', 'M', 'L', 'XL'] as Size[]).map(size => {
                    const avail = (product.stock[size] || 0) > 0;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        disabled={!avail}
                        className={`py-2.5 rounded-xl text-xs font-bold font-mono transition-all flex flex-col items-center justify-center ${
                          selectedSize === size
                            ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/20'
                            : avail
                            ? 'bg-slate-950 text-slate-200 border border-slate-800 hover:border-slate-600'
                            : 'bg-slate-950/40 text-slate-600 border border-slate-900 line-through cursor-not-allowed'
                        }`}
                      >
                        <span>{size}</span>
                        <span className="text-[9px] font-normal opacity-80">
                          {avail ? `${product.stock[size]} left` : 'Sold'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Material Highlights */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
                <div className="font-bold text-slate-200 text-[11px] uppercase tracking-wider">Garment Materials:</div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {product.materials.map((mat, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="grid grid-cols-2 gap-3">
              <button
                id="modal-add-to-cart"
                onClick={handleAddToCart}
                disabled={stockCount <= 0}
                className={`py-3.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  added
                    ? 'bg-emerald-500 text-slate-950'
                    : stockCount > 0
                    ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    : 'bg-slate-950 text-slate-600 cursor-not-allowed'
                }`}
              >
                {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4 text-cyan-400" />}
                {added ? 'Added to Cart!' : 'Add to Cart'}
              </button>

              <button
                id="modal-instant-buy"
                onClick={handleBuyNow}
                disabled={stockCount <= 0}
                className={`py-3.5 px-4 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                  stockCount > 0
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Zap className="w-4 h-4 fill-slate-950" /> Instant Checkout
              </button>
            </div>

            {/* Delivery & Warranty perks */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-cyan-400" /> Free Shipping over $150</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Authentic Guarantee</span>
              <span className="flex items-center gap-1"><RotateCcw className="w-3.5 h-3.5 text-purple-400" /> 30-Day Free Returns</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
