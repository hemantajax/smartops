import { useEffect } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { initializeTheme } from '@/stores/theme-store'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    initializeTheme()
  }, [])

  return (
    <TooltipProvider>
      {children}
      <Toaster position="top-right" />
    </TooltipProvider>
  )
}
