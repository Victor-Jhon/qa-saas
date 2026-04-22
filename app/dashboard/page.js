"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const projectId = "Ie2913511-3ba5-4861-9e87-1dde045ed91c";
  const [stats, setStats] = useState({
    passou: 0,
    falhou: 0,
    pendente: 0,
  });

  useEffect(() => {
    async function loadStats() {
      const { data, error } = await supabase
        .from("test_cases")
        .select("status");

      if (error) {
        console.log(error);

        
        return;
      }

      const passou = data.filter((t) => t.status === "passou").length;
      const falhou = data.filter((t) => t.status === "falhou").length;
      const pendente = data.filter((t) => t.status === "pendente").length;

      setStats({ passou, falhou, pendente });
    }

    loadStats();
  }, []);

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow border-l-4 border-green-500">
          <h2 className="text-green-600 text-3xl font-bold">
            ✔ {stats.passou}
          </h2>
          <p className="text-gray-500 mt-2">
            Testes que passaram
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border-l-4 border-red-500">
          <h2 className="text-red-600 text-3xl font-bold">
            ❌ {stats.falhou}
          </h2>
          <p className="text-gray-500 mt-2">
            Testes com falha
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border-l-4 border-yellow-500">
          <h2 className="text-yellow-600 text-3xl font-bold">
            ⏳ {stats.pendente}
          </h2>
          <p className="text-gray-500 mt-2">
            Testes pendentes
          </p>
        </div>

      </div>
    </div>
  );
}