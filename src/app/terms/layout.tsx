import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - TokenLoom',
  description: 'Terms of Service and usage guidelines for TokenLoom - The secure Solana token burning platform.'
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
