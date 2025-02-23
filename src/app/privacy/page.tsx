'use client'

import { motion } from 'framer-motion'
import { Shield, Eye, Database, Lock, Share2, UserCog, RefreshCw, Mail } from 'lucide-react'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

export default function PrivacyPage() {
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
              <Shield className='w-12 h-12 text-[#14F195]' />
            </div>
            <h1 className='font-display text-4xl sm:text-6xl font-bold bg-gradient-to-r from-[#9945FF] via-[#14F195] to-[#00C2FF] bg-clip-text text-transparent mb-4'>
              Privacy Policy
            </h1>
            <p className='text-[#E6E6E6]/60 text-lg sm:text-xl max-w-2xl mx-auto'>
              We are committed to protecting your privacy and ensuring the security of your information.
            </p>
            <p className='text-[#E6E6E6]/40 text-sm mt-4'>
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </motion.div>

          {/* Content Sections */}
          <div className='space-y-16'>
            <motion.section
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={{ ...fadeIn.transition, delay: 0.1 }}
            >
              <div className='flex items-center gap-3 mb-6'>
                <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-[#9945FF]/10 flex items-center justify-center'>
                  <Eye className='w-5 h-5 text-[#9945FF]' />
                </div>
                <h2 className='text-2xl font-display font-bold text-[#E6E6E6]'>Introduction</h2>
              </div>
              <div className='bg-[#1A1B23]/50 backdrop-blur-sm border border-[#2E2E34] rounded-2xl p-6 sm:p-8'>
                <div className='prose prose-invert max-w-none space-y-4 text-[#E6E6E6]/80'>
                  <p>
                    Welcome to TokenLoom&apos;s Privacy Policy. This Privacy Policy explains how we collect, use,
                    disclose, and safeguard your information when you visit our website tokenloom.io and use our token
                    burning service.
                  </p>
                  <p>
                    By using TokenLoom, you agree to the collection and use of information in accordance with this
                    Privacy Policy.
                  </p>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={{ ...fadeIn.transition, delay: 0.2 }}
            >
              <div className='flex items-center gap-3 mb-6'>
                <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-[#14F195]/10 flex items-center justify-center'>
                  <Database className='w-5 h-5 text-[#14F195]' />
                </div>
                <h2 className='text-2xl font-display font-bold text-[#E6E6E6]'>Information We Collect</h2>
              </div>
              <div className='grid gap-6 sm:grid-cols-2'>
                <div className='bg-[#1A1B23]/50 backdrop-blur-sm border border-[#2E2E34] rounded-2xl p-6 sm:p-8'>
                  <h3 className='text-xl font-display font-semibold text-[#E6E6E6] mb-4'>Automatically Collected</h3>
                  <ul className='space-y-3'>
                    <li className='flex items-center gap-3 text-[#E6E6E6]/80'>
                      <div className='w-1.5 h-1.5 rounded-full bg-[#14F195]' />
                      Public blockchain data
                    </li>
                    <li className='flex items-center gap-3 text-[#E6E6E6]/80'>
                      <div className='w-1.5 h-1.5 rounded-full bg-[#14F195]' />
                      Browser type and version
                    </li>
                    <li className='flex items-center gap-3 text-[#E6E6E6]/80'>
                      <div className='w-1.5 h-1.5 rounded-full bg-[#14F195]' />
                      Operating system
                    </li>
                    <li className='flex items-center gap-3 text-[#E6E6E6]/80'>
                      <div className='w-1.5 h-1.5 rounded-full bg-[#14F195]' />
                      Referral source
                    </li>
                    <li className='flex items-center gap-3 text-[#E6E6E6]/80'>
                      <div className='w-1.5 h-1.5 rounded-full bg-[#14F195]' />
                      Visit analytics
                    </li>
                  </ul>
                </div>
                <div className='bg-[#1A1B23]/50 backdrop-blur-sm border border-[#2E2E34] rounded-2xl p-6 sm:p-8'>
                  <h3 className='text-xl font-display font-semibold text-[#E6E6E6] mb-4'>User Provided</h3>
                  <ul className='space-y-3'>
                    <li className='flex items-center gap-3 text-[#E6E6E6]/80'>
                      <div className='w-1.5 h-1.5 rounded-full bg-[#9945FF]' />
                      Wallet addresses
                    </li>
                    <li className='flex items-center gap-3 text-[#E6E6E6]/80'>
                      <div className='w-1.5 h-1.5 rounded-full bg-[#9945FF]' />
                      Transaction details
                    </li>
                    <li className='flex items-center gap-3 text-[#E6E6E6]/80'>
                      <div className='w-1.5 h-1.5 rounded-full bg-[#9945FF]' />
                      Communication preferences
                    </li>
                    <li className='flex items-center gap-3 text-[#E6E6E6]/80'>
                      <div className='w-1.5 h-1.5 rounded-full bg-[#9945FF]' />
                      Support requests
                    </li>
                  </ul>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={{ ...fadeIn.transition, delay: 0.3 }}
            >
              <div className='flex items-center gap-3 mb-6'>
                <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-[#00C2FF]/10 flex items-center justify-center'>
                  <Lock className='w-5 h-5 text-[#00C2FF]' />
                </div>
                <h2 className='text-2xl font-display font-bold text-[#E6E6E6]'>Data Security</h2>
              </div>
              <div className='bg-[#1A1B23]/50 backdrop-blur-sm border border-[#2E2E34] rounded-2xl p-6 sm:p-8'>
                <div className='prose prose-invert max-w-none space-y-4 text-[#E6E6E6]/80'>
                  <p>
                    We implement appropriate security measures to protect your information. However, please note that no
                    method of transmission over the internet or electronic storage is 100% secure.
                  </p>
                  <div className='bg-[#9945FF]/5 border border-[#9945FF]/10 rounded-lg p-4'>
                    <p className='text-[#E6E6E6]/90 font-medium'>
                      Important: Your wallet&apos;s private keys and seed phrases should never be shared with our
                      platform or any third party.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={{ ...fadeIn.transition, delay: 0.4 }}
            >
              <div className='flex items-center gap-3 mb-6'>
                <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-[#14F195]/10 flex items-center justify-center'>
                  <Share2 className='w-5 h-5 text-[#14F195]' />
                </div>
                <h2 className='text-2xl font-display font-bold text-[#E6E6E6]'>Third-Party Services</h2>
              </div>
              <div className='bg-[#1A1B23]/50 backdrop-blur-sm border border-[#2E2E34] rounded-2xl p-6 sm:p-8'>
                <div className='grid gap-6 sm:grid-cols-3'>
                  <div className='p-4 rounded-xl bg-[#1E1E24]/50 border border-[#2E2E34]'>
                    <h3 className='font-display font-semibold text-[#E6E6E6] mb-2'>Solana Infrastructure</h3>
                    <p className='text-sm text-[#E6E6E6]/60'>
                      Blockchain network and related services for transaction processing
                    </p>
                  </div>
                  <div className='p-4 rounded-xl bg-[#1E1E24]/50 border border-[#2E2E34]'>
                    <h3 className='font-display font-semibold text-[#E6E6E6] mb-2'>Wallet Providers</h3>
                    <p className='text-sm text-[#E6E6E6]/60'>Phantom, Solflare, and other Solana wallet services</p>
                  </div>
                  <div className='p-4 rounded-xl bg-[#1E1E24]/50 border border-[#2E2E34]'>
                    <h3 className='font-display font-semibold text-[#E6E6E6] mb-2'>Analytics Services</h3>
                    <p className='text-sm text-[#E6E6E6]/60'>Platform monitoring and performance tracking tools</p>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={{ ...fadeIn.transition, delay: 0.5 }}
            >
              <div className='flex items-center gap-3 mb-6'>
                <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-[#9945FF]/10 flex items-center justify-center'>
                  <UserCog className='w-5 h-5 text-[#9945FF]' />
                </div>
                <h2 className='text-2xl font-display font-bold text-[#E6E6E6]'>Your Rights</h2>
              </div>
              <div className='bg-[#1A1B23]/50 backdrop-blur-sm border border-[#2E2E34] rounded-2xl p-6 sm:p-8'>
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  {[
                    'Access your personal information',
                    'Correct inaccurate data',
                    'Request deletion of your data',
                    'Object to data processing',
                    'Data portability',
                    'Withdraw consent'
                  ].map((right, index) => (
                    <div key={index} className='flex items-center gap-3 text-[#E6E6E6]/80'>
                      <div className='w-1.5 h-1.5 rounded-full bg-[#9945FF]' />
                      {right}
                    </div>
                  ))}
                </div>
                <div className='mt-6 pt-6 border-t border-[#2E2E34]'>
                  <p className='text-[#E6E6E6]/60'>
                    Contact us at{' '}
                    <a
                      href='mailto:privacy@tokenloom.io'
                      className='text-[#14F195] hover:text-[#14F195]/80 transition-colors'
                    >
                      privacy@tokenloom.io
                    </a>{' '}
                    to exercise these rights.
                  </p>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={{ ...fadeIn.transition, delay: 0.6 }}
            >
              <div className='flex items-center gap-3 mb-6'>
                <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-[#00C2FF]/10 flex items-center justify-center'>
                  <RefreshCw className='w-5 h-5 text-[#00C2FF]' />
                </div>
                <h2 className='text-2xl font-display font-bold text-[#E6E6E6]'>Policy Updates</h2>
              </div>
              <div className='bg-[#1A1B23]/50 backdrop-blur-sm border border-[#2E2E34] rounded-2xl p-6 sm:p-8'>
                <div className='prose prose-invert max-w-none space-y-4 text-[#E6E6E6]/80'>
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting
                    the new Privacy Policy on this page and updating the &ldquo;Last updated&rdquo; date.
                  </p>
                  <p>
                    Your continued use of the platform after such modifications constitutes your acknowledgment of the
                    modified Privacy Policy.
                  </p>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={{ ...fadeIn.transition, delay: 0.7 }}
            >
              <div className='flex items-center gap-3 mb-6'>
                <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-[#14F195]/10 flex items-center justify-center'>
                  <Mail className='w-5 h-5 text-[#14F195]' />
                </div>
                <h2 className='text-2xl font-display font-bold text-[#E6E6E6]'>Contact Us</h2>
              </div>
              <div className='bg-[#1A1B23]/50 backdrop-blur-sm border border-[#2E2E34] rounded-2xl p-6 sm:p-8'>
                <div className='grid gap-6 sm:grid-cols-3'>
                  <a
                    href='mailto:privacy@tokenloom.io'
                    className='group p-4 rounded-xl bg-[#1E1E24]/50 border border-[#2E2E34] hover:border-[#14F195]/30 transition-colors'
                  >
                    <h3 className='font-display font-semibold text-[#E6E6E6] group-hover:text-[#14F195] transition-colors mb-2'>
                      Email
                    </h3>
                    <p className='text-sm text-[#E6E6E6]/60'>privacy@tokenloom.io</p>
                  </a>
                  <a
                    href='https://twitter.com/tokenloom'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='group p-4 rounded-xl bg-[#1E1E24]/50 border border-[#2E2E34] hover:border-[#9945FF]/30 transition-colors'
                  >
                    <h3 className='font-display font-semibold text-[#E6E6E6] group-hover:text-[#9945FF] transition-colors mb-2'>
                      Twitter
                    </h3>
                    <p className='text-sm text-[#E6E6E6]/60'>@tokenloom</p>
                  </a>
                  <a
                    href='https://github.com/Token-Loom/token-loom-app'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='group p-4 rounded-xl bg-[#1E1E24]/50 border border-[#2E2E34] hover:border-[#00C2FF]/30 transition-colors'
                  >
                    <h3 className='font-display font-semibold text-[#E6E6E6] group-hover:text-[#00C2FF] transition-colors mb-2'>
                      GitHub
                    </h3>
                    <p className='text-sm text-[#E6E6E6]/60'>github.com/Token-Loom/token-loom-app</p>
                  </a>
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
