import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DeliveryData {
  nombreCompleto: string;
  email: string;
  telefonoContacto: string;
  direccion: string;
  apartamento?: string;
  referencias?: string;
}

interface DeliveryContextType {
  deliveryData: DeliveryData;
  setDeliveryData: (data: Partial<DeliveryData>) => void;
  loadDeliveryData: () => Promise<void>;
  saveDeliveryData: () => Promise<void>;
  resetDeliveryData: () => void;
}

const DeliveryContext = createContext<DeliveryContextType | null>(null);

export const DeliveryProvider = ({ children }: any) => {
  const [deliveryData, setDeliveryDataState] = useState<DeliveryData>({
    nombreCompleto: '',
    email: '',
    telefonoContacto: '',
    direccion: '',
    apartamento: '',
    referencias: '',
  });

  const setDeliveryData = (data: Partial<DeliveryData>) => {
    setDeliveryDataState((prev) => ({ ...prev, ...data }));
  };

  const loadDeliveryData = async () => {
    try {
      const stored = await AsyncStorage.getItem('deliveryData');
      if (stored) {
        setDeliveryDataState(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading delivery data:', error);
    }
  };

  const saveDeliveryData = async () => {
    try {
      await AsyncStorage.setItem('deliveryData', JSON.stringify(deliveryData));
    } catch (error) {
      console.error('Error saving delivery data:', error);
    }
  };

  const resetDeliveryData = () => {
    setDeliveryDataState({
      nombreCompleto: '',
      email: '',
      telefonoContacto: '',
      direccion: '',
      apartamento: '',
      referencias: '',
    });
  };

  return (
    <DeliveryContext.Provider
      value={{
        deliveryData,
        setDeliveryData,
        loadDeliveryData,
        saveDeliveryData,
        resetDeliveryData,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
};

export const useDelivery = () => {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error('useDelivery must be used within DeliveryProvider');
  }
  return context;
};
