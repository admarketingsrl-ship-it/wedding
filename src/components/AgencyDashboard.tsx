import { useState } from 'react';
import { 
  Building2, 
  Car, 
  Compass, 
  Users, 
  Plane, 
  Calendar, 
  MapPin, 
  Clock, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Luggage,
  Sparkles,
  Phone,
  Mail,
  FileSpreadsheet
} from 'lucide-react';
import heroBanner from '../assets/images/wedding_concierge_hero_1791309110090.jpg';
import hotelSuiteImg from '../assets/images/wedding_hotel_suite_1791309120679.jpg';
import boatTourImg from '../assets/images/wedding_boat_experience_1791309131765.jpg';

interface GuestRecord {
  id: string;
  name: string;
  country: string;
  flag: string;
  email: string;
  phone: string;
  hotel: string;
  roomType: string;
  transferType: string;
  flight: string;
  experiences: string[];
  diet: string;
  status: 'CONFIRMED' | 'PENDING' | 'WAITLIST';
}

const INITIAL_GUESTS: GuestRecord[] = [
  {
    id: 'g-1',
    name: 'Eleanor & Jonathan Vance',
    country: 'Stati Uniti (New York)',
    flag: '🇺🇸',
    email: 'eleanor.vance@nycapital.com',
    phone: '+1 212 555 0192',
    hotel: 'Grand Hotel Tremezzo',
    roomType: 'Prestige Vista Lago',
    transferType: 'Shuttle MXP 11:00',
    flight: 'Delta DL112 (08:45)',
    experiences: ['Sunset Riva Cruise', 'Welcome Pizza Party'],
    diet: 'Vegetariano, no crostacei',
    status: 'CONFIRMED'
  },
  {
    id: 'g-2',
    name: 'Lord Henry & Lady Charlotte Windsor',
    country: 'Regno Unito (Londra)',
    flag: '🇬🇧',
    email: 'c.windsor@kensington.co.uk',
    phone: '+44 20 7946 0912',
    hotel: 'Villa Serbelloni Palace',
    roomType: 'Classic Double Garden',
    transferType: 'NCC Privato (LIN)',
    flight: 'British Airways BA562 (12:15)',
    experiences: ['Cooking Class Tiramisù', 'Welcome Pizza Party'],
    diet: 'Senza glutine',
    status: 'CONFIRMED'
  },
  {
    id: 'g-3',
    name: 'Pierre & Camille Dubois',
    country: 'Francia (Parigi)',
    flag: '🇫🇷',
    email: 'pierre.dubois@atelier-paris.fr',
    phone: '+33 1 42 68 55 00',
    hotel: 'Grand Hotel Tremezzo',
    roomType: 'Prestige Vista Lago',
    transferType: 'Shuttle MXP 15:30',
    flight: 'Air France AF1208 (14:10)',
    experiences: ['Sunset Riva Cruise', 'Welcome Pizza Party'],
    diet: 'Nessuna restrizione',
    status: 'CONFIRMED'
  },
  {
    id: 'g-4',
    name: 'Marcus & Sophie Becker',
    country: 'Germania (Monaco)',
    flag: '🇩🇪',
    email: 'm.becker@munich-tech.de',
    phone: '+49 89 2018 3321',
    hotel: 'Grand Hotel Tremezzo',
    roomType: 'Deluxe Suite Terrazza',
    transferType: 'Auto Privata (Arrivo da Zurigo)',
    flight: 'In auto',
    experiences: ['Welcome Pizza Party', 'Pasta Masterclass'],
    diet: 'No frutta a guscio',
    status: 'CONFIRMED'
  },
  {
    id: 'g-5',
    name: 'Lucas & Mia Miller',
    country: 'Australia (Sydney)',
    flag: '🇦🇺',
    email: 'lucas.miller@sydney-invest.com',
    phone: '+61 2 9374 4000',
    hotel: 'Villa Serbelloni Palace',
    roomType: 'In attesa di selezione',
    transferType: 'Da coordinare con volo Qantas',
    flight: 'QF1 (In transito DXB)',
    experiences: ['Welcome Pizza Party'],
    diet: 'Da confermare',
    status: 'PENDING'
  }
];

export default function AgencyDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'hotels' | 'transfers' | 'experiences' | 'guests'>('overview');
  const [guestFilter, setGuestFilter] = useState('');
  const [selectedNationality, setSelectedNationality] = useState('ALL');
  const [guests, setGuests] = useState<GuestRecord[]>(INITIAL_GUESTS);

  const filteredGuests = guests.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(guestFilter.toLowerCase()) ||
                          g.email.toLowerCase().includes(guestFilter.toLowerCase()) ||
                          g.hotel.toLowerCase().includes(guestFilter.toLowerCase());
    const matchesCountry = selectedNationality === 'ALL' || g.country.includes(selectedNationality);
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="space-y-6">
      {/* Banner Matrimonio in Corso */}
      <div className="relative rounded-xl overflow-hidden border border-neutral-200 shadow-sm bg-neutral-900 text-white">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src={heroBanner} 
            alt="Villa Balbianello Lago di Como" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 md:p-8 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
            <span>Matrimonio Attivo</span>
            <span aria-hidden="true">·</span>
            <span>Codice Invito: EMMA-ALEX-2026</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-serif-luxury font-bold text-white tracking-tight">
            Emma Watson & Alexander Sterling
          </h1>
          <p className="text-neutral-300 text-sm mt-2 flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              Villa Balbianello & Tremezzina, Lago di Como
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              18 - 22 Giugno 2026
            </span>
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
            <div>
              <div className="text-xs text-neutral-400">Ospiti Esteri</div>
              <div className="text-2xl font-serif-luxury font-bold text-white tabular-nums">124</div>
              <div className="text-[11px] text-emerald-400">92% RSVP Confermati</div>
            </div>

            <div>
              <div className="text-xs text-neutral-400">Camere Bloccate</div>
              <div className="text-2xl font-serif-luxury font-bold text-white tabular-nums">49 / 75</div>
              <div className="text-[11px] text-amber-400">26 residue libere</div>
            </div>

            <div>
              <div className="text-xs text-neutral-400">Navette & NCC</div>
              <div className="text-2xl font-serif-luxury font-bold text-white tabular-nums">82 pax</div>
              <div className="text-[11px] text-neutral-300">MXP, LIN & BGY</div>
            </div>

            <div>
              <div className="text-xs text-neutral-400">Sunset Cruise Riva</div>
              <div className="text-2xl font-serif-luxury font-bold text-white tabular-nums">18 / 24</div>
              <div className="text-[11px] text-emerald-400">6 posti liberi</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigazione Moduli Dashboard Agenzia */}
      <div className="flex items-center gap-1 border-b border-neutral-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-colors shrink-0 ${
            activeTab === 'overview'
              ? 'bg-neutral-900 text-white'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Panoramica Logistica</span>
        </button>

        <button
          onClick={() => setActiveTab('hotels')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-colors shrink-0 ${
            activeTab === 'hotels'
              ? 'bg-neutral-900 text-white'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Blocchi Hotel (2)</span>
        </button>

        <button
          onClick={() => setActiveTab('transfers')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-colors shrink-0 ${
            activeTab === 'transfers'
              ? 'bg-neutral-900 text-white'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Transfer & Voli (3)</span>
        </button>

        <button
          onClick={() => setActiveTab('experiences')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-colors shrink-0 ${
            activeTab === 'experiences'
              ? 'bg-neutral-900 text-white'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Esperienze & Party (3)</span>
        </button>

        <button
          onClick={() => setActiveTab('guests')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-colors shrink-0 ${
            activeTab === 'guests'
              ? 'bg-neutral-900 text-white'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Anagrafica Ospiti ({filteredGuests.length})</span>
        </button>
      </div>

      {/* SEZIONE 1: PANORAMICA LOGISTICA */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Hotel */}
          <div className="border border-neutral-200 rounded-lg p-5 bg-white shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Alloggi Convenzionati</span>
                <Building2 className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="text-lg font-serif-luxury font-bold text-neutral-900 mt-2">
                Room Blocks & Scadenze
              </h3>
              <p className="text-xs text-neutral-600 mt-1">
                Tariffe negoziate con gli hotel partner. Monitoraggio scadenze contrattuali (15 Aprile 2026).
              </p>

              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-medium text-neutral-800 mb-1">
                    <span>Grand Hotel Tremezzo (5★)</span>
                    <span className="tabular-nums font-mono text-neutral-600">23 / 35 cam.</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-600 h-2 rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-neutral-800 mb-1">
                    <span>Villa Serbelloni Palace (5★)</span>
                    <span className="tabular-nums font-mono text-neutral-600">26 / 40 cam.</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-600 h-2 rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('hotels')}
              className="mt-6 text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1"
            >
              <span>Vedi dettagli e tipologie camere</span>
              <span>→</span>
            </button>
          </div>

          {/* Card Trasferimenti */}
          <div className="border border-neutral-200 rounded-lg p-5 bg-white shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Logistica Arrivi</span>
                <Plane className="w-4 h-4 text-sky-600" />
              </div>
              <h3 className="text-lg font-serif-luxury font-bold text-neutral-900 mt-2">
                Monitoraggio Voli & Driver
              </h3>
              <p className="text-xs text-neutral-600 mt-1">
                Assegnazione autisti e navette di gruppo per i voli intercontinentali in arrivo a Milano.
              </p>

              <div className="mt-4 space-y-2 text-xs">
                <div className="p-2.5 rounded bg-neutral-50 border border-neutral-100 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-neutral-900">Shuttle MXP #1 (11:00)</div>
                    <div className="text-neutral-500 text-[11px]">Voli DL112, AA198, BA560</div>
                  </div>
                  <span className="font-mono tabular-nums text-emerald-700 font-medium">14/16 pax</span>
                </div>

                <div className="p-2.5 rounded bg-neutral-50 border border-neutral-100 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-neutral-900">NCC Privati Confermati</div>
                    <div className="text-neutral-500 text-[11px]">Mercedes Classe V dedicate</div>
                  </div>
                  <span className="font-mono tabular-nums text-neutral-700 font-medium">12 corse</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('transfers')}
              className="mt-6 text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1"
            >
              <span>Gestisci manifest passeggeri</span>
              <span>→</span>
            </button>
          </div>

          {/* Card Esperienze */}
          <div className="border border-neutral-200 rounded-lg p-5 bg-white shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Itinerario Esperienze</span>
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="text-lg font-serif-luxury font-bold text-neutral-900 mt-2">
                Attività Pre & Post Nozze
              </h3>
              <p className="text-xs text-neutral-600 mt-1">
                Esperienze curate per intrattenere gli ospiti stranieri durante il loro soggiorno sul lago.
              </p>

              <div className="mt-4 space-y-2 text-xs">
                <div className="p-2.5 rounded bg-neutral-50 border border-neutral-100 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-neutral-900">Sunset Cruise su Motoscafi Riva</div>
                    <div className="text-neutral-500 text-[11px]">19 Giugno · ore 18:00</div>
                  </div>
                  <span className="font-mono tabular-nums text-purple-700 font-medium">18/24</span>
                </div>

                <div className="p-2.5 rounded bg-neutral-50 border border-neutral-100 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-neutral-900">Welcome Pizza & Wine Party</div>
                    <div className="text-neutral-500 text-[11px]">19 Giugno · ore 20:30</div>
                  </div>
                  <span className="font-mono tabular-nums text-emerald-700 font-medium">112/120</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('experiences')}
              className="mt-6 text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1"
            >
              <span>Vedi catalogo e posti rimasti</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* SEZIONE 2: DETTAGLIO HOTEL CONVENZIONATI */}
      {activeTab === 'hotels' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hotel 1 */}
            <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white shadow-xs">
              <div className="h-48 relative overflow-hidden bg-neutral-100">
                <img 
                  src={hotelSuiteImg} 
                  alt="Grand Hotel Tremezzo Suite" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded font-medium">
                  5 Stelle Lusso · Partner Ufficiale
                </div>
                <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs px-2.5 py-1 rounded font-bold font-mono">
                  Tariffa Accordo: €490/notte
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-serif-luxury font-bold text-neutral-900">
                  Grand Hotel Tremezzo
                </h3>
                <p className="text-xs text-neutral-500 mt-1 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Via Regina 8, Tremezzina · 8 min water taxi da Villa Balbianello</span>
                </p>

                <div className="mt-4 pt-4 border-t border-neutral-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-600">Codice Gruppo:</span>
                    <span className="font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">EMMA-ALEX-VIP</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-600">Data Limite Blocco:</span>
                    <span className="text-neutral-900 font-medium">15 Aprile 2026 (tra 9 giorni)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-600">Camere Bloccate vs Prenotate:</span>
                    <span className="font-mono font-bold text-amber-700 tabular-nums">23 prenotate su 35 (12 residue)</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs text-neutral-500">Referente Hotel: concierge@grandhoteltremezzo.com</span>
                  <button className="text-xs font-semibold px-3 py-1.5 bg-neutral-900 text-white rounded hover:bg-neutral-800 transition-colors">
                    Report Camere
                  </button>
                </div>
              </div>
            </div>

            {/* Hotel 2 */}
            <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white shadow-xs">
              <div className="h-48 relative overflow-hidden bg-neutral-100">
                <img 
                  src={heroBanner} 
                  alt="Villa Serbelloni Palace Bellagio" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded font-medium">
                  5 Stelle Storico · Bellagio
                </div>
                <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs px-2.5 py-1 rounded font-bold font-mono">
                  Tariffa Accordo: €320/notte
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-serif-luxury font-bold text-neutral-900">
                  Grand Hotel Villa Serbelloni
                </h3>
                <p className="text-xs text-neutral-500 mt-1 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Via Roma 1, Bellagio · Navetta battello dedicata per la villa</span>
                </p>

                <div className="mt-4 pt-4 border-t border-neutral-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-600">Codice Gruppo:</span>
                    <span className="font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">WEDDING-COMO26</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-600">Data Limite Blocco:</span>
                    <span className="text-neutral-900 font-medium">30 Aprile 2026</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-600">Camere Bloccate vs Prenotate:</span>
                    <span className="font-mono font-bold text-amber-700 tabular-nums">26 prenotate su 40 (14 residue)</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs text-neutral-500">Referente Hotel: events@villaserbelloni.com</span>
                  <button className="text-xs font-semibold px-3 py-1.5 bg-neutral-900 text-white rounded hover:bg-neutral-800 transition-colors">
                    Report Camere
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEZIONE 3: TRASFERIMENTI & MANIFEST VOLI */}
      {activeTab === 'transfers' && (
        <div className="border border-neutral-200 rounded-lg bg-white p-6 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-serif-luxury font-bold text-neutral-900">
                Piano Logistico Trasferimenti Aeroportuali
              </h3>
              <p className="text-xs text-neutral-600 mt-1">
                Accoglienza con cartello personalizzato all'uscita dogana Milano Malpensa (MXP) e Milano Linate (LIN).
              </p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors self-start md:self-auto">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Esporta Manifest Autisti (PDF/Excel)</span>
            </button>
          </div>

          <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-lg overflow-hidden">
            {/* Navetta 1 */}
            <div className="p-4 bg-neutral-50/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">Navetta di Gruppo #1</span>
                  <span className="text-xs text-neutral-500 font-mono">18 Giugno 2026 · Partenza ore 11:00</span>
                </div>
                <div className="text-sm font-semibold text-neutral-900">
                  Milano Malpensa Terminal 1 → Hotel Tremezzo & Bellagio
                </div>
                <div className="text-xs text-neutral-600">
                  Mezzo: Mercedes Sprinter VIP 16 posti · Autista: Marco L. (+39 347 1122334)
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-bold font-mono text-neutral-900 tabular-nums">14 / 16 Posti</div>
                <div className="text-[11px] text-emerald-600 font-medium">Voli: DL112, BA560, AA198</div>
              </div>
            </div>

            {/* Navetta 2 */}
            <div className="p-4 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">Navetta di Gruppo #2</span>
                  <span className="text-xs text-neutral-500 font-mono">18 Giugno 2026 · Partenza ore 15:30</span>
                </div>
                <div className="text-sm font-semibold text-neutral-900">
                  Milano Malpensa Terminal 1 → Hotel Tremezzo & Bellagio
                </div>
                <div className="text-xs text-neutral-600">
                  Mezzo: Mercedes Sprinter VIP 16 posti · Autista: Andrea R. (+39 339 9988776)
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-bold font-mono text-neutral-900 tabular-nums">11 / 16 Posti</div>
                <div className="text-[11px] text-emerald-600 font-medium">Voli: AF1208, LH254</div>
              </div>
            </div>

            {/* Navetta Cerimonia Ufficiale */}
            <div className="p-4 bg-neutral-50/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">Navetta Cerimonia (Sposi)</span>
                  <span className="text-xs text-neutral-500 font-mono">20 Giugno 2026 · Orari: 15:15 (Andata) - 01:30 (Ritorno)</span>
                </div>
                <div className="text-sm font-semibold text-neutral-900">
                  Lobby Hotel → Pontile Villa Balbianello (Water Taxi + Bus)
                </div>
                <div className="text-xs text-neutral-600">
                  Servizio continuo dedicato a tutti gli invitati offerto da Emma & Alexander
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-bold font-mono text-emerald-700">Incluso per 124 pax</div>
                <div className="text-[11px] text-neutral-500">Coordinatore sul posto presente</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEZIONE 4: ESPERIENZE & ATTIVITÀ TURISTICHE */}
      {activeTab === 'experiences' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white shadow-xs flex flex-col">
            <div className="h-44 relative">
              <img 
                src={boatTourImg} 
                alt="Sunset Riva Cruise" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2.5 right-2.5 bg-neutral-900/80 text-white text-xs font-mono px-2 py-0.5 rounded">
                €110 / persona
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[11px] text-purple-700 font-semibold uppercase tracking-wider">Tour Esclusivo</div>
                <h4 className="text-base font-serif-luxury font-bold text-neutral-900 mt-1">
                  Sunset Cruise su Motoscafo Riva & Prosecco
                </h4>
                <p className="text-xs text-neutral-600 mt-2">
                  19 Giugno 2026 · 18:00 - 20:30. Giro del centro lago con sosta fotografica a Villa del Balbianello e calice di Champagne.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-neutral-500">Partecipanti:</span>
                <span className="font-mono font-bold text-purple-800">18 / 24 iscritti</span>
              </div>
            </div>
          </div>

          <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white shadow-xs flex flex-col">
            <div className="h-44 relative">
              <img 
                src={heroBanner} 
                alt="Welcome Pizza Party" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-xs font-semibold px-2 py-0.5 rounded">
                Offerto dagli Sposi
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[11px] text-emerald-700 font-semibold uppercase tracking-wider">Cena di Benvenuto</div>
                <h4 className="text-base font-serif-luxury font-bold text-neutral-900 mt-1">
                  Welcome Dinner & Pizza Party all'Aperto
                </h4>
                <p className="text-xs text-neutral-600 mt-2">
                  19 Giugno 2026 · 20:30. Terrazza panoramica di Bellagio con forni a legna per pizza napoletana e musica acustica.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-neutral-500">Conferme:</span>
                <span className="font-mono font-bold text-emerald-800">112 / 120 invitati</span>
              </div>
            </div>
          </div>

          <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white shadow-xs flex flex-col">
            <div className="h-44 relative">
              <img 
                src={hotelSuiteImg} 
                alt="Cooking Class" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2.5 right-2.5 bg-neutral-900/80 text-white text-xs font-mono px-2 py-0.5 rounded">
                €85 / persona
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[11px] text-amber-700 font-semibold uppercase tracking-wider">Masterclass Gastronomica</div>
                <h4 className="text-base font-serif-luxury font-bold text-neutral-900 mt-1">
                  Pasta Fresca & Tiramisù in Dimora Storica
                </h4>
                <p className="text-xs text-neutral-600 mt-2">
                  21 Giugno 2026 · 11:00 - 14:00. Lezione con chef locale per imparare la vera pasta italiana con pranzo sulla terrazza.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-neutral-500">Partecipanti:</span>
                <span className="font-mono font-bold text-amber-800">12 / 16 iscritti</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEZIONE 5: ANAGRAFICA OSPITI ESTERI */}
      {activeTab === 'guests' && (
        <div className="border border-neutral-200 rounded-lg bg-white shadow-xs overflow-hidden">
          {/* Barra Ricerca e Filtro Nazionalità */}
          <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cerca per nome, email o hotel..."
                value={guestFilter}
                onChange={(e) => setGuestFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs text-neutral-500">Nazionalità:</span>
              <select
                value={selectedNationality}
                onChange={(e) => setSelectedNationality(e.target.value)}
                className="text-xs bg-white border border-neutral-300 rounded-md px-2.5 py-1.5 focus:outline-hidden"
              >
                <option value="ALL">Tutte ({guests.length})</option>
                <option value="Stati Uniti">Stati Uniti 🇺🇸</option>
                <option value="Regno Unito">Regno Unito 🇬🇧</option>
                <option value="Francia">Francia 🇫🇷</option>
                <option value="Germania">Germania 🇩🇪</option>
                <option value="Australia">Australia 🇦🇺</option>
              </select>
            </div>
          </div>

          {/* Tabella Ospiti */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-100 text-neutral-600 font-semibold border-b border-neutral-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Ospite & Nazionalità</th>
                  <th className="py-3 px-4">Hotel Prenotato</th>
                  <th className="py-3 px-4">Transfer & Volo</th>
                  <th className="py-3 px-4">Esperienze</th>
                  <th className="py-3 px-4">Esigenze Dietetiche</th>
                  <th className="py-3 px-4 text-right">Stato RSVP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredGuests.map((g) => (
                  <tr key={g.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                        <span>{g.flag}</span>
                        <span>{g.name}</span>
                      </div>
                      <div className="text-[11px] text-neutral-500">{g.email} · {g.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-neutral-900">{g.hotel}</div>
                      <div className="text-[11px] text-neutral-500">{g.roomType}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-neutral-900">{g.transferType}</div>
                      <div className="text-[11px] text-neutral-500 font-mono">{g.flight}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-neutral-800">{g.experiences.join(', ')}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-neutral-600 italic">{g.diet}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {g.status === 'CONFIRMED' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confermato</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>In Sospeso</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
