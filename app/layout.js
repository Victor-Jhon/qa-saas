"use client";

import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  function linkClass(path) {
    return `px-3 py-2 rounded ${
      pathname === path
        ? "bg-blue-500 text-white"
        : "hover:bg-gray-700"
    }`;
  }

  return (
    <html lang="pt-br">
      <body className="bg-slate-100">
        <div className="flex h-screen">

          {/* SIDEBAR */}
          <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col">

  {/* TOPO */}
  <div>
    <h1 className="text-xl font-bold mb-8">QA SaaS</h1>

    <nav className="flex flex-col gap-2">
      <Link href="/projects" className={linkClass("/projects")}>
        📁 Projetos
      </Link>

      <Link href="/dashboard" className={linkClass("/dashboard")}>
        📊 Dashboard
      </Link>
    </nav>
  </div>

  {/* RODAPÉ (LOGOUT) */}
  <div className="mt-auto border-t border-gray-700 pt-4">
    
    <p className="text-xs text-gray-400 mb-2">
      {user?.email}
    </p>

    <button
      onClick={handleLogout}
      className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm transition"
    >
      Logout
    </button>

  </div>

</aside>

          {/* MAIN AREA */}
          <div className="flex-1 flex flex-col">

            {/* HEADER (NOVO 🔥) */}
            <header className="bg-gray-900 border-b px-6 py-4 flex justify-between items-center shadow-sm">
             
            </header>

            {/* CONTENT */}
            <main className="p-6 overflow-auto">
              {children}
            </main>

          </div>
        </div>
      </body>
    </html>
  );
}