import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Upload, CheckCircle2, ChevronLeft, Briefcase, MapPin, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button, Input, Select, Modal, JobTypeBadge } from '../../components/ui';
import { indonesianCities } from '../../data/mockData';

const experienceOptions = [
  'Fresh Graduate',
  '1-2 Tahun',
  '3-4 Tahun',
  '5+ Tahun',
];

export default function ApplyPage() {
  const { roleId } = useParams();
  const { jobs, addApplicant } = useApp();
  const navigate = useNavigate();

  const job = jobs.find((j) => j.id === roleId);
  const [showSuccess, setShowSuccess] = useState(false);

  const [form, setForm] = useState({
    name: '',
    phone: '+62',
    location: '',
    position: job?.id || '',
    yearsExperience: '',
    cvFile: null,
    portfolioFile: null,
  });

  const [errors, setErrors] = useState({});

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500">
        <Briefcase className="w-12 h-12 opacity-30" />
        <p className="font-semibold">Lowongan tidak ditemukan</p>
        <Link to="/jobs"><Button variant="secondary">Kembali ke Daftar Lowongan</Button></Link>
      </div>
    );
  }

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Nama lengkap wajib diisi';
    if (!form.phone || form.phone === '+62') e.phone = 'Nomor HP wajib diisi';
    if (!form.location) e.location = 'Lokasi wajib dipilih';
    if (!form.yearsExperience) e.yearsExperience = 'Pengalaman wajib dipilih';
    if (!form.cvFile) e.cvFile = 'CV wajib diupload';
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleFile = (field) => (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, [field]: file || null }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    addApplicant({
      jobId: job.id,
      name: form.name,
      phone: form.phone,
      location: form.location,
      position: job.title,
      yearsExperience: form.yearsExperience,
      hasPortfolio: !!form.portfolioFile,
      cvFile: form.cvFile?.name || 'cv.pdf',
      portfolioFile: form.portfolioFile?.name || null,
    });

    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back */}
        <Link to="/jobs" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 font-semibold mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Kembali ke Daftar Lowongan
        </Link>

        {/* Job info card */}
        <div className="bg-gradient-to-r from-primary-700 to-indigo-700 text-white rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-indigo-200 text-sm font-semibold mb-1">Melamar untuk posisi</p>
              <h1 className="text-2xl font-extrabold">{job.title}</h1>
              <p className="text-indigo-200 text-sm mt-1">{job.department}</p>
            </div>
            <JobTypeBadge type={job.type} />
          </div>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-indigo-200">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Deadline: {new Date(job.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-xl font-extrabold text-gray-900 mb-1">Form Lamaran</h2>
          <p className="text-sm text-gray-500 mb-8">Lengkapi semua informasi di bawah dengan benar dan jujur.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                label="Nama Lengkap *"
                placeholder="Masukkan nama lengkap kamu"
                value={form.name}
                onChange={handleChange('name')}
                error={errors.name}
              />
              <Input
                label="Nomor Handphone *"
                placeholder="+62812..."
                value={form.phone}
                onChange={handleChange('phone')}
                error={errors.phone}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <Select
                label="Lokasi *"
                value={form.location}
                onChange={handleChange('location')}
                error={errors.location}
              >
                <option value="">Pilih Kota</option>
                {indonesianCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </Select>
              <Select
                label="Pengalaman Kerja *"
                value={form.yearsExperience}
                onChange={handleChange('yearsExperience')}
                error={errors.yearsExperience}
              >
                <option value="">Pilih Pengalaman</option>
                {experienceOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </Select>
            </div>

            {/* Posisi (read-only) */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Posisi yang Dilamar</label>
              <div className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-600 font-medium">
                {job.title}
              </div>
            </div>

            {/* CV Upload */}
            <FileUpload
              label="Upload CV *"
              accept=".pdf,.doc,.docx"
              hint="Format: PDF, DOC, DOCX"
              file={form.cvFile}
              onChange={handleFile('cvFile')}
              error={errors.cvFile}
              id="cv-upload"
            />

            {/* Portfolio Upload */}
            <FileUpload
              label="Upload Portfolio (Opsional)"
              accept=".pdf,.zip"
              hint="Format: PDF, ZIP — Boleh dikosongkan"
              file={form.portfolioFile}
              onChange={handleFile('portfolioFile')}
              id="portfolio-upload"
              optional
            />

            <div className="pt-2">
              <Button type="submit" size="lg" className="w-full">
                Kirim Lamaran
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <Modal isOpen={showSuccess} onClose={() => {}} title="🎉 Lamaran Terkirim!">
        <div className="flex flex-col items-center text-center py-4 gap-5">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9 text-emerald-600" />
          </div>
          <div>
            <p className="text-gray-700 leading-relaxed">
              Lamaran kamu telah kami terima! Hasil seleksi akan diumumkan setelah periode pendaftaran berakhir.
              <span className="font-semibold text-primary-700"> Pantau terus halaman pengumuman.</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => navigate('/jobs')}
            >
              Kembali ke Lowongan
            </Button>
            <Button
              className="flex-1"
              onClick={() => navigate('/announcement')}
            >
              Cek Pengumuman
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function FileUpload({ label, accept, hint, file, onChange, error, id, optional }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-700">
        {label} {optional && <span className="text-gray-400 font-normal">(opsional)</span>}
      </label>
      <label
        htmlFor={id}
        className={`flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors
          ${file ? 'border-primary-400 bg-primary-50' : error ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50/30'}`}
      >
        <Upload className={`w-7 h-7 mb-2 ${file ? 'text-primary-500' : 'text-gray-400'}`} />
        {file ? (
          <span className="text-sm font-semibold text-primary-700">{file.name}</span>
        ) : (
          <>
            <span className="text-sm font-semibold text-gray-600">Klik untuk upload</span>
            <span className="text-xs text-gray-400 mt-1">{hint}</span>
          </>
        )}
        <input id={id} type="file" accept={accept} onChange={onChange} className="hidden" />
      </label>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
