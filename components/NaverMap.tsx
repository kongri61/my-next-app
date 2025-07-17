'use client'

import React, { useEffect, useRef } from 'react'
import { Property } from '../types/property'

interface NaverMapProps {
  properties: Property[]
  selectedProperty: Property | null
  onPropertySelect: (property: Property) => void
}

export default function NaverMap({ properties, selectedProperty, onPropertySelect }: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    const loadNaverMap = () => {
      if (window.naver && window.naver.maps) {
        initializeMap()
      } else {
        // Naver Maps API 스크립트 로드
        const script = document.createElement('script')
        script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID || 'your_naver_client_id'}`
        script.onload = initializeMap
        document.head.appendChild(script)
      }
    }

    loadNaverMap()
  }, [])

  const initializeMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return

    const naver = window.naver
    
    // 서울 중심 좌표
    const seoulCenter = new naver.maps.LatLng(37.5665, 126.9780)

    // 지도 초기화
    mapInstanceRef.current = new naver.maps.Map(mapRef.current, {
      center: seoulCenter,
      zoom: 11,
      minZoom: 7,
      maxZoom: 21,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT
      }
    })

    // 매물 마커 추가
    addPropertyMarkers()
  }

  const addPropertyMarkers = () => {
    if (!mapInstanceRef.current || !properties.length) return

    const naver = window.naver
    
    // 기존 마커 제거
    markersRef.current.forEach(marker => {
      marker.setMap(null)
    })
    markersRef.current = []

    // 새 마커 추가
    properties.forEach(property => {
      const position = new naver.maps.LatLng(property.lat, property.lng)
      
      const marker = new naver.maps.Marker({
        position: position,
        map: mapInstanceRef.current,
        icon: {
          content: createMarkerContent(property),
          size: new naver.maps.Size(40, 40),
          anchor: new naver.maps.Point(20, 20)
        }
      })

      // 마커 클릭 이벤트
      naver.maps.Event.addListener(marker, 'click', () => {
        onPropertySelect(property)
      })

      // 정보창 생성
      const infoWindow = new naver.maps.InfoWindow({
        content: createInfoWindowContent(property),
        maxWidth: 300,
        backgroundColor: '#fff',
        borderColor: '#5CA5FF',
        borderWidth: 2,
        anchorSize: new naver.maps.Size(20, 20),
        anchorColor: '#fff',
        pixelOffset: new naver.maps.Point(0, -20)
      })

      // 마커에 정보창 연결
      marker.infoWindow = infoWindow

      // 마커 호버 이벤트
      naver.maps.Event.addListener(marker, 'mouseover', () => {
        infoWindow.open(mapInstanceRef.current, marker)
      })

      naver.maps.Event.addListener(marker, 'mouseout', () => {
        infoWindow.close()
      })

      markersRef.current.push(marker)
    })
  }

  const createMarkerContent = (property: Property) => {
    return `
      <div style="
        background: #fff;
        border: 2px solid #5CA5FF;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        color: #5CA5FF;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      ">
        ${property.price}
      </div>
    `
  }

  const createInfoWindowContent = (property: Property) => {
    return `
      <div style="padding: 10px; max-width: 250px;">
        <div style="margin-bottom: 8px;">
          <img src="${property.image}" alt="${property.title}" 
               style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px;">
        </div>
        <h3 style="font-size: 14px; font-weight: bold; margin: 0 0 4px 0; color: #333;">
          ${property.title}
        </h3>
        <p style="font-size: 16px; font-weight: bold; color: #5CA5FF; margin: 0 0 4px 0;">
          ${property.price}
        </p>
        <p style="font-size: 12px; color: #666; margin: 0 0 4px 0;">
          ${property.address}
        </p>
        <div style="font-size: 11px; color: #888;">
          ${property.bedrooms}개 방 | ${property.area}
        </div>
        <button onclick="window.selectProperty('${property.id}')" 
                style="
                  width: 100%;
                  margin-top: 8px;
                  padding: 6px 12px;
                  background: #5CA5FF;
                  color: white;
                  border: none;
                  border-radius: 4px;
                  font-size: 12px;
                  cursor: pointer;
                ">
          상세보기
        </button>
      </div>
    `
  }

  // 선택된 매물로 지도 이동
  useEffect(() => {
    if (selectedProperty && mapInstanceRef.current) {
      const position = new window.naver.maps.LatLng(
        selectedProperty.lat, 
        selectedProperty.lng
      )
      
      mapInstanceRef.current.setCenter(position)
      mapInstanceRef.current.setZoom(16)
      
      // 선택된 매물의 정보창 열기
      markersRef.current.forEach(marker => {
        if (marker.getPosition().lat() === selectedProperty.lat && 
            marker.getPosition().lng() === selectedProperty.lng) {
          marker.infoWindow.open(mapInstanceRef.current, marker)
        }
      })
    }
  }, [selectedProperty])

  // 매물 목록이 변경되면 마커 업데이트
  useEffect(() => {
    if (mapInstanceRef.current) {
      addPropertyMarkers()
    }
  }, [properties])

  // 전역 함수로 매물 선택 가능하게 설정
  useEffect(() => {
    ;(window as any).selectProperty = (propertyId: string) => {
      const property = properties.find(p => p.id === propertyId)
      if (property) {
        onPropertySelect(property)
      }
    }

    return () => {
      delete (window as any).selectProperty
    }
  }, [properties, onPropertySelect])

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full min-h-[400px]"
    />
  )
} 