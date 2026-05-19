import React, { createContext, useState, useContext } from 'react';
import { SUCURSALES_DISPONIBLES, Sucursal } from './data/sucursales';

interface SucursalContextType {
  sucursalSeleccionada: Sucursal | null;
  setSucursalSeleccionada: (sucursal: Sucursal) => void;
}

const SucursalContext = createContext<SucursalContextType | null>(null);

export const SucursalProvider = ({ children }: any) => {
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<Sucursal | null>(
    SUCURSALES_DISPONIBLES[0] ?? null,
  );

  return (
    <SucursalContext.Provider value={{ sucursalSeleccionada, setSucursalSeleccionada }}>
      {children}
    </SucursalContext.Provider>
  );
};

export const useSucursal = () => {
  const context = useContext(SucursalContext);
  if (!context) {
    throw new Error('useSucursal debe usarse dentro de SucursalProvider');
  }
  return context;
};
