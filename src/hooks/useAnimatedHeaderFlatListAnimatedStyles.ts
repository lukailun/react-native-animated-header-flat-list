import { useHeaderHeight } from '@react-navigation/elements';
import { useState } from 'react';
import {
  useWindowDimensions,
  type LayoutRectangle,
  type ViewStyle,
} from 'react-native';
import {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type AnimatedStyle,
  type ScrollHandlerProcessed,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AnimatedHeaderFlatListAnimatedStylesProps = {
  headerTitleFontSize?: number;
  navigationTitleFontSize?: number;
};

type AnimatedHeaderFlatListAnimatedStyles = {
  scrollHandler: ScrollHandlerProcessed<Record<string, unknown>>;
  navigationBarHeight: number;
  headerLayout: LayoutRectangle;
  setHeaderLayout: (layout: LayoutRectangle) => void;
  headerTitleLayout: LayoutRectangle;
  setHeaderTitleLayout: (layout: LayoutRectangle) => void;
  stickyComponentLayout: LayoutRectangle;
  setStickyComponentLayout: (layout: LayoutRectangle) => void;
  navigationTitleAnimatedStyle: AnimatedStyle<ViewStyle>;
  headerTitleAnimatedStyle: AnimatedStyle<ViewStyle>;
  stickyHeaderAnimatedStyle: AnimatedStyle<ViewStyle>;
  headerContentAnimatedStyle: AnimatedStyle<ViewStyle>;
  headerBackgroundAnimatedStyle: AnimatedStyle<ViewStyle>;
};

export const useAnimatedHeaderFlatListAnimatedStyles = ({
  headerTitleFontSize,
  navigationTitleFontSize,
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
  const [stickyComponentLayout, setStickyComponentLayout] =
    useState<LayoutRectangle>({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
  const distanceBetweenTitleAndNavigationBar =
    (navigationBarHeight - safeAreaInsets.top + headerTitleLayout.height) / 2 +
    headerTitleLayout.y -
    navigationBarHeight;
  const navigationTitleOpacity = useSharedValue(0);
  const stickyHeaderOpacity = useSharedValue(0);
  const headerScale = useSharedValue(1);
  const headerTranslateY = useSharedValue(navigationBarHeight);
  const navigationTitleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: navigationTitleOpacity.value,
    };
  });
  const headerTitleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - navigationTitleOpacity.value,
      transform: [
        {
          translateX: interpolate(
            scrollY.value,
            [0, distanceBetweenTitleAndNavigationBar],
            [
              0,
              windowWidth / 2 -
                headerTitleLayout.x -
                headerTitleLayout.width / 2,
            ],
            'clamp'
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [0, distanceBetweenTitleAndNavigationBar],
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
  const stickyHeaderAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: stickyHeaderOpacity.value,
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
      return { transform: [{ translateY: headerTranslateY.value }] };
    }
    return {
      transform: [
        {
          scale: headerScale.value,
        },
        {
          translateY: headerTranslateY.value,
        },
      ],
    };
  });
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
    headerScale.value =
      scrollY.value < 0
        ? 1 - scrollY.value / (headerLayout.height - navigationBarHeight)
        : 1;
    headerTranslateY.value =
      scrollY.value < 0
        ? navigationBarHeight +
          ((headerLayout.height - navigationBarHeight) *
            (1 - headerScale.value)) /
            2
        : navigationBarHeight;
    navigationTitleOpacity.value =
      event.contentOffset.y >= distanceBetweenTitleAndNavigationBar ? 1 : 0;
    stickyHeaderOpacity.value =
      event.contentOffset.y >= headerLayout.height - navigationBarHeight * 2
        ? 1
        : 0;
  });

  return {
    scrollHandler,
    navigationBarHeight,
    headerLayout,
    setHeaderLayout,
    headerTitleLayout,
    setHeaderTitleLayout,
    stickyComponentLayout,
    setStickyComponentLayout,
    navigationTitleAnimatedStyle,
    headerTitleAnimatedStyle,
    stickyHeaderAnimatedStyle,
    headerContentAnimatedStyle,
    headerBackgroundAnimatedStyle,
  };
};
