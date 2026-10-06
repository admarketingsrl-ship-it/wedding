import { useState } from 'react';
import { 
  Folder, 
  FileCode, 
  Copy, 
  Check, 
  Terminal, 
  Layers, 
  Database, 
  FileText,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Download,
  ExternalLink
} from 'lucide-react';
import { PROJECT_FILES, DIRECTORY_TREE, ProjectFile } from '../data/projectData';

export default function ProjectExplorer() {
  const [selectedFileId, setSelectedFileId] = useState<string>('server-js');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedTree, setCopiedTree] = useState(false);
  const [activeTab, setActiveTab] = useState<'files' | 'tree' | 'quickstart'>('files');

  const selectedFile = PROJECT_FILES.find(f => f.id === selectedFileId) || PROJECT_FILES[0];

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const handleCopyTree = () => {
    navigator.clipboard.writeText(DIRECTORY_TREE);
    setCopiedTree(true);
    setTimeout(() => setCopiedTree(false), 2200);
  };

  const getLanguageBadge = (lang: string) => {
    switch (lang) {
      case 'javascript':
        return <span className="text-xs text-amber-400 font-mono">JavaScript (ESM)</span>;
      case 'json':
        return <span className="text-xs text-sky-400 font-mono">JSON</span>;
      case 'prisma':
        return <span className="text-xs text-emerald-400 font-mono">Prisma Schema</span>;
      case 'bash':
        return <span className="text-xs text-rose-400 font-mono">Shell / Env</span>;
      default:
        return <span className="text-xs text-neutral-400 font-mono">{lang}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Intestazione Sezione Architettura */}
      <div className="border border-neutral-200 bg-white p-6 rounded-lg shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 uppercase tracking-wider">
            <span>Architettura Node.js Express</span>
            <span aria-hidden="true">·</span>
            <span>Prisma ORM</span>
            <span aria-hidden="true">·</span>
            <span>ES Modules</span>
          </div>
          <h2 className="text-2xl font-serif-luxury font-bold text-neutral-900 mt-1">
            Struttura Modulare per Agenzia Wedding Concierge
          </h2>
          <p className="text-sm text-neutral-600 mt-1 max-w-2xl">
            Progettata appositamente per agenzie che gestiscono la logistica di matrimoni con ospiti dall'estero: blocchi camere alberghiere, navette aeroporto/NCC e catalogo esperienze.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyTree}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors"
          >
            {copiedTree ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedTree ? 'Albero Copiato!' : 'Copia Struttura Cartelle'}</span>
          </button>
        </div>
      </div>

      {/* Switcher Tab: File del Progetto / Albero Cartelle / Guida Installazione */}
      <div className="flex items-center gap-1 border-b border-neutral-200 pb-2">
        <button
          onClick={() => setActiveTab('files')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'files'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Esplora Codice File</span>
        </button>

        <button
          onClick={() => setActiveTab('tree')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'tree'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Albero Cartelle Completo</span>
        </button>

        <button
          onClick={() => setActiveTab('quickstart')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'quickstart'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Guida Avvio Rapido & Comandi</span>
        </button>
      </div>

      {/* VISTA 1: ESPLORATORE FILE CON CODE VIEWER */}
      {activeTab === 'files' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Colonna Sinistra: Elenco File per Categoria */}
          <div className="lg:col-span-4 border border-neutral-200 rounded-lg bg-white overflow-hidden shadow-xs">
            <div className="p-3.5 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                File del Progetto ({PROJECT_FILES.length})
              </span>
              <span className="text-xs text-neutral-400 font-mono">ESM / Node 18+</span>
            </div>

            <div className="divide-y divide-neutral-100 max-h-[620px] overflow-y-auto">
              {PROJECT_FILES.map((file) => {
                const isSelected = file.id === selectedFileId;
                return (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFileId(file.id)}
                    className={`w-full text-left p-3 transition-colors flex items-start gap-3 ${
                      isSelected
                        ? 'bg-amber-50/60 border-l-4 border-amber-600'
                        : 'hover:bg-neutral-50 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {file.category === 'database' ? (
                        <Database className="w-4 h-4 text-emerald-600" />
                      ) : file.category === 'core' ? (
                        <FileCode className="w-4 h-4 text-amber-600" />
                      ) : (
                        <FileText className="w-4 h-4 text-neutral-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-medium font-mono truncate ${isSelected ? 'text-neutral-900 font-bold' : 'text-neutral-800'}`}>
                          {file.name}
                        </span>
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider shrink-0">
                          {file.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                        {file.path}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colonna Destra: Code Previewer con Line Numbers e Copia */}
          <div className="lg:col-span-8 border border-neutral-800 rounded-lg bg-neutral-950 text-neutral-100 shadow-md overflow-hidden">
            {/* Header del Visualizzatore Codice */}
            <div className="p-3.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="text-xs font-mono font-medium text-neutral-300 ml-2">
                  {selectedFile.path}
                </span>
                <span className="text-neutral-600">/</span>
                {getLanguageBadge(selectedFile.language)}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyCode(selectedFile.content, selectedFile.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors"
                >
                  {copiedId === selectedFile.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copiato!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copia Codice</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Descrizione del file selezionato */}
            <div className="px-4 py-2 bg-neutral-900/60 border-b border-neutral-800/80 text-xs text-neutral-400">
              <span className="text-neutral-300 font-medium">Scopo del file: </span>
              {selectedFile.description}
            </div>

            {/* Codice con Line Numbers */}
            <div className="p-4 overflow-x-auto max-h-[540px] font-mono text-xs leading-relaxed">
              <pre className="text-neutral-200 font-code whitespace-pre">
                {selectedFile.content.split('\n').map((line, idx) => (
                  <div key={idx} className="flex hover:bg-neutral-900/50 py-0.5">
                    <span className="w-10 select-none text-neutral-600 text-right pr-4 shrink-0 font-code tabular-nums">
                      {idx + 1}
                    </span>
                    <span className="flex-1 font-code">{line}</span>
                  </div>
                ))}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 2: ALBERO DELLE CARTELLE */}
      {activeTab === 'tree' && (
        <div className="border border-neutral-200 rounded-lg bg-white p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-serif-luxury font-bold text-neutral-900">
                Mappa Architetturale Completa
              </h3>
              <p className="text-xs text-neutral-600 mt-1">
                Separazione netta delle responsabilità (Routing, Controller con logica di business, Middleware centralizzati e Schemi Prisma).
              </p>
            </div>
            <button
              onClick={handleCopyTree}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors"
            >
              {copiedTree ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTree ? 'Copiato!' : 'Copia Struttura'}</span>
            </button>
          </div>

          <div className="p-4 bg-neutral-950 text-neutral-200 rounded-lg font-mono text-xs overflow-x-auto border border-neutral-800 shadow-inner">
            <pre className="leading-relaxed text-emerald-400 font-code">{DIRECTORY_TREE}</pre>
          </div>

          {/* Dettaglio Sezioni */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-200">
            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <h4 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                <Folder className="w-4 h-4 text-amber-600" />
                <span>routes/ & controllers/</span>
              </h4>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Separazione pulita tra gli endpoint HTTP e la logica operativa:
                <br />
                • <strong className="text-neutral-800">hotels.js:</strong> Gestione blocchi camere e disponibilità.
                <br />
                • <strong className="text-neutral-800">transfers.js:</strong> Orari navette, pickup e dettagli volo.
                <br />
                • <strong className="text-neutral-800">experiences.js:</strong> Tour in barca, degustazioni vini.
              </p>
            </div>

            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <h4 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>prisma/schema.prisma</span>
              </h4>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Database relazionale ad alta integrità:
                <br />
                • Relazione 1-a-N tra Wedding e Guests.
                <br />
                • Relazione tra Hotel e RoomTypes con decremento automatico dei posti.
                <br />
                • Tracciamento di voli, allergie e richieste speciali per ciascun ospite.
              </p>
            </div>

            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <h4 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-sky-600" />
                <span>server.js & CORS</span>
              </h4>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Avvio rapido e sicuro:
                <br />
                • Configurazione CORS con credenziali per consentire chiamate sia dal portale web ospite sia dall'app mobile.
                <br />
                • Gestione globale errori con cattura dei vincoli unici Prisma.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 3: GUIDA AVVIO RAPIDO (BASH / CLI) */}
      {activeTab === 'quickstart' && (
        <div className="border border-neutral-200 rounded-lg bg-white p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-serif-luxury font-bold text-neutral-900">
              Passaggi per Avviare il Progetto in Locale
            </h3>
            <p className="text-xs text-neutral-600 mt-1">
              Segui questi passaggi nel tuo terminale per inizializzare il backend con Prisma e il database.
            </p>
          </div>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="p-4 rounded-lg border border-neutral-200 bg-neutral-50">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[11px]">1</span>
                <span>Inizializza la cartella e installa le dipendenze</span>
              </div>
              <div className="mt-2.5 p-3 bg-neutral-950 text-neutral-200 rounded font-mono text-xs flex items-center justify-between">
                <span>npm install express cors dotenv @prisma/client && npm install -D prisma nodemon</span>
                <button
                  onClick={() => handleCopyCode('npm install express cors dotenv @prisma/client && npm install -D prisma nodemon', 'cmd-1')}
                  className="text-neutral-400 hover:text-white"
                >
                  {copiedId === 'cmd-1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-lg border border-neutral-200 bg-neutral-50">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[11px]">2</span>
                <span>Genera il client Prisma ed esegui la migrazione iniziale</span>
              </div>
              <div className="mt-2.5 p-3 bg-neutral-950 text-neutral-200 rounded font-mono text-xs flex items-center justify-between">
                <span>npx prisma generate && npx prisma migrate dev --name init</span>
                <button
                  onClick={() => handleCopyCode('npx prisma generate && npx prisma migrate dev --name init', 'cmd-2')}
                  className="text-neutral-400 hover:text-white"
                >
                  {copiedId === 'cmd-2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-lg border border-neutral-200 bg-neutral-50">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[11px]">3</span>
                <span>Avvia il server in modalità watch con Nodemon</span>
              </div>
              <div className="mt-2.5 p-3 bg-neutral-950 text-neutral-200 rounded font-mono text-xs flex items-center justify-between">
                <span>npm run dev</span>
                <button
                  onClick={() => handleCopyCode('npm run dev', 'cmd-3')}
                  className="text-neutral-400 hover:text-white"
                >
                  {copiedId === 'cmd-3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-neutral-500 mt-2">
                Il server risponderà all'indirizzo <code className="text-neutral-800 font-mono">http://localhost:5000</code>.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-lg border border-neutral-200 bg-neutral-50">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[11px]">4</span>
                <span>Apri l'interfaccia visiva del database con Prisma Studio (Opzionale)</span>
              </div>
              <div className="mt-2.5 p-3 bg-neutral-950 text-neutral-200 rounded font-mono text-xs flex items-center justify-between">
                <span>npx prisma studio</span>
                <button
                  onClick={() => handleCopyCode('npx prisma studio', 'cmd-4')}
                  className="text-neutral-400 hover:text-white"
                >
                  {copiedId === 'cmd-4' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-neutral-500 mt-2">
                Prisma Studio aprirà un browser su <code className="text-neutral-800 font-mono">http://localhost:5555</code> per ispezionare visivamente gli ospiti, le prenotazioni e gli hotel.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
