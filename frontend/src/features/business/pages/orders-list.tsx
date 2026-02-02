import { useState, useMemo, lazy, Suspense } from 'react'
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Filter,
  DollarSign,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

// Lazy load the dialog
const OrderDialog = lazy(() =>
  import('../components/order-dialog').then((m) => ({ default: m.OrderDialog }))
)

interface Order {
  id: string
  title: string
  customer: string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
}

// Mock data
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    title: 'Website Redesign',
    customer: 'Acme Corp',
    amount: 15000,
    status: 'processing',
    priority: 'high',
    createdAt: '2024-04-01',
  },
  {
    id: 'ORD-002',
    title: 'Mobile App Development',
    customer: 'TechStart Inc',
    amount: 45000,
    status: 'pending',
    priority: 'high',
    createdAt: '2024-04-02',
  },
  {
    id: 'ORD-003',
    title: 'SEO Optimization',
    customer: 'Green Foods',
    amount: 3500,
    status: 'completed',
    priority: 'medium',
    createdAt: '2024-03-28',
  },
  {
    id: 'ORD-004',
    title: 'Cloud Migration',
    customer: 'DataFlow Systems',
    amount: 28000,
    status: 'processing',
    priority: 'medium',
    createdAt: '2024-03-25',
  },
  {
    id: 'ORD-005',
    title: 'Security Audit',
    customer: 'SecureBank',
    amount: 12000,
    status: 'completed',
    priority: 'high',
    createdAt: '2024-03-20',
  },
  {
    id: 'ORD-006',
    title: 'UI/UX Consultation',
    customer: 'StartupX',
    amount: 5000,
    status: 'cancelled',
    priority: 'low',
    createdAt: '2024-03-15',
  },
]

function DialogFallback() {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center">
      <Skeleton className="h-[450px] w-[500px] rounded-lg" />
    </div>
  )
}

export default function OrdersListPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const filteredOrders = useMemo(() => {
    let result = orders

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (order) =>
          order.title.toLowerCase().includes(query) ||
          order.customer.toLowerCase().includes(query) ||
          order.id.toLowerCase().includes(query)
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter((order) => order.status === statusFilter)
    }

    return result
  }, [orders, searchQuery, statusFilter])

  const stats = useMemo(() => {
    const total = orders.reduce((sum, o) => sum + o.amount, 0)
    const pending = orders.filter((o) => o.status === 'pending').length
    const processing = orders.filter((o) => o.status === 'processing').length
    const completed = orders.filter((o) => o.status === 'completed').length
    return { total, pending, processing, completed }
  }, [orders])

  const handleCreateOrder = () => {
    setSelectedOrder(null)
    setDialogOpen(true)
  }

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order)
    setDialogOpen(true)
  }

  const handleSaveOrder = (orderData: Partial<Order>) => {
    if (selectedOrder) {
      setOrders(orders.map((o) => (o.id === selectedOrder.id ? { ...o, ...orderData } : o)))
    } else {
      const newOrder: Order = {
        id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
        title: orderData.title || '',
        customer: orderData.customer || '',
        amount: orderData.amount || 0,
        status: orderData.status || 'pending',
        priority: orderData.priority || 'medium',
        createdAt: new Date().toISOString().split('T')[0],
      }
      setOrders([newOrder, ...orders])
    }
  }

  const handleDeleteOrder = (orderId: string) => {
    setOrders(orders.filter((o) => o.id !== orderId))
  }

  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'default'
      case 'processing':
        return 'secondary'
      case 'pending':
        return 'outline'
      case 'cancelled':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getPriorityBadgeVariant = (priority: Order['priority']) => {
    switch (priority) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'secondary'
      case 'low':
        return 'outline'
      default:
        return 'outline'
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">Manage orders and track business operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${stats.total.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <Badge variant="outline">{stats.pending} orders</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold">{stats.processing}</p>
              </div>
              <Badge variant="secondary">{stats.processing} orders</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <Badge>{stats.completed} orders</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Order Management</CardTitle>
          <CardDescription>{filteredOrders.length} orders found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCreateOrder}>
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </div>

          {/* Table */}
          <div className="mt-4 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">{order.id}</TableCell>
                      <TableCell className="font-medium">{order.title}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>${order.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getPriorityBadgeVariant(order.priority)}
                          className="capitalize"
                        >
                          {order.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{order.createdAt}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditOrder(order)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteOrder(order.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Lazy loaded dialog */}
      {dialogOpen && (
        <Suspense fallback={<DialogFallback />}>
          <OrderDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            order={selectedOrder}
            onSave={handleSaveOrder}
          />
        </Suspense>
      )}
    </div>
  )
}
