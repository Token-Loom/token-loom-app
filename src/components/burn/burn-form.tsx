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
import { useTokenBalances } from '@/lib/hooks/use-token-balances'
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

export function BurnForm() {
  const { publicKey, signTransaction } = useWallet()
  const { connection } = useConnection()
  const { tokens, isLoading, error } = useTokenBalances()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [burnStatus, setBurnStatus] = useState<string | null>(null)
  const [txSignature, setTxSignature] = useState<string | null>(null)
  const { toast } = useToast()
  const isAdmin = publicKey ? isAdminWallet(publicKey) : false

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
      const selectedToken = tokens.find(t => t.mint === data.tokenMint)
      if (!selectedToken) {
        throw new Error('Selected token not found')
      }

      // For instant burns, execute immediately
      if (data.burnType === 'INSTANT') {
        const signature = await burnTokens({
          connection,
          tokenMint: data.tokenMint,
          amount: data.amount,
          wallet: publicKey,
          signTransaction,
          isControlledBurn: false,
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
            tokenName: selectedToken.name,
            tokenSymbol: selectedToken.symbol,
            amount: data.amount,
            burnType: data.burnType,
            message: data.message,
            userWallet: publicKey.toString()
          })
        })

        const result = await response.json()
        if (!result.success) {
          throw new Error(result.error || 'Failed to create burn transaction')
        }

        toast({
          title: 'Burn successful!',
          description: `Successfully burned ${data.amount} ${selectedToken.symbol || 'tokens'}`
        })

        // Reset form
        form.reset()
      } else {
        // For controlled burns
        const signature = await burnTokens({
          connection,
          tokenMint: data.tokenMint,
          amount: data.amount,
          wallet: publicKey,
          signTransaction,
          isControlledBurn: true,
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
            tokenName: selectedToken.name,
            tokenSymbol: selectedToken.symbol,
            amount: data.amount,
            burnType: data.burnType,
            message: data.message,
            userWallet: publicKey.toString(),
            scheduledBurns: data.scheduledBurns
          })
        })

        const result = await response.json()
        if (!result.success) {
          throw new Error(result.error || 'Failed to create burn schedule')
        }

        toast({
          title: 'Schedule created!',
          description: `Successfully created burn schedule for ${data.amount} ${selectedToken.symbol || 'tokens'}`
        })

        // Reset form
        form.reset()
      }
    } catch (err) {
      console.error('Error submitting burn form:', err)
      // Only show error toast if it wasn't a user cancellation
      if (err instanceof Error && err.message !== 'USER_CANCELLED') {
        toast({
          title: 'Error',
          description: err instanceof Error ? err.message : 'Failed to process burn transaction',
          variant: 'destructive'
        })
      }
    } finally {
      setIsSubmitting(false)
      if (!txSignature) {
        setBurnStatus(null) // Clear status if transaction wasn't completed
      }
    }
  }

  if (!publicKey) {
    return (
      <Card className='overflow-hidden border-[#1E1E24] bg-black/20 backdrop-blur'>
        <div className='absolute inset-0 bg-gradient-to-r from-[#9945FF]/5 to-[#14F195]/5 opacity-50' />
        <CardHeader className='relative'>
          <CardTitle className='text-2xl'>Connect Wallet</CardTitle>
          <CardDescription className='text-[#A3A3A3]'>
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
        <CardTitle className='text-2xl'>Token Burn</CardTitle>
        <CardDescription className='text-[#A3A3A3]'>Select a token and amount to burn</CardDescription>
        {error && (
          <Alert variant='destructive' className='mt-2'>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {burnStatus && (
          <Alert className='mt-2'>
            <AlertTitle>Status</AlertTitle>
            <AlertDescription>{burnStatus}</AlertDescription>
          </Alert>
        )}
        {txSignature && (
          <Alert className='mt-2'>
            <AlertTitle>Transaction Confirmed</AlertTitle>
            <AlertDescription>
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
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='tokenMint'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[#E6E6E6]'>Token</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className='border-[#1E1E24] bg-black/20'>
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
                    </FormControl>
                    <SelectContent className='border-[#1E1E24] bg-[#13141F]'>
                      {tokens.length === 0 && !isLoading && (
                        <div className='p-2 text-sm text-[#A3A3A3]'>No tokens found in wallet</div>
                      )}
                      {tokens.map(token => {
                        const symbol = token.symbol?.trim() || token.mint.slice(0, 8)
                        const displayText = `${symbol} (${formatTokenAmount(token.uiAmount, token.decimals)})`
                        return (
                          <SelectItem key={token.mint} value={token.mint} className='focus:bg-[#1E1E24]'>
                            {displayText}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-red-500' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[#E6E6E6]'>Total Amount</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter total amount to burn'
                      {...field}
                      className='border-[#1E1E24] bg-black/20'
                    />
                  </FormControl>
                  <FormMessage className='text-red-500' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='burnType'
              render={({ field }) => (
                <FormItem className='space-y-3'>
                  <FormLabel className='text-[#E6E6E6]'>Burn Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className='flex flex-col space-y-1'
                    >
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='INSTANT' />
                        </FormControl>
                        <FormLabel className='font-normal text-[#E6E6E6]'>
                          Instant Burn
                          {!isAdmin && (
                            <span className='ml-2 text-sm text-[#A3A3A3]'>
                              (0.1 SOL platform fee + Solana network fees)
                            </span>
                          )}
                        </FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='CONTROLLED' />
                        </FormControl>
                        <FormLabel className='font-normal text-[#E6E6E6]'>
                          Controlled Burn
                          {!isAdmin && (
                            <span className='ml-2 text-sm text-[#A3A3A3]'>
                              (0.2 SOL platform fee + Solana network fees)
                            </span>
                          )}
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className='text-red-500' />
                </FormItem>
              )}
            />

            {isControlledBurn && (
              <div className='space-y-4 rounded-lg border border-[#1E1E24] bg-black/20 p-4'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-medium text-[#E6E6E6]'>Scheduled Burns</h3>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => append({ scheduledFor: new Date(), amount: '' })}
                    className='border-[#1E1E24] bg-black/20 hover:bg-[#1E1E24] hover:text-[#E6E6E6]'
                  >
                    <PlusCircle className='mr-2 h-4 w-4' />
                    Add Burn Schedule
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className='flex gap-4 items-start'>
                    <FormField
                      control={form.control}
                      name={`scheduledBurns.${index}.scheduledFor`}
                      render={({ field }) => (
                        <FormItem className='flex-1'>
                          <FormLabel className='text-[#E6E6E6]'>Date & Time</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  className={cn(
                                    'w-full pl-3 text-left font-normal border-[#1E1E24] bg-black/20',
                                    !field.value && 'text-[#A3A3A3]'
                                  )}
                                >
                                  {field.value ? format(field.value, 'PPP HH:mm') : <span>Pick date and time</span>}
                                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0 border-[#1E1E24] bg-[#13141F]' align='start'>
                              <Calendar
                                mode='single'
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={date => date < new Date()}
                                initialFocus
                                className='bg-[#13141F]'
                              />
                              <div className='p-3 border-t border-[#1E1E24]'>
                                <Input
                                  type='time'
                                  onChange={e => {
                                    const [hours, minutes] = e.target.value.split(':')
                                    const date = new Date(field.value)
                                    date.setHours(parseInt(hours), parseInt(minutes))
                                    field.onChange(date)
                                  }}
                                  defaultValue={format(field.value, 'HH:mm')}
                                  className='border-[#1E1E24] bg-black/20'
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
                          <FormMessage className='text-red-500' />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`scheduledBurns.${index}.amount`}
                      render={({ field }) => (
                        <FormItem className='flex-1'>
                          <FormLabel className='text-[#E6E6E6]'>Amount</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Enter amount to burn'
                              {...field}
                              className='border-[#1E1E24] bg-black/20'
                            />
                          </FormControl>
                          <FormMessage className='text-red-500' />
                        </FormItem>
                      )}
                    />

                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='mt-8 hover:bg-red-500/10 hover:text-red-500'
                      onClick={() => remove(index)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                ))}

                {fields.length === 0 && (
                  <div className='text-sm text-[#A3A3A3] text-center py-8 border-2 border-dashed border-[#1E1E24] rounded-lg'>
                    No burn schedules added. Click &quot;Add Burn Schedule&quot; to create one.
                  </div>
                )}
              </div>
            )}

            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-[#E6E6E6]'>Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Add a message to your burn transaction'
                      className='resize-none border-[#1E1E24] bg-black/20'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-red-500' />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              className='w-full bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white font-bold hover:opacity-90 transition-opacity'
              disabled={isLoading || isSubmitting}
            >
              {isLoading ? (
                'Loading Tokens...'
              ) : isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  {burnStatus || 'Processing...'}
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
