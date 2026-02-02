import { useState } from 'react'
import { Eye, EyeOff, Shield, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

export default function SecuritySettings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" placeholder="••••••••" />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Auth */}
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Authenticator App</p>
                <p className="text-sm text-muted-foreground">
                  Use an authenticator app for 2FA codes
                </p>
              </div>
            </div>
            <Switch />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Recovery Codes</p>
                <p className="text-sm text-muted-foreground">
                  Download backup codes for account recovery
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Manage your active sessions across devices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">MacBook Pro - Chrome</p>
                <Badge variant="secondary">Current</Badge>
              </div>
              <p className="text-sm text-muted-foreground">San Francisco, CA • Last active now</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">iPhone 15 - Safari</p>
              <p className="text-sm text-muted-foreground">
                San Francisco, CA • Last active 2 hours ago
              </p>
            </div>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
              Revoke
            </Button>
          </div>

          <div className="pt-2">
            <Button variant="outline" className="text-destructive hover:text-destructive">
              Sign Out All Other Sessions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
