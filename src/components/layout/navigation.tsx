'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { WalletButton } from '@/components/solana/wallet-button'
import { useWallet } from '@solana/wallet-adapter-react'
import { isAdminWallet } from '@/lib/solana/admin'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Navigation() {
  const pathname = usePathname()
  const { publicKey } = useWallet()
  const isAdmin = isAdminWallet(publicKey)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/burn', label: 'Burn Dashboard' },
    ...(isAdmin ? [{ href: '/admin', label: 'Admin' }] : [])
  ]

  return (
    <nav className='fixed top-0 z-50 w-full border-b border-[#1E1E24] bg-[#13141F]/95 backdrop-blur supports-[backdrop-filter]:bg-[#13141F]/60'>
      <div className='container flex h-16 items-center justify-between px-4'>
        <div className='flex items-center'>
          <Link href='/' className='flex items-center'>
            <Image src='/logo.svg' alt='ControlledBurn Logo' width={50} height={50} priority />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center justify-between space-x-4 flex-1 ml-8'>
          <nav className='flex items-center space-x-6'>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className='flex items-center'>
            <WalletButton />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className='flex items-center md:hidden'>
          <WalletButton className='mr-2' />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='p-2 text-[#E6E6E6] hover:text-primary'
          >
            {isMobileMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className='md:hidden bg-[#13141F] border-b border-[#1E1E24]'>
          <div className='container py-4 px-4'>
            <nav className='flex flex-col space-y-4'>
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary py-2',
                    pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </nav>
  )
}
