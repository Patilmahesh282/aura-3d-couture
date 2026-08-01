import React, { useState } from 'react';
import { Product, Size } from '../types';
import { GarmentCanvas } from './3d/GarmentCanvas';
import { RealPhoto360Viewer } from './RealPhoto360Viewer';
import { ShoppingBag, Eye, Star, Flame, AlertCircle, Check, Camera, Rotate3d } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
  onAddToCart: (product: Product, size: Size, selectedColor: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetail,
  onAddToCart
}) => {
  const [selectedSize, setSelectedSize] = useState<Size>('M');
  const [selectedColor, setSelectedColor] = useState<string>(product.defaultColor);
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [viewMode, setViewMode] = useState<'realPhoto' | '3d'>('realPhoto');

  const stockCount = product.stock[selectedSize] || 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (stockCount <= 0) return;
    onAddToCart(product, selectedSize, selectedColor);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const photoList = product.realPhotos360 && product.realPhotos360.length > 0
    ? product.realPhotos360
    : [product.imageUrl || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80'];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-cyan-500/50 shadow-xl overflow-hidden transition-all duration-300 flex flex-col justify-between"
    >
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 pointer-events-none">
        {product.isNew && (
          <span className="px-2.5 py-1 rounded-full bg-cyan-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md">
            NEW
          </span>
        )}
        {product.isBestseller && (
          <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md flex items-center gap-1">
            <Flame className="w-3 h-3 fill-slate-950" /> HOT
          </span>
        )}
      </div>

      {/* Top Right View Mode Toggle (Real Photo 360° vs 3D Canvas) */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 text-[10px]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setViewMode('realPhoto');
          }}
          className={`px-2 py-1 rounded-lg font-mono font-bold flex items-center gap-1 transition-all ${
            viewMode === 'realPhoto'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Real Garment 360° Photo View"
        >
          <Camera className="w-3 h-3" /> Real Photo
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setViewMode('3d');
          }}
          className={`px-2 py-1 rounded-lg font-mono font-bold flex items-center gap-1 transition-all ${
            viewMode === '3d'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
          title="3D Canvas 360° Orbit"
        >
          <Rotate3d className="w-3 h-3" /> 3D
        </button>
      </div>

      {/* Interactive Display Area */}
      <div
        onClick={() => onOpenDetail(product)}
        className="relative w-full h-72 bg-gradient-to-b from-slate-950 to-slate-900 cursor-pointer overflow-hidden"
      >
        {viewMode === 'realPhoto' ? (
          <RealPhoto360Viewer
            photos={photoList}
            productName={product.name}
            autoRotate={isHovered}
            showControls={false}
          />
        ) : (
          <GarmentCanvas
            modelType={product.modelType}
            color={selectedColor}
            decal={product.decalOptions?.[0]}
            autoRotate={isHovered}
            environmentPreset="cyberpunk"
            scale={0.95}
            showControls={false}
          />
        )}

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 pointer-events-none">
          <button
            id={`open-detail-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(product);
            }}
            className="pointer-events-auto px-5 py-2.5 rounded-xl bg-slate-900/90 text-white font-bold text-xs border border-cyan-500/40 shadow-xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all hover:bg-cyan-500 hover:text-slate-950"
          >
            <Eye className="w-4 h-4" /> Full 360° Studio & Details
          </button>
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="uppercase font-mono text-[10px] text-cyan-400 tracking-wider">{product.category}</span>
            <div className="flex items-center gap-1 text-amber-400 font-semibold text-[11px]">
              <Star className="w-3 h-3 fill-amber-400" /> {product.rating} ({product.reviewsCount})
            </div>
          </div>

          <h3
            onClick={() => onOpenDetail(product)}
            className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* Color & Size Pickers */}
        <div className="space-y-3 pt-2 border-t border-slate-800/80">
          {/* Colors */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">Color:</span>
            <div className="flex items-center gap-1.5">
              {product.colors.map(col => (
                <button
                  key={col.hex}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(col.hex);
                  }}
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                  className={`w-4 h-4 rounded-full border transition-transform ${
                    selectedColor === col.hex ? 'border-cyan-400 scale-125 ring-2 ring-cyan-500/40' : 'border-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">Size:</span>
            <div className="flex items-center gap-1">
              {(['S', 'M', 'L', 'XL'] as Size[]).map(size => {
                const isAvailable = (product.stock[size] || 0) > 0;
                return (
                  <button
                    key={size}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize(size);
                    }}
                    disabled={!isAvailable}
                    className={`w-7 h-6 rounded text-[10px] font-mono font-bold transition-all ${
                      selectedSize === size
                        ? 'bg-cyan-500 text-slate-950 font-black'
                        : isAvailable
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-950 text-slate-600 line-through cursor-not-allowed'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Price & Add To Cart CTA */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-xl font-black text-white">${product.price}</span>
            {product.originalPrice && (
              <span className="ml-2 text-xs text-slate-500 line-through">${product.originalPrice}</span>
            )}
          </div>

          <button
            id={`add-cart-${product.id}`}
            onClick={handleQuickAdd}
            disabled={stockCount <= 0}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 ${
              addedAnimation
                ? 'bg-emerald-500 text-slate-950 scale-105'
                : stockCount > 0
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" /> Added!
              </>
            ) : stockCount > 0 ? (
              <>
                <ShoppingBag className="w-4 h-4" /> Add
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4" /> Sold Out
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
