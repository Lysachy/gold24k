"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
  const [form, setForm] = useState<ProductData>(product || emptyProduct);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      setError("Please fill in all required fields");
      return;
    }

    if (form.weight && (isNaN(Number(form.weight)) || Number(form.weight) <= 0)) {
      setError("Weight must be a positive number");
      return;
    }

    setLoading(true);

    try {
      const url = isEdit ? `/api/products/${product!.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save product");
        return;
      }

      setSuccess(isEdit ? "Product updated!" : "Product created!");
      setTimeout(() => router.push("/admin/products"), 1000);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        {/* Basic Info */}
        <fieldset>
          <legend className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
            Basic Information
          </legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField label="Name *" value={form.name} onChange={(v) => update("name", v)} placeholder="Gold Ring 24K" />
            <InputField label="SKU *" value={form.sku} onChange={(v) => update("sku", v)} placeholder="Auto-generated" disabled={!isEdit} />
            <SelectField
              label="Category *"
              value={form.category}
              onChange={(v) => {
                update("category", v);
                if (!isEdit && v) {
                  setForm((prev) => ({ ...prev, category: v, sku: generateSku(v) }));
                }
              }}
              options={CATEGORIES}
            />
            {isEdit && (
              <SelectField
                label="Status"
                value={form.status}
                onChange={(v) => update("status", v)}
                options={["available", "sold"]}
              />
            )}
          </div>
        </fieldset>

        <hr className="my-6 border-gray-100" />

        {/* Details */}
        <fieldset>
          <legend className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
            Details
          </legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <InputField label="Material" value={form.material} onChange={(v) => update("material", v)} placeholder="Gold" />
            <InputField label="Purity" value={form.purity} onChange={(v) => update("purity", v)} placeholder="24K" />
            <InputField label="Weight (g)" value={form.weight} onChange={(v) => update("weight", v)} placeholder="10.5" type="number" />
          </div>
        </fieldset>

        <hr className="my-6 border-gray-100" />

        {/* Media */}
        <fieldset>
          <legend className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
            Media
          </legend>
          <div className="grid grid-cols-1 gap-4">
            <InputField label="Image URL" value={form.imageUrl} onChange={(v) => update("imageUrl", v)} placeholder="https://..." />
          </div>
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-amber-400 focus:bg-white focus:ring-1 focus:ring-amber-400"
              placeholder="Product description..."
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
          Cancel
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
              Saving...
            </span>
          ) : isEdit ? (
            "Update Product"
          ) : (
            "Create Product"
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
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
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
