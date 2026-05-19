export type Sucursal = {
  id: string;
  nombre: string;
  nombreCorto: string;
  telefono: string;
  whatsapp: string;
  direccion: string;
  googleMapsLink: string;
  disponible: boolean;
};

export const SUCURSALES: Sucursal[] = [
  {
    id: 'miraflores',
    nombre: 'Pizzetos Miraflores',
    nombreCorto: 'Miraflores',
    telefono: '55 8445 7355',
    whatsapp: '5215584457355',
    direccion: 'Carretera Chalco Manzana 005, Miraflores, 56645 San Mateo Tezoquipan, Méx.',
    googleMapsLink:
      'https://www.google.com/maps/search/?api=1&query=Pizzeto+Pizza+-+Miraflores&query_place_id=ChIJSVWDBIgjzoURaBS2djMchUM',
    disponible: true,
  },
];

export const SUCURSALES_DISPONIBLES = SUCURSALES.filter(sucursal => sucursal.disponible);