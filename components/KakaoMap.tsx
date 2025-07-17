'use client';
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { Property } from '../types/property';

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  onPropertySelect: (property: Property) => void;
}

export default function KakaoMap({ properties, selectedProperty, onPropertySelect }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded && window.kakao && window.kakao.maps) {
      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),
        level: 3,
      });
    }
  }, [loaded]);

  return (
    <>
      <Head>
        <script
          src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=095b9671e7714ea16afa9e2acdd70012"
          onLoad={() => {
            console.log('Kakao SDK Loaded');
            setLoaded(true);
          }}
        />
      </Head>
      <div>
        <h2>지도 영역</h2>
        <div
          ref={mapRef}
          style={{
            width: '100%',
            height: '400px',
            border: '2px solid red',
            marginTop: '20px',
          }}
        />
      </div>
    </>
  );
}

