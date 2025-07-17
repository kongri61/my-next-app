# 부동산 지도 사이트

지도 기반 매물 홍보 사이트 - Notion + Pory 활용

## 주요 기능

- 🗺️ **인터랙티브 지도**: Google Maps 기반 매물 지도
- 📋 **매물 목록**: 페이지네이션과 필터링
- 🏢 **상업용 매물 스타일**: 전문적인 매물 상세정보
- 👨‍💼 **관리자 기능**: 대량 업로드, 주소 검색
- 🔍 **고급 필터링**: 거래유형, 면적, 가격, 매물종류
- 📱 **반응형 디자인**: 모바일/데스크톱 최적화
- 🎯 **고정 헤더**: 스크롤 시에도 접근 가능

## 배포 가이드

### 1. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```bash
# Google Maps API 키
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Notion API 설정 (선택사항)
NOTION_API_KEY=your_notion_api_key_here
NOTION_DATABASE_ID=your_notion_database_id_here

# Pory API 설정 (선택사항)
PORY_API_KEY=your_pory_api_key_here

# 사이트 URL
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

### 2. Vercel 배포 (권장)

1. **GitHub에 코드 푸시**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Vercel 프로젝트 생성**
   - [Vercel](https://vercel.com)에 로그인
   - "New Project" 클릭
   - GitHub 저장소 연결
   - 프로젝트 설정 확인

3. **환경 변수 설정**
   - Vercel 대시보드 → Project Settings → Environment Variables
   - 위의 환경 변수들을 추가

4. **배포**
   - 자동으로 배포가 시작됩니다
   - 배포 완료 후 제공되는 URL로 접속

### 3. Netlify 배포

1. **빌드 설정**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **환경 변수 설정**
   - Netlify 대시보드 → Site Settings → Environment Variables
   - 동일한 환경 변수들 추가

### 4. AWS Amplify 배포

1. **앱 생성**
   - AWS Amplify Console에서 새 앱 생성
   - GitHub 저장소 연결

2. **환경 변수 설정**
   - App Settings → Environment Variables
   - 동일한 환경 변수들 추가

## 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 주요 컴포넌트

- `Header.tsx`: 고정 헤더 및 필터링
- `GoogleMap.tsx`: 인터랙티브 지도
- `PropertyList.tsx`: 매물 목록 (페이지네이션)
- `PropertyDetail.tsx`: 매물 상세정보
- `BulkUpload.tsx`: 대량 업로드 (관리자 전용)
- `AddressInput.tsx`: 주소 검색 (관리자 전용)

## 관리자 기능

관리자 기능은 `isAdmin` 플래그로 제어됩니다:
- 대량 업로드: CSV 파일을 통한 매물 일괄 등록
- 주소 검색: 주소를 좌표로 변환하여 매물 추가
- 매물 이미지 변경: 각 매물의 대표 이미지 수정

## 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Google Maps API
- **UI Components**: Headless UI, Heroicons
- **Data Processing**: PapaParse (CSV), XLSX

## 라이선스

MIT License 