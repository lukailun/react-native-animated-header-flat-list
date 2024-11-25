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
