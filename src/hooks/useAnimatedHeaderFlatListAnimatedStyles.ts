import { useHeaderHeight } from '@react-navigation/elements';
import { useCallback, useEffect, useState } from 'react';
import {
  useWindowDimensions,
  type LayoutRectangle,
  type ViewStyle,
} from 'react-native';
import {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  type AnimatedStyle,
  type ScrollHandlerProcessed,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AnimatedHeaderFlatListAnimatedStylesProps = {
  headerTitleFontSize?: number;
  navigationTitleFontSize?: number;
  navigationTitleTranslateX?: number;
  navigationTitleTranslateY?: number;
};

type AnimatedHeaderFlatListAnimatedStyles = {
  scrollHandler: ScrollHandlerProcessed<Record<string, unknown>>;
  scrollY: SharedValue<number>;
  navigationBarHeight: number;
  headerLayout: LayoutRectangle;
  setHeaderLayout: (layout: LayoutRectangle) => void;
  headerTitleLayout: LayoutRectangle;
  setHeaderTitleLayout: (layout: LayoutRectangle) => void;
  stickyComponentLayout: LayoutRectangle;
  setStickyComponentLayout: (layout: LayoutRectangle) => void;
  stickyComponentAnimatedStyle: AnimatedStyle<ViewStyle>;
  stickyOverlayAnimatedStyle: AnimatedStyle<ViewStyle>;
  navigationBarAnimatedStyle: AnimatedStyle<ViewStyle>;
  navigationTitleAnimatedStyle: AnimatedStyle<ViewStyle>;
  headerTitleAnimatedStyle: AnimatedStyle<ViewStyle>;
  stickyHeaderAnimatedStyle: AnimatedStyle<ViewStyle>;
  headerContentAnimatedStyle: AnimatedStyle<ViewStyle>;
  headerBackgroundAnimatedStyle: AnimatedStyle<ViewStyle>;
  isSticky: Readonly<SharedValue<number>>;
  headerOpacity: Readonly<SharedValue<number>>;
};

export const useAnimatedHeaderFlatListAnimatedStyles = ({
  headerTitleFontSize,
  navigationTitleFontSize,
  navigationTitleTranslateX = 0,
  navigationTitleTranslateY = 0,
}: AnimatedHeaderFlatListAnimatedStylesProps): AnimatedHeaderFlatListAnimatedStyles => {
  const { width: windowWidth } = useWindowDimensions();
  const scrollY = useSharedValue(0);
  const navigationBarHeight = useHeaderHeight();
  const safeAreaInsets = useSafeAreaInsets();
  const [headerLayout, setHeaderLayout] = useState<LayoutRectangle>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [headerTitleLayout, setHeaderTitleLayout] = useState<LayoutRectangle>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [stickyComponentLayout, updateStickyComponentLayout] =
    useState<LayoutRectangle>({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
  const distanceBetweenTitleAndNavigationBar = useSharedValue(0);
  const navigationTitleOpacity = useSharedValue(0);
  const stickyComponentOpacity = useSharedValue(0);

  const stickyOverlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity:
      scrollY.value >= headerLayout.height - navigationBarHeight * 2 ? 1 : 0,
  }));

  const setStickyComponentLayout = useCallback(
    (layout: LayoutRectangle) => {
      updateStickyComponentLayout(layout);
      stickyComponentOpacity.value = layout.height > 0 ? 1 : 0;
    },
    [updateStickyComponentLayout, stickyComponentOpacity]
  );
  useEffect(() => {
    distanceBetweenTitleAndNavigationBar.value = Math.max(
      0,
      (navigationBarHeight - safeAreaInsets.top + headerTitleLayout.height) /
        2 +
        headerTitleLayout.y -
        navigationBarHeight
    );
  }, [
    headerTitleLayout,
    navigationBarHeight,
    safeAreaInsets.top,
    distanceBetweenTitleAndNavigationBar,
  ]);
  const navigationBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [0, headerLayout.height - navigationBarHeight * 2],
        [0, 1],
        'clamp'
      ),
      marginBottom: Math.max(
        0,
        headerLayout.height - navigationBarHeight * 2 - scrollY.value
      ),
      height: navigationBarHeight,
    };
  });
  const navigationTitleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: navigationTitleOpacity.value,
      transform: [
        { translateX: navigationTitleTranslateX },
        { translateY: navigationTitleTranslateY },
      ],
    };
  });
  const headerTitleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - navigationTitleOpacity.value,
      transform: [
        {
          translateX: interpolate(
            scrollY.value,
            [0, distanceBetweenTitleAndNavigationBar.value],
            [
              0,
              windowWidth / 2 -
                headerTitleLayout.x -
                headerTitleLayout.width / 2 +
                navigationTitleTranslateX,
            ],
            'clamp'
          ),
        },
        {
          translateY: interpolate(
            scrollY.value,
            [0, distanceBetweenTitleAndNavigationBar.value],
            [0, navigationTitleTranslateY],
            'clamp'
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [0, distanceBetweenTitleAndNavigationBar.value],
            [
              1,
              navigationTitleFontSize && headerTitleFontSize
                ? navigationTitleFontSize / headerTitleFontSize
                : 1,
            ],
            'clamp'
          ),
        },
      ],
    };
  });
  const isSticky = useDerivedValue((): number => {
    const stickyThreshold = headerLayout.height - navigationBarHeight * 2;
    return scrollY.value >= stickyThreshold ? 1 : 0;
  });
  const stickyHeaderAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: isSticky.value,
    };
  });
  const headerContentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [0, headerLayout.height - navigationBarHeight * 2],
        [1, 0],
        'clamp'
      ),
    };
  });
  const headerBackgroundAnimatedStyle = useAnimatedStyle(() => {
    if (scrollY.value >= 0) {
      return {};
    }
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [scrollY.value, 0],
            [scrollY.value / 2, 0],
            'clamp'
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [scrollY.value, 0],
            [
              1 - scrollY.value / (headerLayout.height - navigationBarHeight),
              1,
            ],
            'clamp'
          ),
        },
      ],
    };
  });
  const stickyComponentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: stickyComponentOpacity.value,
    };
  });
  const headerOpacity = useDerivedValue(() => {
    return interpolate(
      scrollY.value,
      [0, headerLayout.height - navigationBarHeight * 2],
      [1, 0],
      'clamp'
    );
  });
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
    navigationTitleOpacity.value =
      event.contentOffset.y >= distanceBetweenTitleAndNavigationBar.value
        ? 1
        : 0;
  });

  return {
    scrollHandler,
    scrollY,
    navigationBarHeight,
    headerLayout,
    setHeaderLayout,
    headerTitleLayout,
    setHeaderTitleLayout,
    stickyComponentLayout,
    setStickyComponentLayout,
    stickyComponentAnimatedStyle,
    stickyOverlayAnimatedStyle,
    navigationBarAnimatedStyle,
    navigationTitleAnimatedStyle,
    headerTitleAnimatedStyle,
    stickyHeaderAnimatedStyle,
    headerContentAnimatedStyle,
    headerBackgroundAnimatedStyle,
    isSticky,
    headerOpacity,
  };
};
