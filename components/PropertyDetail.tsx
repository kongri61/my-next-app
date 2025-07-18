'use client';
import { useState, useRef } from 'react';
import { XMarkIcon, PhoneIcon, MapPinIcon, HomeIcon, UserIcon, CameraIcon } from '@heroicons/react/24/outline';

interface Property {
  id: string;
  title: string;
  price?: string;
  deposit?: string;
  monthly?: string;
  maintenance?: string;
  location?: string;
  address?: string;
  type?: string;
  propertyType?: string;
  dealType?: string;
  area?: string;
  areaInfo?: string;
  floor?: string;
  floorInfo?: string;
  direction?: string;
  status?: string;
  buildingType?: string;
  parking?: string;
  elevator?: string;
  heating?: string;
  moveInDate?: string;
  theme?: string;
  approvalDate?: string;
  restroom?: string;
  builtIn?: string;
  features?: string[];
  image?: string;
  images?: string[];
  description?: string;
  agentOffice?: string;
  agentName?: string;
  agentPhone?: string;
  agentMobile?: string;
  agentOfficeAddress?: string;
  agentReg?: string;
}

interface PropertyDetailProps {
  property: Property | null;
  isVisible: boolean;
  onClose: () => void;
  onImageChange?: (propertyId: string, imageUrl: string) => void;
}

export default function PropertyDetail({ property, isVisible, onClose, onImageChange }: PropertyDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [localImage, setLocalImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!property) return null;

  // 대표 이미지 우선순위: localImage > property.image > property.images[0] > placeholder
  const mainImage = localImage || property.image || (property.images && property.images[0]) || 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Main';
  const images = [
    mainImage,
    ...(property.images?.slice(1) || [
      'https://via.placeholder.com/400x300/10B981/FFFFFF?text=Sub1',
      'https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Sub2',
      'https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Sub3',
      'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Sub4'
    ])
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // 대표 이미지 업로드 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setLocalImage(url);
        if (onImageChange) {
          onImageChange(property.id, url);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } transition-opacity duration-300`}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{property.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* 이미지 슬라이더/업로드 */}
            <div className="flex-1 min-w-[320px]">
              <div className="relative h-64 md:h-80 bg-gray-100 rounded-lg overflow-hidden mb-2">
                <img
                  src={images[currentImageIndex]}
                  alt={`${property.title} - 이미지 ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                {currentImageIndex === 0 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-3 right-3 bg-white bg-opacity-80 hover:bg-opacity-100 border border-gray-300 rounded-full p-2 shadow-md transition-all"
                    title="대표 이미지 업로드"
                  >
                    <CameraIcon className="h-6 w-6 text-blue-600" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* 상세 정보 표 & 중개인 정보 */}
            <div className="flex-1 flex flex-col gap-4">
              {/* 상업용/건물 매물 정보 표 */}
              <table className="w-full text-sm border mb-4">
                <tbody>
                  <tr><td className="bg-gray-50 px-2 py-1 font-semibold w-28">주소</td><td className="px-2 py-1">{property.address || property.location || '-'}</td></tr>
                  <tr><td className="bg-gray-50 px-2 py-1 font-semibold">거래유형</td><td className="px-2 py-1">{property.dealType || '-'}</td></tr>
                  <tr><td className="bg-gray-50 px-2 py-1 font-semibold">매물종류</td><td className="px-2 py-1">{property.propertyType || property.type || '-'}</td></tr>
                  <tr><td className="bg-gray-50 px-2 py-1 font-semibold">보증금</td><td className="px-2 py-1">{property.deposit || '-'}</td></tr>
                  <tr><td className="bg-gray-50 px-2 py-1 font-semibold">월세</td><td className="px-2 py-1">{property.monthly || '-'}</td></tr>
                  <tr><td className="bg-gray-50 px-2 py-1 font-semibold">관리비</td><td className="px-2 py-1">{property.maintenance || '-'}</td></tr>
                  <tr><td className="bg-gray-50 px-2 py-1 font-semibold">면적정보</td><td className="px-2 py-1">{property.areaInfo || property.area || '-'}</td></tr>
                  <tr><td className="bg-gray-50 px-2 py-1 font-semibold">층정보</td><td className="px-2 py-1">{property.floorInfo || property.floor || '-'}</td></tr>
                  <tr><td className="bg-gray-50 px-2 py-1 font-semibold">방향</td><td className="px-2 py-1">{property.direction || '-'}</td></tr>
                  <tr><td className="bg-gray-50 px-2 py-1 font-semibold">매물상태</td><td className="px-2 py-1">{property.status || '-'}</td></tr>
                  <tr><td className="bg-gray-50 px-2 py-1 font-semibold">건물형태</td><td className="px-2 py-1">{property.buildingType || '-'}</td></tr>
                  <tr><td className="bg-gray-50 px-2 py-1 font-semibold">주차</td><td className="px-2 py-1">{property.parking || '-'}</td></tr>
                  <tr><td className="bg-gray-50 px-2 py-1 font-semibold">엘리베이터</td><td className="px-2 py-1">{property.elevator || '-'}</td></tr>
                  <tr><td className="bg-gray-50 px-2 py-1 font-semibold">난방</td><td className="px-2 py-1">{property.heating || '-'}</td></tr>
                  <tr><td className="bg-gray-50 px-2 py-1 font-semibold">입주가능일</td><td className="px-2 py-1">{property.moveInDate || '-'}</td></tr>
                  <tr><td className="bg-gray-50 px-2 py-1 font-semibold">테마</td><td className="px-2 py-1">{property.theme || '-'}</td></tr>
                  <tr><td className="bg-gray-50 px-2 py-1 font-semibold">사용승인일</td><td className="px-2 py-1">{property.approvalDate || '-'}</td></tr>
                  <tr><td className="bg-gray-50 px-2 py-1 font-semibold">화장실</td><td className="px-2 py-1">{property.restroom || '-'}</td></tr>
                  <tr><td className="bg-gray-50 px-2 py-1 font-semibold">빌트인</td><td className="px-2 py-1">{property.builtIn || '-'}</td></tr>
                </tbody>
              </table>
              {/* 중개사 정보 카드 */}
              <div className="border rounded-lg p-3 bg-gray-50">
                <div className="font-bold text-gray-700 mb-1">{property.agentOffice || '중개업소명'}</div>
                <div className="text-sm text-gray-600">{property.agentName || '담당자명'}</div>
                <div className="text-sm text-gray-600">{property.agentPhone || ''}{property.agentMobile ? ` / ${property.agentMobile}` : ''}</div>
                <div className="text-xs text-gray-400 mt-1">{property.agentOfficeAddress || ''}</div>
                <div className="text-xs text-gray-400">{property.agentReg || ''}</div>
              </div>
            </div>
          </div>
          {/* 매물 설명/특징 */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-bold text-lg mb-2">매물 설명</div>
              <p className="text-gray-700 leading-relaxed">{property.description || '-'}</p>
              <div className="font-bold text-lg mt-4 mb-2">매물 특징</div>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {property.features && property.features.length > 0 ? property.features.map((f, i) => <li key={i}>{f}</li>) : <li>-</li>}
              </ul>
            </div>
            {/* 지도/기타 영역 자리 */}
            <div>
              <div className="font-bold text-lg mb-2">위치 안내</div>
              <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center text-gray-500">지도 영역</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 