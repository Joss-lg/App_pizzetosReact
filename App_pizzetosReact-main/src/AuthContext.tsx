import React, { createContext, useState, useContext, useEffect } from 'react';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import {
  getAuth,
  signInWithCredential,
  signOut,
  getIdToken,
  GoogleAuthProvider,
} from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import { setupInterceptors } from './services/apiClient';

interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  firebaseToken: string | null;
  isLoading: boolean;
  isSignedIn: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  checkStoredSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const authInstance = getAuth();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [firebaseToken, setFirebaseToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Configurar Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: Config.GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
    });
    checkStoredSession();
  }, []);

  // Configurar interceptores cuando el token cambia
  useEffect(() => {
    setupInterceptors(() => firebaseToken);
  }, [firebaseToken]);

  // Verificar si hay sesión guardada al abrir la app
  const checkStoredSession = async () => {
    try {
      setIsLoading(true);
      const storedToken = await AsyncStorage.getItem('firebaseToken');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedToken && storedUser) {
        setFirebaseToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsSignedIn(true);
      }
    } catch (error) {
      console.error('Error checking stored session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Login con Google
  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);

      // Paso 1: Obtener el ID token de Google
      await GoogleSignin.hasPlayServices();
      const signInResult = await GoogleSignin.signIn();

      if (!signInResult.idToken) {
        throw new Error('No ID token from Google Sign-In');
      }

      // Paso 2: Crear credencial Firebase con el token de Google
      const googleCredential = GoogleAuthProvider.credential(signInResult.idToken);

      // Paso 3: Autenticar con Firebase usando la credencial
      const firebaseUser = await signInWithCredential(authInstance, googleCredential);

      // Paso 4: Obtener el Firebase ID Token
      const idToken = await getIdToken(firebaseUser.user);

      // Paso 5: Guardar usuario y token en estado y AsyncStorage
      const userData: AuthUser = {
        id: firebaseUser.user.uid,
        email: firebaseUser.user.email || '',
        displayName: firebaseUser.user.displayName || 'Usuario',
        photoURL: firebaseUser.user.photoURL || undefined,
      };

      setUser(userData);
      setFirebaseToken(idToken);
      setIsSignedIn(true);

      // Guardar en AsyncStorage para persistencia
      await AsyncStorage.setItem('firebaseToken', idToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      // Cancelar el selector de cuenta de Google es un flujo normal, no un error fatal.
      if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
        return;
      }

      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login como invitado
  const loginAsGuest = async () => {
    try {
      setIsLoading(true);
      
      const guestUser: AuthUser = {
        id: `guest_${Date.now()}`,
        email: 'invitado@pizzetos.local',
        displayName: 'Invitado',
        photoURL: undefined,
      };
      
      setUser(guestUser);
      setFirebaseToken('guest_token');
      setIsSignedIn(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Guest login error:', error);
      setIsLoading(false);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      setIsLoading(true);
      const currentUser = authInstance.currentUser;

      if (currentUser) {
        await signOut(authInstance);
      }

      try {
        await GoogleSignin.signOut();
      } catch (googleSignOutError: any) {
        if (googleSignOutError?.code !== 'auth/no-current-user') {
          throw googleSignOutError;
        }
      }

      await AsyncStorage.removeItem('firebaseToken');
      await AsyncStorage.removeItem('user');

      setUser(null);
      setFirebaseToken(null);
      setIsSignedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseToken,
        isLoading,
        isSignedIn,
        loginWithGoogle,
        loginAsGuest,
        logout,
        checkStoredSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
