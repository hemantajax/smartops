import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './app-sidebar'
import { AppHeader } from './app-header'
import { PageLoader } from '@/components/common'

export function AppShell() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 overflow-auto">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
