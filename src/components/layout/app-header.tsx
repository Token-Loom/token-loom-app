import Link from 'next/link'

export function AppHeader() {
  return (
    <header className='border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-14 max-w-7xl items-center'>
        <div className='mr-4 flex'>
          <Link href='/' className='mr-6 flex items-center space-x-2'>
            <span className='font-display text-lg font-bold'>Solana Burn</span>
          </Link>
        </div>
        <nav className='flex items-center space-x-6 text-sm font-medium'>
          <Link href='/app' className='transition-colors hover:text-foreground/80 text-foreground/60'>
            Dashboard
          </Link>
          <Link href='/app/history' className='transition-colors hover:text-foreground/80 text-foreground/60'>
            History
          </Link>
        </nav>
        <div className='ml-auto flex items-center space-x-4'>{/* Wallet connect button will go here */}</div>
      </div>
    </header>
  )
}
