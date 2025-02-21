import { ExecutionStatus } from '@prisma/client'
import * as React from 'react'

export interface SystemStatus {
  activeWorkers: number
  pendingTransactions: number
  failedTransactions: number
  systemLoad: number
  lastUpdated: Date
}

export interface TokenInfo {
  mint: string
  symbol: string
  name: string
  balance: number
  decimals: number
  uiAmount: number
}

export interface ToastActionElement {
  altText?: string
  action: React.ReactNode
}

export interface ToastProps {
  variant?: 'default' | 'destructive'
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  duration?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export type ExecutionStatusWithCustom = ExecutionStatus | 'PENDING' | 'RETRYING'
