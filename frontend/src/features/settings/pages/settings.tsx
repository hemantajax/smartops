import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { User, Palette, Bell, Shield, KeyRound } from 'lucide-react'
import { cn } from '@/lib/utils'

const settingsNav = [
  { title: 'Profile', href: '/settings/profile', icon: User },
  { title: 'Appearance', href: '/settings/appearance', icon: Palette },
  { title: 'Notifications', href: '/settings/notifications', icon: Bell },
  { title: 'Security', href: '/settings/security', icon: Shield },
]

export default function SettingsPage() {
  const location = useLocation()

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-48 lg:w-56">
          <nav className="flex flex-col gap-1">
            {settingsNav.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  location.pathname === item.href
                    ? 'bg-muted font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 max-w-2xl">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
