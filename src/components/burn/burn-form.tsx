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
import { CalendarIcon, PlusCircle, Trash2, Flame, Clock, MessageSquare } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatTokenAmount } from '@/lib/utils'
import { format } from 'date-fns'
import { useState } from 'react'
import { burnTokens } from '@/lib/solana/burn'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
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
          scheduledBurns: data.scheduledBurns,
          signature
        })
      })

      const result = await response.json()
      console.log('API Response:', {
        status: response.status,
        result,
        requestBody: {
          tokenMint: data.tokenMint,
          tokenName: token.name,
          tokenSymbol: token.symbol,
          amount: data.amount,
          burnType: data.burnType,
          userWallet: publicKey.toString(),
          signature
        }
      })

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
      <CardHeader className='relative pb-4'>
        <CardTitle className='text-xl sm:text-2xl flex items-center gap-2'>
          <Flame className='w-6 h-6 text-[#14F195]' />
          Token Burn
        </CardTitle>
        <CardDescription className='text-[#E6E6E6]/60 text-sm sm:text-base'>
          Select a token and amount to burn
        </CardDescription>
      </CardHeader>

      <CardContent className='relative space-y-6'>
        {/* Status Messages */}
        {(error || burnStatus || txSignature) && (
          <div className='space-y-2 mb-6'>
            {error && (
              <Alert variant='destructive'>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className='text-sm'>{error}</AlertDescription>
              </Alert>
            )}
            {burnStatus && (
              <Alert>
                <AlertTitle>Status</AlertTitle>
                <AlertDescription className='text-sm'>{burnStatus}</AlertDescription>
              </Alert>
            )}
            {txSignature && (
              <Alert>
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
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid gap-6 sm:grid-cols-2'>
              {/* Token Selection */}
              <FormField
                control={form.control}
                name='tokenMint'
                render={({ field }) => (
                  <FormItem className='sm:col-span-2'>
                    <FormLabel className='text-[#E6E6E6] text-sm sm:text-base'>Select Token</FormLabel>
                    <Select
                      onValueChange={value => {
                        field.onChange(value)
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className='border-[#1E1E24] bg-black/20 text-sm sm:text-base h-12'>
                        <SelectValue placeholder={isLoading ? 'Loading tokens...' : 'Choose a token to burn'} />
                      </SelectTrigger>
                      <SelectContent className='border-[#1E1E24] bg-[#13141F]'>
                        {tokens.length === 0 && !isLoading && (
                          <div className='p-4 text-sm text-[#E6E6E6]/60 text-center'>No tokens found in wallet</div>
                        )}
                        {tokens.map(token => {
                          const symbol = token.symbol?.trim() || token.mint.slice(0, 8)
                          let displayText = `${symbol} (${formatTokenAmount(token.uiAmount, token.decimals)})`
                          if (isLPToken(token)) {
                            displayText = `${displayText} - LP Token`
                          }
                          return (
                            <SelectItem
                              key={token.mint}
                              value={token.mint}
                              className='text-sm sm:text-base py-3 cursor-pointer'
                            >
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

              {/* Amount Input */}
              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <FormItem className='sm:col-span-2'>
                    <FormLabel className='text-[#E6E6E6] text-sm sm:text-base'>Burn Amount</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='number'
                        step='any'
                        className='border-[#1E1E24] bg-black/20 text-sm sm:text-base h-12'
                        placeholder='Enter amount to burn'
                      />
                    </FormControl>
                    <FormMessage className='text-xs sm:text-sm' />
                  </FormItem>
                )}
              />
            </div>

            {/* Burn Type Selection */}
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
                      className='grid gap-4 sm:grid-cols-2'
                    >
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='INSTANT' />
                        </FormControl>
                        <div className='space-y-1'>
                          <FormLabel className='text-[#E6E6E6] text-sm sm:text-base font-normal flex items-center gap-2'>
                            <Flame className='w-4 h-4 text-[#14F195]' />
                            Instant Burn
                          </FormLabel>
                          <p className='text-xs text-[#E6E6E6]/60'>Burn tokens immediately</p>
                        </div>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className='text-xs sm:text-sm' />
                </FormItem>
              )}
            />

            {/* Scheduled Burns */}
            {isControlledBurn && (
              <div className='space-y-4 rounded-lg border border-[#1E1E24] bg-black/20 p-4'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-medium text-[#E6E6E6] flex items-center gap-2'>
                    <Clock className='w-5 h-5 text-[#9945FF]' />
                    Scheduled Burns
                  </h3>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => append({ scheduledFor: new Date(), amount: '' })}
                    className='border-[#1E1E24] bg-black/20 hover:bg-[#1E1E24] hover:text-[#E6E6E6]'
                  >
                    <PlusCircle className='mr-2 h-4 w-4' />
                    Add Schedule
                  </Button>
                </div>

                <div className='space-y-4'>
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className='grid sm:grid-cols-2 gap-4 items-start rounded-lg border border-[#1E1E24] p-4'
                    >
                      <FormField
                        control={form.control}
                        name={`scheduledBurns.${index}.scheduledFor`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-[#E6E6E6] text-sm sm:text-base'>Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant='outline'
                                    className='w-full border-[#1E1E24] bg-black/20 text-sm sm:text-base h-12'
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

                      <div className='flex gap-2'>
                        <FormField
                          control={form.control}
                          name={`scheduledBurns.${index}.amount`}
                          render={({ field }) => (
                            <FormItem className='flex-1'>
                              <FormLabel className='text-[#E6E6E6] text-sm sm:text-base'>Amount</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type='number'
                                  step='any'
                                  className='border-[#1E1E24] bg-black/20 text-sm sm:text-base h-12'
                                  placeholder='Enter amount'
                                />
                              </FormControl>
                              <FormMessage className='text-xs sm:text-sm' />
                            </FormItem>
                          )}
                        />

                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='mt-8 text-[#E6E6E6]/60 hover:text-red-500 hover:bg-red-500/10'
                          onClick={() => remove(index)}
                        >
                          <Trash2 className='h-4 w-4' />
                          <span className='sr-only'>Remove schedule</span>
                        </Button>
                      </div>
                    </div>
                  ))}

                  {fields.length === 0 && (
                    <div className='text-sm text-[#E6E6E6]/60 text-center py-8 border-2 border-dashed border-[#1E1E24] rounded-lg'>
                      No burn schedules added. Click &quot;Add Schedule&quot; to create one.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Message Input */}
            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[#E6E6E6] text-sm sm:text-base flex items-center gap-2'>
                    <MessageSquare className='w-4 h-4 text-[#E6E6E6]/60' />
                    Message (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className='border-[#1E1E24] bg-black/20 text-sm sm:text-base min-h-[100px] resize-none'
                      placeholder='Add a message to your burn transaction'
                    />
                  </FormControl>
                  <FormMessage className='text-xs sm:text-sm' />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type='submit'
              className='w-full sm:w-auto bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white hover:opacity-90 h-12'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Processing...
                </>
              ) : (
                <>
                  <Flame className='mr-2 h-4 w-4' />
                  Burn Tokens
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
