import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const faqs = [
  {
    question: 'What types of tokens can I burn?',
    answer:
      'You can burn both regular Solana tokens (SPL tokens) and LP tokens from major DEXes like Raydium and Orca. Our platform supports any valid SPL token in your wallet.'
  },
  {
    question: 'How does LP token burning work?',
    answer:
      'LP token burning permanently removes your liquidity pool tokens from circulation. This is useful for reducing LP token supply or exiting a liquidity position permanently. The process is similar to regular token burns but includes additional verification of the LP token pair.'
  },
  {
    question: 'What is controlled burning?',
    answer:
      'Controlled burning allows you to schedule token burns over time instead of burning them all at once. This feature works for both regular and LP tokens, helping you manage token supply reduction strategically.'
  },
  {
    question: 'Is burning tokens safe?',
    answer:
      'Yes, our platform implements multiple security measures including transaction verification, secure burn addresses, and real-time status monitoring. All burns are verifiable on-chain and irreversible.'
  },
  {
    question: 'What are the fees for burning tokens?',
    answer:
      'We charge a small platform fee (0.1 SOL for instant burns, 0.2 SOL for controlled burns) plus standard Solana network fees. The fees are the same for both regular and LP token burns.'
  },
  {
    question: 'How do I verify my burns?',
    answer:
      'All burns are recorded on the Solana blockchain and can be verified through our dashboard or any Solana explorer. We provide transaction signatures and detailed burn history for both regular and LP token burns.'
  }
]

export function FAQ() {
  return (
    <section className='relative bg-[#13141F] py-12 sm:py-24'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00C2FF]/10 via-[#14F195]/5 to-transparent opacity-30' />
      <div className='absolute inset-0 bg-[linear-gradient(to_right,_#9945FF08_1px,transparent_1px),linear-gradient(to_bottom,_#9945FF08_1px,transparent_1px)] bg-[size:24px_24px]' />
      <div className='container relative px-4 sm:px-6'>
        <div className='mx-auto max-w-6xl'>
          <div className='text-center'>
            <h2 className='font-display mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold tracking-tight text-[#E6E6E6] md:text-4xl'>
              Frequently Asked Questions
            </h2>
            <p className='text-base sm:text-lg text-[#E6E6E6]/60'>
              Common questions about our token burning platform and how it works.
            </p>
          </div>

          <div className='mx-auto mt-8 sm:mt-16 max-w-3xl'>
            <Accordion type='single' collapsible className='w-full space-y-2 sm:space-y-4'>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className='border-[#1E1E24]'>
                  <AccordionTrigger className='text-left text-sm sm:text-base text-[#E6E6E6] px-2 sm:px-4'>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className='text-sm text-[#A3A3A3] px-2 sm:px-4'>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
