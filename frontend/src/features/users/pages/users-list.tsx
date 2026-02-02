import { useState, useMemo, lazy, Suspense } from 'react'
import { Search, Plus, MoreHorizontal, Pencil, Trash2, UserCheck, UserX } from 'lucide-react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

// Lazy load the dialog
const UserDialog = lazy(() =>
  import('../components/user-dialog').then((m) => ({ default: m.UserDialog }))
)

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  avatar?: string
  createdAt: string
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'manager',
    status: 'active',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: '2024-03-10',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-03-25',
  },
  {
    id: '5',
    name: 'Tom Brown',
    email: 'tom@example.com',
    role: 'manager',
    status: 'active',
    createdAt: '2024-04-01',
  },
]

function DialogFallback() {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center">
      <Skeleton className="h-[400px] w-[425px] rounded-lg" />
    </div>
  )
}

export default function UsersListPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users
    const query = searchQuery.toLowerCase()
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    )
  }, [users, searchQuery])

  const handleCreateUser = () => {
    setSelectedUser(null)
    setDialogOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setDialogOpen(true)
  }

  const handleSaveUser = (userData: Partial<User>) => {
    if (selectedUser) {
      // Update existing user
      setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, ...userData } : u)))
    } else {
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'user',
        status: userData.status || 'active',
        createdAt: new Date().toISOString().split('T')[0],
      }
      setUsers([newUser, ...users])
    }
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId))
  }

  const handleToggleStatus = (user: User) => {
    setUsers(
      users.map((u) =>
        u.id === user.id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
      )
    )
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default'
      case 'manager':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage user accounts and permissions</p>
      </div>

      {/* Filters & Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>User Management</CardTitle>
          <CardDescription>{users.length} total users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={handleCreateUser}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>

          {/* Table */}
          <div className="mt-4 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                              {user.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.status === 'active' ? 'default' : 'secondary'}
                          className="capitalize"
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.createdAt}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                              {user.status === 'active' ? (
                                <>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteUser(user.id)}
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
          <UserDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            user={selectedUser}
            onSave={handleSaveUser}
          />
        </Suspense>
      )}
    </div>
  )
}
