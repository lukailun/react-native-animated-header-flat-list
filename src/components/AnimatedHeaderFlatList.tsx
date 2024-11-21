import {
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type ViewStyle,
} from 'react-native';
import { useLayoutEffect, useCallback, useMemo } from 'react';
import type { FlatListPropsWithLayout } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useAnimatedHeaderFlatListAnimatedStyles } from '../hooks/AnimatedHeaderFlatListAnimatedStyles';
import Animated from 'react-native-reanimated';

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

  // const headerScaleStyle = useAnimatedStyle(() => {
  //   const scale = interpolate(
  //     scrollY.value,
  //     [0, scrollY.value],
  //     [1, scrollY.value < 0 ? 1 + Math.abs(scrollY.value) / headerHeight.value : 1],
  //     'clamp'
  //   )

  //   return {
  //     transform: [
  //       {
  //         translateY: -navigationBarHeight * (scale - 1) * 2.5,
  //       },
  //       {
  //         scale: scale,
  //       },
  //     ],
  //   }
  // })

  // const headerOpacityStyle = useAnimatedStyle(() => {
  //   return {
  //     opacity: interpolate(
  //       scrollY.value,
  //       [0, headerHeight.value - navigationBarHeight],
  //       [1, 0],
  //       'clamp'
  //     ),
  //   }
  // })

  const {
    scrollHandler,
    navigationTitleAnimatedStyle,
    headerLayout,
    headerTitleLayout,
  } = useAnimatedHeaderFlatListAnimatedStyles();

  const headerTitle = useCallback(
    () => (
      <Animated.Text style={[navigationTitleAnimatedStyle, titleStyle]}>
        {title}
      </Animated.Text>
    ),
    [navigationTitleAnimatedStyle, titleStyle, title]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: headerTitle,
    });
  }, [headerTitle, navigation]);

  const ListHeaderComponent = useMemo(() => {
    return (
      <View
        onLayout={(event: LayoutChangeEvent) => {
          headerLayout.value = event.nativeEvent.layout;
        }}
      >
        <HeaderComponent style={styles.header} />
        {/* <SmoothTransitionTitle
          title={title}
          onLayout={(event: LayoutChangeEvent) => {
            console.log('event', event.nativeEvent.layout);
            headerTitleHeight.value = event.nativeEvent.layout.height;
            headerTitleWidth.value = event.nativeEvent.layout.width;
          }}
        /> */}
        <Animated.Text
          onLayout={(event: LayoutChangeEvent) => {
            headerTitleLayout.value = event.nativeEvent.layout;
          }}
          style={[styles.headerTitle, titleStyle]}
        >
          {title}
        </Animated.Text>
      </View>
    );
  }, [HeaderComponent, titleStyle, title, headerLayout, headerTitleLayout]);

  return (
    <Animated.FlatList
      ListHeaderComponent={ListHeaderComponent}
      onScroll={scrollHandler}
      {...flatListProps}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
  },
  headerTitle: {
    position: 'absolute',
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  navigationTitle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
  },
});
