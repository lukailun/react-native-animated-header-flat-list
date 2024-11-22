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

## Usage

```tsx
import { useCallback } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { AnimatedHeaderFlatList } from 'react-native-animated-header-flat-list';

export default function HomeScreen() {
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
      title={title}
      titleStyle={styles.headerTitle}
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
  stickyComponent: {
    backgroundColor: 'white',
    padding: 10,
  },
});
```

### Props

| Prop               | Type                | Required | Description                                                                                                               |
| ------------------ | ------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `title`            | string              | Yes      | The title text that will animate between header and navigation bar                                                        |
| `titleStyle`       | ViewStyle           | No       | Style object for the title text                                                                                           |
| `HeaderBackground` | React.ComponentType | Yes      | Component to be rendered as the header background                                                                         |
| `HeaderContent`    | React.ComponentType | No       | Component to be rendered on top of the header background. Its opacity will automatically animate based on scroll position |
| `StickyComponent`  | React.ComponentType | No       | Optional component that sticks below the navigation bar                                                                   |
| `...FlatListProps` | FlatListProps       | -        | All standard FlatList props are supported                                                                                 |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
