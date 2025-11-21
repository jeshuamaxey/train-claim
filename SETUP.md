# Setup Instructions

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Darwin HSP API:**
   - Register at https://www.nationalraildataportal.co.uk/
   - Get your API username and password
   - Edit `lib/api/config.ts` and uncomment/set:
     ```typescript
     setDarwinConfig('your-username', 'your-password')
     ```
   - Or set environment variables: `DARWIN_USERNAME` and `DARWIN_PASSWORD`

3. **Load station data (optional - sample data included):**
   - Download station XML from National Rail Knowledgebase
   - Save as `scripts/stations.xml`
   - Run: `npx ts-node scripts/process-stations.ts`
   - This will update `data/stations.json` with full station list

4. **Run the app:**
   ```bash
   npm start
   ```

## Testing

```bash
npm test
```

## Project Structure

- `app/` - Expo Router screens (file-based routing)
- `components/` - Reusable UI components
- `lib/` - Business logic and utilities
- `data/` - Static data files (stations, operators)
- `types/` - TypeScript type definitions
- `scripts/` - Build/processing scripts

## Notes

- Station data: A sample of 10 stations is included. For production, process the full National Rail Knowledgebase XML.
- API credentials: Never commit credentials to git. Use environment variables or secure storage.
- Testing: Basic test suite included for delay calculation and station search.

