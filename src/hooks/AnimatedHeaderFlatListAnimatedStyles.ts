import { useHeaderHeight } from '@react-navigation/elements';
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
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AnimatedHeaderFlatListAnimatedStyles = {
  scrollHandler: ScrollHandlerProcessed<Record<string, unknown>>;
  navigationBarHeight: number;
  paddingTop: number;
  navigationTitleAnimatedStyle: AnimatedStyle<ViewStyle>;
  headerTitleAnimatedStyle: AnimatedStyle<ViewStyle>;
  headerLayout: SharedValue<LayoutRectangle>;
  headerTitleLayout: SharedValue<LayoutRectangle>;
  stickyHeaderAnimatedStyle: AnimatedStyle<ViewStyle>;
};

export const useAnimatedHeaderFlatListAnimatedStyles =
  (): AnimatedHeaderFlatListAnimatedStyles => {
    const { width: windowWidth } = useWindowDimensions();
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
    const distanceBetweenTitleAndNavigationBar =
      (navigationBarHeight -
        safeAreaInsets.top +
        headerTitleLayout.value.height) /
        2 +
      headerTitleLayout.value.y -
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
                  headerTitleLayout.value.x -
                  headerTitleLayout.value.width / 2,
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
        event.contentOffset.y >=
        headerLayout.value.height - navigationBarHeight * 2
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
      headerTitleAnimatedStyle,
      stickyHeaderAnimatedStyle,
      headerLayout,
      headerTitleLayout,
    };
  };
