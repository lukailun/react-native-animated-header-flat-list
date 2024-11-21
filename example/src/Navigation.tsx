import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';

const RootStack = createNativeStackNavigator();

function Navigation() {
  return (
    <RootStack.Navigator initialRouteName="Home">
      <RootStack.Screen name="Home" component={HomeScreen} />
    </RootStack.Navigator>
  );
}

export default Navigation;
