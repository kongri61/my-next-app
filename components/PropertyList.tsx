'use client';
import { useState, useEffect, useRef } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, MapPinIcon, CurrencyDollarIcon, HomeIcon } from '@heroicons/react/24/outline';
import { Property } from '../types/property';

interface PropertyListProps {
  properties: Property[];
  isVisible: boolean;
  onToggle: () => void;
  onPropertyClick: (property: Property) => void;
  topOffset?: number;
  highlightedPropertyId?: string;
}

export default function PropertyList({ 
  properties, 
  isVisible, 
  onToggle, 
  onPropertyClick, 
  topOffset = 88,
  highlightedPropertyId 
}: PropertyListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const highlightedRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 페이지네이션: properties가 바뀌면 1페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [properties]);

  // 강조된 매물이 변경되면 해당 요소로 스크롤
  useEffect(() => {
    if (highlightedPropertyId && highlightedRef.current && isVisible) {
      highlightedRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [highlightedPropertyId, isVisible]);

  // 키보드 접근성 개선
  const handleKeyDown = (e: React.KeyboardEvent, property: Property) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onPropertyClick(property);
    }
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(properties.length / itemsPerPage);
  const pagedProperties = properties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      {/* 토글 버튼 */}
      <button
        onClick={onToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-1/2 right-0 z-50 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-l-lg shadow-lg hover:bg-blue-700 transition-all duration-300 ${
          isVisible ? 'right-80' : 'right-0'
        } ${isHovered ? 'scale-110' : 'scale-100'}`}
        style={{ top: `calc(${topOffset}px + 50%)` }}
        aria-label={isVisible ? '매물 목록 숨기기' : '매물 목록 보기'}
      >
        {isVisible ? (
          <ChevronRightIcon className="h-5 w-5" />
        ) : (
          <ChevronLeftIcon className="h-5 w-5" />
        )}
      </button>

      {/* 매물 목록 패널 */}
      <div
        className={`fixed right-0 w-80 bg-white shadow-lg transform transition-all duration-500 ease-in-out z-40 ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: topOffset, height: `calc(100vh - ${topOffset}px)`, zIndex: 40 }}
      >
        <div className="h-full flex flex-col">
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-tr-lg">
            <h2 className="text-lg font-semibold flex items-center">
              <HomeIcon className="h-5 w-5 mr-2" />
              매물 목록
            </h2>
            <p className="text-sm opacity-90 mt-1">{properties.length}개의 매물</p>
          </div>

          {/* 목록 */}
          <div ref={listRef} className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {properties.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <HomeIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">매물이 없습니다</p>
                <p className="text-sm">필터 조건을 변경해보세요</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pagedProperties.map((property, index) => (
                  <div
                    key={property.id}
                    ref={property.id === highlightedPropertyId ? highlightedRef : null}
                    onClick={() => onPropertyClick(property)}
                    onKeyDown={(e) => handleKeyDown(e, property)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${property.title} 매물 선택`}
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      property.id === highlightedPropertyId
                        ? 'border-blue-500 bg-blue-50 shadow-lg scale-105 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {property.image && (
                        <div className="relative">
                          <img
                            src={property.image}
                            alt={property.title}
                            className="w-16 h-16 object-cover rounded-lg shadow-sm"
                          />
                          {property.id === highlightedPropertyId && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold mb-1 truncate ${
                          property.id === highlightedPropertyId ? 'text-blue-700' : 'text-gray-900'
                        }`}>
                          {property.title}
                        </h3>
                        <div className="flex items-center mb-1">
                          <CurrencyDollarIcon className="h-4 w-4 text-green-600 mr-1" />
                          <p className="text-lg font-bold text-green-600">
                            {property.price}
                          </p>
                        </div>
                        <div className="flex items-center mb-2">
                          <MapPinIcon className="h-4 w-4 text-gray-500 mr-1" />
                          <p className="text-sm text-gray-600 truncate">
                            {property.location}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {property.type}
                          </span>
                          <span>{property.bedrooms}개 방</span>
                          <span>{property.area}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-3 border-t">
              <button
                className="px-2 text-gray-500 hover:text-blue-600 disabled:text-gray-300"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >&lt;PREV&gt;</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`w-7 h-7 rounded-full text-sm font-semibold mx-0.5 ${
                    page === currentPage
                      ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-100'
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="px-2 text-gray-500 hover:text-blue-600 disabled:text-gray-300"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >&lt;NEXT&gt;</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 