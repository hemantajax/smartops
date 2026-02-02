import {
  Users,
  FileText,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const stats = [
  {
    title: 'Total Users',
    value: '2,847',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    description: 'from last month',
  },
  {
    title: 'Active Orders',
    value: '1,234',
    change: '+8.2%',
    trend: 'up',
    icon: FileText,
    description: 'from last month',
  },
  {
    title: 'Revenue',
    value: '$45,231',
    change: '+20.1%',
    trend: 'up',
    icon: TrendingUp,
    description: 'from last month',
  },
  {
    title: 'Active Sessions',
    value: '573',
    change: '-4.5%',
    trend: 'down',
    icon: Activity,
    description: 'from last hour',
  },
]

const recentActivity = [
  { id: 1, user: 'John Doe', action: 'Created new order', time: '2 min ago' },
  { id: 2, user: 'Jane Smith', action: 'Updated profile', time: '5 min ago' },
  { id: 3, user: 'Mike Johnson', action: 'Completed order #1234', time: '12 min ago' },
  { id: 4, user: 'Sarah Wilson', action: 'Added new document', time: '25 min ago' },
  { id: 5, user: 'Tom Brown', action: 'Sent message to AI', time: '32 min ago' },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your business.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                )}
                <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span>
                <span className="ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart Placeholder */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>Revenue and orders for the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center rounded-lg border border-dashed">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="mx-auto h-12 w-12 mb-2 opacity-50" />
                <p>Chart will be rendered here</p>
                <p className="text-sm">Connect to backend for real data</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <span className="text-xs font-medium">
                      {activity.user
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View all activity
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
