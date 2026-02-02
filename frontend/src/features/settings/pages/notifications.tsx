import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'

const notificationSettings = [
  {
    id: 'email-orders',
    label: 'Order Updates',
    description: 'Receive email notifications for new orders and status changes',
  },
  {
    id: 'email-reports',
    label: 'Weekly Reports',
    description: 'Get a weekly summary of your business metrics',
  },
  {
    id: 'email-security',
    label: 'Security Alerts',
    description: 'Important security notifications about your account',
  },
]

const pushSettings = [
  {
    id: 'push-messages',
    label: 'AI Assistant Messages',
    description: 'Notifications when AI completes a task or has insights',
  },
  {
    id: 'push-mentions',
    label: 'Mentions & Comments',
    description: 'When someone mentions you or comments on your work',
  },
  {
    id: 'push-updates',
    label: 'System Updates',
    description: 'Important updates about new features and changes',
  },
]

export default function NotificationSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Configure which emails you'd like to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationSettings.map((setting, index) => (
            <div key={setting.id}>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor={setting.id}>{setting.label}</Label>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
                <Switch id={setting.id} defaultChecked={index === 2} />
              </div>
              {index < notificationSettings.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>Configure in-app and browser notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pushSettings.map((setting, index) => (
            <div key={setting.id}>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor={setting.id}>{setting.label}</Label>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
                <Switch id={setting.id} defaultChecked={index < 2} />
              </div>
              {index < pushSettings.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
