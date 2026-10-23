"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PackagePlus, Edit, Trash2 } from "lucide-react";
import { saveProduct, deleteProduct } from "@/app/(dashboard)/inventory/actions";

interface ProductFormProps {
  product?: any;
  triggerType?: "add" | "edit";
}

export function ProductForm({ product = null, triggerType = "add" }: ProductFormProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    
    const formData = new FormData(e.currentTarget);
    if (product?.id) {
      formData.append("id", product.id);
    }

    try {
      await saveProduct(formData);
      setOpen(false);
    } catch (error) {
      console.error("حدث خطأ أثناء الحفظ", error);
      alert("حدث خطأ أثناء الحفظ. تأكد من عدم تكرار الباركود.");
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج نهائياً؟")) {
      try {
        await deleteProduct(product.id);
        setOpen(false);
      } catch (error) {
        console.error("حدث خطأ أثناء الحذف", error);
        alert("لا يمكن حذف هذا المنتج لارتباطه بعمليات بيع سابقة.");
      }
    }
  };

  return (
    <>
      {triggerType === "edit" && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-blue-400 hover:text-blue-300"
          onClick={() => setOpen(true)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        {triggerType === "add" && (
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PackagePlus className="h-4 w-4" />
              إضافة منتج جديد
            </Button>
          </DialogTrigger>
        )}
        
        <DialogContent 
          className="sm:max-w-[425px] bg-[#1e293b] border-[#334155]" 
          style={{ 
            backgroundColor: '#1e293b', 
            borderColor: '#334155',
            color: '#f8fafc'
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-[#f8fafc]">
              {triggerType === "add" ? "إضافة منتج جديد" : "تعديل المنتج"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#94a3b8]">اسم المنتج</Label>
                <Input name="name" defaultValue={product?.name} required style={{ backgroundColor: 'rgba(15,23,42,0.5)', borderColor: '#334155', color: '#fff' }} />
              </div>
              <div className="space-y-2">
                <Label className="text-[#94a3b8]">التصنيف</Label>
                <Input name="category" defaultValue={product?.category} style={{ backgroundColor: 'rgba(15,23,42,0.5)', borderColor: '#334155', color: '#fff' }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#94a3b8]">سعر البيع</Label>
                <Input name="price" type="number" step="0.01" defaultValue={product?.price} required style={{ backgroundColor: 'rgba(15,23,42,0.5)', borderColor: '#334155', color: '#fff' }} />
              </div>
              <div className="space-y-2">
                <Label className="text-[#94a3b8]">سعر التكلفة</Label>
                <Input name="cost" type="number" step="0.01" defaultValue={product?.cost} required style={{ backgroundColor: 'rgba(15,23,42,0.5)', borderColor: '#334155', color: '#fff' }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#94a3b8]">الكمية</Label>
                <Input name="stock" type="number" defaultValue={product?.stock} required style={{ backgroundColor: 'rgba(15,23,42,0.5)', borderColor: '#334155', color: '#fff' }} />
              </div>
              <div className="space-y-2">
                <Label className="text-[#94a3b8]">حد التنبيه</Label>
                <Input name="lowStockThreshold" type="number" defaultValue={product?.lowStockThreshold || 10} required style={{ backgroundColor: 'rgba(15,23,42,0.5)', borderColor: '#334155', color: '#fff' }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#94a3b8]">الباركود</Label>
                <Input name="barcode" defaultValue={product?.barcode} style={{ backgroundColor: 'rgba(15,23,42,0.5)', borderColor: '#334155', color: '#fff' }} />
              </div>
              <div className="space-y-2">
                <Label className="text-[#94a3b8]">رابط الصورة (URL)</Label>
                <Input name="imageUrl" defaultValue={product?.imageUrl} placeholder="https://..." style={{ backgroundColor: 'rgba(15,23,42,0.5)', borderColor: '#334155', color: '#fff' }} />
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? "جاري الحفظ..." : "حفظ المنتج"}
              </Button>
              
              {triggerType === "edit" && (
                <Button type="button" variant="destructive" onClick={handleDelete} className="px-3">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}