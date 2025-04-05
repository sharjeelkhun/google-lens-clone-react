
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.69a8b9facbd842509cd500c70c1fa3cb',
  appName: 'google-lens-clone-react',
  webDir: 'dist',
  server: {
    url: 'https://69a8b9fa-cbd8-4250-9cd5-00c70c1fa3cb.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
    },
    Camera: {
      promptLabelHeader: "Capture Image",
      promptLabelCancel: "Cancel",
      promptLabelPhoto: "From Gallery",
      promptLabelPicture: "Take Picture"
    }
  }
};

export default config;
