'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const faqs = [
  {
    question: 'What types of tokens can I burn?',
    answer:
      'You can burn both regular Solana tokens (SPL tokens) and LP tokens from major DEXes like Raydium and Orca. Our platform supports any valid SPL token in your wallet.'
  },
  {
    question: 'When will controlled burning be available?',
    answer:
      'Controlled burning, which allows you to schedule token burns over time, is coming soon! This feature will work for both regular and LP tokens, helping you manage token supply reduction strategically. Stay tuned for updates.'
  },
  {
    question: 'Is burning tokens safe?',
    answer:
      'Yes, our platform implements multiple security measures including transaction verification, secure burn addresses, and real-time status monitoring. All burns are verifiable on-chain and irreversible.'
  },
  {
    question: 'What are the fees for burning tokens?',
    answer:
      'We charge a small platform fee (0.1 SOL for instant burns) plus standard Solana network fees. The fees are the same for both regular and LP token burns.'
  },
  {
    question: 'How do I verify my burns?',
    answer:
      'All burns are recorded on the Solana blockchain and can be verified through our dashboard or any Solana explorer. We provide transaction signatures and detailed burn history for both regular and LP token burns.'
  }
]

export function FAQ() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <section className='pb-[100px] sm:pb-[200px] mt-[140px] sm:mt-[240px]'>
      <div className='container relative'>
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className='mx-auto max-w-4xl'
        >
          <div className='text-center'>
            <h2 className='font-display mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold tracking-tight text-[#E6E6E6] md:text-4xl'>
              Frequently Asked Questions
            </h2>
            <p className='text-base max-w-2xl mx-auto sm:text-lg text-[#E6E6E6]/60'>
              Common questions about our token burning platform and how it works.
            </p>
          </div>

          <div className='mx-auto mt-6 sm:mt-10'>
            <Accordion type='single' collapsible className='w-full space-y-4'>
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className='border border-white/5 bg-[#1A1B23] rounded-lg overflow-hidden transition-all duration-300 hover:border-white/10'
                  >
                    <AccordionTrigger className='text-left text-sm sm:text-base text-[#E6E6E6] px-4 py-3 hover:no-underline hover:bg-white/[0.02]'>
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className='text-sm text-[#A3A3A3] px-4 pb-3'>{faq.answer}</AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
