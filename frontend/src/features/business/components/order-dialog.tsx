import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Order {
  id: string
  title: string
  customer: string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
}

interface OrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order?: Order | null
  onSave: (order: Partial<Order>) => void
}

export function OrderDialog({ open, onOpenChange, order, onSave }: OrderDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    customer: '',
    amount: 0,
    status: 'pending' as const,
    priority: 'medium' as const,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (order) {
      setFormData({
        title: order.title,
        customer: order.customer,
        amount: order.amount,
        status: order.status,
        priority: order.priority,
      })
    } else {
      setFormData({
        title: '',
        customer: '',
        amount: 0,
        status: 'pending',
        priority: 'medium',
      })
    }
  }, [order])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      onSave(formData)
      setIsLoading(false)
      onOpenChange(false)
    }, 500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{order ? 'Edit Order' : 'Create Order'}</DialogTitle>
          <DialogDescription>
            {order ? 'Update order details below.' : 'Add a new order to the system.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Order Title
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Website Redesign Project"
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="customer" className="text-sm font-medium">
                Customer
              </label>
              <Input
                id="customer"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                placeholder="Acme Corp"
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Amount ($)
              </label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                placeholder="1000"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value: typeof formData.status) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: typeof formData.priority) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : order ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
