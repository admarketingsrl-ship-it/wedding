import { useState, useEffect } from 'react';
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
  UserCheck,
  MessageCircle,
  LogOut
} from 'lucide-react';
import { WeddingData, HotelItem, TransferItem, ExperienceItem } from '../data/weddingStore';

interface GuestPortalProps {
  weddingData: WeddingData;
  guestInfo: {
    name: string;
    email: string;
    weddingCode: string;
    provider: 'google' | 'apple' | 'email';
  };
  onLogout: () => void;
  onBookSuccess?: (bookingDetails: any) => void;
}

export default function GuestPortal({ weddingData, guestInfo, onLogout, onBookSuccess }: GuestPortalProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Selezione Hotel
  const [selectedHotelId, setSelectedHotelId] = useState<string>(weddingData.hotels[0]?.id || '');
  const [selectedRoomTypeName, setSelectedRoomTypeName] = useState<string>(
    weddingData.hotels[0]?.roomTypes[0]?.name || 'Camera Standard'
  );
  const [checkIn, setCheckIn] = useState('2026-06-18');
  const [checkOut, setCheckOut] = useState('2026-06-22');
  const [specialRequests, setSpecialRequests] = useState('Camera vista aperta, letto matrimoniale.');

  // Selezione Transfer
  const [selectedTransferId, setSelectedTransferId] = useState<string>(weddingData.transfers[0]?.id || '');
  const [flightNumber, setFlightNumber] = useState('Delta DL112');
  const [flightArrivalDate, setFlightArrivalDate] = useState('2026-06-18 08:45');
  const [luggageCount, setLuggageCount] = useState(2);

  // Selezione Esperienze
  const [selectedExperienceIds, setSelectedExperienceIds] = useState<string[]>([
    weddingData.experiences[0]?.id || ''
  ].filter(Boolean));

  // Sincronizza selezione se cambia il weddingData
  useEffect(() => {
    if (weddingData.hotels[0]) {
      setSelectedHotelId(weddingData.hotels[0].id);
      setSelectedRoomTypeName(weddingData.hotels[0].roomTypes[0]?.name || '');
    }
    if (weddingData.transfers[0]) {
      setSelectedTransferId(weddingData.transfers[0].id);
    }
  }, [weddingData]);

  const currentHotel = weddingData.hotels.find(h => h.id === selectedHotelId) || weddingData.hotels[0];
  const currentTransfer = weddingData.transfers.find(t => t.id === selectedTransferId) || weddingData.transfers[0];

  const toggleExperience = (id: string) => {
    if (selectedExperienceIds.includes(id)) {
      setSelectedExperienceIds(selectedExperienceIds.filter(item => item !== id));
    } else {
      setSelectedExperienceIds([...selectedExperienceIds, id]);
    }
  };

  const handleComplete = () => {
    setIsSubmitted(true);
    setCurrentStep(4);
    if (onBookSuccess) {
      onBookSuccess({
        guestName: guestInfo.name,
        email: guestInfo.email,
        hotel: currentHotel?.name,
        roomType: selectedRoomTypeName,
        transfer: currentTransfer?.title,
        flight: flightNumber,
        experiences: selectedExperienceIds
      });
    }
  };

  const openConciergeWhatsApp = () => {
    const text = encodeURIComponent(
      `Ciao! Sono ${guestInfo.name}, ospite del matrimonio di ${weddingData.coupleNames} (Codice: ${weddingData.weddingCode}). Avrei bisogno di assistenza per il mio soggiorno.`
    );
    window.open(`https://wa.me/${weddingData.conciergeWhatsApp.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Intestazione Ospite Estero */}
      <div className="border border-neutral-200 rounded-2xl p-6 md:p-8 bg-white shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider">
              <span>Portale Ospite Internazionale</span>
              <span aria-hidden="true">·</span>
              <span>Autenticato con {guestInfo.provider.toUpperCase()}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-neutral-900 mt-1">
              Benvenuto, {guestInfo.name}
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              Sei invitato alle nozze di <strong className="text-neutral-900">{weddingData.coupleNames}</strong> a {weddingData.venue} ({weddingData.city}, {weddingData.country}).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={openConciergeWhatsApp}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200/80 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Concierge WhatsApp</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-100 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Esci</span>
            </button>
          </div>
        </div>

        {/* Messaggio di Benvenuto della Coppia */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Messaggio di Emma & Alexander per te:</span>
            <p className="leading-relaxed text-amber-950/90 italic">
              "{weddingData.welcomeMessage}"
            </p>
          </div>
        </div>

        {/* Stepper Wizard Indicator */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-neutral-100 text-xs">
          <button
            onClick={() => setCurrentStep(1)}
            className={`p-2.5 rounded-lg text-left transition-colors flex items-center gap-2 ${
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
            <span className="font-medium truncate hidden sm:inline">1. Alloggio Convenzionato</span>
          </button>

          <button
            onClick={() => setCurrentStep(2)}
            className={`p-2.5 rounded-lg text-left transition-colors flex items-center gap-2 ${
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
            className={`p-2.5 rounded-lg text-left transition-colors flex items-center gap-2 ${
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
            <span className="font-medium truncate hidden sm:inline">3. Esperienze & Party</span>
          </button>

          <button
            onClick={() => setCurrentStep(4)}
            className={`p-2.5 rounded-lg text-left transition-colors flex items-center gap-2 ${
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

      {/* ========================================================================= */}
      {/* STEP 1: SCELTA HOTEL                                                     */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="border border-neutral-200 rounded-2xl p-6 sm:p-8 bg-white shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-serif-luxury font-bold text-neutral-900">
              Hotel Convenzionati e Tariffe Riservate
            </h2>
            <p className="text-xs text-neutral-600 mt-1">
              Abbiamo bloccato camere con tariffe agevolate dedicate agli invitati di {weddingData.coupleNames}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weddingData.hotels.map((h) => {
              const isSelected = selectedHotelId === h.id;
              return (
                <div
                  key={h.id}
                  onClick={() => {
                    setSelectedHotelId(h.id);
                    setSelectedRoomTypeName(h.roomTypes[0]?.name || '');
                  }}
                  className={`cursor-pointer rounded-xl border-2 p-5 transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-50/60 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        {h.stars} Stelle · €{h.negotiatedRate} / notte
                      </span>
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300'}`}>
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </span>
                    </div>

                    <h3 className="text-base font-serif-luxury font-bold text-neutral-900">{h.name}</h3>
                    <p className="text-xs text-neutral-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{h.address}</span>
                    </p>
                    <p className="text-xs text-neutral-600 italic">{h.distanceToVenue}</p>
                  </div>

                  {/* Scelta Tipologia Camere */}
                  <div className="mt-4 pt-4 border-t border-neutral-200/80 space-y-2 text-xs">
                    <span className="font-semibold text-neutral-700 block text-[11px] uppercase tracking-wider">
                      Tipologie Camere nel Blocco:
                    </span>
                    {h.roomTypes.map((rt) => (
                      <label key={rt.id} className="flex items-center gap-2 p-2 bg-white rounded border border-neutral-200">
                        <input
                          type="radio"
                          name="roomType"
                          checked={selectedRoomTypeName === rt.name}
                          onChange={() => setSelectedRoomTypeName(rt.name)}
                        />
                        <div className="flex-1 flex justify-between">
                          <span>{rt.name}</span>
                          <span className="font-mono font-bold text-neutral-900">€{rt.pricePerNight} / notte</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Date di Soggiorno */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-200 text-xs">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Data Check-In</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Data Check-Out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-neutral-700 font-semibold mb-1">
                Richieste Speciali per l'Hotel (Letti separati, culla, piano alto)
              </label>
              <input
                type="text"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Es. Letto matrimoniale, arrivo in tarda serata..."
                className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-neutral-200">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <span>Continua: Seleziona Transfer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: SCELTA TRASFERIMENTI AEROPORTO                                    */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="border border-neutral-200 rounded-2xl p-6 sm:p-8 bg-white shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-serif-luxury font-bold text-neutral-900">
              Trasferimenti e Navette Aeroporto
            </h2>
            <p className="text-xs text-neutral-600 mt-1">
              Conducenti professionisti con cartello nominativo ti attenderanno all'uscita dogana del tuo volo.
            </p>
          </div>

          <div className="space-y-3">
            {weddingData.transfers.map((t) => {
              const isSelected = selectedTransferId === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTransferId(t.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                    isSelected ? 'border-neutral-900 bg-neutral-50/60' : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                        {t.type}
                      </span>
                      <span className="text-xs font-mono font-bold text-neutral-900">
                        {t.isPaidByCouple ? 'Incluso (Offerto dagli sposi)' : `€${t.pricePerSeat} / passeggero`}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-neutral-900">{t.title}</h3>
                    <p className="text-xs text-neutral-600">
                      Da: {t.origin} → A: {t.destination} ({t.vehicleType})
                    </p>
                    <p className="text-xs text-neutral-500 font-mono">Orari: {t.departureTime}</p>
                  </div>

                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${isSelected ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300'}`}>
                    {isSelected && <Check className="w-2.5 h-2.5" />}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Dettagli del Volo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-200 text-xs">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Numero Volo & Compagnia</label>
              <input
                type="text"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                placeholder="Es. Delta DL112 o British BA562"
                className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Data & Orario Arrivo</label>
              <input
                type="text"
                value={flightArrivalDate}
                onChange={(e) => setFlightArrivalDate(e.target.value)}
                placeholder="18 Giugno 2026 - 08:45"
                className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Numero Valigie</label>
              <input
                type="number"
                value={luggageCount}
                onChange={(e) => setLuggageCount(Number(e.target.value))}
                className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded font-mono"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-neutral-200">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-900"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Indietro</span>
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <span>Continua: Seleziona Esperienze</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: SELEZIONE ESPERIENZE                                             */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="border border-neutral-200 rounded-2xl p-6 sm:p-8 bg-white shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-serif-luxury font-bold text-neutral-900">
              Esperienze e Attività Curate per gli Invitati
            </h2>
            <p className="text-xs text-neutral-600 mt-1">
              Seleziona le attività a cui desideri partecipare prima o dopo il giorno del matrimonio.
            </p>
          </div>

          <div className="space-y-4">
            {weddingData.experiences.map((exp) => {
              const isSelected = selectedExperienceIds.includes(exp.id);
              return (
                <div
                  key={exp.id}
                  onClick={() => toggleExperience(exp.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between gap-4 ${
                    isSelected ? 'border-neutral-900 bg-neutral-50/60' : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                        {exp.eventDate} · {exp.startTime}
                      </span>
                      <span className="font-mono font-bold text-xs text-neutral-900">
                        {exp.isHostSponsored ? 'Gratuito (Offerto dagli sposi)' : `€${exp.pricePerPerson} / persona`}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-neutral-900">{exp.title}</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">{exp.description}</p>
                    <div className="text-[11px] text-neutral-500 pt-1">
                      Ritrovo: {exp.meetingPoint} · {exp.bookedParticipants} / {exp.maxParticipants} posti occupati
                    </div>
                  </div>

                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${isSelected ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300'}`}>
                    {isSelected && <Check className="w-2.5 h-2.5" />}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-neutral-200">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-900"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Indietro</span>
            </button>

            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <span>Conferma e Genera Voucher</span>
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: RIEPILOGO & VOUCHER                                              */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <div className="border border-neutral-200 rounded-2xl p-6 sm:p-8 bg-white shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <ShieldCheck className="w-4 h-4" />
                <span>Prenotazione Salvata con Successo per {guestInfo.name}</span>
              </div>
              <h2 className="text-xl font-serif-luxury font-bold text-neutral-900 mt-1">
                Voucher di Viaggio Ufficiale
              </h2>
            </div>

            <div className="text-right">
              <div className="text-[11px] text-neutral-400 uppercase tracking-wider">Codice Prenotazione</div>
              <div className="text-sm font-mono font-bold text-neutral-900">
                {weddingData.weddingCode}-VOUCH
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
              <span className="font-semibold text-neutral-500 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-neutral-600" />
                <span>Hotel Riservato</span>
              </span>
              <div className="text-sm font-bold text-neutral-900">{currentHotel?.name}</div>
              <div className="text-neutral-600">{selectedRoomTypeName}</div>
              <div className="text-neutral-500 text-[11px] pt-1">
                Check-in: {checkIn} · Check-out: {checkOut}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
              <span className="font-semibold text-neutral-500 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-neutral-600" />
                <span>Trasferimento Selezionato</span>
              </span>
              <div className="text-sm font-bold text-neutral-900">{currentTransfer?.title}</div>
              <div className="text-neutral-600 font-mono">Volo: {flightNumber}</div>
              <div className="text-neutral-500 text-[11px] pt-1">
                Orario arrivo: {flightArrivalDate} · {luggageCount} Valigie
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
              <span className="font-semibold text-neutral-500 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-neutral-600" />
                <span>Esperienze Confermate</span>
              </span>
              <div className="text-sm font-bold text-neutral-900">
                {selectedExperienceIds.length} Attività nel Programma
              </div>
              <ul className="text-neutral-600 space-y-0.5 list-disc list-inside pt-1">
                {selectedExperienceIds.map(id => {
                  const exp = weddingData.experiences.find(e => e.id === id);
                  return exp ? <li key={id}>{exp.title}</li> : null;
                })}
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-2">
            <span className="font-bold text-emerald-950 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-emerald-700" />
              <span>Contatto Diretto Concierge sul Posto</span>
            </span>
            <p className="text-emerald-900 leading-relaxed">
              In caso di variazioni di volo, ritardi o richieste speciali, contatta il team concierge al numero WhatsApp <strong className="font-mono">{weddingData.conciergeWhatsApp}</strong> o via email a <strong className="font-mono">{weddingData.conciergeEmail}</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-neutral-200">
            <button
              onClick={() => setCurrentStep(1)}
              className="text-xs text-neutral-600 hover:text-neutral-900 font-medium"
            >
              ← Modifica Scelte
            </button>

            <button
              onClick={() => alert(`Voucher inviato a ${guestInfo.email} e notificato all'agenzia concierge!`)}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Scarica / Invia Voucher via Email</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
