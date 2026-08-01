import React, { useEffect, useState } from 'react';
import { User, Order, OrderStatus } from '../types';
import { Package, Truck, CheckCircle2, Clock, ShieldCheck, MapPin, ChevronRight, RefreshCw } from 'lucide-react';

interface OrderHistoryModalProps {
  user: User | null;
  orders: Order[];
  onRefreshOrders?: () => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  user,
  orders,
  onRefreshOrders
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);

  useEffect(() => {
    if (orders.length > 0 && !selectedOrder) {
      setSelectedOrder(orders[0]);
    }
  }, [orders]);

  const timelineSteps: OrderStatus[] = ['Processing', 'Quality Check', 'Shipped', 'Out for Delivery', 'Delivered'];

  const getStepIndex = (status: OrderStatus) => {
    return timelineSteps.indexOf(status);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Package className="w-4 h-4" /> USER ACCOUNT & ORDER TRACKING
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white">Order History & Live Status</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track real-time shipment updates, transaction receipts, and 3D garment order details for <b>{user?.name || 'Guest'}</b>.
          </p>
        </div>

        {onRefreshOrders && (
          <button
            id="refresh-orders-btn"
            onClick={onRefreshOrders}
            className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4 text-cyan-400" /> Refresh Order List
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-4">
          <Package className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Place your first order using our secure payment gateway to view real-time tracking here!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Order Cards List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Past Orders ({orders.length})</h3>
            
            {orders.map(order => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                  selectedOrder?.id === order.id
                    ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-white">{order.id}</span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/30">
                    {order.orderStatus}
                  </span>
                </div>

                <div className="text-xs text-slate-400 line-clamp-1">
                  {order.items.map(i => `${i.name} (${i.size})`).join(', ')}
                </div>

                <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-800/60">
                  <span className="text-slate-500 font-mono text-[10px]">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="font-black text-white">${order.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Active Selected Order Details & Timeline */}
          {selectedOrder && (
            <div className="lg:col-span-2 p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-8">
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="text-xs font-mono text-cyan-400 font-bold">TRANSACTION #{selectedOrder.transactionId}</div>
                  <h3 className="text-xl font-black text-white">{selectedOrder.id} Details</h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Estimated Delivery: <b className="text-emerald-400">{selectedOrder.estimatedDelivery}</b>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-white">${selectedOrder.total.toFixed(2)}</span>
                  <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 justify-end">
                    <ShieldCheck className="w-3.5 h-3.5" /> Payment Status: PAID
                  </div>
                </div>
              </div>

              {/* Real-time Order Timeline Progress Bar */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Shipment Tracking Status:
                </h4>

                <div className="relative flex items-center justify-between py-4">
                  {/* Line */}
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0" />
                  <div
                    className="absolute top-1/2 left-0 h-1 bg-cyan-500 -translate-y-1/2 z-0 transition-all duration-500"
                    style={{
                      width: `${(getStepIndex(selectedOrder.orderStatus) / (timelineSteps.length - 1)) * 100}%`
                    }}
                  />

                  {/* Step Nodes */}
                  {timelineSteps.map((step, idx) => {
                    const activeIdx = getStepIndex(selectedOrder.orderStatus);
                    const isCompleted = idx <= activeIdx;
                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                          isCompleted
                            ? 'bg-cyan-500 text-slate-950 ring-4 ring-slate-900'
                            : 'bg-slate-950 text-slate-600 border border-slate-800'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span className={`text-[10px] font-mono font-bold mt-2 text-center max-w-[70px] ${
                          isCompleted ? 'text-cyan-400' : 'text-slate-600'
                        }`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Ordered Items:</h4>

                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg border border-slate-700 shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <div>
                          <div className="font-bold text-white">{item.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            Size: {item.size} • Qty: {item.quantity}
                          </div>
                        </div>
                      </div>

                      <div className="font-mono font-bold text-cyan-400">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-1">
                <div className="font-bold text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Delivery Address:
                </div>
                <div>{selectedOrder.shippingAddress.fullName}</div>
                <div>{selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}</div>
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
};
