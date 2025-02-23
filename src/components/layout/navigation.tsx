'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { WalletButton } from '@/components/solana/wallet-button'
import { useWallet } from '@solana/wallet-adapter-react'
import { isAdminWallet } from '@/lib/solana/admin-config'
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
    { href: '/roadmap', label: 'Roadmap' },
    ...(isAdmin ? [{ href: '/admin', label: 'Admin' }] : [])
  ]

  return (
    <nav className='fixed top-0 z-50 w-full border-b border-[#1E1E24] bg-[#13141F]/95 backdrop-blur supports-[backdrop-filter]:bg-[#13141F]/60'>
      <div className='container flex h-16 items-center justify-between'>
        <div className='flex items-center gap-6'>
          <Link href='/' className='flex items-center gap-2'>
            <Image src='/logo.svg' alt='Logo' width={44} height={44} />
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center gap-8 ml-2'>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-[#9945FF]',
                  pathname === link.href ? 'text-[#9945FF]' : 'text-[#E6E6E6]/60'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <WalletButton />

          {/* Mobile Menu Button */}
          <button className='md:hidden' onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label='Toggle menu'>
            {isMobileMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className='md:hidden border-t border-[#1E1E24] bg-[#13141F]'>
          <div className='container py-4'>
            <div className='flex flex-col gap-4'>
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-[#9945FF]',
                    pathname === link.href ? 'text-[#9945FF]' : 'text-[#E6E6E6]/60'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
