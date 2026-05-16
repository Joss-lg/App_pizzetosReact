import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../AuthContext';
import { statusCodes } from '@react-native-google-signin/google-signin';

interface Props {
  navigation: any;
}

export default function LoginScreen({ navigation: _navigation }: Props) {
  const { loginWithGoogle, loginAsGuest, isLoading } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLocalLoading(true);
      await loginWithGoogle();

      // RootNavigator detecta isSignedIn=true y navega automáticamente a Main
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Inicio de sesión cancelado', 'El proceso fue cancelado por el usuario.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Inicio en progreso', 'Ya hay un inicio de sesión en curso.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play Services no disponible', 'Instala o actualiza Google Play Services.');
      } else {
        Alert.alert('Error Google', error.message || 'No se pudo iniciar sesión con Google.');
      }
    } finally {
      setLocalLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      setLocalLoading(true);
      await loginAsGuest();
      // RootNavigator detecta isSignedIn=true y navega automáticamente a Main
    } catch (error: any) {
      Alert.alert('Error Invitado', error.message || 'No se pudo iniciar sesión como invitado.');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require('../assets/img/pizzetos.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Bienvenido a Pizzetos</Text>
        <Text style={styles.subtitle}>Inicia sesión con tu cuenta de Google.</Text>

        <TouchableOpacity
          style={[styles.button, styles.googleButton]}
          onPress={handleGoogleLogin}
          disabled={localLoading || isLoading}
        >
          {localLoading || isLoading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Text style={styles.buttonText}>Iniciar con Gmail</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.guestButton]}
          onPress={handleGuestLogin}
          disabled={localLoading || isLoading}
        >
          {localLoading || isLoading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Text style={styles.buttonText}>Sesión Invitado</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.note}>
          Si ya tienes una cuenta en Pizzetos, inicia sesión con Google.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7E6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 10,
  },
  logo: {
    width: 220,
    height: 70,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 14,
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  guestButton: {
    backgroundColor: '#888888',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  note: {
    marginTop: 10,
    color: '#999',
    textAlign: 'center',
    fontSize: 13,
  },
});
