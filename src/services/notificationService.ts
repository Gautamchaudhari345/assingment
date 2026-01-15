import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';
import { NotificationType } from '../types';

// Configure how notifications are handled when the app is running
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  static navigationCallback: ((screen: string) => void) | null = null;

  static setNavigationCallback(callback: (screen: string) => void) {
    this.navigationCallback = callback;
  }

  static async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      alert('Must use physical device for Push Notifications');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync(); 
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return true;
  }

  static async scheduleNotification(notification: NotificationType): Promise<void> {
    try {
      if (notification.delay <= 0) {
        // For immediate notifications, use null trigger
        await Notifications.scheduleNotificationAsync({
          content: {
            title: notification.title,
            body: notification.body,
            data: { 
              notificationId: notification.id,
              action: 'navigate',
              screen: 'VideoPlayerTab',
            },
          },
          trigger: null,
        });
      } else {
        // For delayed notifications, try immediate presentation with a timeout
        setTimeout(async () => {
          try {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: notification.title,
                body: notification.body,
                data: { 
                  notificationId: notification.id,
                  action: 'navigate',
                  screen: 'VideoPlayerTab',
                },
              },
              trigger: null, // Present immediately after timeout
            });
            console.log('Delayed notification presented');
          } catch (delayedError) {
            console.error('Delayed notification error:', delayedError);
            // Final fallback
            Alert.alert(
              notification.title,
              notification.body + '\n\n(Delayed notification fallback)',
              [{ text: 'OK' }]
            );
          }
        }, notification.delay);
      }
    } catch (error) {
      console.error('Error scheduling notification:', error);
      // Enhanced fallback: Show an alert that simulates the notification
      setTimeout(() => {
        Alert.alert(
          `🔔 ${notification.title}`,
          `${notification.body}\n\n📱 This is a notification fallback.\n(Real notifications have limited support in Expo Go)\n\n🎬 Tap "Go to Video Player" to navigate!`,
          [
            {
              text: 'Go to Video Player 🎬',
              style: 'default',
              onPress: () => {
                console.log('Fallback: Navigating to video player');
                // Try to use the navigation callback if available
                if (NotificationService.navigationCallback) {
                  NotificationService.navigationCallback('VideoPlayerTab');
                } else {
                  Alert.alert('Navigation', 'Navigation callback not available. Please use the bottom tabs to navigate.');
                }
              },
            },
            { text: 'Dismiss', style: 'cancel' },
          ]
        );
      }, Math.max(notification.delay, 500)); // Ensure at least 500ms delay
    }
  }

  static async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  static addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.EventSubscription {
    return Notifications.addNotificationReceivedListener(listener);
  }

  static addNotificationResponseReceivedListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.EventSubscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }
}
