'use client'

import { motion } from 'framer-motion'
import { Scale, FileText, AlertCircle, Wallet, Gavel, Ban, RefreshCw, Mail } from 'lucide-react'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

export default function TermsPage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

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
              <Scale className='w-12 h-12 text-[#14F195]' />
            </div>
            <h1 className='font-display text-4xl sm:text-6xl font-bold bg-gradient-to-r from-[#9945FF] via-[#14F195] to-[#00C2FF] bg-clip-text text-transparent mb-4'>
              Terms of Service
            </h1>
            <p className='text-[#E6E6E6]/60 text-lg sm:text-xl max-w-2xl mx-auto'>
              Please read these terms carefully before using our platform.
            </p>
            <p className='text-[#E6E6E6]/40 text-sm mt-4'>Last updated: {lastUpdated}</p>
          </motion.div>

          {/* Content Sections */}
          <div className='space-y-16'>
            {/* Agreement */}
            <motion.section
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={{ ...fadeIn.transition, delay: 0.1 }}
            >
              <div className='flex items-center gap-3 mb-6'>
                <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-[#9945FF]/10 flex items-center justify-center'>
                  <FileText className='w-5 h-5 text-[#9945FF]' />
                </div>
                <h2 className='text-2xl font-display font-bold text-[#E6E6E6]'>Agreement to Terms</h2>
              </div>
              <div className='bg-[#1A1B23]/50 backdrop-blur-sm border border-[#2E2E34] rounded-2xl p-6 sm:p-8'>
                <div className='prose prose-invert max-w-none space-y-4 text-[#E6E6E6]/80'>
                  <p>
                    By accessing or using TokenLoom, you agree to be bound by these Terms of Service and all applicable
                    laws and regulations. If you do not agree with any of these terms, you are prohibited from using or
                    accessing this platform.
                  </p>
                  <div className='bg-[#9945FF]/5 border border-[#9945FF]/10 rounded-lg p-4'>
                    <p className='text-[#E6E6E6]/90 font-medium'>
                      Important: These terms constitute a legally binding agreement between you and TokenLoom.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Risks */}
            <motion.section
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={{ ...fadeIn.transition, delay: 0.2 }}
            >
              <div className='flex items-center gap-3 mb-6'>
                <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-[#14F195]/10 flex items-center justify-center'>
                  <AlertCircle className='w-5 h-5 text-[#14F195]' />
                </div>
                <h2 className='text-2xl font-display font-bold text-[#E6E6E6]'>Risk Acknowledgment</h2>
              </div>
              <div className='bg-[#1A1B23]/50 backdrop-blur-sm border border-[#2E2E34] rounded-2xl p-6 sm:p-8'>
                <div className='grid gap-6 sm:grid-cols-2'>
                  <div className='p-4 rounded-xl bg-[#1E1E24]/50 border border-[#2E2E34]'>
                    <h3 className='font-display font-semibold text-[#E6E6E6] mb-2'>Cryptocurrency Risks</h3>
                    <ul className='space-y-3'>
                      <li className='flex items-center gap-3 text-[#E6E6E6]/80'>
                        <div className='w-1.5 h-1.5 rounded-full bg-[#14F195]' />
                        High volatility and price fluctuations
                      </li>
                      <li className='flex items-center gap-3 text-[#E6E6E6]/80'>
                        <div className='w-1.5 h-1.5 rounded-full bg-[#14F195]' />
                        Potential for complete loss
                      </li>
                      <li className='flex items-center gap-3 text-[#E6E6E6]/80'>
                        <div className='w-1.5 h-1.5 rounded-full bg-[#14F195]' />
                        Regulatory uncertainty
                      </li>
                    </ul>
                  </div>
                  <div className='p-4 rounded-xl bg-[#1E1E24]/50 border border-[#2E2E34]'>
                    <h3 className='font-display font-semibold text-[#E6E6E6] mb-2'>Platform Risks</h3>
                    <ul className='space-y-3'>
                      <li className='flex items-center gap-3 text-[#E6E6E6]/80'>
                        <div className='w-1.5 h-1.5 rounded-full bg-[#9945FF]' />
                        Technical failures
                      </li>
                      <li className='flex items-center gap-3 text-[#E6E6E6]/80'>
                        <div className='w-1.5 h-1.5 rounded-full bg-[#9945FF]' />
                        Network congestion
                      </li>
                      <li className='flex items-center gap-3 text-[#E6E6E6]/80'>
                        <div className='w-1.5 h-1.5 rounded-full bg-[#9945FF]' />
                        Smart contract risks
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* User Responsibilities */}
            <motion.section
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={{ ...fadeIn.transition, delay: 0.3 }}
            >
              <div className='flex items-center gap-3 mb-6'>
                <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-[#00C2FF]/10 flex items-center justify-center'>
                  <Wallet className='w-5 h-5 text-[#00C2FF]' />
                </div>
                <h2 className='text-2xl font-display font-bold text-[#E6E6E6]'>User Responsibilities</h2>
              </div>
              <div className='bg-[#1A1B23]/50 backdrop-blur-sm border border-[#2E2E34] rounded-2xl p-6 sm:p-8'>
                <div className='grid gap-6 sm:grid-cols-3'>
                  <div className='p-4 rounded-xl bg-[#1E1E24]/50 border border-[#2E2E34]'>
                    <h3 className='font-display font-semibold text-[#E6E6E6] mb-2'>Account Security</h3>
                    <p className='text-sm text-[#E6E6E6]/60'>Maintain the security of your wallet and private keys</p>
                  </div>
                  <div className='p-4 rounded-xl bg-[#1E1E24]/50 border border-[#2E2E34]'>
                    <h3 className='font-display font-semibold text-[#E6E6E6] mb-2'>Accurate Information</h3>
                    <p className='text-sm text-[#E6E6E6]/60'>
                      Provide truthful and accurate information when using the platform
                    </p>
                  </div>
                  <div className='p-4 rounded-xl bg-[#1E1E24]/50 border border-[#2E2E34]'>
                    <h3 className='font-display font-semibold text-[#E6E6E6] mb-2'>Compliance</h3>
                    <p className='text-sm text-[#E6E6E6]/60'>Comply with all applicable laws and regulations</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Prohibited Activities */}
            <motion.section
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={{ ...fadeIn.transition, delay: 0.4 }}
            >
              <div className='flex items-center gap-3 mb-6'>
                <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-[#9945FF]/10 flex items-center justify-center'>
                  <Ban className='w-5 h-5 text-[#9945FF]' />
                </div>
                <h2 className='text-2xl font-display font-bold text-[#E6E6E6]'>Prohibited Activities</h2>
              </div>
              <div className='bg-[#1A1B23]/50 backdrop-blur-sm border border-[#2E2E34] rounded-2xl p-6 sm:p-8'>
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  {[
                    'Unauthorized access attempts',
                    'Manipulation of platform data',
                    'Fraudulent transactions',
                    'Violation of laws or regulations',
                    'Interference with platform operation',
                    'Distribution of malware'
                  ].map((activity, index) => (
                    <div key={index} className='flex items-center gap-3 text-[#E6E6E6]/80'>
                      <div className='w-1.5 h-1.5 rounded-full bg-[#9945FF]' />
                      {activity}
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Limitation of Liability */}
            <motion.section
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={{ ...fadeIn.transition, delay: 0.5 }}
            >
              <div className='flex items-center gap-3 mb-6'>
                <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-[#14F195]/10 flex items-center justify-center'>
                  <Gavel className='w-5 h-5 text-[#14F195]' />
                </div>
                <h2 className='text-2xl font-display font-bold text-[#E6E6E6]'>Limitation of Liability</h2>
              </div>
              <div className='bg-[#1A1B23]/50 backdrop-blur-sm border border-[#2E2E34] rounded-2xl p-6 sm:p-8'>
                <div className='prose prose-invert max-w-none space-y-4 text-[#E6E6E6]/80'>
                  <p>
                    TokenLoom and its affiliates shall not be liable for any indirect, incidental, special,
                    consequential, or punitive damages, including without limitation, loss of profits, data, use,
                    goodwill, or other intangible losses.
                  </p>
                  <div className='bg-[#14F195]/5 border border-[#14F195]/10 rounded-lg p-4'>
                    <p className='text-[#E6E6E6]/90 font-medium'>
                      We do not guarantee the continuous, uninterrupted, or secure access to our platform.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Changes to Terms */}
            <motion.section
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={{ ...fadeIn.transition, delay: 0.6 }}
            >
              <div className='flex items-center gap-3 mb-6'>
                <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-[#00C2FF]/10 flex items-center justify-center'>
                  <RefreshCw className='w-5 h-5 text-[#00C2FF]' />
                </div>
                <h2 className='text-2xl font-display font-bold text-[#E6E6E6]'>Changes to Terms</h2>
              </div>
              <div className='bg-[#1A1B23]/50 backdrop-blur-sm border border-[#2E2E34] rounded-2xl p-6 sm:p-8'>
                <div className='prose prose-invert max-w-none space-y-4 text-[#E6E6E6]/80'>
                  <p>
                    We reserve the right to modify or replace these terms at any time. We will provide notice of any
                    changes by posting the new Terms of Service on this page and updating the &ldquo;Last updated&rdquo;
                    date.
                  </p>
                  <p>
                    Your continued use of the platform after any such changes constitutes your acceptance of the new
                    Terms of Service.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Contact */}
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
                    href='mailto:legal@tokenloom.io'
                    className='group p-4 rounded-xl bg-[#1E1E24]/50 border border-[#2E2E34] hover:border-[#14F195]/30 transition-colors'
                  >
                    <h3 className='font-display font-semibold text-[#E6E6E6] group-hover:text-[#14F195] transition-colors mb-2'>
                      Email
                    </h3>
                    <p className='text-sm text-[#E6E6E6]/60'>legal@tokenloom.io</p>
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
