import React, { createElement, type ReactElement } from 'react';
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
import Animated from 'react-native-reanimated';
import { useAnimatedHeaderFlatListAnimatedStyles } from '../hooks/useAnimatedHeaderFlatListAnimatedStyles';
import { getFontSizeFromStyle } from '../utils/styleUtils';

interface Props {
  navigation: NavigationProp<any>;
  title: string;
  headerTitleStyle?: StyleProp<TextStyle>;
  navigationTitleStyle?: StyleProp<TextStyle>;
  HeaderBackground: React.ComponentType<any>;
  HeaderContent?: React.ComponentType<any>;
  StickyComponent?: React.ComponentType<any>;
  parallax?: boolean;
}

type AnimatedHeaderFlatListProps<T> = Omit<
  FlatListPropsWithLayout<T>,
  keyof Props
> &
  Props;

const HEADER_ITEM = 'REACT_NATIVE_ANIMATED_HEADER_FLAT_LIST_HEADER';
const EMPTY_ITEM = 'REACT_NATIVE_ANIMATED_HEADER_FLAT_LIST_EMPTY_ITEM';

export function AnimatedHeaderFlatList<T>({
  navigation,
  title,
  headerTitleStyle,
  navigationTitleStyle,
  HeaderBackground,
  HeaderContent,
  StickyComponent,
  parallax = true,
  ...flatListProps
}: AnimatedHeaderFlatListProps<T>) {
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
          <Animated.View
            style={parallax ? headerBackgroundAnimatedStyle : undefined}
          >
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
    parallax,
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

  type CustomItem = typeof HEADER_ITEM | typeof EMPTY_ITEM | T;

  const HeaderItem = useCallback(() => {
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
  }, [
    ListHeaderComponent,
    StickyComponent,
    headerLayout.height,
    navigationBarHeight,
    setStickyComponentLayout,
    stickyComponentLayout.height,
    stickyHeaderAnimatedStyle,
  ]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<CustomItem>): ReactElement | null => {
      if (item === HEADER_ITEM) {
        return <HeaderItem />;
      }
      if (item === EMPTY_ITEM) {
        const EmptyComponent = flatListProps.ListEmptyComponent;
        if (typeof EmptyComponent === 'function') {
          return (
            <>
              {HeaderItem()}
              {createElement(EmptyComponent)}
            </>
          );
        }
        return (
          <>
            {HeaderItem()}
            {EmptyComponent as ReactElement | null}
          </>
        );
      }
      return flatListProps.renderItem &&
        typeof flatListProps.renderItem === 'function'
        ? flatListProps.renderItem({ item } as ListRenderItemInfo<T>)
        : null;
    },
    [flatListProps, HeaderItem]
  );

  const data = useMemo(() => {
    const listData = Array.isArray(flatListProps.data)
      ? flatListProps.data
      : [];
    if (listData.length === 0) {
      return [EMPTY_ITEM];
    }
    return [HEADER_ITEM, ...listData];
  }, [flatListProps.data]);

  return (
    <>
      <StatusBar backgroundColor="transparent" translucent />
      <Animated.FlatList
        {...flatListProps}
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
        data={data}
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
