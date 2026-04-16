"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ProjectPage() {
  const params = useParams();
  const projectId = params?.id;

  const [tests, setTests] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (projectId) {
      console.log("ProjectId:", projectId);
      fetchTests();
    }
  }, []);

  async function fetchTests() {
    if (!projectId) return;
    
    setLoading(true);
    console.log("Buscando testes para projectId:", projectId);
    
    const { data, error } = await supabase
      .from("test_cases")
      .select("*")
      .eq("project_id", projectId);

    console.log("Resultado:", data, error);
    setTests(data || []);
    setLoading(false);
  }

  async function addTest() {
    if (!title.trim() || !projectId) return;

    const { error } = await supabase.from("test_cases").insert([
      {
        title,
        project_id: projectId,
        status: "Não testado",
      },
    ]);

    if (error) {
      console.error("Erro ao adicionar:", error);
      alert("Erro ao adicionar: " + error.message);
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
      console.error("Erro ao atualizar:", error);
    } else {
      fetchTests();
    }
  }

  if (loading) return <div>Carregando...</div>;
  if (!projectId) return <div>Projeto não encontrado</div>;

  return (
    <div className="p-6">
      <h1>Casos de Teste - Projeto {projectId}</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button onClick={addTest}>
        Adicionar
      </button>

      <ul>
        {tests.map((t) => (
          <li key={t.id}>
            {t.title}

            <button onClick={() => updateStatus(t.id, "Passou")}>
              Passou
            </button>

            <button onClick={() => updateStatus(t.id, "Falhou")}>
              Falhou
            </button>

            {t.status}
          </li>
        ))}
      </ul>
    </div>
  );
}