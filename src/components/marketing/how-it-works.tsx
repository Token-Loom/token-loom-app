import { WalletIcon, FireIcon, ChartBarIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const steps = [
  {
    title: 'Connect Wallet',
    description: 'Connect your Solana wallet to get started with the burning process.',
    icon: WalletIcon,
    gradient: 'from-[#9945FF] to-[#14F195]'
  },
  {
    title: 'Select Options',
    description: 'Choose your tokens and configure your burn settings.',
    icon: FireIcon,
    gradient: 'from-[#14F195] to-[#00C2FF]'
  },
  {
    title: 'Burn Tokens',
    description: 'Execute the burn transaction securely on the Solana blockchain.',
    icon: ChartBarIcon,
    gradient: 'from-[#00C2FF] to-[#9945FF]'
  },
  {
    title: 'Verify Results',
    description: 'Track your burn transaction and view updated statistics.',
    icon: CheckCircleIcon,
    gradient: 'from-[#9945FF] to-[#00C2FF]'
  }
]

export function HowItWorks() {
  return (
    <section className='py-16'>
      <div className='container'>
        <div className='text-center'>
          <h2 className='font-display mb-4 text-3xl font-bold text-[#E6E6E6] sm:text-4xl'>How It Works</h2>
          <p className='mx-auto max-w-2xl text-[#A3A3A3]'>
            Our platform makes token burning simple and transparent. Follow these steps to reduce your token supply
            effectively.
          </p>
        </div>

        <div className='mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
          {steps.map(step => (
            <div key={step.title} className='relative flex flex-col items-center text-center'>
              <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full relative'>
                <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${step.gradient}`} />
                <div className='absolute inset-0 rounded-full bg-black/40' />
                <step.icon className='h-8 w-8 text-white relative z-10' />
              </div>
              <h3 className='mb-2 text-xl font-semibold text-[#E6E6E6]'>{step.title}</h3>
              <p className='text-[#A3A3A3]'>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
