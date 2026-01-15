# WebView Video Player App

A React Native Expo application featuring WebView integration, local notifications, and HLS video streaming capabilities.

## 🚀 Features

### WebView Page
- **Website Embedding**: Loads and displays websites using React Native WebView
- **Navigation Controls**: Back, forward, and refresh functionality
- **Loading States**: Visual feedback during page loading
- **Error Handling**: Graceful error handling with retry functionality
- **Local Notifications**: Two distinct notification triggers with customizable delays

### Video Player Page
- **HLS Streaming**: Plays HLS video streams using Expo AV
- **Custom Controls**: Play, pause, seek, skip, mute, and fullscreen controls
- **Stream Switching**: Support for multiple video streams
- **Progress Tracking**: Real-time progress indication and seeking
- **Fullscreen Mode**: Native fullscreen video playback

### Navigation
- **Bottom Tab Navigation**: Seamless navigation between WebView and Video Player
- **Modern UI**: Clean, modern interface with proper styling
- **Cross-Platform**: Works on both iOS and Android

## 🛠 Technology Stack

- **React Native**: 0.74.5
- **Expo SDK**: 54.0.0
- **TypeScript**: Full TypeScript implementation
- **React Navigation**: v6 with bottom tabs
- **Expo AV**: For video playback
- **Expo Notifications**: For local notifications
- **React Native WebView**: For web content rendering

## 📱 Requirements

- **Node.js**: v16 or higher
- **Expo CLI**: Latest version
- **iOS Simulator** or **Android Emulator** (for development)
- **Expo Go** app (for testing on physical devices)

## 🔧 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd webview-video-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Run on specific platforms**:
   ```bash
   # iOS Simulator
   npm run ios
   
   # Android Emulator
   npm run android
   
   # Web Browser
   npm run web
   ```

## 🚀 Usage

### WebView Screen
1. The app loads React Native documentation by default
2. Use navigation controls (back, forward, refresh) to browse
3. Tap **"Welcome Notification"** to trigger a welcome message (2-second delay)
4. Tap **"Info Notification"** to trigger an informational message (3-second delay)
5. WebView automatically sends a notification when page loading completes

### Video Player Screen
1. Select from available video streams using the stream selector
2. Tap the video to show/hide controls
3. Use play/pause, skip forward/backward (10 seconds), and mute controls
4. Tap fullscreen to enter fullscreen mode
5. Use the progress slider to seek to specific positions

## 📋 Implementation Details

### Notification System
- **Permission Handling**: Automatically requests notification permissions on app start
- **Delayed Notifications**: Configurable delays (2-5 seconds) for different notification types
- **Notification Types**:
  - Welcome notification (2-second delay)
  - Info notification (3-second delay)
  - WebView load completion (1-second delay)

### Video Player Features
- **Multiple Stream Support**: Easy switching between different video sources
- **HLS Compatibility**: Optimized for HLS streaming protocols
- **Custom Controls**: Native-feeling controls with proper touch feedback
- **Progress Tracking**: Real-time position and duration tracking
- **Error Handling**: Graceful handling of network and playback errors

### Code Architecture
```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components
│   ├── webview/        # WebView-specific components
│   └── video/          # Video player components
├── screens/            # Main screen components
│   ├── WebViewScreen.tsx
│   └── VideoPlayerScreen.tsx
├── services/           # Business logic services
│   └── notificationService.ts
├── navigation/         # Navigation configuration
│   └── AppNavigator.tsx
├── types/             # TypeScript type definitions
│   └── index.ts
└── utils/             # Utility functions and constants
    └── constants.ts
```

## ⭐ Bonus Features Implemented

1. **WebView Load Notifications**: Automatically sends notifications when WebView finishes loading
2. **Interactive Notifications**: Notifications can be tapped (extensible for navigation)
3. **Advanced Video Controls**: 
   - Seek backward/forward (10 seconds)
   - Mute/unmute functionality
   - Progress seeking with slider
   - Fullscreen mode
4. **Multiple Stream Support**: Easy switching between different video sources

## 🧪 Testing

### Local Testing
```bash
# Start the development server
npm start

# Press 'i' for iOS simulator
# Press 'a' for Android emulator
# Press 'w' for web browser
```

### Expo Go Testing
1. Install Expo Go on your mobile device
2. Start the development server with `npm start`
3. Scan the QR code with Expo Go (Android) or Camera app (iOS)

### Features to Test
- [ ] WebView loads and displays correctly
- [ ] Navigation controls work (back, forward, refresh)
- [ ] Both notification buttons trigger notifications with proper delays
- [ ] Video player loads and plays HLS stream
- [ ] Video controls work (play, pause, seek, fullscreen)
- [ ] Stream switching functionality works
- [ ] App works in both Expo Go and native builds

## 🔧 Configuration

### Adding New Video Streams
Edit `src/utils/constants.ts` to add new video streams:

```typescript
export const VIDEO_STREAMS = [
  {
    id: '4',
    name: 'Your Stream Name',
    url: 'https://your-stream-url.m3u8',
  },
  // ... existing streams
];
```

### Changing Default Website
Modify the `DEFAULT_WEBSITE_URL` constant in `src/utils/constants.ts`:

```typescript
export const DEFAULT_WEBSITE_URL = 'https://your-website.com';
```

## 🐛 Troubleshooting

### Common Issues

1. **Video not playing**:
   - Check internet connection
   - Verify HLS stream URL is valid
   - Try switching to a different stream

2. **Notifications not appearing**:
   - Ensure app has notification permissions
   - Test on physical device (notifications don't work in iOS simulator)
   - Check notification settings in device settings

3. **WebView not loading**:
   - Check internet connection
   - Verify website URL is accessible
   - Clear app cache and restart

### Performance Optimization
- Video player automatically handles buffering and quality adjustment
- WebView caches resources for faster subsequent loads
- Notifications are scheduled efficiently to minimize battery impact

## 📄 License

This project is for educational and demonstration purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add proper tests
5. Submit a pull request

---

**Note**: This app is optimized for both development and production use with Expo Go and can be built into native apps using EAS Build.
