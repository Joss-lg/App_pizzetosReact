import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useDelivery } from '../DeliveryContext';

interface ConfirmDeliveryModalProps {
  visible: boolean;
  onConfirm: () => void;
  onClose: () => void;
  onEditClick: () => void;
}

export default function ConfirmDeliveryModal({
  visible,
  onConfirm,
  onClose,
  onEditClick,
}: ConfirmDeliveryModalProps) {
  const { deliveryData } = useDelivery();

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.container}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Confirmar Dirección de Entrega</Text>
            <Text style={styles.subtitle}>¿Es esta la dirección correcta?</Text>
          </View>

          {/* Dirección Guardada */}
          <View style={styles.deliveryBox}>
            <View style={styles.deliveryItem}>
              <Text style={styles.deliveryLabel}>👤 Nombre</Text>
              <Text style={styles.deliveryValue}>{deliveryData.nombreCompleto}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.deliveryItem}>
              <Text style={styles.deliveryLabel}>📱 Teléfono</Text>
              <Text style={styles.deliveryValue}>{deliveryData.telefonoContacto}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.deliveryItem}>
              <Text style={styles.deliveryLabel}>📍 Dirección</Text>
              <Text style={styles.deliveryValue}>{deliveryData.direccion}</Text>
            </View>

            {deliveryData.apartamento && (
              <>
                <View style={styles.divider} />
                <View style={styles.deliveryItem}>
                  <Text style={styles.deliveryLabel}>🏢 Apto/Depto</Text>
                  <Text style={styles.deliveryValue}>{deliveryData.apartamento}</Text>
                </View>
              </>
            )}

            {deliveryData.referencias && (
              <>
                <View style={styles.divider} />
                <View style={styles.deliveryItem}>
                  <Text style={styles.deliveryLabel}>📌 Referencias</Text>
                  <Text style={styles.deliveryValue}>{deliveryData.referencias}</Text>
                </View>
              </>
            )}
          </View>

          {/* Botones */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.btnUpdateAddress} onPress={onEditClick}>
              <Text style={styles.btnUpdateText}>✏️ Actualizar Dirección</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnConfirm} onPress={onConfirm}>
              <Text style={styles.btnConfirmText}>✅ Confirmar y Continuar</Text>
            </TouchableOpacity>
          </View>

          {/* Cerrar */}
          <TouchableOpacity
            style={styles.btnClose}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.btnCloseText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  deliveryBox: {
    backgroundColor: '#F9F9F9',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  deliveryItem: {
    paddingVertical: 8,
  },
  deliveryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginBottom: 4,
  },
  deliveryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 10,
  },
  footer: {
    gap: 10,
    marginBottom: 12,
  },
  btnUpdateAddress: {
    backgroundColor: '#FFC107',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnUpdateText: {
    color: '#333',
    fontWeight: '700',
    fontSize: 14,
  },
  btnConfirm: {
    backgroundColor: '#25D366',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnConfirmText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  btnClose: {
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    marginHorizontal: -20,
    marginBottom: -25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  btnCloseText: {
    color: '#999',
    fontWeight: '600',
    fontSize: 14,
  },
});
