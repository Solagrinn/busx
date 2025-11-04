import LanguageSwitcher from './LanguageSwitcher.tsx'
import AppRouter from './Router.tsx'
import './i18n.ts'

function App() {
  return (
    <>
      <LanguageSwitcher></LanguageSwitcher>
      <AppRouter></AppRouter>
    </>
  )
}

export default App
