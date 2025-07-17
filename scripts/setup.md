# 프로젝트 설정 가이드

## 1. Node.js 설치

먼저 Node.js를 설치해야 합니다. [Node.js 공식 웹사이트](https://nodejs.org/)에서 LTS 버전을 다운로드하여 설치하세요.

## 2. 의존성 설치

프로젝트 루트 디렉토리에서 다음 명령어를 실행하세요:

```bash
npm install
```

## 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
NOTION_API_KEY=your_notion_api_key_here
NOTION_DATABASE_ID=your_notion_database_id_here
PORY_API_KEY=your_pory_api_key_here
```

### Notion API 키 설정 방법:

1. [Notion Developers](https://developers.notion.com/) 페이지 방문
2. "Create new integration" 클릭
3. Integration 이름 입력 (예: "Property Map Site")
4. Submit 클릭
5. Internal Integration Token 복사하여 `NOTION_API_KEY`에 설정

### Notion 데이터베이스 설정:

1. Notion에서 새 데이터베이스 생성
2. 다음 속성들을 추가:
   - Title (Title): 매물 제목
   - Description (Text): 매물 설명
   - Price (Number): 가격 (만원 단위)
   - PriceType (Select): 매매/전세/월세
   - PropertyType (Select): 아파트/오피스텔/빌라/원룸/투룸/단독주택
   - Bedrooms (Number): 방 개수
   - Bathrooms (Number): 화장실 개수
   - Size (Number): 면적 (㎡)
   - Location (Text): 주소
   - Latitude (Number): 위도
   - Longitude (Number): 경도
   - Images (Files): 매물 이미지들
   - Features (Multi-select): 특징 (역세권, 신축, 주차가능 등)
   - ContactName (Text): 연락처 이름
   - ContactPhone (Phone): 연락처 전화번호
   - ContactEmail (Email): 연락처 이메일

3. 데이터베이스 URL에서 ID 복사 (URL의 마지막 부분)
4. `NOTION_DATABASE_ID`에 설정

## 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 5. 빌드 및 배포

### 로컬 빌드:
```bash
npm run build
npm start
```

### Vercel 배포:
1. GitHub에 코드 푸시
2. [Vercel](https://vercel.com)에서 프로젝트 연결
3. 환경 변수 설정
4. 자동 배포 완료

## 문제 해결

### 의존성 설치 오류:
```bash
npm cache clean --force
npm install
```

### TypeScript 오류:
```bash
npm run build
```

### 환경 변수 오류:
`.env.local` 파일이 프로젝트 루트에 있는지 확인하세요.

## 추가 설정

### Pory 연동 (선택사항):
Pory를 사용하여 추가 기능을 구현할 수 있습니다. Pory API 키를 발급받아 `PORY_API_KEY`에 설정하세요.

### 커스텀 도메인:
Vercel에서 커스텀 도메인을 설정할 수 있습니다. 