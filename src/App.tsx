import React, { useEffect, useState } from 'react';
import { Product, CartItem, User, Order, Size, OrderStatus } from './types';
import { INITIAL_PRODUCTS } from './data/initialProducts';
import { Navbar } from './components/Navbar';
import { HeroStage } from './components/3d/HeroStage';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { LiveInventoryTracker } from './components/LiveInventoryTracker';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { AdminPanel } from './components/AdminPanel';
import { LiveStockTicker } from './components/LiveStockTicker';
import { Sparkles, Filter, Search, Rotate3d, Box, ShieldCheck, Truck, RotateCcw, Zap } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [user, setUser] = useState<User | null>(null);
  const [userToken, setUserToken] = useState<string | null>(localStorage.getItem('aura_auth_token'));
  const [orders, setOrders] = useState<Order[]>([]);

  const [activeTab, setActiveTab] = useState<'home' | 'catalog' | 'inventory' | 'orders' | 'admin'>('home');
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aura_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal States
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [checkoutPromo, setCheckoutPromo] = useState<string | undefined>('AURA3D');

  // Filter States for Catalog
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aura_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cart]);

  // Fetch initial products
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  // Fetch user details if token exists
  useEffect(() => {
    fetchProducts();

    if (userToken) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${userToken}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser(data.user);
            fetchUserOrders(data.user.id);
          }
        })
        .catch(err => console.error('Error fetching me:', err));
    }
  }, [userToken]);

  // Fetch user orders
  const fetchUserOrders = async (userId: string) => {
    try {
      const res = await fetch(`/api/orders/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching user orders:', err);
    }
  };

  // Subscribe to SSE Realtime Inventory Stream
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/inventory/stream');
      eventSource.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload.type === 'INVENTORY_UPDATE' && payload.productId && payload.stock) {
            setProducts(prevProducts =>
              prevProducts.map(p =>
                p.id === payload.productId ? { ...p, stock: payload.stock } : p
              )
            );
          }
        } catch (err) {
          console.error('Error parsing SSE event:', err);
        }
      };
    } catch (err) {
      console.error('Failed to connect to SSE stream:', err);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  // Cart Actions
  const handleAddToCart = (product: Product, size: Size, selectedColor: string, decal?: string) => {
    const colorObj = product.colors.find(c => c.hex === selectedColor) || product.colors[0];
    const cartItemId = `${product.id}-${size}-${selectedColor}-${decal || 'none'}`;

    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === cartItemId);
      if (existing) {
        return prevCart.map(item =>
          item.id === cartItemId
            ? { ...item, quantity: Math.min(product.stock[size], item.quantity + 1) }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          size,
          selectedColor,
          colorName: colorObj.name,
          decal,
          quantity: 1,
          maxStockAvailable: product.stock[size],
          modelType: product.modelType
        };
        return [...prevCart, newItem];
      }
    });

    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const handleProceedToCheckout = (promoCode?: string) => {
    setCheckoutPromo(promoCode);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleInstantBuy = (product: Product, size: Size, selectedColor: string, decal?: string) => {
    handleAddToCart(product, size, selectedColor, decal);
    setSelectedProductDetail(null);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (newOrder: Order) => {
    setCart([]);
    setIsCheckoutOpen(false);
    setOrders(prev => [newOrder, ...prev]);
    setActiveTab('orders');
    fetchProducts();
  };

  // Auth Success
  const handleAuthSuccess = (loggedUser: User, token: string) => {
    setUser(loggedUser);
    setUserToken(token);
    localStorage.setItem('aura_auth_token', token);
    fetchUserOrders(loggedUser.id);
  };

  const handleLogout = () => {
    setUser(null);
    setUserToken(null);
    localStorage.removeItem('aura_auth_token');
    if (activeTab === 'orders' || activeTab === 'admin') {
      setActiveTab('home');
    }
  };

  // Admin Restock Handler
  const handleRestockProduct = async (productId: string, size: Size, amount: number) => {
    try {
      const res = await fetch(`/api/products/${productId}/stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ size, quantity: amount, action: 'add' })
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error('Error restocking product:', err);
    }
  };

  // Admin Order Status Update
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        if (user) fetchUserOrders(user.id);
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  // Filter products for catalog
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar
        user={user}
        cart={cart}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Tab 1: Home 3D Showcase Stage & Featured Items */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            {/* Hero 3D Interactive Canvas Stage */}
            <HeroStage
              products={products}
              onSelectProduct={(p) => setSelectedProductDetail(p)}
              onExploreCatalog={() => setActiveTab('catalog')}
            />

            {/* Value Proposition Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Rotate3d className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">3D Interactive Showcases</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Rotate garments 360°, customize fabric colors, and test dynamic prints before buying.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Real-time Inventory Stream</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Live stock decrementing across size options so you never miss limited releases.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Secure Payment Gateway</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Encrypted card checkout, Apple Pay, and Web3 USDC options with 3DS 2.0 verification.
                  </p>
                </div>
              </div>
            </div>

            {/* Featured Product Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-cyan-400 font-bold uppercase">SIGNATURE COLLECTION</div>
                  <h2 className="text-2xl font-black text-white">Interactive 3D Apparel Line</h2>
                </div>

                <button
                  id="view-full-catalog-btn"
                  onClick={() => setActiveTab('catalog')}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-cyan-400 border border-slate-800"
                >
                  View All Products ({products.length})
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetail={p => setSelectedProductDetail(p)}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Shop Catalog with Filters */}
        {activeTab === 'catalog' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
              <div>
                <h2 className="text-2xl font-black text-white">Shop Clothing Catalog</h2>
                <p className="text-xs text-slate-400 mt-1">Explore all 3D customizable street apparel and luxury techwear.</p>
              </div>

              {/* Search & Category Filter */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search apparel..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
                  {['all', 'hoodies', 'tees', 'jackets', 'pants', 'sneakers', 'blazers'].map(cat => (
                    <button
                      key={cat}
                      id={`cat-filter-${cat}`}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                        selectedCategory === cat ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenDetail={p => setSelectedProductDetail(p)}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Real-time Inventory Tracker */}
        {activeTab === 'inventory' && (
          <LiveInventoryTracker
            products={products}
            onRestockProduct={user?.role === 'admin' ? handleRestockProduct : undefined}
            userRole={user?.role}
          />
        )}

        {/* Tab 4: Order History & Shipment Tracking */}
        {activeTab === 'orders' && (
          <OrderHistoryModal
            user={user}
            orders={orders}
            onRefreshOrders={() => user && fetchUserOrders(user.id)}
          />
        )}

        {/* Tab 5: Admin Panel */}
        {activeTab === 'admin' && user?.role === 'admin' && (
          <AdminPanel
            products={products}
            orders={orders}
            onRestockProduct={handleRestockProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

      </main>

      {/* Floating Activity Ticker */}
      <LiveStockTicker />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        onAddToCart={handleAddToCart}
        onInstantBuy={handleInstantBuy}
      />

      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        cart={cart}
        user={user}
        appliedPromoCode={checkoutPromo}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCompleted={handleOrderCompleted}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Footer */}
      <footer className="w-full bg-slate-950 border-t border-slate-900 py-8 text-center text-xs text-slate-500 font-mono space-y-2">
        <div className="flex justify-center items-center gap-2">
          <Box className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white">AURA 3D Couture</span>
          <span>• Immersive React Three Fiber E-Commerce</span>
        </div>
        <div>Real-time Inventory Tracking & Secure Payment Gateway Built with Express & R3F</div>
      </footer>
    </div>
  );
}
