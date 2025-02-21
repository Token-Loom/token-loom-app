import { ReactNode } from 'react'
import { AppHeader } from './app-header'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className='min-h-screen bg-background'>
      <AppHeader />
      <main className='container mx-auto px-4 py-6'>{children}</main>
    </div>
  )
}
