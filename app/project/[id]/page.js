"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Check, X, Hourglass } from "lucide-react";

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id;

  const [tests, setTests] = useState([]);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState(""); // ✅ corrigido
  const [isOpen, setIsOpen] = useState(false);
  const [project, setProject] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchTests();
    fetchProject();
  }, []);

  async function fetchTests() {
    const { data } = await supabase
  .from("test_cases")
  .select("*")
  .eq("project_id", projectId)
  .order("created_at", { ascending: true }); // 🔥 aqui
    setTests(data || []);
  }

  async function fetchProject() {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    setProject(data);
  }

  async function addTest() {
    if (!title) return;

    await supabase.from("test_cases").insert([
      {
        title,
        notes,
        project_id: projectId,
        status: "pendente",
      },
    ]);

    setTitle("");
    setNotes("");
    fetchTests();
  }

  // 🔥 clicar no teste = editar observação
  async function editNotes(test) {
    const newNotes = prompt("Observações:", test.notes || "");
    if (newNotes === null) return;

    await supabase
      .from("test_cases")
      .update({ notes: newNotes })
      .eq("id", test.id);

    fetchTests();
  }

  async function deleteTest(id) {
    if (!confirm("Excluir teste?")) return;

    await supabase
      .from("test_cases")
      .delete()
      .eq("id", id);

    fetchTests();
  }

  async function updateStatus(id, status) {
    await supabase
      .from("test_cases")
      .update({ status })
      .eq("id", id);

    setTests((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status } : t
      )
    );
  }

  // ✅ métricas corrigidas
  const passed = tests.filter((t) => t.status === "passou").length;
  const failed = tests.filter((t) => t.status === "falhou").length;
  const pending = tests.filter((t) => t.status === "pendente").length;

  return (
    <div>

      {/* HEADER */}
      <div className="mb-6 border-b pb-3 flex items-center gap-3">
        <div className="bg-white text-gray-800 w-10 h-10 flex items-center justify-center rounded-lg">
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
        <div className="bg-green-500 text-white p-5 rounded-xl">
          {passed} Passaram
        </div>

        <div className="bg-red-500 text-white p-5 rounded-xl">
          {failed} Falharam
        </div>

        <div className="bg-yellow-500 text-white p-5 rounded-xl">
          {pending} Pendentes
        </div>
      </div>

      {/* HEADER LISTA */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-black">
          Casos de Teste
        </h1>

        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Novo Teste
        </button>
      </div>

      {/* LISTA */}
      <ul className="space-y-3">
        {tests.map((t) => (
  <li
  key={t.id}
  onClick={() => router.push(`/test/${t.id}`)}
  className="flex justify-between items-center bg-white p-4 rounded shadow border cursor-pointer hover:bg-gray-50 transition"
>

  {/* CONTEÚDO */}
  <div>
    <p className="font-medium text-gray-800">
      {t.title}
    </p>

    {t.notes && (
      <p className="text-sm text-gray-500">
        {t.notes}
      </p>
    )}
  </div>

  {/* AÇÕES */}
  <div className="flex items-center gap-3">

    {/* STATUS BOTÕES */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        updateStatus(t.id, "passou");
      }}
      className="w-4 h-4 rounded-full bg-green-500 hover:scale-110 transition"
    />

    <button
      onClick={(e) => {
        e.stopPropagation();
        updateStatus(t.id, "falhou");
      }}
      className="w-4 h-4 rounded-full bg-red-500 hover:scale-110 transition"
    />

    <button
      onClick={(e) => {
        e.stopPropagation();
        updateStatus(t.id, "pendente");
      }}
      className="w-4 h-4 rounded-full bg-yellow-500 hover:scale-110 transition"
    />

    {/* STATUS VISUAL */}
    <span>
      {t.status === "passou" && (
        <Check className="text-green-500 w-5 h-5" />
      )}

      {t.status === "falhou" && (
        <X className="text-red-500 w-5 h-5" />
      )}

      {t.status === "pendente" && (
        <Hourglass className="text-yellow-500 w-5 h-5" />
      )}
    </span>

    {/* DELETE */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        deleteTest(t.id);
      }}
      className="text-red-500 hover:scale-110 transition"
    >
      🗑️
    </button>

  </div>

</li>
        ))}
      </ul>

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
              Novo Teste
            </h2>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nome do teste"
              className="border p-2 w-full mb-3 rounded text-gray-900"
            />

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações..."
              className="border p-2 w-full mb-4 rounded text-gray-900"
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setIsOpen(false)}>
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