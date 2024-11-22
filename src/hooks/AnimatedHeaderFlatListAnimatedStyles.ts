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
};

export const useAnimatedHeaderFlatListAnimatedStyles =
  (): AnimatedHeaderFlatListAnimatedStyles => {
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
    const [headerTitleLayout, setHeaderTitleLayout] = useState<LayoutRectangle>(
      {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      }
    );
    const [stickyComponentLayout, setStickyComponentLayout] =
      useState<LayoutRectangle>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    const distanceBetweenTitleAndNavigationBar =
      (navigationBarHeight - safeAreaInsets.top + headerTitleLayout.height) /
        2 +
      headerTitleLayout.y -
      navigationBarHeight;
    const navigationTitleOpacity = useSharedValue(0);
    const stickyHeaderOpacity = useSharedValue(0);
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
        ],
      };
    });
    const stickyHeaderAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: stickyHeaderOpacity.value,
      };
    });

    const scrollHandler = useAnimatedScrollHandler((event) => {
      scrollY.value = event.contentOffset.y;
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
    };
  };
