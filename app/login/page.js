"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      alert("Erro ao enviar email");
    } else {
      alert("Verifique seu email para login");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">

        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          QA Hub 🚀
        </h1>

        <p className="text-gray-500 text-sm text-center mb-6">
          Entre com seu email para continuar
        </p>

        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
        >
          Entrar
        </button>

      </div>

    </div>
  );
}