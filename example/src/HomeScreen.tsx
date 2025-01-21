import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { useCallback } from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { AnimatedHeaderFlatList } from 'react-native-animated-header-flat-list';

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const data = Array.from({ length: 50 }, (_, index) => ({
    id: `item-${index}`,
    title: `Item ${index + 1}`,
    description: 'Lorem ipsum dolor sit amet',
  }));
  const title = 'Animated Title';
  const backgroundImageUrl =
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809';
  const avatarUrl = 'https://api.dicebear.com/7.x/avataaars/png?seed=John';

  const HeaderBackground = useCallback(
    () => (
      <ImageBackground
        source={{ uri: backgroundImageUrl }}
        style={styles.headerBackground}
      />
    ),
    [backgroundImageUrl]
  );

  const HeaderContent = useCallback(
    () => (
      <View style={styles.headerContent}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      </View>
    ),
    [avatarUrl]
  );

  const StickyComponent = useCallback(
    () => <Text style={styles.stickyComponent}>Sticky Item</Text>,
    []
  );

  const renderItem = useCallback(
    ({
      item,
    }: {
      item: { id: string; title: string; description: string };
    }) => (
      <View style={styles.listItem}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
      </View>
    ),
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
      renderItem={renderItem}
    />
  );
}

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
