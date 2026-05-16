import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, TextInput, Modal, Pressable, Alert } from 'react-native';
import { useAuth } from '../AuthContext';

const { width } = Dimensions.get('window');

export default function InicioScreen({ navigation }: any) {
  const [menuVisible, setMenuVisible] = useState(false);
  const { user, logout } = useAuth();

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

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>Entrega en</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationText}>📍 Valle de Chalco ▾</Text>
          </View>
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
            source={{ uri: 'https://t3.ftcdn.net/jpg/02/60/19/27/360_F_260192739_C3eX8q7c0d0i5m5bX0o5k5m5bX0o5k5.jpg' }} 
            style={styles.bannerImage} 
          />
          <View style={[styles.bannerBadge, styles.bannerBadgeAlt]}> 
            <Text style={styles.bannerText}>JARRITOS $25</Text>
          </View>
        </View>
      </ScrollView>

      {/* CATEGORÍAS CIRCULARES */}
      <Text style={styles.sectionTitle}>Categorías</Text>
      <View style={styles.categoriesGrid}>
        <TouchableOpacity style={styles.catCircle} onPress={() => navigation.navigate('Menú')}>
          <View style={styles.iconContainer}><Text style={styles.catEmoji}>🍕</Text></View>
          <Text style={styles.catLabel}>Pizzas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.catCircle} onPress={() => navigation.navigate('Menú')}>
          <View style={styles.iconContainer}><Text style={styles.catEmoji}>🍔</Text></View>
          <Text style={styles.catLabel}>Burgers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.catCircle} onPress={() => navigation.navigate('Menú')}>
          <View style={styles.iconContainer}><Text style={styles.catEmoji}>🍗</Text></View>
          <Text style={styles.catLabel}>Alitas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.catCircle} onPress={() => navigation.navigate('Menú')}>
          <View style={styles.iconContainer}><Text style={styles.catEmoji}>🍝</Text></View>
          <Text style={styles.catLabel}>Pastas</Text>
        </TouchableOpacity>
      </View>

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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  headerSubtitle: { color: '#888', fontSize: 12, fontWeight: '600' },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  profilePic: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEE' },
  searchContainer: { marginBottom: 20 },
  searchBar: { backgroundColor: '#F0F0F0', borderRadius: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 45 },
  searchIcon: { fontSize: 18, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  bannerScroll: { marginBottom: 25 },
  bannerCard: { width: width * 0.8, height: 160, borderRadius: 15, marginRight: 15, overflow: 'hidden' },
  bannerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  bannerBadge: { position: 'absolute', bottom: 10, left: 10, backgroundColor: '#FFC107', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  bannerBadgeAlt: { backgroundColor: '#FF4500' },
  bannerText: { fontWeight: 'bold', fontSize: 12, color: '#000' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 15 },
  categoriesGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  catCircle: { alignItems: 'center', width: '22%' },
  iconContainer: { width: 65, height: 65, backgroundColor: '#F9F9F9', borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 8, elevation: 3 },
  catEmoji: { fontSize: 30 },
  catLabel: { fontSize: 12, fontWeight: '600', color: '#333' },
  bottomSpacer: { height: 50 },
});