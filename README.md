# react-native-animated-header-flat-list

A React Native FlatList component with an animated collapsible header, featuring parallax image effects, blur overlay, and smooth title transitions. Perfect for social media feeds, profiles, and content-rich screens.

## Preview

### iOS

![iOS](./assets/iOS.mp4)

### Android

![Android](./assets/Android.mp4)

## Features

- Animated collapsible header with parallax effect
- Smooth title transition from header to navigation bar
- Optional sticky component support
- Fully customizable header and title styles
- Separate background and content layers in header
- TypeScript support

## Installation

```sh
npm install react-native-animated-header-flat-list
```

## Required Peer Dependencies

This library requires the following peer dependencies to be installed in your project:

```sh
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/elements react-native-reanimated react-native-safe-area-context
```

Make sure to follow the installation instructions for each dependency:

- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation)
- [React Native Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context#getting-started)

### Additional Setup

For React Native Reanimated, add this to your `babel.config.js`:
```js
module.exports = {
  plugins: [
    'react-native-reanimated/plugin',
  ],
};
```

## Usage

```tsx
import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { AnimatedHeaderFlatList } from 'react-native-animated-header-flat-list';

export default function HomeScreen() {
  const navigation = useNavigation();
  const data = Array.from({ length: 100 }, (_, index) => index.toString());
  const title = 'Animated Title';
  const imageUrl =
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb';

  const HeaderBackground = useCallback(
    () => <View style={styles.headerBackground} />,
    []
  );

  const HeaderContent = useCallback(
    () => (
      <ImageBackground
        source={{ uri: imageUrl }}
        style={styles.headerContent}
      />
    ),
    [imageUrl]
  );

  const StickyComponent = useCallback(
    () => <Text style={styles.stickyComponent}>Sticky Item</Text>,
    []
  );

  return (
    <AnimatedHeaderFlatList
      navigation={navigation}
      title={title}
      headerTitleStyle={styles.headerTitle}
      navigationTitleStyle={styles.navigationTitle}
      HeaderBackground={HeaderBackground}
      HeaderContent={HeaderContent}
      StickyComponent={StickyComponent}
      data={data}
      renderItem={({ item }) => <Text>{item}</Text>}
    />
  );
}

const styles = StyleSheet.create({
  headerBackground: {
    height: 250,
    backgroundColor: 'lightblue',
  },
  headerContent: {
    height: 250,
  },
  headerTitle: {
    top: 150,
    left: 10,
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  navigationTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  stickyComponent: {
    backgroundColor: 'white',
    padding: 10,
  },
});
```

### Props

| Prop                   | Type                 | Required | Description                                                                                                               |
| -------------------    | -------------------  | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `navigation`           | NavigationProp<any>  | Yes      | React Navigation navigation prop                                                                                          |
| `title`                | string               | Yes      | The title text that will animate between header and navigation bar                                                        |
| `headerTitleStyle`     | StyleProp<TextStyle> | No       | Style object for the title in the header. Supports all Text style props. Position is relative to header container         |
| `navigationTitleStyle` | StyleProp<TextStyle> | No       | Style object for the title in the navigation bar. Supports all Text style props except position-related properties        |
| `HeaderBackground`     | React.ComponentType  | Yes      | Component to be rendered as the header background                                                                         |
| `HeaderContent`        | React.ComponentType  | No       | Component to be rendered on top of the header background. Its opacity will automatically animate based on scroll position |
| `StickyComponent`      | React.ComponentType  | No       | Optional component that sticks below the navigation bar                                                                   |
| `...FlatListProps`     | FlatListProps        | -        | All standard FlatList props are supported                                                                                 |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
