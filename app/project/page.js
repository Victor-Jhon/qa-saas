"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    const { data, error } = await supabase.from("projects").select("*");
    if (!error) setProjects(data || []);
    alert("Erro ao buscar projetos: " + error.message);
    setLoading(false);
  }

  async function addProject() {
    if (!name.trim()) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .insert([{ name }])
      .select();
    if (!error && data && data[0]) {
      setProjects([...projects, data[0]]);
      setName("");
    }
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Projetos</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2">Logout</button>
      </div>
      <div className="mb-4">
        <input
          className="border p-2 mr-2"
          placeholder="Nome do projeto"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={addProject}
          className="bg-blue-500 text-white px-4 py-2"
          disabled={loading}
        >
          {loading ? "Criando..." : "Criar"}
        </button>
      </div>
      <ul>
        {projects.map((p) => (
          <li key={p.id} className="mb-2 flex items-center justify-between">
            <Link href={`/project/${p.id}`} className="text-blue-600">
              {p.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
