import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatNumber } from '@/lib/utils'

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
    return <div>Loading profit data...</div>
  }

  if (!profitData) {
    return <div>No profit data available</div>
  }

  return (
    <div className='space-y-6'>
      {/* Total Profit Overview */}
      <div className='grid grid-cols-3 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Total Fees</CardTitle>
            <CardDescription>Total fees collected from burns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatNumber(profitData.totalProfit.feesCollected)} SOL</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gas Costs</CardTitle>
            <CardDescription>Total gas costs for burn transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatNumber(profitData.totalProfit.gasCosts)} SOL</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Profit</CardTitle>
            <CardDescription>Total profit after gas costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatNumber(profitData.totalProfit.netProfit)} SOL</div>
          </CardContent>
        </Card>
      </div>

      {/* Token Profit Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Profit by Token</CardTitle>
          <CardDescription>Breakdown of fees collected per token</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>Total Fees</TableHead>
                <TableHead>Total Burns</TableHead>
                <TableHead>Instant Burns</TableHead>
                <TableHead>Controlled Burns</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profitData.tokenProfits.map(token => (
                <TableRow key={token.tokenSymbol}>
                  <TableCell>{token.tokenSymbol}</TableCell>
                  <TableCell>{formatNumber(token.totalFeesCollected)} SOL</TableCell>
                  <TableCell>{token.totalTransactions}</TableCell>
                  <TableCell>{token.instantBurns}</TableCell>
                  <TableCell>{token.controlledBurns}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest burn transactions with profit details</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Gas Cost</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profitData.recentTransactions.map(tx => (
                <TableRow key={tx.signature}>
                  <TableCell>{tx.tokenSymbol}</TableCell>
                  <TableCell>{formatNumber(tx.feeAmount)} SOL</TableCell>
                  <TableCell>{formatNumber(tx.gasUsed)} SOL</TableCell>
                  <TableCell>{formatNumber(tx.profit)} SOL</TableCell>
                  <TableCell>{new Date(tx.completedAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
