# Delay Refund — "Claim Now"

An app that tells commuters exactly how much money they're owed from a delayed train journey and gets them to the claim form in one tap.

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (installed globally or via npx)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure Darwin HSP API credentials:
   - Register at [National Rail Data Portal](https://www.nationalraildataportal.co.uk/)
   - Get your API username and password
   - Set them in your app (see API Configuration below)

3. Load station data:
   - Download station list from [National Rail Knowledgebase](https://www.nationalrail.co.uk/stations_destinations/48541.aspx)
   - Save as `scripts/stations.xml`
   - Run: `npx ts-node scripts/process-stations.ts`
   - This generates `data/stations.json` with ~2,500 UK stations

### API Configuration

Create a file `lib/api/config.ts` (or set environment variables):

```typescript
import { setDarwinConfig } from './darwin'

// Set your credentials
setDarwinConfig('your-username', 'your-password')
```

Or use environment variables and load them at app startup.

## Development

```bash
# Start Expo dev server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web

# Run tests
npm test
```

## Project Structure

```
train-claim/
├── app/                 # Expo Router screens
│   ├── _layout.tsx     # Root layout with Tamagui provider
│   ├── index.tsx       # Station selection (home)
│   ├── trains.tsx      # Train selection screen
│   └── delay.tsx       # Delay & compensation display
├── components/         # Reusable UI components
│   ├── StationInput.tsx
│   ├── ServiceCard.tsx
│   └── DelayCard.tsx
├── lib/               # Business logic
│   ├── api/
│   │   └── darwin.ts  # Darwin HSP API client
│   ├── stations.ts   # Station search utilities
│   ├── operators.ts   # TOC/operator mapping
│   └── delay-calc.ts  # Delay compensation calculation
├── data/              # Static data
│   ├── stations.json # Station list (processed)
│   └── operators.json # TOC → Delay Repay URL mapping
├── types/             # TypeScript type definitions
└── scripts/           # Build/processing scripts
    └── process-stations.ts
```

## Features

### Core Flow

1. **Enter Journey**: Select origin, destination, and date
2. **Select Train**: View scheduled services and select your train
3. **See Delay**: View delay duration and compensation percentage
4. **Claim Now**: Open operator's Delay Repay portal

### Compensation Rules

- 15-29 minutes: 25% of single fare
- 30-59 minutes: 50% of single fare
- 60-119 minutes: 100% of single fare
- 120+ minutes: 100% of return fare

### Supported Operators

The app includes Delay Repay URLs for ~20 major UK train operators, including:
- Northern Railway (with WebView support)
- Avanti West Coast
- Great Western Railway
- South Western Railway
- And more...

## Testing

Tests are set up with Jest and React Native Testing Library:

```bash
npm test
npm run test:watch
```

## Out of Scope (v1)

- User accounts / saved journeys (basic recent journeys only)
- Push notifications
- Automatic journey detection
- Season ticket tracking
- Claim submission on behalf of user
- Multi-leg journeys
- Historical claim tracking
- Northern Railway pre-fill integration (opens portal only)

## License

MIT

