"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id;

  const [tests, setTests] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      if (!data?.session?.user) {
        setCheckingSession(false);
      } else {
        fetchProject();
        fetchTests();
        setCheckingSession(false);
      }
    });
    return () => { isMounted = false; };
  }, [router, projectId]);

  async function fetchProject() {
    const { data } = await supabase
      .from("projects")
      .select("name")
      .eq("id", projectId)
      .single();
    setProject(data);
  }

  async function fetchTests() {
    setLoading(true);
    const { data } = await supabase
      .from("test_cases")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    setTests(data || []);
    setLoading(false);
  }

  async function addTest() {
    if (!title.trim()) return;

    setLoading(true);
    const { error } = await supabase.from("test_cases").insert([
      {
        title,
        project_id: projectId,
        status: "pending",
      },
    ]);

    if (error) {
      alert("Erro ao adicionar: " + error.message);
    } else {
      setTitle("");
      fetchTests();
    }
    setLoading(false);
  }

  async function updateStatus(id, status) {
    await supabase
      .from("test_cases")
      .update({ status })
      .eq("id", id);

    fetchTests();
  }

  function getStatusColor(status) {
    switch (status) {
      case "passed":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  }

  function getStatusLabel(status) {
    switch (status) {
      case "passed":
        return "Passou";
      case "failed":
        return "Falhou";
      default:
        return "Pendente";
    }
  }

  if (checkingSession) {
    return (
      <div className="p-6">
        <p>Verificando sessão...</p>
      </div>
    );
  }
  // Se não autenticado, redireciona
  if (!supabase.auth.getUser) {
    router.replace("/login");
    return null;
  }
  return (
    <div className="p-6">
      <div className="mb-4">
        <Link href="/project" className="text-blue-600 hover:underline">
          ← Voltar aos projetos
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">
        Casos de Teste - {project?.name || `Projeto ${projectId}`}
      </h1>

      <div className="mb-6 flex gap-2">
        <input
          className="border p-2 flex-1"
          placeholder="Título do caso de teste"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTest()}
        />
        <button
          onClick={addTest}
          disabled={loading || !title.trim()}
          className="bg-blue-500 text-white px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Adicionando..." : "Adicionar"}
        </button>
      </div>

      {loading && tests.length === 0 ? (
        <p>Carregando...</p>
      ) : tests.length === 0 ? (
        <p className="text-gray-500">Nenhum caso de teste ainda.</p>
      ) : (
        <div className="space-y-3">
          {tests.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between border p-4 rounded"
            >
              <span className="flex-1">{t.title}</span>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => updateStatus(t.id, "passed")}
                  className={`px-3 py-1 text-white text-sm rounded ${
                    t.status === "passed" ? "bg-green-600" : "bg-green-400 hover:bg-green-500"
                  }`}
                >
                  ✓ Passou
                </button>

                <button
                  onClick={() => updateStatus(t.id, "failed")}
                  className={`px-3 py-1 text-white text-sm rounded ${
                    t.status === "failed" ? "bg-red-600" : "bg-red-400 hover:bg-red-500"
                  }`}
                >
                  ✗ Falhou
                </button>

                <span
                  className={`px-3 py-1 text-white text-sm rounded min-w-[80px] text-center ${getStatusColor(
                    t.status
                  )}`}
                >
                  {getStatusLabel(t.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}