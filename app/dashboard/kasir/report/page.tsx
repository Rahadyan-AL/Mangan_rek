export default function Page(){
  const totalDaily = 650000;
  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-semibold">Laporan Kasir</h1>
        <p className="mt-2 text-sm text-muted-foreground">Ringkasan penjualan hari ini.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="text-sm text-muted-foreground">Total Harian</div>
            <div className="mt-2 text-3xl font-bold">Rp {totalDaily.toLocaleString('id-ID')}</div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="text-sm text-muted-foreground">Transaksi</div>
            <div className="mt-2 text-xl font-semibold">120</div>
          </div>
        </div>
      </div>
    </main>
  )
}