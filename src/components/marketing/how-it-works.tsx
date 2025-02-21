import { WalletIcon, FlameIcon, BarChart3Icon, ShieldCheckIcon } from 'lucide-react'

const steps = [
  {
    title: 'Connect Wallet',
    description: 'Connect your Solana wallet to get started with token burning.',
    icon: WalletIcon,
    gradient: 'from-[#9945FF] to-[#14F195]'
  },
  {
    title: 'Select Tokens',
    description: 'Choose the tokens and amount you want to burn from your wallet.',
    icon: FlameIcon,
    gradient: 'from-[#14F195] to-[#00C2FF]'
  },
  {
    title: 'Track Progress',
    description: 'Monitor your burn transactions in real-time with detailed analytics.',
    icon: BarChart3Icon,
    gradient: 'from-[#00C2FF] to-[#9945FF]'
  },
  {
    title: 'Verify Burns',
    description: 'All burns are recorded on-chain and easily verifiable.',
    icon: ShieldCheckIcon,
    gradient: 'from-[#9945FF] to-[#14F195]'
  }
]

export function HowItWorks() {
  return (
    <section className='relative bg-[#1E1E24] py-28'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#14F195]/5 via-transparent to-transparent' />
      <div className='container relative'>
        <div className='mx-auto max-w-6xl'>
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
      </div>
    </section>
  )
}
