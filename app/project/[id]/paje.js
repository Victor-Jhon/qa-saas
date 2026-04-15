"use client";
import { useState } from "react";

export default function ProjectPage() {
  const [tests, setTests] = useState([]);
  const [title, setTitle] = useState("");

  function addTest() {
    if (!title) return;
    setTests([...tests, { id: Date.now(), title, status: "Não testado" }]);
    setTitle("");
  }

  function updateStatus(id, status) {
    setTests(
      tests.map((t) =>
        t.id === id ? { ...t, status } : t
      )
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Casos de Teste</h1>

      <div className="mb-4">
        <input
          className="border p-2 mr-2"
          placeholder="Novo teste"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          onClick={addTest}
          className="bg-green-500 text-white px-4 py-2"
        >
          Adicionar
        </button>
      </div>

      <ul>
        {tests.map((t) => (
          <li key={t.id} className="mb-3">
            <span className="mr-4">{t.title}</span>

            <button
              onClick={() => updateStatus(t.id, "Passou")}
              className="bg-blue-500 text-white px-2 mr-2"
            >
              Passou
            </button>

            <button
              onClick={() => updateStatus(t.id, "Falhou")}
              className="bg-red-500 text-white px-2 mr-2"
            >
              Falhou
            </button>

            <span>{t.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}