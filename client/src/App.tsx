import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Button } from './components/ui/button';
import { ShieldAlert } from 'lucide-react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import SDS from './pages/SDS';
import Spills from './pages/Spills';
import Deadlines from './pages/Deadlines';
import Audits from './pages/Audits';
import Login from './pages/Login';
import Team from './pages/Team';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <ShieldAlert className="w-16 h-16 text-primary mb-6" />
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-4">
        Chemical Safety Log Vault
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
        The ultimate safety companion for auto-parts & small blender shops. 
        Securely log, track, and manage chemical safety data offline or online.
      </p>
      <div className="flex gap-4">
        <Link to="/login">
          <Button size="lg" className="text-lg px-8 py-6">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/sds" element={<SDS />} />
              <Route path="/spills" element={<Spills />} />
              <Route path="/deadlines" element={<Deadlines />} />
              <Route path="/audits" element={<Audits />} />
              <Route path="/team" element={<Team />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
