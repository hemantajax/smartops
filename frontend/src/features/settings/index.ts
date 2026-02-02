import { lazy } from 'react'

export const SettingsPage = lazy(() => import('./pages/settings'))
export const ProfileSettings = lazy(() => import('./pages/profile'))
export const AppearanceSettings = lazy(() => import('./pages/appearance'))
export const NotificationSettings = lazy(() => import('./pages/notifications'))
export const SecuritySettings = lazy(() => import('./pages/security'))
