"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data } = await supabase.auth.getUser();

    if (data.user) {
      // 👉 logado
      router.push("/projects"); 
      // ou "/dashboard" se preferir
    } else {
      // 👉 não logado
      router.push("/login");
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <p>Carregando...</p>
    </div>
  );
}