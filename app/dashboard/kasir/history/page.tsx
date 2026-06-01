export default function Page(){
  const dummy = [
    {id: 't1', time: '08:12', items: 3, total: 65000},
    {id: 't2', time: '09:30', items: 1, total: 22000},
    {id: 't3', time: '11:05', items: 2, total: 42000},
  ]

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-semibold">History Transaksi</h1>
        <p className="mt-2 text-sm text-muted-foreground">Riwayat pembayaran terakhir di kasir.</p>

        <div className="mt-6 space-y-3">
          {dummy.map(d => (
            <div key={d.id} className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <div className="font-medium">{d.id.toUpperCase()}</div>
                <div className="text-xs text-muted-foreground">{d.time} — {d.items} item</div>
              </div>
              <div className="font-semibold">Rp {d.total.toLocaleString('id-ID')}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}