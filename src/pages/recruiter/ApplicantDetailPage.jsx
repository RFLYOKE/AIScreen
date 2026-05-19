import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft, MapPin, Phone, Briefcase, Award, Star,
  CheckCircle2, XCircle, Globe, Pencil, FileText, FolderOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, Badge, Button, Modal, Select } from '../../components/ui';

export default function ApplicantDetailPage() {
  const { jobId, applicantId } = useParams();
  const { applicants, getEffectiveDecision, overrideApplicantDecision, publishApplicant } = useApp();

  const applicant = applicants.find((a) => a.id === applicantId);
  // job var removed

  const [overrideModal, setOverrideModal] = useState(false);
  const [overrideValue, setOverrideValue] = useState('lolos');

  if (!applicant) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
        Data pelamar tidak ditemukan.
      </div>
    );
  }

  const decision = getEffectiveDecision(applicant);

  const handleOverride = () => {
    overrideApplicantDecision(applicant.id, overrideValue);
    setOverrideModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <Link
        to={`/recruiter/applicants/${jobId}`}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 font-semibold mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Kembali ke Daftar Pelamar
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Left column ──────────────────────────────── */}
        <div className="flex flex-col gap-5">
          {/* Profile card */}
          <Card className="p-6">
            <div className="flex flex-col items-center text-center gap-3 pb-5 border-b border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold shadow-lg">
                {applicant.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-gray-900">{applicant.name}</h1>
                <p className="text-sm text-primary-600 font-semibold">{applicant.position}</p>
              </div>
              {decision === 'lolos'
                ? <Badge color="green" className="text-sm px-3 py-1">✓ Lolos Seleksi</Badge>
                : <Badge color="red" className="text-sm px-3 py-1">✗ Tidak Lolos</Badge>
              }
              {applicant.overrideDecision && (
                <Badge color="yellow">Override oleh Rekruter</Badge>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                {applicant.phone}
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                {applicant.location}
              </div>
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
                {applicant.yearsExperience}
              </div>
              <div className="flex items-center gap-2.5">
                <FolderOpen className="w-4 h-4 text-gray-400 shrink-0" />
                Portfolio: {applicant.hasPortfolio ? <Badge color="green">Ada</Badge> : <Badge color="gray">Tidak Ada</Badge>}
              </div>
            </div>
          </Card>

          {/* Files */}
          <Card className="p-5">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">Dokumen</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <FileText className="w-4 h-4 text-primary-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-700 truncate">{applicant.cvFile}</p>
                  <p className="text-xs text-gray-400">Curriculum Vitae</p>
                </div>
              </div>
              {applicant.portfolioFile && (
                <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <FolderOpen className="w-4 h-4 text-primary-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">{applicant.portfolioFile}</p>
                    <p className="text-xs text-gray-400">Portfolio</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-5 flex flex-col gap-3">
            <h3 className="font-bold text-gray-800 text-sm">Aksi Rekruter</h3>
            <Button
              variant="secondary"
              size="sm"
              className="w-full justify-start"
              onClick={() => { setOverrideValue(decision); setOverrideModal(true); }}
            >
              <Pencil className="w-4 h-4 text-amber-500" /> Override Keputusan
            </Button>
            {!applicant.published ? (
              <Button
                size="sm"
                className="w-full justify-start"
                onClick={() => publishApplicant(applicant.id)}
              >
                <Globe className="w-4 h-4" /> Publish Hasil ke Kandidat
              </Button>
            ) : (
              <div className="flex items-center gap-2 text-sm text-emerald-600 font-semibold px-2">
                <CheckCircle2 className="w-4 h-4" /> Hasil Sudah Dipublish
              </div>
            )}
          </Card>
        </div>

        {/* ── Right column ─────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* AI Score */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-primary-600" />
              </div>
              <h2 className="font-extrabold text-gray-900">AI Scoring Analysis</h2>
            </div>

            {/* Score gauge */}
            <div className="flex items-center gap-6 mb-6 p-4 bg-gray-50 rounded-2xl">
              <div className="relative w-24 h-24 shrink-0">
                <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke={applicant.aiScore >= 80 ? '#10b981' : applicant.aiScore >= 60 ? '#f59e0b' : '#f43f5e'}
                    strokeWidth="3"
                    strokeDasharray={`${applicant.aiScore} 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-gray-900">{applicant.aiScore}</span>
                  <span className="text-xs text-gray-400">/ 100</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-700 mb-1">Semantic Similarity Score</p>
                <p className="text-xs text-gray-500 leading-relaxed">{applicant.aiReason}</p>
              </div>
            </div>

            {/* Keputusan AI */}
            <div className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-gray-200 bg-white mb-4">
              {applicant.aiDecision === 'lolos'
                ? <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                : <XCircle className="w-6 h-6 text-red-400 shrink-0" />
              }
              <div>
                <p className="text-xs text-gray-500 font-medium">Keputusan AI</p>
                <p className={`font-bold text-sm ${applicant.aiDecision === 'lolos' ? 'text-emerald-700' : 'text-red-600'}`}>
                  {applicant.aiDecision === 'lolos' ? 'Lolos Seleksi Awal' : 'Tidak Lolos Seleksi'}
                </p>
              </div>
            </div>
          </Card>

          {/* Skills */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary-600" />
              </div>
              <h2 className="font-extrabold text-gray-900">Skills Terdeteksi</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {applicant.aiSkills.length > 0 ? applicant.aiSkills.map((skill) => (
                <Badge key={skill} color="primary">{skill}</Badge>
              )) : <p className="text-sm text-gray-400">Belum ada data skill terdeteksi.</p>}
            </div>
          </Card>

          {/* Certifications */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="font-extrabold text-gray-900">Sertifikasi</h2>
            </div>
            {applicant.aiCertifications.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {applicant.aiCertifications.map((cert) => (
                  <li key={cert} className="flex items-center gap-2.5 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    {cert}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">Tidak ada sertifikasi terdeteksi.</p>
            )}
          </Card>
        </div>
      </div>

      {/* Override Modal */}
      <Modal isOpen={overrideModal} onClose={() => setOverrideModal(false)} title="Override Keputusan AI">
        <div className="flex flex-col gap-5">
          <p className="text-sm text-gray-600">
            Ubah keputusan AI untuk <strong>{applicant.name}</strong>. Perubahan ini akan menggantikan hasil analisis AI.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
            ⚠️ Skor AI: <strong>{applicant.aiScore}/100</strong> — Keputusan AI: <strong>{applicant.aiDecision === 'lolos' ? 'Lolos' : 'Tidak Lolos'}</strong>
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
            <Button variant="secondary" className="flex-1" onClick={() => setOverrideModal(false)}>Batal</Button>
            <Button className="flex-1" onClick={handleOverride}>Simpan Override</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
