import React, { useState } from 'react';
import { Product, Order, Size, OrderStatus } from '../types';
import { Shield, Plus, RefreshCw, DollarSign, Package, TrendingUp, Users, AlertCircle, Edit, Check } from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onRestockProduct: (productId: string, size: Size, amount: number) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  onRestockProduct,
  onUpdateOrderStatus
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');

  // Compute metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalUnitsSold = orders.reduce((sum, o) => sum + o.items.reduce((a, b) => a + b.quantity, 0), 0);

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Admin Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 border border-purple-800/50 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-mono border border-purple-500/30">
            <Shield className="w-3.5 h-3.5" /> STORE MANAGER DASHBOARD
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white mt-1">Product Management & Orders</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time control panel to restock garment sizes, monitor live store revenue, and update fulfillment tracking.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            id="admin-tab-inventory"
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'inventory' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Product & Stock Control
          </button>
          <button
            id="admin-tab-orders"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'orders' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Manage Orders ({orders.length})
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">${totalRevenue.toFixed(2)}</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Total Orders</span>
            <Package className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{orders.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Units Sold</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalUnitsSold}</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Active Products</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{products.length}</div>
        </div>
      </div>

      {/* Main Content View */}
      {activeTab === 'inventory' ? (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Garment Stock & Inventory Override</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map(product => (
              <div key={product.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">{product.category}</span>
                    <h4 className="text-sm font-bold text-white">{product.name}</h4>
                    <div className="text-xs text-cyan-400 font-mono font-bold mt-0.5">${product.price}</div>
                  </div>

                  <div className="text-right text-[11px] font-mono text-slate-400">
                    Total: <b className="text-white">{Object.values(product.stock).reduce((a, b) => a + b, 0)} units</b>
                  </div>
                </div>

                {/* Size restock controls */}
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800">
                  {(['S', 'M', 'L', 'XL'] as Size[]).map(size => (
                    <div key={size} className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                      <div className="text-[10px] font-mono text-slate-400">Size {size}</div>
                      <div className="text-xs font-black text-white">{product.stock[size] || 0}</div>
                      <button
                        id={`admin-add-stock-${product.id}-${size}`}
                        onClick={() => onRestockProduct(product.id, size, 10)}
                        className="w-full text-[9px] font-mono font-bold py-1 bg-purple-900/60 hover:bg-purple-800 text-purple-200 rounded"
                      >
                        +10 Stock
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Orders View */
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">All Store Orders & Fulfillment Status</h3>

          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex flex-wrap justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white font-mono text-sm">{order.id}</span>
                    <span className="ml-2 text-slate-400 font-mono">• {order.customerName} ({order.customerEmail})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-cyan-400">${order.total.toFixed(2)}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-[10px]">
                      {order.paymentMethod.toUpperCase()} PAID
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="text-xs text-slate-400 font-mono">
                  Items: {order.items.map(i => `${i.name} [Size ${i.size} x${i.quantity}]`).join(', ')}
                </div>

                {/* Status Update Control */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400 font-mono">Change Status:</span>
                  <div className="flex gap-1">
                    {(['Processing', 'Quality Check', 'Shipped', 'Out for Delivery', 'Delivered'] as OrderStatus[]).map(st => (
                      <button
                        key={st}
                        id={`set-status-${order.id}-${st}`}
                        onClick={() => onUpdateOrderStatus(order.id, st)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                          order.orderStatus === st
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
