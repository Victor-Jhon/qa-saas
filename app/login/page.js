"use client";


import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Verifica se já está logado
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        // Redireciona para a página de projetos (ajuste o id se necessário)
        router.replace("/project/1");
      }
    });
  }, [router]);

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      alert("Erro ao logar");
    } else {
      alert("Verifique seu email!");
      // Opcional: redireciona após login (se não usar magic link)
      // router.replace("/project/1");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Login</h1>

      <input
        type="email"
        placeholder="Seu email"
        className="border p-2 mr-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Entrar
      </button>
    </div>
  );
}