<div className="grid md:grid-cols-3 gap-4">
  <div className="bg-white p-6 rounded-xl shadow">
    <h2 className="text-green-500 text-2xl font-bold">✔ {stats.passou}</h2>
    <p>Passaram</p>
  </div>

  <div className="bg-white p-6 rounded-xl shadow">
    <h2 className="text-red-500 text-2xl font-bold">❌ {stats.falhou}</h2>
    <p>Falharam</p>
  </div>

  <div className="bg-white p-6 rounded-xl shadow">
    <h2 className="text-yellow-500 text-2xl font-bold">⏳ {stats.pendente}</h2>
    <p>Pendentes</p>
  </div>
</div>