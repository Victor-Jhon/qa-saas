"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id;

  const [tests, setTests] = useState([]);
  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [project, setProject] = useState(null);

  useEffect(() => {
    fetchTests();
    fetchProject();
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

  async function fetchProject() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (!error) {
      setProject(data);
    }
  }

  async function addTest() {
    if (!title) return;

    const { error } = await supabase.from("test_cases").insert([
      {
        title,
        project_id: projectId,
        status: "pendentes", // ✔ PADRÃO CORRETO
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

    if (!error) {
      setTests((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status } : t
        )
      );
    }
  }

  // ✔ PADRONIZADO (AGORA FUNCIONA COM DASHBOARD)
  const passed = tests.filter((t) => t.status === "passou").length;
  const failed = tests.filter((t) => t.status === "falhou").length;
  const pending = tests.filter((t) => t.status === "pendentes").length;
  return (
    <div>

      {/* HEADER */}
      <div className="mb-6 border-b border-gray-200 pb-3 flex items-center gap-3">

        <div className="bg-white text-gray-800 w-10 h-10 flex items-center justify-center rounded-lg text-lg">
          📁
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {project?.name || "Carregando..."}
          </h1>
          <p className="text-gray-600 text-sm">
            Gerencie seus casos de teste
          </p>
        </div>

      </div>

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

      <hr className="mb-6" />

      {/* HEADER LISTA */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-black">
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
            className="flex justify-between items-center bg-white p-4 rounded shadow border"
          >
            <span className="text-gray-800 font-medium">
              {t.title}
            </span>

            <div className="flex items-center gap-2">

              <button
                onClick={() => updateStatus(t.id, "passou")}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
              >
                ✔
              </button>

              <button
                onClick={() => updateStatus(t.id, "falhou")}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                ✖
              </button>

              <span
                className={`px-3 py-1 rounded text-white text-sm ${
                  t.status === "passou"
                    ? "bg-green-500"
                    : t.status === "falhou"
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

      {/* MODAL */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-2xl shadow-xl w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Novo Teste
            </h2>

            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nome do teste"
              className="border border-gray-300 p-2 w-full mb-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end gap-2">
              <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
               Cancelar
              </button>

              <button
                onClick={() => {
                  addTest();
                  setIsOpen(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded"
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