'use client';

import { useState, useRef, useLayoutEffect, useMemo, useEffect } from 'react';
import Header, { FilterOptions } from '../components/Header';
import GoogleMap from '../components/GoogleMap';
import PropertyList from '../components/PropertyList';
import PropertyDetail from '../components/PropertyDetail';
import AddressInput from '../components/AddressInput';
import BulkUpload from '../components/BulkUpload';

// 샘플 매물 데이터
const sampleProperties = [
  {
    id: '1',
    title: '강남구 역삼동 신축 아파트',
    price: '8억 5,000만원',
    location: '서울 강남구 역삼동',
    type: '아파트',
    bedrooms: 3,
    area: '84.5㎡',
    image: 'https://via.placeholder.com/64x64/4F46E5/FFFFFF?text=A',
    description: '강남구 역삼동에 위치한 신축 아파트입니다. 역세권에 위치하여 교통이 매우 편리하며, 깨끗하고 현대적인 시설을 갖추고 있습니다.',
    features: ['신축', '역세권', '주차가능', '엘리베이터', '개별난방'],
    address: '서울 강남구 역삼동 123-45',
    floor: '8층/15층',
    parking: '가능',
    heating: '개별난방',
    moveInDate: '즉시입주',
    lat: 37.4979, lng: 127.0276, // 역삼동
    dealType: '매매',
    propertyType: '상가'
  },
  {
    id: '2',
    title: '서초구 서초동 오피스텔',
    price: '3억 2,000만원',
    location: '서울 서초구 서초동',
    type: '오피스텔',
    bedrooms: 2,
    area: '59.2㎡',
    image: 'https://via.placeholder.com/64x64/10B981/FFFFFF?text=O',
    description: '서초구 서초동의 프리미엄 오피스텔입니다. 업무와 주거가 모두 가능한 복합용도 건물로, 최신 시설을 갖추고 있습니다.',
    features: ['프리미엄', '복합용도', '주차가능', '24시간 보안'],
    address: '서울 서초구 서초동 456-78',
    floor: '12층/25층',
    parking: '가능',
    heating: '중앙난방',
    moveInDate: '즉시입주',
    lat: 37.4919, lng: 127.0077, // 서초동
    dealType: '월세',
    propertyType: '사무실'
  },
  {
    id: '3',
    title: '마포구 합정동 단독주택',
    price: '12억 8,000만원',
    location: '서울 마포구 합정동',
    type: '단독주택',
    bedrooms: 4,
    area: '120.3㎡',
    image: 'https://via.placeholder.com/64x64/F59E0B/FFFFFF?text=H',
    description: '마포구 합정동의 프리미엄 단독주택입니다. 넓은 마당과 정원을 갖추고 있으며, 프라이버시가 보장되는 최고급 주거공간입니다.',
    features: ['프리미엄', '단독주택', '정원', '주차가능', '독립적'],
    address: '서울 마포구 합정동 789-12',
    floor: '2층/2층',
    parking: '가능',
    heating: '개별난방',
    moveInDate: '즉시입주',
    lat: 37.5495, lng: 126.9137, // 합정동
    dealType: '매매',
    propertyType: '건물매매'
  },
  {
    id: '4',
    title: '용산구 이태원동 빌라',
    price: '5억 5,000만원',
    location: '서울 용산구 이태원동',
    type: '빌라',
    bedrooms: 3,
    area: '76.8㎡',
    image: 'https://via.placeholder.com/64x64/EF4444/FFFFFF?text=V',
    description: '용산구 이태원동의 신축 빌라입니다. 외국인들이 많이 거주하는 지역으로 국제적인 분위기를 느낄 수 있습니다.',
    features: ['신축', '국제적', '주차가능', '엘리베이터'],
    address: '서울 용산구 이태원동 321-54',
    floor: '3층/5층',
    parking: '가능',
    heating: '개별난방',
    moveInDate: '즉시입주',
    lat: 37.5345, lng: 126.9946, // 이태원동
    dealType: '월세',
    propertyType: '상가'
  },
  {
    id: '5',
    title: '송파구 문정동 아파트',
    price: '6억 9,000만원',
    location: '서울 송파구 문정동',
    type: '아파트',
    bedrooms: 3,
    area: '89.1㎡',
    image: 'https://via.placeholder.com/64x64/8B5CF6/FFFFFF?text=A',
    description: '송파구 문정동의 아파트입니다. 조용하고 안전한 주거환경을 제공하며, 교육환경도 우수합니다.',
    features: ['조용한', '안전한', '교육환경', '주차가능'],
    address: '서울 송파구 문정동 654-32',
    floor: '5층/12층',
    parking: '가능',
    heating: '중앙난방',
    moveInDate: '즉시입주',
    lat: 37.4842, lng: 127.1227, // 문정동
    dealType: '매매',
    propertyType: '사무실'
  }
];

export default function HomePage() {
  // 관리자 여부 (실제 서비스에서는 로그인/권한 연동)
  const isAdmin = true; // false로 바꾸면 일반 사용자 모드
  const [filters, setFilters] = useState<FilterOptions>({
    dealType: '전체',
    area: '전체',
    price: '전체',
    propertyType: '전체',
    keyword: '',
  });
  const [isPropertyListVisible, setIsPropertyListVisible] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isPropertyDetailVisible, setIsPropertyDetailVisible] = useState(false);
  const [highlightedPropertyId, setHighlightedPropertyId] = useState<string | undefined>(undefined);
  const [geocodedProperties, setGeocodedProperties] = useState<any[]>([]);
  const [bulkUploadedProperties, setBulkUploadedProperties] = useState<any[]>([]);
  const [isBulkUploadVisible, setIsBulkUploadVisible] = useState(false);
  const [propertyImages, setPropertyImages] = useState<{ [id: string]: string }>({});
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(88);
  const [mapFilteredProperties, setMapFilteredProperties] = useState<any[] | undefined>(undefined);

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
  }, [geocodedProperties, bulkUploadedProperties, propertyImages]);

  const filteredProperties = useMemo(() => {
    return allProperties.filter(property => {
      // 키워드 검색
      if (filters.keyword && !property.title.toLowerCase().includes(filters.keyword.toLowerCase()) && 
          !property.location.toLowerCase().includes(filters.keyword.toLowerCase())) {
        return false;
      }
      
      // 거래유형 필터
      if (filters.dealType !== '전체' && property.dealType !== filters.dealType) {
        return false;
      }
      
      // 매물종류 필터
      if (filters.propertyType !== '전체' && property.propertyType !== filters.propertyType) {
        return false;
      }
      
      // 면적 필터 (간단한 구현)
      if (filters.area !== '전체') {
        const areaNum = parseFloat(property.area.replace('㎡', ''));
        if (filters.area === '~10평' && areaNum > 33) return false;
        if (filters.area === '10평대' && (areaNum < 33 || areaNum > 66)) return false;
        if (filters.area === '20평대' && (areaNum < 66 || areaNum > 99)) return false;
        if (filters.area === '30평대' && (areaNum < 99 || areaNum > 132)) return false;
        if (filters.area === '40평대' && (areaNum < 132 || areaNum > 165)) return false;
        if (filters.area === '50평대' && (areaNum < 165 || areaNum > 198)) return false;
        if (filters.area === '60평대' && (areaNum < 198 || areaNum > 231)) return false;
        if (filters.area === '70평~' && areaNum < 231) return false;
      }
      
      // 가격 필터 (간단한 구현)
      if (filters.price !== '전체') {
        const priceNum = parseFloat(property.price.replace(/[억\s,]/g, ''));
        if (filters.price === '~1억' && priceNum > 1) return false;
        if (filters.price === '2억' && (priceNum < 1 || priceNum > 3)) return false;
        if (filters.price === '3억' && (priceNum < 2 || priceNum > 4)) return false;
        if (filters.price === '4억' && (priceNum < 3 || priceNum > 5)) return false;
        if (filters.price === '5억' && (priceNum < 4 || priceNum > 6)) return false;
        if (filters.price === '6억' && (priceNum < 5 || priceNum > 7)) return false;
        if (filters.price === '7억' && (priceNum < 6 || priceNum > 8)) return false;
        if (filters.price === '8억' && (priceNum < 7 || priceNum > 9)) return false;
        if (filters.price === '9억' && (priceNum < 8 || priceNum > 10)) return false;
        if (filters.price === '10억' && (priceNum < 9 || priceNum > 11)) return false;
        if (filters.price === '15억' && (priceNum < 10 || priceNum > 20)) return false;
        if (filters.price === '20억' && (priceNum < 15 || priceNum > 25)) return false;
        if (filters.price === '30억' && (priceNum < 25 || priceNum > 35)) return false;
        if (filters.price === '40억' && (priceNum < 35 || priceNum > 45)) return false;
        if (filters.price === '50억' && (priceNum < 45 || priceNum > 55)) return false;
        if (filters.price === '100억' && (priceNum < 50 || priceNum > 150)) return false;
        if (filters.price === '200억' && (priceNum < 150 || priceNum > 250)) return false;
        if (filters.price === '300억' && (priceNum < 250 || priceNum > 350)) return false;
        if (filters.price === '400억' && (priceNum < 350 || priceNum > 450)) return false;
        if (filters.price === '500억~' && priceNum < 450) return false;
      }
      
      return true;
    });
  }, [allProperties, filters]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setHighlightedPropertyId(undefined);
    setMapFilteredProperties(undefined); // 필터 변경 시 전체 목록 복원
    console.log('필터 변경:', newFilters);
  };

  const handlePropertyClick = (property: any) => {
    setSelectedProperty(property);
    setIsPropertyDetailVisible(true);
    setHighlightedPropertyId(property.id);
    console.log('매물 선택:', property);
  };

  const handleMarkerClick = (property: any) => {
    setHighlightedPropertyId(property.id);
    // 매물 목록이 숨겨져 있다면 보이게 함
    if (!isPropertyListVisible) {
      setIsPropertyListVisible(true);
    }
    console.log('마커 클릭:', property);
  };

  const handleGeocodeResult = (address: string, lat: number, lng: number) => {
    // geocoding 결과로 새로운 매물 추가
  const newProperty = {
    id: `geocoded-${Date.now()}`,
    title: `${address} 매물`,
      price: '가격 미정',
      location: address,
      type: '기타',
      bedrooms: 0,
      area: '면적 미정',
      image: 'https://via.placeholder.com/64x64/6B7280/FFFFFF?text=?',
      description: `${address}에 위치한 매물입니다.`,
    
      features: ['주소 검색'],
      address: address,
      floor: '층수 미정',
      parking: '미정',
      heating: '미정',
      moveInDate: '미정',
      lat: lat,
      lng: lng,
      dealType: '매매',
      propertyType: '기타'
    };

    setGeocodedProperties(prev => [...prev, newProperty]);
    console.log('새 매물 추가:', newProperty);
  };

  const handleBulkUploadClick = () => {
    setIsBulkUploadVisible(true);
  };

  const handleBulkUploadClose = () => {
    setIsBulkUploadVisible(false);
  };

  const handleBulkUploadedProperties = (properties: any[]) => {
    // 기본 정보 추가
    const enrichedProperties = properties.map(property => ({
      ...property,
      image: property.image || 'https://via.placeholder.com/64x64/6B7280/FFFFFF?text=B',
      description: property.description || '${property.title} 매물입니다.',
      features: property.features || ['대량 업로드'],
      floor: property.floor || '층수 미정',
      parking: property.parking || '미정',
      heating: property.heating || '미정',
      moveInDate: property.moveInDate || '미정'
    }));

    setBulkUploadedProperties(prev => [...prev, ...enrichedProperties]);
    console.log('대량 업로드 매물 추가:', enrichedProperties);
  };

  const togglePropertyList = () => {
    setIsPropertyListVisible(!isPropertyListVisible);
  };

  const closePropertyDetail = () => {
    setIsPropertyDetailVisible(false);
    setSelectedProperty(null);
  };

  // 대표 이미지 변경 핸들러
  const handlePropertyImageChange = (propertyId: string, imageUrl: string) => {
    setPropertyImages(prev => ({ ...prev, [propertyId]: imageUrl }));
    // selectedProperty도 즉시 반영
    if (selectedProperty && selectedProperty.id === propertyId) {
      setSelectedProperty({ ...selectedProperty, image: imageUrl });
    }
    // geocodedProperties, bulkUploadedProperties 등에도 반영하려면 추가 구현 가능
  };

  // 마커/클러스터 클릭 시 해당 위치 매물만 목록에 표시
  const handleMapMarkerClick = (properties: any[]) => {
    setMapFilteredProperties(properties);
    if (!isPropertyListVisible) setIsPropertyListVisible(true);
    if (properties.length === 1) setHighlightedPropertyId(properties[0].id);
    else setHighlightedPropertyId(undefined);
  };
  const handleMapClusterClick = (properties: any[]) => {
    setMapFilteredProperties(properties);
    if (!isPropertyListVisible) setIsPropertyListVisible(true);
    setHighlightedPropertyId(undefined);
  };

  return (
    <>
      {/* 헤더 */}
      <Header 
        ref={headerRef}
        onFilterChange={handleFilterChange} 
        onBulkUploadClick={handleBulkUploadClick}
        isAdmin={isAdmin}
      />
      {/* 지도/메인 콘텐츠만 헤더 높이만큼 padding-top */}
      <div style={{ paddingTop: headerHeight }}>
        {/* 지도 - 전체 화면 */}
        <GoogleMap 
          properties={filteredProperties}
          onMarkerClick={handleMapMarkerClick}
          onClusterClick={handleMapClusterClick}
          highlightedPropertyId={highlightedPropertyId}
          onGeocodeResult={handleGeocodeResult}
        />
        {/* 주소 입력 컴포넌트 (관리자만 노출) */}
        {isAdmin && <AddressInput onGeocodeResult={handleGeocodeResult} topOffset={headerHeight} />}
        {/* 매물 목록 */}
        <PropertyList
          properties={mapFilteredProperties ?? filteredProperties}
          isVisible={isPropertyListVisible}
          onToggle={togglePropertyList}
          onPropertyClick={handlePropertyClick}
          topOffset={headerHeight}
          highlightedPropertyId={highlightedPropertyId}
        />
        {/* 매물 세부정보 */}
        <PropertyDetail
          property={selectedProperty}
          isVisible={isPropertyDetailVisible}
          onClose={closePropertyDetail}
          onImageChange={handlePropertyImageChange}
        />
        {/* 대량 업로드 모달 (관리자만 노출) */}
        {isAdmin && isBulkUploadVisible && (
          <BulkUpload
            onPropertiesUploaded={handleBulkUploadedProperties}
            onClose={handleBulkUploadClose}
          />
        )}
      </div>
    </>
  );
}