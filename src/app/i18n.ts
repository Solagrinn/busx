import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enCommon from '../../public/locales/en/common.json'
import enSchedule from '../../public/locales/en/schedule.json'
import enSearch from '../../public/locales/en/search.json'
import enSeats from '../../public/locales/en/seats.json'
import trCommon from '../../public/locales/tr/common.json'
import trSchedule from '../../public/locales/tr/schedule.json'
import trSearch from '../../public/locales/tr/search.json'
import trSeats from '../../public/locales/tr/seats.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      tr: { common: trCommon, search: trSearch, seats: trSeats, schedule: trSchedule },
      en: { common: enCommon, search: enSearch, seats: enSeats, schedule: enSchedule },
    },
    lng: 'tr',
    fallbackLng: 'en',
    ns: ['common', 'search', 'seats'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  })

export default i18n
