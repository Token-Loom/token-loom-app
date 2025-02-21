'use client'

import { BurnForm } from '@/components/burn/burn-form'
import { StatusDashboard } from '@/components/burn/status-dashboard'
import { TransactionHistory } from '@/components/burn/transaction-history'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'

export default function BurnPage() {
  const [activeTab, setActiveTab] = useState('burn')

  return (
    <main className='min-h-screen bg-[#13141F] flex flex-col'>
      <section className='relative flex-1 py-16'>
        {/* Background effects */}
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#9945FF]/10 via-transparent to-transparent' />
        <div className='absolute inset-0 bg-[linear-gradient(to_right,_#9945FF08_1px,transparent_1px),linear-gradient(to_bottom,_#9945FF08_1px,transparent_1px)] bg-[size:24px_24px]' />

        {/* Content */}
        <div className='container relative'>
          <div className='flex flex-col gap-4 mb-8'>
            <h1 className='text-4xl font-bold tracking-tight bg-gradient-to-r from-[#9945FF] via-[#14F195] to-[#00C2FF] bg-clip-text text-transparent'>
              Burn Dashboard
            </h1>
            <p className='text-[#E6E6E6]/80 text-lg'>
              Configure and execute token burns with real-time status updates and transaction history.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-6'>
            <TabsList className='bg-[#1E1E24] border border-[#2E2E34]'>
              <TabsTrigger value='burn' className='data-[state=active]:bg-[#2E2E34]'>
                Burn Tokens
              </TabsTrigger>
              <TabsTrigger value='status' className='data-[state=active]:bg-[#2E2E34]'>
                Status
              </TabsTrigger>
              <TabsTrigger value='history' className='data-[state=active]:bg-[#2E2E34]'>
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value='burn' className='space-y-4'>
              <BurnForm />
            </TabsContent>

            <TabsContent value='status' className='space-y-4'>
              <StatusDashboard />
            </TabsContent>

            <TabsContent value='history' className='space-y-4'>
              <TransactionHistory />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  )
}
