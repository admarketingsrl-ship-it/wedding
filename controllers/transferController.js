export const getTransfersByWedding = async (req, res, next) => {
  try {
    const { weddingId } = req.params;

    res.json({
      success: true,
      data: [
        {
          id: 'tr-mxp-1',
          type: 'AIRPORT_SHUTTLE',
          title: 'Navetta Collettiva Aeroporto Malpensa (MXP) → Tremezzo / Bellagio',
          origin: 'Milano Malpensa Terminal 1 & 2',
          destination: 'Hotel Convenzionati',
          departureTime: '11:00, 15:30, 19:30',
          vehicleType: 'Mercedes-Benz Sprinter VIP (16 pax)',
          capacity: 16,
          bookedSeats: 9,
          pricePerSeat: 45,
          isPaidByCouple: false,
        },
        {
          id: 'tr-ncc-pvt',
          type: 'PRIVATE_NCC',
          title: 'NCC Privato Dedicato con Autista (Milano Linate LIN o Bergamo BGY)',
          origin: 'Aeroporto o Stazione Centrale Milano',
          destination: 'Alloggio Ospite',
          departureTime: 'Personalizzato sul volo',
          vehicleType: 'Mercedes-Benz Classe E / V-Class',
          capacity: 6,
          pricePerSeat: 220,
          isPaidByCouple: false,
        },
        {
          id: 'tr-event-shuttle',
          type: 'VENUE_SHUTTLE',
          title: 'Navetta Ufficiale Giorno del Matrimonio (A/R)',
          origin: 'Lobby Hotel Tremezzo / Serbelloni',
          destination: 'Villa Balbianello (Cerimonia & Ricevimento)',
          departureTime: 'Partenza ore 15:15 - Ritorno ore 01:00 e 03:00',
          vehicleType: 'Motoscafo Privato / Bus Navetta',
          capacity: 120,
          bookedSeats: 88,
          pricePerSeat: 0,
          isPaidByCouple: true,
        },
      ],
    });
  } catch (error) {
    next(error);
  }
};

export const bookTransfer = async (req, res, next) => {
  try {
    const { guestId, transferId, seatsCount, luggageCount, flightNumber, flightArrival } = req.body;

    res.status(201).json({
      success: true,
      message: 'Trasferimento prenotato e registrato nel piano logistico dell\'agenzia.',
      data: {
        bookingId: `TR-BKG-${Date.now()}`,
        guestId,
        transferId,
        seatsCount: seatsCount || 1,
        luggageCount: luggageCount || 2,
        flightNumber,
        flightArrival,
        status: 'CONFIRMED',
        dispatchNote: 'L\'autista attenderà al gate con cartello nominativo dell\'ospite.',
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTransferManifest = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        transferId: req.params.transferId,
        passengers: [
          { name: 'John & Claire Davies', flight: 'BA562', seats: 2, luggage: 4, phone: '+44 7700 900123' },
          { name: 'Michael Harrison', flight: 'DL112', seats: 1, luggage: 2, phone: '+1 415 555 2671' },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
};
