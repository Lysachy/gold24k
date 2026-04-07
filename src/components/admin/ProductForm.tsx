"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { categoryLabel, statusLabel } from "@/lib/id-labels";
import { isValidImageUrl, normalizeImageUrl } from "@/lib/image-url";

interface ProductData {
  id?: string;
  name: string;
  sku: string;
  category: string;
  material: string;
  purity: string;
  weight: string;
  price: string;
  description: string;
  imageUrl: string;
  status: string;
}

const CATEGORIES = ["Ring", "Necklace", "Bracelet", "Earring", "Bar", "Coin", "Pendant", "Other"];

const CATEGORY_PREFIX: Record<string, string> = {
  Ring: "RNG",
  Necklace: "NCK",
  Bracelet: "BRC",
  Earring: "ERG",
  Bar: "BAR",
  Coin: "CON",
  Pendant: "PDT",
  Other: "OTH",
};

function generateSku(category: string): string {
  const prefix = CATEGORY_PREFIX[category] || "OTH";
  const timestamp = Date.now().toString().slice(-8);
  return `${prefix}-${timestamp}`;
}

const emptyProduct: ProductData = {
  name: "",
  sku: "",
  category: "",
  material: "",
  purity: "",
  weight: "",
  price: "",
  description: "",
  imageUrl: "",
  status: "available",
};

export default function ProductForm({ product }: { product?: ProductData }) {
  const router = useRouter();
  const isEdit = !!product?.id;
  const [form, setForm] = useState<ProductData>(
    product
      ? { ...product, imageUrl: normalizeImageUrl(product.imageUrl) }
      : emptyProduct
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  function update(field: keyof ProductData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.sku || !form.category) {
      setError("Harap isi semua field yang wajib");
      return;
    }

    if (form.weight && (isNaN(Number(form.weight)) || Number(form.weight) <= 0)) {
      setError("Berat harus berupa angka positif");
      return;
    }

    if (!isValidImageUrl(form.imageUrl)) {
      setError("URL gambar tidak valid");
      return;
    }

    setLoading(true);

    try {
      const normalizedImageUrl = normalizeImageUrl(form.imageUrl);

      if (!isEdit && imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("sku", form.sku);
        
        const teleRes = await fetch("/api/telegram", {
          method: "POST",
          body: formData,
        });
        
        if (!teleRes.ok) {
          console.error("Failed to send image to Telegram");
        }
      }

      const url = isEdit ? `/api/products/${product!.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, imageUrl: normalizedImageUrl }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Gagal menyimpan produk");
        return;
      }

      setSuccess(isEdit ? "Produk berhasil diperbarui!" : "Produk berhasil ditambahkan!");
      setTimeout(() => router.push("/admin/products"), 1000);
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        {/* Informasi Dasar */}
        <fieldset>
          <legend className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
            Informasi Dasar
          </legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField label="Nama *" value={form.name} onChange={(v) => update("name", v)} placeholder="Cincin Emas 24K" />
            <InputField label="SKU *" value={form.sku} onChange={(v) => update("sku", v)} placeholder="Otomatis" disabled={!isEdit} />
            <SelectField
              label="Kategori *"
              value={form.category}
              onChange={(v) => {
                update("category", v);
                if (!isEdit && v) {
                  setForm((prev) => ({ ...prev, category: v, sku: generateSku(v) }));
                }
              }}
              options={CATEGORIES}
              labelFn={categoryLabel}
            />
            {isEdit && (
              <SelectField
                label="Status"
                value={form.status}
                onChange={(v) => update("status", v)}
                options={["available", "sold"]}
                labelFn={statusLabel}
              />
            )}
          </div>
        </fieldset>

        <hr className="my-6 border-gray-100" />

        {/* Detail */}
        <fieldset>
          <legend className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
            Detail
          </legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <InputField label="Material" value={form.material} onChange={(v) => update("material", v)} placeholder="Emas" />
            <InputField label="Kadar" value={form.purity} onChange={(v) => update("purity", v)} placeholder="24K" />
            <InputField label="Berat (g)" value={form.weight} onChange={(v) => update("weight", v)} placeholder="10.5" type="number" />
          </div>
        </fieldset>

        <hr className="my-6 border-gray-100" />

        {/* Media */}
        <fieldset>
          <legend className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
            Media
          </legend>
          <div className="grid grid-cols-1 gap-4">
            <InputField
              label="URL Gambar"
              value={form.imageUrl}
              onChange={(v) => update("imageUrl", normalizeImageUrl(v))}
              placeholder="https://drive.google.com/file/d/... atau https://..."
            />
            <p className="-mt-2 text-xs text-gray-500">
              Bisa pakai link share Google Drive. Link akan otomatis diubah ke format gambar yang bisa tampil di katalog.
            </p>
            {!isEdit && (
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ambil / Unggah Gambar
                </label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setImageFile(file);
                  }}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-amber-400 focus:bg-white focus:ring-1 focus:ring-amber-400 file:mr-4 file:rounded-full file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-gray-800"
                />
              </div>
            )}
          </div>
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
              Deskripsi
            </label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-amber-400 focus:bg-white focus:ring-1 focus:ring-amber-400"
              placeholder="Deskripsi produk..."
            />
          </div>
        </fieldset>
      </div>

      {/* Feedback */}
      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </motion.p>
      )}
      {success && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
          {success}
        </motion.p>
      )}

      {/* Actions */}
      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Menyimpan...
            </span>
          ) : isEdit ? (
            "Perbarui Produk"
          ) : (
            "Tambah Produk"
          )}
        </button>
      </div>
    </form>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        step={type === "number" ? "any" : undefined}
        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-amber-400 focus:bg-white focus:ring-1 focus:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  labelFn,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  labelFn?: (v: string) => string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-amber-400 focus:bg-white focus:ring-1 focus:ring-amber-400"
      >
        <option value="">Pilih...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {labelFn ? labelFn(opt) : opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
