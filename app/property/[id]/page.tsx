import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// 샘플 데이터 (실제 데이터 연동 전용)
const sampleProperty = {
  id: '1931',
  title: '시청역 인근 올림피아빌딩 깔끔한 2층상가',
  deposit: '2,000만원',
  monthly: '170만원',
  maintenance: '350,000원',
  area: '약 40평',
  floor: '2층',
  address: '인천광역시 남동구 구월동 1143-31, 2층',
  agent: {
    name: '이정환 과장(소속공인중개사)',
    phone: '032-710-9771',
    mobile: '010-8010-4499',
    office: '명가공인중개사사무소',
    officeAddress: '인천광역시 남동구 구월동 1143-31, 2층',
    reg: '등록번호: 2020-0325-00003',
  },
  images: [
    '/sample1.jpg',
    '/sample2.jpg',
    '/sample3.jpg',
  ],
  features: [
    '시청역 인근 올림피아빌딩 깔끔한 2층상가',
    '약 40평, 관리비 약 35만원',
    '엘리베이터있음',
    '남향/창문 2면/환기좋음',
    '화장실 1개 가능',
    '2층 전용구조',
    '1층 공용공간 별도 세금',
    '무권리',
  ],
  table: [
    { label: '보증금', value: '2,000만원' },
    { label: '월세', value: '170만원' },
    { label: '관리비', value: '350,000원' },
    { label: '면적', value: '약 40평' },
    { label: '층수', value: '2층' },
    { label: '주소', value: '인천광역시 남동구 구월동 1143-31, 2층' },
  ],
};

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const p = sampleProperty;
  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* 상단: 제목, 가격, 주요 정보 */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* 사진 갤러리 */}
        <div className="flex-1 min-w-[320px]">
          <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden mb-2">
            <Image src={p.images[0]} alt="매물사진" width={640} height={360} className="object-cover w-full h-full" />
          </div>
          <div className="flex gap-2">
            {p.images.map((img, i) => (
              <div key={i} className="w-24 h-16 bg-gray-200 rounded overflow-hidden">
                <Image src={img} alt={`매물사진${i+1}`} width={96} height={64} className="object-cover w-full h-full" />
              </div>
            ))}
          </div>
        </div>
        {/* 주요 정보/중개인 */}
        <div className="w-full md:w-96 flex flex-col gap-4">
          <div>
            <div className="text-xl font-bold text-green-700 mb-1">보증금 {p.deposit} / 월세 {p.monthly} <span className="text-gray-500 text-base">(관리비 {p.maintenance})</span></div>
            <div className="text-lg font-semibold text-gray-800">{p.title}</div>
            <div className="text-sm text-gray-500">{p.address}</div>
          </div>
          <div className="border rounded-lg p-3 bg-gray-50">
            <div className="font-bold text-gray-700 mb-1">{p.agent.office}</div>
            <div className="text-sm text-gray-600">{p.agent.name}</div>
            <div className="text-sm text-gray-600">{p.agent.phone} / {p.agent.mobile}</div>
            <div className="text-xs text-gray-400 mt-1">{p.agent.officeAddress}</div>
            <div className="text-xs text-gray-400">{p.agent.reg}</div>
          </div>
        </div>
      </div>
      {/* 상세 설명 */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="mb-4">
            <div className="font-bold text-lg mb-2">매물 설명</div>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              {p.features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
          <div className="mb-4">
            <div className="font-bold text-lg mb-2">매물 정보</div>
            <table className="w-full text-sm border">
              <tbody>
                {p.table.map((row, i) => (
                  <tr key={i} className="border-b">
                    <td className="bg-gray-50 px-2 py-1 font-semibold w-24">{row.label}</td>
                    <td className="px-2 py-1">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* 지도/기타 */}
        <div>
          <div className="font-bold text-lg mb-2">위치 안내</div>
          <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center text-gray-500">지도 영역</div>
        </div>
      </div>
    </div>
  );
} 