# HR Helper

HR Helper checks candidate qualifications and assists in recruitment processes.

## Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- NPM

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start the development server:
```bash
npm run dev
```

### Build
Build for production:
```bash
npm run build
```

## Deployment

This project is configured to automatically deploy to GitHub Pages using GitHub Actions.

### Setup
1. Go to your repository **Settings**.
2. Navigate to **Pages** (under Code and automation).
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. The deployment workflow (`.github/workflows/deploy.yml`) will automatically trigger on pushes to the `main` branch.

## File Structure & GitIgnore

- **Exclusions**: `node_modules`, `dist`, `.env` files, and system logs are excluded from the repository to ensure privacy and cleanliness.
- **Privacy**: Ensure you do not commit any `.env` files containing API keys or secrets.

