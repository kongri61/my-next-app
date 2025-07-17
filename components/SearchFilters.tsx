'use client'

import React from 'react'

interface SearchFiltersProps {
  filters: {
    priceRange: [number, number]
    propertyType: string
    location: string
    bedrooms: string
  }
  onFilterChange: (filters: any) => void
}

export default function SearchFilters({ filters, onFilterChange }: SearchFiltersProps) {
  const propertyTypes = [
    { value: 'all', label: '전체' },
    { value: '아파트', label: '아파트' },
    { value: '오피스텔', label: '오피스텔' },
    { value: '빌라', label: '빌라' },
    { value: '원룸', label: '원룸' },
    { value: '투룸', label: '투룸' },
    { value: '단독주택', label: '단독주택' }
  ]

  const bedroomOptions = [
    { value: 'all', label: '전체' },
    { value: '1', label: '1개' },
    { value: '2', label: '2개' },
    { value: '3', label: '3개' },
    { value: '4', label: '4개 이상' }
  ]

  const formatPrice = (price: number) => {
    if (price >= 10000) {
      return `${Math.floor(price / 10000)}억`
    }
    return `${price}만원`
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">검색 필터</h3>
      
      <div className="space-y-4">
        {/* 지역 검색 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            지역
          </label>
          <input
            type="text"
            placeholder="지역명을 입력하세요"
            value={filters.location}
            onChange={(e) => onFilterChange({ location: e.target.value })}
            className="input-field"
          />
        </div>

        {/* 매물 타입 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            매물 타입
          </label>
          <select
            value={filters.propertyType}
            onChange={(e) => onFilterChange({ propertyType: e.target.value })}
            className="input-field"
          >
            {propertyTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* 방 개수 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            방 개수
          </label>
          <select
            value={filters.bedrooms}
            onChange={(e) => onFilterChange({ bedrooms: e.target.value })}
            className="input-field"
          >
            {bedroomOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 가격 범위 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            가격 범위
          </label>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatPrice(filters.priceRange[0])}</span>
              <span>{formatPrice(filters.priceRange[1])}</span>
            </div>
            <div className="flex space-x-2">
              <input
                type="range"
                min="0"
                max="1000000"
                step="10000"
                value={filters.priceRange[0]}
                onChange={(e) => onFilterChange({ 
                  priceRange: [parseInt(e.target.value), filters.priceRange[1]] 
                })}
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="1000000"
                step="10000"
                value={filters.priceRange[1]}
                onChange={(e) => onFilterChange({ 
                  priceRange: [filters.priceRange[0], parseInt(e.target.value)] 
                })}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* 필터 초기화 */}
        <button
          onClick={() => onFilterChange({
            priceRange: [0, 1000000],
            propertyType: 'all',
            location: '',
            bedrooms: 'all'
          })}
          className="w-full btn-secondary"
        >
          필터 초기화
        </button>
      </div>
    </div>
  )
} 