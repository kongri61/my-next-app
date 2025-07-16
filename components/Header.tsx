'use client';
import { useState, forwardRef } from 'react';
import Image from 'next/image';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  onFilterChange: (filters: FilterOptions) => void;
  onBulkUploadClick: () => void;
  isAdmin?: boolean;
}

export interface FilterOptions {
  dealType: string;
  area: string;
  price: string;
  propertyType: string;
  keyword: string;
}

const dealTypes = ['전체', '월세', '매매'];
const propertyTypes = ['전체', '상가', '사무실', '건물매매'];

const Header = forwardRef<HTMLDivElement, HeaderProps>(
  function Header({ onFilterChange, onBulkUploadClick, isAdmin }, ref) {
  const [filters, setFilters] = useState<FilterOptions>({
    dealType: '전체',
    area: '전체',
    price: '전체',
    propertyType: '전체',
    keyword: '',
  });
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <header ref={ref} className="bg-white shadow-lg fixed top-0 left-0 w-full z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center py-4 justify-start">
        {/* 회사 로고 및 텍스트 */}
        <div className="flex items-center min-w-[220px] mr-2">
          <Image src="/pa-logo.png" alt="회사 로고" width={56} height={56} className="rounded-md mr-2" />
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-extrabold text-gray-900">피에이</span>
            <span className="text-base font-bold text-gray-700">공인중개사사무소</span>
          </div>
        </div>
        {/* 검색창 및 버튼 메뉴 */}
        <div className="flex-1 flex flex-row items-center gap-4 ml-2">
          {/* 검색창 */}
          <div className="relative">
            <input
              type="text"
              placeholder="매물번호, 제목 검색"
              value={filters.keyword}
              onChange={e => handleFilterChange('keyword', e.target.value)}
              className="input-field border rounded px-3 py-2 min-w-[220px] max-w-xs text-base"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 0 5 11a6 6 0 0 0 12 0Z" />
              </svg>
            </button>
          </div>
          {/* 거래유형 버튼 */}
          <div className="relative">
            <button
              className="border rounded px-5 py-2 bg-white hover:bg-gray-50 min-w-[110px] text-sm font-normal flex items-center justify-center"
              onClick={() => setOpenPopover(openPopover === 'dealType' ? null : 'dealType')}
            >
              <span className="mr-1.5">{filters.dealType === '전체' ? '거래유형' : filters.dealType}</span>
              <svg className="w-4 h-4 inline-block text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {openPopover === 'dealType' && (
              <div className="absolute left-0 mt-2 w-32 bg-white border rounded shadow-lg z-20">
                {dealTypes.map(type => (
                  <div
                    key={type}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${filters.dealType === type ? 'font-bold text-blue-600' : ''}`}
                    onClick={() => { handleFilterChange('dealType', type); setOpenPopover(null); }}
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* 면적 버튼 */}
          <div className="relative">
            <button
              className="border rounded px-5 py-2 bg-white hover:bg-gray-50 min-w-[110px] text-sm font-normal flex items-center justify-center"
              onClick={() => setOpenPopover(openPopover === 'area' ? null : 'area')}
            >
              <span className="mr-1.5">{filters.area === '전체' ? '면적' : filters.area}</span>
              <svg className="w-4 h-4 inline-block text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {openPopover === 'area' && (
              <div className="absolute left-0 mt-2 w-56 bg-white border rounded shadow-lg z-20 p-4">
                <div className="mb-2 font-bold">면적</div>
                <div className="flex gap-2 mb-2">
                  <button className="px-2 py-1 border rounded text-xs font-semibold">m²</button>
                  <button className="px-2 py-1 border rounded text-xs font-semibold bg-gray-100">평</button>
                </div>
                <input type="range" min="0" max="70" className="w-full accent-blue-500" />
                <div className="text-center text-blue-600 font-bold mt-1">전체</div>
                <div className="grid grid-cols-4 gap-2 mt-2 text-center text-xs">
                  {['~10평','10평대','20평대','30평대','40평대','50평대','60평대','70평~'].map((v) => (
                    <button key={v} className="py-1 bg-gray-50 rounded hover:bg-blue-100">{v}</button>
                  ))}
                </div>
                <button className="mt-2 text-xs text-gray-500 border px-2 py-1 rounded hover:bg-gray-100">조건삭제</button>
              </div>
            )}
          </div>
          {/* 금액 버튼 */}
          <div className="relative">
            <button
              className="border rounded px-5 py-2 bg-white hover:bg-gray-50 min-w-[110px] text-sm font-normal flex items-center justify-center"
              onClick={() => setOpenPopover(openPopover === 'price' ? null : 'price')}
            >
              <span className="mr-1.5">{filters.price === '전체' ? '금액' : filters.price}</span>
              <svg className="w-4 h-4 inline-block text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {openPopover === 'price' && (
              <div className="absolute left-0 mt-2 w-72 bg-white border rounded shadow-lg z-20 p-4">
                <div className="mb-2 font-bold">금액</div>
                <div className="grid grid-cols-4 gap-2 mb-2 text-center text-xs">
                  {['~1억','2억','3억','4억','5억','6억','7억','8억','9억','10억','15억','20억','30억','40억','50억','100억','200억','300억','400억','500억~'].map((v) => (
                    <button key={v} className="py-1 bg-gray-50 rounded hover:bg-pink-100">{v}</button>
                  ))}
                </div>
                <div className="flex gap-2 mb-2">
                  <input className="input-field flex-1" placeholder="최소" />
                  <span className="self-center">~</span>
                  <input className="input-field flex-1" placeholder="최대" />
                  <span className="self-center">원</span>
                </div>
                <button className="mt-2 text-xs text-pink-600 border border-pink-300 px-2 py-1 rounded hover:bg-pink-50">가격대 초기화</button>
              </div>
            )}
          </div>
          {/* 매물종류 버튼 */}
          <div className="relative">
            <button
              className="border rounded px-5 py-2 bg-white hover:bg-gray-50 min-w-[110px] text-sm font-normal flex items-center justify-center"
              onClick={() => setOpenPopover(openPopover === 'propertyType' ? null : 'propertyType')}
            >
              <span className="mr-1.5">{filters.propertyType === '전체' ? '매물종류' : filters.propertyType}</span>
              <svg className="w-4 h-4 inline-block text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {openPopover === 'propertyType' && (
              <div className="absolute left-0 mt-2 w-44 bg-white border rounded shadow-lg z-20">
                {propertyTypes.map(type => (
                  <div
                    key={type}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${filters.propertyType === type ? 'font-bold text-blue-600' : ''}`}
                    onClick={() => { handleFilterChange('propertyType', type); setOpenPopover(null); }}
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* 대량 업로드 버튼 (관리자만 노출) */}
          {isAdmin && (
            <div className="ml-auto">
              <button
                onClick={onBulkUploadClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <DocumentArrowUpIcon className="h-4 w-4" />
                <span className="text-sm font-medium">대량 업로드</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
});
export default Header; 