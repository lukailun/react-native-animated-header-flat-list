# react-native-animated-header-flat-list

A React Native FlatList component with an animated collapsible header, featuring parallax image effects, blur overlay, and smooth title transitions. Perfect for social media feeds, profiles, and content-rich screens.

## Features

- Animated collapsible header with parallax effect
- Smooth title transition from header to navigation bar
- Optional sticky component support
- Fully customizable header and title styles
- TypeScript support

## Installation

```sh
npm install react-native-animated-header-flat-list
```

## Usage


```tsx
export default function HomeScreen() {
  const data = Array.from({ length: 100 }, (_, index) => index.toString());
  const title = 'Title';
  const backgroundImageUrl =
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb';

  const HeaderComponent = useCallback(
    () => (
      <ImageBackground
        source={{ uri: backgroundImageUrl }}
        style={styles.header}
      />
    ),
    [backgroundImageUrl]
  );

  const StickyComponent = useCallback(
    () => <Text style={styles.stickyComponent}>Sticky Item</Text>,
    []
  );

  return (
    <AnimatedHeaderFlatList
      title={title}
      titleStyle={styles.headerTitle}
      HeaderComponent={HeaderComponent}
      StickyComponent={StickyComponent}
      data={data}
      renderItem={({ item }) => <Text>{item}</Text>}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'lightblue',
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


## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | string | Yes | The title text that will animate between header and navigation bar |
| `titleStyle` | ViewStyle | No | Style object for the title text |
| `HeaderComponent` | React.ComponentType | Yes | Component to be rendered as the header |
| `StickyComponent` | React.ComponentType | No | Optional component that sticks below HeaderComponent |
| `...FlatListProps` | FlatListProps | - | All standard FlatList props are supported |

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
