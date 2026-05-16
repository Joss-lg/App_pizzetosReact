import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../services/apiClient';
import { useAuth } from '../AuthContext';

interface OrderItem {
  nombre: string;
  tamanio?: string;
  precio: number;
  esPromo?: boolean;
}

interface Order {
  orderId: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

export default function MisPedidosScreen() {
  const { isSignedIn } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!isSignedIn) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/orders');
      setOrders(response.data.data || []);
    } catch (err: any) {
      setError('No se pudieron cargar los pedidos. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [isSignedIn]);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders])
  );

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Pedido #{item.orderId.replace('ord_', '')}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>

      <View style={styles.divider} />

      {item.items.map((orderItem, index) => (
        <View key={index} style={styles.itemRow}>
          <Text style={styles.itemName}>
            {orderItem.nombre}
            {orderItem.tamanio ? ` (${orderItem.tamanio})` : ''}
            {orderItem.esPromo ? ' 🔥' : ''}
          </Text>
          <Text style={styles.itemPrice}>${orderItem.precio}</Text>
        </View>
      ))}

      <View style={styles.divider} />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>${item.total}</Text>
      </View>
    </View>
  );

  if (!isSignedIn) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyIcon}>🔒</Text>
        <Text style={styles.emptyText}>Inicia sesión para ver tus pedidos</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Mis Pedidos 📋</Text>

      {loading && orders.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FFC107" />
          <Text style={styles.loadingText}>Cargando pedidos...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>⚠️</Text>
          <Text style={styles.emptyText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>🍕</Text>
          <Text style={styles.emptyText}>Aún no tienes pedidos</Text>
          <Text style={styles.emptySubtext}>¡Haz tu primer pedido desde el menú!</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.orderId}
          renderItem={renderOrder}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchOrders}
              colors={['#FFC107']}
              tintColor="#FFC107"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  statusBadge: {
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#856404',
  },
  orderDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  itemName: {
    fontSize: 13,
    color: '#555',
    flex: 1,
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFC107',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    marginTop: 6,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#FFC107',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
});
