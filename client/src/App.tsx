import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button } from './components/ui/button';
import { ShieldAlert } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
      <ShieldAlert className="w-16 h-16 text-primary mb-6" />
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl mb-4">
        Chemical Safety Log Vault
      </h1>
      <p className="text-xl text-slate-600 mb-8 max-w-2xl">
        The ultimate safety companion for auto-parts & small blender shops. 
        Securely log, track, and manage chemical safety data offline or online.
      </p>
      <Link to="/dashboard">
        <Button size="lg" className="text-lg px-8 py-6">
          Launch App
        </Button>
      </Link>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p className="text-slate-600">Welcome to your Chemical Safety Log Vault dashboard.</p>
      <Link to="/" className="text-primary hover:underline mt-4 inline-block">
        Back to Home
      </Link>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
