import { Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout'
import { PageLoader } from '@/components/common'

// Auth pages (lazy)
import { LoginPage, RegisterPage, ForgotPasswordPage } from '@/features/auth'

// Protected pages (lazy)
import { DashboardPage } from '@/features/dashboard'
import { UsersListPage } from '@/features/users'
import { OrdersListPage } from '@/features/business'
import { AIAssistantPage } from '@/features/ai-assistant'
import {
  SettingsPage,
  ProfileSettings,
  AppearanceSettings,
  NotificationSettings,
  SecuritySettings,
} from '@/features/settings'

// Suspense wrapper for lazy components
const LazyPage = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
)

export const router = createBrowserRouter([
  // Public routes (Auth)
  {
    path: '/login',
    element: (
      <LazyPage>
        <LoginPage />
      </LazyPage>
    ),
  },
  {
    path: '/register',
    element: (
      <LazyPage>
        <RegisterPage />
      </LazyPage>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <LazyPage>
        <ForgotPasswordPage />
      </LazyPage>
    ),
  },

  // Protected routes (with AppShell layout)
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <LazyPage>
            <DashboardPage />
          </LazyPage>
        ),
      },
      {
        path: 'users',
        element: (
          <LazyPage>
            <UsersListPage />
          </LazyPage>
        ),
      },
      {
        path: 'orders',
        element: (
          <LazyPage>
            <OrdersListPage />
          </LazyPage>
        ),
      },
      {
        path: 'ai-assistant',
        element: (
          <LazyPage>
            <AIAssistantPage />
          </LazyPage>
        ),
      },
      {
        path: 'settings',
        element: (
          <LazyPage>
            <SettingsPage />
          </LazyPage>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/settings/profile" replace />,
          },
          {
            path: 'profile',
            element: (
              <LazyPage>
                <ProfileSettings />
              </LazyPage>
            ),
          },
          {
            path: 'appearance',
            element: (
              <LazyPage>
                <AppearanceSettings />
              </LazyPage>
            ),
          },
          {
            path: 'notifications',
            element: (
              <LazyPage>
                <NotificationSettings />
              </LazyPage>
            ),
          },
          {
            path: 'security',
            element: (
              <LazyPage>
                <SecuritySettings />
              </LazyPage>
            ),
          },
        ],
      },
    ],
  },

  // Catch all - redirect to dashboard
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
])
