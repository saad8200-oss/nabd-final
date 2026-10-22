"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard } from "lucide-react";
import { processSale } from "./actions";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  category: string | null;
  barcode: string | null;
}

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { items, addItem, removeItem, updateQuantity, clearCart, getSubtotal, getTotal, discount, setDiscount } = useCartStore();

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.includes(search) || (p.category && p.category.includes(search))
  );

  // دالة التعامل مع الباركود (عند الضغط على Enter)
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.barcode === search || p.name === search);
    
    if (product) {
      addItem({ id: product.id, name: product.name, price: product.price, maxStock: product.stock });
      setSearch(""); // مسح الحقل بعد الإضافة
    } else {
      alert("المنتج غير موجود! تأكد من الباركود.");
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setIsProcessing(true);
    try {
      await processSale(items, getTotal(), discount, getSubtotal());
      clearCart();
      alert("تمت عملية البيع بنجاح! تم خصم الكميات من المخزون.");
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء إتمام البيع.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '1.5rem', height: 'calc(100vh - 8rem)' }}>
      
      {/* قسم المنتجات */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* حقل البحث والباركود */}
        <form onSubmit={handleBarcodeSubmit} style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', right: '0.75rem', top: '0.75rem', width: '1rem', height: '1rem', color: '#94a3b8' }} />
          <Input 
            placeholder="امسح الباركود أو ابحث بالاسم..." 
            style={{ paddingRight: '2.5rem', backgroundColor: 'rgba(30, 41, 59, 0.5)', borderColor: 'rgba(255,255,255,0.1)' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        {/* شبكة المنتجات */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem', overflowY: 'auto', paddingBottom: '1rem' }}>
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => addItem({ id: product.id, name: product.name, price: product.price, maxStock: product.stock })}
              style={{ 
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textAlign: 'center', 
                padding: '1rem', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.08)', 
                backgroundColor: 'rgba(30, 41, 59, 0.6)', borderRadius: '12px', backdropFilter: 'blur(24px)' 
              }}
            >
              <div style={{ height: '4rem', width: '4rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                {product.imageUrl ? (
                  <Image src={product.imageUrl} alt={product.name} fill style={{ objectFit: 'cover' }} />
                ) : (
                  <ShoppingCart style={{ width: '2rem', height: '2rem', color: '#94a3b8' }} />
                )}
              </div>
              <span style={{ fontWeight: '600', fontSize: '0.875rem', color: '#f8fafc' }}>{product.name}</span>
              <span style={{ color: '#22d3ee', fontWeight: 'bold' }}>{product.price} ج.م</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>متوفر: {product.stock}</span>
            </button>
          ))}
        </div>
      </div>

      {/* قسم السلة */}
      <div style={{ 
        width: '380px', display: 'flex', flexDirection: 'column', 
        backgroundColor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(24px)', 
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', 
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)', overflow: 'hidden' 
      }}>
        {/* رأس السلة */}
        <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f8fafc', margin: 0 }}>
            <ShoppingCart style={{ width: '1.25rem', height: '1.25rem' }} /> الفاتورة
          </h2>
        </div>

        {/* محتوى السلة */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', gap: '0.5rem' }}>
              <ShoppingCart style={{ width: '3rem', height: '3rem', opacity: 0.2 }} />
              <p>السلة فارغة</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '500', fontSize: '0.875rem', color: '#f8fafc', margin: 0 }}>{item.name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#22d3ee', margin: 0 }}>{item.price} ج.م</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Button variant="outline" size="icon" style={{ height: '1.5rem', width: '1.5rem' }} onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    <Minus style={{ width: '0.75rem', height: '0.75rem' }} />
                  </Button>
                  <span style={{ width: '1.5rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 'bold', color: '#f8fafc' }}>{item.quantity}</span>
                  <Button variant="outline" size="icon" style={{ height: '1.5rem', width: '1.5rem' }} onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Plus style={{ width: '0.75rem', height: '0.75rem' }} />
                  </Button>
                  <Button variant="ghost" size="icon" style={{ height: '1.5rem', width: '1.5rem', color: '#ef4444', marginRight: '0.5rem' }} onClick={() => removeItem(item.id)}>
                    <Trash2 style={{ width: '0.75rem', height: '0.75rem' }} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* تذييل السلة */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#94a3b8' }}>
            <span>المجموع الفرعي:</span>
            <span>{getSubtotal()} ج.م</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
            <span style={{ color: '#94a3b8' }}>الخصم (ج.م):</span>
            <input 
              type="number" 
              value={discount || ""} 
              onChange={(e) => setDiscount(Number(e.target.value))}
              placeholder="0"
              style={{ width: '80px', padding: '0.25rem', borderRadius: '0.25rem', backgroundColor: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc', textAlign: 'center' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 'bold', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
            <span style={{ color: '#f8fafc' }}>الإجمالي:</span>
            <span style={{ color: '#22d3ee' }}>{getTotal()} ج.م</span>
          </div>

          <Button 
            style={{ width: '100%', display: 'flex', gap: '0.5rem', fontSize: '1.125rem', height: '3rem', marginTop: '0.5rem' }}
            disabled={items.length === 0 || isProcessing}
            onClick={handleCheckout}
          >
            <CreditCard style={{ width: '1.25rem', height: '1.25rem' }} />
            {isProcessing ? "جاري الدفع..." : "إتمام الدفع"}
          </Button>
        </div>
      </div>
    </div>
  );
}