import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking, Alert, ActivityIndicator } from 'react-native';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import { useDelivery } from '../DeliveryContext';
import DeliveryModal from '../components/DeliveryModal';
import ConfirmDeliveryModal from '../components/ConfirmDeliveryModal';
import apiClient from '../services/apiClient';

export default function CarritoScreen() {
  const { items, total, addToCart, clearCart } = useCart();
  const { isSignedIn, user } = useAuth();
  const { deliveryData, loadDeliveryData } = useDelivery();
  const isGuestUser = !!user?.id?.startsWith('guest_');
  const [tienePromoActiva, setTienePromoActiva] = useState(false);
  const [jarritoAgregado, setJarritoAgregado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmDeliveryModalVisible, setConfirmDeliveryModalVisible] = useState(false);
  const [pendingOrderSubmission, setPendingOrderSubmission] = useState(false);

  // Cargar datos de entrega al montar el componente
  useEffect(() => {
    loadDeliveryData();
  }, [loadDeliveryData]);

  // Verificar si hay 2x1 en el carrito
  useEffect(() => {
    const hayPromo = items.some((item: any) => item.esPromo === true);
    setTienePromoActiva(hayPromo);
  }, [items]);

  const agregarJarrito = () => {
    const jarrito = {
      nombre: 'Jarrito de Regalo',
      descripcion: 'Promoción especial por compra 2x1',
      precioFinal: 25, 
      imagen: { uri: 'https://cdn-icons-png.flaticon.com/512/2405/2405451.png' }, 
      categoria: 'bebida'
    };
    addToCart(jarrito, 'individual', '');
    setJarritoAgregado(true);
  };

  const enviarPedido = () => {
    // Verificar si tenemos datos de entrega
    if (!deliveryData.direccion.trim()) {
      // Abrir modal de captura de dirección
      setModalVisible(true);
      return;
    }

    // Si ya hay dirección, mostrar modal de confirmación
    setPendingOrderSubmission(true);
    setConfirmDeliveryModalVisible(true);
  };

  const _realizarPedido = async () => {
    if (enviando) return;
    setEnviando(true);
    try {
      if (isSignedIn && !isGuestUser) {
        // Usuario autenticado, guardar en backend
        const payload = {
          items: items.map((item: any) => ({
            nombre: item.nombre,
            tamanio: item.tamanio || null,
            precio: item.precio,
            esPromo: item.esPromo || false,
          })),
          total,
          deliveryData,
        };
        await apiClient.post('/orders', payload);
      }
    } catch (err: any) {
      console.warn('Error al registrar pedido en backend:', err?.message);
    } finally {
      setEnviando(false);
    }
    enviarPedidoWhatsApp();
  };

  const enviarPedidoWhatsApp = () => {
    let mensaje = "Hola Pizzetos! 🍕 Quiero hacer un pedido:\n\n";
    
    // Detalles de items
    items.forEach((item: any) => {
      mensaje += `- ${item.nombre} ${item.tamanio ? `(${item.tamanio})` : ''} - $${item.precio}\n`;
      if (item.esPromo) mensaje += `  *(Promo 2x1 Aplicada)*\n`;
    });
    
    mensaje += `\n*Total a Pagar: $${total}*\n`;
    mensaje += `\n*Datos de Entrega:*\n`;
    mensaje += `👤 Nombre: ${deliveryData.nombreCompleto}\n`;
    mensaje += `📧 Email: ${deliveryData.email}\n`;
    mensaje += `📱 Teléfono: ${deliveryData.telefonoContacto}\n`;
    mensaje += `📍 Dirección: ${deliveryData.direccion}`;
    
    if (deliveryData.apartamento) {
      mensaje += `\n   Apto/Depto: ${deliveryData.apartamento}`;
    }
    
    if (deliveryData.referencias) {
      mensaje += `\n   Referencias: ${deliveryData.referencias}`;
    }

    // REEMPLAZA CON TU NÚMERO
    const url = `whatsapp://send?text=${encodeURIComponent(mensaje)}&phone=5215512345678`; 
    Linking.openURL(url).catch(() => Alert.alert('Error', 'No pudimos abrir WhatsApp'));
    
    // Limpiar carrito después de enviar
    clearCart();
  };

  return (
    <View style={styles.container}>
      {/* Modal de captura de dirección (cuando no existe) */}
      <DeliveryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={() => {
          setModalVisible(false);
          // Después de guardar dirección, mostrar confirmación
          setPendingOrderSubmission(true);
          setConfirmDeliveryModalVisible(true);
        }}
        isLoading={enviando}
      />

      {/* Modal de confirmación de dirección (cuando ya existe) */}
      <ConfirmDeliveryModal
        visible={confirmDeliveryModalVisible}
        onConfirm={() => {
          setConfirmDeliveryModalVisible(false);
          _realizarPedido();
        }}
        onClose={() => {
          setConfirmDeliveryModalVisible(false);
          setPendingOrderSubmission(false);
        }}
        onEditClick={() => {
          setConfirmDeliveryModalVisible(false);
          setModalVisible(true);
        }}
      />
      
      <Text style={styles.headerTitle}>Tu Pedido 📝</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {items.length === 0 ? (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyCartIcon}>🛒</Text>
            <Text style={styles.emptyCartText}>Tu carrito está vacío</Text>
          </View>
        ) : (
          items.map((item: any, index: number) => (
            <View key={index} style={styles.itemCard}>
              <Image source={item.imagen} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>
                  {item.nombre} {item.tamanio && `(${item.tamanio})`}
                </Text>
                {item.esPromo && <Text style={styles.promoTag}>🔥 Pack 2x1</Text>}
                <Text style={styles.itemPrice}>${item.precio}</Text>
              </View>
            </View>
          ))
        )}

        {/* CUPÓN DE JARRITO */}
        {tienePromoActiva && !jarritoAgregado && (
          <View style={styles.cuponContainer}>
            <View>
              <Text style={styles.cuponTitle}>¡Felicidades! 🎉</Text>
              <Text style={styles.cuponDesc}>Tienes derecho a:</Text>
              <Text style={styles.cuponItem}>1 Jarrito x $25</Text>
            </View>
            <TouchableOpacity style={styles.btnCanjear} onPress={agregarJarrito}>
              <Text style={styles.txtCanjear}>AGREGAR +</Text>
            </TouchableOpacity>
          </View>
        )}

        {items.length > 0 && (
          <View style={styles.resumenContainer}>
            <View style={[styles.row, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total}</Text>
            </View>
            <TouchableOpacity onPress={clearCart}>
               <Text style={styles.clearCartText}>Vaciar Carrito</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {items.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.btnWhatsapp} onPress={enviarPedido} disabled={enviando}>
            {enviando
              ? <ActivityIndicator color="#FFF" />
              : <Text style={styles.btnText}>Enviar Pedido por WhatsApp 🟢</Text>
            }
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', paddingTop: 60 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#000', marginLeft: 20, marginBottom: 20 },
  scrollContent: { paddingHorizontal: 15, paddingBottom: 100 },
  emptyCart: { alignItems: 'center', marginTop: 100 },
  itemCard: { backgroundColor: '#FFF', borderRadius: 15, padding: 10, marginBottom: 15, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  itemImage: { width: 60, height: 60, borderRadius: 10, backgroundColor: '#EEE' },
  itemInfo: { flex: 1, marginLeft: 15 },
  itemTitle: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  promoTag: { color: '#E53935', fontSize: 12, fontWeight: 'bold' },
  itemPrice: { fontWeight: 'bold', color: '#000', marginTop: 4 },
  cuponContainer: { backgroundColor: '#E8F5E9', borderColor: '#2E7D32', borderWidth: 1, borderRadius: 10, padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cuponTitle: { fontWeight: 'bold', color: '#2E7D32', fontSize: 16 },
  cuponDesc: { color: '#555', fontSize: 12 },
  cuponItem: { fontWeight: 'bold', color: '#000', fontSize: 14, marginTop: 2 },
  btnCanjear: { backgroundColor: '#2E7D32', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  txtCanjear: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  resumenContainer: { marginTop: 20, backgroundColor: '#FFF', padding: 20, borderRadius: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  totalRow: { borderTopWidth: 0 },
  totalLabel: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  totalValue: { fontSize: 24, fontWeight: 'bold', color: '#FFD700' },
  footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#FFF', padding: 20, borderTopWidth: 1, borderTopColor: '#EEE' },
  btnWhatsapp: { backgroundColor: '#25D366', paddingVertical: 15, borderRadius: 15, alignItems: 'center', elevation: 5 },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  emptyCartIcon: { fontSize: 50 },
  emptyCartText: { color: '#999', marginTop: 10 },
  clearCartText: { color: 'red', marginTop: 10, textAlign: 'center' }
});