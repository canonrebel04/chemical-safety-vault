import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button } from './components/ui/button';
import { ShieldAlert } from 'lucide-react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import SDS from './pages/SDS';
import Spills from './pages/Spills';
import Deadlines from './pages/Deadlines';
import Audits from './pages/Audits';

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
      <Link to="/dashboard">
        <Button size="lg" className="text-lg px-8 py-6">
          Launch App
        </Button>
      </Link>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/sds" element={<SDS />} />
          <Route path="/spills" element={<Spills />} />
          <Route path="/deadlines" element={<Deadlines />} />
          <Route path="/audits" element={<Audits />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
