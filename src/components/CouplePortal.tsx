import { useState, useRef } from 'react';
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Camera, 
  Upload, 
  Plus, 
  Trash2, 
  Save, 
  MessageCircle, 
  Share2, 
  Users, 
  Bell, 
  CheckCircle2, 
  Clock, 
  Info, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  Eye, 
  ExternalLink, 
  Copy, 
  Image as ImageIcon,
  AlertCircle,
  HelpCircle,
  Utensils,
  Car,
  Sun,
  Gift,
  Compass,
  Check,
  X
} from 'lucide-react';
import { 
  WeddingData, 
  ScheduleEvent, 
  GalleryPhoto, 
  SecondaryInfoSection, 
  BroadcastAnnouncement,
  AdminSettings
} from '../data/weddingStore';
import heroBanner from '../assets/images/wedding_concierge_hero_1791309110090.jpg';
import hotelSuiteImg from '../assets/images/wedding_hotel_suite_1791309120679.jpg';
import boatTourImg from '../assets/images/wedding_boat_experience_1791309131765.jpg';

interface CouplePortalProps {
  weddingData: WeddingData;
  onUpdateWedding: (updated: WeddingData) => void;
  onLogout: () => void;
  onPreviewAsGuest: (code: string) => void;
  adminSettings: AdminSettings;
}

export default function CouplePortal({
  weddingData,
  onUpdateWedding,
  onLogout,
  onPreviewAsGuest,
  adminSettings
}: CouplePortalProps) {
  // Tabs di navigazione per gli sposi
  const [activeTab, setActiveTab] = useState<'details' | 'photos' | 'secondary' | 'communication' | 'guests'>('details');

  // Stato Dettagli Matrimonio
  const [coupleNames, setCoupleNames] = useState(weddingData.coupleNames);
  const [weddingDate, setWeddingDate] = useState(weddingData.weddingDate);
  const [venue, setVenue] = useState(weddingData.venue);
  const [city, setCity] = useState(weddingData.city);
  const [welcomeMessage, setWelcomeMessage] = useState(weddingData.welcomeMessage);
  const [dressCode, setDressCode] = useState(weddingData.dressCode || '');
  const [story, setStory] = useState(weddingData.story || '');
  const [bannerImage, setBannerImage] = useState(weddingData.bannerImage);

  // Stato Timeline / Programma Nozze
  const [schedule, setSchedule] = useState<ScheduleEvent[]>(weddingData.schedule || [
    { id: 'ev-1', time: '16:30', title: 'Welcome Refreshment nell\'Agrumeto', location: 'Corte degli Aranci', description: 'Accoglienza con infusi freschi e drink di benvenuto' },
    { id: 'ev-2', time: '17:15', title: 'Cerimonia di Nozze tra gli Ulivi', location: 'Uliveto Storico', description: 'Scambio delle promesse' },
    { id: 'ev-3', time: '18:30', title: 'Aperitivo al Tramonto & Isole Gastronomiche', location: 'Piscina & Belvedere', description: 'Live show mozzarelle e vini pugliesi' },
    { id: 'ev-4', time: '20:30', title: 'Cena Placée sotto le Luminarie', location: 'Piazza della Corte', description: 'Banchetto tradizionale pugliese' },
    { id: 'ev-5', time: '23:00', title: 'Taglio della Torta Nuziale & Spettacolo', location: 'Giardino', description: 'Millefoglie e brindisi' },
    { id: 'ev-6', time: '23:30', title: 'Open Bar & DJ Set', location: 'Corte Notturna', description: 'Party e musica fino a tardi' }
  ]);

  // Stato Galleria Foto
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(weddingData.galleryPhotos || [
    { id: 'ph-1', url: hotelSuiteImg, caption: 'La nostra splendida masseria in Valle d\'Itria', uploadedAt: '2026-09-01' },
    { id: 'ph-2', url: boatTourImg, caption: 'Sopralluogo in barca a Polignano a Mare', uploadedAt: '2026-09-05' },
    { id: 'ph-3', url: heroBanner, caption: 'L\'aia illuminata dalle tradizionali luminarie pugliesi', uploadedAt: '2026-09-10' }
  ]);

  // Stato Informazioni Secondarie
  const [secondaryInfo, setSecondaryInfo] = useState<SecondaryInfoSection[]>(weddingData.secondaryInfo || [
    {
      id: 'sec-1',
      title: 'Logistica, Come Arrivare & Parcheggi',
      category: 'logistics',
      content: 'La masseria dista 45 minuti dall\'Aeroporto di Bari e 40 da quello di Brindisi. Per chi arriva in auto c\'è un ampio parcheggio interno gratuito con servizio valet. Navetta gratuita per gli ospiti che alloggiano negli hotel convenzionati.'
    },
    {
      id: 'sec-2',
      title: 'Clima a Settembre & Abbigliamento Consigliato',
      category: 'weather',
      content: 'Giornate calde e soleggiate (26°-29°C), la sera la brezza può rinfrescare l\'aria (19°-21°C). Consigliata una stola leggera. Per le signore: consigliamo scarpe con zeppa o tacco comodo per camminare sui ciottoli e sul prato.'
    },
    {
      id: 'sec-3',
      title: 'Lista Nozze & Regalo di Nozze',
      category: 'gift',
      content: 'Il vostro viaggio per festeggiare con noi è il regalo più bello! Se volete contribuire alla nostra luna di miele: IBAN IT98 X 03002 03280 000000123456 (Intestato agli sposi).'
    },
    {
      id: 'sec-4',
      title: 'Cucina Pugliese, Menù & Intolleranze',
      category: 'food',
      content: 'Tutti i piatti saranno preparati con eccellenze pugliesi. Abbiamo previsto menù specifici per celiaci, vegetariani e vegani: segnalatelo nel portale o a Valeria!'
    },
    {
      id: 'sec-5',
      title: 'Luoghi del Cuore da Visitare nei Dintorni',
      category: 'tourism',
      content: 'Consigliatissimi: Polignano a Mare, i trulli di Alberobello, la città bianca di Ostuni e una sosta tra le calette di Monopoli.'
    }
  ]);

  // Stato Avvisi / Annunci per gli ospiti (Broadcast)
  const [broadcastAnnouncements, setBroadcastAnnouncements] = useState<BroadcastAnnouncement[]>(weddingData.broadcastAnnouncements || [
    {
      id: 'ann-1',
      title: 'Navette Aeroporto Confermate',
      message: 'Le navette collettive da Bari e Brindisi sono attive. Ricordatevi di inserire il codice volo nella scheda Transfer!',
      date: '10 Settembre 2026',
      urgent: false
    },
    {
      id: 'ann-2',
      title: 'Welcome Party & Dress Code Informale',
      message: 'Per la festa dell\'11 settembre: abbigliamento comodo e fresco! Ci saranno panzerotti caldi e musica tradizionale nell\'aia.',
      date: '11 Settembre 2026',
      urgent: true
    }
  ]);

  // Stato Input Nuovi Elementi
  const [newScheduleTime, setNewScheduleTime] = useState('');
  const [newScheduleTitle, setNewScheduleTitle] = useState('');
  const [newScheduleLocation, setNewScheduleLocation] = useState('');
  const [newScheduleDesc, setNewScheduleDesc] = useState('');

  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  const [newInfoTitle, setNewInfoTitle] = useState('');
  const [newInfoCategory, setNewInfoCategory] = useState<'logistics' | 'weather' | 'gift' | 'food' | 'tourism' | 'other'>('logistics');
  const [newInfoContent, setNewInfoContent] = useState('');

  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnMessage, setNewAnnMessage] = useState('');
  const [newAnnUrgent, setNewAnnUrgent] = useState(false);

  // Stato Toast / Notifica Salvataggio
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Stato Modal Anteprima Foto Ingrandita (Lightbox)
  const [previewPhoto, setPreviewPhoto] = useState<GalleryPhoto | null>(null);

  // Stato Ricerca Invitati
  const [guestSearch, setGuestSearch] = useState('');

  // Calcolo Giorni al Matrimonio
  const calculateDaysLeft = () => {
    try {
      const weddingDay = new Date(weddingDate);
      const today = new Date();
      const diffTime = weddingDay.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch {
      return 150;
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowSaveToast(true);
    setTimeout(() => {
      setShowSaveToast(false);
    }, 3500);
  };

  // Salvataggio globale delle modifiche
  const handleSaveWeddingChanges = () => {
    const updatedWedding: WeddingData = {
      ...weddingData,
      coupleNames,
      weddingDate,
      venue,
      city,
      welcomeMessage,
      dressCode,
      story,
      bannerImage,
      schedule,
      galleryPhotos,
      secondaryInfo,
      broadcastAnnouncements
    };

    onUpdateWedding(updatedWedding);
    triggerToast('Tutte le modifiche e i dettagli del matrimonio sono stati salvati con successo!');
  };

  // Gestione Upload File Immagine Locale per Galleria
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const newPhoto: GalleryPhoto = {
            id: `photo-${Date.now()}`,
            url: reader.result,
            caption: newPhotoCaption || file.name.replace(/\.[^/.]+$/, ''),
            uploadedAt: new Date().toISOString().split('T')[0]
          };
          const updated = [newPhoto, ...galleryPhotos];
          setGalleryPhotos(updated);
          setNewPhotoCaption('');
          if (fileInputRef.current) fileInputRef.current.value = '';

          // Salvataggio automatico
          const updatedWedding: WeddingData = {
            ...weddingData,
            galleryPhotos: updated
          };
          onUpdateWedding(updatedWedding);
          triggerToast('Foto caricata e aggiunta alla galleria!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Gestione Upload Banner Principale
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setBannerImage(reader.result);
          const updatedWedding: WeddingData = {
            ...weddingData,
            bannerImage: reader.result
          };
          onUpdateWedding(updatedWedding);
          triggerToast('Nuova immagine copertina applicata al matrimonio!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Aggiungi foto da URL esterno o preset
  const handleAddPhotoByUrl = () => {
    if (!newPhotoUrl.trim()) return;
    const newPhoto: GalleryPhoto = {
      id: `photo-${Date.now()}`,
      url: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim() || 'Foto del matrimonio',
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newPhoto, ...galleryPhotos];
    setGalleryPhotos(updated);
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    const updatedWedding: WeddingData = {
      ...weddingData,
      galleryPhotos: updated
    };
    onUpdateWedding(updatedWedding);
    triggerToast('Foto aggiunta alla galleria!');
  };

  const handleDeletePhoto = (id: string) => {
    const updated = galleryPhotos.filter(p => p.id !== id);
    setGalleryPhotos(updated);
    const updatedWedding: WeddingData = {
      ...weddingData,
      galleryPhotos: updated
    };
    onUpdateWedding(updatedWedding);
    triggerToast('Foto rimossa dalla galleria.');
  };

  // Timeline events management
  const handleAddScheduleEvent = () => {
    if (!newScheduleTime.trim() || !newScheduleTitle.trim()) return;
    const newEv: ScheduleEvent = {
      id: `ev-${Date.now()}`,
      time: newScheduleTime.trim(),
      title: newScheduleTitle.trim(),
      location: newScheduleLocation.trim() || venue,
      description: newScheduleDesc.trim()
    };
    const updated = [...schedule, newEv];
    setSchedule(updated);
    setNewScheduleTime('');
    setNewScheduleTitle('');
    setNewScheduleLocation('');
    setNewScheduleDesc('');

    const updatedWedding: WeddingData = {
      ...weddingData,
      schedule: updated
    };
    onUpdateWedding(updatedWedding);
    triggerToast('Nuovo momento aggiunto al programma nozze!');
  };

  const handleDeleteScheduleEvent = (id: string) => {
    const updated = schedule.filter(s => s.id !== id);
    setSchedule(updated);
    const updatedWedding: WeddingData = {
      ...weddingData,
      schedule: updated
    };
    onUpdateWedding(updatedWedding);
    triggerToast('Momento rimosso dal programma.');
  };

  // Secondary info management
  const handleAddSecondaryInfo = () => {
    if (!newInfoTitle.trim() || !newInfoContent.trim()) return;
    const newSec: SecondaryInfoSection = {
      id: `sec-${Date.now()}`,
      title: newInfoTitle.trim(),
      category: newInfoCategory,
      content: newInfoContent.trim()
    };
    const updated = [...secondaryInfo, newSec];
    setSecondaryInfo(updated);
    setNewInfoTitle('');
    setNewInfoContent('');

    const updatedWedding: WeddingData = {
      ...weddingData,
      secondaryInfo: updated
    };
    onUpdateWedding(updatedWedding);
    triggerToast('Nuova scheda informativa pubblicata per gli ospiti!');
  };

  const handleDeleteSecondaryInfo = (id: string) => {
    const updated = secondaryInfo.filter(s => s.id !== id);
    setSecondaryInfo(updated);
    const updatedWedding: WeddingData = {
      ...weddingData,
      secondaryInfo: updated
    };
    onUpdateWedding(updatedWedding);
    triggerToast('Scheda informativa rimossa.');
  };

  // Broadcast announcements management
  const handleAddAnnouncement = () => {
    if (!newAnnTitle.trim() || !newAnnMessage.trim()) return;
    const newAnn: BroadcastAnnouncement = {
      id: `ann-${Date.now()}`,
      title: newAnnTitle.trim(),
      message: newAnnMessage.trim(),
      urgent: newAnnUrgent,
      date: new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    const updated = [newAnn, ...broadcastAnnouncements];
    setBroadcastAnnouncements(updated);
    setNewAnnTitle('');
    setNewAnnMessage('');
    setNewAnnUrgent(false);

    const updatedWedding: WeddingData = {
      ...weddingData,
      broadcastAnnouncements: updated
    };
    onUpdateWedding(updatedWedding);
    triggerToast('Avviso per gli ospiti pubblicato in bacheca!');
  };

  const handleDeleteAnnouncement = (id: string) => {
    const updated = broadcastAnnouncements.filter(a => a.id !== id);
    setBroadcastAnnouncements(updated);
    const updatedWedding: WeddingData = {
      ...weddingData,
      broadcastAnnouncements: updated
    };
    onUpdateWedding(updatedWedding);
    triggerToast('Avviso rimosso.');
  };

  // WhatsApp Invite Generator for Couple
  const getWhatsAppCoupleInviteText = (lang: 'it' | 'en') => {
    if (lang === 'it') {
      return `👰🤵 Cari amici e parenti!

Siamo immensamente felici di invitarvi a celebrare il nostro matrimonio in Puglia:
💍 *${coupleNames}*
🗓 *Data:* ${new Date(weddingDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
📍 *Location:* ${venue} (${city})

Per rendere il vostro soggiorno un'esperienza meravigliosa e senza pensieri, abbiamo attivato la piattaforma *Apulian Wedding Concierge*.

📱 *Come accedere:*
1. Apri la piattaforma: ${window.location.origin}
2. Clicca su *Accesso Ospiti*
3. Inserisci il nostro Codice Matrimonio: *${weddingData.weddingCode}*

Troverete gli hotel convenzionati, i transfer dagli aeroporti di Bari e Brindisi, i servizi di acconciatura/trucco e le esperienze speciali che abbiamo organizzato per voi. Inoltre, l'assistente Valeria sarà a vostra disposizione in chat!

Con tutto il nostro affetto,
${coupleNames} ❤️`;
    } else {
      return `👰🤵 Dear friends and family!

We are overjoyed to celebrate our destination wedding in Puglia with you:
💍 *${coupleNames}*
🗓 *Date:* ${weddingDate}
📍 *Venue:* ${venue} (${city}, Italy)

To help you organize your travel smoothly, we have set up the *Apulian Wedding Concierge* platform!

📱 *How to access:*
1. Visit: ${window.location.origin}
2. Click on *Guest Access*
3. Enter our Wedding Code: *${weddingData.weddingCode}*

You can browse negotiated hotels, airport transfers from Bari and Brindisi, hair & makeup services, and RSVP for the special experiences we planned for you. Our dedicated concierge Valeria is also available on live chat!

With all our love,
${coupleNames} ❤️`;
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    triggerToast(`${label} copiato negli appunti!`);
  };

  const filteredGuests = weddingData.guests.filter(g => 
    g.name.toLowerCase().includes(guestSearch.toLowerCase()) ||
    g.country.toLowerCase().includes(guestSearch.toLowerCase()) ||
    g.email.toLowerCase().includes(guestSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notifica */}
      {showSaveToast && (
        <div className="fixed top-20 right-6 z-50 bg-neutral-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-neutral-700 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HEADER SPOSI: BENVENUTO, BADGE, CONTEGGIO & AZIONI RAPIDE                 */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden bg-neutral-950 text-white shadow-xl border border-neutral-200">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src={bannerImage || heroBanner} 
            alt="Copertina Matrimonio Sposi" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-rose-300 uppercase tracking-wider mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-200">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span>Area Riservata Sposi</span>
            </span>
            <span className="text-white/40">•</span>
            <span className="font-mono text-neutral-300">Codice: {weddingData.weddingCode}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-white tracking-tight leading-tight">
            {coupleNames}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-neutral-300 mt-3">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{new Date(weddingDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{venue}, {city}</span>
            </div>
            <span>•</span>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-semibold text-xs border border-amber-400/30">
              <Clock className="w-3.5 h-3.5" />
              <span>Mancano {calculateDaysLeft()} giorni alle nozze!</span>
            </div>
          </div>

          <p className="text-neutral-300 text-xs sm:text-sm mt-4 leading-relaxed max-w-2xl line-clamp-2">
            {welcomeMessage}
          </p>

          {/* Quick Action Buttons for Couples */}
          <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-white/10">
            <button
              onClick={() => onPreviewAsGuest(weddingData.weddingCode)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-neutral-900 text-xs font-semibold hover:bg-neutral-100 transition-colors shadow-sm cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-neutral-700" />
              <span>Vedi Come lo Vedono gli Invitati</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('communication');
                const text = getWhatsAppCoupleInviteText('it');
                copyToClipboard(text, 'Invito WhatsApp');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Copia Invito WhatsApp per Ospiti</span>
            </button>

            <button
              onClick={handleSaveWeddingChanges}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salva Tutte le Modifiche</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* NAVIGAZIONE SCHEDE AREA SPOSI                                            */}
      {/* ========================================================================= */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-1.5 shadow-2xs flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'details'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-rose-400" />
          <span>Dettagli Matrimonio & Programma</span>
        </button>

        <button
          onClick={() => setActiveTab('photos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'photos'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
          }`}
        >
          <Camera className="w-3.5 h-3.5 text-amber-400" />
          <span>Carica Foto & Galleria ({galleryPhotos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('secondary')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'secondary'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
          }`}
        >
          <Info className="w-3.5 h-3.5 text-sky-400" />
          <span>Informazioni Secondarie & Guida ({secondaryInfo.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('communication')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'communication'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Comunicazione & Invito WhatsApp</span>
        </button>

        <button
          onClick={() => setActiveTab('guests')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'guests'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-indigo-400" />
          <span>Riepilogo Invitati ({weddingData.guests.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. DETTAGLI MATRIMONIO & PROGRAMMA DELLA GIORNATA                         */}
      {/* ========================================================================= */}
      {activeTab === 'details' && (
        <div className="space-y-8">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-neutral-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-serif-luxury font-bold text-neutral-900">
                  Dettagli Generali delle Nozze
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Queste informazioni saranno visualizzate dagli ospiti al momento del login e nella loro guida di viaggio.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveWeddingChanges}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-2xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salva Dettagli</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Nomi degli Sposi
                </label>
                <input
                  type="text"
                  value={coupleNames}
                  onChange={(e) => setCoupleNames(e.target.value)}
                  placeholder="Es. Sophia Rossi & Liam O'Connor"
                  className="w-full p-2.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Data del Matrimonio
                </label>
                <input
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full p-2.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Location Principale (Masseria, Villa, Resort)
                </label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Es. Borgo Egnazia, Masseria Torre Coccaro"
                  className="w-full p-2.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Città & Territorio in Puglia
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Es. Valle d'Itria, Fasano (BR), Ostuni"
                  className="w-full p-2.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Messaggio di Benvenuto per gli Invitati
              </label>
              <textarea
                rows={3}
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                placeholder="Scrivi un messaggio affettuoso per i vostri amici e familiari che arrivano in Puglia..."
                className="w-full p-2.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Dress Code & Stile Suggerito
                </label>
                <input
                  type="text"
                  value={dressCode}
                  onChange={(e) => setDressCode(e.target.value)}
                  placeholder="Es. Apulian Chic: lino e colori della terra, scarpe comode per il prato"
                  className="w-full p-2.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                />
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  Suggerimento: specifica il tipo di scarpe per le pavimentazioni storiche e il prato.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  La Nostra Storia (Breve Introduzione)
                </label>
                <input
                  type="text"
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Es. Ci siamo innamorati della Valle d'Itria nel 2023..."
                  className="w-full p-2.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>
          </div>

          {/* Programma / Timeline Nozze */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-neutral-100 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif-luxury font-bold text-neutral-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Programma della Giornata (Timeline Nozze)</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Gli orari e i luoghi dei vari momenti (Welcome, Cerimonia, Aperitivo, Cena, Taglio Torta, Party).
                </p>
              </div>
            </div>

            {/* Lista Momenti Timeline */}
            <div className="space-y-3">
              {schedule.map((item, idx) => (
                <div 
                  key={item.id}
                  className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-100/70 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-16 px-2 py-1 rounded-lg bg-neutral-900 text-white text-center font-mono text-xs font-bold shrink-0">
                      {item.time}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900 flex items-center gap-2">
                        <span>{item.title}</span>
                        <span className="text-[11px] font-normal text-neutral-500">📍 {item.location}</span>
                      </div>
                      {item.description && (
                        <div className="text-[11px] text-neutral-600 mt-0.5">{item.description}</div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteScheduleEvent(item.id)}
                    className="self-end sm:self-center p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                    title="Rimuovi momento"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Aggiunta Nuovo Momento */}
            <div className="pt-4 border-t border-neutral-100">
              <span className="text-xs font-bold text-neutral-800 block mb-3">
                Aggiungi un Nuovo Momento al Programma:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Orario</label>
                  <input
                    type="text"
                    value={newScheduleTime}
                    onChange={(e) => setNewScheduleTime(e.target.value)}
                    placeholder="17:30"
                    className="w-full p-2 text-xs bg-white border border-neutral-300 rounded-lg font-mono"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Momento / Titolo</label>
                  <input
                    type="text"
                    value={newScheduleTitle}
                    onChange={(e) => setNewScheduleTitle(e.target.value)}
                    placeholder="Es. Cerimonia nell'Uliveto"
                    className="w-full p-2 text-xs bg-white border border-neutral-300 rounded-lg"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Luogo / Punto d'incontro</label>
                  <input
                    type="text"
                    value={newScheduleLocation}
                    onChange={(e) => setNewScheduleLocation(e.target.value)}
                    placeholder="Es. Uliveto Storico"
                    className="w-full p-2 text-xs bg-white border border-neutral-300 rounded-lg"
                  />
                </div>
                <div className="sm:col-span-3">
                  <button
                    type="button"
                    onClick={handleAddScheduleEvent}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Aggiungi al Programma</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CARICA FOTO & GESTIONE GALLERIA NOZZE                                  */}
      {/* ========================================================================= */}
      {activeTab === 'photos' && (
        <div className="space-y-8">
          {/* Foto Copertina / Banner Principale */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h3 className="text-lg font-serif-luxury font-bold text-neutral-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-rose-500" />
                <span>Foto Copertina / Banner del Matrimonio</span>
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Questa immagine accoglierà i vostri ospiti all'apertura del portale del vostro matrimonio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5 aspect-video rounded-xl overflow-hidden border border-neutral-200 shadow-xs relative">
                <img 
                  src={bannerImage} 
                  alt="Anteprima copertina" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-semibold">
                  Copertina Attuale
                </span>
              </div>

              <div className="md:col-span-7 space-y-3">
                <span className="text-xs font-semibold text-neutral-700 block">
                  Cambia l'immagine di copertina:
                </span>
                
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="file"
                    ref={bannerFileInputRef}
                    onChange={handleBannerUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => bannerFileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Carica dal tuo Dispositivo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBannerImage(hotelSuiteImg);
                      triggerToast('Applicata suite Borgo Egnazia come copertina!');
                    }}
                    className="px-3 py-2 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    Preset Suite Masseria
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBannerImage(boatTourImg);
                      triggerToast('Applicato mare di Polignano come copertina!');
                    }}
                    className="px-3 py-2 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    Preset Scogliere Polignano
                  </button>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Formati consigliati: JPG o PNG orizzontali ad alta risoluzione (almeno 1600x900px).
                </p>
              </div>
            </div>
          </div>

          {/* Galleria Fotografica degli Sposi */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-neutral-100 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif-luxury font-bold text-neutral-900 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-600" />
                  <span>Galleria Fotografica della Coppia & Luoghi ({galleryPhotos.length})</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Caricate le foto del vostro fidanzamento, dei sopralluoghi in Puglia o dei momenti più belli da condividere con gli invitati.
                </p>
              </div>
            </div>

            {/* Box Caricamento Nuova Foto */}
            <div className="p-4 sm:p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
              <span className="text-xs font-bold text-neutral-800 block">
                Carica Nuova Foto nella Galleria:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-5">
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    Didascalia / Titolo della Foto
                  </label>
                  <input
                    type="text"
                    value={newPhotoCaption}
                    onChange={(e) => setNewPhotoCaption(e.target.value)}
                    placeholder="Es. Sopralluogo al tramonto nell'uliveto"
                    className="w-full p-2.5 text-xs bg-white border border-neutral-300 rounded-lg"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    Carica File da PC/Smartphone
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="w-full text-xs text-neutral-500 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-neutral-900 file:text-white hover:file:bg-neutral-800 file:cursor-pointer"
                  />
                </div>

                <div className="sm:col-span-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (fileInputRef.current) fileInputRef.current.click();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Seleziona & Carica</span>
                  </button>
                </div>
              </div>

              {/* Oppure tramite URL */}
              <div className="pt-2 flex items-center gap-2 text-xs">
                <span className="text-neutral-400">oppure inserisci URL immagine:</span>
                <input
                  type="url"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="https://esempio.com/foto.jpg"
                  className="flex-1 p-1.5 text-xs bg-white border border-neutral-300 rounded-lg max-w-xs"
                />
                <button
                  type="button"
                  onClick={handleAddPhotoByUrl}
                  className="px-3 py-1.5 rounded-lg bg-neutral-200 text-neutral-800 text-xs font-semibold hover:bg-neutral-300 cursor-pointer"
                >
                  Aggiungi URL
                </button>
              </div>
            </div>

            {/* Griglia Foto Caricate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {galleryPhotos.map((photo) => (
                <div 
                  key={photo.id}
                  className="group relative rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-900 shadow-2xs hover:shadow-md transition-all flex flex-col"
                >
                  <div 
                    className="aspect-4/3 overflow-hidden cursor-pointer relative"
                    onClick={() => setPreviewPhoto(photo)}
                  >
                    <img 
                      src={photo.url} 
                      alt={photo.caption || 'Foto sposi'} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1.5 rounded-full bg-white/90 text-neutral-900 text-xs font-bold flex items-center gap-1.5 shadow-md">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ingrandisci</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-white flex items-center justify-between border-t border-neutral-100">
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-bold text-neutral-900 truncate">
                        {photo.caption || 'Foto senza titolo'}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        Caricata il {photo.uploadedAt}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Elimina foto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. INFORMAZIONI SECONDARIE & GUIDA PER GLI OSPITI                          */}
      {/* ========================================================================= */}
      {activeTab === 'secondary' && (
        <div className="space-y-8">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-neutral-100 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif-luxury font-bold text-neutral-900 flex items-center gap-2">
                  <Info className="w-4 h-4 text-sky-600" />
                  <span>Informazioni Secondarie & Guida Utile agli Ospiti</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Consigli su parcheggi, clima della Puglia, coordinate per il regalo di nozze, intolleranze e posti da visitare.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveWeddingChanges}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-2xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salva Schede</span>
              </button>
            </div>

            {/* Schede Esistenti */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {secondaryInfo.map((sec) => {
                const getIcon = () => {
                  switch (sec.category) {
                    case 'logistics': return <Car className="w-4 h-4 text-blue-600" />;
                    case 'weather': return <Sun className="w-4 h-4 text-amber-500" />;
                    case 'gift': return <Gift className="w-4 h-4 text-rose-500" />;
                    case 'food': return <Utensils className="w-4 h-4 text-emerald-600" />;
                    case 'tourism': return <Compass className="w-4 h-4 text-purple-600" />;
                    default: return <Info className="w-4 h-4 text-neutral-600" />;
                  }
                };

                return (
                  <div 
                    key={sec.id}
                    className="p-5 bg-neutral-50/70 rounded-2xl border border-neutral-200 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="p-2 rounded-lg bg-white border border-neutral-200 shadow-2xs">
                            {getIcon()}
                          </span>
                          <span className="text-xs font-bold text-neutral-900">{sec.title}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteSecondaryInfo(sec.id)}
                          className="p-1 text-neutral-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                          title="Elimina scheda"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <textarea
                        rows={4}
                        value={sec.content}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSecondaryInfo(prev => prev.map(item => item.id === sec.id ? { ...item, content: val } : item));
                        }}
                        className="w-full p-2.5 text-xs bg-white border border-neutral-300 rounded-lg leading-relaxed text-neutral-700"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60 text-[11px] text-neutral-500">
                      <span className="uppercase font-semibold tracking-wider text-[10px]">Categoria: {sec.category}</span>
                      <span>Modificabile in tempo reale</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Aggiungi Nuova Scheda Informativa */}
            <div className="p-5 bg-sky-50/40 rounded-2xl border border-sky-200 space-y-3">
              <span className="text-xs font-bold text-sky-950 flex items-center gap-2">
                <Plus className="w-3.5 h-3.5 text-sky-700" />
                <span>Aggiungi una Nuova Scheda Informativa per gli Invitati:</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-5">
                  <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                    Titolo della Scheda
                  </label>
                  <input
                    type="text"
                    value={newInfoTitle}
                    onChange={(e) => setNewInfoTitle(e.target.value)}
                    placeholder="Es. Dress Code Brunch del Giorno Dopo"
                    className="w-full p-2 text-xs bg-white border border-neutral-300 rounded-lg"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                    Categoria Icona
                  </label>
                  <select
                    value={newInfoCategory}
                    onChange={(e) => setNewInfoCategory(e.target.value as any)}
                    className="w-full p-2 text-xs bg-white border border-neutral-300 rounded-lg"
                  >
                    <option value="logistics">🚗 Logistica & Parcheggi</option>
                    <option value="weather">☀️ Clima & Abbigliamento</option>
                    <option value="gift">🎁 Lista Nozze & Regalo</option>
                    <option value="food">🍷 Cucina & Intolleranze</option>
                    <option value="tourism">🏖️ Luoghi nei Dintorni</option>
                    <option value="other">ℹ️ Altra Informazione</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <button
                    type="button"
                    onClick={handleAddSecondaryInfo}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-sky-800 hover:bg-sky-900 rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Crea Nuova Scheda</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Testo Descrittivo della Scheda
                </label>
                <textarea
                  rows={2}
                  value={newInfoContent}
                  onChange={(e) => setNewInfoContent(e.target.value)}
                  placeholder="Scrivi le indicazioni e i consigli per i tuoi invitati..."
                  className="w-full p-2 text-xs bg-white border border-neutral-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. COMUNICAZIONE SPOSI: BACHECA AVVISI & INVITO WHATSAPP                   */}
      {/* ========================================================================= */}
      {activeTab === 'communication' && (
        <div className="space-y-8">
          {/* Generatore Invito Ufficiale WhatsApp degli Sposi */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">
                Condivisione Esterna
              </span>
              <h3 className="text-lg font-serif-luxury font-bold text-neutral-900 flex items-center gap-2 mt-0.5">
                <Share2 className="w-4 h-4 text-emerald-600" />
                <span>Invito Ufficiale WhatsApp degli Sposi per i Propri Ospiti</span>
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Inviate questo messaggio tramite WhatsApp ai vostri invitati per invitarli e fornire il Codice Matrimonio con cui accedere al Concierge.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Versione Italiana */}
              <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                      <span>🇮🇹</span>
                      <span>Messaggio in Italiano</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                      Pronto per WhatsApp
                    </span>
                  </div>

                  <pre className="p-3 bg-white rounded-xl border border-neutral-200 text-neutral-800 text-[11px] font-sans leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {getWhatsAppCoupleInviteText('it')}
                  </pre>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(getWhatsAppCoupleInviteText('it'))}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-2xs text-center"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Invia Subito su WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(getWhatsAppCoupleInviteText('it'), 'Invito Italiano')}
                    className="p-2.5 rounded-xl border border-neutral-300 hover:bg-white text-neutral-700 transition-colors cursor-pointer"
                    title="Copia negli appunti"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Versione Inglese per Ospiti Internazionali */}
              <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                      <span>🇬🇧 🇺🇸</span>
                      <span>Messaggio in Inglese (International Guests)</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold">
                      English Version
                    </span>
                  </div>

                  <pre className="p-3 bg-white rounded-xl border border-neutral-200 text-neutral-800 text-[11px] font-sans leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {getWhatsAppCoupleInviteText('en')}
                  </pre>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(getWhatsAppCoupleInviteText('en'))}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-2xs text-center"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Send via WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(getWhatsAppCoupleInviteText('en'), 'English Invite')}
                    className="p-2.5 rounded-xl border border-neutral-300 hover:bg-white text-neutral-700 transition-colors cursor-pointer"
                    title="Copy text"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bacheca Avvisi in Tempo Reale (Broadcast Announcements) */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h3 className="text-lg font-serif-luxury font-bold text-neutral-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-600" />
                <span>Bacheca Avvisi & Comunicazioni in Tempo Reale ({broadcastAnnouncements.length})</span>
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Scrivete avvisi importanti per tutti gli invitati: appariranno in evidenza nel loro portale ospiti!
              </p>
            </div>

            {/* Aggiungi Nuovo Avviso */}
            <div className="p-4 sm:p-5 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-3">
              <span className="text-xs font-bold text-amber-950 block">
                Pubblica un Nuovo Avviso per gli Invitati:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-8">
                  <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                    Titolo dell'Avviso
                  </label>
                  <input
                    type="text"
                    value={newAnnTitle}
                    onChange={(e) => setNewAnnTitle(e.target.value)}
                    placeholder="Es. Orario navetta confermato alle 16:30 dall'hotel"
                    className="w-full p-2 text-xs bg-white border border-neutral-300 rounded-lg"
                  />
                </div>

                <div className="sm:col-span-4 flex items-center gap-2 pb-1">
                  <input
                    type="checkbox"
                    id="urgentCheck"
                    checked={newAnnUrgent}
                    onChange={(e) => setNewAnnUrgent(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-neutral-300"
                  />
                  <label htmlFor="urgentCheck" className="text-xs font-semibold text-rose-700 cursor-pointer">
                    Contrassegna come URGENTE
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Messaggio Dettagliato
                </label>
                <textarea
                  rows={2}
                  value={newAnnMessage}
                  onChange={(e) => setNewAnnMessage(e.target.value)}
                  placeholder="Scrivi il messaggio che tutti gli ospiti leggeranno..."
                  className="w-full p-2 text-xs bg-white border border-neutral-300 rounded-lg"
                />
              </div>

              <button
                type="button"
                onClick={handleAddAnnouncement}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-800 text-white text-xs font-semibold hover:bg-amber-900 transition-colors shadow-2xs cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Pubblica Avviso in Bacheca</span>
              </button>
            </div>

            {/* Lista Avvisi Pubblicati */}
            <div className="space-y-3">
              {broadcastAnnouncements.map((ann) => (
                <div 
                  key={ann.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    ann.urgent ? 'bg-rose-50 border-rose-200' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {ann.urgent && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white uppercase">
                          Urgente
                        </span>
                      )}
                      <span className="text-xs font-bold text-neutral-900">{ann.title}</span>
                      <span className="text-[10px] text-neutral-400">• {ann.date}</span>
                    </div>
                    <p className="text-xs text-neutral-700 leading-relaxed max-w-2xl">
                      {ann.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`📢 *Avviso Sposi (${coupleNames})*: ${ann.title}\n\n${ann.message}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                      title="Condividi questo avviso su WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                      className="p-2 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                      title="Elimina avviso"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. RIEPILOGO INVITATI & MONITORAGGIO SCELTE (LIVE RSVP)                     */}
      {/* ========================================================================= */}
      {activeTab === 'guests' && (
        <div className="space-y-8">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-neutral-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-serif-luxury font-bold text-neutral-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Riepilogo Invitati & Scelte del Vostro Matrimonio ({weddingData.guests.length})</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Monitorate in tempo reale gli ospiti registrati, le loro camere, transfer ed eventuali intolleranze alimentari.
                </p>
              </div>

              <div className="w-full sm:w-64">
                <input
                  type="text"
                  value={guestSearch}
                  onChange={(e) => setGuestSearch(e.target.value)}
                  placeholder="Cerca per nome, paese o email..."
                  className="w-full p-2 text-xs bg-white border border-neutral-300 rounded-lg"
                />
              </div>
            </div>

            {/* KPI Cards Ospiti per gli Sposi */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-center">
                <div className="text-2xl font-bold font-serif-luxury text-indigo-950">
                  {weddingData.guests.length}
                </div>
                <div className="text-[11px] font-semibold text-indigo-700 mt-0.5">
                  Invitati Registrati
                </div>
              </div>

              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 text-center">
                <div className="text-2xl font-bold font-serif-luxury text-emerald-950">
                  {weddingData.guests.filter(g => g.hotelBooked && g.hotelBooked !== '-').length}
                </div>
                <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                  Alloggi in Convenzione
                </div>
              </div>

              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 text-center">
                <div className="text-2xl font-bold font-serif-luxury text-amber-950">
                  {weddingData.guests.filter(g => g.transferBooked && !g.transferBooked.includes('Autonomo')).length}
                </div>
                <div className="text-[11px] font-semibold text-amber-700 mt-0.5">
                  Navette / Transfer
                </div>
              </div>

              <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100 text-center">
                <div className="text-2xl font-bold font-serif-luxury text-rose-950">
                  {weddingData.guests.filter(g => g.diet && g.diet !== 'Nessuna restrizione').length}
                </div>
                <div className="text-[11px] font-semibold text-rose-700 mt-0.5">
                  Diete Speciali / Allergie
                </div>
              </div>
            </div>

            {/* Tabella Invitati */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500 font-semibold bg-neutral-50/60">
                    <th className="py-2.5 px-3">Ospite</th>
                    <th className="py-2.5 px-3">Origine</th>
                    <th className="py-2.5 px-3">Alloggio Prenotato</th>
                    <th className="py-2.5 px-3">Transfer / Volo</th>
                    <th className="py-2.5 px-3">Dieta & Allergie</th>
                    <th className="py-2.5 px-3">Stato</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredGuests.map((g) => (
                    <tr key={g.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-neutral-900">{g.name}</div>
                        <div className="text-[11px] text-neutral-400 font-mono">{g.email}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="flex items-center gap-1.5 text-neutral-700">
                          <span>{g.flag}</span>
                          <span>{g.country}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-neutral-800">{g.hotelBooked || 'In attesa'}</div>
                        {g.roomType && g.roomType !== '-' && (
                          <div className="text-[10px] text-neutral-500">{g.roomType}</div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-neutral-800">{g.transferBooked || 'Autonomo'}</div>
                        {g.flight && (
                          <div className="text-[10px] text-neutral-500 font-mono">✈️ {g.flight}</div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          g.diet && g.diet !== 'Nessuna restrizione'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          {g.diet || 'Nessuna'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {g.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Box Assistenza Valeria per gli Sposi */}
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-900 text-white font-bold flex items-center justify-center font-serif-luxury shrink-0">
                  V
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-950">
                    Valeria · Concierge Dedicata a {coupleNames}
                  </div>
                  <div className="text-[11px] text-amber-800">
                    AD Marketing Palagianello (TA) • WhatsApp: {adminSettings.valeriaPhone}
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/${adminSettings.valeriaPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Ciao Valeria, siamo ${coupleNames} dal portale sposi! Avremmo bisogno di un aggiornamento sulla logistica del matrimonio.`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-2xs shrink-0"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Scrivi a Valeria su WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL LIGHTBOX FOTO INGRANDITA                                            */}
      {/* ========================================================================= */}
      {previewPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4"
          onClick={() => setPreviewPhoto(null)}
        >
          <div 
            className="max-w-4xl w-full bg-neutral-950 rounded-2xl overflow-hidden shadow-2xl border border-white/20 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-16/10 max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img 
                src={previewPhoto.url} 
                alt={previewPhoto.caption || 'Foto sposi'} 
                className="max-w-full max-h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-4 bg-neutral-900 text-white flex items-center justify-between text-xs border-t border-white/10">
              <span className="font-semibold text-sm">{previewPhoto.caption || 'Foto del matrimonio'}</span>
              <span className="text-neutral-400 font-mono text-[11px]">Caricata: {previewPhoto.uploadedAt}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
