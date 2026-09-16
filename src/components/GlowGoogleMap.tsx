'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MVPSpa, formatShortPrice } from '@/lib/mvp-data';

interface GlowGoogleMapProps {
  spas: MVPSpa[];
  selectedSpaId?: string | null;
  onSelectSpa?: (id: string) => void;
  userCoords?: { lat: number; lon: number } | null;
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
  activePrice = 149000,
  className = 'w-full h-full',
  interactive = true,
  initialCenter,
  initialZoom = 13,
}: GlowGoogleMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const overlaysRef = useRef<any[]>([]);
  const userOverlayRef = useRef<any>(null);
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
      private spa: MVPSpa;
      private isSelected: boolean;
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

        div.innerHTML = `
          <div style="
            display: inline-flex;
            align-items: center;
            gap: 5px;
            white-space: nowrap;
            padding: 5px 10px 5px 7px;
            border-radius: 9999px;
            background: ${this.isSelected ? '#40813D' : '#ffffff'};
            color: ${this.isSelected ? '#ffffff' : '#093E06'};
            font-family: var(--font-sans, -apple-system, BlinkMacSystemFont, sans-serif);
            font-size: 12px;
            font-weight: 700;
            border: 1.5px solid ${this.isSelected ? '#093E06' : '#40813D'};
            box-shadow: 0 4px 14px rgba(9, 62, 6, ${this.isSelected ? '0.35' : '0.18'});
          ">
            <span style="
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background: ${this.isSelected ? '#ffffff' : '#E8FDE7'};
              display: inline-block;
              box-shadow: inset 0 0 0 3px ${this.isSelected ? '#093E06' : '#40813D'};
            "></span>
            <span>${this.label}</span>
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
    spas.forEach((spa) => {
      const pos = new g.LatLng(spa.lat, spa.lng);
      bounds.extend(pos);

      const isSel = spa.id === selectedSpaId;
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

    // Fit bounds if multiple spas and interactive
    if (interactive && spas.length > 1) {
      // Add bottom padding so the floating card doesn't cover markers
      mapRef.current.fitBounds(bounds, {
        top: 60,
        right: 40,
        bottom: 180,
        left: 40,
      });
    } else if (spas.length === 1) {
      mapRef.current.setCenter({ lat: spas[0].lat, lng: spas[0].lng });
      mapRef.current.setZoom(15);
    }
  }, [isReady, spas, selectedSpaId, priceLabel, onSelectSpa, interactive, clearOverlays]);

  // Center on selected spa when selectedSpaId changes
  useEffect(() => {
    if (!isReady || !mapRef.current || !selectedSpaId) return;
    const selected = spas.find((s) => s.id === selectedSpaId);
    if (selected) {
      mapRef.current.panTo({ lat: selected.lat, lng: selected.lng });
    }
  }, [isReady, selectedSpaId, spas]);

  // User location marker
  useEffect(() => {
    if (!isReady || !mapRef.current) return;
    const g = (window as any).google?.maps;
    if (!g || !g.OverlayView) return;

    if (userOverlayRef.current) {
      try {
        userOverlayRef.current.setMap(null);
      } catch (e) {
        /* noop */
      }
      userOverlayRef.current = null;
    }

    if (!userCoords) return;

    class UserLocationOverlay extends g.OverlayView {
      private div: HTMLDivElement | null = null;
      private position: any;

      constructor(position: any) {
        super();
        this.position = position;
      }

      onAdd() {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.transform = 'translate(-50%, -50%)';
        div.style.pointerEvents = 'none';
        div.style.zIndex = '50';

        div.innerHTML = `
          <div style="
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #1B6EF3;
            border: 2.5px solid #ffffff;
            box-shadow: 0 0 0 6px rgba(27, 110, 243, 0.25), 0 4px 10px rgba(0,0,0,0.2);
          "></div>
        `;

        this.div = div;
        const panes = this.getPanes();
        panes?.overlayLayer?.appendChild(div);
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

    const userPos = new g.LatLng(userCoords.lat, userCoords.lon);
    const userOverlay = new UserLocationOverlay(userPos);
    userOverlay.setMap(mapRef.current);
    userOverlayRef.current = userOverlay;

    return () => {
      if (userOverlayRef.current) {
        try {
          userOverlayRef.current.setMap(null);
        } catch (e) {
          /* noop */
        }
        userOverlayRef.current = null;
      }
    };
  }, [isReady, userCoords]);

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
