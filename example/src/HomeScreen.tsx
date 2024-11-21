import { StyleSheet, Text, View } from 'react-native';
import { AnimatedHeaderFlatList } from 'react-native-animated-header-flat-list';

export default function HomeScreen() {
  const data = Array.from({ length: 100 }, (_, index) => index.toString());
  const title = 'Home';

  const header = () => <View style={styles.header} />;

  return (
    <View>
      <AnimatedHeaderFlatList
        title={title}
        titleStyle={styles.headerTitle}
        HeaderComponent={header}
        data={data}
        renderItem={({ item }) => <Text>{item}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 300,
    backgroundColor: 'lightblue',
  },
  headerTitle: {
    top: 200,
    left: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
});
