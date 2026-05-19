import React from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartProvider } from './src/CartContext';
import { AuthProvider, useAuth } from './src/AuthContext';
import { DeliveryProvider } from './src/DeliveryContext';
import { SucursalProvider } from './src/SucursalContext';

// Importación de Pantallas
import LoginScreen from './src/screens/LoginScreen';
import InicioScreen from './src/screens/InicioScreen';
import MenuScreen from './src/screens/MenuScreen';
import CarritoScreen from './src/screens/CarritoScreen';
import MisPedidosScreen from './src/screens/MisPedidosScreen';
import SucursalScreen from './src/screens/SucursalScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIcon: {
    fontSize: 24,
  },
  tabIconOpaqueFocused: {
    opacity: 1,
  },
  tabIconOpaqueUnfocused: {
    opacity: 0.5,
  },
});

const getTabIcon = (routeName: string, focused: boolean) => {
  const iconMap: { [key: string]: string } = {
    'Inicio': '🏠',
    'Menú': '🍕',
    'Carrito': '🛒',
    'Mis Pedidos': '📋',
    'Sucursal': '📍',
  };
  const icon = iconMap[routeName] || '';
  return (
    <Text style={[styles.tabIcon, focused ? styles.tabIconOpaqueFocused : styles.tabIconOpaqueUnfocused]}>
      {icon}
    </Text>
  );
};

function MainTabs(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F0F0F0',
          height: 90,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: '#FFC107',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: { paddingBottom: 10, fontWeight: '600', fontSize: 12 },
        tabBarIcon: ({ focused }) => getTabIcon(route.name, focused),
      })}
    >
      <Tab.Screen name="Inicio" component={InicioScreen} />
      <Tab.Screen name="Menú" component={MenuScreen} />
      <Tab.Screen name="Carrito" component={CarritoScreen} />
      <Tab.Screen name="Mis Pedidos" component={MisPedidosScreen} />
      <Tab.Screen name="Sucursal" component={SucursalScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator(): React.JSX.Element {
  const { isLoading, isSignedIn } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFC107" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animationTypeForReplace: isSignedIn ? 'pop' : 'pop' }}>
        {isSignedIn ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <SucursalProvider>
        <DeliveryProvider>
          <CartProvider>
            <RootNavigator />
          </CartProvider>
        </DeliveryProvider>
      </SucursalProvider>
    </AuthProvider>
  );
}

export default App;