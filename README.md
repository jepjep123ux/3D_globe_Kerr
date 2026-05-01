# Wildlife Tracking Dashboard

An interactive 3D wildlife tracking dashboard powered by Movebank API, built with Next.js, React Three Fiber, and Framer Motion.

## Features

- **3D Globe Visualization**: Interactive 3D Earth with realistic textures
- **Animal Tracking**: Visualize animal movement paths in 3D with animated trails
- **Playback System**: Animated timeline with play/pause controls
- **Real-time Data**: Fetches live data from Movebank API
- **Futuristic UI**: Glassmorphism panels with neon accents and particle effects
- **Interactive Controls**: Orbit controls with zoom, rotate, and pan

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS with custom glassmorphism effects
- **Data Source**: Movebank API

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Select a Study**: Choose from available public studies in the left panel
2. **View Animal Tracks**: Animal movement paths are displayed on the 3D globe
3. **Playback Animation**: Use the timeline controls at the bottom to animate movement
4. **Animal Details**: Click on an animal in the legend to view detailed statistics
5. **Interact with Globe**: Drag to rotate, scroll to zoom, right-click to pan

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── page.tsx           # Main dashboard page
│   ├── globals.css        # Global styles with glassmorphism
│   └── layout.tsx         # Root layout
├── components/
│   ├── globe/
│   │   └── Globe.tsx      # 3D globe with Three.js
│   ├── ui/
│   │   ├── AnimalPanel.tsx # Animal info panel
│   │   ├── PlaybackControls.tsx # Timeline controls
│   │   └── StudySelector.tsx # Study selection
│   └── animal/            # Animal-related components
├── services/
│   └── movebank.ts        # Movebank API service
├── types/
│   └── movebank.ts        # TypeScript type definitions
└── lib/
    └── utils.ts           # Utility functions
```

## Environment Variables

The app uses public Movebank data by default. For private studies, you can configure authentication in `src/services/movebank.ts`.

## License

MIT

## Data Source

Animal tracking data provided by [Movebank](https://www.movebank.org/) - a free, online database for animal tracking data hosted by the Max Planck Institute for Animal Behavior.
