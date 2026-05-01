# WorldView 3D

An interactive 3D globe application that displays comprehensive country information, built with Next.js, React Three Fiber, and Framer Motion.

## 🌍 Live Demo
**View the live application**: [https://jepjep123ux.github.io/3D_Worldview_Kerrrr/](https://jepjep123ux.github.io/3D_Worldview_Kerrrr/)

## ✨ Features

- **3D Globe Visualization**: Interactive 3D Earth with realistic textures and smooth rotation
- **Country Information**: Comprehensive data for all world countries including demographics, economy, and geography
- **Search Functionality**: Real-time country search with autocomplete suggestions
- **Interactive Controls**: Orbit controls with zoom, rotate, and pan capabilities
- **Modern UI**: Glassmorphism design with neon blue accents and particle effects
- **Animation System**: Smooth camera transitions and playback controls

## 🛠️ Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS with custom glassmorphism effects
- **Post-Processing**: Bloom effects for enhanced visuals
- **Deployment**: GitHub Pages

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18+)
- npm or yarn

### Local Development
```bash
# Clone the repository
git clone https://github.com/jepjep123ux/3D_Worldview_Kerrrr.git
cd 3D_Worldview_Kerrrr

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` to view the application locally.

### Build for Production
```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── page.tsx           # Main dashboard page
│   ├── globals.css        # Global styles with glassmorphism
│   └── layout.tsx         # Root layout
├── components/
│   ├── globe/
│   │   └── Globe.tsx      # 3D globe component
│   └── ui/
│       └── PlaybackControls.tsx # Timeline controls
├── types/                 # TypeScript definitions
└── lib/                   # Utility functions
```

## 🎯 How It Works

The application renders a 3D Earth model using Three.js and places markers for each country based on geographical coordinates. Users can explore the globe through mouse controls, search for specific countries, and view detailed information in modal overlays.

## 📊 Data Sources

Country information compiled from reliable sources including:
- United Nations geographical data
- World Bank economic indicators
- Official country statistics
- ISO country codes and standards

## 🎨 Features in Detail

### 3D Visualization
- Realistic Earth textures (topology and blue marble)
- Dynamic lighting with multiple light sources
- Bloom post-processing effects
- Starfield background

### User Interface
- Responsive design optimized for desktop and mobile
- Glassmorphism panels with neon blue accents
- Smooth animations and transitions
- Modal overlays for country information

### Performance
- Dynamic component loading to prevent SSR issues
- Memoized calculations for smooth performance
- Optimized 3D rendering at 60fps

## 🌐 Browser Support

- Modern browsers with WebGL support
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Three.js community for 3D graphics capabilities
- React Three Fiber for React integration
- Next.js team for the excellent framework
- Open source contributors for various libraries used

---

**Experience the world in 3D!** 🗺️✨</content>
<parameter name="filePath">README.md