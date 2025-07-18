'use client';
import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { 
  DocumentArrowUpIcon, 
  XMarkIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  type: string;
  bedrooms: number;
  area: string;
  address: string;
  lat: number;
  lng: number;
  dealType: string;
  propertyType: string;
  floor?: string;
  parking?: string;
  heating?: string;
  moveInDate?: string;
  description?: string;
  features?: string;
  image?: string;
}

interface BulkUploadProps {
  onPropertiesUploaded: (properties: Property[]) => void;
  onClose: () => void;
}

interface UploadResult {
  success: boolean;
  message: string;
  properties?: Property[];
  errors?: string[];
}

export default function BulkUpload({ onPropertiesUploaded, onClose }: BulkUploadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 컴포넌트 마운트 시 애니메이션
  useState(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  });

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadResult(null);
    setPreviewData([]);

    try {
      let data: any[] = [];

      if (file.name.endsWith('.csv')) {
        // CSV 파일 처리
        const text = await file.text();
        const result = Papa.parse(text, { header: true });
        data = result.data;
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        // Excel 파일 처리
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        data = XLSX.utils.sheet_to_json(worksheet);
      } else {
        throw new Error('지원하지 않는 파일 형식입니다. CSV 또는 Excel 파일을 업로드해주세요.');
      }

      // 데이터 검증 및 변환
      const result = validateAndTransformData(data);
      setUploadResult(result);

      if (result.success && result.properties) {
        setPreviewData(data.slice(0, 5)); // 처음 5개 행 미리보기
      }
    } catch (error) {
      console.error('파일 업로드 오류:', error);
      setUploadResult({
        success: false,
        message: `파일 처리 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      });
    } finally {
      setIsUploading(false);
    }
  };

  const validateAndTransformData = (data: any[]): UploadResult => {
    const properties: Property[] = [];
    const errors: string[] = [];
    let rowIndex = 2; // Excel/CSV는 1부터 시작하므로 2부터

    for (const row of data) {
      try {
        // 필수 필드 검증
        if (!row.title || !row.address) {
          errors.push(`행 ${rowIndex}: 제목과 주소는 필수입니다.`);
          rowIndex++;
          continue;
        }

        // 기본값 설정
        const property: Property = {
          id: `bulk-${Date.now()}-${rowIndex}`,
          title: row.title || '제목 없음',
          price: row.price || '가격 미정',
          location: row.location || row.address || '위치 미정',
          type: row.type || '기타',
          bedrooms: parseInt(row.bedrooms) || 0,
          area: row.area || '면적 미정',
          address: row.address || '',
          lat: parseFloat(row.lat) || 0,
          lng: parseFloat(row.lng) || 0,
          dealType: row.dealType || '매매',
          propertyType: row.propertyType || '기타',
          floor: row.floor || '',
          parking: row.parking || '',
          heating: row.heating || '',
          moveInDate: row.moveInDate || '',
          description: row.description || '',
          features: row.features || '',
          image: row.image || '',
        };

        properties.push(property);
      } catch (error) {
        errors.push(`행 ${rowIndex}: 데이터 처리 중 오류가 발생했습니다.`);
      }
      rowIndex++;
    }

    if (properties.length === 0) {
      return {
        success: false,
        message: '유효한 매물 데이터를 찾을 수 없습니다.',
        errors
      };
    }

    return {
      success: true,
      message: `${properties.length}개의 매물이 성공적으로 처리되었습니다.`,
      properties,
      errors: errors.length > 0 ? errors : undefined
    };
  };

  const handleConfirmUpload = () => {
    if (uploadResult?.success && uploadResult.properties) {
      onPropertiesUploaded(uploadResult.properties);
      onClose();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        title: '강남구 역삼동 신축 아파트',
        price: '8억 5,000만원',
        location: '서울 강남구 역삼동',
        type: '아파트',
        bedrooms: '3',
        area: '84.5㎡',
        address: '서울 강남구 역삼동 123-45',
        lat: '37.4979',
        lng: '127.0276',
        dealType: '매매',
        propertyType: '상가',
        floor: '8층/15층',
        parking: '가능',
        heating: '개별난방',
        moveInDate: '즉시입주',
        description: '강남구 역삼동에 위치한 신축 아파트입니다. 역세권에 위치하여 교통이 매우 편리하며, 깨끗하고 현대적인 시설을 갖추고 있습니다.',
        features: '신축,역세권,주차가능,엘리베이터,개별난방',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGY0NmU1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI0OCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BPC90ZXh0Pjwvc3ZnPg=='
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '매물 템플릿');
    XLSX.writeFile(wb, '매물_템플릿.xlsx');
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100 transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`} style={{zIndex: 100}}>
      <div className={`bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto transition-all duration-300 ${
        isVisible ? 'scale-100' : 'scale-95'
      }`}>
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <DocumentArrowUpIcon className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">대량 매물 업로드</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6">
          {/* 파일 업로드 영역 */}
          <div className="mb-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                CSV 또는 Excel 파일을 업로드하세요
              </h3>
              <p className="text-gray-500 mb-4">
                지원 형식: .csv, .xlsx, .xls
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {isUploading ? '처리 중...' : '파일 선택'}
              </button>
            </div>
          </div>

          {/* 템플릿 다운로드 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">템플릿 다운로드</h4>
            <p className="text-sm text-gray-600 mb-3">
              올바른 형식으로 데이터를 입력하기 위해 템플릿을 다운로드하세요.
            </p>
            <button
              onClick={downloadTemplate}
              className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
              Excel 템플릿 다운로드
            </button>
          </div>

          {/* 업로드 결과 */}
          {uploadResult && (
            <div className="mb-6">
              {uploadResult.success ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">업로드 성공</span>
                  </div>
                  <p className="text-green-700">{uploadResult.message}</p>
                  {uploadResult.errors && uploadResult.errors.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-green-600 font-medium">경고:</p>
                      <ul className="text-sm text-green-600 mt-1">
                        {uploadResult.errors.slice(0, 3).map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                        {uploadResult.errors.length > 3 && (
                          <li>• ... 외 {uploadResult.errors.length - 3}개 경고</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                    <span className="font-medium text-red-800">업로드 실패</span>
                  </div>
                  <p className="text-red-700">{uploadResult.message}</p>
                  {uploadResult.errors && (
                    <ul className="text-sm text-red-600 mt-2">
                      {uploadResult.errors.slice(0, 5).map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 미리보기 */}
          {previewData.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">데이터 미리보기 (처음 5개)</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      {Object.keys(previewData[0]).map(key => (
                        <th key={key} className="px-3 py-2 text-left text-gray-700 font-medium">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        {Object.values(row).map((value, cellIndex) => (
                          <td key={cellIndex} className="px-3 py-2 text-gray-600">
                            {String(value || '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          {uploadResult?.success && (
            <button
              onClick={handleConfirmUpload}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              매물 추가 ({uploadResult.properties?.length}개)
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 