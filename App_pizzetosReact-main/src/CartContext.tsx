import React, { createContext, useState, useContext } from 'react';

// Definimos la estructura del Contexto
const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: any) => {
  const [items, setItems] = useState<any[]>([]);

  // Función para agregar al carrito
  const addToCart = (producto: any, modoCompra: string, tamanio: string) => {
    
    // Si viene de modo "promo", activamos la bandera esPromo
    const esPromo = modoCompra === 'promo'; 
    
    const nuevoItem = {
      id: Date.now().toString(), // ID único basado en el tiempo
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precioFinal, // El precio ya calculado
      cantidad: 1,
      imagen: producto.imagen,
      esPromo: esPromo, // Esto es clave para el cupón
      tamanio: (producto.categoria === 'tradicionales' || producto.categoria === 'especialidades' || producto.categoria === 'del_mar') ? tamanio : undefined
    };

    setItems([...items, nuevoItem]);
  };

  // Función para limpiar carrito
  const clearCart = () => setItems([]);

  // Calcular Total
  const total = items.reduce((sum, item) => sum + item.precio, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);