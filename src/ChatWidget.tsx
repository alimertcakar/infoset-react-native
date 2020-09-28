/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { URL } from 'react-native-url-polyfill';
import WebView, {
  WebViewMessageEvent,
  WebViewNavigation,
} from 'react-native-webview';
import type { ChatMessageTypes, ChatWidgetProps } from './types';

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  isVisible = false,
  apiKey,
  iosKey,
  androidKey,
  color = '#fff',
  onNewMessage,
  onWidgetWillShow,
  onWidgetShow,
  onWidgetWillHide,
  onWidgetHide,
  handleUrls,
  user,
  tags,
}) => {
  const screenHeight = Dimensions.get('screen').height;
  const webViewRef = useRef<WebView>(null);
  const [initiated, setInitiated] = useState<boolean>(false);
  const [isUIReady, setIsUIReady] = useState<boolean>(false);
  const animatedTopValue = useRef(new Animated.Value(0)).current;

  function onCaptureWebViewEvent(event: WebViewMessageEvent) {
    const {
      messageType,
    }: {
      messageType: ChatMessageTypes;
    } = JSON.parse(event.nativeEvent.data);
    if (messageType) {
      if (messageType === 'uiReady') {
        setIsUIReady(true);
      } else if (messageType === 'newMessage') {
        onNewMessage?.();
      } else if (messageType === 'hideChatWindow') {
        hideWidget();
      }
    }
  }

  useEffect(() => {
    if (isVisible) {
      if (!initiated) {
        setInitiated(true);
      }
    }
  }, [isVisible, initiated]);

  const showWidget = useCallback(() => {
    Animated.parallel([
      Animated.timing(animatedTopValue, {
        toValue: 0,
        duration: 280,
        useNativeDriver: false,
      }),
    ]).start((result) => {
      if (result.finished) {
        onWidgetShow?.();
      }
    });
  }, [animatedTopValue, onWidgetShow]);

  const hideWidget = useCallback(() => {
    Animated.parallel([
      Animated.timing(animatedTopValue, {
        toValue: screenHeight,
        duration: 280,
        useNativeDriver: false,
      }),
    ]).start((result) => {
      if (result.finished) {
        onWidgetHide?.();
      }
    });
  }, [animatedTopValue, onWidgetHide, screenHeight]);

  useEffect(() => {
    if (isVisible) {
      onWidgetWillShow?.();
      showWidget();
    } else {
      onWidgetWillHide?.();
      hideWidget();
    }
  }, [
    isVisible,
    animatedTopValue,
    screenHeight,
    onWidgetWillHide,
    onWidgetHide,
    onWidgetWillShow,
    onWidgetShow,
    hideWidget,
    showWidget,
  ]);

  if (
    (!(iosKey && iosKey !== '') && !(androidKey && androidKey !== '')) ||
    !(apiKey && apiKey !== '')
  ) {
    return null;
  }

  if (!initiated) {
    return null;
  }

  let isColorLightish = true;
  if (color) {
    if (
      (color.startsWith('#') && !color.includes('#f')) ||
      color.replace(/' '/g, '').includes('255,255,255')
    ) {
      isColorLightish = false;
    }
  }

  // build url
  let chatURL = new URL('https://cdn.infoset.app/chat/open_chat.html');
  chatURL.searchParams.append('platform', Platform.OS);
  chatURL.searchParams.append('apiKey', apiKey);

  // append os key
  if (iosKey) {
    chatURL.searchParams.append('iosKey', iosKey);
  } else if (androidKey) {
    chatURL.searchParams.append('androidKey', androidKey);
  }

  // append user
  if (user?.id) {
    Object.entries(user).forEach(
      (entry) =>
        entry[1] && chatURL.searchParams.append(entry[0], String(entry[1]))
    );
  }

  // append tags
  if (tags && tags.length) {
    chatURL.searchParams.append('tags', tags.join(','));
  }

  const onShouldStartLoadWithRequest = (event: WebViewNavigation) => {
    const { url } = event;

    if (url !== chatURL.toString()) {
      if (handleUrls) {
        handleUrls(url);
      } else {
        Linking.openURL(url);
      }
      return false;
    }

    return true;
  };

  return (
    <Animated.View
      style={[
        styles.animatedViewBase,
        {
          top: animatedTopValue,
        },
      ]}
    >
      <StatusBar
        barStyle={!isColorLightish ? 'light-content' : 'dark-content'}
      />
      {!isUIReady ? (
        <View style={[styles.loadingView, { backgroundColor: color }]}>
          <TouchableOpacity
            onPress={() => onWidgetHide?.()}
            style={[
              styles.closeBtn,
              {
                backgroundColor: 'rgba(0, 0, 0, .2)',
              },
            ]}
          >
            <Text
              style={{ fontSize: 20, color: isColorLightish ? '#000' : '#fff' }}
            >
              X
            </Text>
          </TouchableOpacity>
          <ActivityIndicator
            size="large"
            color={isColorLightish ? 'rgba(0,0,0,.4)' : '#fff'}
          />
        </View>
      ) : (
        <SafeAreaView
          style={[
            styles.flexContainer,
            {
              backgroundColor: color || '#fff',
            },
          ]}
        >
          <WebView
            ref={webViewRef}
            // renderLoading={() => (
            //   <ActivityIndicator
            //     color={isColorLightish ? 'rgba(0,0,0,.4)' : '#fff'}
            //     size="large"
            //     style={[
            //       styles.webViewIndicator,
            //       { backgroundColor: color || '#fff' },
            //     ]}
            //   />
            // )}
            style={styles.flexContainer}
            source={{ uri: chatURL.toString() }}
            startInLoadingState
            javaScriptEnabled
            onMessage={onCaptureWebViewEvent}
            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          />
        </SafeAreaView>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  animatedViewBase: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 9999999999,
  },
  webViewIndicator: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
  loadingView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  closeBtn: {
    position: 'absolute',
    top: 76,
    right: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
});
