export type RootStackParamList = {
  Home: undefined;
  WebView: undefined;
  VideoPlayer: undefined;
};

export type TabParamList = {
  WebViewTab: undefined;
  VideoPlayerTab: undefined;
};

export type NotificationType = {
  id: string;
  title: string;
  body: string;
  delay: number;
};

export type VideoStreamType = {
  id: string;
  name: string;
  url: string;
};
