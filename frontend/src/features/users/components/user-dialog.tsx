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

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
}

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
  onSave: (user: Partial<User>) => void
}

export function UserDialog({ open, onOpenChange, user, onSave }: UserDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'active' as const,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      })
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'user',
        status: 'active',
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      onSave(formData)
      setIsLoading(false)
      onOpenChange(false)
    }, 500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User' : 'Create User'}</DialogTitle>
          <DialogDescription>
            {user ? 'Update user details below.' : 'Add a new user to the system.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'inactive') =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : user ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
