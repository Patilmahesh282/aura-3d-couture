import React from 'react';
import { ShoppingBag, User as UserIcon, Shield, Sparkles, Box, Activity, LogOut } from 'lucide-react';
import { User, CartItem } from '../types';

interface NavbarProps {
  user: User | null;
  cart: CartItem[];
  activeTab: 'home' | 'catalog' | 'inventory' | 'orders' | 'admin';
  setActiveTab: (tab: 'home' | 'catalog' | 'inventory' | 'orders' | 'admin') => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  cart,
  activeTab,
  setActiveTab,
  onOpenCart,
  onOpenAuth,
  onLogout
}) => {
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <button
            id="nav-logo-btn"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Box className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-xl font-black tracking-wider text-white flex items-center gap-1">
                AURA <span className="text-cyan-400 text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 font-mono">3D</span>
              </span>
              <span className="block text-[10px] font-medium tracking-widest text-slate-400 uppercase">Interactive Couture</span>
            </div>
          </button>

          {/* Primary Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            <button
              id="nav-home-btn"
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'home'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              3D Studio Stage
            </button>
            <button
              id="nav-catalog-btn"
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'catalog'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Shop Catalog
            </button>
            <button
              id="nav-inventory-btn"
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'inventory'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Real-time Stock
            </button>
            {user && (
              <button
                id="nav-orders-btn"
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'orders'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Order History
              </button>
            )}
            {user?.role === 'admin' && (
              <button
                id="nav-admin-btn"
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  activeTab === 'admin'
                    ? 'bg-purple-600 text-white shadow-md font-bold'
                    : 'text-purple-300 hover:text-purple-100 hover:bg-purple-950/40'
                }`}
              >
                <Shield className="w-3.5 h-3.5" /> Store Admin
              </button>
            )}
          </nav>
        </div>

        {/* Right Actions: Live Stock Sync, Cart & User Auth */}
        <div className="flex items-center gap-3">
          {/* Realtime Sync Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Stock Sync Active</span>
          </div>

          {/* User Account Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                id="user-profile-btn"
                onClick={() => setActiveTab('orders')}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs text-slate-200 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-bold text-white text-xs leading-tight">{user.name}</div>
                  <div className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> {user.auraPoints} AuraPoints
                  </div>
                </div>
              </button>
              <button
                id="logout-btn"
                onClick={onLogout}
                title="Log Out"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="login-modal-trigger"
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 hover:text-cyan-400 text-xs font-bold transition-all flex items-center gap-2"
            >
              <UserIcon className="w-4 h-4 text-cyan-400" /> Sign In / Account
            </button>
          )}

          {/* Shopping Cart Button */}
          <button
            id="open-cart-btn"
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-105"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-slate-950 shadow">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
