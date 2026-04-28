"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Check, X, Hourglass } from "lucide-react";

export default function TestPage() {
  const params = useParams();
  const id = params.id;

  const [test, setTest] = useState(null);
  const [notes, setNotes] = useState("");
  const [editing, setEditing] = useState(false);

  // 🔥 NOVO (edição de título)
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (id) fetchTest();
  }, [id]);

  async function fetchTest() {
    const { data } = await supabase
      .from("test_cases")
      .select("*")
      .eq("id", id)
      .single();

    setTest(data);
    setNotes(data?.notes || "");
    setTitle(data?.title || ""); // 🔥 importante
  }

  async function saveNotes() {
    await supabase
      .from("test_cases")
      .update({ notes })
      .eq("id", id);

    setEditing(false);
    fetchTest();
  }

  // 🔥 NOVA FUNÇÃO
  async function saveTitle() {
    await supabase
      .from("test_cases")
      .update({ title })
      .eq("id", id);

    setEditingTitle(false);
    fetchTest();
  }

  if (!test) return <p className="p-6">Carregando...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="mb-8">

        {/* TÍTULO + BOTÃO */}
        <div className="flex items-center justify-between mb-2">

          {!editingTitle ? (
            <h1 className="text-3xl font-bold text-gray-900">
              {test.title}
            </h1>
          ) : (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-3xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
            />
          )}

          {!editingTitle ? (
            <button
              onClick={() => setEditingTitle(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              Editar
            </button>
          ) : (
            <button
              onClick={saveTitle}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              Salvar
            </button>
          )}

        </div>

        {/* STATUS */}
        <div className="flex items-center gap-2 text-gray-800 font-medium">

          {test.status === "passou" && (
            <>
              <Check className="text-green-600 w-5 h-5" />
              <span>Passou</span>
            </>
          )}

          {test.status === "falhou" && (
            <>
              <X className="text-red-600 w-5 h-5" />
              <span>Falhou</span>
            </>
          )}

          {test.status === "pendente" && (
            <>
              <Hourglass className="text-yellow-600 w-5 h-5" />
              <span>Pendente</span>
            </>
          )}

        </div>

      </div>

      {/* CARD OBSERVAÇÕES */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 max-w-2xl">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Observações
          </h2>

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              Editar
            </button>
          ) : (
            <button
              onClick={saveNotes}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              Salvar
            </button>
          )}
        </div>

        {!editing ? (
          <p className="text-gray-600 leading-relaxed">
            {test.notes || "Nenhuma observação adicionada."}
          </p>
        ) : (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={5}
          />
        )}

      </div>

    </div>
  );
}