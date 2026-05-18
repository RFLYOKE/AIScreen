import { useState } from 'react';
import { Search, Bell, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button, Card } from '../../components/ui';

export default function AnnouncementPage() {
  const { lookupCandidate, getEffectiveDecision } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [searched, setSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    // simulate small delay for UX
    setTimeout(() => {
      const found = lookupCandidate(query);
      setResults(found);
      setSearched(true);
      setIsSearching(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-700 to-indigo-700 text-white py-14">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Bell className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Pengumuman Seleksi</h1>
          <p className="text-indigo-200 text-base">
            Masukkan nama lengkap atau nomor HP kamu untuk mengecek status lamaran.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Search form */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-3 flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary-400 focus-within:border-primary-400 transition-shadow">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Nama lengkap atau nomor HP (+62...)"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSearched(false); }}
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
              />
            </div>
            <Button type="submit" size="md" disabled={isSearching || !query.trim()}>
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cek Status'}
            </Button>
          </form>
        </Card>

        {/* Results */}
        {searched && (
          <div className="flex flex-col gap-4">
            {results && results.length > 0 ? (
              results.map((applicant) => (
                <AnnouncementCard
                  key={applicant.id}
                  applicant={applicant}
                  decision={getEffectiveDecision(applicant)}
                />
              ))
            ) : (
              <Card className="p-10 text-center text-gray-400">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-semibold text-gray-500">Data tidak ditemukan</p>
                <p className="text-sm mt-1">Pastikan nama atau nomor HP yang kamu masukkan sudah benar dan sesuai dengan yang didaftarkan.</p>
              </Card>
            )}
          </div>
        )}

        {/* Empty state (before search) */}
        {!searched && !isSearching && (
          <div className="text-center text-gray-400 py-10">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-sm">Masukkan nama atau nomor HP di atas untuk mengecek status lamaran kamu.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AnnouncementCard({ applicant, decision }) {
  if (!applicant.published) {
    return (
      <Card className="p-6 border-l-4 border-amber-400">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-gray-900">{applicant.name}</span>
              <span className="text-xs text-gray-400">—</span>
              <span className="text-sm font-semibold text-gray-600">{applicant.position}</span>
            </div>
            <p className="text-amber-700 font-semibold text-sm">⏳ Menunggu Pengumuman</p>
            <p className="text-gray-500 text-sm mt-1">
              Hasil seleksi sedang diproses. Pantau terus halaman ini untuk update terbaru.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (decision === 'lolos') {
    return (
      <Card className="p-6 border-l-4 border-emerald-500">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-gray-900">{applicant.name}</span>
              <span className="text-xs text-gray-400">—</span>
              <span className="text-sm font-semibold text-gray-600">{applicant.position}</span>
            </div>
            <p className="text-emerald-700 font-bold text-sm">🎉 Selamat! Kamu Lolos ke Tahap Berikutnya</p>
            <p className="text-gray-500 text-sm mt-1">
              Kamu berhasil lolos seleksi awal untuk posisi <strong>{applicant.position}</strong>. Tim HR kami akan menghubungi kamu melalui nomor yang terdaftar untuk tahap selanjutnya.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-l-4 border-gray-300">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
          <XCircle className="w-5 h-5 text-gray-500" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-gray-900">{applicant.name}</span>
            <span className="text-xs text-gray-400">—</span>
            <span className="text-sm font-semibold text-gray-600">{applicant.position}</span>
          </div>
          <p className="text-gray-700 font-semibold text-sm">Terima kasih atas minatmu.</p>
          <p className="text-gray-500 text-sm mt-1">
            Saat ini kamu belum lolos seleksi ini. Jangan menyerah — terus tingkatkan skill dan coba lagi di kesempatan berikutnya. Semangat! 💪
          </p>
        </div>
      </div>
    </Card>
  );
}
