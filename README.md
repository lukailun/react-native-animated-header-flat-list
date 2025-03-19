# react-native-animated-header-flat-list

[![NPM Version](https://img.shields.io/npm/v/react-native-animated-header-flat-list)](https://www.npmjs.com/package/react-native-animated-header-flat-list)
[![NPM License](https://img.shields.io/npm/l/react-native-animated-header-flat-list)](https://www.npmjs.com/package/react-native-animated-header-flat-list)
[![NPM Type Definitions](https://img.shields.io/npm/types/react-native-animated-header-flat-list)](https://www.npmjs.com/package/react-native-animated-header-flat-list)

A React Native FlatList component with an animated collapsible header, featuring parallax effects, smooth title transitions, sticky component support, and customizable styles. Built with TypeScript and separate background/content layers in header.

English | [简体中文](./README_zh.md)

## Preview

<div align="center">
  <table style='width:100%;'>
    <tr>
      <td><h4 align='center'>iOS</h4></td>
      <td><h4 align='center'>Android</h4></td>
      <td><h4 align='center'>Web</h4></td>
    </tr>
    <tr>
      <td><img width="296" height="640" src="./assets/iOS.gif" alt="iOS"></td>
      <td><img width="311" height="640" src="./assets/Android.gif" alt="Android"></td>
      <td><img width="296" height="640" src="./assets/Web.gif" alt="Web"></td>
    </tr>
  </table>
</div>

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
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started)
- [React Native Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context#getting-started)

### Additional Setup

For React Native Reanimated, Add `react-native-reanimated/plugin` plugin to your `babel.config.js`.

```js
module.exports = {
  presets: [
    ... // don't add it here :)
  ],
  plugins: [
    ...
    'react-native-reanimated/plugin',
  ],
};
```

CAUTION: `react-native-reanimated/plugin` has to be listed last.

## Usage

```tsx
import { useNavigation } from '@react-navigation/native';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { AnimatedHeaderFlatList } from 'react-native-animated-header-flat-list';

export default function HomeScreen() {
  const navigation = useNavigation();
  const data = Array.from({ length: 50 }, (_, index) => ({
    id: `item-${index}`,
    title: `Item ${index + 1}`,
    description: 'Lorem ipsum dolor sit amet',
  }));
  const title = 'Animated Title';

  const renderItem = ({
    item,
  }: {
    item: { id: string; title: string; description: string };
  }) => (
    <View style={styles.listItem}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
    </View>
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
      renderItem={renderItem}
    />
  );
}

const HeaderBackground = () => {
  const backgroundImageUrl =
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809';

  return (
    <ImageBackground
      source={{ uri: backgroundImageUrl }}
      style={styles.headerBackground}
    />
  );
};

const HeaderContent = () => {
  const avatarUrl = 'https://api.dicebear.com/7.x/avataaars/png?seed=John';

  return (
    <View style={styles.headerContent}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
    </View>
  );
};

const StickyComponent = () => (
  <Text style={styles.stickyComponent}>Sticky Item</Text>
);

const styles = StyleSheet.create({
  headerBackground: {
    backgroundColor: 'white',
    height: 300,
    width: '100%',
  },
  headerContent: {
    height: 300,
    width: '100%',
  },
  avatar: {
    position: 'absolute',
    top: 80,
    left: 10,
    backgroundColor: 'white',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'white',
  },
  headerTitle: {
    position: 'absolute',
    top: 200,
    left: 10,
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  navigationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  stickyComponent: {
    backgroundColor: 'white',
    padding: 15,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: 'white',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
});
```

### Props

| Prop                        | Type                 | Required | Description                                                                                                    |
| --------------------------- | -------------------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `navigation`                | any                  | Yes      | React Navigation navigation prop                                                                               |
| `title`                     | string               | Yes      | The title text that will animate between header and navigation bar                                             |
| `headerTitleStyle`          | StyleProp<TextStyle> | No       | Style object for the title in the header. Supports all Text style props. Position is relative to header container |
| `navigationTitleStyle`      | StyleProp<TextStyle> | No       | Style object for the title in the navigation bar. Supports all Text style props except position-related properties |
| `HeaderBackground`          | React.ComponentType  | Yes      | Component to be rendered as the header background                                                              |
| `HeaderContent`             | React.ComponentType  | No       | Component to be rendered on top of the header background. Its opacity will automatically animate based on scroll position |
| `StickyComponent`           | React.ComponentType  | No       | Optional component that sticks below the navigation bar                                                        |
| `parallax`                  | boolean              | No       | Enable/disable parallax effect for header background. Defaults to true                                         |
| `navigationBarColor`        | ColorValue           | No       | Color of NavigationBar. Its opacity will automatically animate based on scroll position                        |
| `navigationTitleTranslateX` | number               | No       | Horizontal offset for the navigation title position. Defaults to 0                                             |
| `navigationTitleTranslateY` | number               | No       | Vertical offset for the navigation title position. Defaults to 0                                               |
| `...FlatListProps`          | FlatListProps        | -        | All standard FlatList props are supported                                                                      |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
