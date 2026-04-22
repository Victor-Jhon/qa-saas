"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data } = await supabase.from("projects").select("*");
    setProjects(data || []);
  }

 async function addProject() {
  if (!name) return;

  const { data, error } = await supabase
    .from("projects")
    .insert([{ name }]); // 👈 AQUI

  if (error) {
    console.log(error);
    alert("Erro ao criar projeto");
  } else {
    setName("");
    fetchProjects();
  }
}

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Projetos</h1>

      {/* INPUT */}
      <div className="mb-6 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do projeto"
          className="border p-2 rounded w-64"
        />

        <button
          onClick={addProject}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Criar
        </button>
      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-3 gap-4">
        {projects.map((p) => (
          <div
            key={p.id}
            onClick={() => router.push(`/project/${p.id}`)}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg cursor-pointer transition"
          >
            <h2 className="font-bold text-lg">{p.name}</h2>
            <p className="text-sm text-gray-500 mt-2">
              Clique para abrir
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}