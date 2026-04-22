"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id;

  const [tests, setTests] = useState([]);
  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false); // 🔥 novo

  useEffect(() => {
    fetchTests();
  }, []);

  async function fetchTests() {
    const { data, error } = await supabase
      .from("test_cases")
      .select("*")
      .eq("project_id", projectId);

    if (!error) {
      setTests(data || []);
    }
  }

  async function addTest() {
    if (!title) return;

    const { error } = await supabase.from("test_cases").insert([
      {
        title,
        project_id: projectId,
        status: "Não testado",
      },
    ]);

    if (error) {
      alert("Erro ao criar teste");
    } else {
      setTitle("");
      fetchTests();
    }
  }

  async function updateStatus(id, status) {
    const { error } = await supabase
      .from("test_cases")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert("Erro ao atualizar status");
    } else {
      setTests((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status } : t
        )
      );
    }
  }

  // CONTADORES
  const passed = tests.filter((t) => t.status === "Passou").length;
  const failed = tests.filter((t) => t.status === "Falhou").length;
  const pending = tests.filter((t) => t.status === "Não testado").length;

  return (
    <div>

      {/* MÉTRICAS */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">

        <div className="bg-green-500 text-white p-5 rounded-xl flex justify-between">
          <span>{passed} Passaram</span>
          <span>✔</span>
        </div>

        <div className="bg-red-500 text-white p-5 rounded-xl flex justify-between">
          <span>{failed} Falharam</span>
          <span>✖</span>
        </div>

        <div className="bg-yellow-500 text-white p-5 rounded-xl flex justify-between">
          <span>{pending} Pendentes</span>
          <span>⏳</span>
        </div>

      </div>

      {/* TÍTULO + BOTÃO */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          Casos de Teste
        </h1>

        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Novo Teste
        </button>
      </div>

      {/* LISTA */}
      <ul className="space-y-3">
        {tests.map((t) => (
          <li
            key={t.id}
            className="flex justify-between items-center bg-white p-4 rounded shadow"
          >
            <span>{t.title}</span>

            <div className="flex items-center gap-2">

              <button
                onClick={() => updateStatus(t.id, "Passou")}
                className="bg-green-500 hover:bg-green-600 text-black px-3 py-1 rounded text-sm"
              >
                ✔
              </button>

              <button
                onClick={() => updateStatus(t.id, "Falhou")}
                className="bg-red-500 hover:bg-red-600 text-black px-3 py-1 rounded text-sm"
              >
                ✖
              </button>

              <span
                className={`px-3 py-1 rounded text-black text-sm ${
                  t.status === "Passou"
                    ? "bg-green-500"
                    : t.status === "Falhou"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
              >
                {t.status}
              </span>

            </div>
          </li>
        ))}
      </ul>

      {/* 🔥 MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          
          <div className="bg-white p-6 rounded-xl shadow w-80">

            <h2 className="text-lg font-bold mb-4">
              Novo Teste
            </h2>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nome do teste"
              className="border p-2 w-full mb-4 rounded"
            />

            <div className="flex justify-end gap-2">

              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-500"
              >
                Cancelar
              </button>

              <button
                onClick={() => {
                  addTest();
                  setIsOpen(false);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Salvar
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}