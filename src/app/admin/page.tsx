"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Stats {
  total: number;
  available: number;
  sold: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ total: 0, available: 0, sold: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total Products", value: stats.total, color: "bg-gray-900" },
    { label: "Available", value: stats.available, color: "bg-emerald-600" },
    { label: "Sold", value: stats.sold, color: "bg-amber-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Overview of your jewelry catalog
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="rounded-xl border border-gray-200 bg-white p-6"
          >
            <div className="flex items-center gap-3">
              <div className={`h-2.5 w-2.5 rounded-full ${card.color}`} />
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
            </div>
            <p className="mt-3 text-3xl font-semibold text-gray-900">
              {loading ? (
                <span className="inline-block h-9 w-16 animate-pulse rounded bg-gray-100" />
              ) : (
                card.value
              )}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
