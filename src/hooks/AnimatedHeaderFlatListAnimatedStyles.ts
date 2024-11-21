import { useHeaderHeight } from '@react-navigation/elements';
import type { LayoutRectangle, ViewStyle } from 'react-native';
import {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type AnimatedStyle,
  type ScrollHandlerProcessed,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AnimatedHeaderFlatListAnimatedStyles = {
  scrollHandler: ScrollHandlerProcessed<Record<string, unknown>>;
  navigationBarHeight: number;
  paddingTop: number;
  navigationTitleAnimatedStyle: AnimatedStyle<ViewStyle>;
  navigationTitleOpacity: SharedValue<number>;
  headerLayout: SharedValue<LayoutRectangle>;
  headerTitleLayout: SharedValue<LayoutRectangle>;
};

export const useAnimatedHeaderFlatListAnimatedStyles =
  (): AnimatedHeaderFlatListAnimatedStyles => {
    const scrollY = useSharedValue(0);

    const navigationBarHeight = useHeaderHeight();
    const safeAreaInsets = useSafeAreaInsets();
    const headerLayout = useSharedValue<LayoutRectangle>({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
    const headerTitleLayout = useSharedValue<LayoutRectangle>({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
    const navigationTitleOpacity = useSharedValue(0);
    const navigationTitleAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: navigationTitleOpacity.value,
      };
    });

    const scrollHandler = useAnimatedScrollHandler((event) => {
      scrollY.value = event.contentOffset.y;
      navigationTitleOpacity.value =
        event.contentOffset.y >=
        (navigationBarHeight - safeAreaInsets.top + 20) / 2
          ? 1
          : 0;
      // navigationTitleOpacity.value =
      //   event.contentOffset.y >=
      //   (navigationBarHeight - safeAreaInsets.top + channelNameHeight.value) / 2 +
      //     24
      //     ? 1
      //     : 0
      // channelHeaderBottomOpacity.value =
      //   event.contentOffset.y >= channelHeaderHeight.value - navigationBarHeight
      //     ? 1
      //     : 0
    });

    return {
      scrollHandler,
      navigationBarHeight,
      paddingTop: navigationBarHeight + safeAreaInsets.top,
      navigationTitleAnimatedStyle,
      navigationTitleOpacity,
      headerLayout,
      headerTitleLayout,
    };
  };
