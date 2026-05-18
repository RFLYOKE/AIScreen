import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';

// Candidate pages
import LandingPage from './pages/candidate/LandingPage';
import JobListingPage from './pages/candidate/JobListingPage';
import ApplyPage from './pages/candidate/ApplyPage';
import AnnouncementPage from './pages/candidate/AnnouncementPage';

// Recruiter pages
import RecruiterLoginPage from './pages/recruiter/RecruiterLoginPage';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import JobManagementPage from './pages/recruiter/JobManagementPage';
import ApplicantListPage from './pages/recruiter/ApplicantListPage';
import ApplicantDetailPage from './pages/recruiter/ApplicantDetailPage';

// Layout for candidate pages (with navbar)
function CandidateLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

// Layout for recruiter pages (with navbar, requires auth)
function RecruiterLayout() {
  const { isRecruiterLoggedIn } = useApp();
  if (!isRecruiterLoggedIn) return <Navigate to="/recruiter/login" replace />;
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Candidate routes */}
      <Route element={<CandidateLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/jobs" element={<JobListingPage />} />
        <Route path="/apply/:roleId" element={<ApplyPage />} />
        <Route path="/announcement" element={<AnnouncementPage />} />
      </Route>

      {/* Recruiter login (no navbar) */}
      <Route path="/recruiter/login" element={<RecruiterLoginPage />} />

      {/* Recruiter protected routes */}
      <Route element={<RecruiterLayout />}>
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/jobs" element={<JobManagementPage />} />
        <Route path="/recruiter/applicants/:jobId" element={<ApplicantListPage />} />
        <Route path="/recruiter/applicants/:jobId/:applicantId" element={<ApplicantDetailPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
