import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const faqs = [
  {
    question: 'How does burning affect token value?',
    answer:
      'Token burning reduces the total supply, which can potentially increase the value of remaining tokens if demand remains constant or increases. However, the actual impact depends on various market factors.'
  },
  {
    question: 'Is burning permanent?',
    answer:
      'Yes, token burning is an irreversible process. Once tokens are sent to a burn address, they can never be recovered or reused. This permanent reduction in supply is verifiable on the Solana blockchain.'
  },
  {
    question: 'How are fees calculated?',
    answer:
      'We offer two burn options: Instant Burn (0.1 SOL fee) for immediate processing, and Controlled Burn (0.2 SOL fee) for scheduled burns. These fees cover transaction costs and platform maintenance.'
  },
  {
    question: 'How can I verify my burn?',
    answer:
      'Every burn transaction is recorded on the Solana blockchain and can be verified through our dashboard or directly on Solana Explorer. We provide transaction hashes and detailed burn analytics.'
  },
  {
    question: 'What happens to burned tokens?',
    answer:
      'Burned tokens are sent to a verifiable burn address where they become permanently inaccessible. This process is transparent and can be tracked through our platform or blockchain explorers.'
  }
]

export function FAQ() {
  return (
    <section className='py-16'>
      <div className='container'>
        <div className='text-center'>
          <h2 className='font-display mb-4 text-3xl font-bold text-[#E6E6E6] sm:text-4xl'>
            Frequently Asked Questions
          </h2>
          <p className='mx-auto max-w-2xl text-[#A3A3A3]'>
            Find answers to common questions about our token burning platform and process.
          </p>
        </div>

        <div className='mx-auto mt-16 max-w-3xl'>
          <Accordion type='single' collapsible className='w-full'>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className='text-left text-[#E6E6E6]'>{faq.question}</AccordionTrigger>
                <AccordionContent className='text-[#A3A3A3]'>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
