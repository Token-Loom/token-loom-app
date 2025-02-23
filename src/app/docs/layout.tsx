import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documentation - TokenLoom',
  description:
    'Technical documentation and integration guides for TokenLoom - The secure Solana token burning platform.'
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
