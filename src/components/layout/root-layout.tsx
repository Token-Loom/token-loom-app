import { cn } from '@/lib/utils'
import { Navigation } from './navigation'
import { Footer } from './footer'

interface RootLayoutProps {
  children: React.ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-[#13141F] text-[#E6E6E6]', 'font-sans antialiased')}>
      <Navigation />
      <main className='flex min-h-screen flex-col pt-16'>{children}</main>
      <Footer />
    </div>
  )
}
