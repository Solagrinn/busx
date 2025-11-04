import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enCommon from '../locales/en/common.json'
import enPassenger from '../locales/en/passenger.json'
import enPrice from '../locales/en/price.json'
import enSchedule from '../locales/en/schedule.json'
import enSearch from '../locales/en/search.json'
import enSeats from '../locales/en/seats.json'
import enSeatSelection from '../locales/en/seatSelection.json'
import enSummary from '../locales/en/summary.json'
import enValidation from '../locales/en/validation.json'
import trCommon from '../locales/tr/common.json'
import trPassenger from '../locales/tr/passenger.json'
import trPrice from '../locales/tr/price.json'
import trSchedule from '../locales/tr/schedule.json'
import trSearch from '../locales/tr/search.json'
import trSeats from '../locales/tr/seats.json'
import trSeatSelection from '../locales/tr/seatSelection.json'
import trSummary from '../locales/tr/summary.json'
import trValidation from '../locales/tr/validation.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      tr: { common: trCommon, search: trSearch, seats: trSeats, seatSelection: trSeatSelection, summary: trSummary, passenger: trPassenger, price: trPrice, schedule: trSchedule, validation: trValidation },
      en: { common: enCommon, search: enSearch, seats: enSeats, seatSelection: enSeatSelection, summary: enSummary, passenger: enPassenger, price: enPrice, schedule: enSchedule, validation: enValidation },
    },
    lng: 'tr',
    fallbackLng: 'en',
    ns: ['common', 'search', 'seats'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  })
