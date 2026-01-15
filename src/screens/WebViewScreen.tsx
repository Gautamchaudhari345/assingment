import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { NotificationService } from '../services/notificationService';
import { NOTIFICATION_TYPES, DEFAULT_WEBSITE_URL } from '../utils/constants';

const { width, height } = Dimensions.get('window');

const WebViewScreen: React.FC = () => {
  const navigation = useNavigation();
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    // Request notification permissions when component mounts
    NotificationService.requestPermissions();

    // Set up navigation callback for fallback notifications
    NotificationService.setNavigationCallback((screen: string) => {
      console.log('Navigation callback triggered for screen:', screen);
      try {
        navigation.navigate(screen as never);
        console.log('Navigation successful to:', screen);
      } catch (navError) {
        console.error('Navigation failed:', navError);
        Alert.alert('Navigation Error', 'Could not navigate to the video player. Please use the bottom tabs.');
      }
    });

    // Set up notification listeners
    const notificationListener = NotificationService.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
      }
    );

    const responseListener = NotificationService.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification response:', response);
        
        const { data } = response.notification.request.content;
        
        // Check if this notification should trigger navigation
        if (data?.action === 'navigate' && data?.screen) {
          console.log('Real notification tapped - navigating to:', data.screen);
          // Navigate directly without another dialog
          navigation.navigate(data.screen as never);
          
          // Show a brief success message
          Alert.alert(
            '🎬 Navigating!',
            'Welcome to the Video Player!',
            [{ text: 'Awesome! 🚀', style: 'default' }]
          );
        } else {
          // For other notifications, show a simple message
          Alert.alert(
            '🔔 Notification',
            response.notification.request.content.body || 'You tapped a notification!',
            [{ text: 'OK', style: 'default' }]
          );
        }
      }
    );

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setLoading(false);
    // Bonus feature: Send notification when WebView finishes loading
    NotificationService.scheduleNotification(NOTIFICATION_TYPES.WEBVIEW_LOADED);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
    Alert.alert('Error', 'Failed to load website. Please try again.');
  };

  const handleNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
  };

  const triggerWelcomeNotification = async () => {
    await NotificationService.scheduleNotification(NOTIFICATION_TYPES.WELCOME);
    Alert.alert(
      'Notification Scheduled! ✅', 
      'Welcome notification will appear in 2 seconds!\n\nNote: Notifications work fully in development builds, but have limitations in Expo Go.',
      [{ text: 'Got it!', style: 'default' }]
    );
  };

  const triggerInfoNotification = async () => {
    await NotificationService.scheduleNotification(NOTIFICATION_TYPES.INFO);
    Alert.alert(
      'Navigation Notification Scheduled! ✅', 
      'Info notification will appear in 3 seconds!\n\n🎬 Tip: Tap the notification when it appears to navigate to the Video Player!',
      [{ text: 'Got it!', style: 'default' }]
    );
  };

  const handleRefresh = () => {
    webViewRef.current?.reload();
  };

  const handleGoBack = () => {
    if (canGoBack) {
      webViewRef.current?.goBack();
    }
  };

  const handleGoForward = () => {
    if (canGoForward) {
      webViewRef.current?.goForward();
    }
  };

  const testNavigation = () => {
    console.log('Testing direct navigation...');
    try {
      navigation.navigate('VideoPlayerTab' as never);
      Alert.alert('✅ Navigation Test', 'Direct navigation to Video Player successful!');
    } catch (error) {
      console.error('Direct navigation failed:', error);
      Alert.alert('❌ Navigation Test', 'Direct navigation failed. Check the navigation setup.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Navigation Controls */}
      <View style={styles.navigationControls}>
        <TouchableOpacity
          onPress={handleGoBack}
          disabled={!canGoBack}
          style={[styles.navButton, !canGoBack && styles.disabledButton]}
        >
          <Ionicons name="chevron-back" size={24} color={canGoBack ? '#007AFF' : '#ccc'} />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleGoForward}
          disabled={!canGoForward}
          style={[styles.navButton, !canGoForward && styles.disabledButton]}
        >
          <Ionicons name="chevron-forward" size={24} color={canGoForward ? '#007AFF' : '#ccc'} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleRefresh} style={styles.navButton}>
          <Ionicons name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={testNavigation} style={[styles.navButton, { backgroundColor: '#34C759' }]}>
          <Ionicons name="arrow-forward-circle" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* WebView */}
      <View style={styles.webViewContainer}>
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
            <Text style={styles.errorText}>Failed to load website</Text>
            <TouchableOpacity onPress={handleRefresh} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <WebView
              ref={webViewRef}
              source={{ uri: DEFAULT_WEBSITE_URL }}
              onLoadStart={handleLoadStart}
              onLoadEnd={handleLoadEnd}
              onError={handleError}
              onNavigationStateChange={handleNavigationStateChange}
              style={styles.webView}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true}
            />
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            )}
          </>
        )}
      </View>

      {/* Notification Buttons */}
      <View style={styles.notificationButtons}>
        <TouchableOpacity
          onPress={triggerWelcomeNotification}
          style={[styles.notificationButton, styles.welcomeButton]}
        >
          <Ionicons name="notifications" size={20} color="#ffffff" />
          <Text style={styles.buttonText}>Welcome Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={triggerInfoNotification}
          style={[styles.notificationButton, styles.infoButton]}
        >
          <Ionicons name="videocam" size={20} color="#ffffff" />
          <Text style={styles.buttonText}>Video Navigation</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  navigationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  navButton: {
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#f5f5f5',
  },
  webViewContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    marginTop: 16,
    marginBottom: 24,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  notificationButtons: {
    flexDirection: width > 600 ? 'row' : 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80, // Extra padding for tab bar
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    gap: width > 600 ? 16 : 12,
  },
  notificationButton: {
    flex: width > 600 ? 1 : undefined,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: width > 600 ? 0 : 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 48, // Ensure accessibility
  },
  welcomeButton: {
    backgroundColor: '#34C759',
  },
  infoButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default WebViewScreen;
