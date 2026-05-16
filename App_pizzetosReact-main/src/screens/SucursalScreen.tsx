import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Alert,
} from 'react-native';

const SUCURSALES = [
  {
    id: 'miraflores',
    nombre: 'Pizzetos Miraflores',
    telefono: '55 8445 7355',
    whatsapp: '5215584457355',
    direccion: 'Carretera Chalco Manzana 005, Miraflores, 56645 San Mateo Tezoquipan, Méx.',
    googleMapsLink:
      'https://www.google.com/maps/search/?api=1&query=Pizzeto+Pizza+-+Miraflores&query_place_id=ChIJSVWDBIgjzoURaBS2djMchUM',
  },
];

const abrirEnlace = async (url: string) => {
  const soportado = await Linking.canOpenURL(url);
  if (soportado) {
    await Linking.openURL(url);
  } else {
    Alert.alert('Error', 'No se pudo abrir el enlace.');
  }
};

export default function SucursalScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Encuéntranos</Text>
        <Text style={styles.headerSubtitle}>
          Visítanos en nuestra sucursal o pide a domicilio.
        </Text>
        <View style={styles.divider} />
      </View>

      {SUCURSALES.map(sucursal => (
        <View key={sucursal.id} style={styles.card}>
          {/* Encabezado de la tarjeta */}
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.sucursalNombre}>{sucursal.nombre}</Text>
              <View style={styles.disponibleRow}>
                <View style={styles.puntoverde} />
                <Text style={styles.disponibleText}>Disponible</Text>
              </View>
            </View>
            <View style={styles.iconoUbicacion}>
              <Text style={styles.iconoUbicacionText}>📍</Text>
            </View>
          </View>

          {/* Dirección */}
          <View style={styles.infoRow}>
            <View style={styles.iconoBadge}>
              <Text style={styles.iconoBadgeText}>🗺️</Text>
            </View>
            <Text style={styles.infoTexto}>{sucursal.direccion}</Text>
          </View>

          {/* Teléfono */}
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => abrirEnlace(`tel:${sucursal.telefono.replace(/\s/g, '')}`)}
          >
            <View style={styles.iconoBadge}>
              <Text style={styles.iconoBadgeText}>📞</Text>
            </View>
            <Text style={[styles.infoTexto, styles.telefonoTexto]}>{sucursal.telefono}</Text>
          </TouchableOpacity>

          {/* Botones */}
          <TouchableOpacity
            style={styles.botonWhatsapp}
            onPress={() => abrirEnlace(`https://wa.me/${sucursal.whatsapp}`)}
          >
            <Text style={styles.botonWhatsappIcono}>💬</Text>
            <Text style={styles.botonWhatsappTexto}>Pedir por WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botonMaps}
            onPress={() => abrirEnlace(sucursal.googleMapsLink)}
          >
            <Text style={styles.botonMapsTexto}>Abrir en Google Maps ↗</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  content: { paddingTop: 50, paddingHorizontal: 20, paddingBottom: 40 },
  headerContainer: { marginBottom: 24, alignItems: 'center' },
  headerTitle: { fontSize: 32, fontWeight: '900', color: '#111', marginBottom: 6 },
  headerSubtitle: { fontSize: 12, color: '#888', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center' },
  divider: { width: 60, height: 4, backgroundColor: '#FFC107', borderRadius: 2, marginTop: 14 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  sucursalNombre: { fontSize: 22, fontWeight: '900', color: '#111', marginBottom: 4 },
  disponibleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  puntoverde: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' },
  disponibleText: { fontSize: 11, fontWeight: '700', color: '#16A34A', textTransform: 'uppercase', letterSpacing: 1 },
  iconoUbicacion: { backgroundColor: '#FFF9E6', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#FFF0C0' },
  iconoUbicacionText: { fontSize: 22 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  iconoBadge: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFF9E6', justifyContent: 'center', alignItems: 'center' },
  iconoBadgeText: { fontSize: 18 },
  infoTexto: { flex: 1, fontSize: 14, color: '#555', lineHeight: 22 },
  telefonoTexto: { fontSize: 18, fontWeight: '800', color: '#111' },
  botonWhatsapp: {
    backgroundColor: '#16A34A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  botonWhatsappIcono: { fontSize: 22 },
  botonWhatsappTexto: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  botonMaps: {
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  botonMapsTexto: { color: '#FFF', fontWeight: '700', fontSize: 14 },
});
