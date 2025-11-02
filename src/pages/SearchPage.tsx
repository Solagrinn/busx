import type { ScheduleSearchParams } from '../types/schedules.ts'
import type { ScheduleSearchFormData } from '../types/zodSchemas.ts'
import { useCallback, useState } from 'react'
import { useSchedules } from '../hooks/useSchedules.ts'

const INITIAL_SEARCH_PARAMS: ScheduleSearchParams = {
  fromId: '',
  toId: '',
  date: '',
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useState<ScheduleSearchParams>(INITIAL_SEARCH_PARAMS)

  const { data: schedules, isLoading, isError, error, isFetching } = useSchedules(searchParams)

  const handleSearchSubmit = useCallback((data: ScheduleSearchFormData) => {
    setSearchParams({
      fromId: data.fromId,
      toId: data.toId,
      date: data.date,
    })
  }, [])

  const hasSearched = !!(searchParams.fromId && searchParams.toId && searchParams.date)

  const statusMessage = (() => {
    if (isLoading || isFetching)
      return 'Seferler yükleniyor...'
    if (isError)
      return `Hata oluştu: ${error?.message || 'Bilinmeyen Hata'}`
    if (hasSearched && schedules && schedules.length === 0)
      return 'Bu kriterlere uygun sefer bulunamadı.'
    if (!hasSearched)
      return 'Lütfen kalkış, varış ve tarihi seçerek arama yapınız.'
    return ''
  })()

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      asdasdsa
      <div className="mb-8 p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-4 text-indigo-700">Sefer Ara</h1>
        {/* <SearchForm onSubmit={handleSearchSubmit} initialData={searchParams} /> */}
        <button
          type="button"
          onClick={() => {
            const data = { fromId: 'ist-alibeykoy', toId: 'ank-astim', date: '2025-11-02' }
            handleSearchSubmit(data)
          }}
        >
          asd
        </button>
      </div>
      {/* 5. Dumb Component 2: Sonuç Listesi veya Durum Mesajı */}
      <div className="mt-8">
        {(isLoading || isError || statusMessage) && (
          <div className={`p-4 text-center rounded-lg ${isError ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
            {statusMessage}
          </div>
        )}

        {/* Sadece veri varsa ve yüklenme/hata yoksa listeyi göster */}
        {/* {hasSearched && schedules && schedules.length > 0 && (
          <ScheduleList schedules={schedules} />
        )} */}
      </div>
    </div>
  )
}
