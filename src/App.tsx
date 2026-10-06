import { useState } from 'react';
import { 
  Building2, 
  Layers, 
  Terminal, 
  Compass, 
  Sparkles, 
  Code2, 
  FileCode, 
  Copy, 
  Check, 
  Download,
  ExternalLink,
  Users,
  Lock,
  Globe,
  LogOut,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';
import HomeLogin from './components/HomeLogin';
import AdminPanel from './components/AdminPanel';
import GuestPortal from './components/GuestPortal';
import AgencyDashboard from './components/AgencyDashboard';
import ProjectExplorer from './components/ProjectExplorer';
import ApiPlayground from './components/ApiPlayground';
import { INITIAL_WEDDINGS, WeddingData } from './data/weddingStore';
import { DIRECTORY_TREE, PROJECT_FILES } from './data/projectData';

export default function App() {
  const [weddings, setWeddings] = useState<WeddingData[]>(INITIAL_WEDDINGS);

  // Stato Autenticazione Utente
  const [authRole, setAuthRole] = useState<'guest' | 'admin' | null>(null);
  const [currentGuest, setCurrentGuest] = useState<{
    name: string;
    email: string;
    weddingCode: string;
    provider: 'google' | 'apple' | 'email';
  } | null>(null);

  // Vista Attiva
  const [currentView, setCurrentView] = useState<'home' | 'guest' | 'admin' | 'dashboard' | 'architecture' | 'api'>('home');
  const [copiedServerJs, setCopiedServerJs] = useState(false);

  // Gestione Login Ospite
  const handleGuestLogin = (guestInfo: { name: string; email: string; weddingCode: string; provider: 'google' | 'apple' | 'email' }) => {
    setAuthRole('guest');
    setCurrentGuest(guestInfo);
    setCurrentView('guest');
  };

  // Gestione Login Amministratore Agenzia
  const handleAdminLogin = () => {
    setAuthRole('admin');
    setCurrentGuest(null);
    setCurrentView('admin');
  };

  // Logout
  const handleLogout = () => {
    setAuthRole(null);
    setCurrentGuest(null);
    setCurrentView('home');
  };

  // Preview ospite dal pannello admin
  const handlePreviewAsGuest = (code: string) => {
    setAuthRole('guest');
    setCurrentGuest({
      name: 'Eleanor Vance (Anteprima Staff)',
      email: 'staff@weddingconcierge.it',
      weddingCode: code,
      provider: 'google'
    });
    setCurrentView('guest');
  };

  // Matrimonio attivo per la vista ospite
  const activeGuestWedding = weddings.find(
    w => w.weddingCode.toUpperCase() === (currentGuest?.weddingCode.toUpperCase() || 'EMMA-ALEX-2026')
  ) || weddings[0];

  const handleCopyServerJs = () => {
    const serverJsFile = PROJECT_FILES.find(f => f.id === 'server-js');
    if (serverJsFile) {
      navigator.clipboard.writeText(serverJsFile.content);
      setCopiedServerJs(true);
      setTimeout(() => setCopiedServerJs(false), 2000);
    }
  };

  const handleDownloadAll = () => {
    const fullProjectText = `=== PROGETTO WEDDING GUEST CONCIERGE (EXPRESS + PRISMA) ===\n\n` +
      `STRUTTURA CARTELLE:\n${DIRECTORY_TREE}\n\n` +
      PROJECT_FILES.map(f => `\n=========================================\nFILE: ${f.path}\nDESCRIZIONE: ${f.description}\n=========================================\n${f.content}\n`).join('\n');

    const blob = new Blob([fullProjectText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wedding-guest-concierge-backend-project.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-neutral-100/70 text-neutral-900 flex flex-col selection:bg-neutral-900 selection:text-white">
      {/* 
        ======================================================================
        TOP BAR CONTRACT (Strict 3-Zone Architecture)
        Zone 1: Wordmark brand element
        Zone 2: Clean text navigation links
        Zone 3: User authentication status & quick action
        ======================================================================
      */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentView('home')}
              className="text-left group flex items-center gap-2"
            >
              <span className="text-xl font-serif-luxury font-bold tracking-tight text-neutral-900 group-hover:text-amber-800 transition-colors">
                Riviera Wedding Concierge
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-600">
            <button
              onClick={() => setCurrentView('home')}
              className={`transition-colors py-1 ${
                currentView === 'home'
                  ? 'text-neutral-900 font-bold border-b-2 border-neutral-900'
                  : 'hover:text-neutral-900'
              }`}
            >
              Home & Login
            </button>

            {/* Link Ospite (Attivo se loggato come ospite) */}
            {authRole === 'guest' && (
              <button
                onClick={() => setCurrentView('guest')}
                className={`transition-colors py-1 ${
                  currentView === 'guest'
                    ? 'text-neutral-900 font-bold border-b-2 border-neutral-900'
                    : 'hover:text-neutral-900'
                }`}
              >
                Mio Matrimonio ({currentGuest?.weddingCode})
              </button>
            )}

            {/* Link Amministrazione (Attivo se loggato come admin) */}
            {authRole === 'admin' && (
              <>
                <button
                  onClick={() => setCurrentView('admin')}
                  className={`transition-colors py-1 ${
                    currentView === 'admin'
                      ? 'text-neutral-900 font-bold border-b-2 border-neutral-900'
                      : 'hover:text-neutral-900'
                  }`}
                >
                  Pannello Agenzia & Inviti
                </button>

                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`transition-colors py-1 ${
                    currentView === 'dashboard'
                      ? 'text-neutral-900 font-bold border-b-2 border-neutral-900'
                      : 'hover:text-neutral-900'
                  }`}
                >
                  Monitoraggio Camere & Voli
                </button>
              </>
            )}

            <button
              onClick={() => setCurrentView('architecture')}
              className={`transition-colors py-1 ${
                currentView === 'architecture'
                  ? 'text-neutral-900 font-bold border-b-2 border-neutral-900'
                  : 'hover:text-neutral-900'
              }`}
            >
              Architettura Express & Prisma
            </button>

            <button
              onClick={() => setCurrentView('api')}
              className={`transition-colors py-1 ${
                currentView === 'api'
                  ? 'text-neutral-900 font-bold border-b-2 border-neutral-900'
                  : 'hover:text-neutral-900'
              }`}
            >
              Test API REST
            </button>
          </nav>

          {/* Zone 3: Authentication Badges & Actions */}
          <div className="flex items-center gap-2">
            {authRole === 'guest' && currentGuest ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-neutral-800 bg-neutral-100 rounded-md">
                  <Globe className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="truncate max-w-[120px]">{currentGuest.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
                >
                  Esci
                </button>
              </div>
            ) : authRole === 'admin' ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-rose-800 bg-rose-50 rounded-md border border-rose-200">
                  <Lock className="w-3.5 h-3.5 text-rose-600" />
                  <span>Admin Agenzia</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
                >
                  Esci
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentView('home')}
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors"
              >
                Accedi
              </button>
            )}

            <button
              onClick={handleDownloadAll}
              className="hidden lg:flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Esporta Zip</span>
            </button>
          </div>
        </div>

        {/* Mobile Submenu Bar */}
        <div className="md:hidden flex items-center justify-around border-t border-neutral-100 bg-white px-2 py-2 text-[11px] font-medium text-neutral-600 overflow-x-auto">
          <button
            onClick={() => setCurrentView('home')}
            className={`px-2 py-1 rounded whitespace-nowrap ${currentView === 'home' ? 'bg-neutral-900 text-white font-bold' : ''}`}
          >
            Home / Login
          </button>

          {authRole === 'guest' && (
            <button
              onClick={() => setCurrentView('guest')}
              className={`px-2 py-1 rounded whitespace-nowrap ${currentView === 'guest' ? 'bg-neutral-900 text-white font-bold' : ''}`}
            >
              Mio Matrimonio
            </button>
          )}

          {authRole === 'admin' && (
            <button
              onClick={() => setCurrentView('admin')}
              className={`px-2 py-1 rounded whitespace-nowrap ${currentView === 'admin' ? 'bg-neutral-900 text-white font-bold' : ''}`}
            >
              Pannello Agenzia
            </button>
          )}

          <button
            onClick={() => setCurrentView('architecture')}
            className={`px-2 py-1 rounded whitespace-nowrap ${currentView === 'architecture' ? 'bg-neutral-900 text-white font-bold' : ''}`}
          >
            Architettura File
          </button>

          <button
            onClick={() => setCurrentView('api')}
            className={`px-2 py-1 rounded whitespace-nowrap ${currentView === 'api' ? 'bg-neutral-900 text-white font-bold' : ''}`}
          >
            Test API
          </button>
        </div>
      </header>

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && (
          <HomeLogin 
            weddings={weddings} 
            onGuestLogin={handleGuestLogin} 
            onAdminLogin={handleAdminLogin} 
          />
        )}

        {currentView === 'guest' && (
          <GuestPortal 
            weddingData={activeGuestWedding} 
            guestInfo={currentGuest || {
              name: 'Eleanor Vance',
              email: 'eleanor.vance@example.com',
              weddingCode: activeGuestWedding.weddingCode,
              provider: 'google'
            }}
            onLogout={handleLogout}
          />
        )}

        {currentView === 'admin' && (
          <AdminPanel 
            weddings={weddings} 
            onUpdateWeddings={setWeddings}
            onLogout={handleLogout}
            onPreviewAsGuest={handlePreviewAsGuest}
          />
        )}

        {currentView === 'dashboard' && <AgencyDashboard />}
        {currentView === 'architecture' && <ProjectExplorer />}
        {currentView === 'api' && <ApiPlayground />}
      </main>

      {/* Footer Quiet & Editorial */}
      <footer className="border-t border-neutral-200 bg-white py-6 mt-12 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif-luxury font-bold text-neutral-800 text-sm">Riviera Wedding Concierge</span>
            <span aria-hidden="true">·</span>
            <span>Gestione Ospiti Esteri, Hotel Room Blocks & NCC</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Accesso Ospite con Google & Apple</span>
            <span aria-hidden="true">·</span>
            <span>Inviti WhatsApp Automatici</span>
            <span aria-hidden="true">·</span>
            <span>Node.js / Express / Prisma</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
