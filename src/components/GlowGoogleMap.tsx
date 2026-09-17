'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MVPSpa, formatShortPrice } from '@/lib/mvp-data';

interface GlowGoogleMapProps {
  spas: MVPSpa[];
  selectedSpaId?: string | null;
  onSelectSpa?: (id: string) => void;
  userCoords?: { lat: number; lon: number } | null;
  searchCenter?: { lat: number; lng: number } | null;
  searchTitle?: string;
  activePrice?: number;
  className?: string;
  interactive?: boolean;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
}

const DEFAULT_CENTER = { lat: 21.0333, lng: 105.7925 }; // Cầu Giấy, Hà Nội
const SCRIPT_ID = 'glow-google-maps-sdk';
const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ||
  'AIzaSyD3YIsbyA_4gb6LM5ydwfIYnktrGrIYxsQ';

let mapsLoadingPromise: Promise<void> | null = null;

function loadGoogleMapsSdk(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('SSR'));
  const w = window as any;
  if (w.google?.maps?.Map) {
    return Promise.resolve();
  }

  if (mapsLoadingPromise) return mapsLoadingPromise;

  mapsLoadingPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if (w.google?.maps?.Map) {
        resolve();
      } else {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject(new Error('Failed to load Google Maps SDK')));
      }
      return;
    }

    const callbackName = '__glowGoogleMapsCallback_' + Math.random().toString(36).substring(2, 9);
    w[callbackName] = () => {
      delete w[callbackName];
      resolve();
    };

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      GOOGLE_MAPS_API_KEY
    )}&libraries=places&language=vi&region=VN&callback=${callbackName}`;

    script.onerror = () => {
      reject(new Error('Failed to load Google Maps script'));
    };

    document.head.appendChild(script);
  }).finally(() => {
    mapsLoadingPromise = null;
  });

  return mapsLoadingPromise;
}

export default function GlowGoogleMap({
  spas,
  selectedSpaId,
  onSelectSpa,
  userCoords,
  searchCenter,
  searchTitle,
  activePrice = 149000,
  className = 'w-full h-full',
  interactive = true,
  initialCenter,
  initialZoom = 13,
}: GlowGoogleMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const overlaysRef = useRef<any[]>([]);
  const searchMarkerRef = useRef<any>(null);
  const lastFitKeyRef = useRef<string>('');
  const selectedSpaIdRef = useRef<string | null | undefined>(selectedSpaId);
  selectedSpaIdRef.current = selectedSpaId;
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const priceLabel = formatShortPrice(activePrice);

  // Initialize Map Instance
  useEffect(() => {
    if (!containerRef.current) return;
    let isCancelled = false;

    loadGoogleMapsSdk()
      .then(() => {
        if (isCancelled || !containerRef.current) return;
        const g = (window as any).google?.maps;
        if (!g) return;

        if (!mapRef.current) {
          const map = new g.Map(containerRef.current, {
            center: initialCenter || DEFAULT_CENTER,
            zoom: initialZoom,
            gestureHandling: interactive ? 'greedy' : 'none',
            disableDefaultUI: !interactive,
            zoomControl: interactive,
            zoomControlOptions: {
              position: g.ControlPosition.RIGHT_TOP,
            },
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            rotateControl: false,
            scaleControl: false,
            clickableIcons: false,
            // Clean modern muted styling
            styles: [
              {
                featureType: 'poi.business',
                stylers: [{ visibility: 'off' }],
              },
              {
                featureType: 'transit',
                stylers: [{ visibility: 'simplified' }],
              },
              {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{ lightness: 100 }, { visibility: 'simplified' }],
              },
            ],
          });

          mapRef.current = map;
          if (typeof window !== 'undefined') {
            (window as any).__glowGoogleMap = map;
          }
          setIsReady(true);
        }
      })
      .catch((err) => {
        console.error('Google Maps load error:', err);
        if (!isCancelled) setLoadError('Không thể tải bản đồ Google Maps.');
      });

    return () => {
      isCancelled = true;
    };
  }, [interactive, initialCenter, initialZoom]);

  // Clean overlays helper
  const clearOverlays = useCallback(() => {
    overlaysRef.current.forEach((ov) => {
      try {
        ov.setMap(null);
      } catch (e) {
        /* noop */
      }
    });
    overlaysRef.current = [];
  }, []);

  // Update Overlays whenever spas, selectedSpaId, or priceLabel changes
  useEffect(() => {
    if (!isReady || !mapRef.current) return;
    const g = (window as any).google?.maps;
    if (!g || !g.OverlayView) return;

    clearOverlays();

    class CustomMarkerOverlay extends g.OverlayView {
      private div: HTMLDivElement | null = null;
      private position: any;
      public spa: MVPSpa;
      public isSelected: boolean;
      private label: string;
      private onClick: () => void;

      constructor(
        position: any,
        spa: MVPSpa,
        isSelected: boolean,
        label: string,
        onClick: () => void
      ) {
        super();
        this.position = position;
        this.spa = spa;
        this.isSelected = isSelected;
        this.label = label;
        this.onClick = onClick;
      }

      onAdd() {
        const div = document.createElement('div');
        div.className = `gbp-map-marker ${this.isSelected ? 'is-selected' : ''}`;
        div.style.position = 'absolute';
        div.style.cursor = 'pointer';
        div.style.zIndex = this.isSelected ? '20' : '10';

        const iconUrl = this.isSelected ? '/icons/map-pin-mint.png' : '/icons/map-pin-green.png';

        div.innerHTML = `
          <div style="
            position: relative;
            width: ${this.isSelected ? '42px' : '38px'};
            height: ${this.isSelected ? '42px' : '38px'};
            border-radius: 50%;
            background: #ffffff;
            box-shadow: 0 3px 12px rgba(0, 0, 0, 0.22), 0 1px 4px rgba(0, 0, 0, 0.14)${
              this.isSelected ? ', 0 0 0 3.5px #356F32' : ''
            };
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #ffffff;
            transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          ">
            <img
              src="${iconUrl}"
              alt="${this.spa.name}"
              style="
                width: 100%;
                height: 100%;
                border-radius: 50%;
                display: block;
                object-fit: cover;
                pointer-events: none;
              "
            />
          </div>
        `;

        div.addEventListener('click', (e) => {
          e.stopPropagation();
          this.onClick();
        });

        this.div = div;
        const panes = this.getPanes();
        panes?.overlayMouseTarget?.appendChild(div);
      }

      setSelected(isSelected: boolean) {
        this.isSelected = isSelected;
        if (!this.div) return;
        this.div.className = `gbp-map-marker ${isSelected ? 'is-selected' : ''}`;
        this.div.style.zIndex = isSelected ? '20' : '10';
        const img = this.div.querySelector('img');
        if (img) {
          img.src = isSelected ? '/icons/map-pin-mint.png' : '/icons/map-pin-green.png';
        }
        const inner = this.div.firstElementChild as HTMLElement | null;
        if (inner) {
          inner.style.width = isSelected ? '42px' : '38px';
          inner.style.height = isSelected ? '42px' : '38px';
          inner.style.boxShadow = isSelected
            ? '0 3px 12px rgba(0, 0, 0, 0.22), 0 1px 4px rgba(0, 0, 0, 0.14), 0 0 0 3.5px #356F32'
            : '0 3px 12px rgba(0, 0, 0, 0.22), 0 1px 4px rgba(0, 0, 0, 0.14)';
        }
      }

      draw() {
        const overlayProjection = this.getProjection();
        if (!overlayProjection || !this.div) return;
        const point = overlayProjection.fromLatLngToDivPixel(this.position);
        if (point) {
          this.div.style.left = point.x + 'px';
          this.div.style.top = point.y + 'px';
        }
      }

      onRemove() {
        if (this.div?.parentNode) {
          this.div.parentNode.removeChild(this.div);
          this.div = null;
        }
      }
    }

    // Add overlay for each spa
    const bounds = new g.LatLngBounds();
    const effectiveCenter =
      searchCenter || (userCoords ? { lat: userCoords.lat, lng: userCoords.lon } : null);

    if (
      effectiveCenter &&
      typeof effectiveCenter.lat === 'number' &&
      !isNaN(effectiveCenter.lat) &&
      typeof effectiveCenter.lng === 'number' &&
      !isNaN(effectiveCenter.lng)
    ) {
      bounds.extend(new g.LatLng(effectiveCenter.lat, effectiveCenter.lng));
    }

    spas.forEach((spa) => {
      const pos = new g.LatLng(spa.lat, spa.lng);
      bounds.extend(pos);

      const isSel = spa.id === selectedSpaIdRef.current;
      const overlay = new CustomMarkerOverlay(
        pos,
        spa,
        isSel,
        priceLabel,
        () => {
          if (onSelectSpa) onSelectSpa(spa.id);
        }
      );
      overlay.setMap(mapRef.current);
      overlaysRef.current.push(overlay);
    });

    // Fit bounds ONLY when spas list or searchCenter changes (not on clicking marker)
    if (interactive) {
      const currentFitKey = `${spas.map((s) => s.id).join(',')}_${effectiveCenter?.lat}_${effectiveCenter?.lng}`;
      if (currentFitKey !== lastFitKeyRef.current) {
        lastFitKeyRef.current = currentFitKey;
        if (spas.length === 1 && !effectiveCenter) {
          mapRef.current.setCenter({ lat: spas[0].lat, lng: spas[0].lng });
          mapRef.current.setZoom(initialZoom || 15);
        } else if (spas.length > 0) {
          mapRef.current.fitBounds(bounds, {
            top: 60,
            right: 40,
            bottom: 180,
            left: 40,
          });
        } else if (effectiveCenter) {
          mapRef.current.setCenter(effectiveCenter);
          mapRef.current.setZoom(14);
        }
      }
    }
  }, [isReady, spas, priceLabel, onSelectSpa, interactive, clearOverlays, searchCenter, userCoords]);

  // Update marker selection and pan to selected spa while preserving current zoom
  useEffect(() => {
    if (!isReady || !mapRef.current) return;
    overlaysRef.current.forEach((ov) => {
      if (ov && typeof ov.setSelected === 'function' && ov.spa) {
        ov.setSelected(ov.spa.id === selectedSpaId);
      }
    });
    if (selectedSpaId) {
      const selected = spas.find((s) => s.id === selectedSpaId);
      if (selected) {
        mapRef.current.panTo({ lat: selected.lat, lng: selected.lng });
      }
    }
  }, [isReady, selectedSpaId, spas]);

  // Search / User location marker (Pink animated bounce pin with ripple waves)
  useEffect(() => {
    if (!isReady || !mapRef.current) return;
    const g = (window as any).google?.maps;
    if (!g || !g.OverlayView) return;

    if (searchMarkerRef.current) {
      try {
        searchMarkerRef.current.setMap(null);
      } catch (e) {
        /* noop */
      }
      searchMarkerRef.current = null;
    }

    const effectiveCenter =
      searchCenter || (userCoords ? { lat: userCoords.lat, lng: userCoords.lon } : null);

    if (
      effectiveCenter &&
      typeof effectiveCenter.lat === 'number' &&
      !isNaN(effectiveCenter.lat) &&
      typeof effectiveCenter.lng === 'number' &&
      !isNaN(effectiveCenter.lng)
    ) {
      class SearchLocationOverlay extends g.OverlayView {
        private div: HTMLDivElement | null = null;
        private position: any;
        private title: string;

        constructor(position: any, title: string) {
          super();
          this.position = position;
          this.title = title;
        }

        onAdd() {
          const div = document.createElement('div');
          div.className = 'glow-search-location-marker';
          div.style.position = 'absolute';
          div.style.zIndex = '9999';
          div.style.cursor = 'default';
          div.title = this.title;
          div.innerHTML = `
            <img
              src="/location.svg"
              alt="${this.title}"
              style="width: 80px; height: 80px; display: block; transform: translate(-40px, -57px); pointer-events: none;"
            />
          `;
          this.div = div;
          const panes = this.getPanes();
          panes?.overlayMouseTarget?.appendChild(div);
        }

        draw() {
          const overlayProjection = this.getProjection();
          if (!overlayProjection || !this.div) return;
          const point = overlayProjection.fromLatLngToDivPixel(this.position);
          if (point) {
            this.div.style.left = point.x + 'px';
            this.div.style.top = point.y + 'px';
          }
        }

        onRemove() {
          if (this.div?.parentNode) {
            this.div.parentNode.removeChild(this.div);
            this.div = null;
          }
        }
      }

      try {
        const pos = new g.LatLng(effectiveCenter.lat, effectiveCenter.lng);
        const searchOverlay = new SearchLocationOverlay(pos, searchTitle || 'Vị trí tìm kiếm');
        searchOverlay.setMap(mapRef.current);
        searchMarkerRef.current = searchOverlay;
      } catch (err) {
        console.warn('Failed to create search overlay:', err);
      }
    }

    return () => {
      if (searchMarkerRef.current) {
        try {
          searchMarkerRef.current.setMap(null);
        } catch (e) {
          /* noop */
        }
        searchMarkerRef.current = null;
      }
    };
  }, [isReady, searchCenter, userCoords, searchTitle]);

  // Handle Window Resize Trigger
  useEffect(() => {
    if (!isReady || !mapRef.current) return;
    const g = (window as any).google?.maps;
    const handleResize = () => {
      if (mapRef.current && g) {
        g.event.trigger(mapRef.current, 'resize');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isReady]);

  return (
    <div className={`relative overflow-hidden bg-[#ECEEE9] ${className}`}>
      <div ref={containerRef} className="w-full h-full" />
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#ECEEE9]/90 p-4 text-center text-sm text-stone-600">
          {loadError}
        </div>
      )}
    </div>
  );
}
