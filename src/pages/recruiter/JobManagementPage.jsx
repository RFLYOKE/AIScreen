import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, XCircle, Users, Calendar, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, Badge, Button, Input, Select, Textarea, Modal, JobTypeBadge } from '../../components/ui';
import Swal from 'sweetalert2';
import { indonesianProvinces } from '../../data/mockData';

const emptyForm = { title: '', description: '', type: 'Full-time', location: '', deadline: '' };

export default function JobManagementPage() {
  const { jobs, addJob, updateJob, closeJob, deleteJob } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const openAdd = () => {
    setEditingJob(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (job) => {
    setEditingJob(job);
    setForm({ title: job.title, description: job.description, type: job.type, location: job.location || '', deadline: job.deadline });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Nama posisi wajib diisi';
    if (!form.description.trim()) e.description = 'Deskripsi wajib diisi';
    if (!form.location) e.location = 'Lokasi wajib dipilih';
    if (!form.deadline) e.deadline = 'Deadline wajib diisi';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    if (editingJob) {
      updateJob(editingJob.id, form);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Lowongan berhasil diubah',
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      addJob(form);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Lowongan baru berhasil ditambahkan',
        timer: 1500,
        showConfirmButton: false
      });
    }
    setModalOpen(false);
  };

  const handleChange = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Manajemen Lowongan</h1>
          <p className="text-gray-500 text-sm mt-1">{jobs.length} total lowongan terdaftar</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4" /> Tambah Lowongan
        </Button>
      </div>

      {/* Table */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Nama Posisi', 'Tipe', 'Status', 'Deadline', 'Pelamar', 'Aksi'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-gray-900">{job.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{job.department}</div>
                  </td>
                  <td className="px-5 py-4"><JobTypeBadge type={job.type} /></td>
                  <td className="px-5 py-4">
                    {job.status === 'active'
                      ? <Badge color="green">Aktif</Badge>
                      : <Badge color="red">Tutup</Badge>}
                  </td>
                  <td className="px-5 py-4 text-gray-600 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {new Date(job.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      {job.totalApplicants}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/recruiter/applicants/${job.id}`}>
                        <Button variant="ghost" size="sm" className="text-primary-600 hover:bg-primary-50">
                          <Users className="w-3.5 h-3.5" /> Pelamar
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => openEdit(job)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      {job.status === 'active' && (
                        <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => closeJob(job.id)}>
                          <XCircle className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => {
                        Swal.fire({
                          title: 'Hapus Lowongan?',
                          text: "Lowongan ini akan dihapus permanen!",
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#ef4444',
                          cancelButtonColor: '#6b7280',
                          confirmButtonText: 'Ya, hapus!',
                          cancelButtonText: 'Batal'
                        }).then((result) => {
                          if (result.isConfirmed) {
                            deleteJob(job.id);
                            Swal.fire('Terhapus!', 'Lowongan berhasil dihapus.', 'success');
                          }
                        });
                      }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingJob ? 'Edit Lowongan' : 'Tambah Lowongan Baru'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Nama Posisi *"
            placeholder="cth: Senior Data Analyst"
            value={form.title}
            onChange={handleChange('title')}
            error={errors.title}
          />
          <Textarea
            label="Deskripsi Pekerjaan *"
            placeholder="Jelaskan tanggung jawab, kualifikasi, dan benefit..."
            value={form.description}
            onChange={handleChange('description')}
            error={errors.description}
            rows={4}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Tipe Pekerjaan" value={form.type} onChange={handleChange('type')}>
              {['Full-time', 'Part-time', 'Remote', 'Hybrid'].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </Select>
            <Select
              label="Lokasi *"
              value={form.location}
              onChange={handleChange('location')}
              error={errors.location}
            >
              <option value="">Pilih Wilayah</option>
              {indonesianProvinces.map((prov) => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </Select>
            <Input
              label="Deadline *"
              type="date"
              value={form.deadline}
              onChange={handleChange('deadline')}
              error={errors.deadline}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" className="flex-1">
              {editingJob ? 'Simpan Perubahan' : 'Tambah Lowongan'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
