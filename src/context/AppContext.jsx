import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);
const API_URL = 'http://localhost:3001/api';

export function AppProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [isRecruiterLoggedIn, setIsRecruiterLoggedIn] = useState(() => {
    return !!localStorage.getItem('token');
  });

  useEffect(() => {
    fetch(`${API_URL}/jobs`).then(res => res.json()).then(setJobs).catch(console.error);
    fetch(`${API_URL}/applicants`).then(res => res.json()).then(setApplicants).catch(console.error);
  }, []);

  // ── Recruiter auth ──────────────────────────────────────────────────────────
  const loginRecruiter = async (username, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        setIsRecruiterLoggedIn(true);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };
  const logoutRecruiter = () => {
    localStorage.removeItem('token');
    setIsRecruiterLoggedIn(false);
  };

  // ── Job management ──────────────────────────────────────────────────────────
  const addJob = async (jobData) => {
    try {
      const res = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      const newJob = await res.json();
      setJobs((prev) => [...prev, newJob]);
      return newJob;
    } catch (e) {
      console.error(e);
    }
  };

  const updateJob = async (jobId, updates) => {
    try {
      const res = await fetch(`${API_URL}/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const updatedJob = await res.json();
      setJobs((prev) => prev.map((j) => (j.id === jobId ? updatedJob : j)));
    } catch (e) {
      console.error(e);
    }
  };

  const closeJob = async (jobId) => {
    try {
      const res = await fetch(`${API_URL}/jobs/${jobId}/close`, { method: 'PATCH' });
      const updatedJob = await res.json();
      setJobs((prev) => prev.map((j) => (j.id === jobId ? updatedJob : j)));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteJob = async (jobId) => {
    try {
      await fetch(`${API_URL}/jobs/${jobId}`, { method: 'DELETE' });
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (e) {
      console.error(e);
    }
  };

  // ── Applicant management ────────────────────────────────────────────────────
  const addApplicant = async (data) => {
    try {
      const res = await fetch(`${API_URL}/applicants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const newApplicant = await res.json();
      setApplicants((prev) => [...prev, newApplicant]);
      setJobs((prev) =>
        prev.map((j) =>
          j.id === data.jobId ? { ...j, totalApplicants: j.totalApplicants + 1 } : j
        )
      );
      return newApplicant;
    } catch (e) {
      console.error(e);
    }
  };

  const overrideApplicantDecision = async (applicantId, decision) => {
    try {
      const res = await fetch(`${API_URL}/applicants/${applicantId}/override`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision })
      });
      const updated = await res.json();
      setApplicants((prev) =>
        prev.map((a) => (a.id === applicantId ? updated : a))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const publishApplicant = async (applicantId) => {
    try {
      const res = await fetch(`${API_URL}/applicants/${applicantId}/publish`, { method: 'PATCH' });
      const updated = await res.json();
      setApplicants((prev) =>
        prev.map((a) => (a.id === applicantId ? updated : a))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const bulkPublish = async (jobId) => {
    try {
      await fetch(`${API_URL}/jobs/${jobId}/bulk-publish`, { method: 'POST' });
      setApplicants((prev) =>
        prev.map((a) => (a.jobId === jobId ? { ...a, published: true } : a))
      );
    } catch (e) {
      console.error(e);
    }
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
        addJob, updateJob, closeJob, deleteJob,
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
