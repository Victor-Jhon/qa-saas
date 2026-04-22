"use client";

import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className="bg-gray-100">
        <div className="flex">

          {/* SIDEBAR */}
          <aside className="w-64 h-screen bg-gray-900 text-white p-5">
            <h1 className="text-xl font-bold mb-6">QA SaaS</h1>

            <nav className="flex flex-col gap-4">
              <Link href="/projects">📁 Projetos</Link>
              <Link href="/dashboard">📊 Dashboard</Link>
              <Link href="/login">🔐 Login</Link>
            </nav>
          </aside>

          {/* CONTEÚDO */}
          <main className="flex-1 p-6">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}