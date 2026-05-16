import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useDelivery } from '../DeliveryContext';
import { useAuth } from '../AuthContext';

interface DeliveryModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function DeliveryModal({
  visible,
  onClose,
  onConfirm,
  isLoading = false,
}: DeliveryModalProps) {
  const { deliveryData, setDeliveryData, saveDeliveryData } = useDelivery();
  const { user } = useAuth();

  // Auto-llenar datos si está autenticado
  useEffect(() => {
    if (visible && user && !deliveryData.nombreCompleto) {
      setDeliveryData({
        nombreCompleto: user.displayName || '',
        email: user.email || '',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, user]);

  const handleConfirm = async () => {
    if (
      !deliveryData.nombreCompleto.trim() ||
      !deliveryData.email.trim() ||
      !deliveryData.telefonoContacto.trim() ||
      !deliveryData.direccion.trim()
    ) {
      Alert.alert('Campos requeridos', 'Por favor completa todos los campos requeridos');
      return;
    }
    await saveDeliveryData();
    onConfirm();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Datos de Entrega</Text>
          <Text style={styles.subtitle}>
            Completa tus datos para recibir el pedido
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nombre Completo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu nombre completo"
              value={deliveryData.nombreCompleto}
              onChangeText={(text) =>
                setDeliveryData({ nombreCompleto: text })
              }
              editable={!isLoading}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="tu@email.com"
              value={deliveryData.email}
              onChangeText={(text) => setDeliveryData({ email: text })}
              keyboardType="email-address"
              editable={!isLoading}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Teléfono de Contacto *</Text>
            <TextInput
              style={styles.input}
              placeholder="+52 15512345678"
              value={deliveryData.telefonoContacto}
              onChangeText={(text) =>
                setDeliveryData({ telefonoContacto: text })
              }
              keyboardType="phone-pad"
              editable={!isLoading}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Dirección de Entrega *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Calle, número, colonia"
              value={deliveryData.direccion}
              onChangeText={(text) => setDeliveryData({ direccion: text })}
              multiline
              numberOfLines={3}
              editable={!isLoading}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Apartamento/Depto (Opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Apto, Depto, Casa, Piso"
              value={deliveryData.apartamento}
              onChangeText={(text) =>
                setDeliveryData({ apartamento: text })
              }
              editable={!isLoading}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Referencias (Opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Cerca de un local, árbol, etc."
              value={deliveryData.referencias}
              onChangeText={(text) =>
                setDeliveryData({ referencias: text })
              }
              multiline
              numberOfLines={2}
              editable={!isLoading}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.btnCancel}
            onPress={onClose}
            disabled={isLoading}
          >
            <Text style={styles.btnCancelText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnConfirm}
            onPress={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.btnConfirmText}>Confirmar y Continuar</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingBottom: 34,
  },
  btnCancel: {
    flex: 1,
    backgroundColor: '#CCC',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnCancelText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
  btnConfirm: {
    flex: 1,
    backgroundColor: '#25D366',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnConfirmText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
