import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
      <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--accent)' }}>404</p>
      <h1 className="text-4xl font-bold" style={{ fontFamily: 'var(--font-space)' }}>Produktas nerastas</h1>
      <Link href="/" className="text-white/60 hover:text-white text-sm transition-colors">← Grįžti į pradžią</Link>
    </main>
  );
}
