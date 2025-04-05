
# Google Lens Clone with React & Capacitor

This project is a pixel-perfect clone of Google's image search interface, built using React.js and Capacitor.

## Features

- **Google app Homepage** with search bar, sign-in functionality, and realtime feed
- **Google Lens search** with text, voice, and camera input
- **Full camera integration** for taking photos directly in the app
- **Image upload** from gallery
- **Search results display** with visual matches and shopping results

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

### Building for Mobile

1. Build the project
```bash
npm run build
```

2. Add platforms
```bash
npx cap add android
npx cap add ios
```

3. Sync the web code to the native projects
```bash
npx cap sync
```

4. Open native IDEs
```bash
npx cap open android
npx cap open ios
```

## Project Structure

- `/src/pages`: Main page components
- `/src/components`: Reusable UI components
- `/src/context`: React context for state management
- `/src/data`: Mock data for search results

## Implementation Notes

This clone carefully recreates the Google Lens experience with:

1. **Pixel-perfect UI** matching Google's design language
2. **Interactive camera integration** using browser APIs
3. **Responsive design** that works on all device sizes
4. **Smooth animations** for a polished user experience

## Deployment

The app can be deployed as a web application or compiled into native apps for Android and iOS using Capacitor.

## Built With

- [React](https://reactjs.org/)
- [Capacitor](https://capacitorjs.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/)
- [shadcn/ui](https://ui.shadcn.com/)

## License

This project is for educational purposes only. Google and Google Lens are trademarks of Google LLC.
