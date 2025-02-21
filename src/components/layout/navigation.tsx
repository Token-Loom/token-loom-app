'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { WalletButton } from '@/components/solana/wallet-button'
import { useWallet } from '@solana/wallet-adapter-react'
import { isAdminWallet } from '@/lib/solana/admin'

export function Navigation() {
  const pathname = usePathname()
  const { publicKey } = useWallet()
  const isAdmin = isAdminWallet(publicKey)

  return (
    <nav className='fixed top-0 z-50 w-full border-b border-[#1E1E24] bg-[#13141F]/95 backdrop-blur supports-[backdrop-filter]:bg-[#13141F]/60'>
      <div className='container flex h-16 items-center px-4'>
        <div className='mr-4 flex'>
          <Link href='/' className='flex items-center space-x-2'>
            <Image src='/logo.svg' alt='ControlledBurn Logo' width={50} height={50} priority />
          </Link>
        </div>
        <div className='flex flex-1 items-center justify-between space-x-4 ml-4'>
          <nav className='flex items-center space-x-6'>
            <Link
              href='/'
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === '/' ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              Home
            </Link>
            <Link
              href='/burn'
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === '/burn' ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              Burn Dashboard
            </Link>
            {isAdmin && (
              <Link
                href='/admin'
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === '/admin' ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                Admin
              </Link>
            )}
          </nav>
          <div className='flex items-center'>
            <WalletButton />
          </div>
        </div>
      </div>
    </nav>
  )
}
