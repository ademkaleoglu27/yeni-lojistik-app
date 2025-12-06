'use client'

import { ReactNode, useEffect, useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { lightTheme, darkTheme } from '@/lib/theme'

type Props = {
  children: ReactNode
}

export default function ThemeProviderClient({ children }: Props) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    setDark(saved === 'dark')
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <ThemeProvider theme={dark ? darkTheme : lightTheme}>
      <div className="min-h-screen">
        {children}

        <button
          aria-label="Temayı değiştir"
          onClick={() => setDark((prev) => !prev)}
          className="fixed bottom-6 right-6 p-2 rounded-full bg-white shadow-md"
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </div>
    </ThemeProvider>
  )
}
