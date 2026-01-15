import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, AVPlaybackStatus, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

import { VIDEO_STREAMS } from '../utils/constants';
import { VideoStreamType } from '../types';

const { width, height } = Dimensions.get('window');

const VideoPlayerScreen: React.FC = () => {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus>({} as AVPlaybackStatus);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentStream, setCurrentStream] = useState<VideoStreamType>(VIDEO_STREAMS[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Hide controls after 3 seconds of inactivity
    const timer = setTimeout(() => {
      if (showControls && status.isLoaded && status.isPlaying) {
        setShowControls(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [showControls, status]);

  const handlePlaybackStatusUpdate = (playbackStatus: AVPlaybackStatus) => {
    setStatus(playbackStatus);
    if (playbackStatus.isLoaded && isLoading) {
      setIsLoading(false);
    }
  };

  const handleVideoPress = () => {
    setShowControls(true);
  };

  const togglePlayPause = async () => {
    if (status.isLoaded) {
      if (status.isPlaying) {
        await videoRef.current?.pauseAsync();
      } else {
        await videoRef.current?.playAsync();
      }
    }
  };

  const toggleMute = async () => {
    if (status.isLoaded) {
      await videoRef.current?.setIsMutedAsync(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = async () => {
    if (videoRef.current) {
      if (isFullscreen) {
        await videoRef.current.dismissFullscreenPlayer();
        setIsFullscreen(false);
        StatusBar.setHidden(false);
      } else {
        await videoRef.current.presentFullscreenPlayer();
        setIsFullscreen(true);
        StatusBar.setHidden(true);
      }
    }
  };

  const onSeek = async (value: number) => {
    if (status.isLoaded && status.durationMillis) {
      const seekPosition = value * status.durationMillis;
      await videoRef.current?.setPositionAsync(seekPosition);
    }
  };

  const skipBackward = async () => {
    if (status.isLoaded && status.positionMillis) {
      const newPosition = Math.max(0, status.positionMillis - 10000); // 10 seconds back
      await videoRef.current?.setPositionAsync(newPosition);
    }
  };

  const skipForward = async () => {
    if (status.isLoaded && status.positionMillis && status.durationMillis) {
      const newPosition = Math.min(status.durationMillis, status.positionMillis + 10000); // 10 seconds forward
      await videoRef.current?.setPositionAsync(newPosition);
    }
  };

  const switchStream = (stream: VideoStreamType) => {
    setCurrentStream(stream);
    setIsLoading(true);
    Alert.alert('Stream Changed', `Switched to ${stream.name}`);
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getProgressValue = () => {
    if (status.isLoaded && status.durationMillis && status.positionMillis) {
      return status.positionMillis / status.durationMillis;
    }
    return 0;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Stream Selector */}
      <View style={styles.streamSelector}>
        <Text style={styles.streamTitle}>Select Stream:</Text>
        <View style={styles.streamButtons}>
          {VIDEO_STREAMS.map((stream) => (
            <TouchableOpacity
              key={stream.id}
              onPress={() => switchStream(stream)}
              style={[
                styles.streamButton,
                currentStream.id === stream.id && styles.activeStreamButton,
              ]}
            >
              <Text
                style={[
                  styles.streamButtonText,
                  currentStream.id === stream.id && styles.activeStreamButtonText,
                ]}
              >
                {stream.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Video Player */}
      <View style={styles.videoContainer}>
        <TouchableOpacity
          style={styles.videoWrapper}
          onPress={handleVideoPress}
          activeOpacity={1}
        >
          <Video
            ref={videoRef}
            source={{ uri: currentStream.url }}
            rate={1.0}
            volume={1.0}
            isMuted={isMuted}
            shouldPlay={false}
            isLooping={false}
            resizeMode={ResizeMode.CONTAIN}
            style={styles.video}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          />

          {/* Loading Overlay */}
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <Text style={styles.loadingText}>Loading video...</Text>
            </View>
          )}

          {/* Controls Overlay */}
          {showControls && !isLoading && (
            <View style={styles.controlsOverlay}>
              {/* Top Controls */}
              <View style={styles.topControls}>
                <Text style={styles.videoTitle}>{currentStream.name}</Text>
                <TouchableOpacity onPress={toggleFullscreen} style={styles.fullscreenButton}>
                  <Ionicons
                    name={isFullscreen ? 'contract' : 'expand'}
                    size={24}
                    color="#ffffff"
                  />
                </TouchableOpacity>
              </View>

              {/* Center Controls */}
              <View style={styles.centerControls}>
                <TouchableOpacity onPress={skipBackward} style={styles.skipButton}>
                  <Ionicons name="play-skip-back" size={32} color="#ffffff" />
                </TouchableOpacity>

                <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
                  <Ionicons
                    name={status.isLoaded && status.isPlaying ? 'pause' : 'play'}
                    size={48}
                    color="#ffffff"
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={skipForward} style={styles.skipButton}>
                  <Ionicons name="play-skip-forward" size={32} color="#ffffff" />
                </TouchableOpacity>
              </View>

              {/* Bottom Controls */}
              <View style={styles.bottomControls}>
                <Text style={styles.timeText}>
                  {status.isLoaded && status.positionMillis
                    ? formatTime(status.positionMillis)
                    : '0:00'}
                </Text>

                <Slider
                  style={styles.progressSlider}
                  minimumValue={0}
                  maximumValue={1}
                  value={getProgressValue()}
                  onSlidingComplete={onSeek}
                  minimumTrackTintColor="#007AFF"
                  maximumTrackTintColor="#ffffff"
                  thumbTintColor="#007AFF"
                />

                <Text style={styles.timeText}>
                  {status.isLoaded && status.durationMillis
                    ? formatTime(status.durationMillis)
                    : '0:00'}
                </Text>

                <TouchableOpacity onPress={toggleMute} style={styles.muteButton}>
                  <Ionicons
                    name={isMuted ? 'volume-mute' : 'volume-high'}
                    size={24}
                    color="#ffffff"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Video Information */}
      <View style={styles.videoInfo}>
        <Text style={styles.infoTitle}>Current Stream</Text>
        <Text style={styles.infoText}>{currentStream.name}</Text>
        <Text style={styles.infoUrl}>{currentStream.url}</Text>
        
        {status.isLoaded && (
          <View style={styles.statusInfo}>
            <Text style={styles.statusText}>
              Status: {status.isPlaying ? 'Playing' : 'Paused'} | 
              Volume: {isMuted ? 'Muted' : 'On'} |
              Duration: {status.durationMillis ? formatTime(status.durationMillis) : 'Unknown'}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  streamSelector: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  streamTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  streamButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  streamButton: {
    backgroundColor: '#333333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#555555',
  },
  activeStreamButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  streamButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  activeStreamButtonText: {
    fontWeight: '700',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoWrapper: {
    flex: 1,
    position: 'relative',
  },
  video: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 44 : 16,
    paddingBottom: 16,
  },
  videoTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  fullscreenButton: {
    padding: 8,
  },
  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  skipButton: {
    padding: 12,
  },
  playButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 40,
    padding: 16,
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  timeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    minWidth: 40,
  },
  progressSlider: {
    flex: 1,
    height: 40,
  },
  muteButton: {
    padding: 8,
  },
  videoInfo: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80, // Extra padding for tab bar
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  infoTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoText: {
    color: '#cccccc',
    fontSize: 14,
    marginBottom: 2,
  },
  infoUrl: {
    color: '#888888',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  statusInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  statusText: {
    color: '#aaaaaa',
    fontSize: 12,
  },
});

export default VideoPlayerScreen;
