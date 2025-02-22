'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useTokenBalances } from '@/hooks/use-token-balances'
import { BurnFormData, burnFormSchema } from '@/lib/types/burn'
import { CalendarIcon, PlusCircle, Trash2 } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn, formatTokenAmount } from '@/lib/utils'
import { format } from 'date-fns'
import { useState } from 'react'
import { burnTokens } from '@/lib/solana/burn'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { isAdminWallet } from '@/lib/solana/admin'
import { burnLPTokens } from '@/lib/solana/lp-burn'
import { TokenType, LPTokenInfo } from '@/lib/types/burn'

// Helper function to check if a token is an LP token
function isLPToken(token: TokenType): token is LPTokenInfo {
  return 'isLPToken' in token
}

export function BurnForm() {
  const { publicKey, signTransaction } = useWallet()
  const { connection } = useConnection()
  const { tokens, isLoading, error } = useTokenBalances()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [burnStatus, setBurnStatus] = useState<string | null>(null)
  const [txSignature, setTxSignature] = useState<string | null>(null)
  const { toast } = useToast()
  const isAdmin = publicKey ? isAdminWallet(publicKey) : false
  const [selectedToken, setSelectedToken] = useState<TokenType | null>(null)

  const form = useForm<BurnFormData>({
    resolver: zodResolver(burnFormSchema),
    defaultValues: {
      tokenMint: '',
      amount: '',
      burnType: 'INSTANT',
      message: '',
      scheduledBurns: []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'scheduledBurns'
  })

  const burnType = form.watch('burnType')
  const isControlledBurn = burnType === 'CONTROLLED'

  const onSubmit = async (data: BurnFormData) => {
    if (!publicKey || !signTransaction) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to burn tokens.',
        variant: 'destructive'
      })
      return
    }

    try {
      setIsSubmitting(true)
      setBurnStatus(null)
      setTxSignature(null)

      // Get token info for the selected token
      const token = tokens.find(t => t.mint === data.tokenMint)
      if (!token) {
        throw new Error('Selected token not found')
      }

      // Handle burn based on token type
      const signature =
        'isLPToken' in token
          ? await burnLPTokens({
              connection,
              tokenMint: data.tokenMint,
              amount: data.amount,
              wallet: publicKey,
              signTransaction,
              isControlledBurn: data.burnType === 'CONTROLLED',
              onProgress: setBurnStatus
            })
          : await burnTokens({
              connection,
              tokenMint: data.tokenMint,
              amount: data.amount,
              wallet: publicKey,
              signTransaction,
              isControlledBurn: data.burnType === 'CONTROLLED',
              onProgress: setBurnStatus
            })

      // If signature is null, user cancelled the transaction
      if (!signature) {
        setIsSubmitting(false)
        setBurnStatus(null)
        return
      }

      setTxSignature(signature)

      // Create burn record in database
      const response = await fetch('/api/burn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tokenMint: data.tokenMint,
          tokenName: token.name,
          tokenSymbol: token.symbol,
          tokenType: 'isLPToken' in token ? 'LP' : 'REGULAR',
          // Include LP token specific fields if it's an LP token
          ...('isLPToken' in token && isLPToken(token) && token.token0 && token.token1
            ? {
                lpToken0Mint: token.token0.mint,
                lpToken1Mint: token.token1.mint,
                lpToken0Symbol: token.token0.symbol,
                lpToken1Symbol: token.token1.symbol,
                lpPoolAddress: token.poolAddress
              }
            : {}),
          amount: data.amount,
          burnType: data.burnType,
          message: data.message,
          userWallet: publicKey.toString(),
          scheduledBurns: data.scheduledBurns
        })
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Failed to create burn transaction')
      }

      toast({
        title: 'Burn successful!',
        description: `Successfully burned ${data.amount} ${token.symbol}`
      })

      // Reset form
      form.reset()
    } catch (err) {
      console.error('Error submitting burn form:', err)
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to burn tokens',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!publicKey) {
    return (
      <Card className='overflow-hidden border-[#1E1E24] bg-black/20 backdrop-blur'>
        <div className='absolute inset-0 bg-gradient-to-r from-[#9945FF]/5 to-[#14F195]/5 opacity-50' />
        <CardHeader className='relative'>
          <CardTitle className='text-xl sm:text-2xl'>Connect Wallet</CardTitle>
          <CardDescription className='text-[#A3A3A3] text-sm sm:text-base'>
            Please connect your wallet to start burning tokens
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className='overflow-hidden border-[#1E1E24] bg-black/20 backdrop-blur'>
      <div className='absolute inset-0 bg-gradient-to-r from-[#9945FF]/5 to-[#14F195]/5 opacity-50' />
      <CardHeader className='relative'>
        <CardTitle className='text-xl sm:text-2xl'>Token Burn</CardTitle>
        <CardDescription className='text-[#A3A3A3] text-sm sm:text-base'>
          Select a token and amount to burn
        </CardDescription>
        {error && (
          <Alert variant='destructive' className='mt-2'>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className='text-sm'>{error}</AlertDescription>
          </Alert>
        )}
        {burnStatus && (
          <Alert className='mt-2'>
            <AlertTitle>Status</AlertTitle>
            <AlertDescription className='text-sm'>{burnStatus}</AlertDescription>
          </Alert>
        )}
        {txSignature && (
          <Alert className='mt-2'>
            <AlertTitle>Transaction Confirmed</AlertTitle>
            <AlertDescription className='text-sm'>
              <a
                href={`https://explorer.solana.com/tx/${txSignature}`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-[#14F195] hover:underline'
              >
                View on Solana Explorer
              </a>
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent className='relative'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 sm:space-y-6'>
            <FormField
              control={form.control}
              name='tokenMint'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[#E6E6E6] text-sm sm:text-base'>Token</FormLabel>
                  <Select
                    onValueChange={value => {
                      field.onChange(value)
                      const token = tokens.find(t => t.mint === value)
                      setSelectedToken(token || null)
                    }}
                    value={field.value}
                  >
                    <SelectTrigger className='border-[#1E1E24] bg-black/20 text-sm sm:text-base h-9 sm:h-10'>
                      <SelectValue placeholder={isLoading ? 'Loading tokens...' : 'Select a token'}>
                        {field.value &&
                          (() => {
                            const selectedToken = tokens.find(t => t.mint === field.value)
                            if (!selectedToken) return null
                            const symbol = selectedToken.symbol?.trim() || selectedToken.mint.slice(0, 8)
                            const displayText = `${symbol} (${formatTokenAmount(selectedToken.uiAmount, selectedToken.decimals)})`
                            return displayText
                          })()}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className='border-[#1E1E24] bg-[#13141F] text-sm sm:text-base'>
                      {tokens.length === 0 && !isLoading && (
                        <div className='p-2 text-sm text-[#A3A3A3]'>No tokens found in wallet</div>
                      )}
                      {tokens.map(token => {
                        const symbol = token.symbol?.trim() || token.mint.slice(0, 8)
                        let displayText = `${symbol} (${formatTokenAmount(token.uiAmount, token.decimals)})`

                        // Add LP token indicator and pair info if it's an LP token
                        if (isLPToken(token)) {
                          displayText = `${displayText} - LP Token`
                        }

                        return (
                          <SelectItem key={token.mint} value={token.mint} className='text-sm sm:text-base'>
                            {displayText}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-xs sm:text-sm' />
                </FormItem>
              )}
            />

            {/* Show LP token details if selected */}
            {selectedToken && isLPToken(selectedToken) && (
              <div className='rounded-lg border p-4 space-y-2'>
                <h4 className='font-medium'>LP Token Details</h4>
                <div className='text-sm text-muted-foreground'>
                  <p>
                    Token Pair: {selectedToken.token0?.symbol}/{selectedToken.token1?.symbol}
                  </p>
                  <p>Pool: {selectedToken.poolAddress}</p>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name='amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[#E6E6E6] text-sm sm:text-base'>Amount</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='number'
                      step='any'
                      className='border-[#1E1E24] bg-black/20 text-sm sm:text-base h-9 sm:h-10'
                      placeholder='Enter amount to burn'
                    />
                  </FormControl>
                  <FormMessage className='text-xs sm:text-sm' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='burnType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[#E6E6E6] text-sm sm:text-base'>Burn Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className='flex flex-col sm:flex-row gap-2 sm:gap-4'
                    >
                      <FormItem className='flex items-center space-x-2'>
                        <FormControl>
                          <RadioGroupItem value='INSTANT' />
                        </FormControl>
                        <FormLabel className='text-[#E6E6E6] text-sm sm:text-base font-normal'>Instant Burn</FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center space-x-2'>
                        <FormControl>
                          <RadioGroupItem value='CONTROLLED' />
                        </FormControl>
                        <FormLabel className='text-[#E6E6E6] text-sm sm:text-base font-normal'>
                          Controlled Burn
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className='text-xs sm:text-sm' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[#E6E6E6] text-sm sm:text-base'>Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className='border-[#1E1E24] bg-black/20 text-sm sm:text-base min-h-[80px]'
                      placeholder='Add a message to your burn transaction'
                    />
                  </FormControl>
                  <FormMessage className='text-xs sm:text-sm' />
                </FormItem>
              )}
            />

            {isControlledBurn && (
              <div className='space-y-4'>
                {fields.map((field, index) => (
                  <div key={field.id} className='flex flex-col sm:flex-row gap-4 items-start'>
                    <div className='flex-1 space-y-4'>
                      <FormField
                        control={form.control}
                        name={`scheduledBurns.${index}.scheduledFor`}
                        render={({ field }) => (
                          <FormItem className='flex flex-col'>
                            <FormLabel className='text-[#E6E6E6] text-sm sm:text-base'>Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant='outline'
                                    className='border-[#1E1E24] bg-black/20 text-sm sm:text-base h-9 sm:h-10 w-full sm:w-[240px]'
                                  >
                                    {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className='w-auto p-0' align='start'>
                                <Calendar
                                  mode='single'
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={date => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage className='text-xs sm:text-sm' />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`scheduledBurns.${index}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-[#E6E6E6] text-sm sm:text-base'>Amount</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type='number'
                                step='any'
                                className='border-[#1E1E24] bg-black/20 text-sm sm:text-base h-9 sm:h-10'
                                placeholder='Enter amount'
                              />
                            </FormControl>
                            <FormMessage className='text-xs sm:text-sm' />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='text-[#E6E6E6]/60 hover:text-[#E6E6E6] hover:bg-[#2E2E34]/50'
                      onClick={() => remove(index)}
                    >
                      <Trash2 className='h-4 w-4' />
                      <span className='sr-only'>Remove scheduled burn</span>
                    </Button>
                  </div>
                ))}

                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className='border-[#1E1E24] bg-black/20 text-sm sm:text-base h-9 sm:h-10'
                  onClick={() => append({ scheduledFor: new Date(), amount: '' })}
                >
                  <PlusCircle className='mr-2 h-4 w-4' />
                  Add Schedule
                </Button>
              </div>
            )}

            <Button
              type='submit'
              className='w-full sm:w-auto bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white hover:opacity-90 text-sm sm:text-base h-9 sm:h-10'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Processing...
                </>
              ) : (
                'Burn Tokens'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
