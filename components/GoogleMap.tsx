"use client";
import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { Property } from "../lib/propertyData";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleMapProps {
  properties: Property[];
  onMarkerClick?: (properties: Property[]) => void;
  onClusterClick?: (properties: Property[]) => void;
  highlightedPropertyId?: string;
  onGeocodeResult?: (address: string, lat: number, lng: number) => void;
}

// 마커 아이콘 설정 함수
const getMarkerIcon = (property: Property, isHighlighted: boolean = false) => {
  // 모든 마커를 네이버 지도 스타일 진한 초록색으로 통일
  const color = '#00C853'; // 네이버 지도 스타일 진한 초록
  // 월세는 투명도 적용
  const opacity = property.dealType === '월세' ? 0.7 : 1;
  // 강조 시 크기/테두리/그림자
  const scale = isHighlighted ? 16 : 12;
  const strokeColor = isHighlighted ? '#222' : '#fff';
  const strokeWeight = isHighlighted ? 4 : 2;
  const shadow = isHighlighted
    ? {
        anchor: new window.google.maps.Point(0, 0),
        url: '', // 그림자 이미지 사용 시 적용
      }
    : undefined;
  return {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: opacity,
    strokeColor,
    strokeWeight,
    scale,
    labelOrigin: new window.google.maps.Point(0, 0),
    label: {
      text: '1',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '12px',
    },
  };
};

export default function GoogleMap({ 
  properties = [], 
  onMarkerClick, 
  onClusterClick,
  highlightedPropertyId,
  onGeocodeResult 
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const clustererRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    
    setIsLoading(true);
    setError(null);
    
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY || "",
      version: "weekly",
      libraries: ["geocoding"]
    });
    
    loader.load().then(() => {
      if (mapRef.current) {
        try {
          mapInstance.current = new window.google.maps.Map(mapRef.current, {
            center: { lat: 37.5665, lng: 126.9780 }, // 서울 중심
            zoom: 11,
            restriction: {
              latLngBounds: {
                north: 38.05,
                south: 33.9,
                east: 129.6,
                west: 125.8,
              },
              strictBounds: true,
            },
            minZoom: 7,
            maxZoom: 18,
            gestureHandling: 'cooperative',
            scrollwheel: true,
            disableDoubleClickZoom: false,
            // 지도 스타일 개선
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ]
          });
          
          // Geocoder 초기화
          geocoderRef.current = new window.google.maps.Geocoder();
          setIsLoading(false);
        } catch (err) {
          console.error('지도 초기화 오류:', err);
          setError('지도를 로드하는 중 오류가 발생했습니다.');
          setIsLoading(false);
        }
      }
    }).catch((err) => {
      console.error('Google Maps 로드 오류:', err);
      setError('Google Maps를 로드할 수 없습니다. 인터넷 연결을 확인해주세요.');
      setIsLoading(false);
    });
    
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, []);

  // 주소를 좌표로 변환하는 함수
  const geocodeAddress = (address: string): Promise<{lat: number, lng: number} | null> => {
    return new Promise((resolve, reject) => {
      if (!geocoderRef.current) {
        reject(new Error('Geocoder not initialized'));
        return;
      }

      geocoderRef.current.geocode({ address }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          const lat = location.lat();
          const lng = location.lng();
          
          console.log('주소 변환 성공:', address, '→', lat, lng);
          resolve({ lat, lng });
        } else {
          console.error('주소 변환 실패:', address, status);
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });
  };

  // 외부에서 호출할 수 있도록 함수를 window 객체에 추가
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).geocodeAddress = geocodeAddress;
      (window as any).onGeocodeResult = onGeocodeResult;
    }
  }, [onGeocodeResult]);

  useEffect(() => {
    console.log('GoogleMap properties:', properties);
    console.log('GoogleMap mapInstance.current:', mapInstance.current);
    console.log('GoogleMap window.google:', typeof window.google);
    if (!mapInstance.current || !window.google || !Array.isArray(properties) || properties.length === 0) return;
    // 기존 마커 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
      clustererRef.current = null;
    }
    // 새 마커 추가
    const newMarkers = properties.map((property) => {
      if (property.location?.lat && property.location?.lng) {
        const isHighlighted = property.id === highlightedPropertyId;
        const marker = new window.google.maps.Marker({
          position: { lat: property.location.lat, lng: property.location.lng },
          map: mapInstance.current,
          title: property.title,
          icon: getMarkerIcon(property, isHighlighted),
          label: {
            text: '1',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '12px',
          },
        });
        // 마커 클릭 이벤트 추가 (동일 좌표 매물 모두 전달)
        if (onMarkerClick) {
          marker.addListener('click', () => {
            const sameLocation = properties.filter(
              p => p.location?.lat === property.location?.lat && p.location?.lng === property.location?.lng
            );
            onMarkerClick(sameLocation);
          });
        }
        return marker;
      }
      return null;
    }).filter(Boolean);
    markersRef.current = newMarkers;
    // MarkerClusterer 적용
    if (window.google && window.google.maps && newMarkers.length > 0) {
      clustererRef.current = new MarkerClusterer({
        map: mapInstance.current,
        markers: newMarkers,
        renderer: {
          render: ({ count, position, markers }) => {
            const size = count < 10 ? 40 : count < 100 ? 48 : 56;
            const color = '#00C853';
            const clusterMarker = new window.google.maps.Marker({
              position,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: color,
                fillOpacity: 0.9,
                strokeColor: '#fff',
                strokeWeight: 2,
                scale: size / 4,
                labelOrigin: new window.google.maps.Point(0, 0),
              },
              label: {
                text: String(count),
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '16px',
              },
              zIndex: 9999,
            });
            // 클러스터 클릭 이벤트
            if (onClusterClick) {
              clusterMarker.addListener('click', () => {
                // clusterer.getMarkers()는 전체 마커이므로, markers 인자를 활용
                const markerPositions = markers.map((m:any) => m.getPosition());
                const clusterProperties = properties.filter(p =>
                  markerPositions.some((pos:any) =>
                    p.location?.lat && p.location?.lng &&
                    Math.abs(p.location.lat - pos.lat()) < 1e-6 && 
                    Math.abs(p.location.lng - pos.lng()) < 1e-6
                  )
                );
                onClusterClick(clusterProperties);
              });
            }
            return clusterMarker;
          }
        }
      });
    }
  }, [properties, mapInstance.current, onMarkerClick, highlightedPropertyId]);

  // 강조된 매물이 변경되면 해당 마커에 애니메이션 적용
  useEffect(() => {
    if (!mapInstance.current || !window.google || !highlightedPropertyId) return;
    
    markersRef.current.forEach((marker, index) => {
      const property = properties[index];
      if (property && property.id === highlightedPropertyId) {
        // 마커 아이콘 업데이트 (강조된 상태로)
        marker.setIcon(getMarkerIcon(property, true));
        
        // 마커 애니메이션 효과
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        
        // 지도 중심을 해당 마커로 이동
        mapInstance.current.panTo({ lat: property.lat, lng: property.lng });
        
        // 3초 후 애니메이션 중지
        setTimeout(() => {
          marker.setAnimation(null);
        }, 3000);
        
        console.log('마커 애니메이션 적용:', property.title);
      } else if (property) {
        // 다른 마커들의 애니메이션 중지 및 아이콘 복원
        marker.setAnimation(null);
        marker.setIcon(getMarkerIcon(property, false));
      }
    });
  }, [highlightedPropertyId, properties]);

  if (error) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">지도 로드 오류</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapRef}
        style={{ 
          width: "100%", 
          height: "100vh", 
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
          overflow: "auto"
        }}
      />
      
      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">지도를 로드하는 중...</p>
          </div>
        </div>
      )}
    </div>
  );
} 