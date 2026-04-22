"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data } = await supabase.from("projects").select("*");
    setProjects(data || []);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Projetos</h1>

      <div className="grid gap-4">
        {projects.map((p) => (
          <div
            key={p.id}
            onClick={() => router.push(`/project/${p.id}`)}
            className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg"
          >
            {p.name}
          </div>
        ))}
      </div>
    </div>
  );
}