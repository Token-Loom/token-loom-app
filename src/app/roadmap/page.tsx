'use client'

import { motion } from 'framer-motion'
import { Map, Flame, Coins, Droplet, XCircle, Code2, CheckCircle2, Clock } from 'lucide-react'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

interface Feature {
  text: string
  status: 'completed' | 'in-progress' | 'planned'
}

interface RoadmapItemProps {
  title: string
  description: string
  status: 'completed' | 'in-progress' | 'planned'
  icon: React.ReactNode
  features: Feature[]
  delay: number
}

function RoadmapItem({ title, description, status, icon, features, delay }: RoadmapItemProps) {
  const statusColors = {
    completed: {
      bg: 'bg-[#14F195]/10',
      text: 'text-[#14F195]',
      border: 'border-[#14F195]/30',
      icon: <CheckCircle2 className='w-5 h-5 text-[#14F195]' />,
      label: 'Completed',
      dot: 'bg-[#14F195]'
    },
    'in-progress': {
      bg: 'bg-[#9945FF]/10',
      text: 'text-[#9945FF]',
      border: 'border-[#9945FF]/30',
      icon: <Clock className='w-5 h-5 text-[#9945FF]' />,
      label: 'In Progress',
      dot: 'bg-[#9945FF]'
    },
    planned: {
      bg: 'bg-[#00C2FF]/10',
      text: 'text-[#00C2FF]',
      border: 'border-[#00C2FF]/30',
      icon: <Clock className='w-5 h-5 text-[#00C2FF]' />,
      label: 'Planned',
      dot: 'bg-[#00C2FF]'
    }
  }

  return (
    <motion.div
      initial={fadeIn.initial}
      animate={fadeIn.animate}
      transition={{ ...fadeIn.transition, delay }}
      className='bg-[#1A1B23]/50 backdrop-blur-sm border border-[#2E2E34] rounded-2xl overflow-hidden'
    >
      <div className='p-6 sm:p-8'>
        <div className='flex items-center gap-3 mb-6'>
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-lg ${statusColors[status].bg} flex items-center justify-center`}
          >
            {icon}
          </div>
          <div className='flex-1'>
            <h3 className='text-xl font-display font-bold text-[#E6E6E6] mb-1'>{title}</h3>
            <p className='text-sm text-[#E6E6E6]/60'>{description}</p>
          </div>
          <div
            className={`px-3 py-1 rounded-full ${statusColors[status].bg} ${statusColors[status].text} text-xs font-medium flex items-center gap-1.5`}
          >
            {statusColors[status].icon}
            {statusColors[status].label}
          </div>
        </div>
        <div className='space-y-3'>
          {features.map((feature, index) => (
            <div key={index} className='flex items-center gap-3 text-[#E6E6E6]/80'>
              <div className={`w-1.5 h-1.5 rounded-full ${statusColors[feature.status].dot}`} />
              {feature.text}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function RoadmapPage() {
  const roadmapItems: RoadmapItemProps[] = [
    {
      title: 'Token Burning',
      description: 'Secure and transparent token burning functionality',
      status: 'completed',
      icon: <Flame className='w-5 h-5 text-[#14F195]' />,
      features: [
        { text: 'Burn any SPL token', status: 'completed' },
        { text: 'Transaction verification', status: 'completed' },
        { text: 'Burn statistics tracking', status: 'completed' },
        { text: 'Transaction history', status: 'completed' },
        { text: 'Controlled burn scheduling', status: 'completed' }
      ],
      delay: 0.1
    },
    {
      title: 'Token Creation',
      description: 'Create new SPL tokens with customizable parameters',
      status: 'in-progress',
      icon: <Coins className='w-5 h-5 text-[#9945FF]' />,
      features: [
        { text: 'Custom token minting', status: 'in-progress' },
        { text: 'Token metadata support', status: 'in-progress' },
        { text: 'Supply management', status: 'planned' },
        { text: 'Token configuration', status: 'planned' },
        { text: 'Ownership controls', status: 'planned' }
      ],
      delay: 0.2
    },
    {
      title: 'Liquidity Pool Creation',
      description: 'Create and manage liquidity pools for tokens',
      status: 'planned',
      icon: <Droplet className='w-5 h-5 text-[#00C2FF]' />,
      features: [
        { text: 'Pool creation wizard', status: 'planned' },
        { text: 'Custom fee settings', status: 'planned' },
        { text: 'Initial liquidity setup', status: 'planned' },
        { text: 'Pool parameter configuration', status: 'planned' },
        { text: 'Multi-token support', status: 'planned' }
      ],
      delay: 0.3
    },
    {
      title: 'Liquidity Pool Closure',
      description: 'Safely close and withdraw from liquidity pools',
      status: 'in-progress',
      icon: <XCircle className='w-5 h-5 text-[#9945FF]' />,
      features: [
        { text: 'LP token burning', status: 'completed' },
        { text: 'Safe pool closure', status: 'planned' },
        { text: 'Asset withdrawal', status: 'planned' },
        { text: 'Fee collection', status: 'planned' },
        { text: 'Position unwinding', status: 'planned' }
      ],
      delay: 0.4
    },
    {
      title: 'Smart Contract Generation',
      description: 'Generate and deploy custom smart contracts',
      status: 'planned',
      icon: <Code2 className='w-5 h-5 text-[#00C2FF]' />,
      features: [
        { text: 'Contract templates', status: 'planned' },
        { text: 'Custom parameters', status: 'planned' },
        { text: 'Security auditing', status: 'planned' },
        { text: 'Automated deployment', status: 'planned' },
        { text: 'Contract verification', status: 'planned' }
      ],
      delay: 0.5
    }
  ]

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
              <Map className='w-12 h-12 text-[#14F195]' />
            </div>
            <h1 className='font-display text-4xl sm:text-6xl font-bold bg-gradient-to-r from-[#9945FF] via-[#14F195] to-[#00C2FF] bg-clip-text text-transparent mb-4'>
              Roadmap
            </h1>
            <p className='text-[#E6E6E6]/60 text-lg sm:text-xl max-w-2xl mx-auto'>
              Our vision for the future of TokenLoom and upcoming features.
            </p>
          </motion.div>

          {/* Roadmap Items */}
          <div className='space-y-6'>
            {roadmapItems.map(item => (
              <RoadmapItem key={item.title} {...item} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className='absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#9945FF]/20 to-transparent' />
    </main>
  )
}
