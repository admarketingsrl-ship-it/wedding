import { useState } from 'react';
import { 
  Building2, 
  Car, 
  Sparkles, 
  Check, 
  Calendar, 
  MapPin, 
  Plane, 
  Clock, 
  ShieldCheck, 
  Download, 
  ArrowRight,
  ArrowLeft,
  Info,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';
import hotelSuiteImg from '../assets/images/wedding_hotel_suite_1791309120679.jpg';
import boatTourImg from '../assets/images/wedding_boat_experience_1791309131765.jpg';

export default function GuestPortal() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Stato Modulo Ospite
  const [selectedHotel, setSelectedHotel] = useState<'tremezzo' | 'serbelloni'>('tremezzo');
  const [selectedRoom, setSelectedRoom] = useState('Prestige Vista Lago (€490/notte)');
  const [checkIn, setCheckIn] = useState('2026-06-18');
  const [checkOut, setCheckOut] = useState('2026-06-22');
  const [specialRequests, setSpecialRequests] = useState('Camera ai piani alti con vista aperta, se possibile.');

  const [transferOption, setTransferOption] = useState<'shuttle' | 'ncc' | 'none'>('shuttle');
  const [flightNumber, setFlightNumber] = useState('Delta Air Lines DL112');
  const [flightArrivalDate, setFlightArrivalDate] = useState('2026-06-18 08:45');
  const [luggageCount, setLuggageCount] = useState(3);

  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([
    'exp-boat-sunset',
    'exp-welcome-pizza'
  ]);

  const toggleExperience = (id: string) => {
    if (selectedExperiences.includes(id)) {
      setSelectedExperiences(selectedExperiences.filter(item => item !== id));
    } else {
      setSelectedExperiences([...selectedExperiences, id]);
    }
  };

  const handleComplete = () => {
    setIsSubmitted(true);
    setCurrentStep(4);
  };

  return (
    <div className="space-y-6">
      {/* Intestazione Ospite Estero */}
      <div className="border border-neutral-200 rounded-lg p-6 bg-white shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider">
              <span>Portale Ospite Internazionale</span>
              <span aria-hidden="true">·</span>
              <span>English / Italiano</span>
            </div>
            <h2 className="text-2xl font-serif-luxury font-bold text-neutral-900 mt-1">
              Benvenuti Eleanor & Jonathan Vance
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              Siete invitati al matrimonio di <strong className="text-neutral-900">Emma Watson & Alexander Sterling</strong> a Villa Balbianello, Lago di Como.
            </p>
          </div>

          <div className="px-3.5 py-2 bg-amber-50 rounded-lg border border-amber-200/60 text-xs text-amber-900 shrink-0">
            <span className="font-semibold">Concierge Dedicato H24:</span>
            <div className="text-[11px] text-amber-800 mt-0.5">concierge@rivieraweddings.com · +39 031 998877</div>
          </div>
        </div>

        {/* Stepper Wizard Indicator */}
        <div className="grid grid-cols-4 gap-2 mt-6 pt-6 border-t border-neutral-100 text-xs">
          <button
            onClick={() => setCurrentStep(1)}
            className={`p-2.5 rounded-md text-left transition-colors flex items-center gap-2 ${
              currentStep === 1
                ? 'bg-neutral-900 text-white'
                : currentStep > 1
                ? 'bg-neutral-100 text-neutral-800'
                : 'text-neutral-400 bg-neutral-50'
            }`}
          >
            <span className="w-5 h-5 rounded-full border flex items-center justify-center font-bold text-[10px]">
              {currentStep > 1 ? '✓' : '1'}
            </span>
            <span className="font-medium truncate hidden sm:inline">1. Hotel & Camera</span>
          </button>

          <button
            onClick={() => setCurrentStep(2)}
            className={`p-2.5 rounded-md text-left transition-colors flex items-center gap-2 ${
              currentStep === 2
                ? 'bg-neutral-900 text-white'
                : currentStep > 2
                ? 'bg-neutral-100 text-neutral-800'
                : 'text-neutral-400 bg-neutral-50'
            }`}
          >
            <span className="w-5 h-5 rounded-full border flex items-center justify-center font-bold text-[10px]">
              {currentStep > 2 ? '✓' : '2'}
            </span>
            <span className="font-medium truncate hidden sm:inline">2. Transfer Aeroporto</span>
          </button>

          <button
            onClick={() => setCurrentStep(3)}
            className={`p-2.5 rounded-md text-left transition-colors flex items-center gap-2 ${
              currentStep === 3
                ? 'bg-neutral-900 text-white'
                : currentStep > 3
                ? 'bg-neutral-100 text-neutral-800'
                : 'text-neutral-400 bg-neutral-50'
            }`}
          >
            <span className="w-5 h-5 rounded-full border flex items-center justify-center font-bold text-[10px]">
              {currentStep > 3 ? '✓' : '3'}
            </span>
            <span className="font-medium truncate hidden sm:inline">3. Esperienze Sul Lago</span>
          </button>

          <button
            onClick={() => setCurrentStep(4)}
            className={`p-2.5 rounded-md text-left transition-colors flex items-center gap-2 ${
              currentStep === 4
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-400 bg-neutral-50'
            }`}
          >
            <span className="w-5 h-5 rounded-full border flex items-center justify-center font-bold text-[10px]">
              {isSubmitted ? '✓' : '4'}
            </span>
            <span className="font-medium truncate hidden sm:inline">4. Riepilogo & Voucher</span>
          </button>
        </div>
      </div>

      {/* STEP 1: SCELTA HOTEL & ALLOGGIO */}
      {currentStep === 1 && (
        <div className="border border-neutral-200 rounded-lg p-6 bg-white shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-serif-luxury font-bold text-neutral-900">
              Seleziona la Sistemazione Convenzionata
            </h3>
            <p className="text-xs text-neutral-600 mt-1">
              Emma & Alexander hanno concordato un blocco camere a tariffa riservata e un servizio di navetta dedicato da questi due hotel fino a Villa Balbianello.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Grand Hotel Tremezzo */}
            <div 
              onClick={() => setSelectedHotel('tremezzo')}
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                selectedHotel === 'tremezzo' 
                  ? 'border-neutral-900 bg-neutral-50/50 shadow-xs' 
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">Consigliato dalla Coppia</span>
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedHotel === 'tremezzo' ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300'}`}>
                  {selectedHotel === 'tremezzo' && <Check className="w-2.5 h-2.5" />}
                </span>
              </div>
              <h4 className="text-base font-serif-luxury font-bold text-neutral-900 mt-2">
                Grand Hotel Tremezzo (5 Stelle Lusso)
              </h4>
              <p className="text-xs text-neutral-600 mt-1">
                Tremezzina · Navetta via lago e via terra inclusa per il giorno delle nozze.
              </p>

              <div className="mt-4 space-y-2 text-xs">
                <label className="flex items-center gap-2 p-2 bg-white rounded border border-neutral-200">
                  <input 
                    type="radio" 
                    name="room" 
                    checked={selectedRoom.includes('Prestige')} 
                    onChange={() => setSelectedRoom('Prestige Vista Lago (€490/notte)')} 
                  />
                  <div className="flex-1 flex justify-between">
                    <span>Prestige Vista Lago</span>
                    <span className="font-mono font-bold text-neutral-900">€490 / notte</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 bg-white rounded border border-neutral-200">
                  <input 
                    type="radio" 
                    name="room" 
                    checked={selectedRoom.includes('Deluxe')} 
                    onChange={() => setSelectedRoom('Deluxe Suite Terrazza (€780/notte)')} 
                  />
                  <div className="flex-1 flex justify-between">
                    <span>Deluxe Suite Terrazza</span>
                    <span className="font-mono font-bold text-neutral-900">€780 / notte</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Villa Serbelloni */}
            <div 
              onClick={() => setSelectedHotel('serbelloni')}
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                selectedHotel === 'serbelloni' 
                  ? 'border-neutral-900 bg-neutral-50/50 shadow-xs' 
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Bellagio Centro</span>
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedHotel === 'serbelloni' ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300'}`}>
                  {selectedHotel === 'serbelloni' && <Check className="w-2.5 h-2.5" />}
                </span>
              </div>
              <h4 className="text-base font-serif-luxury font-bold text-neutral-900 mt-2">
                Grand Hotel Villa Serbelloni
              </h4>
              <p className="text-xs text-neutral-600 mt-1">
                Bellagio · Servizio motoscafo privato dedicato per la cerimonia.
              </p>

              <div className="mt-4 space-y-2 text-xs">
                <label className="flex items-center gap-2 p-2 bg-white rounded border border-neutral-200">
                  <input 
                    type="radio" 
                    name="room" 
                    checked={selectedRoom.includes('Classic')} 
                    onChange={() => setSelectedRoom('Classic Double Garden View (€320/notte)')} 
                  />
                  <div className="flex-1 flex justify-between">
                    <span>Classic Double Garden</span>
                    <span className="font-mono font-bold text-neutral-900">€320 / notte</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Date & Note Speciali */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-200 text-xs">
            <div>
              <label className="block text-neutral-700 font-medium mb-1">Data Check-In</label>
              <input 
                type="date" 
                value={checkIn} 
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full p-2 border border-neutral-300 rounded focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-1">Data Check-Out</label>
              <input 
                type="date" 
                value={checkOut} 
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full p-2 border border-neutral-300 rounded focus:outline-hidden"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-neutral-700 font-medium mb-1">Richieste Particolari (Culla, mobilità, piano alto)</label>
              <input 
                type="text" 
                value={specialRequests} 
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Es. Letto matrimoniale king, vista aperta..."
                className="w-full p-2 border border-neutral-300 rounded focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-neutral-200">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors"
            >
              <span>Continua: Seleziona Transfer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SCELTA TRASFERIMENTO AEROPORTO */}
      {currentStep === 2 && (
        <div className="border border-neutral-200 rounded-lg p-6 bg-white shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-serif-luxury font-bold text-neutral-900">
              Trasferimenti Aeroportuali & Logistica Arrivo
            </h3>
            <p className="text-xs text-neutral-600 mt-1">
              Il nostro team concierge accoglie gli ospiti direttamente al gate arrivi e organizza il trasferimento con veicoli Mercedes fino all'hotel.
            </p>
          </div>

          <div className="space-y-3">
            <div 
              onClick={() => setTransferOption('shuttle')}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all flex items-start justify-between ${
                transferOption === 'shuttle' ? 'border-neutral-900 bg-neutral-50/50' : 'border-neutral-200'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">Navetta di Gruppo VIP</span>
                  <span className="text-xs font-mono font-bold text-neutral-900">€45 / passeggero</span>
                </div>
                <div className="text-sm font-semibold text-neutral-900">
                  Mercedes Sprinter Luxury da Milano Malpensa (MXP)
                </div>
                <div className="text-xs text-neutral-600">
                  Partenze coordinate con i voli: ore 11:00, 15:30 e 19:30. Conducente con cartello nominativo al Terminal 1.
                </div>
              </div>
              <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${transferOption === 'shuttle' ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300'}`}>
                {transferOption === 'shuttle' && <Check className="w-2.5 h-2.5" />}
              </span>
            </div>

            <div 
              onClick={() => setTransferOption('ncc')}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all flex items-start justify-between ${
                transferOption === 'ncc' ? 'border-neutral-900 bg-neutral-50/50' : 'border-neutral-200'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">NCC Privato Dedicato</span>
                  <span className="text-xs font-mono font-bold text-neutral-900">€220 per vettura</span>
                </div>
                <div className="text-sm font-semibold text-neutral-900">
                  Mercedes Classe E o Classe V Esclusiva (Qualsiasi Aeroporto / Qualsiasi Orario)
                </div>
                <div className="text-xs text-neutral-600">
                  Autista personale in attesa all'orario effettivo del volo. Nessuna attesa di altri passeggeri.
                </div>
              </div>
              <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${transferOption === 'ncc' ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300'}`}>
                {transferOption === 'ncc' && <Check className="w-2.5 h-2.5" />}
              </span>
            </div>
          </div>

          {/* Dettagli Volo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-200 text-xs">
            <div>
              <label className="block text-neutral-700 font-medium mb-1">Numero di Volo & Compagnia</label>
              <input 
                type="text" 
                value={flightNumber} 
                onChange={(e) => setFlightNumber(e.target.value)}
                placeholder="Es. Delta DL112 / British BA562"
                className="w-full p-2 border border-neutral-300 rounded focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-1">Data & Orario Arrivo Previsto</label>
              <input 
                type="text" 
                value={flightArrivalDate} 
                onChange={(e) => setFlightArrivalDate(e.target.value)}
                placeholder="18 Giugno 2026 - 08:45"
                className="w-full p-2 border border-neutral-300 rounded focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-medium mb-1">Numero Valigie Totali</label>
              <input 
                type="number" 
                value={luggageCount} 
                onChange={(e) => setLuggageCount(Number(e.target.value))}
                className="w-full p-2 border border-neutral-300 rounded focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-neutral-200">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Indietro</span>
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors"
            >
              <span>Continua: Seleziona Esperienze</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SELEZIONE ESPERIENZE PRE/POST MATRIMONIO */}
      {currentStep === 3 && (
        <div className="border border-neutral-200 rounded-lg p-6 bg-white shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-serif-luxury font-bold text-neutral-900">
              Esperienze sul Lago & Eventi del Matrimonio
            </h3>
            <p className="text-xs text-neutral-600 mt-1">
              Unitevi alla coppia e agli altri ospiti per scoprire la bellezza del Lago di Como.
            </p>
          </div>

          <div className="space-y-4">
            {/* Esperienza 1: Sunset Cruise */}
            <div 
              onClick={() => toggleExperience('exp-boat-sunset')}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all flex items-start gap-4 ${
                selectedExperiences.includes('exp-boat-sunset') ? 'border-neutral-900 bg-neutral-50/50' : 'border-neutral-200'
              }`}
            >
              <div className="w-20 h-20 rounded overflow-hidden shrink-0 hidden sm:block">
                <img src={boatTourImg} alt="Sunset Riva" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">19 Giugno · 18:00</span>
                  <span className="font-mono font-bold text-xs text-neutral-900">€110 / persona</span>
                </div>
                <div className="text-sm font-semibold text-neutral-900">
                  Sunset Cruise su Motoscafo Riva d'Epoca & Champagne
                </div>
                <p className="text-xs text-neutral-600">
                  Tour guidato delle ville storiche del centro lago, con sosta per ammirare il tramonto di fronte a Villa Balbianello.
                </p>
              </div>
              <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${selectedExperiences.includes('exp-boat-sunset') ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300'}`}>
                {selectedExperiences.includes('exp-boat-sunset') && <Check className="w-2.5 h-2.5" />}
              </span>
            </div>

            {/* Esperienza 2: Welcome Pizza Party */}
            <div 
              onClick={() => toggleExperience('exp-welcome-pizza')}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all flex items-start gap-4 ${
                selectedExperiences.includes('exp-welcome-pizza') ? 'border-neutral-900 bg-neutral-50/50' : 'border-neutral-200'
              }`}
            >
              <div className="w-20 h-20 rounded overflow-hidden shrink-0 hidden sm:block bg-neutral-100">
                <img src={hotelSuiteImg} alt="Pizza Party" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">19 Giugno · 20:30</span>
                  <span className="text-xs font-bold text-emerald-700">Offerto dagli Sposi (Gratuito)</span>
                </div>
                <div className="text-sm font-semibold text-neutral-900">
                  Welcome Pizza & Wine Party all'Aperto
                </div>
                <p className="text-xs text-neutral-600">
                  Cena informale con forni a legna per pizza napoletana e musica dal vivo sulla terrazza panoramica di Bellagio.
                </p>
              </div>
              <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${selectedExperiences.includes('exp-welcome-pizza') ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300'}`}>
                {selectedExperiences.includes('exp-welcome-pizza') && <Check className="w-2.5 h-2.5" />}
              </span>
            </div>

            {/* Esperienza 3: Masterclass Pasta */}
            <div 
              onClick={() => toggleExperience('exp-cooking-class')}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all flex items-start gap-4 ${
                selectedExperiences.includes('exp-cooking-class') ? 'border-neutral-900 bg-neutral-50/50' : 'border-neutral-200'
              }`}
            >
              <div className="w-20 h-20 rounded overflow-hidden shrink-0 hidden sm:block bg-neutral-100">
                <div className="w-full h-full bg-amber-100 flex items-center justify-center text-amber-800 text-xs font-bold">Pasta</div>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">21 Giugno · 11:00</span>
                  <span className="font-mono font-bold text-xs text-neutral-900">€85 / persona</span>
                </div>
                <div className="text-sm font-semibold text-neutral-900">
                  Pasta Fresca & Tiramisù Masterclass in Dimora Storica
                </div>
                <p className="text-xs text-neutral-600">
                  Lezione pratica con chef locale per imparare la pasta all'uovo tradizionale e pranzo vista lago.
                </p>
              </div>
              <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${selectedExperiences.includes('exp-cooking-class') ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300'}`}>
                {selectedExperiences.includes('exp-cooking-class') && <Check className="w-2.5 h-2.5" />}
              </span>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-neutral-200">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Indietro</span>
            </button>

            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors"
            >
              <span>Conferma & Genera Voucher</span>
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: RIEPILOGO & VOUCHER DI PRENOTAZIONE */}
      {currentStep === 4 && (
        <div className="border border-neutral-200 rounded-lg p-6 bg-white shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <ShieldCheck className="w-4 h-4" />
                <span>Prenotazione Registrata nel Database Concierge</span>
              </div>
              <h3 className="text-xl font-serif-luxury font-bold text-neutral-900 mt-1">
                Voucher di Viaggio & Itinerario Ufficiale
              </h3>
            </div>

            <div className="text-right">
              <div className="text-[11px] text-neutral-400 uppercase tracking-wider">Codice Voucher</div>
              <div className="text-sm font-mono font-bold text-neutral-900">VOUCH-EWAS-2026</div>
            </div>
          </div>

          {/* Dettagli della Prenotazione */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
              <div className="font-semibold text-neutral-500 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-neutral-600" />
                <span>Hotel Riservato</span>
              </div>
              <div className="text-sm font-bold text-neutral-900 mt-1">
                {selectedHotel === 'tremezzo' ? 'Grand Hotel Tremezzo (5★)' : 'Villa Serbelloni Palace (5★)'}
              </div>
              <div className="text-neutral-600 mt-1">{selectedRoom}</div>
              <div className="text-neutral-500 text-[11px] mt-2">
                Check-in: {checkIn} · Check-out: {checkOut}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
              <div className="font-semibold text-neutral-500 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-neutral-600" />
                <span>Trasferimento Aeroporto</span>
              </div>
              <div className="text-sm font-bold text-neutral-900 mt-1">
                {transferOption === 'shuttle' ? 'Navetta di Gruppo VIP (MXP)' : 'NCC Privato Mercedes'}
              </div>
              <div className="text-neutral-600 mt-1 font-mono">{flightNumber}</div>
              <div className="text-neutral-500 text-[11px] mt-2">
                Arrivo: {flightArrivalDate} · {luggageCount} Bagagli
              </div>
            </div>

            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
              <div className="font-semibold text-neutral-500 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-neutral-600" />
                <span>Esperienze Selezionate</span>
              </div>
              <div className="text-sm font-bold text-neutral-900 mt-1">
                {selectedExperiences.length} Attività in Programma
              </div>
              <ul className="text-neutral-600 mt-1 space-y-0.5 list-disc list-inside">
                {selectedExperiences.includes('exp-boat-sunset') && <li>Sunset Riva Boat Cruise</li>}
                {selectedExperiences.includes('exp-welcome-pizza') && <li>Welcome Pizza Party</li>}
                {selectedExperiences.includes('exp-cooking-class') && <li>Pasta Masterclass</li>}
              </ul>
            </div>
          </div>

          {/* Istruzioni Arrivo */}
          <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200/60 text-xs space-y-2">
            <div className="font-bold text-amber-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-700" />
              <span>Istruzioni per l'Accoglienza al Vostro Arrivo a Milano</span>
            </div>
            <p className="text-amber-800 leading-relaxed">
              Dopo aver ritirato i bagagli e superato i controlli doganali, troverete il nostro autista accreditato che espone un cartello con la scritta <strong className="text-amber-950">"WATSON & STERLING WEDDING - MR. VANCE"</strong>. In caso di ritardo del volo, il nostro sistema monitora automaticamente il numero <code className="font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-900">{flightNumber}</code>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-neutral-200">
            <button
              onClick={() => setCurrentStep(1)}
              className="text-xs text-neutral-600 hover:text-neutral-900 font-medium"
            >
              ← Modifica Dati o Sistemazione
            </button>

            <button
              onClick={() => alert('Voucher inviato via email a eleanor.vance@nycapital.com e notificato all\'agenzia!')}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Salva e Invia Voucher via Email</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
