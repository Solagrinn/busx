import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enCommon from '../../public/locales/en/common.json'
import enPassenger from '../../public/locales/en/passenger.json'
import enPrice from '../../public/locales/en/price.json'
import enSchedule from '../../public/locales/en/schedule.json'
import enSearch from '../../public/locales/en/search.json'
import enSeats from '../../public/locales/en/seats.json'
import enSeatSelection from '../../public/locales/en/seatSelection.json'
import enSummary from '../../public/locales/en/summary.json'
import trCommon from '../../public/locales/tr/common.json'
import trPassenger from '../../public/locales/tr/passenger.json'
import trPrice from '../../public/locales/tr/price.json'
import trSchedule from '../../public/locales/tr/schedule.json'
import trSearch from '../../public/locales/tr/search.json'
import trSeats from '../../public/locales/tr/seats.json'
import trSeatSelection from '../../public/locales/tr/seatSelection.json'
import trSummary from '../../public/locales/tr/summary.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      tr: { common: trCommon, search: trSearch, seats: trSeats, seatSelection: trSeatSelection, summary: trSummary, passenger: trPassenger, price: trPrice, schedule: trSchedule },
      en: { common: enCommon, search: enSearch, seats: enSeats, seatSelection: enSeatSelection, summary: enSummary, passenger: enPassenger, price: enPrice, schedule: enSchedule },
    },
    lng: 'tr',
    fallbackLng: 'en',
    ns: ['common', 'search', 'seats'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  })

export default i18n
