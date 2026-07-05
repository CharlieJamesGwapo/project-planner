# AI Project Planner

A simple, frontend-only Next.js app that uses Claude AI to help plan startup projects.

## Features

- **Generate Milestones**: Break down your project into clear, ordered milestones
- **Sprint Planning**: Create a 2-week sprint plan with goals and story points
- **Task Breakdown**: Get a granular list of development tasks organized by feature
- **Timeline Estimation**: Build a comprehensive project timeline with phases and deliverables
- **Risk Analysis**: Identify and analyze technical, market, and operational risks

## Getting Started

### Prerequisites

- Node.js 16+ 
- An Anthropic API key (get one at https://console.anthropic.com)

### Installation

1. Clone or navigate to the project directory
2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` based on `.env.local.example`:

```bash
cp .env.local.example .env.local
```

4. Add your Anthropic API key to `.env.local`:

```
ANTHROPIC_API_KEY=your-actual-api-key-here
```

### Running the App

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Enter your startup idea in the text area and click any of the five buttons to generate different aspects of your project plan. You can regenerate individual sections as many times as you'd like.

## How It Works

- **Frontend**: React-based UI with no database, state stored in browser memory
- **Backend**: Single API route (`/api/generate`) that calls Claude API
- **API Communication**: Each button sends your idea and the requested analysis type to the backend, which returns structured content
- **Styling**: Clean, modern gradient design with responsive layout

## Building for Production

```bash
npm run build
npm run start
```

## Project Structure

```
.
├── pages/
│   ├── api/
│   │   └── generate.js      # Claude API integration endpoint
│   ├── _app.js              # Next.js app wrapper
│   └── index.js             # Main UI component
├── styles/
│   └── globals.css          # Global styling
├── package.json
├── next.config.js
└── README.md
```

## Notes

- All API calls are made server-side; your API key is never exposed to the browser
- The app has no persistent storage—refreshing the page clears all results
- Each generation call costs API tokens; check Anthropic pricing for details
