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
  HeaderComponent: React.ComponentType<any>;
}

type AnimatedHeaderFlatListProps<T> = Omit<
  FlatListPropsWithLayout<T>,
  keyof Props
> &
  Props;

export function AnimatedHeaderFlatList<T>({
  title,
  titleStyle,
  HeaderComponent,
  ...flatListProps
}: AnimatedHeaderFlatListProps<T>) {
  const navigation = useNavigation();

  // Hooks
  const {
    scrollHandler,
    navigationBarHeight,
    navigationTitleAnimatedStyle,
    headerTitleAnimatedStyle,
    stickyHeaderAnimatedStyle,
    headerLayout,
    headerTitleLayout,
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
    });
  }, [navigationTitle, navigation]);

  // Header Component
  const ListHeaderComponent = useMemo(() => {
    return (
      <View style={styles.headerWrapper}>
        <View
          style={[styles.headerContainer, { top: -navigationBarHeight }]}
          onLayout={(event: LayoutChangeEvent) => {
            headerLayout.value = {
              x: event.nativeEvent.layout.x,
              y: event.nativeEvent.layout.y,
              width: event.nativeEvent.layout.width,
              height: event.nativeEvent.layout.height + navigationBarHeight,
            };
          }}
        >
          <HeaderComponent style={styles.header} />
          <Animated.Text
            onLayout={(event: LayoutChangeEvent) => {
              headerTitleLayout.value = event.nativeEvent.layout;
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
    HeaderComponent,
    headerTitleAnimatedStyle,
    titleStyle,
    title,
    headerLayout,
    headerTitleLayout,
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
                height: navigationBarHeight,
              },
            ]}
          >
            <Animated.View
              style={[
                stickyHeaderAnimatedStyle,
                styles.stickyHeader,
                {
                  bottom: headerLayout.value.height - navigationBarHeight * 2,
                },
              ]}
            >
              {ListHeaderComponent}
            </Animated.View>
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
      stickyHeaderAnimatedStyle,
      headerLayout.value.height,
      ListHeaderComponent,
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
              height: headerLayout.value.height - navigationBarHeight * 2,
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
  },
  headerTitle: {
    position: 'absolute',
  },
});
