'use client';

import { useState, useRef, useLayoutEffect, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import type { FilterOptions } from '../components/Header';
import GoogleMap from '../components/GoogleMap';
import PropertyList from '../components/PropertyList';
import PropertyDetail from '../components/PropertyDetail';
import AddressInput from '../components/AddressInput';
import BulkUpload from '../components/BulkUpload';
import { getAllProperties, Property } from '../lib/propertyData';

export default function HomePage() {
  // 관리자 여부 (실제 서비스에서는 로그인/권한 연동)
  const isAdmin = true; // false로 바꾸면 일반 사용자 모드
  const [filters, setFilters] = useState<FilterOptions>({
    dealType: '전체',
    area: '전체',
    price: '전체',
    propertyType: '전체',
    keyword: '',
    areaRange: [0, 70],
    priceRange: [0, 500],
    deposit: '전체',
    depositRange: [0, 4000],
  });
  const [isPropertyListVisible, setIsPropertyListVisible] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isPropertyDetailVisible, setIsPropertyDetailVisible] = useState(false);
  const [highlightedPropertyId, setHighlightedPropertyId] = useState<string | undefined>(undefined);
  const [geocodedProperties, setGeocodedProperties] = useState<Property[]>([]);
  const [bulkUploadedProperties, setBulkUploadedProperties] = useState<Property[]>([]);
  const [isBulkUploadVisible, setIsBulkUploadVisible] = useState(false);
  const [propertyImages, setPropertyImages] = useState<{ [id: string]: string }>({});
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(88);
  const [mapFilteredProperties, setMapFilteredProperties] = useState<Property[] | undefined>(undefined);

  // 실제 데이터 가져오기
  const sampleProperties = getAllProperties();

  useEffect(() => {
    function updateHeaderHeight() {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    }
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    // ResizeObserver로 헤더 높이 실시간 감지
    let observer: ResizeObserver | null = null;
    if (headerRef.current && 'ResizeObserver' in window) {
      observer = new window.ResizeObserver(() => {
        updateHeaderHeight();
      });
      observer.observe(headerRef.current);
    }
    // 폰트/이미지 로딩 등으로 높이 변할 수 있으니 100ms 후 한 번 더
    const timeout = setTimeout(updateHeaderHeight, 100);
    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      if (observer) observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  // 필터링된 매물 목록 계산 (기존 매물 + geocoding + bulk upload)
  const allProperties = useMemo(() => {
    const merged = [...sampleProperties, ...geocodedProperties, ...bulkUploadedProperties].map(p =>
      propertyImages[p.id] ? { ...p, image: propertyImages[p.id] } : p
    );
    return merged;
  }, [sampleProperties, geocodedProperties, bulkUploadedProperties, propertyImages]);

  const filteredProperties = useMemo(() => {
    return allProperties.filter(property => {
      // 키워드 검색
      if (filters.keyword && !property.title.toLowerCase().includes(filters.keyword.toLowerCase()) && 
          !property.address.toLowerCase().includes(filters.keyword.toLowerCase())) {
        return false;
      }
      
      // 거래유형 필터
      if (filters.dealType !== '전체' && property.priceType !== filters.dealType) {
        return false;
      }
      
      // 매물종류 필터
      if (filters.propertyType !== '전체') {
        const propertyType = property.features?.find(f => ['아파트', '오피스텔', '원룸', '빌라', '상가', '사무실'].includes(f));
        if (propertyType !== filters.propertyType) {
          return false;
        }
      }
      
      // 면적 필터 (범위 기반)
      if (filters.area !== '전체') {
        const areaNum = typeof property.area === 'number' ? property.area : parseFloat(String(property.area).replace('㎡', ''));
        
        // 범위 형식 (예: "20㎡~30㎡") 처리
        if (filters.area.includes('~')) {
          const [minStr, maxStr] = filters.area.split('~');
          const minArea = parseFloat(minStr.replace(/[㎡평]/g, ''));
          const maxArea = parseFloat(maxStr.replace(/[㎡평]/g, ''));
          if (areaNum < minArea || areaNum > maxArea) {
            return false;
          }
        } else {
          // 단일 값 처리
          const filterArea = parseFloat(filters.area.replace(/[㎡평]/g, ''));
          if (Math.abs(areaNum - filterArea) > 5) { // 5㎡ 오차 허용
            return false;
          }
        }
      }
      
      // 가격 필터 (범위 기반)
      if (filters.price !== '전체') {
        const priceNum = typeof property.price === 'number' ? property.price : parseFloat(String(property.price).replace(/[억만원,]/g, ''));
        
        if (filters.price.includes('~')) {
          const [minStr, maxStr] = filters.price.split('~');
          const minPrice = parseFloat(minStr.replace(/[억만원,]/g, ''));
          const maxPrice = parseFloat(maxStr.replace(/[억만원,]/g, ''));
          if (priceNum < minPrice || priceNum > maxPrice) {
            return false;
          }
        } else {
          const filterPrice = parseFloat(filters.price.replace(/[억만원,]/g, ''));
          if (Math.abs(priceNum - filterPrice) > 1000) { // 1000만원 오차 허용
            return false;
          }
        }
      }
      
      // 보증금 필터
      if (filters.deposit !== '전체') {
        // 보증금 정보가 없는 경우 필터링하지 않음
        if (property.deposit) {
          const depositNum = parseFloat(property.deposit.replace(/[억만원,]/g, ''));
          if (filters.deposit.includes('~')) {
            const [minStr, maxStr] = filters.deposit.split('~');
            const minDeposit = parseFloat(minStr.replace(/[억만원,]/g, ''));
            const maxDeposit = parseFloat(maxStr.replace(/[억만원,]/g, ''));
            if (depositNum < minDeposit || depositNum > maxDeposit) {
              return false;
            }
          } else {
            const filterDeposit = parseFloat(filters.deposit.replace(/[억만원,]/g, ''));
            if (Math.abs(depositNum - filterDeposit) > 1000) {
              return false;
            }
          }
        }
      }
      
      return true;
    });
  }, [allProperties, filters]);

  // 필터 변경 핸들러
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  // 필터 초기화 핸들러
  const handleFilterReset = () => {
    setMapFilteredProperties(undefined);
    setHighlightedPropertyId(undefined);
    setFilters({
      dealType: '전체',
      area: '전체',
      price: '전체',
      propertyType: '전체',
      keyword: '',
      areaRange: [0, 70],
      priceRange: [0, 500],
      deposit: '전체',
      depositRange: [0, 4000],
    });
  };

  // 주소 검색 결과 핸들러
  const handleGeocodeResult = (address: string, lat: number, lng: number) => {
    const newProperty: Property = {
      id: `geocoded-${Date.now()}`,
      title: `${address} 매물`,
      price: 500000000, // 기본값
      priceType: '매매',
      area: 84.5,
      rooms: 3,
      bathrooms: 2,
      floor: 1,
      totalFloors: 5,
      address: address,
      description: `${address}에 위치한 매물입니다.`,
      features: ['역세권', '주차가능'],
      images: [],
      location: { lat, lng },
      contact: {
        phone: '02-1234-5678',
        agent: '중개업소',
        email: 'agent@example.com'
      },
      available: true,
      createdAt: new Date().toISOString()
    };
    
    setGeocodedProperties(prev => [...prev, newProperty]);
  };

  // 벌크 업로드 클릭 핸들러
  const handleBulkUploadClick = () => {
    setIsBulkUploadVisible(true);
  };

  // 벌크 업로드 닫기 핸들러
  const handleBulkUploadClose = () => {
    setIsBulkUploadVisible(false);
  };

  // 벌크 업로드된 매물 처리 핸들러
  const handleBulkUploadedProperties = (properties: Property[]) => {
    // 기본 정보 추가
    const enrichedProperties = properties.map(property => ({
      ...property,
      priceType: property.priceType || '매매',
      rooms: property.rooms || 1,
      bathrooms: property.bathrooms || 1,
      floor: property.floor || 1,
      totalFloors: property.totalFloors || 1,
      features: property.features || ['기타'],
      images: property.images || [],
      location: property.location || { lat: 37.5665, lng: 126.9780 },
      contact: property.contact || {
        phone: '02-1234-5678',
        agent: '중개업소',
        email: 'agent@example.com'
      },
      available: true,
      createdAt: new Date().toISOString()
    }));
    
    setBulkUploadedProperties(prev => [...prev, ...enrichedProperties]);
    setIsBulkUploadVisible(false);
  };

  // 매물 목록 토글
  const togglePropertyList = () => {
    setIsPropertyListVisible(!isPropertyListVisible);
  };

  // 매물 상세 닫기
  const closePropertyDetail = () => {
    setIsPropertyDetailVisible(false);
    setSelectedProperty(null);
  };

  // 매물 이미지 변경 핸들러
  const handlePropertyImageChange = (propertyId: string, imageUrl: string) => {
    setPropertyImages(prev => ({
      ...prev,
      [propertyId]: imageUrl
    }));
  };

  // 마커/클러스터 클릭 시 해당 위치 매물만 목록에 표시 (상세페이지 열지 않음)
  const handleMapMarkerClick = (properties: Property[]) => {
    console.log('마커 클릭된 매물들:', properties);
    // 필터링된 매물이 있으면 그것을 사용하고, 없으면 전체 매물을 사용
    if (properties.length > 0) {
      setMapFilteredProperties(properties);
      if (!isPropertyListVisible) setIsPropertyListVisible(true);
      if (properties.length === 1) {
        setHighlightedPropertyId(properties[0].id);
        // 단일 매물이어도 상세페이지는 열지 않음
        setSelectedProperty(null);
        setIsPropertyDetailVisible(false);
      } else {
        setHighlightedPropertyId(undefined);
        setSelectedProperty(null);
        setIsPropertyDetailVisible(false);
      }
    } else {
      // 매물이 없으면 필터링을 해제
      setMapFilteredProperties(undefined);
      setHighlightedPropertyId(undefined);
      setSelectedProperty(null);
      setIsPropertyDetailVisible(false);
    }
  };
  
  const handleMapClusterClick = (properties: Property[]) => {
    console.log('클러스터 클릭된 매물들:', properties);
    if (properties.length > 0) {
      setMapFilteredProperties(properties);
      if (!isPropertyListVisible) setIsPropertyListVisible(true);
      setHighlightedPropertyId(undefined);
      setSelectedProperty(null);
      setIsPropertyDetailVisible(false);
    } else {
      setMapFilteredProperties(undefined);
      setHighlightedPropertyId(undefined);
      setSelectedProperty(null);
      setIsPropertyDetailVisible(false);
    }
  };

  // 매물 목록에서 매물 클릭 시 상세페이지 열기
  const handlePropertyClick = (property: Property) => {
    console.log('매물 목록에서 클릭:', property);
    setSelectedProperty(property);
    setIsPropertyDetailVisible(true);
    setHighlightedPropertyId(property.id);
  };

  // 표시할 매물 목록 결정 (지도 필터링된 매물이 있으면 그것을, 없으면 필터링된 매물을)
  const displayProperties = mapFilteredProperties || filteredProperties;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <Header
        ref={headerRef}
        onFilterChange={handleFilterChange}
        onFilterReset={handleFilterReset}
        onBulkUploadClick={handleBulkUploadClick}
        isAdmin={isAdmin}
      />

      {/* 메인 컨텐츠 */}
      <div className="relative">
        {/* 지도 */}
        <GoogleMap
          properties={displayProperties}
          onMarkerClick={handleMapMarkerClick}
          onClusterClick={handleMapClusterClick}
          highlightedPropertyId={highlightedPropertyId}
        />

        {/* 주소 검색 */}
        <AddressInput
          onGeocodeResult={handleGeocodeResult}
          topOffset={headerHeight}
        />

        {/* 매물 목록 */}
        <PropertyList
          properties={displayProperties}
          isVisible={isPropertyListVisible}
          onToggle={togglePropertyList}
          onPropertyClick={handlePropertyClick}
          topOffset={headerHeight}
          highlightedPropertyId={highlightedPropertyId}
        />

        {/* 매물 상세 */}
        <PropertyDetail
          property={selectedProperty}
          isVisible={isPropertyDetailVisible}
          onClose={closePropertyDetail}
          onImageChange={handlePropertyImageChange}
        />

        {/* 벌크 업로드 */}
        {isBulkUploadVisible && (
          <BulkUpload
            onClose={handleBulkUploadClose}
            onPropertiesUploaded={handleBulkUploadedProperties}
          />
        )}
      </div>
    </div>
  );
}