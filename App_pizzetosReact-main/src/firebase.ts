import auth from '@react-native-firebase/auth';

// RN Firebase lee google-services.json automáticamente, no se necesita initializeApp manual
export const firebaseAuth = auth();

