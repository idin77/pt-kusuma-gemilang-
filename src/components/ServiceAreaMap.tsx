import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Map, 
  MapPin, 
  Navigation, 
  Clock, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  PhoneCall, 
  Zap,
  Layers,
  Maximize2,
  RefreshCw,
  Compass,
  Radio,
  ExternalLink,
  Info,
  Building,
  Check
} from 'lucide-react';
import { CONTACT_INFO } from '../data/websiteData';
import { trackConversion } from '../utils/conversionTracker';

export interface HubStation {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  zones: string[];
  eta: string;
  trucks: string;
  address: string;
  color: string;
  contactPerson: string;
}

export const OPERATIONAL_HUBS: HubStation[] = [
  {
    id: 'hub-1',
    name: 'Posko 1: Kota Bekasi Pusat & Selatan',
    code: 'HUB-BKS-01',
    lat: -6.2435,
    lng: 106.9925,
    radiusMeters: 7500,
    zones: ['Bekasi Barat', 'Bekasi Selatan', 'Rawalumbu', 'Jatiasih', 'Pondok Gede', 'Jatisampurna'],
    eta: '25 – 35 Menit',
    trucks: '3 Unit Truk Tangki Vakum',
    address: 'Akses Tol Becakayu & Gerbang Tol Bekasi Barat',
    color: '#00C2CB',
    contactPerson: 'Koordinator Wilayah Pusat'
  },
  {
    id: 'hub-2',
    name: 'Posko 2: Cikarang Kawasan Industri & Pusat',
    code: 'HUB-CKR-02',
    lat: -6.3150,
    lng: 107.1350,
    radiusMeters: 9000,
    zones: ['Cikarang Barat (MM2100)', 'Cikarang Selatan (EJIP)', 'Cikarang Utara (Jababeka)', 'Cikarang Pusat (Delta Silicon)'],
    eta: '20 – 35 Menit',
    trucks: '4 Unit Tangki Industri & Biofilter',
    address: 'Dekat Gerbang Tol Cikarang Barat & Cibatu',
    color: '#FF6B00',
    contactPerson: 'Koordinator Kawasan Industri'
  },
  {
    id: 'hub-3',
    name: 'Posko 3: Bekasi Timur, Tambun & Cibitung',
    code: 'HUB-TMB-03',
    lat: -6.2620,
    lng: 107.0620,
    radiusMeters: 8000,
    zones: ['Tambun Selatan', 'Tambun Utara', 'Bekasi Timur', 'Cibitung', 'Mustika Jaya', 'Setu'],
    eta: '30 – 40 Menit',
    trucks: '3 Unit Truk Vakum Selang Panjang',
    address: 'Akses Jalan Nasional Sultan Hasanudin & Grand Wisata',
    color: '#10B981',
    contactPerson: 'Koordinator Jalur Timur'
  },
  {
    id: 'hub-4',
    name: 'Posko 4: Bekasi Utara, Babelan & Tarumajaya',
    code: 'HUB-BBL-04',
    lat: -6.1850,
    lng: 107.0050,
    radiusMeters: 8500,
    zones: ['Bekasi Utara', 'Medan Satria', 'Harapan Indah', 'Babelan', 'Tarumajaya', 'Sukawangi'],
    eta: '30 – 45 Menit',
    trucks: '2 Unit Tangki Vakum',
    address: 'Akses Tol Cibitung-Cilincing & Harapan Indah',
    color: '#6366F1',
    contactPerson: 'Koordinator Jalur Utara'
  }
];

// Special Landmark Points
const SPECIAL_LANDMARKS = [
  {
    id: 'hq-bekasi',
    name: 'Kantor Pusat & Garasi Utama PT Kusuma Gemilang Raya',
    type: 'HQ',
    lat: -6.2550,
    lng: 107.0020,
    address: 'Jl. Cut Mutia / Ahmad Yani, Bekasi Kota',
    desc: 'Pusat Operasional 24 Jam, Bengkel Armada, & Manajemen Legalitas'
  },
  {
    id: 'iplt-sumurbatu',
    name: 'UPTD IPLT Sumur Batu Bekasi (Pembuangan Resmi)',
    type: 'IPLT',
    lat: -6.3450,
    lng: 106.9950,
    address: 'Instalasi Pengolahan Lumpur Tinja Sumur Batu, Bantargebang',
    desc: 'Fasilitas Pembuangan Resmi Berizin DLH dengan Manifest IPLT Terverifikasi'
  }
];

// Simulated Live Patrol Fleet
const ACTIVE_FLEET = [
  { id: 'T-01', code: 'Armada Tangki 01', lat: -6.2360, lng: 106.9850, area: 'Bekasi Barat', status: 'Siaga 24 Jam' },
  { id: 'T-03', code: 'Armada Tangki 03', lat: -6.2880, lng: 106.9680, area: 'Jatiasih / Pondok Gede', status: 'Standby Disposisi' },
  { id: 'T-05', code: 'Armada Tangki 05', lat: -6.2710, lng: 107.0420, area: 'Tambun / Metland', status: 'Siaga Selang 50m' },
  { id: 'T-07', code: 'Armada Tangki 07', lat: -6.3020, lng: 107.1050, area: 'MM2100 Cikarang Barat', status: 'Siaga Tangki Industri' },
  { id: 'T-09', code: 'Armada Tangki 09', lat: -6.3280, lng: 107.1580, area: 'Jababeka / Delta Silicon', status: 'Siaga Kawasan' },
  { id: 'T-11', code: 'Armada Tangki 11', lat: -6.1780, lng: 106.9850, area: 'Harapan Indah / Babelan', status: 'Siaga 24 Jam' }
];

const BEKASI_CENTER_BOUNDS: L.LatLngBoundsExpression = [
  [-6.370, 106.930], // Southwest
  [-6.150, 107.210]  // Northeast
];

export default function ServiceAreaMap() {
  const [selectedHub, setSelectedHub] = useState<HubStation>(OPERATIONAL_HUBS[0]);
  const [viewMode, setViewMode] = useState<'interactive' | 'static'>('interactive');
  const [showCoverageRadius, setShowCoverageRadius] = useState<boolean>(true);
  const [showActiveFleet, setShowActiveFleet] = useState<boolean>(true);
  const [showLandmarks, setShowLandmarks] = useState<boolean>(true);
  const [tileStyle, setTileStyle] = useState<'streets' | 'osm' | 'satellite'>('streets');
  const [lastUpdateTime, setLastUpdateTime] = useState<string>('');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersGroupRef = useRef<L.FeatureGroup | null>(null);
  const circlesGroupRef = useRef<L.FeatureGroup | null>(null);
  const fleetGroupRef = useRef<L.FeatureGroup | null>(null);
  const landmarksGroupRef = useRef<L.FeatureGroup | null>(null);
  const hubMarkersRef = useRef<Record<string, L.Marker>>({});

  // Clock update for real-time telemetry feel
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLastUpdateTime(
        now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (viewMode !== 'interactive') return;
    if (!mapContainerRef.current) return;
    if (mapRef.current) return; // Prevent re-initialization

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: [-6.255, 107.06],
      zoom: 11,
      minZoom: 10,
      maxZoom: 18,
      scrollWheelZoom: false,
      zoomControl: false
    });

    // Add Zoom Control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial Base Tile Layer
    const streetsTile = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
      }
    );
    streetsTile.addTo(map);
    tileLayerRef.current = streetsTile;

    // Layer Groups
    const circlesGroup = L.featureGroup().addTo(map);
    const markersGroup = L.featureGroup().addTo(map);
    const fleetGroup = L.featureGroup().addTo(map);
    const landmarksGroup = L.featureGroup().addTo(map);

    circlesGroupRef.current = circlesGroup;
    markersGroupRef.current = markersGroup;
    fleetGroupRef.current = fleetGroup;
    landmarksGroupRef.current = landmarksGroup;

    mapRef.current = map;

    // Invalidate size to handle flex layout rendering
    const timer = setTimeout(() => {
      map.invalidateSize();
      map.fitBounds(BEKASI_CENTER_BOUNDS, { padding: [30, 30] });
    }, 250);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [viewMode]);

  // Handle Tile Layer Switch
  useEffect(() => {
    if (!mapRef.current || viewMode !== 'interactive') return;

    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }

    let url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    let attribution = '&copy; CARTO &copy; OpenStreetMap';

    if (tileStyle === 'osm') {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; OpenStreetMap contributors';
    } else if (tileStyle === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    }

    const newTileLayer = L.tileLayer(url, { attribution, maxZoom: 19 });
    newTileLayer.addTo(mapRef.current);
    tileLayerRef.current = newTileLayer;
  }, [tileStyle, viewMode]);

  // Render Operational Hub Markers and Coverage Radius
  useEffect(() => {
    if (!mapRef.current || viewMode !== 'interactive') return;
    if (!markersGroupRef.current || !circlesGroupRef.current) return;

    markersGroupRef.current.clearLayers();
    circlesGroupRef.current.clearLayers();
    hubMarkersRef.current = {};

    OPERATIONAL_HUBS.forEach((hub) => {
      // 1. Coverage Circles
      if (showCoverageRadius) {
        const circle = L.circle([hub.lat, hub.lng], {
          radius: hub.radiusMeters,
          color: hub.color,
          weight: 2,
          opacity: 0.8,
          fillColor: hub.color,
          fillOpacity: 0.12,
          dashArray: '4, 6'
        });
        circle.bindTooltip(`Radius Jangkauan ${hub.code}: ±${hub.radiusMeters / 1000} km`, {
          direction: 'top',
          className: 'leaflet-custom-tooltip'
        });
        circlesGroupRef.current?.addLayer(circle);
      }

      // 2. Custom Hub Marker using DivIcon
      const isSelected = selectedHub.id === hub.id;
      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="absolute -inset-2 rounded-full animate-ping opacity-60" style="background-color: ${hub.color};"></div>
          <div class="relative flex items-center justify-center w-10 h-10 rounded-2xl shadow-xl text-white font-extrabold text-xs transition-transform transform group-hover:scale-110 ${
            isSelected ? 'ring-4 ring-white scale-110 shadow-2xl' : 'border-2 border-white'
          }" style="background-color: ${hub.color};">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/>
            </svg>
          </div>
          <div class="absolute -bottom-6 px-2 py-0.5 bg-[#0A192F] text-white text-[10px] font-black rounded-md whitespace-nowrap shadow-md border border-white/20">
            ${hub.code}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-hub-icon',
        html: markerHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -22]
      });

      const marker = L.marker([hub.lat, hub.lng], { icon: customIcon });

      // Rich Interactive Popup Content
      const popupContent = `
        <div class="font-sans text-[#0A192F] min-w-[260px] max-w-[280px] p-1">
          <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white" style="background-color: ${hub.color};">
              ${hub.code}
            </span>
            <span class="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ⚡ Tiba ${hub.eta}
            </span>
          </div>

          <h4 class="font-black text-sm text-[#0A192F] leading-snug mb-1">${hub.name}</h4>
          <p class="text-[11px] text-slate-500 mb-2 leading-tight">📍 ${hub.address}</p>

          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3 space-y-1.5 text-[11px]">
            <div class="flex items-center justify-between text-slate-700">
              <span class="text-slate-500 font-semibold">Kesiapan Armada:</span>
              <strong class="font-bold text-[#0A192F]">${hub.trucks}</strong>
            </div>
            <div class="flex items-center justify-between text-slate-700">
              <span class="text-slate-500 font-semibold">Status:</span>
              <span class="font-bold text-emerald-600 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Siaga 24 Jam
              </span>
            </div>
            <div class="pt-1 text-[10px] text-slate-500 border-t border-slate-200">
              <strong>Cakupan Utama:</strong> ${hub.zones.slice(0, 3).join(', ')}...
            </div>
          </div>

          <div class="space-y-1.5">
            <a 
              href="${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(
                `Halo PT Kusuma Gemilang Raya, saya butuh penanganan sedot WC terdekat dari *${hub.name}* (${hub.code}). Lokasi saya di Bekasi.`
              )}"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-[#FF6B00] hover:bg-[#E65F00] text-white rounded-xl font-extrabold text-xs shadow-sm transition-all"
            >
              📞 Panggil Posko Ini (WA)
            </a>
            <a 
              href="https://www.google.com/maps/search/?api=1&query=${hub.lat},${hub.lng}"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-[#0A192F] rounded-xl font-bold text-[11px] transition-all"
            >
              🧭 Buka Arah di Google Maps
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: true,
        className: 'custom-leaflet-popup'
      });

      marker.on('click', () => {
        setSelectedHub(hub);
      });

      markersGroupRef.current?.addLayer(marker);
      hubMarkersRef.current[hub.id] = marker;
    });
  }, [selectedHub, showCoverageRadius, viewMode]);

  // Render Real-time Active Fleet & Special Landmarks
  useEffect(() => {
    if (!mapRef.current || viewMode !== 'interactive') return;
    if (!fleetGroupRef.current || !landmarksGroupRef.current) return;

    fleetGroupRef.current.clearLayers();
    landmarksGroupRef.current.clearLayers();

    // 1. Render Active Fleet
    if (showActiveFleet) {
      ACTIVE_FLEET.forEach((truck) => {
        const truckHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="w-8 h-8 rounded-full bg-emerald-500/90 border-2 border-white shadow-lg flex items-center justify-center text-white">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
            </div>
            <div class="absolute -top-6 px-1.5 py-0.5 bg-emerald-800 text-white text-[9px] font-black rounded shadow whitespace-nowrap">
              ${truck.id} • Live GPS
            </div>
          </div>
        `;

        const truckIcon = L.divIcon({
          className: 'custom-fleet-icon',
          html: truckHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18]
        });

        const marker = L.marker([truck.lat, truck.lng], { icon: truckIcon });
        marker.bindPopup(`
          <div class="font-sans text-[#0A192F] p-1 text-xs">
            <div class="flex items-center gap-1.5 font-black text-emerald-700 mb-1">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              ${truck.code}
            </div>
            <p class="text-slate-600 mb-1"><strong>Posisi Siaga:</strong> ${truck.area}</p>
            <p class="text-slate-500 text-[11px] mb-2"><strong>Status Telemetri:</strong> ${truck.status}</p>
            <span class="text-[10px] text-slate-400 block border-t pt-1">Dilengkapi Selang Spiral 50m & Pompa Vakum PTO High Pressure</span>
          </div>
        `);
        fleetGroupRef.current?.addLayer(marker);
      });
    }

    // 2. Render Landmarks (HQ and IPLT)
    if (showLandmarks) {
      SPECIAL_LANDMARKS.forEach((item) => {
        const isHQ = item.type === 'HQ';
        const bgClass = isHQ ? 'bg-[#0A192F]' : 'bg-teal-700';
        const labelText = isHQ ? 'KANTOR PUSAT' : 'IPLT RESMI';

        const landmarkHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="w-9 h-9 rounded-2xl ${bgClass} border-2 border-white shadow-xl flex items-center justify-center text-white">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                ${
                  isHQ
                    ? '<path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>'
                    : '<path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>'
                }
              </svg>
            </div>
            <div class="absolute -bottom-5 px-1.5 py-0.5 bg-slate-900 text-white text-[9px] font-black rounded shadow whitespace-nowrap">
              ${labelText}
            </div>
          </div>
        `;

        const landmarkIcon = L.divIcon({
          className: 'custom-landmark-icon',
          html: landmarkHtml,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
          popupAnchor: [0, -20]
        });

        const marker = L.marker([item.lat, item.lng], { icon: landmarkIcon });
        marker.bindPopup(`
          <div class="font-sans text-[#0A192F] p-1 text-xs">
            <span class="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded text-white ${bgClass} inline-block mb-1">
              ${item.type === 'HQ' ? 'Kantor Operasional & Dispatch' : 'IPLT Sumur Batu (Resmi Pemkot)'}
            </span>
            <h4 class="font-extrabold text-[#0A192F] text-xs leading-snug mb-1">${item.name}</h4>
            <p class="text-slate-600 text-[11px] mb-1">📍 ${item.address}</p>
            <p class="text-slate-500 text-[10px] bg-slate-50 p-1.5 rounded border mb-2">${item.desc}</p>
            ${
              item.type === 'IPLT'
                ? '<a href="#manifest-iplt" class="text-[10px] font-bold text-[#00C2CB] hover:underline block">Lihat Bukti Dokumen Manifest IPLT &rarr;</a>'
                : ''
            }
          </div>
        `);
        landmarksGroupRef.current?.addLayer(marker);
      });
    }
  }, [showActiveFleet, showLandmarks, viewMode]);

  // Center or fly to selected Hub
  const flyToHub = (hub: HubStation) => {
    setSelectedHub(hub);
    if (mapRef.current) {
      mapRef.current.flyTo([hub.lat, hub.lng], 13, {
        duration: 1.2
      });
      // Open popup after fly animation
      setTimeout(() => {
        const marker = hubMarkersRef.current[hub.id];
        if (marker) {
          marker.openPopup();
        }
      }, 700);
    }
  };

  const resetMapAllBekasi = () => {
    if (mapRef.current) {
      mapRef.current.fitBounds(BEKASI_CENTER_BOUNDS, {
        padding: [30, 30]
      });
    }
  };

  const handleOrderHub = (hub: HubStation) => {
    trackConversion('whatsapp_click', 'service_map_hub_order', {
      hubId: hub.id,
      hubName: hub.name
    });

    const text = encodeURIComponent(
      `Halo PT Kusuma Gemilang Raya, saya butuh armada sedot WC terdekat dari *${hub.name}* (${hub.code}). Lokasi saya di Bekasi. Mohon info estimasi kedatangan ke alamat saya.`
    );
    window.open(`${CONTACT_INFO.whatsappUrl}?text=${text}`, '_blank');
  };

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden" id="peta-jangkauan">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E0F7F9] text-[#00C2CB] text-xs font-black uppercase tracking-wider border border-[#00C2CB]/30 mb-3">
            <Map className="w-4 h-4" />
            <span>Peta Operasional & Telemetri Posko Bekasi</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight leading-tight">
            Peta Jangkauan Layanan Interaktif Kota & Kabupaten Bekasi
          </h2>
          
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Eksplorasi posisi <strong>4 Posko Siaga Terdekat</strong>, titik armada tangki yang aktif secara <em>real-time</em>, dan fasilitas pembuangan resmi IPLT Sumur Batu untuk kepastian waktu tiba tercepat.
          </p>
        </div>

        {/* View Mode & Live Telemetry Topbar */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-200 mb-6 flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Tab View Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('interactive')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === 'interactive'
                  ? 'bg-[#0A192F] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#0A192F]'
              }`}
            >
              <Navigation className="w-3.5 h-3.5 text-[#00C2CB]" />
              <span>Peta Interaktif Live (Leaflet)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('static')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === 'static'
                  ? 'bg-[#0A192F] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#0A192F]'
              }`}
            >
              <Map className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Brosur Peta Grafis</span>
            </button>
          </div>

          {/* Right: Live Telemetry Status */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-emerald-800 text-xs font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="hidden sm:inline">GPS Live Telemetri:</span>
              <span className="font-extrabold">{lastUpdateTime || 'Aktif'}</span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <Truck className="w-3.5 h-3.5 text-[#00C2CB]" />
              <span>12+ Unit Tangki Standby</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Map Viewer Card (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-5 shadow-xl border border-slate-200 overflow-hidden space-y-4">
            
            {/* Map Action Tools & Quick Controls (Only in interactive view) */}
            {viewMode === 'interactive' && (
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                
                {/* Layer Filters */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-extrabold text-slate-400 mr-1">Layer:</span>
                  
                  <button
                    type="button"
                    onClick={() => setShowCoverageRadius(!showCoverageRadius)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                      showCoverageRadius 
                        ? 'bg-[#E0F7F9] text-[#00C2CB] border-[#00C2CB]/40' 
                        : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600'
                    }`}
                  >
                    <Compass className="w-3 h-3" />
                    <span>Radius Jangkauan</span>
                    {showCoverageRadius && <Check className="w-3 h-3 ml-0.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowActiveFleet(!showActiveFleet)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                      showActiveFleet 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                        : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600'
                    }`}
                  >
                    <Truck className="w-3 h-3" />
                    <span>Armada GPS ({ACTIVE_FLEET.length})</span>
                    {showActiveFleet && <Check className="w-3 h-3 ml-0.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowLandmarks(!showLandmarks)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                      showLandmarks 
                        ? 'bg-teal-50 text-teal-700 border-teal-300' 
                        : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600'
                    }`}
                  >
                    <Building className="w-3 h-3" />
                    <span>Pusat & IPLT</span>
                    {showLandmarks && <Check className="w-3 h-3 ml-0.5" />}
                  </button>
                </div>

                {/* Right Map Actions */}
                <div className="flex items-center gap-1.5 ml-auto">
                  {/* Tile Style selector */}
                  <select
                    value={tileStyle}
                    onChange={(e) => setTileStyle(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg px-2 py-1 cursor-pointer focus:outline-none"
                    title="Ganti Jenis Peta"
                  >
                    <option value="streets">Peta Bersih (Carto)</option>
                    <option value="osm">OpenStreetMap</option>
                    <option value="satellite">Satelit Esri</option>
                  </select>

                  <button
                    type="button"
                    onClick={resetMapAllBekasi}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                    title="Tampilkan Seluruh Bekasi"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                </div>

              </div>
            )}

            {/* Map Container View */}
            {viewMode === 'interactive' ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100 h-[480px] sm:h-[520px]">
                {/* The Leaflet Div Mount */}
                <div ref={mapContainerRef} className="w-full h-full z-0" />

                {/* Top Floating Badge overlay */}
                <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-white text-xs font-black text-[#0A192F] flex items-center gap-1.5 pointer-events-none">
                  <Navigation className="w-3.5 h-3.5 text-[#00C2CB]" />
                  <span>Peta Interaktif GPS Bekasi Real-Time</span>
                </div>

                {/* Quick Hint Overlay */}
                <div className="absolute top-3 right-3 z-[400] hidden sm:flex items-center gap-1.5 bg-[#0A192F]/85 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg shadow-sm border border-white/10 pointer-events-none">
                  <Info className="w-3 h-3 text-[#00C2CB]" />
                  <span>Klik penanda di peta untuk rincian & tombol panggil</span>
                </div>

                {/* Bottom Overlay Hub Quick Ribbon */}
                <div className="absolute bottom-3 left-3 right-16 z-[400] text-white">
                  <div className="bg-[#0A192F]/90 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-white/15 flex items-center justify-between gap-2 shadow-lg">
                    <div className="text-xs truncate">
                      <span className="text-slate-400 block text-[10px] font-semibold">Posko Terpilih:</span>
                      <strong className="text-white font-extrabold truncate block">{selectedHub.name}</strong>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[11px] font-bold text-[#00C2CB] bg-[#00C2CB]/20 px-2 py-0.5 rounded-md border border-[#00C2CB]/30">
                        ⚡ {selectedHub.eta}
                      </span>
                      <button
                        type="button"
                        onClick={() => flyToHub(selectedHub)}
                        className="px-2 py-0.5 bg-[#FF6B00] hover:bg-[#E65F00] text-white font-black text-[10px] rounded-md transition-colors cursor-pointer"
                      >
                        Fokus
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              /* Static Illustrated Map View */
              <div className="relative rounded-2xl overflow-hidden shadow-inner border border-slate-200 aspect-[16/10] bg-slate-100 group">
                <img
                  src="/src/assets/images/peta_layanan_bekasi_1791391568077.jpg"
                  alt="Peta Jangkauan Layanan Sedot WC PT Kusuma Gemilang Raya di Kota dan Kabupaten Bekasi"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 via-transparent to-black/20 pointer-events-none"></div>

                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-md border border-white text-xs font-black text-[#0A192F] flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-[#00C2CB]" />
                  <span>Radius Cakupan 100% Seluruh Bekasi</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="bg-[#0A192F]/85 backdrop-blur-md p-3.5 rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs">
                      <span className="text-slate-400 block text-[10px]">Posko Terpilih:</span>
                      <strong className="text-white font-extrabold">{selectedHub.name}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#00C2CB] bg-[#00C2CB]/20 px-2.5 py-1 rounded-lg border border-[#00C2CB]/30">
                        ⚡ Tiba {selectedHub.eta}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Map Legend & Assurance Points */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Bebas Biaya Transport Tambahan</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-[#00C2CB] shrink-0" />
                <span>Selang 50m Masuk Gang Padat</span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0" />
                <span>Akses Jalur Cepat Tol</span>
              </div>
            </div>

            {/* IPLT Transparency Callout below Map */}
            <div className="bg-[#E0F7F9]/60 border border-[#00C2CB]/30 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#00C2CB] text-white flex items-center justify-center shrink-0 font-black shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-[#0A192F] block">Legalitas Pembuangan Terjamin ke IPLT Sumur Batu</strong>
                  <span className="text-slate-600 text-[11px]">Seluruh armada wajib buang ke Instalasi Pengolahan Resmi DLH Bekasi & ber-Manifest.</span>
                </div>
              </div>
              <a
                href="#manifest-iplt"
                className="px-3 py-1.5 bg-[#0A192F] hover:bg-[#00C2CB] text-white font-extrabold text-[11px] rounded-xl shrink-0 transition-colors"
              >
                Cek Manifest
              </a>
            </div>

          </div>

          {/* Right Column: 4 Hub Cards & Selector (5 Cols) */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#0A192F] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#00C2CB]" />
                Pilih Posko Armada Terdekat:
              </h3>
              <span className="text-[11px] font-bold text-slate-400">4 Titik Siaga 24 Jam</span>
            </div>

            {OPERATIONAL_HUBS.map((hub) => {
              const isSelected = selectedHub.id === hub.id;
              return (
                <div
                  key={hub.id}
                  onClick={() => flyToHub(hub)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer bg-white ${
                    isSelected
                      ? 'border-[#00C2CB] ring-2 ring-[#00C2CB]/20 shadow-md -translate-y-0.5'
                      : 'border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0 shadow-sm transition-transform hover:scale-105"
                        style={{ backgroundColor: hub.color }}
                      >
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-sm text-[#0A192F]">{hub.name}</h4>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-[#00C2CB] animate-ping" title="Aktif Terpilih"></span>
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-slate-400">{hub.code} • {hub.address}</span>
                      </div>
                    </div>

                    <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shrink-0 flex items-center gap-1 shadow-2xs">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      {hub.eta}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 mb-3 pl-11">
                    <span className="font-semibold text-slate-500 block text-[11px]">Cakupan Wilayah:</span>
                    <p className="line-clamp-2 leading-relaxed text-slate-700">
                      {hub.zones.join(', ')}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between pl-11">
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#00C2CB]" />
                      {hub.trucks}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          flyToHub(hub);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0A192F] text-[11px] font-bold transition-all cursor-pointer"
                        title="Tampilkan lokasi di peta"
                      >
                        Lihat di Peta
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOrderHub(hub);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#0A192F] hover:bg-[#FF6B00] text-white text-[11px] font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <PhoneCall className="w-3 h-3" />
                        Panggil Posko Ini
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Quick Dispatch Banner */}
            <div className="bg-gradient-to-r from-[#0A192F] to-[#172A45] text-white p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#00C2CB]/20 text-[#00C2CB] flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-white">Butuh Armada Tiba Lebih Cepat?</strong>
                  <span className="text-[11px] text-cyan-200">Share location WhatsApp untuk penugasan truk terdekat</span>
                </div>
              </div>

              <a
                href={`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(
                  'Halo PT Kusuma Gemilang Raya, saya butuh penanganan sedot WC darurat di lokasi saya. Mohon kirim armada terdekat sesuai lokasi saya.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#E65F00] text-white font-extrabold text-[11px] shrink-0 shadow-sm"
              >
                Kirim Lokasi Maps
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
