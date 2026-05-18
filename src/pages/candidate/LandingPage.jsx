import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, Sparkles, ShieldCheck, BarChart3, CheckCircle } from 'lucide-react';

const features = [
  { icon: BrainCircuit, title: 'AI-Powered Screening', desc: 'Teknologi BERT & SBERT kami menganalisis CV secara mendalam untuk hasil yang akurat dan objektif.' },
  { icon: ShieldCheck, title: 'Transparan & Adil', desc: 'Setiap keputusan seleksi didasarkan pada data dan relevansi skill, bukan faktor subjektif.' },
  { icon: BarChart3, title: 'Hasil Cepat', desc: 'Proses screening otomatis mempersingkat waktu rekrutmen hingga 70% lebih efisien.' },
];

const steps = [
  { number: '01', title: 'Lihat Lowongan', desc: 'Temukan posisi yang sesuai dengan skill dan minat kamu.' },
  { number: '02', title: 'Upload CV', desc: 'Isi form dan upload CV kamu — prosesnya cepat dan mudah.' },
  { number: '03', title: 'AI Screening', desc: 'AI kami menganalisis CV kamu secara otomatis dan objektif.' },
  { number: '04', title: 'Pantau Hasil', desc: 'Cek status lamaran kamu di halaman pengumuman.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-900 to-indigo-900 text-white">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-semibold text-indigo-200 mb-8">
            <Sparkles className="w-4 h-4" />
            Didukung Teknologi BERT & SBERT
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            Lamar Pekerjaan Impianmu,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300">
              Cepat & Transparan
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-300 mb-10 leading-relaxed">
            Platform rekrutmen berbasis AI yang menganalisis CV kamu secara cerdas dan objektif.
            Tidak ada bias, tidak ada subjektivitas — hanya data dan relevansi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/jobs"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-base shadow-lg"
            >
              Lihat Lowongan <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/announcement"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-base"
            >
              Cek Status Lamaran
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
            {[['6+', 'Posisi Tersedia'], ['10+', 'Pelamar Aktif'], ['95%', 'Akurasi AI']].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-extrabold text-white">{val}</div>
                <div className="text-xs text-slate-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900">Mengapa RitaScreen?</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">Kami menggunakan teknologi terdepan untuk memastikan proses rekrutmen yang adil dan efisien.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group p-8 rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300 bg-white">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary-100 transition-colors">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900">Cara Kerja</h2>
            <p className="mt-3 text-gray-500">Empat langkah sederhana menuju karir impianmu</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.number} className="relative">
                <div className="text-5xl font-extrabold text-primary-100 mb-4">{step.number}</div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary-200 to-transparent -translate-y-1/2 z-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-indigo-600 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <CheckCircle className="w-12 h-12 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-extrabold mb-4">Siap Memulai Perjalanan Karirmu?</h2>
          <p className="text-indigo-200 mb-8">Lihat lowongan yang tersedia dan kirim lamaran sekarang. Proses cepat, transparan, dan berbasis AI.</p>
          <Link
            to="/jobs"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-base shadow-lg"
          >
            Mulai Sekarang <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary-400" />
            <span className="font-bold text-white">RitaScreen</span>
          </div>
          <p className="text-sm">© 2026 RitaScreen. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
