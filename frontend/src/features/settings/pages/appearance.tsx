import { Moon, Sun, Monitor } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/stores/theme-store'

const themes = [
  {
    value: 'light',
    label: 'Light',
    icon: Sun,
    description: 'Light background with dark text',
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: Moon,
    description: 'Dark background with light text',
  },
  {
    value: 'system',
    label: 'System',
    icon: Monitor,
    description: 'Follows your system preference',
  },
] as const

export default function AppearanceSettings() {
  const { theme, setTheme } = useThemeStore()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how the app looks on your device</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Theme</Label>
            <div className="grid gap-4 md:grid-cols-3">
              {themes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors hover:bg-muted',
                    theme === t.value ? 'border-primary bg-muted' : 'border-transparent'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-full',
                      theme === t.value ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    )}
                  >
                    <t.icon className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{t.label}</p>
                    <p className="text-xs text-muted-foreground">{t.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
