export const getGuestByCode = async (req, res, next) => {
  try {
    const { weddingCode } = req.params;
    const email = req.query.email;

    res.json({
      success: true,
      data: {
        id: 'guest-us-42',
        weddingCode,
        firstName: 'Eleanor',
        lastName: 'Vance',
        email: email || 'eleanor.vance@example.com',
        nationality: 'United States (New York)',
        primaryLanguage: 'en',
        rsvpStatus: 'CONFIRMED',
        plusOneAllowed: true,
        plusOneName: 'Jonathan Vance',
        dietaryNotes: 'Vegetarian, No shellfish',
        flightDetails: {
          airline: 'Delta DL112',
          arrivalAirport: 'Milano Malpensa (MXP)',
          arrivalDate: '2026-06-18',
          arrivalTime: '08:45',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateGuestRsvp = async (req, res, next) => {
  try {
    const { guestId } = req.params;
    const { rsvpStatus, dietaryNotes, specialNotes, plusOneName, arrivalAirport, arrivalFlight } = req.body;

    res.json({
      success: true,
      message: 'Preferenze ospite e RSVP aggiornati con successo.',
      data: {
        guestId,
        rsvpStatus,
        dietaryNotes,
        specialNotes,
        plusOneName,
        arrivalAirport,
        arrivalFlight,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllGuestsByWedding = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: [
        {
          id: 'g-1',
          name: 'Eleanor & Jonathan Vance',
          country: 'United States',
          email: 'eleanor.vance@example.com',
          rsvp: 'CONFIRMED',
          hotelBooked: 'Grand Hotel Tremezzo (Prestige Lake)',
          transfer: 'Shuttle MXP 11:00',
          experiences: ['Sunset Cruise', 'Welcome Dinner'],
          dietary: 'Vegetarian',
        },
        {
          id: 'g-2',
          name: 'Henry & Charlotte Windsor',
          country: 'United Kingdom',
          email: 'c.windsor@london.co.uk',
          rsvp: 'CONFIRMED',
          hotelBooked: 'Villa Serbelloni Palace',
          transfer: 'NCC Privato (LIN)',
          experiences: ['Cooking Class', 'Welcome Dinner'],
          dietary: 'Gluten Free',
        },
        {
          id: 'g-3',
          name: 'Pierre & Camille Dubois',
          country: 'France',
          email: 'dubois.p@paris-arch.fr',
          rsvp: 'CONFIRMED',
          hotelBooked: 'Grand Hotel Tremezzo',
          transfer: 'Shuttle MXP 15:30',
          experiences: ['Welcome Dinner'],
          dietary: 'Nessuna',
        },
        {
          id: 'g-4',
          name: 'Lucas & Mia Miller',
          country: 'Australia',
          email: 'lucas.m@sydney.com.au',
          rsvp: 'PENDING',
          hotelBooked: 'In attesa di conferma',
          transfer: 'Non richiesto',
          experiences: [],
          dietary: 'Da verificare',
        },
      ],
    });
  } catch (error) {
    next(error);
  }
};
