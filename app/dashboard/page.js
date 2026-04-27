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

  const passed = tests.filter(
    (t) => normalize(t.status) === "passou"
  ).length;

  const failed = tests.filter(
    (t) => normalize(t.status) === "falhou"
  ).length;

  const pending = tests.filter((t) => {
    const s = normalize(t.status);
    return s.includes("não") || s.includes("nao");
  }).length;

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
    return <p className="text-white">Carregando...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">

      <h1 className="text-3xl font-bold text-white mb-6">
        Dashboard
      </h1>

      {/* CARDS */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">

        <div className="bg-white/10 backdrop-blur-lg border border-white/10 p-5 rounded-2xl text-white">
          <p className="text-sm opacity-70">Projetos</p>
          <h2 className="text-2xl font-bold">{projects}</h2>
        </div>

        <div className="bg-green-500/20 backdrop-blur-lg border border-green-400/20 p-5 rounded-2xl text-green-300">
          <p className="text-sm">Passaram</p>
          <h2 className="text-2xl font-bold">{passed}</h2>
        </div>

        <div className="bg-red-500/20 backdrop-blur-lg border border-red-400/20 p-5 rounded-2xl text-red-300">
          <p className="text-sm">Falharam</p>
          <h2 className="text-2xl font-bold">{failed}</h2>
        </div>

        <div className="bg-yellow-500/20 backdrop-blur-lg border border-yellow-400/20 p-5 rounded-2xl text-yellow-300">
          <p className="text-sm">Pendentes</p>
          <h2 className="text-2xl font-bold">{pending}</h2>
        </div>

      </div>

      {/* GRID PRINCIPAL */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* GRÁFICO */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/10 p-6 rounded-2xl">

          <h2 className="text-white text-lg mb-4">
            Status dos Testes
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                outerRadius={90}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

        </div>

        {/* PERFORMANCE */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/10 p-6 rounded-2xl text-white">

          <h2 className="text-lg mb-4">
            Performance
          </h2>

          <p className="text-5xl font-bold mb-2">
            {successRate}%
          </p>

          <p className="text-sm opacity-70">
            Taxa de sucesso dos testes
          </p>

          {/* barra fake bonita */}
          <div className="mt-4 w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-green-400 h-3 rounded-full"
              style={{ width: `${successRate}%` }}
            />
          </div>

        </div>

      </div>

    </div>
  );
}