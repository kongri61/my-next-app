"use client";
import { useState, forwardRef, useEffect } from "react";
import Image from "next/image";
import { DocumentArrowUpIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export interface FilterOptions {
  dealType: string;
  area: string;
  price: string;
  propertyType: string;
  keyword: string;
  areaRange?: [number, number];
  priceRange?: [number, number];
  deposit: string;
  depositRange?: [number, number];
}

interface HeaderProps {
  onFilterChange: (filters: FilterOptions) => void;
  onBulkUploadClick: () => void;
  isAdmin?: boolean;
}

const dealTypes = ["전체", "매매", "월세"];
const propertyTypes = ["전체", "상가", "사무실", "기타"];
const areaButtons = [
  "~5평", "10평", "15평", "20평",
  "25평", "30평", "35평", "40평", 
  "45평", "50평", "55평", "60평",
  "65평", "70평", "100평", "200평~"
];
const priceButtons = [
  "~1억", "2억", "3억", "4억", "5억", "6억",
  "7억", "8억", "9억", "10억", "15억", "20억",
  "30억", "40억", "50억", "60억", "70억", "80억",
  "90억", "100억", "200억", "300억", "400억", "500억~"
];
const depositButtons = [
  "~100", "~500", "~1천", "~2천", "~3천", "~4천"
];

const Header = forwardRef<HTMLDivElement, HeaderProps>(
  function Header({ onFilterChange, onBulkUploadClick, isAdmin }, ref) {
    const [filters, setFilters] = useState<FilterOptions>({
      dealType: "전체",
      area: "전체",
      price: "전체",
      propertyType: "전체",
      keyword: "",
      areaRange: [0, 200],
      priceRange: [0, 500],
      deposit: "전체",
      depositRange: [0, 4000]
    });
    const [openPopover, setOpenPopover] = useState<string | null>(null);
    const [selectedArea, setSelectedArea] = useState<string[]>([]);
    const [selectedPrice, setSelectedPrice] = useState<string[]>([]);
    const [selectedDeposit, setSelectedDeposit] = useState<string[]>([]);

    // Helper: area button value to number
    const areaValue = (v: string) => {
      if (v === "~5평") return 5;
      if (v === "10평") return 10;
      if (v === "15평") return 15;
      if (v === "20평") return 20;
      if (v === "25평") return 25;
      if (v === "30평") return 30;
      if (v === "35평") return 35;
      if (v === "40평") return 40;
      if (v === "45평") return 45;
      if (v === "50평") return 50;
      if (v === "55평") return 55;
      if (v === "60평") return 60;
      if (v === "65평") return 65;
      if (v === "70평") return 70;
      if (v === "100평") return 100;
      if (v === "200평~") return 200;
      return parseInt(v.replace("평", ""));
    };

    // Helper: price button value to number
    const priceValue = (v: string) => {
      if (v === "~1억") return 1;
      if (v === "2억") return 2;
      if (v === "3억") return 3;
      if (v === "4억") return 4;
      if (v === "5억") return 5;
      if (v === "6억") return 6;
      if (v === "7억") return 7;
      if (v === "8억") return 8;
      if (v === "9억") return 9;
      if (v === "10억") return 10;
      if (v === "15억") return 15;
      if (v === "20억") return 20;
      if (v === "30억") return 30;
      if (v === "40억") return 40;
      if (v === "50억") return 50;
      if (v === "60억") return 60;
      if (v === "70억") return 70;
      if (v === "80억") return 80;
      if (v === "90억") return 90;
      if (v === "100억") return 100;
      if (v === "200억") return 200;
      if (v === "300억") return 300;
      if (v === "400억") return 400;
      if (v === "500억~") return 500;
      return parseInt(v.replace("억", ""));
    };

    // Helper: deposit button value to number (in 만원)
    const depositValue = (v: string) => {
      if (v === "~100") return 100;
      if (v === "~500") return 500;
      if (v === "~1천") return 1000;
      if (v === "~2천") return 2000;
      if (v === "~3천") return 3000;
      if (v === "~4천") return 4000;
      return parseInt(v.replace(/[천]/g, ""));
    };

    // Helper: 평을 m²로 변환 (1평 = 3.3058m²)
    const convertPyeongToSquareMeter = (pyeong: number) => {
      return Math.round(pyeong * 3.3058);
    };

    // Helper: 선택된 면적 범위를 m²로 변환
    const getAreaInSquareMeter = () => {
      if (filters.area === "전체" || !filters.areaRange) {
        return null;
      }
      const [minPyeong, maxPyeong] = filters.areaRange;
      if (minPyeong === maxPyeong) {
        return `${convertPyeongToSquareMeter(minPyeong)}(m²)`;
      } else {
        return `${convertPyeongToSquareMeter(minPyeong)}~${convertPyeongToSquareMeter(maxPyeong)}(m²)`;
      }
    };

    // Area button click with range selection
    const handleAreaClick = (v: string) => {
      let arr = [...selectedArea];
      
      // If trying to select a third button, reset and select only the new one
      if (arr.length >= 2 && !arr.includes(v)) {
        arr = [v];
        setSelectedArea(arr);
        const buttonVal = areaValue(v);
        setFilters((f) => ({
          ...f,
          area: `${buttonVal}평`,
          areaRange: [buttonVal, buttonVal],
        }));
        onFilterChange({ ...filters, area: v });
        return;
      }
      
      if (arr.includes(v)) {
        arr = arr.filter((x) => x !== v);
      } else {
        arr.push(v);
      }
      
      if (arr.length === 0) {
        setFilters((f) => ({ ...f, area: "전체", areaRange: [0, 200] }));
      } else {
        const nums = arr.map(areaValue).sort((a, b) => a - b);
        const minVal = nums[0];
        const maxVal = nums[nums.length - 1];
        let areaText = "";
        if (minVal === 5 && arr.includes("~5평")) {
          areaText = `0~${maxVal}평`;
        } else if (maxVal === 200 && arr.includes("200평~")) {
          areaText = `${minVal}평~최대`;
        } else if (minVal === maxVal) {
          areaText = `${minVal}평`;
        } else {
          areaText = `${minVal}평~${maxVal}평`;
        }
        setFilters((f) => ({
          ...f,
          area: areaText,
          areaRange: [minVal, maxVal],
        }));
      }
      setSelectedArea(arr);
      onFilterChange({ ...filters, area: arr.length === 0 ? "전체" : arr.join(",") });
    };

    // Price button click with range selection
    const handlePriceClick = (v: string) => {
      let arr = [...selectedPrice];
      
      // If trying to select a third button, reset and select only the new one
      if (arr.length >= 2 && !arr.includes(v)) {
        arr = [v];
        setSelectedPrice(arr);
        const buttonVal = priceValue(v);
        setFilters((f) => ({
          ...f,
          price: `${buttonVal}억`,
          priceRange: [buttonVal, buttonVal],
        }));
        onFilterChange({ ...filters, price: v });
        return;
      }
      
      if (arr.includes(v)) {
        arr = arr.filter((x) => x !== v);
      } else {
        arr.push(v);
      }
      
      if (arr.length === 0) {
        setFilters((f) => ({ ...f, price: "전체", priceRange: [0, 500] }));
      } else {
        const nums = arr.map(priceValue).sort((a, b) => a - b);
        const minVal = nums[0];
        const maxVal = nums[nums.length - 1];
        let priceText = "";
        if (minVal === 1) {
          priceText = `0~${maxVal}억`;
        } else if (minVal === maxVal) {
          priceText = `${minVal}억`;
        } else {
          priceText = `${minVal}억~${maxVal}억`;
        }
        setFilters((f) => ({
          ...f,
          price: priceText,
          priceRange: [minVal, maxVal],
        }));
      }
      setSelectedPrice(arr);
      onFilterChange({ ...filters, price: arr.length === 0 ? "전체" : arr.join(",") });
    };

    // Deposit button click with range selection
    const handleDepositClick = (v: string) => {
      let arr = [...selectedDeposit];
      
      // If trying to select a third button, reset and select only the new one
      if (arr.length >= 2 && !arr.includes(v)) {
        arr = [v];
        setSelectedDeposit(arr);
        const buttonVal = depositValue(v);
        setFilters((f) => ({
          ...f,
          deposit: `${buttonVal}만원`,
          depositRange: [buttonVal, buttonVal],
        }));
        onFilterChange({ ...filters, deposit: v });
        return;
      }
      
      if (arr.includes(v)) {
        arr = arr.filter((x) => x !== v);
      } else {
        arr.push(v);
      }
      
      if (arr.length === 0) {
        setFilters((f) => ({ ...f, deposit: "전체", depositRange: [0, 4000] }));
      } else {
        const nums = arr.map(depositValue).sort((a, b) => a - b);
        const minVal = nums[0];
        const maxVal = nums[nums.length - 1];
        let depositText = "";
        if (minVal === 100) {
          depositText = `0~${maxVal}만원`;
        } else if (minVal === maxVal) {
          depositText = `${minVal}만원`;
        } else {
          depositText = `${minVal}만원~${maxVal}만원`;
        }
        setFilters((f) => ({
          ...f,
          deposit: depositText,
          depositRange: [minVal, maxVal],
        }));
      }
      setSelectedDeposit(arr);
      onFilterChange({ ...filters, deposit: arr.length === 0 ? "전체" : arr.join(",") });
    };

    // Helper: Convert deposit range to Korean format
    const formatDepositText = (depositText: string) => {
      if (depositText === "전체") return "전체";
      
      // Convert "500만원~2000만원" to "5백만~2천만"
      return depositText
        .replace(/100만원/g, "1백만")
        .replace(/200만원/g, "2백만")
        .replace(/300만원/g, "3백만")
        .replace(/400만원/g, "4백만")
        .replace(/500만원/g, "5백만")
        .replace(/600만원/g, "6백만")
        .replace(/700만원/g, "7백만")
        .replace(/800만원/g, "8백만")
        .replace(/900만원/g, "9백만")
        .replace(/1000만원/g, "1천만")
        .replace(/2000만원/g, "2천만")
        .replace(/3000만원/g, "3천만")
        .replace(/4000만원/g, "4천만")
        .replace(/0~(\d+)만원/g, (match, num) => {
          const n = parseInt(num);
          if (n >= 1000) return `0~${Math.floor(n/1000)}천만`;
          return `0~${Math.floor(n/100)}백만`;
        })
        .replace(/(\d+)만원~(\d+)만원/g, (match, min, max) => {
          const minNum = parseInt(min);
          const maxNum = parseInt(max);
          let minText = minNum >= 1000 ? `${Math.floor(minNum/1000)}천만` : `${Math.floor(minNum/100)}백만`;
          let maxText = maxNum >= 1000 ? `${Math.floor(maxNum/1000)}천만` : `${Math.floor(maxNum/100)}백만`;
          return `${minText}~${maxText}`;
        });
    };

    // Helper: Convert price range to Korean format
    const formatPriceText = (priceText: string) => {
      if (priceText === "전체") return "전체";
      
      // Convert "7억~30억" to "7억~3십억"
      return priceText
        .replace(/10억/g, "1십억")
        .replace(/20억/g, "2십억")
        .replace(/30억/g, "3십억")
        .replace(/40억/g, "4십억")
        .replace(/50억/g, "5십억")
        .replace(/60억/g, "6십억")
        .replace(/70억/g, "7십억")
        .replace(/80억/g, "8십억")
        .replace(/90억/g, "9십억")
        .replace(/100억/g, "1백억")
        .replace(/200억/g, "2백억")
        .replace(/300억/g, "3백억")
        .replace(/400억/g, "4백억")
        .replace(/500억/g, "5백억")
        .replace(/0~(\d+)억/g, (match, num) => {
          const n = parseInt(num);
          if (n >= 100) return `0~${Math.floor(n/100)}백억`;
          if (n >= 10) return `0~${Math.floor(n/10)}십억`;
          return `0~${n}억`;
        })
        .replace(/(\d+)억~(\d+)억/g, (match, min, max) => {
          const minNum = parseInt(min);
          const maxNum = parseInt(max);
          let minText = minNum >= 100 ? `${Math.floor(minNum/100)}백억` : 
                       minNum >= 10 ? `${Math.floor(minNum/10)}십억` : `${minNum}억`;
          let maxText = maxNum >= 100 ? `${Math.floor(maxNum/100)}백억` : 
                       maxNum >= 10 ? `${Math.floor(maxNum/10)}십억` : `${maxNum}억`;
          return `${minText}~${maxText}`;
        });
    };

    // Deal type button click
    const handleDealTypeClick = (v: string) => {
      setFilters((f) => ({ ...f, dealType: v }));
      setOpenPopover(null);
      onFilterChange({ ...filters, dealType: v });
    };

    // Reset deal type
    const resetDealType = () => {
      setFilters((f) => ({ ...f, dealType: "전체" }));
      setOpenPopover(null);
    };

    // Get deal type button style
    const getDealTypeButtonStyle = (v: string) => {
      if (filters.dealType === v) {
        return "bg-green-600 text-white font-bold";
      }
      return "bg-gray-100 hover:bg-gray-200";
    };

    // Reset functions
    const resetArea = () => {
      setSelectedArea([]);
      setFilters((f) => ({ ...f, area: "전체", areaRange: [0, 0] }));
    };
    const resetPrice = () => {
      setSelectedPrice([]);
      setFilters((f) => ({ ...f, price: "전체", priceRange: [0, 0] }));
    };
    const resetDeposit = () => {
      setSelectedDeposit([]);
      setFilters((f) => ({ ...f, deposit: "전체", depositRange: [0, 0] }));
    };

    // Get button style for area
    const getAreaButtonStyle = (v: string) => {
      const buttonVal = areaValue(v);
      
      // Get current range from selected buttons
      if (selectedArea.length >= 1) {
        const nums = selectedArea.map(areaValue).sort((a, b) => a - b);
        const minVal = nums[0];
        const maxVal = nums[nums.length - 1];
        
        // Check if this button is explicitly selected
        if (selectedArea.includes(v)) {
          return "bg-blue-600 text-white font-bold";
        }
        
        // Check if this button falls within the selected range
        if (buttonVal >= minVal && buttonVal <= maxVal) {
          return "bg-blue-100 hover:bg-blue-200";
        }
      }
      
      return "bg-gray-100 hover:bg-gray-200";
    };

    // Get button style for price
    const getPriceButtonStyle = (v: string) => {
      const buttonVal = priceValue(v);
      
      // Get current range from selected buttons
      if (selectedPrice.length >= 1) {
        const nums = selectedPrice.map(priceValue).sort((a, b) => a - b);
        const minVal = nums[0];
        const maxVal = nums[nums.length - 1];
        
        // Check if this button is explicitly selected
        if (selectedPrice.includes(v)) {
          return "bg-pink-600 text-white font-bold";
        }
        
        // Check if this button falls within the selected range
        if (buttonVal >= minVal && buttonVal <= maxVal) {
          return "bg-pink-100 hover:bg-pink-200";
        }
      }
      
      return "bg-gray-100 hover:bg-gray-200";
    };

    // Get button style for deposit
    const getDepositButtonStyle = (v: string) => {
      const buttonVal = depositValue(v);
      
      // Get current range from selected buttons
      if (selectedDeposit.length >= 1) {
        const nums = selectedDeposit.map(depositValue).sort((a, b) => a - b);
        const minVal = nums[0];
        const maxVal = nums[nums.length - 1];
        
        // Check if this button is explicitly selected
        if (selectedDeposit.includes(v)) {
          return "bg-purple-600 text-white font-bold";
        }
        
        // Check if this button falls within the selected range
        if (buttonVal >= minVal && buttonVal <= maxVal) {
          return "bg-purple-100 hover:bg-purple-200";
        }
      }
      
      return "bg-gray-100 hover:bg-gray-200";
    };

    // Property type button click
    const handlePropertyTypeClick = (v: string) => {
      setFilters((f) => ({ ...f, propertyType: v }));
      setOpenPopover(null);
      onFilterChange({ ...filters, propertyType: v });
    };

    // Reset property type
    const resetPropertyType = () => {
      setFilters((f) => ({ ...f, propertyType: "전체" }));
      setOpenPopover(null);
    };

    // Get property type button style
    const getPropertyTypeButtonStyle = (v: string) => {
      if (filters.propertyType === v) {
        return "bg-purple-600 text-white font-bold";
      }
      return "bg-gray-100 hover:bg-gray-200";
    };

    // Handle outside click - close popups when clicking outside
    const handleOutsideClick = (event: MouseEvent) => {
      const areaPopover = document.getElementById('areaPopover');
      const pricePopover = document.getElementById('pricePopover');
      const dealTypePopover = document.getElementById('dealTypePopover');
      const propertyTypePopover = document.getElementById('propertyTypePopover');
      const isOutsideArea = areaPopover && !areaPopover.contains(event.target as Node);
      const isOutsidePrice = pricePopover && !pricePopover.contains(event.target as Node);
      const isOutsideDealType = dealTypePopover && !dealTypePopover.contains(event.target as Node);
      const isOutsidePropertyType = propertyTypePopover && !propertyTypePopover.contains(event.target as Node);
      if (isOutsideArea && openPopover === "area") {
        setOpenPopover(null);
      }
      if (isOutsidePrice && openPopover === "price") {
        setOpenPopover(null);
      }
      if (isOutsideDealType && openPopover === "dealType") {
        setOpenPopover(null);
      }
      if (isOutsidePropertyType && openPopover === "propertyType") {
        setOpenPopover(null);
      }
    };

    useEffect(() => {
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [openPopover]);

    // Reset all filters
    const resetAllFilters = () => {
      setFilters({
        dealType: "전체",
        area: "전체",
        price: "전체",
        propertyType: "전체",
        keyword: "",
        areaRange: [0, 200],
        priceRange: [0, 500],
        deposit: "전체",
        depositRange: [0, 4000]
      });
      setSelectedArea([]);
      setSelectedPrice([]);
      setSelectedDeposit([]);
      setOpenPopover(null);
      onFilterChange({
        dealType: "전체",
        area: "전체",
        price: "전체",
        propertyType: "전체",
        keyword: "",
        areaRange: [0, 200],
        priceRange: [0, 500],
        deposit: "전체",
        depositRange: [0, 4000]
      });
    };

    return (
      <header ref={ref} className="bg-white shadow-lg fixed top-0 left-0 w-full z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center py-3">
          {/* 로고 - 좌측 끝 */}
          <div className="flex items-center min-w-[200px] mr-4">
            <Image src="/pa-logo.png" alt="회사 로고" width={48} height={48} className="rounded-md mr-2" />
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-extrabold text-gray-900">피에이</span>
              <span className="text-sm font-bold text-gray-700">공인중개사사무소</span>
            </div>
          </div>
          
          {/* 검색창 및 필터 - 중앙 */}
          <div className="flex-1 flex flex-row items-center gap-2">
            {/* 검색창 */}
            <input
              type="text"
              placeholder="매물번호, 제목 검색"
              value={filters.keyword}
              onChange={e => setFilters(f => ({ ...f, keyword: e.target.value }))}
              className="border rounded px-2 py-1.5 min-w-[180px] max-w-xs text-sm"
            />
            
            {/* 거래유형 */}
            <div className="relative">
              <button
                className={`border rounded px-2 py-1.5 text-sm min-w-[80px] ${
                  openPopover === "dealType" ? "bg-green-50 border-green-300" : "bg-white hover:bg-green-50"
                }`}
                onClick={() => setOpenPopover(openPopover === "dealType" ? null : "dealType")}
              >
                {filters.dealType === "전체" ? "거래유형" : filters.dealType}
              </button>
              {openPopover === "dealType" && (
                <div id="dealTypePopover" className="absolute left-0 top-full mt-1 w-32 rounded shadow-lg z-20 bg-white">
                  <div className="p-2">
                    {dealTypes.map(v => (
                      <button
                        key={v}
                        className={`w-full px-2 py-1 rounded text-xs mb-1 ${getDealTypeButtonStyle(v)}`}
                        onClick={() => handleDealTypeClick(v)}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* 면적 */}
            <div className="relative">
              <button
                className={`border rounded px-2 py-1.5 text-sm min-w-[80px] ${
                  openPopover === "area" ? "bg-blue-50 border-blue-300" : "bg-white hover:bg-blue-50"
                }`}
                onClick={() => setOpenPopover(openPopover === "area" ? null : "area")}
              >
                {filters.area === "전체" ? "면적" : filters.area}
              </button>
              {openPopover === "area" && (
                <div id="areaPopover" className="absolute left-0 top-full mt-1 w-64 rounded shadow-lg z-20 bg-white">
                  <div className="flex items-center justify-between mb-3 p-2">
                    <button
                      className={`px-2 py-1 rounded text-xs ${filters.area === "전체" ? "bg-blue-600 text-white font-bold" : "bg-gray-100 hover:bg-gray-200"}`}
                      onClick={() => handleAreaClick("전체")}
                    >
                      전체
                    </button>
                    {filters.area !== "전체" && (
                      <button className="text-xs text-blue-500 underline" onClick={resetArea}>초기화</button>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mb-3 p-2">
                    면적(평)
                    {getAreaInSquareMeter() && (
                      <span className="text-red-600 ml-2 font-bold">
                        {getAreaInSquareMeter()}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-1 mb-3 p-2">
                    {areaButtons.map(v => (
                      <button
                        key={v}
                        className={`px-2 py-1 rounded text-xs ${getAreaButtonStyle(v)}`}
                        onClick={() => handleAreaClick(v)}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 p-2">
                    <input
                      className="border rounded px-2 py-1 text-xs w-16"
                      placeholder="최소"
                      value={selectedArea.includes("~5평") ? "최소값" : (filters.areaRange?.[0] || "")}
                      readOnly
                    />
                    <span className="text-xs">~</span>
                    <input
                      className="border rounded px-2 py-1 text-xs w-16"
                      placeholder="최대"
                      value={selectedArea.includes("200평~") ? "최대값" : (filters.areaRange?.[1] || "")}
                      readOnly
                    />
                    <span className="text-xs">평</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* 금액 */}
            <div className="relative">
              <button
                className={`border rounded px-2 py-1.5 text-xs min-w-[80px] ${
                  openPopover === "price" ? "bg-pink-50 border-pink-300" : "bg-white hover:bg-pink-50"
                }`}
                onClick={() => setOpenPopover(openPopover === "price" ? null : "price")}
              >
                {filters.price === "전체" && filters.deposit === "전체" 
                  ? "금액" 
                  : `${filters.price !== "전체" ? formatPriceText(filters.price) : ""}${filters.price !== "전체" && filters.deposit !== "전체" ? ", " : ""}${filters.deposit !== "전체" ? formatDepositText(filters.deposit) : ""}`
                }
              </button>
              {openPopover === "price" && (
                <div id="pricePopover" className="absolute left-0 top-full mt-1 w-72 rounded shadow-lg z-20 bg-white">
                  <div className="flex items-center justify-between mb-3 p-2">
                    <button
                      className={`px-2 py-1 rounded text-xs ${filters.price === "전체" ? "bg-pink-600 text-white font-bold" : "bg-gray-100 hover:bg-gray-200"}`}
                      onClick={() => handlePriceClick("전체")}
                    >
                      전체
                    </button>
                    {filters.price !== "전체" && (
                      <button className="text-xs text-pink-500 underline" onClick={resetPrice}>초기화</button>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mb-3 p-2">매매가(억)</div>
                  <div className="grid grid-cols-6 gap-1 mb-3 p-2">
                    {priceButtons.map(v => (
                      <button
                        key={v}
                        className={`px-2 py-1 rounded text-xs ${getPriceButtonStyle(v)}`}
                        onClick={() => handlePriceClick(v)}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 p-2">
                    <input
                      className="border rounded px-2 py-1 text-xs w-20"
                      placeholder="최소"
                      value={selectedPrice.includes("~1억") ? "최소" : (filters.priceRange?.[0] || "")}
                      readOnly
                    />
                    <span className="text-xs">~</span>
                    <input
                      className="border rounded px-2 py-1 text-xs w-20"
                      placeholder="최대"
                      value={selectedPrice.includes("500억~") ? "최대" : (filters.priceRange?.[1] || "")}
                      readOnly
                    />
                    <span className="text-xs">억원</span>
                  </div>
                  
                  {/* 보증금 섹션 */}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex items-center justify-between mb-3 p-2">
                      <div className="text-sm text-gray-600">보증금(만원)</div>
                      {filters.deposit !== "전체" && (
                        <button className="text-xs text-purple-500 underline" onClick={resetDeposit}>초기화</button>
                      )}
                    </div>
                    <div className="grid grid-cols-6 gap-1 mb-3 p-2">
                      {depositButtons.map(v => (
                        <button
                          key={v}
                          className={`px-2 py-1 rounded text-xs ${getDepositButtonStyle(v)}`}
                          onClick={() => handleDepositClick(v)}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 p-2">
                      <input
                        className="border rounded px-2 py-1 text-xs w-20"
                        placeholder="최소"
                        value={selectedDeposit.includes("~100") ? "최소" : (filters.depositRange?.[0] || "")}
                        readOnly
                      />
                      <span className="text-xs">~</span>
                      <input
                        className="border rounded px-2 py-1 text-xs w-20"
                        placeholder="최대"
                        value={selectedDeposit.includes("~4천") ? "최대" : (filters.depositRange?.[1] || "")}
                        readOnly
                      />
                      <span className="text-xs">만원</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* 매물종류 */}
            <div className="relative">
              <button
                className={`border rounded px-2 py-1.5 text-sm min-w-[80px] ${
                  openPopover === "propertyType" ? "bg-purple-50 border-purple-300" : "bg-white hover:bg-purple-50"
                }`}
                onClick={() => setOpenPopover(openPopover === "propertyType" ? null : "propertyType")}
              >
                {filters.propertyType === "전체" ? "매물종류" : filters.propertyType}
              </button>
              {openPopover === "propertyType" && (
                <div id="propertyTypePopover" className="absolute left-0 top-full mt-1 w-32 rounded shadow-lg z-20 bg-white">
                  <div className="p-2">
                    {propertyTypes.map(v => (
                      <button
                        key={v}
                        className={`w-full px-2 py-1 rounded text-xs mb-1 ${getPropertyTypeButtonStyle(v)}`}
                        onClick={() => handlePropertyTypeClick(v)}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* 관리자 전용: 주소검색창 */}
            {isAdmin && (
              <input
                type="text"
                placeholder="주소 검색"
                className="border rounded px-2 py-1.5 text-sm min-w-[130px]"
              />
            )}
          </div>
          
          {/* 초기화 버튼 */}
          <div className="ml-4">
            <button
              onClick={resetAllFilters}
              className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 flex items-center gap-1"
            >
              <ArrowPathIcon className="h-4 w-4" />
              <span>초기화</span>
            </button>
          </div>
          
          {/* 관리자 전용: 대량 업로드 - 우측 끝 */}
          {isAdmin && (
            <div className="ml-4">
              <button
                onClick={onBulkUploadClick}
                className="bg-blue-600 text-white px-2 py-1.5 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
              >
                <DocumentArrowUpIcon className="h-4 w-4" />
                <span>대량 업로드</span>
              </button>
            </div>
          )}
        </div>
      </header>
    );
  }
);

Header.displayName = 'Header';

export default Header; 