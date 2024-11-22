import {
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type ListRenderItemInfo,
  type ViewStyle,
} from 'react-native';
import { useLayoutEffect, useCallback, useMemo } from 'react';
import type { FlatListPropsWithLayout } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useAnimatedHeaderFlatListAnimatedStyles } from '../hooks/AnimatedHeaderFlatListAnimatedStyles';
import Animated from 'react-native-reanimated';

// Types
interface Props {
  title: string;
  titleStyle?: ViewStyle;
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
  title,
  titleStyle,
  HeaderBackground,
  HeaderContent,
  StickyComponent,
  ...flatListProps
}: AnimatedHeaderFlatListProps<T>) {
  const navigation = useNavigation();

  // Hooks
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
  } = useAnimatedHeaderFlatListAnimatedStyles();

  // Navigation Header
  const navigationTitle = useCallback(
    () => (
      <Animated.Text
        style={[navigationTitleAnimatedStyle, titleStyle, styles.titleStyle]}
      >
        {title}
      </Animated.Text>
    ),
    [navigationTitleAnimatedStyle, titleStyle, title]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: navigationTitle,
      headerTintColor: 'red',
      headerTitleAlign: 'center',
    });
  }, [navigationTitle, navigation]);

  // Header Component
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
          <HeaderBackground style={styles.header} />
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
            style={[headerTitleAnimatedStyle, styles.headerTitle, titleStyle]}
          >
            {title}
          </Animated.Text>
        </View>
      </View>
    );
  }, [
    navigationBarHeight,
    HeaderBackground,
    HeaderContent,
    headerContentAnimatedStyle,
    headerTitleAnimatedStyle,
    titleStyle,
    title,
    setHeaderLayout,
    setHeaderTitleLayout,
  ]);

  // List Item Renderer
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

  // Main Render
  return (
    <Animated.FlatList
      {...flatListProps}
      style={styles.flatList}
      stickyHeaderHiddenOnScroll={false}
      stickyHeaderIndices={[1]}
      ListHeaderComponent={
        <View
          style={[
            styles.mainHeaderContainer,
            {
              height: headerLayout.height - navigationBarHeight * 2,
              transform: [{ translateY: navigationBarHeight }],
            },
          ]}
        >
          {ListHeaderComponent}
        </View>
      }
      onScroll={scrollHandler}
      data={[
        'HEADER',
        ...(Array.isArray(flatListProps.data) ? flatListProps.data : []),
      ]}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  titleStyle: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  headerWrapper: {
    overflow: 'visible',
  },
  headerContainer: {
    left: 0,
    right: 0,
    overflow: 'hidden',
    position: 'absolute',
  },
  stickyHeaderContainer: {
    overflow: 'scroll',
  },
  stickyHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  flatList: {
    overflow: 'scroll',
  },
  mainHeaderContainer: {
    overflow: 'visible',
  },
  header: {
    position: 'absolute',
    overflow: 'hidden',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
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
