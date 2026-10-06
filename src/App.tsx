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
  Users
} from 'lucide-react';
import ProjectExplorer from './components/ProjectExplorer';
import AgencyDashboard from './components/AgencyDashboard';
import GuestPortal from './components/GuestPortal';
import ApiPlayground from './components/ApiPlayground';
import { DIRECTORY_TREE, PROJECT_FILES } from './data/projectData';

export default function App() {
  const [currentView, setCurrentView] = useState<'architecture' | 'dashboard' | 'guest' | 'api'>('architecture');
  const [copiedServerJs, setCopiedServerJs] = useState(false);

  const serverJsFile = PROJECT_FILES.find(f => f.id === 'server-js');

  const handleCopyServerJs = () => {
    if (serverJsFile) {
      navigator.clipboard.writeText(serverJsFile.content);
      setCopiedServerJs(true);
      setTimeout(() => setCopiedServerJs(false), 2200);
    }
  };

  const handleDownloadAll = () => {
    // Genera un manifest riepilogativo di tutti i file creati
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
    <div className="min-h-screen bg-neutral-100/60 text-neutral-900 flex flex-col selection:bg-neutral-900 selection:text-white">
      {/* 
        ======================================================================
        TOP BAR CONTRACT (Strict 3-Zone Architecture)
        Zone 1: Wordmark brand element
        Zone 2: Clean text navigation links with subtle hover underlines
        Zone 3: Primary action button
        ======================================================================
      */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentView('architecture')}
              className="text-left group"
            >
              <span className="text-xl font-serif-luxury font-bold tracking-tight text-neutral-900 group-hover:text-amber-800 transition-colors">
                Riviera Wedding Concierge
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-neutral-600">
            <button
              onClick={() => setCurrentView('architecture')}
              className={`transition-colors py-1 relative ${
                currentView === 'architecture'
                  ? 'text-neutral-900 font-bold border-b-2 border-neutral-900'
                  : 'hover:text-neutral-900'
              }`}
            >
              Architettura & File Node.js
            </button>

            <button
              onClick={() => setCurrentView('dashboard')}
              className={`transition-colors py-1 relative ${
                currentView === 'dashboard'
                  ? 'text-neutral-900 font-bold border-b-2 border-neutral-900'
                  : 'hover:text-neutral-900'
              }`}
            >
              Dashboard Agenzia
            </button>

            <button
              onClick={() => setCurrentView('guest')}
              className={`transition-colors py-1 relative ${
                currentView === 'guest'
                  ? 'text-neutral-900 font-bold border-b-2 border-neutral-900'
                  : 'hover:text-neutral-900'
              }`}
            >
              Portale Ospite Estero
            </button>

            <button
              onClick={() => setCurrentView('api')}
              className={`transition-colors py-1 relative ${
                currentView === 'api'
                  ? 'text-neutral-900 font-bold border-b-2 border-neutral-900'
                  : 'hover:text-neutral-900'
              }`}
            >
              Collaudo API Express
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyServerJs}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors whitespace-nowrap"
            >
              {copiedServerJs ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedServerJs ? 'server.js Copiato!' : 'Copia server.js'}</span>
            </button>

            <button
              onClick={handleDownloadAll}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors whitespace-nowrap shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Esporta Progetto</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="md:hidden flex items-center justify-around border-t border-neutral-100 bg-white px-2 py-2 text-[11px] font-medium text-neutral-600">
          <button
            onClick={() => setCurrentView('architecture')}
            className={`px-2 py-1 rounded ${currentView === 'architecture' ? 'bg-neutral-900 text-white font-bold' : ''}`}
          >
            Architettura
          </button>
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-2 py-1 rounded ${currentView === 'dashboard' ? 'bg-neutral-900 text-white font-bold' : ''}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentView('guest')}
            className={`px-2 py-1 rounded ${currentView === 'guest' ? 'bg-neutral-900 text-white font-bold' : ''}`}
          >
            Portale Ospiti
          </button>
          <button
            onClick={() => setCurrentView('api')}
            className={`px-2 py-1 rounded ${currentView === 'api' ? 'bg-neutral-900 text-white font-bold' : ''}`}
          >
            API Test
          </button>
        </div>
      </header>

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'architecture' && <ProjectExplorer />}
        {currentView === 'dashboard' && <AgencyDashboard />}
        {currentView === 'guest' && <GuestPortal />}
        {currentView === 'api' && <ApiPlayground />}
      </main>

      {/* Footer Quiet & Editorial */}
      <footer className="border-t border-neutral-200 bg-white py-6 mt-12 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif-luxury font-bold text-neutral-800 text-sm">Riviera Wedding Concierge</span>
            <span aria-hidden="true">·</span>
            <span>Node.js / Express / Prisma ORM Architecture</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Hotel Room Blocks</span>
            <span aria-hidden="true">·</span>
            <span>Airport Transfers & NCC</span>
            <span aria-hidden="true">·</span>
            <span>Curated Guest Experiences</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
