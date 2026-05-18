import { createContext, useContext, useState } from 'react';
import { mockJobs, mockApplicants } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [jobs, setJobs] = useState(mockJobs);
  const [applicants, setApplicants] = useState(mockApplicants);
  const [isRecruiterLoggedIn, setIsRecruiterLoggedIn] = useState(false);

  // ── Recruiter auth ──────────────────────────────────────────────────────────
  const loginRecruiter = () => setIsRecruiterLoggedIn(true);
  const logoutRecruiter = () => setIsRecruiterLoggedIn(false);

  // ── Job management ──────────────────────────────────────────────────────────
  const addJob = (jobData) => {
    const newJob = {
      ...jobData,
      id: `job-${Date.now()}`,
      status: 'active',
      totalApplicants: 0,
    };
    setJobs((prev) => [...prev, newJob]);
    return newJob;
  };

  const updateJob = (jobId, updates) => {
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, ...updates } : j)));
  };

  const closeJob = (jobId) => updateJob(jobId, { status: 'closed' });

  // ── Applicant management ────────────────────────────────────────────────────
  const addApplicant = (data) => {
    const job = jobs.find((j) => j.id === data.jobId);
    const newApplicant = {
      ...data,
      id: `app-${Date.now()}`,
      position: job?.title || data.position,
      aiScore: Math.floor(Math.random() * 30) + 60,
      aiDecision: Math.random() > 0.4 ? 'lolos' : 'tidak_lolos',
      aiSkills: [],
      aiCertifications: [],
      aiReason: 'Proses analisis sedang berjalan. Hasil akan tersedia segera.',
      published: false,
      overrideDecision: null,
      appliedAt: new Date().toISOString().split('T')[0],
    };
    setApplicants((prev) => [...prev, newApplicant]);
    setJobs((prev) =>
      prev.map((j) =>
        j.id === data.jobId ? { ...j, totalApplicants: j.totalApplicants + 1 } : j
      )
    );
    return newApplicant;
  };

  const overrideApplicantDecision = (applicantId, decision) => {
    setApplicants((prev) =>
      prev.map((a) =>
        a.id === applicantId ? { ...a, overrideDecision: decision } : a
      )
    );
  };

  const publishApplicant = (applicantId) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === applicantId ? { ...a, published: true } : a))
    );
  };

  const bulkPublish = (jobId) => {
    setApplicants((prev) =>
      prev.map((a) => (a.jobId === jobId ? { ...a, published: true } : a))
    );
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const getApplicantsByJob = (jobId) => applicants.filter((a) => a.jobId === jobId);

  const getEffectiveDecision = (applicant) =>
    applicant.overrideDecision || applicant.aiDecision;

  const lookupCandidate = (query) => {
    const q = query.trim().toLowerCase();
    return applicants.filter(
      (a) =>
        a.name.toLowerCase().includes(q) || a.phone.replace(/\s/g, '').includes(q.replace(/\s/g, ''))
    );
  };

  // ── Stats ────────────────────────────────────────────────────────────────────
  const stats = {
    totalApplicants: applicants.length,
    totalLolos: applicants.filter((a) => getEffectiveDecision(a) === 'lolos').length,
    totalTidakLolos: applicants.filter((a) => getEffectiveDecision(a) === 'tidak_lolos').length,
    topPosition: (() => {
      const counts = {};
      applicants.forEach((a) => { counts[a.position] = (counts[a.position] || 0) + 1; });
      return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
    })(),
    byPosition: (() => {
      const counts = {};
      applicants.forEach((a) => { counts[a.position] = (counts[a.position] || 0) + 1; });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    })(),
  };

  return (
    <AppContext.Provider
      value={{
        jobs, applicants, isRecruiterLoggedIn,
        loginRecruiter, logoutRecruiter,
        addJob, updateJob, closeJob,
        addApplicant, overrideApplicantDecision, publishApplicant, bulkPublish,
        getApplicantsByJob, getEffectiveDecision, lookupCandidate,
        stats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
