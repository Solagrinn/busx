export const agencies = [
  { id: 'ist-alibeykoy', name: 'İstanbul – Alibeyköy' },
  { id: 'ist-bayrampasa', name: 'İstanbul – Bayrampaşa' },
  { id: 'ank-astim', name: 'Ankara – AŞTİ' },
  { id: 'bursa-otogar', name: 'Bursa – Otogar' },
]

export const schedules = [
  {
    id: 'TRIP-1001',
    company: 'Atlas Lines',
    from: 'ist-alibeykoy',
    to: 'ank-astim',
    departure: '2025-11-02T08:30:00+03:00',
    arrival: '2025-11-02T13:15:00+03:00',
    price: 695,
    availableSeats: 18,
  },
  {
    id: 'TRIP-1002',
    company: 'Metro Express',
    from: 'ist-bayrampasa',
    to: 'ank-astim',
    departure: '2025-11-02T09:15:00+03:00',
    arrival: '2025-11-02T14:05:00+03:00',
    price: 720,
    availableSeats: 12,
  },

  {
    id: 'TRIP-1003',
    company: 'Düzce Güven',
    from: 'ist-bayrampasa',
    to: 'ank-astim',
    departure: '2025-11-02T12:15:00+03:00',
    arrival: '2025-11-02T17:05:00+03:00',
    price: 750,
    availableSeats: 10,
  },
]

export const seatSchemas = [{
  tripId: 'TRIP-1001',
  layout: {
    rows: 10,
    cols: 5,
    cells: [
      // 0: boş, 1: dolu, 2: koridor, 3: kapı
      // örnek satır: [0,2,0,0,0]
      [0, 2, 0, 0, 0],
      [3, 2, 0, 0, 0],
      [0, 2, 0, 0, 0],
      [0, 2, 0, 0, 0],
      [0, 2, 0, 0, 0],
      [0, 2, 0, 0, 0],
      [0, 2, 0, 0, 0],
      [0, 2, 0, 0, 0],
      [3, 2, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  },
  seats: [
    // ROW 1: [0, 2, 0, 0, 0] (Seats 1-4)
    { no: 1, row: 1, col: 1, status: 'empty' },
    { no: 2, row: 1, col: 3, status: 'taken' }, // Your example: TAKEN
    { no: 3, row: 1, col: 4, status: 'empty' },
    { no: 4, row: 1, col: 5, status: 'empty' },

    // ROW 2: [3, 2, 0, 0, 0] (Seats 5-7) - Col 1 is a door (3)
    { no: 5, row: 2, col: 3, status: 'empty' },
    { no: 6, row: 2, col: 4, status: 'taken' }, // TAKEN
    { no: 7, row: 2, col: 5, status: 'empty' },

    // ROW 3: [0, 2, 0, 0, 0] (Seats 8-11)
    { no: 8, row: 3, col: 1, status: 'empty' },
    { no: 9, row: 3, col: 3, status: 'empty' },
    { no: 10, row: 3, col: 4, status: 'taken' }, // TAKEN
    { no: 11, row: 3, col: 5, status: 'empty' },

    // ROW 4: [0, 2, 0, 0, 0] (Seats 12-15)
    { no: 12, row: 4, col: 1, status: 'taken' }, // TAKEN
    { no: 13, row: 4, col: 3, status: 'empty' },
    { no: 14, row: 4, col: 4, status: 'empty' },
    { no: 15, row: 4, col: 5, status: 'empty' },

    // ROW 5: [0, 2, 0, 0, 0] (Seats 16-19)
    { no: 16, row: 5, col: 1, status: 'empty' },
    { no: 17, row: 5, col: 3, status: 'empty' },
    { no: 18, row: 5, col: 4, status: 'empty' },
    { no: 19, row: 5, col: 5, status: 'empty' },

    // ROW 6: [0, 2, 0, 0, 0] (Seats 20-23)
    { no: 20, row: 6, col: 1, status: 'empty' },
    { no: 21, row: 6, col: 3, status: 'empty' },
    { no: 22, row: 6, col: 4, status: 'empty' },
    { no: 23, row: 6, col: 5, status: 'empty' },

    // ROW 7: [0, 2, 0, 0, 0] (Seats 24-27)
    { no: 24, row: 7, col: 1, status: 'taken' }, // TAKEN
    { no: 25, row: 7, col: 3, status: 'empty' },
    { no: 26, row: 7, col: 4, status: 'empty' },
    { no: 27, row: 7, col: 5, status: 'empty' },

    // ROW 8: [0, 2, 0, 0, 0] (Seats 28-31)
    { no: 28, row: 8, col: 1, status: 'empty' },
    { no: 29, row: 8, col: 3, status: 'empty' },
    { no: 30, row: 8, col: 4, status: 'empty' },
    { no: 31, row: 8, col: 5, status: 'empty' },

    // ROW 9: [3, 2, 0, 0, 0] (Seats 32-34) - Col 1 is a door (3)
    { no: 32, row: 9, col: 3, status: 'empty' },
    { no: 33, row: 9, col: 4, status: 'empty' },
    { no: 34, row: 9, col: 5, status: 'empty' },

    // ROW 10: [0, 0, 0, 0, 0] (Seats 35-38)
    { no: 35, row: 10, col: 1, status: 'empty' },
    { no: 36, row: 10, col: 2, status: 'empty' },
    { no: 37, row: 10, col: 3, status: 'empty' },
    { no: 38, row: 10, col: 4, status: 'empty' },
    { no: 39, row: 10, col: 5, status: 'empty' },
  ],
  unitPrice: 695,
}]

export const ticketPurchase = {
  ok: true,
  pnr: 'AT-20251102-XYZ',
  message: 'Payment step mocked.',
}
