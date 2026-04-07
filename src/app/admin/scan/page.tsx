"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Html5Qrcode } from "html5-qrcode";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  material: string | null;
  purity: string | null;
  weight: number | null;
  price: number;
  description: string | null;
  imageUrl: string | null;
  status: string;
}

function skuFromEan13(ean: string, products: Product[]): Product | undefined {
  return products.find((p) => generateEan13(p.sku) === ean);
}

function generateEan13(sku: string): string {
  let hash = 0;
  for (let i = 0; i < sku.length; i++) {
    hash = (hash * 31 + sku.charCodeAt(i)) % 1000000000000;
  }
  const digits12 = String(hash).padStart(12, "0").slice(0, 12);
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(digits12[i]) * (i % 2 === 0 ? 1 : 3);
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return digits12 + checkDigit;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

export default function ScanPage() {
  const [scanning, setScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [markingSold, setMarkingSold] = useState(false);
  const [showPriceInput, setShowPriceInput] = useState(false);
  const [sellPrice, setSellPrice] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scanRegionId = "barcode-scanner";

  // Fetch all products for EAN matching
  useEffect(() => {
    fetch("/api/products?limit=9999")
      .then((res) => res.json())
      .then((data) => setAllProducts(data.products || []))
      .catch(console.error);
  }, []);

  async function startScanner() {
    setScannedCode(null);
    setProduct(null);
    setNotFound(false);
    setError("");

    try {
      const scanner = new Html5Qrcode(scanRegionId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 280, height: 150 } },
        (decodedText) => {
          handleScan(decodedText);
          scanner.stop().catch(console.error);
          setScanning(false);
        },
        () => {}
      );

      setScanning(true);
    } catch {
      setError("Tidak dapat mengakses kamera. Pastikan izin kamera sudah diberikan.");
    }
  }

  function stopScanner() {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(console.error);
      scannerRef.current = null;
    }
    setScanning(false);
  }

  function handleScan(code: string) {
    setScannedCode(code);
    const found = skuFromEan13(code, allProducts);
    if (found) {
      setProduct(found);
      setNotFound(false);
    } else {
      setProduct(null);
      setNotFound(true);
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Scan Barcode</h1>
      <p className="mt-1 text-sm text-gray-500">
        Scan barcode EAN-13 produk untuk melihat detail
      </p>

      <div className="mt-8 mx-auto max-w-lg">
        {/* Scanner Area */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div
            id={scanRegionId}
            className="relative bg-gray-900"
            style={{ minHeight: scanning ? 300 : 0 }}
          />

          {!scanning && (
            <div className="flex flex-col items-center gap-4 p-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5Z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">Arahkan kamera ke barcode produk</p>
              <button
                onClick={startScanner}
                className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                Mulai Scan
              </button>
            </div>
          )}

          {scanning && (
            <div className="flex justify-center p-4">
              <button
                onClick={stopScanner}
                className="rounded-lg border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Stop Scanner
              </button>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}

        {/* Result */}
        <AnimatePresence mode="wait">
          {scannedCode && (
            <motion.div
              key={scannedCode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6"
            >
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
                Barcode: {scannedCode}
              </p>

              {product ? (
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                      <p className="mt-0.5 font-mono text-xs text-gray-400">{product.sku}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.status === "available"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>

                  <hr className="my-4 border-gray-100" />

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">Kategori</p>
                      <p className="font-medium text-gray-700">{product.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Harga</p>
                      <p className="font-medium text-gray-700">{formatPrice(product.price)}</p>
                    </div>
                    {product.material && (
                      <div>
                        <p className="text-xs text-gray-400">Material</p>
                        <p className="font-medium text-gray-700">{product.material}</p>
                      </div>
                    )}
                    {product.purity && (
                      <div>
                        <p className="text-xs text-gray-400">Kadar</p>
                        <p className="font-medium text-gray-700">{product.purity}</p>
                      </div>
                    )}
                    {product.weight && (
                      <div>
                        <p className="text-xs text-gray-400">Berat</p>
                        <p className="font-medium text-gray-700">{product.weight}g</p>
                      </div>
                    )}
                  </div>

                  {/* Sold Price Input */}
                  {product.status === "available" && showPriceInput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4"
                    >
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-amber-700">
                        Harga Jual (Rp)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={sellPrice}
                          onChange={(e) => setSellPrice(e.target.value)}
                          placeholder="Masukkan harga jual..."
                          className="flex-1 rounded-lg border border-amber-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        />
                        <button
                          onClick={async () => {
                            if (!sellPrice || isNaN(Number(sellPrice)) || Number(sellPrice) <= 0) return;
                            setMarkingSold(true);
                            try {
                              const res = await fetch(`/api/products/${product.id}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ ...product, price: Number(sellPrice), status: "sold" }),
                              });
                              if (res.ok) {
                                setProduct({ ...product, price: Number(sellPrice), status: "sold" });
                                setShowPriceInput(false);
                                setSellPrice("");
                              }
                            } catch (err) {
                              console.error(err);
                            } finally {
                              setMarkingSold(false);
                            }
                          }}
                          disabled={markingSold || !sellPrice}
                          className="rounded-lg bg-amber-600 px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-amber-700 disabled:opacity-50"
                        >
                          {markingSold ? "..." : "Konfirmasi"}
                        </button>
                        <button
                          onClick={() => { setShowPriceInput(false); setSellPrice(""); }}
                          className="rounded-lg border border-gray-200 px-3 py-2.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100"
                        >
                          Batal
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.status === "available" && !showPriceInput && (
                      <button
                        onClick={() => setShowPriceInput(true)}
                        className="rounded-lg bg-amber-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-amber-700"
                      >
                        Tandai Sold
                      </button>
                    )}
                    <Link
                      href={`/admin/products/edit/${product.id}`}
                      className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-800"
                    >
                      Edit Produk
                    </Link>
                    <button
                      onClick={() => {
                        setScannedCode(null);
                        setProduct(null);
                        setShowPriceInput(false);
                        setSellPrice("");
                        startScanner();
                      }}
                      className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Scan Lagi
                    </button>
                  </div>
                </div>
              ) : notFound ? (
                <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
                  <p className="text-sm text-gray-500">Produk tidak ditemukan untuk barcode ini</p>
                  <button
                    onClick={() => {
                      setScannedCode(null);
                      setNotFound(false);
                      startScanner();
                    }}
                    className="mt-3 rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Scan Lagi
                  </button>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
