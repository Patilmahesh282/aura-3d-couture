import React, { useEffect, useState } from 'react';
import { Product, InventoryUpdateMessage, Size } from '../types';
import { Activity, Flame, AlertTriangle, RefreshCw, Layers, ShieldAlert, Sparkles, Check } from 'lucide-react';

interface LiveInventoryTrackerProps {
  products: Product[];
  onRestockProduct?: (productId: string, size: Size, amount: number) => void;
  userRole?: string;
}

export const LiveInventoryTracker: React.FC<LiveInventoryTrackerProps> = ({
  products,
  onRestockProduct,
  userRole
}) => {
  const [liveLogs, setLiveLogs] = useState<Array<{ id: string; text: string; time: string; type: 'buy' | 'restock' }>>([
    {
      id: 'log-1',
      text: '⚡ Live Stock Stream initialized across 12 node clusters.',
      time: new Date().toLocaleTimeString(),
      type: 'restock'
    },
    {
      id: 'log-2',
      text: '🔥 High demand detected for AURA Cyber Oversized Hoodie (Size M).',
      time: new Date(Date.now() - 30000).toLocaleTimeString(),
      type: 'buy'
    }
  ]);

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [onlyLowStock, setOnlyLowStock] = useState<boolean>(false);

  // Subscribe to SSE Inventory Stream
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/inventory/stream');

      eventSource.onmessage = (event) => {
        try {
          const data: InventoryUpdateMessage = JSON.parse(event.data);
          if (data.type === 'INVENTORY_UPDATE') {
            const product = products.find(p => p.id === data.productId);
            const pName = product ? product.name : data.productId;
            
            const newLog: { id: string; text: string; time: string; type: 'buy' | 'restock' } = {
              id: `log-${Date.now()}`,
              text: data.message || `Stock updated for ${pName}`,
              time: new Date().toLocaleTimeString(),
              type: data.message?.includes('purchased') ? 'buy' : 'restock'
            };

            setLiveLogs(prev => [newLog, ...prev.slice(0, 15)]);
          }
        } catch (e) {
          console.error('Error parsing inventory SSE payload:', e);
        }
      };
    } catch (err) {
      console.error('SSE Connection failed:', err);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [products]);

  const filteredProducts = products.filter(product => {
    if (filterCategory !== 'all' && product.category !== filterCategory) return false;
    if (onlyLowStock) {
      const minStock = Math.min(...Object.values(product.stock));
      return minStock < 5;
    }
    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Server-Authoritative Stock Syncing</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-white">Real-Time Inventory Stream</h2>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
            Every garment purchase across global shoppers updates our central database instantly. View live size stock, low-inventory alerts, and active allocation logs below.
          </p>
        </div>

        {/* Live Filter Controls */}
        <div className="z-10 flex flex-wrap items-center gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800">
          <button
            id="filter-all-stock"
            onClick={() => { setFilterCategory('all'); setOnlyLowStock(false); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterCategory === 'all' && !onlyLowStock
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Items
          </button>
          <button
            id="filter-low-stock"
            onClick={() => setOnlyLowStock(!onlyLowStock)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              onlyLowStock
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-amber-400 hover:text-amber-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Low Stock (&lt;5)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Garment Stock Breakdown Grid (2 cols wide) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" /> Garment Stock Levels per Size
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map(product => {
              const totalUnits = Object.values(product.stock).reduce((a, b) => a + b, 0);
              return (
                <div
                  key={product.id}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-cyan-400">{product.category}</span>
                      <h4 className="text-sm font-bold text-white leading-snug">{product.name}</h4>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                      totalUnits > 15
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : totalUnits > 0
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                      {totalUnits} Units Total
                    </span>
                  </div>

                  {/* Size progress bars */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {(['S', 'M', 'L', 'XL'] as Size[]).map(size => {
                      const count = product.stock[size] || 0;
                      const maxGauge = 30;
                      const pct = Math.min(100, Math.round((count / maxGauge) * 100));

                      return (
                        <div key={size} className="space-y-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                          <div className="flex justify-between text-[11px] font-mono font-bold">
                            <span className="text-slate-400">Size {size}</span>
                            <span className={count > 3 ? 'text-emerald-400' : count > 0 ? 'text-amber-400' : 'text-rose-400'}>
                              {count} left
                            </span>
                          </div>

                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                count > 5 ? 'bg-emerald-400' : count > 0 ? 'bg-amber-400' : 'bg-rose-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>

                          {/* Quick Restock Action for Admin / Demo tester */}
                          {onRestockProduct && (
                            <button
                              id={`restock-${product.id}-${size}`}
                              onClick={() => onRestockProduct(product.id, size, 5)}
                              className="w-full mt-1.5 text-[10px] font-mono font-bold py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded flex items-center justify-center gap-1"
                            >
                              + Restock 5
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Stream Allocation Feed */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 h-fit space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" /> Live Event Ticker Feed
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Realtime SSE</span>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {liveLogs.map(log => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1 animate-fadeIn"
              >
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span className={log.type === 'buy' ? 'text-amber-400 font-bold' : 'text-cyan-400 font-bold'}>
                    {log.type === 'buy' ? 'PURCHASE EVENT' : 'INVENTORY LOG'}
                  </span>
                  <span>{log.time}</span>
                </div>
                <p className="text-slate-200 font-mono text-[11px] leading-relaxed">{log.text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
