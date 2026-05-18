import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, Briefcase, ArrowRight, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, Badge, Button, JobTypeBadge } from '../../components/ui';

const typeOptions = ['Semua', 'Full-time', 'Remote', 'Hybrid', 'Part-time'];

export default function JobListingPage() {
  const { jobs } = useApp();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('Semua');

  const filtered = jobs.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'Semua' || j.type === typeFilter;
    return matchSearch && matchType;
  });

  const activeJobs = filtered.filter((j) => j.status === 'active');
  const closedJobs = filtered.filter((j) => j.status === 'closed');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-700 to-indigo-700 text-white py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Lowongan Tersedia</h1>
          <p className="text-indigo-200 text-lg mb-8">Temukan posisi yang paling sesuai dengan keahlian dan ambisimu</p>

          {/* Search + Filter */}
          <div className="bg-white rounded-2xl p-4 flex flex-col sm:flex-row gap-3 shadow-xl max-w-2xl mx-auto">
            <div className="flex items-center gap-3 flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Cari posisi atau departemen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 min-w-[160px]">
              <Filter className="w-4 h-4 text-gray-400 shrink-0" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-gray-700"
              >
                {typeOptions.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Active jobs */}
        {activeJobs.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">
                {activeJobs.length} Lowongan Aktif
              </h2>
              <Badge color="green">{activeJobs.length} tersedia</Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-5 mb-12">
              {activeJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-semibold">Tidak ada lowongan yang sesuai</p>
            <p className="text-sm mt-1">Coba ubah kata kunci pencarian atau filter</p>
          </div>
        )}

        {/* Closed jobs */}
        {closedJobs.length > 0 && (
          <>
            <h2 className="text-lg font-bold text-gray-500 mb-4">Lowongan Tutup</h2>
            <div className="grid md:grid-cols-2 gap-5 opacity-60">
              {closedJobs.map((job) => (
                <JobCard key={job.id} job={job} closed />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function JobCard({ job, closed }) {
  const deadline = new Date(job.deadline);
  const isExpired = deadline < new Date();

  return (
    <Card className="p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{job.department}</p>
        </div>
        <JobTypeBadge type={job.type} />
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          Deadline: {new Date(job.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{job.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {job.requirements.slice(0, 4).map((r) => (
          <Badge key={r} color="indigo">{r}</Badge>
        ))}
        {job.requirements.length > 4 && (
          <Badge color="gray">+{job.requirements.length - 4}</Badge>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <span className="text-xs text-gray-400">{job.totalApplicants} pelamar</span>
        {closed || isExpired ? (
          <Badge color="red">Tutup</Badge>
        ) : (
          <Link to={`/apply/${job.id}`}>
            <Button size="sm">
              Lamar Sekarang <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
}
