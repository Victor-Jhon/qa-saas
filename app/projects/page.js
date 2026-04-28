"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [tests, setTests] = useState([]); // 🔥 NOVO
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const router = useRouter();
  const [notes, setNotes] = useState(""); 
  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
  const { data: projectsData } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: true });

  console.log("PROJECTS:", projectsData); // 🔥 AQUI

  const { data: testsData } = await supabase
    .from("test_cases")
    .select("*")
    .order("created_at", { ascending: true });

  setProjects(projectsData || []);
  setTests(testsData || []);
}

  // 🔥 MÉTRICAS POR PROJETO
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
      return s.includes("pendentes") || s.includes("não") || s.includes("nao");
    }).length;

    return {
      total: projectTests.length,
      passed,
      failed,
      pending,
    };
  }

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
    const confirmDelete = confirm("Excluir projeto?");
    if (!confirmDelete) return;

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

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-4">

        {projects.map((p, i) => {
          const metrics = getMetrics(p.id); // 🔥 AQUI

          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="group bg-white/10 backdrop-blur-lg border border-white/10 p-5 rounded-2xl text-white"
            >

              <div
                onClick={() => router.push(`/project/${p.id}`)}
                className="cursor-pointer"
              >
                <h2 className="font-bold text-lg">
                  {p.name}
                </h2>

                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {p.description || "Sem descrição"}
                </p>

                {/* 🔥 MÉTRICAS */}
                <p className="text-xs text-gray-400 mt-3">
                  {metrics.total} testes •{" "}
                  <span className="text-green-400">{metrics.passed} ✔</span>{" "}
                  •{" "}
                  <span className="text-red-400">{metrics.failed} ✖</span>{" "}
                  •{" "}
                  <span className="text-yellow-400">{metrics.pending} ⏳</span>
                </p>
              </div>

              {/* AÇÕES */}
              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => openEditModal(p)}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white"
                >
                  ✏️
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteProject(p.id)}
                  className="bg-red-500/20 hover:bg-red-500/40 p-2 rounded-lg text-red-400"
                >
                  🗑️
                </motion.button>
              </div>

            </motion.div>
          );
        })}

      </div>

      {/* MODAL */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-2xl shadow-xl w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              {editingProject ? "Editar Projeto" : "Novo Projeto"}
            </h2>

            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do projeto"
              className="border border-gray-300 p-2 w-full mb-3 rounded-lg text-gray-900"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição do projeto"
              className="border border-gray-300 p-2 w-full mb-4 rounded-lg text-gray-900 resize-none"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>

              <button
                onClick={saveProject}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                {editingProject ? "Salvar" : "Criar"}
              </button>
            </div>
          </div>
        </div>
      )}

    </motion.div>
  );
}