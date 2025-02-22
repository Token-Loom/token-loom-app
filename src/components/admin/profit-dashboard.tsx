import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatTokenAmount } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ProfitData {
  totalProfit: {
    feesCollected: number
    gasCosts: number
    netProfit: number
  }
  tokenProfits: {
    tokenSymbol: string
    totalFeesCollected: number
    totalTransactions: number
    instantBurns: number
    controlledBurns: number
  }[]
  recentTransactions: {
    signature: string
    tokenSymbol: string
    feeAmount: number
    gasUsed: number
    profit: number
    completedAt: string
  }[]
  dailyProfits: {
    date: string
    gasCosts: number
  }[]
}

export function ProfitDashboard() {
  const [profitData, setProfitData] = useState<ProfitData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfitData = async () => {
      try {
        const response = await fetch('/api/admin/profit')
        const { data } = await response.json()
        setProfitData(data)
      } catch (error) {
        console.error('Error fetching profit data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfitData()
    const interval = setInterval(fetchProfitData, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div className='text-center py-8 text-[#E6E6E6]/60'>Loading profit data...</div>
  }

  if (!profitData) {
    return <div className='text-center py-8 text-[#E6E6E6]/60'>No profit data available</div>
  }

  return (
    <div className='space-y-4 sm:space-y-6'>
      {/* Total Profit Overview */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>
        <Card className='bg-black/20 border-[#2E2E34]'>
          <CardHeader className='pb-2 sm:pb-4'>
            <CardTitle className='text-lg text-[#E6E6E6]'>Total Fees</CardTitle>
            <CardDescription className='text-[#E6E6E6]/60'>Total fees collected from burns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-xl sm:text-2xl font-bold text-[#14F195]'>
              {formatTokenAmount(profitData.totalProfit.feesCollected)} SOL
            </div>
          </CardContent>
        </Card>

        <Card className='bg-black/20 border-[#2E2E34]'>
          <CardHeader className='pb-2 sm:pb-4'>
            <CardTitle className='text-lg text-[#E6E6E6]'>Gas Costs</CardTitle>
            <CardDescription className='text-[#E6E6E6]/60'>Total gas costs for burn transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-xl sm:text-2xl font-bold text-[#9945FF]'>
              {formatTokenAmount(profitData.totalProfit.gasCosts)} SOL
            </div>
          </CardContent>
        </Card>

        <Card className='bg-black/20 border-[#2E2E34] sm:col-span-2 lg:col-span-1'>
          <CardHeader className='pb-2 sm:pb-4'>
            <CardTitle className='text-lg text-[#E6E6E6]'>Net Profit</CardTitle>
            <CardDescription className='text-[#E6E6E6]/60'>Total profit after gas costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-xl sm:text-2xl font-bold text-[#00C2FF]'>
              {formatTokenAmount(profitData.totalProfit.netProfit)} SOL
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Token Profit Breakdown */}
      <Card className='bg-black/20 border-[#2E2E34]'>
        <CardHeader className='pb-2 sm:pb-4'>
          <CardTitle className='text-lg text-[#E6E6E6]'>Profit by Token</CardTitle>
          <CardDescription className='text-[#E6E6E6]/60'>Breakdown of fees collected per token</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className='w-full'>
            <div className='min-w-[600px]'>
              <Table>
                <TableHeader>
                  <TableRow className='hover:bg-[#1E1E24]/50'>
                    <TableHead className='text-[#E6E6E6]/60'>Token</TableHead>
                    <TableHead className='text-[#E6E6E6]/60'>Total Fees</TableHead>
                    <TableHead className='text-[#E6E6E6]/60'>Total Burns</TableHead>
                    <TableHead className='text-[#E6E6E6]/60'>Instant Burns</TableHead>
                    <TableHead className='text-[#E6E6E6]/60'>Controlled Burns</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profitData.tokenProfits.map(token => (
                    <TableRow key={token.tokenSymbol} className='hover:bg-[#1E1E24]/50'>
                      <TableCell className='font-medium text-[#E6E6E6]'>{token.tokenSymbol}</TableCell>
                      <TableCell className='text-[#E6E6E6]'>
                        {formatTokenAmount(token.totalFeesCollected)} SOL
                      </TableCell>
                      <TableCell className='text-[#E6E6E6]'>{token.totalTransactions}</TableCell>
                      <TableCell className='text-[#E6E6E6]'>{token.instantBurns}</TableCell>
                      <TableCell className='text-[#E6E6E6]'>{token.controlledBurns}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className='bg-black/20 border-[#2E2E34]'>
        <CardHeader className='pb-2 sm:pb-4'>
          <CardTitle className='text-lg text-[#E6E6E6]'>Recent Transactions</CardTitle>
          <CardDescription className='text-[#E6E6E6]/60'>Latest burn transactions with profit details</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className='w-full'>
            <div className='min-w-[600px]'>
              <Table>
                <TableHeader>
                  <TableRow className='hover:bg-[#1E1E24]/50'>
                    <TableHead className='text-[#E6E6E6]/60'>Token</TableHead>
                    <TableHead className='text-[#E6E6E6]/60'>Fee</TableHead>
                    <TableHead className='text-[#E6E6E6]/60'>Gas Cost</TableHead>
                    <TableHead className='text-[#E6E6E6]/60'>Profit</TableHead>
                    <TableHead className='text-[#E6E6E6]/60'>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profitData.recentTransactions.map(tx => (
                    <TableRow key={tx.signature} className='hover:bg-[#1E1E24]/50'>
                      <TableCell className='font-medium text-[#E6E6E6]'>{tx.tokenSymbol}</TableCell>
                      <TableCell className='text-[#E6E6E6]'>{formatTokenAmount(tx.feeAmount)} SOL</TableCell>
                      <TableCell className='text-[#E6E6E6]'>{formatTokenAmount(tx.gasUsed)} SOL</TableCell>
                      <TableCell className='text-[#E6E6E6]'>{formatTokenAmount(tx.profit)} SOL</TableCell>
                      <TableCell className='text-[#E6E6E6]'>{new Date(tx.completedAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
