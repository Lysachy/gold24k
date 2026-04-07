"use client";

import { useEffect, useState, use } from "react";
import ProductForm from "@/components/admin/ProductForm";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct({
          ...data,
          weight: data.weight?.toString() || "",
          price: data.price?.toString() || "",
          material: data.material || "",
          purity: data.purity || "",
          description: data.description || "",
          imageUrl: data.imageUrl || "",
        });
      })
      .catch(() => setError("Gagal memuat produk"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-20 text-center text-gray-500">
        {error || "Produk tidak ditemukan"}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Produk</h1>
        <p className="mt-1 text-sm text-gray-500">
          Perbarui informasi produk
        </p>
      </div>

      <ProductForm product={product} />
    </div>
  );
}
