export const getExperiencesByWedding = async (req, res, next) => {
  try {
    const { weddingId } = req.params;

    res.json({
      success: true,
      data: [
        {
          id: 'exp-boat-sunset',
          title: 'Sunset Cruise su Motoscafo Riva & Prosecco',
          category: 'BOAT_TOUR',
          eventDate: '2026-06-19',
          startTime: '18:00',
          durationHours: 2.5,
          meetingPoint: 'Molo di Tremezzo',
          pricePerPerson: 110,
          isHostSponsored: false,
          maxParticipants: 24,
          bookedParticipants: 18,
          dressCode: 'Resort Chic / White Accents',
          description: 'Tour privato delle ville storiche del centro lago con sosta champagne al tramonto.',
        },
        {
          id: 'exp-welcome-pizza',
          title: 'Welcome Dinner & Pizza Party con Musica dal Vivo',
          category: 'WELCOME_PARTY',
          eventDate: '2026-06-19',
          startTime: '20:30',
          durationHours: 3.5,
          meetingPoint: 'Terrazza Giardino Bellagio',
          pricePerPerson: 0,
          isHostSponsored: true,
          maxParticipants: 120,
          bookedParticipants: 95,
          dressCode: 'Casual Summer Party',
          description: 'Cena informale offerta dagli sposi con forni a legna per pizza napoletana e cocktail bar.',
        },
        {
          id: 'exp-cooking-class',
          title: 'Pasta Fresca & Tiramisù Masterclass in Dimora Storica',
          category: 'COOKING_CLASS',
          eventDate: '2026-06-21',
          startTime: '11:00',
          durationHours: 3,
          meetingPoint: 'Villa Rustica Lenno',
          pricePerPerson: 85,
          isHostSponsored: false,
          maxParticipants: 16,
          bookedParticipants: 12,
          dressCode: 'Comfortable',
          description: 'Impara i segreti dei tagliolini al tartufo e del vero tiramisù con pranzo panoramico.',
        },
      ],
    });
  } catch (error) {
    next(error);
  }
};

export const bookExperience = async (req, res, next) => {
  try {
    const { guestId, experienceId, participantsCount, dietaryNeeds, notes } = req.body;

    res.status(201).json({
      success: true,
      message: 'Partecipazione all\'esperienza confermata.',
      data: {
        bookingId: `EXP-BKG-${Date.now()}`,
        guestId,
        experienceId,
        participantsCount: participantsCount || 1,
        dietaryNeeds,
        notes,
        status: 'CONFIRMED',
      },
    });
  } catch (error) {
    next(error);
  }
};
