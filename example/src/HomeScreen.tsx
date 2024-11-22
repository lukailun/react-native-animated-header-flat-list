import { useCallback } from 'react';
import { ImageBackground, StyleSheet, Text } from 'react-native';
import { AnimatedHeaderFlatList } from 'react-native-animated-header-flat-list';

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
