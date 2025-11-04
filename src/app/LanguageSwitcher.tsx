import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'

function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'tr' ? 'en' : 'tr'
    i18n.changeLanguage(newLang)
  }

  return (
    <Button variant="outlined" color="primary" onClick={toggleLanguage}>
      {i18n.language === 'tr' ? 'EN' : 'TR'}
    </Button>
  )
}

export default LanguageSwitcher
