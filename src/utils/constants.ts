export const VIDEO_STREAMS = [
  {
    id: '1',
    name: 'Test Stream 1',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  },
  {
    id: '2',
    name: 'Big Buck Bunny',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    id: '3',
    name: 'Elephant Dream',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  },
];

export const DEFAULT_WEBSITE_URL = 'https://reactnative.dev';

export const NOTIFICATION_TYPES = {
  WELCOME: {
    id: 'welcome',
    title: 'Welcome! 👋',
    body: 'Thanks for using our WebView app!',
    delay: 2000,
  },
  INFO: {
    id: 'info',
    title: 'Watch Videos! 🎬',
    body: 'Tap this notification to go to the Video Player and watch HLS streams!',
    delay: 3000,
  },
  WEBVIEW_LOADED: {
    id: 'webview_loaded',
    title: 'WebView Ready! ✅',
    body: 'The website has finished loading successfully.',
    delay: 1000,
  },
};
