'use client'

import { motion } from 'framer-motion'
import { Book, Flame, Wallet, Code2, ArrowRight } from 'lucide-react'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

export default function DocsPage() {
  return (
    <main className='min-h-screen bg-[#13141F] relative'>
      {/* Background effects */}
      <div className='fixed inset-0 bg-[linear-gradient(45deg,_#9945FF05_1px,transparent_1px),linear-gradient(-45deg,_#14F19505_1px,transparent_1px)] bg-[size:48px_48px]' />
      <div className='fixed inset-0 bg-gradient-to-b from-[#9945FF]/5 via-transparent to-[#14F195]/5 pointer-events-none' />

      {/* Content */}
      <div className='relative'>
        <div className='container px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-16 sm:py-24'>
          {/* Header */}
          <motion.div
            className='text-center mb-16 sm:mb-24'
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            transition={fadeIn.transition}
          >
            <div className='inline-flex items-center justify-center p-2 rounded-2xl bg-gradient-to-r from-[#9945FF]/10 via-[#14F195]/10 to-[#00C2FF]/10 backdrop-blur-sm mb-6'>
              <Book className='w-12 h-12 text-[#14F195]' />
            </div>
            <h1 className='font-display text-4xl sm:text-6xl font-bold bg-gradient-to-r from-[#9945FF] via-[#14F195] to-[#00C2FF] bg-clip-text text-transparent mb-4'>
              Documentation
            </h1>
            <p className='text-[#E6E6E6]/60 text-lg sm:text-xl max-w-2xl mx-auto'>
              Learn how to integrate TokenLoom into your project and start burning tokens securely.
            </p>
          </motion.div>

          {/* Documentation Sections */}
          <div className='space-y-16'>
            {/* Getting Started */}
            <motion.section
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={{ ...fadeIn.transition, delay: 0.1 }}
            >
              <div className='flex items-center gap-3 mb-6'>
                <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-[#9945FF]/10 flex items-center justify-center'>
                  <Flame className='w-5 h-5 text-[#9945FF]' />
                </div>
                <h2 className='text-2xl font-display font-bold text-[#E6E6E6]'>Getting Started</h2>
              </div>
              <div className='prose prose-invert max-w-none space-y-6'>
                <p className='text-[#E6E6E6]/80 leading-relaxed'>
                  TokenLoom provides a simple and secure way to burn Solana tokens. You can use our web interface or
                  integrate our SDK into your project.
                </p>
                <div className='bg-[#1A1B23]/50 backdrop-blur-sm border border-[#2E2E34] rounded-2xl p-6 sm:p-8'>
                  <h3 className='text-xl font-display font-bold text-[#E6E6E6] mb-4'>Prerequisites</h3>
                  <ul className='space-y-3'>
                    <li className='flex items-center gap-3 text-[#E6E6E6]/80'>
                      <div className='w-1.5 h-1.5 rounded-full bg-[#9945FF]' />
                      Solana wallet (Phantom, Solflare, etc.)
                    </li>
                    <li className='flex items-center gap-3 text-[#E6E6E6]/80'>
                      <div className='w-1.5 h-1.5 rounded-full bg-[#9945FF]' />
                      SPL tokens to burn
                    </li>
                    <li className='flex items-center gap-3 text-[#E6E6E6]/80'>
                      <div className='w-1.5 h-1.5 rounded-full bg-[#9945FF]' />
                      SOL for transaction fees
                    </li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Web Interface */}
            <motion.section
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={{ ...fadeIn.transition, delay: 0.2 }}
            >
              <div className='flex items-center gap-3 mb-6'>
                <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-[#14F195]/10 flex items-center justify-center'>
                  <Wallet className='w-5 h-5 text-[#14F195]' />
                </div>
                <h2 className='text-2xl font-display font-bold text-[#E6E6E6]'>Web Interface</h2>
              </div>
              <div className='prose prose-invert max-w-none space-y-6'>
                <p className='text-[#E6E6E6]/80 leading-relaxed'>
                  The easiest way to burn tokens is through our web interface. Follow these steps:
                </p>
                <div className='space-y-4'>
                  <div className='flex items-start gap-4 p-4 rounded-lg bg-[#1A1B23]/50 border border-[#2E2E34]'>
                    <div className='flex-shrink-0 w-6 h-6 rounded-full bg-[#14F195]/10 flex items-center justify-center text-sm font-medium text-[#14F195]'>
                      1
                    </div>
                    <div>
                      <h4 className='font-display font-semibold text-[#E6E6E6] mb-1'>Connect Your Wallet</h4>
                      <p className='text-sm text-[#E6E6E6]/60'>
                        Click the &ldquo;Connect Wallet&rdquo; button and select your preferred Solana wallet.
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-4 p-4 rounded-lg bg-[#1A1B23]/50 border border-[#2E2E34]'>
                    <div className='flex-shrink-0 w-6 h-6 rounded-full bg-[#14F195]/10 flex items-center justify-center text-sm font-medium text-[#14F195]'>
                      2
                    </div>
                    <div>
                      <h4 className='font-display font-semibold text-[#E6E6E6] mb-1'>Select Token</h4>
                      <p className='text-sm text-[#E6E6E6]/60'>Choose the token you want to burn from your wallet.</p>
                    </div>
                  </div>
                  <div className='flex items-start gap-4 p-4 rounded-lg bg-[#1A1B23]/50 border border-[#2E2E34]'>
                    <div className='flex-shrink-0 w-6 h-6 rounded-full bg-[#14F195]/10 flex items-center justify-center text-sm font-medium text-[#14F195]'>
                      3
                    </div>
                    <div>
                      <h4 className='font-display font-semibold text-[#E6E6E6] mb-1'>Enter Amount</h4>
                      <p className='text-sm text-[#E6E6E6]/60'>
                        Specify the amount of tokens you want to burn. Double-check the amount as this action cannot be
                        undone.
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-4 p-4 rounded-lg bg-[#1A1B23]/50 border border-[#2E2E34]'>
                    <div className='flex-shrink-0 w-6 h-6 rounded-full bg-[#14F195]/10 flex items-center justify-center text-sm font-medium text-[#14F195]'>
                      4
                    </div>
                    <div>
                      <h4 className='font-display font-semibold text-[#E6E6E6] mb-1'>Confirm Transaction</h4>
                      <p className='text-sm text-[#E6E6E6]/60'>
                        Review the transaction details and approve it in your wallet.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* SDK Integration */}
            <motion.section
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={{ ...fadeIn.transition, delay: 0.3 }}
            >
              <div className='flex items-center gap-3 mb-6'>
                <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-[#00C2FF]/10 flex items-center justify-center'>
                  <Code2 className='w-5 h-5 text-[#00C2FF]' />
                </div>
                <h2 className='text-2xl font-display font-bold text-[#E6E6E6]'>SDK Integration</h2>
              </div>
              <div className='prose prose-invert max-w-none space-y-6'>
                <div className='bg-[#9945FF]/5 border border-[#9945FF]/10 rounded-lg p-4'>
                  <p className='text-[#E6E6E6]/90 font-medium flex items-center gap-2'>
                    <ArrowRight className='w-4 h-4 text-[#9945FF]' />
                    Check out our{' '}
                    <a
                      href='https://github.com/Token-Loom/token-loom-app'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[#9945FF] hover:text-[#9945FF]/80 transition-colors'
                    >
                      GitHub repository
                    </a>{' '}
                    for more information
                  </p>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className='absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#9945FF]/20 to-transparent' />
    </main>
  )
}
