"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data } = await supabase.from("projects").select("*");
    setProjects(data || []);
  }

  // 🔵 CRIAR / EDITAR
  async function handleSave() {
    if (!name) return;

    if (editingProject) {
      const { error } = await supabase
        .from("projects")
        .update({ name })
        .eq("id", editingProject.id);

      if (error) {
        alert("Erro ao atualizar projeto");
        return;
      }
    } else {
      const { error } = await supabase
        .from("projects")
        .insert([{ name }]);

      if (error) {
        alert("Erro ao criar projeto");
        return;
      }
    }

    setName("");
    setEditingProject(null);
    setOpenModal(false);
    fetchProjects();
  }

  // 🔴 DELETE
  async function deleteProject(id) {
    const confirmDelete = window.confirm("Deseja excluir este projeto?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Erro ao excluir projeto");
      return;
    }

    fetchProjects();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900 tracking-tight">
        Projetos
       </h1>
      {/* BOTÃO NOVO PROJETO */}
      <button
        onClick={() => {
          setOpenModal(true);
          setEditingProject(null);
          setName("");
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-6"
      >
        + Novo Projeto
      </button>

      {/* CARDS */}
      <div className="grid md:grid-cols-3 gap-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-gray-300 p-5 rounded-xl shadow hover:shadow-lg transition relative"
          >
            <h2 className="font-bold text-lg text-gray-900">
              {p.name}
            </h2>

          {/* AÇÕES */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setEditingProject(p);
                  setName(p.name);
                  setOpenModal(true);
                }}
                className="text-blue-600"
              >
                ✏️
              </button>

              <button
                onClick={() => deleteProject(p.id)}
                className="text-red-600"
              >
                🗑️
              </button>

              <button
                onClick={() => router.push(`/project/${p.id}`)}
                className="text-gray-600 ml-auto"
              >
                Abrir →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px]">

            <h2 className="text-lg font-bold mb-4">
              {editingProject ? "Editar Projeto" : "Novo Projeto"}
            </h2>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do projeto"
              className="w-full border p-2 rounded mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpenModal(false)}
                className="px-3 py-1"
              >
                Cancelar
              </button>

              <button
                onClick={handleSave}
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