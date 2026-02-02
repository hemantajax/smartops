import { Moon, Sun, Monitor, Search, Bell } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useThemeStore } from '@/stores/theme-store'

export function AppHeader() {
  const { theme, setTheme } = useThemeStore()

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      {/* Search */}
      <div className="flex-1">
        <Button
          variant="outline"
          className="w-full max-w-sm justify-start text-muted-foreground"
          onClick={() => {
            // TODO: Open command palette
          }}
        >
          <Search className="mr-2 size-4" />
          <span>Search...</span>
          <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-4" />
          <span className="absolute right-1 top-1 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
          </span>
        </Button>

        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>
              <Sun className="mr-2 size-4" />
              Light
              {theme === 'light' && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              <Moon className="mr-2 size-4" />
              Dark
              {theme === 'dark' && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              <Monitor className="mr-2 size-4" />
              System
              {theme === 'system' && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
