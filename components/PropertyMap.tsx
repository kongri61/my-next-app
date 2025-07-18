'use client'

import React, { useEffect, useRef } from 'react'
import { Property } from '../lib/propertyData'
import KakaoMap from './KakaoMap'

interface PropertyMapProps {
  properties: Property[]
  selectedProperty: Property | null
  onPropertySelect: (property: Property) => void
}

export default function PropertyMap({ properties, selectedProperty, onPropertySelect }: PropertyMapProps) {
  // Ïπ¥Ïπ¥?§Îßµ API ?§Í? ?ÜÏúºÎ©?OpenStreetMap ?¨Ïö©
  const useKakaoMap = process.env.NEXT_PUBLIC_KAKAO_APP_KEY && 
                     process.env.NEXT_PUBLIC_KAKAO_APP_KEY !== 'your_kakao_app_key_here'

  if (useKakaoMap) {
    return (
      <KakaoMap 
        properties={properties}
        selectedProperty={selectedProperty}
        onPropertySelect={onPropertySelect}
      />
    )
  }

  // OpenStreetMap ?¥Î∞±
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    // Leaflet CSS Î°úÎìú
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    // Leaflet??Î°úÎìú?òÏóà?îÏ? ?ïÏù∏
    if (typeof window !== 'undefined' && window.L) {
      initializeMap()
    } else {
      // Leaflet??Î°úÎìú?òÏ? ?äÏïò?§Î©¥ ?§ÌÅ¨Î¶ΩÌä∏Î•??ôÏ†Å?ºÎ°ú Î°úÎìú
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = initializeMap
      document.head.appendChild(script)
    }
  }, [])

  const initializeMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return

    const L = (window as any).L
    
    // ?Ä?úÎ?Íµ?Ï§ëÏã¨ Ï¢åÌëú
    const koreaCenter = [36.3, 127.9]

    // ÏßÄ??Ï¥àÍ∏∞??    mapInstanceRef.current = L.map(mapRef.current, {
      minZoom: 7,
      maxZoom: 18
    }).setView(koreaCenter, 7)
    
    // OpenStreetMap ?Ä???àÏù¥??Ï∂îÍ?
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '¬© OpenStreetMap contributors'
    }).addTo(mapInstanceRef.current)

    // Îß§Î¨º ÎßàÏª§ Ï∂îÍ?
    addPropertyMarkers()
  }

  const addPropertyMarkers = () => {
    if (!mapInstanceRef.current || !properties.length) return

    const L = (window as any).L
    
    // Í∏∞Ï°¥ ÎßàÏª§ ?úÍ±∞
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker)
    })
    markersRef.current = []

    // ??ÎßàÏª§ Ï∂îÍ?
    properties.forEach(property => {
      const marker = L.marker([property.lat, property.lng])
        .addTo(mapInstanceRef.current)
        .bindPopup(createPopupContent(property))
      
      markersRef.current.push(marker)
    })
  }

  const createPopupContent = (property: Property) => {
    return `
      <div class="p-4 max-w-xs">
        <img src="${property.image}" alt="${property.title}" class="w-full h-24 object-cover rounded mb-3">
        <h3 class="font-semibold text-gray-900 mb-2">${property.title}</h3>
        <p class="text-lg font-bold text-blue-600 mb-2">${property.price}</p>
        <p class="text-sm text-gray-600 mb-2">${property.address}</p>
        <div class="flex justify-between text-sm text-gray-500">
          <span>${property.bedrooms}Í∞?Î∞?/span>
          <span>${property.area}</span>
        </div>
        <button 
          onclick="window.selectProperty('${property.id}')"
          class="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          ?ÅÏÑ∏Î≥¥Í∏∞
        </button>
      </div>
    `
  }

  // ?†ÌÉù??Îß§Î¨ºÎ°?ÏßÄ???¥Îèô
  useEffect(() => {
    if (selectedProperty && mapInstanceRef.current) {
      mapInstanceRef.current.setView([selectedProperty.lat, selectedProperty.lng], 15)
      
      // ?†ÌÉù??Îß§Î¨º??ÎßàÏª§Î•?Í∞ïÏ°∞
      markersRef.current.forEach(marker => {
        const popup = marker.getPopup()
        if (popup.getContent().includes(selectedProperty.id)) {
          marker.openPopup()
        }
      })
    }
  }, [selectedProperty])

  // Îß§Î¨º Î™©Î°ù??Î≥ÄÍ≤ΩÎêòÎ©?ÎßàÏª§ ?ÖÎç∞?¥Ìä∏
  useEffect(() => {
    if (mapInstanceRef.current) {
      addPropertyMarkers()
    }
  }, [properties])

  // ?ÑÏó≠ ?®ÏàòÎ°?Îß§Î¨º ?†ÌÉù Í∞Ä?•ÌïòÍ≤??§Ï†ï
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
