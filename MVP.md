# Crypto Coin Burning Service (Solana) - MVP Document

## Project Overview

A web-based service that allows users to burn Solana-based tokens/coins by sending them to generated wallets, effectively removing them from circulation. The service will provide a clean interface for connecting wallets, selecting burn parameters, and executing burns with full transaction tracking.

## Objectives

- Create a secure and intuitive token burning service
- Provide transparent burning processes with verifiable results
- Track all burn transactions in a database for statistical display
- Ensure compliance with Solana network standards
- Offer variable burn options with different fee structures

## Target Users

- Token holders wanting to reduce supply
- Project teams conducting token burns
- Crypto enthusiasts supporting deflationary mechanisms

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes (or Server Actions)
- **Database**: Prisma ORM with PostgreSQL (hosted on Vercel Postgres or Supabase)
- **Blockchain**: Solana Web3.js, @solana/wallet-adapter-react
- **Hosting/Deployment**: Vercel
- **Authentication**: Next-Auth (for optional account creation)
- **State Management**: React Context or Zustand

## UI Design Requirements

### Theme Requirements

- **Primary Theme**: Dark theme as default and only option
- **Color Palette**:
  - Primary: Solana Purple (#9945FF)
  - Secondary: Solana Green (#14F195)
  - Accent: Solana Teal (#00C2FF)
  - Background: Deep Space (#13141F)
  - Surface: Dark Slate (#1E1E24)
  - Text: Solana Light (#E6E6E6)
  - Muted Text: Light Gray (#A3A3A3)
  - Error: Burnt Orange (#FF8F00)
  - Success: Solana Green (#14F195)
- **Typography**:
  - Primary Font: Inter (for UI elements and body text)
  - Display Font: Space Grotesk (for headings and statistics)
  - Monospace: JetBrains Mono (for wallet addresses and code)
- **UI Components**:
  - Custom dark-themed shadcn/ui components
  - Solana-inspired glowing effects on interactive elements
  - Burning animation effects using SVG and CSS
  - Subtle gradient backgrounds reflecting Solana brand colors

### Design System

- Create a Solana-inspired design system with:
  - Custom dark theme for shadcn/ui components
  - Tailwind CSS color extensions for Solana brand colors
  - Consistent border radiuses (rounded-lg: 8px)
  - Uniform spacing scale aligned with Tailwind defaults
  - Glassmorphism effects for card surfaces
  - Neon glow effects on hover states

## Core Features (MVP)

### 1. Wallet Connection

- Support multiple Solana wallets (Phantom, Solflare, etc.)
- Display connected wallet address and balance
- Show token balances for SPL tokens

### 2. Burn Configuration

- Token selection interface (dropdown/search of connected wallet tokens)
- Burn amount input with max balance option
- Burn type selection:
  - **Instant Burn** (0.1 SOL fee): Immediate processing
  - **Controlled Burn** (0.2 SOL fee): Configurable burn rate/schedule
- Optional burn message (stored on-chain or in database)

### 3. Burn Execution

- Generate unique burn wallet for each transaction
- Execute token transfer to burn wallet
- Display transaction confirmation with Solana explorer links
- Show burn statistics (tokens removed, percentage of supply, etc.)

### 4. Transaction History

- List of past burn transactions
- Filtering by token, date, and amount
- Transaction details view with blockchain confirmations
- Export options for transaction history

### 5. Statistics Dashboard

- Public-facing statistics for marketing website
- Real-time metrics on total tokens burned (by type and overall)
- Number of burn transactions processed
- Trending tokens being burned
- Historical burn data with visualizations

## Database Schema

### Users (Optional)

```
id: uuid (primary key)
wallet_address: string (unique)
created_at: timestamp
last_active: timestamp
```

### BurnWallets

```
id: uuid (primary key)
wallet_address: string (unique)
private_key: string (encrypted)
created_at: timestamp
is_active: boolean
```

### BurnTransactions

```
id: uuid (primary key)
user_wallet: string (foreign key to Users if registered)
token_mint: string
token_name: string
token_symbol: string
amount: decimal
burn_wallet: string (foreign key to BurnWallets)
tx_signature: string
status: enum (pending, confirmed, failed)
burn_type: enum (instant, controlled)
fee_amount: decimal
burn_message: string (optional)
created_at: timestamp
confirmed_at: timestamp (optional)
```

### BurnStatistics

```
id: uuid (primary key)
token_mint: string
token_symbol: string
total_burned: decimal
total_transactions: integer
instant_burns: integer
controlled_burns: integer
total_fees_collected: decimal
last_updated: timestamp
```

### GlobalStatistics

```
id: uuid (primary key)
total_tokens_burned: integer
total_transactions: integer
unique_tokens_burned: integer
total_fees_collected: decimal
instant_burns_count: integer
controlled_burns_count: integer
last_updated: timestamp
```

### TokenMetrics

```
id: uuid (primary key)
token_mint: string
token_symbol: string
token_name: string
daily_burn_amount: decimal
weekly_burn_amount: decimal
monthly_burn_amount: decimal
last_updated: timestamp
```

## User Flow Diagram

1. **Landing Page**

   - Service explanation
   - "Connect Wallet" button
   - Live statistics dashboard showing total burns

2. **Dashboard** (after wallet connection)

   - Wallet info (address, balance)
   - Quick access to burn form
   - User's burn history

3. **Burn Form**

   - Token selection
   - Burn amount configuration
   - Burn type selection (Instant: 0.1 SOL or Controlled: 0.2 SOL)
   - Schedule settings (if Controlled burn)
   - Optional message
   - "Review Burn" button

4. **Confirmation Screen**

   - Transaction details review
   - Fee breakdown
   - Warning about permanence of burning
   - "Confirm Burn" button

5. **Transaction Processing**

   - Loading state while transaction processes
   - Wallet interaction prompts
   - Success/failure indication
   - Transaction details with explorer links

6. **History View**
   - List of all burn transactions
   - Filtering options
   - Detailed view for each transaction

## Marketing Website & App Design

### Visual Identity

- **Dark Theme Implementation**:

  - Rich, deep space background (#13141F)
  - Elevated surface elements (#1E1E24)
  - Solana purple (#9945FF) glowing accents
  - Solana green (#14F195) for success states and CTAs
  - Animated gradient backgrounds combining Solana purple and teal
  - Burning effect animations using Solana color palette

- **Branded Elements**:
  - Custom Solana-inspired "burn" icon/logo
  - Animated flame effects in Solana gradient colors
  - Token visualization using Solana design principles
  - Card elements with subtle Solana-colored borders

### Website Structure

#### 1. Banner Section

- Hero image with animated flames/burning effect in Solana colors
- Tagline: "Reduce Supply. Increase Value. Burn with Confidence."
- Primary CTA: "Launch App" button (Solana Purple gradient)
- Secondary CTA: "Learn More" button (Solana Teal outline)
- Background: Deep space (#13141F) with subtle purple gradient
- Animated token counter showing real-time burn statistics
- Particle effects mimicking Solana network connections

#### 2. How It Works Section

- Step-by-step visual guide with Solana-themed illustrations:
  1. Connect Wallet: Icon of wallet connecting to platform (Solana Purple glow)
  2. Select Options: Visual of burn options selection interface (Solana UI style)
  3. Burn Tokens: Animation of tokens burning with Solana Green/Purple flames
  4. Verify Results: Dashboard showing completed burn (Solana design system)
- Comparison table: Instant Burn vs. Controlled Burn (dark themed with accent borders)
- Embedded demo video showing the process (dark UI with Solana colors)

#### 3. Statistics Section

- Live data dashboard with real-time metrics (dark glass cards)
- Visual charts showing Solana-colored data visualization:
  - Total tokens burned (with dollar value equivalent)
  - Burn transactions over time (gradient line charts in Solana colors)
  - Top tokens burned (pie chart with Solana color palette)
  - Recent burns ticker/feed (dark scrolling feed with accent highlights)
- "Milestones" subsection with Solana-purple achievement markers
- API integration to dynamically update without refresh
- Glowing number counters in Solana brand colors

#### 4. Benefits Section

- Dark glass card layout with key benefits:
  - Supply Reduction: "Reduce token circulation to potentially increase value" (Solana Purple icon)
  - Transparency: "Verify all burns on Solana blockchain" (Solana Teal icon)
  - Flexibility: "Choose between instant or controlled burns" (Solana Green icon)
  - Security: "Industry-leading security protocols" (Solana gradient icon)
- Visual indicators showing positive impact of burning
- Hover states with Solana-colored glows

#### 5. Testimonials Section

- Dark themed testimonial cards with Solana purple accents
- Quotes from projects/users who have used the service
- Before/after metrics from token projects (Solana green for positive metrics)
- Integration with social proof elements (Twitter feeds with dark theme overrides)
- Profile pictures with Solana-colored borders

#### 6. Token Showcase

- Dark carousel of featured tokens using Solana design language
- Statistics for each token including total burned, recent burns
- Solana-colored progress bars and metrics
- Token logos with dark theme adaptations
- Hover effects with Solana teal glows

#### 7. FAQ Section

- Collapsible dark-themed Q&A panels with Solana purple accents
- Expansion animation with Solana-colored borders
- Common questions addressing:
  - How does burning affect token value?
  - Is burning permanent?
  - How are fees calculated?
  - How can I verify my burn?
  - What happens to burned tokens?
- Custom Solana-styled accordion components

#### 8. Footer Section

- Dark gradient background blending to black
- Solana-colored social media icons with glow effects
- Documentation links with Solana purple underlines on hover
- Privacy policy and terms of service
- Contact information with Solana icon accents
- Newsletter signup with Solana-styled input fields
- Solana ecosystem logo section

### App Interface Design

#### 1. Navigation

- Deep space background (#13141F)
- Purple glowing indicators for active sections
- Connection status indicator with Solana color states
- User wallet information in dark glass card
- Custom Solana-styled shadcn/ui components

#### 2. Dashboard

- Dark theme with Solana purple accent borders
- Personalized burn history in dark tables with hover highlights
- Quick-action burn button with Solana green gradient
- Token portfolio overview in dark cards with token logos
- Personal burn statistics with Solana-colored charts
- Background subtle grid pattern in very dark purple

#### 3. Burn Interface

- Token selector with dark dropdown and Solana-styled search
- Amount input with percentage shortcuts in Solana-colored chips
- Burn type toggle with glowing Solana purple/green indicators
- Fee calculator showing real-time SOL equivalent (dark glass panel)
- Schedule configuration with Solana-styled date pickers and sliders
- Custom dark sliders with Solana gradient fills

#### 4. Confirmation Modal

- Dark glass modal with purple border glow
- Transaction summary in dark card
- Fee breakdown with Solana token icons
- Terms acknowledgment checkbox with Solana-styled components
- Secure confirmation button with Solana green gradient
- Cancel button with subtle Solana teal outline

#### 5. Transaction Status

- Progress indicator using Solana purple loading animation
- Blockchain confirmation counter with Solana-styled numerals
- Success animation with Solana green particles
- Transaction details in monospace font on dark surface
- "Share Burn" social media integration with custom dark icons
- Transaction ID display with custom copy button

#### 6. History & Analytics

- Dark-themed filterable tables with subtle row highlighting
- Export options with Solana-colored action buttons
- Personal burn analytics with dark-themed charts using Solana colors
- Token-specific burn metrics with custom visualizations
- Date range selectors with Solana UI styling
- Toggle switches with Solana purple accents

## Integration Points

### Website-App Integration

- Seamless transition from marketing site to app interface
- Consistent Solana-inspired dark theme across both platforms
- Shared statistics API endpoints
- Single sign-on capability
- Cross-promotion of features
- Consistent animation language between platforms

### Statistics API

- Public endpoints for basic statistics (for marketing site)
- Authenticated endpoints for detailed user-specific data
- WebSocket connections for real-time updates
- Caching layer for high-performance public data
- Data visualization helpers for consistent Solana-colored charts

## Security Considerations

- **Wallet Generation**: Secure, isolated process for creating burn wallets
- **Private Key Management**: Encrypt private keys at rest, never expose in client
- **Transaction Validation**: Double-check all transaction parameters
- **Rate Limiting**: Prevent abuse of the service
- **Error Handling**: Proper fallbacks for transaction failures
- **Fee Collection**: Secure handling of service fees

## Technical Implementation Details

### Wallet Connection

Implementation will use Solana Wallet Adapter to support multiple wallet providers.

### Burn Wallet Generation

Secure generation of unique burn wallets with proper key management and encryption.

### Token Transfer/Burn

Implementation of token transfer mechanics following Solana's SPL Token program standards.

### Fee Collection

Automated collection of burn fees (0.1 SOL for Instant, 0.2 SOL for Controlled) with each transaction.

### Statistics Tracking

Real-time updates to database statistics tables after each confirmed burn transaction.

## API Endpoints

### `/api/burn-wallets`

- `POST` - Generate new burn wallet
- `GET` - List active burn wallets (admin only)

### `/api/transactions`

- `POST` - Create new burn transaction
- `GET` - List user transactions
- `GET /:id` - Get transaction details

### `/api/tokens`

- `GET` - Get token information for connected wallet
- `GET /:mint/stats` - Get burn statistics for token

### `/api/statistics`

- `GET /global` - Retrieve global burning statistics
- `GET /tokens` - Get statistics for all tokens
- `GET /trending` - Get trending tokens being burned
- `GET /charts/burns-over-time` - Get time-series data for burns
- `GET /charts/token-distribution` - Get distribution data for burned tokens

## Marketing Strategy Integration

### Data for Marketing

- API endpoints specifically for marketing site statistics
- Webhook notifications for milestone achievements
- Social media sharing capabilities for significant burns
- Embeddable widgets for projects to showcase their burns

### Content Strategy Support

- Transaction data anonymization for case studies
- Burn verification tools for content creators
- Statistical reports generation for newsletters
- API for influencer tracking links

## Milestones & Timeline

### Phase 1: Core Infrastructure (Week 1-2)

- Set up Next.js project with Tailwind and shadcn/ui
- Configure Prisma and database
- Implement Solana wallet connection
- Set up dark theme and Solana color system

### Phase 2: Burn Functionality (Week 3-4)

- Implement burn wallet generation
- Create token selection and burning UI
- Develop transaction processing logic
- Implement fee collection system (0.1/0.2 SOL)

### Phase 3: Statistics System (Week 4-5)

- Build statistical tracking database
- Create API endpoints for statistics
- Develop marketing website statistics dashboard
- Implement real-time statistics updates

### Phase 4: Marketing Website Development (Week 5-6)

- Design and implement dark-themed landing page sections
- Create interactive Solana-styled statistics displays
- Develop responsive layouts for all screen sizes
- Implement SEO best practices

### Phase 5: Transaction Tracking (Week 6-7)

- Build transaction history views
- Implement filters and sorting
- Create transaction detail pages
- Finalize dark theme implementation

### Phase 6: Testing & Deployment (Week 7-8)

- Test on Solana devnet/testnet
- Security review
- Deploy to Vercel
- Final QA and user testing
- Theme consistency verification

## Future Enhancements (Post-MVP)

- Additional burn options with different fee structures
- Token-specific burn strategies
- Burn certificates (NFTs)
- Advanced analytics dashboard with expanded Solana-themed visualizations
- Burn pools for community burns
- Integration with token project dashboards
- Mobile app for on-the-go burns
- Gamification elements for repeat users
- Referral program for community growth
- Custom burn badges with Solana-inspired designs

## Metrics for Success

- Number of successful burns (instant vs. controlled)
- Total value of tokens burned
- Fee revenue generated
- User retention rate
- Average transaction completion time
- Growth in statistics displayed on marketing site
- Website to app conversion rate
- Social sharing engagement metrics
- Dark theme usability feedback
