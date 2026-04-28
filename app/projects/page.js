"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [tests, setTests] = useState([]);
  const [filter, setFilter] = useState("todos"); // 🔥 NOVO

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingProject, setEditingProject] = useState(null);

  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data: projectsData } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: true });

    const { data: testsData } = await supabase
      .from("test_cases")
      .select("*");

    setProjects(projectsData || []);
    setTests(testsData || []);
  }

  // 🔥 MÉTRICAS
  function getMetrics(projectId) {
    const projectTests = tests.filter(
      (t) => t.project_id === projectId
    );

    const normalize = (s) => s?.toLowerCase().trim();

    const passed = projectTests.filter(
      (t) => normalize(t.status) === "passou"
    ).length;

    const failed = projectTests.filter(
      (t) => normalize(t.status) === "falhou"
    ).length;

    const pending = projectTests.filter((t) => {
      const s = normalize(t.status);
      return s.includes("pend");
    }).length;

    return {
      total: projectTests.length,
      passed,
      failed,
      pending,
    };
  }

  // 🔥 STATUS DO PROJETO
  function getProjectStatus(metrics) {
    if (metrics.total === 0) return "vazio";
    if (metrics.failed > 0) return "falha";
    if (metrics.pending > 0) return "pendente";
    return "ok";
  }

  // 🔥 CONTADOR DE FALHA
  const failedCount = projects.filter((p) => {
    const m = getMetrics(p.id);
    return m.failed > 0;
  }).length;

  // 🔥 FILTRO
  const filteredProjects = projects.filter((p) => {
    const metrics = getMetrics(p.id);
    const status = getProjectStatus(metrics);

    if (filter === "todos") return true;
    return status === filter;
  });

  async function saveProject() {
    if (!name) return;

    if (editingProject) {
      await supabase
        .from("projects")
        .update({ name, description })
        .eq("id", editingProject.id);
    } else {
      await supabase
        .from("projects")
        .insert([{ name, description }]);
    }

    setName("");
    setDescription("");
    setEditingProject(null);
    setIsOpen(false);
    fetchProjects();
  }

  async function deleteProject(id) {
    if (!confirm("Excluir projeto?")) return;

    await supabase.from("projects").delete().eq("id", id);
    fetchProjects();
  }

  function openEditModal(project) {
    setEditingProject(project);
    setName(project.name);
    setDescription(project.description || "");
    setIsOpen(true);
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">
          Projetos
        </h1>

        <motion.button
          onClick={() => {
            setIsOpen(true);
            setEditingProject(null);
            setName("");
            setDescription("");
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
        >
          + Novo Projeto
        </motion.button>
      </div>

      {/* 🔥 FILTRO */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("todos")}
          className={`px-3 py-1 rounded-lg ${
            filter === "todos"
              ? "bg-white text-black"
              : "bg-white/10 text-white"
          }`}
        >
          Todos
        </button>

        <button
          onClick={() => setFilter("falha")}
          className={`px-3 py-1 rounded-lg ${
            filter === "falha"
              ? "bg-red-500 text-white"
              : "bg-white/10 text-white"
          }`}
        >
          Com Falha ({failedCount})
        </button>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-4">
        {filteredProjects.map((p, i) => {
          const metrics = getMetrics(p.id);
          const status = getProjectStatus(metrics);

          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className={`group backdrop-blur-lg p-5 rounded-2xl text-white border ${
                status === "falha"
                  ? "bg-red-500/20 border-red-400/30"
                  : status === "ok"
                  ? "bg-green-500/20 border-green-400/30"
                  : "bg-white/10 border-white/10"
              }`}
            >
              <div
                onClick={() => router.push(`/project/${p.id}`)}
                className="cursor-pointer"
              >
                <h2 className="font-bold text-lg">
                  {p.name}
                </h2>

                <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                  {p.description || "Sem descrição"}
                </p>

                <p className="text-xs mt-3">
                  {metrics.total} testes •{" "}
                  <span className="text-green-400">
                    {metrics.passed} ✔
                  </span>{" "}
                  •{" "}
                  <span className="text-red-400">
                    {metrics.failed} ✖
                  </span>{" "}
                  •{" "}
                  <span className="text-yellow-400">
                    {metrics.pending} ⏳
                  </span>
                </p>
              </div>

              {/* AÇÕES */}
              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => openEditModal(p)}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-lg"
                >
                  ✏️
                </button>

                <button
                  onClick={() => deleteProject(p.id)}
                  className="bg-red-500/20 hover:bg-red-500/40 p-2 rounded-lg text-red-400"
                >
                  🗑️
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* MODAL */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-2xl w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              {editingProject ? "Editar Projeto" : "Novo Projeto"}
            </h2>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome"
              className="border p-2 w-full mb-3 rounded"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição"
              className="border p-2 w-full mb-4 rounded"
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setIsOpen(false)}>
                Cancelar
              </button>

              <button
                onClick={saveProject}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}