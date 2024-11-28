import React from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type ListRenderItemInfo,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import { useLayoutEffect, useCallback, useMemo } from 'react';
import type { FlatListPropsWithLayout } from 'react-native-reanimated';
import { type NavigationProp } from '@react-navigation/native';
import { useAnimatedHeaderFlatListAnimatedStyles } from '../hooks/useAnimatedHeaderFlatListAnimatedStyles';
import Animated from 'react-native-reanimated';

interface Props {
  navigation: NavigationProp<any>;
  title: string;
  headerTitleStyle?: StyleProp<TextStyle>;
  navigationTitleStyle?: StyleProp<TextStyle>;
  HeaderBackground: React.ComponentType<any>;
  HeaderContent?: React.ComponentType<any>;
  StickyComponent?: React.ComponentType<any>;
}

type AnimatedHeaderFlatListProps<T> = Omit<
  FlatListPropsWithLayout<T>,
  keyof Props
> &
  Props;

export function AnimatedHeaderFlatList<T>({
  navigation,
  title,
  headerTitleStyle,
  navigationTitleStyle,
  HeaderBackground,
  HeaderContent,
  StickyComponent,
  ...flatListProps
}: AnimatedHeaderFlatListProps<T>) {
  const getFontSizeFromStyle = useCallback(
    (textStyle: StyleProp<TextStyle>) => {
      if (!textStyle) return undefined;
      if (Array.isArray(textStyle)) {
        for (const styleItem of textStyle) {
          if (
            styleItem &&
            typeof styleItem === 'object' &&
            'fontSize' in styleItem
          ) {
            return styleItem.fontSize;
          }
        }
      } else if (typeof textStyle === 'object' && 'fontSize' in textStyle) {
        return textStyle.fontSize;
      }
      return undefined;
    },
    []
  );

  const {
    scrollHandler,
    navigationBarHeight,
    headerLayout,
    setHeaderLayout,
    setHeaderTitleLayout,
    stickyComponentLayout,
    setStickyComponentLayout,
    navigationTitleAnimatedStyle,
    headerTitleAnimatedStyle,
    stickyHeaderAnimatedStyle,
    headerContentAnimatedStyle,
    headerBackgroundAnimatedStyle,
  } = useAnimatedHeaderFlatListAnimatedStyles({
    headerTitleFontSize: getFontSizeFromStyle(headerTitleStyle),
    navigationTitleFontSize: getFontSizeFromStyle(navigationTitleStyle),
  });

  const navigationTitle = useCallback(
    () => (
      <Animated.Text
        style={[navigationTitleAnimatedStyle, navigationTitleStyle]}
        numberOfLines={1}
      >
        {title}
      </Animated.Text>
    ),
    [navigationTitleAnimatedStyle, navigationTitleStyle, title]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: styles.navigationBar,
      headerShadowVisible: false,
      headerTransparent: true,
      headerTitle: navigationTitle,
      headerTitleAlign: 'center',
    });
  }, [navigationTitle, navigation]);

  const ListHeaderComponent = useMemo(() => {
    return (
      <View style={styles.headerWrapper}>
        <View
          style={[styles.headerContainer, { top: -navigationBarHeight }]}
          onLayout={(event: LayoutChangeEvent) => {
            setHeaderLayout({
              ...event.nativeEvent.layout,
              height: event.nativeEvent.layout.height + navigationBarHeight,
            });
          }}
        >
          <Animated.View style={headerBackgroundAnimatedStyle}>
            <HeaderBackground />
          </Animated.View>

          {HeaderContent && (
            <Animated.View
              style={[
                headerContentAnimatedStyle,
                styles.headerContentContainer,
              ]}
            >
              <HeaderContent />
            </Animated.View>
          )}

          <Animated.Text
            onLayout={(event: LayoutChangeEvent) => {
              setHeaderTitleLayout(event.nativeEvent.layout);
            }}
            numberOfLines={1}
            style={[
              headerTitleAnimatedStyle,
              styles.headerTitle,
              headerTitleStyle,
            ]}
          >
            {title}
          </Animated.Text>
        </View>
      </View>
    );
  }, [
    navigationBarHeight,
    headerBackgroundAnimatedStyle,
    HeaderBackground,
    HeaderContent,
    headerContentAnimatedStyle,
    headerTitleAnimatedStyle,
    headerTitleStyle,
    title,
    setHeaderLayout,
    setHeaderTitleLayout,
  ]);

  const renderItem = useCallback(
    ({ item }: { item: 'HEADER' | T }) => {
      if (item === 'HEADER') {
        return (
          <View
            style={[
              styles.stickyHeaderContainer,
              {
                height: navigationBarHeight + stickyComponentLayout.height,
              },
            ]}
          >
            <Animated.View
              style={[
                stickyHeaderAnimatedStyle,
                styles.stickyHeader,
                {
                  bottom:
                    headerLayout.height -
                    navigationBarHeight * 2 +
                    stickyComponentLayout.height,
                },
              ]}
            >
              {ListHeaderComponent}
            </Animated.View>
            {StickyComponent && (
              <View
                style={styles.stickyComponentContainer}
                onLayout={(event: LayoutChangeEvent) => {
                  setStickyComponentLayout(event.nativeEvent.layout);
                }}
              >
                <StickyComponent />
              </View>
            )}
          </View>
        );
      }
      return flatListProps.renderItem &&
        typeof flatListProps.renderItem === 'function'
        ? flatListProps.renderItem({ item } as ListRenderItemInfo<T>)
        : null;
    },
    [
      flatListProps,
      navigationBarHeight,
      stickyComponentLayout.height,
      stickyHeaderAnimatedStyle,
      headerLayout.height,
      ListHeaderComponent,
      StickyComponent,
      setStickyComponentLayout,
    ]
  );

  return (
    <>
      <StatusBar backgroundColor="transparent" translucent />
      <Animated.FlatList
        {...flatListProps}
        stickyHeaderHiddenOnScroll={false}
        stickyHeaderIndices={[1]}
        ListHeaderComponent={
          <Animated.View
            style={[
              styles.mainHeaderContainer,
              {
                height: headerLayout.height - navigationBarHeight * 2,
                transform: [{ translateY: navigationBarHeight }],
              },
            ]}
          >
            {ListHeaderComponent}
          </Animated.View>
        }
        onScroll={scrollHandler}
        data={[
          'HEADER',
          ...(Array.isArray(flatListProps.data) ? flatListProps.data : []),
        ]}
        renderItem={renderItem}
      />
    </>
  );
}

const styles = StyleSheet.create({
  navigationBar: {
    backgroundColor: 'transparent',
  },
  headerWrapper: {
    overflow: 'visible',
  },
  headerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'visible',
  },
  stickyHeaderContainer: {
    overflow: 'scroll',
  },
  stickyHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  mainHeaderContainer: {
    overflow: 'visible',
  },
  headerTitle: {
    position: 'absolute',
  },
  stickyComponentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  headerContentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
