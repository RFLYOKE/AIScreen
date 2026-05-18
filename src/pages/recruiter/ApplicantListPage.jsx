import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Filter, Eye, Pencil, Globe, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, Badge, Button, ScoreBadge, DecisionBadge, Modal, Select } from '../../components/ui';

export default function ApplicantListPage() {
  const { jobId } = useParams();
  const { jobs, getApplicantsByJob, getEffectiveDecision, overrideApplicantDecision, publishApplicant, bulkPublish } = useApp();

  const job = jobs.find((j) => j.id === jobId);
  const allApplicants = getApplicantsByJob(jobId);

  const [filterDecision, setFilterDecision] = useState('Semua');
  const [overrideModal, setOverrideModal] = useState(null); // applicant object
  // viewModal state removed
  const [overrideValue, setOverrideValue] = useState('lolos');

  const filtered = allApplicants.filter((a) => {
    if (filterDecision === 'Semua') return true;
    if (filterDecision === 'Lolos') return getEffectiveDecision(a) === 'lolos';
    if (filterDecision === 'Tidak Lolos') return getEffectiveDecision(a) === 'tidak_lolos';
    if (filterDecision === 'Belum Publish') return !a.published;
    return true;
  });

  const handleOverride = () => {
    overrideApplicantDecision(overrideModal.id, overrideValue);
    setOverrideModal(null);
  };

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
        Lowongan tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <Link to="/recruiter/jobs" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 font-semibold mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Kembali ke Manajemen Lowongan
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Pelamar — {job.title}</h1>
          <p className="text-gray-500 text-sm mt-1">{allApplicants.length} pelamar masuk</p>
        </div>
        <Button onClick={() => bulkPublish(jobId)} variant="success">
          <Send className="w-4 h-4" /> Publish Semua Hasil
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Filter className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-500 font-medium">Filter:</span>
        {['Semua', 'Lolos', 'Tidak Lolos', 'Belum Publish'].map((f) => (
          <button
            key={f}
            onClick={() => setFilterDecision(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${
              filterDecision === f
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Nama', 'Lokasi', 'Pengalaman', 'Portfolio', 'Skor AI', 'Keputusan AI', 'Status Publish', 'Aksi'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-gray-400">
                    Tidak ada pelamar yang sesuai filter.
                  </td>
                </tr>
              ) : filtered.map((applicant) => {
                const decision = getEffectiveDecision(applicant);
                return (
                  <tr key={applicant.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">{applicant.name}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{applicant.location}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">{applicant.yearsExperience}</td>
                    <td className="px-5 py-4">
                      {applicant.hasPortfolio
                        ? <Badge color="green">Ya</Badge>
                        : <Badge color="gray">Tidak</Badge>}
                    </td>
                    <td className="px-5 py-4"><ScoreBadge score={applicant.aiScore} /></td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <DecisionBadge decision={decision} />
                        {applicant.overrideDecision && (
                          <span className="text-xs text-amber-600 font-semibold">Override</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {applicant.published
                        ? <Badge color="indigo">Published</Badge>
                        : <Badge color="gray">Draft</Badge>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Link to={`/recruiter/applicants/${jobId}/${applicant.id}`}>
                          <Button variant="ghost" size="sm" title="Lihat Detail">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Override Keputusan"
                          onClick={() => { setOverrideModal(applicant); setOverrideValue(decision); }}
                          className="text-amber-600 hover:bg-amber-50"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        {!applicant.published && (
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Publish Hasil"
                            onClick={() => publishApplicant(applicant.id)}
                            className="text-primary-600 hover:bg-primary-50"
                          >
                            <Globe className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Override Modal */}
      <Modal isOpen={!!overrideModal} onClose={() => setOverrideModal(null)} title="Override Keputusan AI">
        {overrideModal && (
          <div className="flex flex-col gap-5">
            <p className="text-sm text-gray-600">
              Ubah keputusan AI untuk <strong>{overrideModal.name}</strong>. Tindakan ini akan menggantikan hasil analisis AI.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
              ⚠️ Skor AI asli: <strong>{overrideModal.aiScore}/100</strong> — Keputusan AI: <strong>{overrideModal.aiDecision === 'lolos' ? 'Lolos' : 'Tidak Lolos'}</strong>
            </div>
            <Select
              label="Keputusan Baru"
              value={overrideValue}
              onChange={(e) => setOverrideValue(e.target.value)}
            >
              <option value="lolos">✓ Lolos</option>
              <option value="tidak_lolos">✗ Tidak Lolos</option>
            </Select>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setOverrideModal(null)}>Batal</Button>
              <Button className="flex-1" onClick={handleOverride}>Simpan Override</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
