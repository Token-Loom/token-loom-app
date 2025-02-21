import { z } from 'zod'

export const scheduledBurnSchema = z.object({
  scheduledFor: z.date(),
  amount: z.string().min(1, 'Please enter an amount')
})

export const burnFormSchema = z
  .object({
    tokenMint: z.string().min(1, 'Please select a token'),
    amount: z.string().min(1, 'Please enter an amount'),
    burnType: z.enum(['INSTANT', 'CONTROLLED'], {
      required_error: 'Please select a burn type'
    }),
    message: z.string().optional(),
    // Array of scheduled burns for controlled burns
    scheduledBurns: z.array(scheduledBurnSchema).optional()
  })
  .refine(
    data => {
      // If burn type is CONTROLLED, require at least one scheduled burn
      if (data.burnType === 'CONTROLLED') {
        return data.scheduledBurns && data.scheduledBurns.length > 0
      }
      return true
    },
    {
      message: 'Please add at least one scheduled burn',
      path: ['scheduledBurns']
    }
  )

export type ScheduledBurn = z.infer<typeof scheduledBurnSchema>
export type BurnFormData = z.infer<typeof burnFormSchema>

export interface TokenInfo {
  mint: string
  symbol: string
  name: string
  balance: number
  decimals: number
  uiAmount: number
}

export interface LPTokenInfo extends TokenInfo {
  isLPToken: true
  token0?: {
    mint: string
    symbol: string
  }
  token1?: {
    mint: string
    symbol: string
  }
  poolAddress?: string
}

export type TokenType = TokenInfo | LPTokenInfo

export type BurnRate = 'DAILY' | 'WEEKLY' | 'MONTHLY'
