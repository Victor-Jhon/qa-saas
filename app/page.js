"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Home() {
  const params = useParams();
  const projectId = params.id;
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");

  function addProject() {
    if (!name) return;
    setProjects([...projects, { id: Date.now(), name }]);
    setName("");
  }

  return (
    <div className="p-6">
      
      <h1 className="text-2xl font-bold mb-4">Projetos</h1>

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
        >
          Criar
        </button>
      </div>

      <ul>
        {projects.map((p) => (
          <li key={p.id} className="mb-2">
            <Link href={`/project/${p.id}`} className="text-blue-600">
              {p.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}