'use client';
import { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface AddressInputProps {
  onGeocodeResult: (address: string, lat: number, lng: number) => void;
  topOffset?: number;
}

export default function AddressInput({ onGeocodeResult, topOffset = 0 }: AddressInputProps) {
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [recentAddresses, setRecentAddresses] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // 컴포넌트 마운트 시 애니메이션
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // 최근 검색 주소 로드
  useEffect(() => {
    const saved = localStorage.getItem('recentAddresses');
    if (saved) {
      setRecentAddresses(JSON.parse(saved));
    }
  }, []);

  const saveRecentAddress = (newAddress: string) => {
    const updated = [newAddress, ...recentAddresses.filter(addr => addr !== newAddress)].slice(0, 5);
    setRecentAddresses(updated);
    localStorage.setItem('recentAddresses', JSON.stringify(updated));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      // window 객체에서 geocodeAddress 함수 호출
      if (typeof window !== 'undefined' && (window as any).geocodeAddress) {
        const result = await (window as any).geocodeAddress(address);
        if (result) {
          onGeocodeResult(address, result.lat, result.lng);
          saveRecentAddress(address);
          setAddress('');
          console.log('주소 변환 완료:', address, result);
        }
      } else {
        setError('지도가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
      }
    } catch (err) {
      console.error('주소 변환 오류:', err);
      setError('주소를 찾을 수 없습니다. 정확한 주소를 입력해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecentAddressClick = (recentAddress: string) => {
    setAddress(recentAddress);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setAddress('');
      setError('');
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-4 z-30 max-w-xs w-64 transition-all duration-500 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ position: 'fixed', top: topOffset, right: 16 }}
    >
      <div className="flex items-center mb-3">
        <MapPinIcon className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="text-sm font-semibold text-gray-900">주소 검색</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="주소를 입력하세요 (예: 서울 강남구 역삼동)"
            className="w-56 px-3 py-2 pl-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            disabled={isLoading}
            aria-label="주소 입력"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !address.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              검색 중...
            </div>
          ) : (
            '좌표 변환'
          )}
        </button>
        
        {error && (
          <div className="text-red-500 text-xs mt-2 p-2 bg-red-50 rounded-md border border-red-200">
            {error}
          </div>
        )}
      </form>

      {/* 최근 검색 주소 */}
      {recentAddresses.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <h4 className="text-xs font-medium text-gray-700 mb-2">최근 검색</h4>
          <div className="space-y-1">
            {recentAddresses.map((recentAddress, index) => (
              <button
                key={index}
                onClick={() => handleRecentAddressClick(recentAddress)}
                className="w-full text-left text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors duration-200 truncate"
                title={recentAddress}
              >
                {recentAddress}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 leading-relaxed">
          주소를 입력하면 자동으로 좌표를 변환하여 지도에 표시됩니다.
          <br />
          <span className="text-blue-600">ESC</span> 키로 입력을 초기화할 수 있습니다.
        </p>
      </div>
    </div>
  );
} 