import { useCallback } from 'react';
import { ImageBackground, StyleSheet, Text } from 'react-native';
import { AnimatedHeaderFlatList } from 'react-native-animated-header-flat-list';

export default function HomeScreen() {
  const data = Array.from({ length: 100 }, (_, index) => index.toString());
  const title = 'Home';
  const backgroundImageUrl =
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb';

  const header = useCallback(
    () => (
      <ImageBackground
        source={{ uri: backgroundImageUrl }}
        style={styles.header}
      />
    ),
    [backgroundImageUrl]
  );

  return (
    <AnimatedHeaderFlatList
      title={title}
      titleStyle={styles.headerTitle}
      HeaderComponent={header}
      data={data}
      renderItem={({ item }) => <Text>{item}</Text>}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    height: 250,
  },
  headerTitle: {
    top: 150,
    left: 25,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
