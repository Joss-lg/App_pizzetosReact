import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, TextInput, Modal, Pressable, Alert } from 'react-native';
import { useAuth } from '../AuthContext';
import { useSucursal } from '../SucursalContext';
import { SUCURSALES_DISPONIBLES } from '../data/sucursales';

const { width } = Dimensions.get('window');

const PAQUETES_DESTACADOS = [
  {
    id: 'paquete-1',
    nombre: 'Paquete 1',
    precio: '$330',
    imagen: require('../assets/img/Paquete1.png'),
  },
  {
    id: 'paquete-2',
    nombre: 'Paquete 2',
    precio: '$295',
    imagen: require('../assets/img/Paquete2.png'),
  },
  {
    id: 'promo-magno',
    nombre: 'Promo Magno',
    precio: '$260',
    imagen: require('../assets/img/Magno.png'),
  },
];

export default function InicioScreen({ navigation }: any) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [sucursalSelectorVisible, setSucursalSelectorVisible] = useState(false);
  const { user, logout } = useAuth();
  const { sucursalSeleccionada, setSucursalSeleccionada } = useSucursal();

  const irAlMenu = (categoria?: string, subcategoria?: string) => {
    navigation.navigate('Menú', {
      categoriaInicial: categoria ?? 'todas',
      subcategoriaInicial: subcategoria,
    });
  };

  const accountData = {
    name: user?.displayName || 'Mi cuenta',
    email: user?.email || 'Sesión invitado',
    photo: user?.photoURL || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          setMenuVisible(false);
          await logout();
        },
      },
    ]);
  };

  return (
    <>
      <Modal
        animationType="fade"
        transparent
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <Pressable style={styles.profileMenuCard} onPress={() => null}>
            <View style={styles.profileHeader}>
              <Image
                source={{ uri: accountData.photo }}
                style={styles.profileMenuImage}
              />
              <View style={styles.profileTextWrap}>
                <Text style={styles.profileMenuName}>{accountData.name}</Text>
                <Text style={styles.profileMenuEmail}>{accountData.email}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutBtnText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={sucursalSelectorVisible}
        onRequestClose={() => setSucursalSelectorVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSucursalSelectorVisible(false)}>
          <Pressable style={styles.sucursalMenuCard} onPress={() => null}>
            <Text style={styles.sucursalMenuTitle}>Sucursales disponibles</Text>
            <Text style={styles.sucursalMenuSubtitle}>Selecciona desde dónde quieres pedir.</Text>

            {SUCURSALES_DISPONIBLES.map(sucursal => {
              const seleccionada = sucursalSeleccionada?.id === sucursal.id;

              return (
                <TouchableOpacity
                  key={sucursal.id}
                  style={[styles.sucursalOption, seleccionada && styles.sucursalOptionSelected]}
                  onPress={() => {
                    setSucursalSeleccionada(sucursal);
                    setSucursalSelectorVisible(false);
                  }}
                >
                  <View style={styles.sucursalOptionTextWrap}>
                    <Text style={styles.sucursalOptionTitle}>{sucursal.nombre}</Text>
                    <Text style={styles.sucursalOptionAddress}>{sucursal.direccion}</Text>
                  </View>
                  {seleccionada ? <Text style={styles.sucursalCheck}>✓</Text> : null}
                </TouchableOpacity>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>Entrega en</Text>
          <TouchableOpacity
            style={styles.locationRow}
            activeOpacity={0.8}
            onPress={() => setSucursalSelectorVisible(true)}
          >
            <Text style={styles.locationText}>
              {`📍 ${sucursalSeleccionada?.nombreCorto ?? 'Selecciona sucursal'} ▾`}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setMenuVisible(true)} activeOpacity={0.8}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
            style={styles.profilePic}
          />
        </TouchableOpacity>
      </View>

      {/* BUSCADOR */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput 
            placeholder="¿Qué se te antoja hoy?" 
            placeholderTextColor="#999"
            style={styles.searchInput}
            editable={false}
          />
        </View>
      </View>

      <Text style={styles.announcementsTitle}>Anuncios</Text>

      {/* BANNERS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bannerScroll}>
        <View style={styles.bannerCard}>
          <Image 
            source={{ uri: 'https://img.freepik.com/premium-photo/pizza-pepperoni-cheese-salami-vegetables-banner_269543-1678.jpg' }} 
            style={styles.bannerImage} 
          />
          <View style={styles.bannerBadge}>
            <Text style={styles.bannerText}>PROMO 2x1</Text>
          </View>
        </View>
        <View style={styles.bannerCard}>
          <Image 
            source={require('../assets/img/Refresco600.png')} 
            style={styles.bannerImage} 
          />
          <View style={styles.bannerDrinkRow}>
            <Text style={styles.bannerDrinkEmoji}>🥤</Text>
            <View style={[styles.bannerBadge, styles.bannerBadgeAlt]}> 
              <Text style={styles.bannerText}>BEBIDAS $25</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* CATEGORÍAS CIRCULARES */}
      <View style={styles.categoriesHeaderRow}>
        <Text style={styles.sectionTitle}>Categorías</Text>
        <Text style={styles.categoriesHint}>→</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesGrid}
      >
        <TouchableOpacity style={styles.catCircle} onPress={() => irAlMenu('tradicionales')}>
          <View style={styles.iconContainer}><Text style={styles.catEmoji}>🍕</Text></View>
          <Text style={styles.catLabel}>Pizzas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.catCircle} onPress={() => irAlMenu('snacks', 'burgers')}>
          <View style={styles.iconContainer}><Text style={styles.catEmoji}>🍔</Text></View>
          <Text style={styles.catLabel}>Burgers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.catCircle} onPress={() => irAlMenu('snacks', 'alitas')}>
          <View style={styles.iconContainer}><Text style={styles.catEmoji}>🍗</Text></View>
          <Text style={styles.catLabel}>Alitas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.catCircle} onPress={() => irAlMenu('snacks', 'pastas')}>
          <View style={styles.iconContainer}><Text style={styles.catEmoji}>🍝</Text></View>
          <Text style={styles.catLabel}>Pastas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.catCircle} onPress={() => irAlMenu('bebidas', 'jarritos')}>
          <View style={styles.iconContainer}><Text style={styles.catEmoji}>🥤</Text></View>
          <Text style={styles.catLabel}>Bebidas</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.packagesHeaderRow}>
        <Text style={styles.packagesTitle}>Paquetes Disponibles</Text>
        <TouchableOpacity onPress={() => irAlMenu('paquetes')} activeOpacity={0.8}>
          <Text style={styles.packagesHint}>Ver todo →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.packagesScrollContent}
      >
        {PAQUETES_DESTACADOS.map(paquete => (
          <TouchableOpacity
            key={paquete.id}
            style={styles.packageCard}
            activeOpacity={0.9}
            onPress={() => irAlMenu('paquetes')}
          >
            <Image source={paquete.imagen} style={styles.packageImage} />
            <View style={styles.packageOverlay}>
              <Text style={styles.packageName}>{paquete.nombre}</Text>
              <View style={styles.packagePriceBadge}>
                <Text style={styles.packagePriceText}>Desde {paquete.precio}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bottomSpacer} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: 50, paddingHorizontal: 15 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'flex-end',
    paddingTop: 70,
    paddingHorizontal: 14,
  },
  profileMenuCard: {
    width: '92%',
    maxWidth: 360,
    backgroundColor: '#1F232A',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2E3440',
  },
  sucursalMenuCard: {
    width: '92%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileMenuImage: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginRight: 12,
    backgroundColor: '#EEE',
  },
  profileTextWrap: { flex: 1 },
  profileMenuName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  profileMenuEmail: {
    color: '#B8C1D1',
    fontSize: 13,
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: '#F15A24',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  sucursalMenuTitle: {
    color: '#111111',
    fontSize: 22,
    fontWeight: '800',
  },
  sucursalMenuSubtitle: {
    color: '#6B7280',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 14,
  },
  sucursalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E9E9E9',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    backgroundColor: '#FAFAFA',
  },
  sucursalOptionSelected: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  sucursalOptionTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  sucursalOptionTitle: {
    color: '#111111',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  sucursalOptionAddress: {
    color: '#6B7280',
    fontSize: 12,
    lineHeight: 18,
  },
  sucursalCheck: {
    color: '#16A34A',
    fontSize: 18,
    fontWeight: '900',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  headerSubtitle: { color: '#888', fontSize: 12, fontWeight: '600' },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  profilePic: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEE' },
  searchContainer: { marginBottom: 20 },
  searchBar: { backgroundColor: '#F0F0F0', borderRadius: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 45 },
  searchIcon: { fontSize: 18, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  announcementsTitle: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 10 },
  bannerScroll: { marginBottom: 25 },
  bannerCard: { width: width * 0.8, height: 160, borderRadius: 15, marginRight: 15, overflow: 'hidden' },
  bannerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  bannerDrinkRow: { position: 'absolute', left: 10, bottom: 10, flexDirection: 'row', alignItems: 'center' },
  bannerDrinkEmoji: { fontSize: 28, marginRight: 8 },
  bannerBadge: { position: 'absolute', bottom: 10, left: 10, backgroundColor: '#FFC107', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  bannerBadgeAlt: { backgroundColor: '#FF4500' },
  bannerText: { fontWeight: 'bold', fontSize: 12, color: '#000' },
  categoriesHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 15 },
  categoriesHint: { fontSize: 12, fontWeight: '700', color: '#F15A24', marginBottom: 15 },
  categoriesGrid: { paddingRight: 10, marginBottom: 30 },
  catCircle: { alignItems: 'center', width: 92, marginRight: 14 },
  packagesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  packagesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  packagesHint: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F15A24',
  },
  packagesScrollContent: {
    paddingRight: 10,
    marginBottom: 20,
  },
  packageCard: {
    width: width * 0.78,
    height: 145,
    borderRadius: 18,
    marginRight: 14,
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  packageImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  packageOverlay: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
  },
  packageName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  packagePriceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFC107',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  packagePriceText: {
    color: '#111111',
    fontSize: 12,
    fontWeight: '900',
  },
  iconContainer: { width: 65, height: 65, backgroundColor: '#F9F9F9', borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 8, elevation: 3 },
  catEmoji: { fontSize: 30 },
  catLabel: { fontSize: 12, fontWeight: '600', color: '#333' },
  bottomSpacer: { height: 50 },
});