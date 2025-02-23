'use client'

import { Github, Twitter } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion as m } from 'framer-motion'

export function Footer() {
  return (
    <footer className='relative border-t border-[#1E1E24] bg-[#13141F]/95 backdrop-blur supports-[backdrop-filter]:bg-[#13141F]/60'>
      {/* Background effects */}
      <div className='absolute inset-0 bg-[linear-gradient(45deg,_#9945FF05_1px,transparent_1px),linear-gradient(-45deg,_#14F19505_1px,transparent_1px)] bg-[size:24px_24px]' />
      <div className='absolute inset-0 bg-gradient-to-t from-[#13141F] via-transparent to-transparent' />

      {/* Content */}
      <div className='relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-16 lg:grid-cols-4 lg:gap-24'>
          {/* About Section */}
          <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className='flex items-center gap-2 mb-6'>
              <Image src='/logo.svg' alt='Logo' width={32} height={32} priority />
            </div>
            <div className='flex flex-col gap-2'>
              <h3 className='font-semibold'>About TokenLoom</h3>
              <p className='text-sm text-zinc-500 dark:text-zinc-400'>
                TokenLoom is a secure and intuitive token burning service for Solana-based tokens. Schedule controlled
                burns, monitor transactions, and manage your token supply efficiently.
              </p>
            </div>
          </m.div>

          {/* Quick Links */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className='text-lg font-display font-bold bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent mb-6'>
              Quick Links
            </h3>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/burn'
                  className='text-sm text-[#E6E6E6]/60 hover:text-[#9945FF] transition-colors duration-200'
                >
                  Burn Tokens
                </Link>
              </li>
              <li>
                <Link
                  href='/roadmap'
                  className='text-sm text-[#E6E6E6]/60 hover:text-[#9945FF] transition-colors duration-200'
                >
                  Roadmap
                </Link>
              </li>
              <li>
                <Link
                  href='/#how-it-works'
                  className='text-sm text-[#E6E6E6]/60 hover:text-[#9945FF] transition-colors duration-200'
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href='/#faq'
                  className='text-sm text-[#E6E6E6]/60 hover:text-[#9945FF] transition-colors duration-200'
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </m.div>

          {/* Resources */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className='text-lg font-display font-bold bg-gradient-to-r from-[#14F195] to-[#00C2FF] bg-clip-text text-transparent mb-6'>
              Resources
            </h3>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/docs'
                  className='text-sm text-[#E6E6E6]/60 hover:text-[#14F195] transition-colors duration-200'
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href='/terms'
                  className='text-sm text-[#E6E6E6]/60 hover:text-[#14F195] transition-colors duration-200'
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href='/privacy'
                  className='text-sm text-[#E6E6E6]/60 hover:text-[#14F195] transition-colors duration-200'
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </m.div>

          {/* Social Links */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className='text-lg font-display font-bold bg-gradient-to-r from-[#00C2FF] to-[#9945FF] bg-clip-text text-transparent mb-6'>
              Connect
            </h3>
            <div className='flex gap-4'>
              <a
                href='https://twitter.com/tokenloom'
                target='_blank'
                rel='noopener noreferrer'
                className='group relative p-2'
              >
                <div className='absolute -inset-2 rounded-full bg-[#9945FF]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                <Twitter className='h-5 w-5 text-[#E6E6E6]/60 group-hover:text-[#9945FF] transition-colors duration-200' />
                <span className='sr-only'>Twitter</span>
              </a>
              <a
                href='https://github.com/Token-Loom/token-loom-app'
                target='_blank'
                rel='noopener noreferrer'
                className='group relative p-2'
              >
                <div className='absolute -inset-2 rounded-full bg-[#14F195]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                <Github className='h-5 w-5 text-[#E6E6E6]/60 group-hover:text-[#14F195] transition-colors duration-200' />
                <span className='sr-only'>GitHub</span>
              </a>
            </div>
          </m.div>
        </div>

        {/* Copyright */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className='mt-16 pt-8 border-t border-[#1E1E24]'
        >
          <div className='flex flex-col gap-2'>
            <h3 className='font-semibold'>Legal</h3>
            <p className='text-sm text-zinc-500 dark:text-zinc-400'>
              © {new Date().getFullYear()} TokenLoom. All rights reserved.
            </p>
          </div>
        </m.div>

        {/* Animated border effect */}
        <div className='absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#9945FF]/20 to-transparent animate-shimmer' />
      </div>
    </footer>
  )
}
