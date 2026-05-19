import { Link } from 'react-router-dom';
import {
  Users, CheckCircle2, XCircle, Trophy,
  TrendingUp, ArrowRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { Card, Badge } from '../../components/ui';

const COLORS = ['#ef4444', '#dc2626', '#9ca3af', '#475569', '#f87171', '#1e293b'];

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <Card className="p-6 flex items-start gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-3xl font-extrabold text-gray-900 mt-0.5">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  </Card>
);

export default function RecruiterDashboard() {
  const { stats, applicants, jobs, getEffectiveDecision } = useApp();

  const passRate = stats.totalApplicants > 0
    ? Math.round((stats.totalLolos / stats.totalApplicants) * 100)
    : 0;

  const pieData = [
    { name: 'Lolos', value: stats.totalLolos },
    { name: 'Tidak Lolos', value: stats.totalTidakLolos },
  ];

  const recentApplicants = [...applicants]
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Ringkasan aktivitas rekrutmen terkini</p>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard
          icon={Users}
          label="Total Pelamar"
          value={stats.totalApplicants}
          color="bg-primary-50 text-primary-600"
          sub={`Dari ${jobs.length} posisi`}
        />
        <StatCard
          icon={CheckCircle2}
          label="Lolos Screening"
          value={stats.totalLolos}
          color="bg-emerald-50 text-emerald-600"
          sub={`${passRate}% pass rate`}
        />
        <StatCard
          icon={XCircle}
          label="Tidak Lolos"
          value={stats.totalTidakLolos}
          color="bg-red-50 text-red-500"
          sub="Hasil AI screening"
        />
        <StatCard
          icon={Trophy}
          label="Posisi Terpopuler"
          value={stats.topPosition}
          color="bg-amber-50 text-amber-500"
          sub="Pelamar terbanyak"
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-5 gap-6 mb-10">
        {/* Bar chart */}
        <Card className="lg:col-span-3 p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            <h2 className="font-bold text-gray-900">Pelamar per Posisi</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.byPosition} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }}
              />
              <Bar dataKey="value" name="Pelamar" radius={[6, 6, 0, 0]}>
                {stats.byPosition.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-gray-900">Lolos vs Tidak Lolos</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                <Cell fill="#10b981" />
                <Cell fill="#f43f5e" />
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', fontSize: 12 }} />
              <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent applicants */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-900">Pelamar Terbaru</h2>
          <Link to="/recruiter/jobs" className="text-primary-600 text-sm font-semibold hover:underline flex items-center gap-1">
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Nama', 'Posisi', 'Pengalaman', 'Skor AI', 'Keputusan', 'Status'].map((h) => (
                  <th key={h} className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentApplicants.map((a) => {
                const decision = getEffectiveDecision(a);
                return (
                  <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 font-semibold text-gray-800">{a.name}</td>
                    <td className="py-3 text-gray-600">{a.position}</td>
                    <td className="py-3 text-gray-500 text-xs">{a.yearsExperience}</td>
                    <td className="py-3">
                      <span className={`font-bold ${a.aiScore >= 80 ? 'text-emerald-600' : a.aiScore >= 60 ? 'text-amber-600' : 'text-red-500'}`}>
                        {a.aiScore}
                      </span>
                    </td>
                    <td className="py-3">
                      {decision === 'lolos'
                        ? <Badge color="green">Lolos</Badge>
                        : <Badge color="red">Tidak Lolos</Badge>}
                    </td>
                    <td className="py-3">
                      {a.published
                        ? <Badge color="primary">Published</Badge>
                        : <Badge color="gray">Draft</Badge>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
