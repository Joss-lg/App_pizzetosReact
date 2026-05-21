import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useCart } from '../CartContext';

// --- DATOS DEL MENÚ ---
const PRODUCTOS = [
  // --- PIZZAS TRADICIONALES ---
  { id: 'hawaiana', categoria: 'tradicionales', nombre: 'Hawaiana', descripcion: 'Jamón y Piña', imagen: require('../assets/img/Hawaiana.png'), precios: { CH: 190, MD: 275, GDE: 350, FAM: 415 } },
  { id: 'hawaiana-especial', categoria: 'tradicionales', nombre: 'Hawaiana Especial', descripcion: 'Jamón, Piña y Cereza', imagen: require('../assets/img/HawaianaEsp.png'), precios: { CH: 190, MD: 275, GDE: 350, FAM: 415 } },
  { id: 'combinada-especial', categoria: 'tradicionales', nombre: 'Combinada Especial', descripcion: 'Champiñón, Cebolla, Pimiento V., Salami, Jamón y Chorizo', imagen: require('../assets/img/CombinadaEsp.png'), precios: { CH: 190, MD: 275, GDE: 350, FAM: 415 } },
  { id: 'pizzeto-especial', categoria: 'tradicionales', nombre: 'Pizzeto Especial', descripcion: 'Champiñón, Cebolla, Pimiento V., Salami, Peperoni y Chorizo', imagen: require('../assets/img/PizzetoEsp.png'), precios: { CH: 190, MD: 275, GDE: 350, FAM: 415 } },
  { id: 'atun-especial', categoria: 'tradicionales', nombre: 'Atún Especial', descripcion: 'Atún, Champiñón y Aguacate', imagen: require('../assets/img/AtunEsp.png'), precios: { CH: 190, MD: 275, GDE: 350, FAM: 415 } },
  { id: 'pepperoni', categoria: 'tradicionales', nombre: 'Pepperoni', descripcion: 'Peperoni y Queso', imagen: require('../assets/img/Peperoni.png'), precios: { CH: 190, MD: 275, GDE: 350, FAM: 415 } },
  { id: 'mexicana', categoria: 'tradicionales', nombre: 'Mexicana', descripcion: 'Pierna, Pollo, Jalapeño y Aguacate', imagen: require('../assets/img/Mexicana.png'), precios: { CH: 190, MD: 275, GDE: 350, FAM: 415 } },
  { id: 'carnes-frias', categoria: 'tradicionales', nombre: 'Carnes Frías', descripcion: 'Pierna, Salchicha, Peperoni y Tocino', imagen: require('../assets/img/CarnesF.png'), precios: { CH: 190, MD: 275, GDE: 350, FAM: 415 } },
  { id: 'azteca', categoria: 'tradicionales', nombre: 'Azteca', descripcion: 'Chorizo, Jalapeño, Frijoles y Aguacate', imagen: require('../assets/img/Azteca.png'), precios: { CH: 190, MD: 275, GDE: 350, FAM: 415 } },
  { id: 'mafiosa', categoria: 'tradicionales', nombre: 'Mafiosa', descripcion: 'Champiñón, Jalapeño, Salami y Tocino', imagen: require('../assets/img/Mafiosa.png'), precios: { CH: 190, MD: 275, GDE: 350, FAM: 415 } },
  { id: 'cubana', categoria: 'tradicionales', nombre: 'Cubana', descripcion: 'Pierna, Aguacate, Jalapeño, Jitomate y Atún', imagen: require('../assets/img/Cubana.png'), precios: { CH: 190, MD: 275, GDE: 350, FAM: 415 } },
  { id: 'pastor', categoria: 'tradicionales', nombre: 'Pastor', descripcion: 'Carne al Pastor, Cebolla, Piña y Jalapeño o Chipotle', imagen: require('../assets/img/Pastor.png'), precios: { CH: 190, MD: 275, GDE: 350, FAM: 415 } },
  { id: 'vegetariana', categoria: 'tradicionales', nombre: 'Vegetariana', descripcion: 'Champiñón, Cebolla, Pimiento V. y Aceituna Verde', imagen: require('../assets/img/Vegetariana.png'), precios: { CH: 190, MD: 275, GDE: 350, FAM: 415 } },
  { id: 'chistorra', categoria: 'tradicionales', nombre: 'Chistorra', descripcion: 'Chistorra y Champiñón', imagen: require('../assets/img/Chistorra.png'), precios: { CH: 190, MD: 275, GDE: 350, FAM: 415 } },
  { id: 'clasica', categoria: 'tradicionales', nombre: 'Clásica', descripcion: 'Champiñón, Peperoni y Pimiento V.', imagen: require('../assets/img/Clasica.png'), precios: { CH: 190, MD: 275, GDE: 350, FAM: 415 } },
  { id: 'campestre', categoria: 'tradicionales', nombre: 'Campestre', descripcion: 'Granos de elote, Jalapeño, Pollo y Chorizo', imagen: require('../assets/img/Campestre.png'), precios: { CH: 190, MD: 275, GDE: 350, FAM: 415 } },
  { id: 'costilla-bbq', categoria: 'tradicionales', nombre: 'Costilla BBQ', descripcion: 'Costilla Ahumada, Salsa BBQ o Mango Habanero', imagen: require('../assets/img/Costilla.png'), precios: { CH: 190, MD: 275, GDE: 350, FAM: 415 } },
  { id: 'pirata', categoria: 'tradicionales', nombre: 'Pirata', descripcion: 'Atún, Chipotle, Cebolla y Aceitunas Verdes', imagen: require('../assets/img/Pirata.png'), precios: { CH: 190, MD: 275, GDE: 350, FAM: 415 } },
  { id: 'italiana', categoria: 'tradicionales', nombre: 'Italiana', descripcion: 'Carne Molida de Res, Champiñón y Pimiento V.', imagen: require('../assets/img/Italiana.png'), precios: { CH: 190, MD: 275, GDE: 350, FAM: 415 } },
  { id: 'fugazza', categoria: 'tradicionales', nombre: 'Fugazza', descripcion: 'Palomitas de pollo, Salsa BBQ y Salsa Buffalo', imagen: require('../assets/img/Fugazza.png'), precios: { CH: 190, MD: 275, GDE: 350, FAM: 415 } },
  // --- ESPECIALIDADES DEL MAR ---
  { id: 'camaron', categoria: 'especialidades', nombre: 'Camarón', descripcion: 'Camarón y queso', imagen: require('../assets/img/Camaron.png'), precios: { CH: 260, MD: 350, GDE: 450, FAM: 550 } },
  { id: 'pizza-del-mar', categoria: 'especialidades', nombre: 'Pizza Del Mar', descripcion: 'Camarón, mejillón, pulpo, atún, aceitunas y cebolla', imagen: require('../assets/img/DelMar.png'), precios: { CH: 310, MD: 400, GDE: 500, FAM: 600 } },
  // --- PAQUETES ---
  { id: 'paquete-1', categoria: 'paquetes', nombre: 'Paquete 1', descripcion: 'Pizza Hawaiana y Pepperoni (2x1) + 1 Refresco Jarrito', imagen: require('../assets/img/Paquete1.png'), precioFijo: 330 },
  { id: 'paquete-2', categoria: 'paquetes', nombre: 'Paquete 2', descripcion: '1 Pizza grande de especialidad a elegir + 1 Refresco Jarrito + Hamburguesa o Alitas', imagen: require('../assets/img/Paquete2.png'), precioFijo: 295 },
  { id: 'paquete-3', categoria: 'paquetes', nombre: 'Paquete 3', descripcion: '3 Pizzas grandes de especialidad a elegir + 1 Refresco Jarrito', imagen: require('../assets/img/Paquete3.png'), precioFijo: 450 },
  { id: 'promo-magno', categoria: 'paquetes', nombre: 'Promo Magno', descripcion: '1 Pizza Familiar (1 o 2 especialidades) + 1 Refresco Jarrito', imagen: require('../assets/img/Magno.png'), precioFijo: 260 },
  { id: 'pizza-rectangular', categoria: 'paquetes', nombre: 'Pizza Rectangular', descripcion: '4 especialidades a elegir + 1 Refresco (2Lts)', imagen: require('../assets/img/Rectangular.png'), precioFijo: 405 },
  { id: 'pizza-barra', categoria: 'paquetes', nombre: 'Pizza Barra', descripcion: '2 especialidades a elegir + 1 Refresco (2Lts)', imagen: require('../assets/img/Barra.png'), precioFijo: 290 },
  // --- SNACKS ---
  { id: 'hamburguesa-sencilla', categoria: 'snacks', subcategoria: 'burgers', nombre: 'Hamburguesa Sencilla', descripcion: 'Acompañada de papas y refresco de 355ml', imagen: require('../assets/img/Hamburguesa.png'), precioFijo: 95 },
  { id: 'hamburguesa-doble', categoria: 'snacks', subcategoria: 'burgers', nombre: 'Hamburguesa Doble', descripcion: 'Acompañada de papas y refresco de 355ml', imagen: require('../assets/img/HamburguesaD.png'), precioFijo: 110 },
  { id: 'costillas-paquete', categoria: 'snacks', subcategoria: 'alitas', nombre: 'Costillas', descripcion: 'Acompañadas de papas y refresco de 355ml', imagen: require('../assets/img/Costillas.png'), precioFijo: 135 },
  { id: 'alitas-paquete', categoria: 'snacks', subcategoria: 'alitas', nombre: 'Alitas', descripcion: 'Acompañadas de papas y refresco de 355ml', imagen: require('../assets/img/AlitasB.png'), precioFijo: 110 },
  { id: 'papas-francesas', categoria: 'snacks', subcategoria: 'pastas', nombre: 'Orden de papas a la francesa', descripcion: 'Crujientes y doradas', imagen: require('../assets/img/Papas.png'), precioFijo: 60 },
  { id: 'spaghetti-jamon', categoria: 'snacks', subcategoria: 'pastas', nombre: 'Spaguetty Jamón, queso y Tocino', descripcion: 'Orden para 2 personas', imagen: require('../assets/img/SpaguettyJ.png'), precioFijo: 150 },
  { id: 'spaghetti-camaron', categoria: 'snacks', subcategoria: 'pastas', nombre: 'Spaghetti Camarón', descripcion: 'Orden para 2 personas', imagen: require('../assets/img/SpaguettyC.png'), precioFijo: 235 },
  // --- BEBIDAS ---
  { id: 'refresco-2lts', categoria: 'bebidas', subcategoria: 'jarritos', nombre: 'Refresco 2 Lts', descripcion: 'Pepsi, Manzanita, Sangría, 7UP, Mirinda', imagen: require('../assets/img/Refresco2l.png'), precioFijo: 50 },
  { id: 'refresco-600ml', categoria: 'bebidas', subcategoria: 'jarritos', nombre: 'Refresco 600ml', descripcion: 'Pepsi, Manzanita, Sangría, 7UP, Mirinda, Jumex Fresh', imagen: require('../assets/img/Refresco600.png'), precioFijo: 25 },
  { id: 'refresco-355ml', categoria: 'bebidas', subcategoria: 'jarritos', nombre: 'Refresco 355ml', descripcion: 'Fanta, Sprite, Fresca, Mundet', imagen: require('../assets/img/Refresco355.png'), precioFijo: 17 },
];

const CATEGORIAS = [
  { id: 'todas', nombre: '🔥 Todo' },
  { id: 'tradicionales', nombre: '🍕 Pizzas' },
  { id: 'especialidades', nombre: '🦐 Del Mar' },
  { id: 'paquetes', nombre: '📦 Paquetes' },
  { id: 'snacks', nombre: '🍔 Snacks' },
  { id: 'bebidas', nombre: '🥤 Bebidas' },
];

// --- COMPONENTE TARJETA ---
const ProductCard = ({ item }: any) => {
  const { addToCart } = useCart();
  const [tamanio, setTamanio] = useState('MD'); 
  const [modoCompra, setModoCompra] = useState('promo'); // 'individual' o 'promo'

  const esPizza = item.categoria === 'tradicionales' || item.categoria === 'especialidades';
  
  let precioBase = 0;
  let precioFinal = 0;
  let textoBoton = "AGREGAR";

  if (esPizza) {
    precioBase = item.precios[tamanio];
    if (modoCompra === 'individual') {
      // 40% DE DESCUENTO
      precioFinal = Math.round(precioBase * 0.60); 
      textoBoton = `AGREGAR 1 PIZZA ($${precioFinal})`;
    } else {
      // PRECIO FULL (2x1)
      precioFinal = precioBase;
      textoBoton = "AGREGAR PROMO 2x1";
    }
  } else {
    precioFinal = item.precioFijo;
    textoBoton = `AGREGAR ($${precioFinal})`;
  }

  const handleAgregar = () => {
    const prod = { ...item, precioFinal };
    addToCart(prod, modoCompra, tamanio);
    Alert.alert("¡Listo!", "Producto agregado al carrito 🛒");
  };

  return (
    <View style={styles.card}>
      <Image source={item.imagen} style={styles.imagenPlatillo} />
      
      <View style={styles.infoContainer}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.descripcion}>{item.descripcion}</Text>

        {esPizza && (
          <>
            {/* SELECTOR TAMAÑO */}
            <View style={styles.selectorSize}>
              {['CH', 'MD', 'GDE', 'FAM'].map((size) => (
                <TouchableOpacity 
                  key={size} 
                  style={[styles.sizeBtn, tamanio === size && styles.sizeBtnActive]}
                  onPress={() => setTamanio(size)}
                >
                  <Text style={[styles.sizeText, tamanio === size && styles.sizeTextActive]}>{size}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* SELECTOR MODO DE COMPRA */}
            <View style={styles.offerContainer}>
              <TouchableOpacity 
                style={[styles.offerOption, modoCompra === 'individual' && styles.offerOptionActive]}
                onPress={() => setModoCompra('individual')}
              >
                <Text style={styles.offerTitle}>Solo 1 Pizza</Text>
                <Text style={styles.offerDiscount}>-40% Desc.</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.offerOption, modoCompra === 'promo' && styles.offerOptionActive]}
                onPress={() => setModoCompra('promo')}
              >
                <Text style={styles.offerTitle}>Promo 2x1</Text>
                <Text style={styles.offerPromo}>+ Cupón Jarrito</Text>
              </TouchableOpacity>
            </View>

            {/* PRECIOS */}
            <View style={styles.priceRow}>
              {modoCompra === 'individual' && (
                <Text style={styles.oldPrice}>${precioBase}</Text>
              )}
              <Text style={styles.finalPrice}>${precioFinal}</Text>
            </View>
          </>
        )}

        <TouchableOpacity style={styles.botonAgregar} onPress={handleAgregar}>
          <Text style={styles.textoBoton}>{textoBoton}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function MenuScreen({ route }: any) {
  const [categoriaActiva, setCategoriaActiva] = useState('todas');
  const [subcategoriaActiva, setSubcategoriaActiva] = useState<string | null>(null);

  useEffect(() => {
    const categoriaInicial = route?.params?.categoriaInicial ?? 'todas';
    const subcategoriaInicial = route?.params?.subcategoriaInicial ?? null;

    setCategoriaActiva(categoriaInicial);
    setSubcategoriaActiva(subcategoriaInicial);
  }, [route?.params?.categoriaInicial, route?.params?.subcategoriaInicial]);

  const productosFiltrados = PRODUCTOS.filter(producto => {
    const coincideCategoria = categoriaActiva === 'todas' || producto.categoria === categoriaActiva;

    if (!coincideCategoria) {
      return false;
    }

    if (subcategoriaActiva) {
      return producto.subcategoria === subcategoriaActiva;
    }

    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Menú Pizzetos</Text>
      </View>
      
      <View style={styles.categoriasContainer}>
        <FlatList 
          data={CATEGORIAS}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriasContent}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.catBtn, categoriaActiva === item.id && styles.catBtnActive]}
              onPress={() => {
                setCategoriaActiva(item.id);
                setSubcategoriaActiva(null);
              }}
            >
              <Text style={[styles.catText, categoriaActiva === item.id && styles.catTextActive]}>{item.nombre}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={productosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.productosListContent}
        renderItem={({ item }) => <ProductCard item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9', paddingTop: 50 },
  headerContainer: { paddingHorizontal: 20, marginBottom: 15 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#000' },
  categoriasContainer: { height: 56 },
  categoriasContent: { paddingHorizontal: 15 },
  productosListContent: { paddingBottom: 34, paddingHorizontal: 15 },
  catBtn: { backgroundColor: '#FFF', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#DDD' },
  catBtnActive: { backgroundColor: '#FFC107', borderColor: '#FFC107' },
  catText: { color: '#777', fontWeight: '600' },
  catTextActive: { color: '#000', fontWeight: 'bold' },
  card: { backgroundColor: '#FFF', borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#F0F0F0', elevation: 2, overflow: 'hidden' },
  imagenPlatillo: { width: '100%', height: 180, resizeMode: 'cover' },
  infoContainer: { padding: 15 },
  nombre: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  descripcion: { color: '#777', fontSize: 13, marginBottom: 10 },
  selectorSize: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, backgroundColor: '#F0F0F0', borderRadius: 8, padding: 3 },
  sizeBtn: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 6 },
  sizeBtnActive: { backgroundColor: '#FFF', elevation: 2 },
  sizeText: { fontSize: 12, color: '#999', fontWeight: 'bold' },
  sizeTextActive: { color: '#000' },
  offerContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, gap: 10 },
  offerOption: { flex: 1, borderWidth: 1, borderColor: '#EEE', borderRadius: 8, padding: 10, alignItems: 'center', backgroundColor: '#FAFAFA' },
  offerOptionActive: { borderColor: '#FFC107', backgroundColor: '#FFF9E6' }, 
  offerTitle: { fontWeight: 'bold', color: '#333', fontSize: 13 },
  offerDiscount: { color: '#E53935', fontWeight: 'bold', fontSize: 12 }, 
  offerPromo: { color: '#2E7D32', fontWeight: 'bold', fontSize: 12 }, 
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 15 },
  oldPrice: { textDecorationLine: 'line-through', color: '#999', fontSize: 16, marginRight: 10, marginBottom: 2 },
  finalPrice: { fontSize: 26, fontWeight: '900', color: '#D32F2F' },
  botonAgregar: { backgroundColor: '#000', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  textoBoton: { color: '#FFC107', fontWeight: 'bold', fontSize: 16 }
});