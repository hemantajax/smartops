import { lazy } from 'react'

export const LoginPage = lazy(() => import('./pages/login'))
export const RegisterPage = lazy(() => import('./pages/register'))
export const ForgotPasswordPage = lazy(() => import('./pages/forgot-password'))
