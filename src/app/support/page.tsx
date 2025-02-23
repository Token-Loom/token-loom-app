'use client'

import { motion } from 'framer-motion'
import { LifeBuoy, Book, MessageSquare, Wallet, AlertTriangle, Zap, Mail, Twitter, Github } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const commonIssues = [
  {
    title: 'Wallet Connection',
    description: 'Issues connecting your Solana wallet or transaction signing problems.',
    icon: Wallet,
    color: '#9945FF',
    solutions: [
      'Ensure your wallet is unlocked',
      'Check if you have the latest wallet version',
      'Try refreshing the page',
      'Make sure you have sufficient SOL for fees'
    ]
  },
  {
    title: 'Transaction Errors',
    description: 'Problems with burn transactions or unexpected errors.',
    icon: AlertTriangle,
    color: '#14F195',
    solutions: [
      'Verify you have sufficient token balance',
      'Check network status on Solana Explorer',
      'Ensure transaction parameters are correct',
      'Wait a few minutes and try again'
    ]
  },
  {
    title: 'Performance Issues',
    description: 'Slow loading times or interface responsiveness problems.',
    icon: Zap,
    color: '#00C2FF',
    solutions: [
      'Clear browser cache and cookies',
      'Check your internet connection',
      'Try a different browser',
      'Disable VPN if using one'
    ]
  }
]

const supportChannels = [
  {
    name: 'Email Support',
    description: 'Get direct assistance from our support team.',
    icon: Mail,
    link: 'mailto:support@tokenloom.io',
    color: '#14F195'
  },
  {
    name: 'Twitter',
    description: 'Follow us for updates and quick responses.',
    icon: Twitter,
    link: 'https://twitter.com/tokenloom',
    color: '#9945FF'
  },
  {
    name: 'GitHub Issues',
    description: 'Report technical issues or suggest features.',
    icon: Github,
    link: 'https://github.com/Token-Loom/token-loom-app/issues',
    color: '#00C2FF'
  }
]

export default function SupportPage() {
  return (
    <main className='min-h-screen bg-[#13141F] relative'>
      {/* Background effects */}
      <div className='fixed inset-0 bg-[linear-gradient(45deg,_#9945FF05_1px,transparent_1px),linear-gradient(-45deg,_#14F19505_1px,transparent_1px)] bg-[size:48px_48px]' />
      <div className='fixed inset-0 bg-gradient-to-b from-[#9945FF]/5 via-transparent to-[#14F195]/5 pointer-events-none' />

      {/* Content */}
      <div className='relative'>
        <div className='container px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-16 sm:py-24'>
          {/* Header */}
          <motion.div
            className='text-center mb-16 sm:mb-24'
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            transition={fadeIn.transition}
          >
            <div className='inline-flex items-center justify-center p-2 rounded-2xl bg-gradient-to-r from-[#9945FF]/10 via-[#14F195]/10 to-[#00C2FF]/10 backdrop-blur-sm mb-6'>
              <LifeBuoy className='w-12 h-12 text-[#14F195]' />
            </div>
            <h1 className='font-display text-4xl sm:text-6xl font-bold bg-gradient-to-r from-[#9945FF] via-[#14F195] to-[#00C2FF] bg-clip-text text-transparent mb-4'>
              Support Center
            </h1>
            <p className='text-[#E6E6E6]/60 text-lg sm:text-xl max-w-2xl mx-auto'>
              Get help with TokenLoom. Find solutions to common issues or contact our support team.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16'
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            transition={{ ...fadeIn.transition, delay: 0.1 }}
          >
            <Link href='/docs' className='group'>
              <Card className='border-[#1E1E24] bg-[#1A1B23]/50 backdrop-blur-sm hover:border-[#9945FF]/30 transition-all duration-300 h-full'>
                <div className='p-6 flex flex-col items-center text-center'>
                  <Book className='w-8 h-8 text-[#9945FF] mb-4' />
                  <h3 className='font-display text-lg font-semibold text-[#E6E6E6] mb-2'>Documentation</h3>
                  <p className='text-sm text-[#E6E6E6]/60'>Browse our comprehensive guides and documentation.</p>
                </div>
              </Card>
            </Link>
            <Link href='/#faq' className='group'>
              <Card className='border-[#1E1E24] bg-[#1A1B23]/50 backdrop-blur-sm hover:border-[#14F195]/30 transition-all duration-300 h-full'>
                <div className='p-6 flex flex-col items-center text-center'>
                  <MessageSquare className='w-8 h-8 text-[#14F195] mb-4' />
                  <h3 className='font-display text-lg font-semibold text-[#E6E6E6] mb-2'>FAQ</h3>
                  <p className='text-sm text-[#E6E6E6]/60'>Find answers to frequently asked questions.</p>
                </div>
              </Card>
            </Link>
            <Link href='https://github.com/Token-Loom/token-loom-app' className='group sm:col-span-2 lg:col-span-1'>
              <Card className='border-[#1E1E24] bg-[#1A1B23]/50 backdrop-blur-sm hover:border-[#00C2FF]/30 transition-all duration-300 h-full'>
                <div className='p-6 flex flex-col items-center text-center'>
                  <Github className='w-8 h-8 text-[#00C2FF] mb-4' />
                  <h3 className='font-display text-lg font-semibold text-[#E6E6E6] mb-2'>GitHub</h3>
                  <p className='text-sm text-[#E6E6E6]/60'>View source code and contribute to the project.</p>
                </div>
              </Card>
            </Link>
          </motion.div>

          {/* Common Issues */}
          <motion.section
            className='mb-16'
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            transition={{ ...fadeIn.transition, delay: 0.2 }}
          >
            <h2 className='text-2xl font-display font-bold text-[#E6E6E6] mb-8'>Common Issues</h2>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {commonIssues.map(issue => {
                const Icon = issue.icon
                return (
                  <Card key={issue.title} className='border-[#1E1E24] bg-[#1A1B23]/50 backdrop-blur-sm overflow-hidden'>
                    <div className='p-6'>
                      <div className='flex items-center gap-3 mb-4'>
                        <div
                          className='flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center'
                          style={{ backgroundColor: `${issue.color}10` }}
                        >
                          <Icon className='w-5 h-5' style={{ color: issue.color }} />
                        </div>
                        <h3 className='font-display text-lg font-semibold text-[#E6E6E6]'>{issue.title}</h3>
                      </div>
                      <p className='text-sm text-[#E6E6E6]/60 mb-4'>{issue.description}</p>
                      <ul className='space-y-2'>
                        {issue.solutions.map((solution, i) => (
                          <li key={i} className='flex items-center gap-2 text-sm text-[#E6E6E6]/80'>
                            <div className='w-1.5 h-1.5 rounded-full' style={{ backgroundColor: issue.color }} />
                            {solution}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                )
              })}
            </div>
          </motion.section>

          {/* Contact Channels */}
          <motion.section
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            transition={{ ...fadeIn.transition, delay: 0.3 }}
          >
            <h2 className='text-2xl font-display font-bold text-[#E6E6E6] mb-8'>Contact Us</h2>
            <div className='grid gap-6 sm:grid-cols-3'>
              {supportChannels.map(channel => {
                const Icon = channel.icon
                return (
                  <a key={channel.name} href={channel.link} target='_blank' rel='noopener noreferrer' className='group'>
                    <Card className='border-[#1E1E24] bg-[#1A1B23]/50 backdrop-blur-sm hover:border-opacity-30 transition-all duration-300 h-full'>
                      <div className='p-6'>
                        <div className='flex items-center gap-3 mb-4'>
                          <div
                            className='flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center'
                            style={{ backgroundColor: `${channel.color}10` }}
                          >
                            <Icon className='w-5 h-5' style={{ color: channel.color }} />
                          </div>
                          <div>
                            <h3 className='font-display text-lg font-semibold text-[#E6E6E6]'>{channel.name}</h3>
                            <p className='text-sm text-[#E6E6E6]/60'>{channel.description}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </a>
                )
              })}
            </div>
          </motion.section>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className='absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#9945FF]/20 to-transparent' />
    </main>
  )
}
