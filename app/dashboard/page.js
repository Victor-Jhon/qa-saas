"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [projects, setProjects] = useState(0);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: projectsData } = await supabase
      .from("projects")
      .select("*");

    const { data: testsData } = await supabase
      .from("test_cases")
      .select("*");

    setProjects(projectsData?.length || 0);
    setTests(testsData || []);
    setLoading(false);
  }

  const normalize = (status) =>
    status?.toLowerCase().trim();

  const passed = tests.filter((t) =>
    normalize(t.status).includes("pass")
  ).length;

  const failed = tests.filter((t) =>
    normalize(t.status).includes("falh")
  ).length;

  const pending = tests.filter((t) =>
    normalize(t.status).includes("pend")
  ).length;

  const total = tests.length;

  const successRate =
    total > 0 ? Math.round((passed / total) * 100) : 0;

  const data = [
    { name: "Passaram", value: passed },
    { name: "Falharam", value: failed },
    { name: "Pendentes", value: pending },
  ];

  const COLORS = ["#22c55e", "#ef4444", "#eab308"];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-pulse text-white text-lg">
          Carregando dashboard...
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >

      <h1 className="text-3xl font-bold text-white mb-6">
        Dashboard
      </h1>

      {/* 🔥 SEÇÃO PROJETOS */}
      <div className="mb-6">
        <h2 className="text-white text-lg mb-3 opacity-80">
          📁 Projetos
        </h2>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white/10 backdrop-blur-lg border border-white/10 p-5 rounded-2xl text-white w-full md:w-1/4"
        >
          <p className="text-sm opacity-70">Total de projetos</p>
          <h2 className="text-3xl font-bold">{projects}</h2>
        </motion.div>
      </div>

      {/* 🔥 SEÇÃO TESTES */}
      <div className="mb-6">
        <h2 className="text-white text-lg mb-3 opacity-80">
          🧪 Testes Totais
        </h2>

        <div className="grid md:grid-cols-3 gap-4">

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-green-500/20 border border-green-400/20 p-5 rounded-2xl text-green-300"
          >
            <p className="text-sm opacity-80">Passaram</p>
            <h2 className="text-2xl font-bold">{passed}</h2>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-red-500/20 border border-red-400/20 p-5 rounded-2xl text-red-300"
          >
            <p className="text-sm opacity-80">Falharam</p>
            <h2 className="text-2xl font-bold">{failed}</h2>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-yellow-500/20 border border-yellow-400/20 p-5 rounded-2xl text-yellow-300"
          >
            <p className="text-sm opacity-80">Pendentes</p>
            <h2 className="text-2xl font-bold">{pending}</h2>
          </motion.div>

        </div>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* GRÁFICO */}
        <motion.div
          className="bg-white/10 backdrop-blur-lg border border-white/10 p-6 rounded-2xl"
        >
          <h2 className="text-white text-lg mb-4">
            Status dos Testes
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data} dataKey="value" outerRadius={90}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* PERFORMANCE */}
        <motion.div
          className="bg-white/10 backdrop-blur-lg border border-white/10 p-6 rounded-2xl text-white"
        >
          <h2 className="text-lg mb-4">
            Performance
          </h2>

          <p className="text-5xl font-bold mb-2">
            {successRate}%
          </p>

          <p className="text-sm opacity-70">
            Taxa de sucesso dos testes
          </p>

          <div className="mt-4 w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-green-400 h-3 rounded-full"
              style={{ width: `${successRate}%` }}
            />
          </div>

        </motion.div>

      </div>

    </motion.div>
  );
}