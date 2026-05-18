export const meta = {
  brand: "PAIK'S COFFEE × BEAVERWORKS",
  client: '더본코리아',
  vendor: '비버웍스',
  edition: 'Whitepaper · 2026',
  role: 'Rollout Operations Lead',
  period: '2025.09 — 2026.04',
  scope: 'POS · KIOSK 전 매장',
  title: "PAIK'S COFFEE 1,870개 매장 프로그램 교체 전개 프로젝트",
  subtitle: 'POS · KIOSK 전 매장 전환',
  taglineKo: '더본코리아 발주 · 비버웍스 수행',
} as const

export const heroMarquee = [
  '1,870 STORES',
  "PAIK'S COFFEE",
  'POS · KIOSK FULL ROLLOUT',
  'CS 25% → 80%+',
  '8 MONTHS',
  '6 INTERNAL + 13 PARTNER CENTERS',
  'THEBORNKOREA × BEAVERWORKS',
  '2026 WHITEPAPER',
] as const

export const stats: Array<{
  k: string
  v: string
  unit?: string
  label: string
  accent: 'yellow' | 'cyan' | 'magenta' | 'paper'
}> = [
  { k: 'STORES', v: '1,870', label: "PAIK'S COFFEE 전 매장 전환", accent: 'yellow' },
  { k: 'CENTERS', v: '6+13', label: '내부 6개소 + 협력사 13개', accent: 'paper' },
  { k: 'PROJECT SPAN', v: '8M', label: '2025.09 → 2026.04', accent: 'cyan' },
  { k: 'CS 응대율 회복', v: '80%+', label: '최저 25% → 평균 80%+', accent: 'yellow' },
]

export const pillars = [
  {
    no: '01',
    title: '운영 체계',
    items: ['설치 가이드 · Forms 트래킹', 'TF 지원조직 · 발주처 정기회의'],
  },
  {
    no: '02',
    title: '안정화',
    items: ['CS 콜 분석 · 외주 6명 투입', 'D+1~D+3 집중 대응'],
  },
  {
    no: '03',
    title: '자동화',
    items: ['Google Chat 웹훅', '일정 자동 발송 · 미보고 추적'],
  },
]

export const projectDefinition = [
  { label: '목표', value: '기존 POS · 키오스크 프로그램을 비버웍스로 전환' },
  { label: '대상', value: "PAIK'S COFFEE 약 1,870개 매장" },
  { label: '방식', value: '내부센터 6개소 + 협력사 13개 전국 전개' },
  { label: '기간', value: '2025.09 ~ 2026.04 (약 8개월)' },
  { label: '초기 기준', value: '개발실 설치 가이드 기반 착수' },
  { label: '조건', value: '영업 차질 최소화 · 합의 일정 내 전환 완료' },
] as const

export const roleDefinition = [
  { label: '전개 총괄', value: '전국 설치 일정 · 완료율 · 리스크 관리' },
  { label: '현장 표준화', value: '설치 가이드 · 점주 가이드 · 체크리스트' },
  { label: '내부 조율', value: 'CX · 계약운영 · 개발 · 영업 업무 분기' },
  { label: '외부 대응', value: '더본코리아 IT팀 · DSI · 스마트로 협의' },
  { label: '프로세스', value: 'TF 지원조직 · Forms · 콜 분석 · VCAT 표준화' },
  { label: '정기회의', value: '내부 + 발주처 주 1회 통합 관리' },
] as const

export const manuals = [
  { title: 'POS 사용 매뉴얼', version: 'v1.1', tag: '점주용', fileUrl: '/manuals/paiks-pos-manual.pdf' },
  { title: '키오스크 사용 매뉴얼', version: 'v1.1', tag: '점주용', fileUrl: '/manuals/paiks-kiosk-manual.pdf' },
  { title: '매장관리 사용 매뉴얼', version: 'v1.1', tag: 'SV용', fileUrl: '/manuals/paiks-store-manual.pdf' },
  { title: '통합 설치 가이드', version: 'v1', tag: '설치팀용', fileUrl: '/manuals/install-guide-v1.pdf' },
] as const

export const standardizationIssues = [
  {
    issue: '설치 기준 미흡',
    field: '설치자별 판단 차이 · 예외 대응 기준 불명확',
    action: '통합 설치 가이드 정비 · 사전준비·백오피스·현장점검 기준화',
    result: '현장 적용 기준 통일',
  },
  {
    issue: '사용 안내 부족',
    field: '설치 후 점주 문의 증가 · SV 안내 기준 분산',
    action: 'POS · 키오스크 · 매장관리 매뉴얼 v1.1 제작',
    result: '점주 · SV · 콜센터 공통 기준 확보',
  },
  {
    issue: '백오피스 기준 분산',
    field: '메뉴 · 품절 · 출력 설정 문의 발생',
    action: '매장관리 매뉴얼과 사전 설정 항목 정리',
    result: '설치 전 설정 확인 기준 마련',
  },
] as const

export const timeline: Array<{
  phase: string
  range: string
  title: string
  detail: string
}> = [
  {
    phase: '01',
    range: '2025.09 — 11',
    title: '기준 미흡',
    detail:
      '설치 기준과 매장 사용 가이드 부족 → POS · 키오스크 · 매장관리 매뉴얼 정비',
  },
  {
    phase: '02',
    range: '2025.12',
    title: '환경 이슈',
    detail:
      'H/W · 저장공간 · .NET 구형 장비 설치 지연 → SSD 교체와 VCAT 설정 표준화',
  },
  {
    phase: '03',
    range: '2026.01 — 03',
    title: '운영 병목',
    detail:
      '설치량 급증 · 콜 인입 집중 → 백오피스 · 원격검수 · 콜센터 기능 분리',
  },
  {
    phase: '04',
    range: '2026.04 — 05',
    title: '반복 이슈',
    detail:
      '잔여 문의와 장애 유형 관리 → 주간 장애분석 · 정례회의 · 기준 반영',
  },
]

export const monthlyInstall = [
  { m: '25/09', v: 8, phase: 'SETUP' },
  { m: '25/10', v: 18, phase: 'SETUP' },
  { m: '25/11', v: 78, phase: 'SETUP' },
  { m: '25/12', v: 12, phase: 'FIX' },
  { m: '26/01', v: 212, phase: 'MASS' },
  { m: '26/02', v: 574, phase: 'MASS' },
  { m: '26/03', v: 720, phase: 'PEAK' },
  { m: '26/04', v: 140, phase: 'LANDING' },
] as const

export const responseRate = [
  { m: '25/09', v: 78, calls: 250 },
  { m: '25/10', v: 62, calls: 380 },
  { m: '25/11', v: 55, calls: 510 },
  { m: '25/12', v: 70, calls: 420 },
  { m: '26/01', v: 58, calls: 720 },
  { m: '26/02', v: 40, calls: 1200 },
  { m: '26/03', v: 25, calls: 2100 },
  { m: '26/04', v: 82, calls: 1940 },
] as const

export const callCenterKpi = [
  { k: '전체 콜', v: '7,520', label: '8개월간 인입된 전체 문의 수' },
  { k: '실질 콜', v: '5,679', label: '연결되어 실제 응대 처리된 콜' },
  { k: '평균 통화', v: '2:52', label: '평균 1콜당 통화 시간' },
  { k: '설치 매칭', v: '91%', label: '설치 D+7일내 CS 매칭 비율' },
] as const

export type Partner = {
  name: string
  v: number
  hot?: boolean
  reAlloc?: string
}

export const partners: Partner[] = [
  { name: 'H 정보통신', v: 180, hot: true, reAlloc: '+5%' },
  { name: 'A 텍', v: 179, hot: true, reAlloc: '+3%' },
  { name: 'F 카드넷', v: 130, hot: true, reAlloc: '+2%' },
  { name: 'J 솔루션', v: 94 },
  { name: 'N 푸른', v: 65 },
  { name: 'S 넷', v: 56 },
  { name: 'J 포스', v: 47 },
  { name: 'W 페이먼트', v: 44 },
  { name: 'KJ 정보통신', v: 44 },
  { name: 'IT 빌리지', v: 37 },
  { name: 'T 정보통신', v: 33 },
  { name: 'Y 정보통신', v: 27 },
]

export const operatingHub = {
  center: { title: '비버 운영 허브', sub: '전개 일정 · 이슈 조율 · 기준 배포' },
  spokes: [
    { title: '설치팀 · 협력사', sub: 'POS · KIOSK 설치 · 현장 테스트' },
    { title: '원격 검수 전담', sub: '결제 · 출력 · 동기화 영업 전 확인' },
    { title: '콜센터 확대', sub: '문의 인입 분산 · D+1~3 집중' },
    { title: '주간 정례회의', sub: 'DSI · 더본 IT · 비버 반복 이슈 개선' },
    { title: '백오피스 전담', sub: '매장정보 · 정책 · 연동값 사전 입력' },
    { title: 'DSI 1차 접수', sub: '매장 문의 1차 · 장애성 이슈 분류' },
  ],
} as const

export const principles = [
  { no: '01', t: '표준화', d: '설치 가이드 · 점주 사용 가이드 · 체크리스트' },
  { no: '02', t: '지원조직화', d: '백오피스 2명 · 원격검수 3명 · 핫라인 선임 1명' },
  { no: '03', t: '사전분류', d: 'H/W 노후 · 네트워크 불안정 · 강성 민원 점포' },
  { no: '04', t: '데이터화', d: 'Forms 수집 · 실시간 대시보드 · 특이사항 기록' },
  { no: '05', t: '자동화', d: 'Google Chat 웹훅 · 일정 알림 · 미보고 추적' },
  { no: '06', t: '정책화', d: 'SSD 교체 · 공유기 교체 · POS 보상판매' },
  { no: '07', t: '정기관리', d: '내부 + 발주처 주 1회 정기회의' },
] as const

export const fieldComplexity = [
  { no: '01', t: '백오피스 설정', d: '설정 복잡도 높음 · 설정 누락 · 검수 편차' },
  { no: '02', t: '협력사 숙련도', d: '프로그램 미숙련 · 현장 대응 품질 편차' },
  { no: '03', t: '점주 교육 부족', d: '설치 후 반복 문의 · CS 콜 집중' },
  { no: '04', t: 'H/W 노후화', d: '저장용량 · OS · 디스크 문제 · 설치 불가 ~200개소' },
  { no: '05', t: '네트워크 불안정', d: '결제 · 멤버십 오류 오인 · 불필요 CS 유입' },
  { no: '06', t: '강성 민원 점포', d: '일반 설치자 단독 대응 한계 · 핫라인 선임 필요' },
] as const

export const hardwareIssues = [
  { issue: '디스크 노후화', prep: '디스크 상태 사전 점검', action: '리커버리 및 포맷', biz: '유지보수 대응 체계' },
  { issue: '저장용량 부족', prep: '사전 H/W 조사', action: 'SSD 교체', biz: '장비 상태 데이터 확보' },
  { issue: '공유기 노후', prep: '네트워크 사전 점검', action: '공유기 교체', biz: '네트워크 장비 대응' },
  { issue: '노후 POS', prep: '보상판매 정책 수립', action: 'POS 교체', biz: 'POS 판매 기회' },
  { issue: '설치 불가 ~200개소', prep: '후순위 분리 관리', action: '업그레이드 / 보상판매', biz: '교체 대상 관리' },
] as const

export const formsFlow = [
  { no: '01', t: 'Forms 제출', sub: '현장 설치 직후' },
  { no: '02', t: '설치완료', sub: '상태 전환' },
  { no: '03', t: 'SSD · 공유기', sub: '사용 기록' },
  { no: '04', t: '특이사항 · 민원', sub: '수집' },
  { no: '05', t: '미완료 사유', sub: '추적' },
  { no: '06', t: '대시보드', sub: '반영' },
  { no: '07', t: '발주처', sub: '실시간 공유' },
] as const

export const formsUsage = [
  { t: '설치완료', d: '진행률 실시간 관리' },
  { t: 'SSD · 공유기', d: '재고 · 교체 이력 추적' },
  { t: '특이사항', d: '재방문 · 민원 이력 관리' },
  { t: '미완료 사유', d: '일정 재조정 근거' },
  { t: '협력사별 실적', d: '수행률 비교 관리' },
  { t: '센터별 실적', d: '내부센터 관리' },
  { t: '발주처 공유', d: '포캐스팅 대비 실행률' },
] as const

export const vcatFlow = [
  { no: '01', t: '결제 문의 반복 발생' },
  { no: '02', t: '설정값 영향 원인 분석' },
  { no: '03', t: '스마트로 협의 · 설정값 검토' },
  { no: '04', t: '비버 기준 VCAT 설정값 확정' },
  { no: '05', t: '설치자 · 고객센터 가이드 배포' },
  { no: '06', t: '현장 적용 → 결제 안정화' },
] as const

export const collaborationInternal = [
  { t: 'CX', d: '콜 · FAQ · 응대율 관리' },
  { t: '계약운영', d: '일정 · 발주 · 협력사 관리' },
  { t: '개발', d: '프로그램 오류 · 기능 개선' },
  { t: '영업', d: '발주처 · 점포 조율' },
] as const

export const collaborationExternal = [
  { t: '더본코리아 IT팀', d: '전체 일정 · 정책 판단 · 점포 이슈 · 전개 현황', isClient: true },
  { t: 'DSI (VAN 대리점)', d: 'VAN · 결제 · 점포 DB · 현장 설정 · 대리점 이슈', isClient: false },
  { t: '스마트로', d: 'VCAT 설정값 · 결제 안정화 · 설정 가이드 검증', isClient: false },
] as const

export const meetingAgenda = [
  '전개 현황',
  'CS',
  '기술 이슈',
  'VAN / VCAT',
  '협력사 수행',
  '다음 주 포캐스팅',
] as const

export const centerComparison = [
  { metric: '비중', internal: 41.5, external: 58.5, unit: '%' },
  { metric: '일평균', internal: 8, external: 19, unit: '건' },
  { metric: '최대', internal: 25, external: 44, unit: '건' },
  { metric: '정시율', internal: 92.4, external: 93.9, unit: '%' },
] as const

export const centerKpi = [
  { k: '내부 6개소', v: '41.5%', sub: '689건 · 정시율 92.4%' },
  { k: '외부 14개소', v: '58.5%', sub: '972건 · 정시율 93.9%' },
  { k: '내부 콜발생률', v: '2.92', sub: '외부 2.65' },
  { k: '내부 7일내 콜률', v: '1.50', sub: '외부 1.68' },
] as const

export const supportStructure = [
  { count: '2명', role: '백오피스 전담', detail: '복잡한 설정 검수 · 누락 방지 · 일괄 처리' },
  { count: '3명', role: '원격 지원 · 검수', detail: '현장 오류 원격 지원 · 설치 완료 검수' },
  { count: '1명', role: '핫라인 선임', detail: '강성 민원 점포 전담 · 발주처 연계 대응' },
] as const

export const supportFlow = [
  '백오피스 확인',
  '현장 설치',
  '원격 지원 · 검수',
  'Forms 완료',
  '핫라인 대응',
] as const

export const revenueModel = [
  { t: '프로그램 사용료', d: '브랜드 전체 전환 시 반복 수익 발생' },
  { t: 'H/W 판매', d: 'POS · 키오스크 · 주변장비 교체 수요 확보' },
  { t: '유지보수', d: '현장 AS · 원격 지원 수수료' },
  { t: '고객센터 위탁', d: '콜센터 운영 위탁 수익화 가능' },
] as const

export const businessExpansion = [
  { no: '01', t: '프로그램 전환 완료' },
  { no: '02', t: '발주처 신뢰 확보' },
  { no: '03', t: '고객센터 위탁 진행' },
  { no: '04', t: 'H/W AS · 장비 교체' },
  { no: '05', t: '비버웍스 H/W 전환' },
  { no: '06', t: '후속 브랜드 프로그램 전환 & 통합앱 운영' },
] as const

export const assets = [
  { t: '설치 · 점주 가이드', d: '후속 브랜드 전개 기준' },
  { t: 'TF 지원조직 모델', d: '대량 전개 품질 관리 구조' },
  { t: '고객센터 운영 경험', d: '콜센터 위탁 운영 기반' },
  { t: 'H/W 대응 프로세스', d: 'POS · 공유기 · SSD 판매 및 AS 기반' },
  { t: 'Forms 대시보드', d: '전개 · 유지보수 관리 데이터' },
  { t: 'VCAT 설정 표준화', d: '결제 안정화 운영 기준' },
  { t: '정기회의 구조', d: '발주처 · 내부 · 협력사 통합 관리' },
] as const

export type BrandTone = 'yellow' | 'navy' | 'red' | 'redDeep' | 'green' | 'orange' | 'cream' | 'gray' | 'paiks'

export type ExpansionBrand = {
  initial: string
  name: string
  eng: string
  stores: string
  cat: string
  tone: BrandTone
  imgSrc?: string
}

export const expansionBrands: ExpansionBrand[] = [
  { initial: "P'C", name: '빽다방', eng: "PAIK'S COFFEE", stores: '1,870', cat: 'CAFE', tone: 'paiks' },
  { initial: 'PB', name: '빽보이피자', eng: 'PAIK BOY PIZZA', stores: '250+', cat: 'PIZZA', tone: 'red', imgSrc: '/brands/paikboy.png' },
  { initial: 'YJ', name: '역전우동', eng: 'YEOKJEON UDON', stores: '180+', cat: 'UDON', tone: 'navy', imgSrc: '/brands/yeokjeon-udon.png' },
  { initial: 'HK', name: '홍콩반점 0410', eng: 'HONGKONG BANJUM 0410', stores: '320+', cat: 'CHINESE', tone: 'red', imgSrc: '/brands/hongkong-banjum.png' },
  { initial: 'RP', name: '롤링파스타', eng: 'ROLLING PASTA', stores: '160+', cat: 'PASTA', tone: 'navy' },
  { initial: 'HP', name: '한신포차', eng: 'HANSHIN POCHA', stores: '210+', cat: 'PUB', tone: 'red', imgSrc: '/brands/hanshin-pocha.png' },
  { initial: 'PB', name: "PAIK'S BEER", eng: "PAIK'S BEER", stores: '40+', cat: 'BEER', tone: 'navy' },
  { initial: 'SM', name: '새마을식당', eng: 'SAEMAUL SIKDANG', stores: '380+', cat: 'BBQ', tone: 'red', imgSrc: '/brands/saemaul.png' },
  { initial: 'JS', name: '제순식당', eng: 'JESOON SIKDANG', stores: '60+', cat: 'KOREAN', tone: 'cream' },
  { initial: 'LC', name: '리춘시장', eng: 'LICHUN MARKET', stores: '40+', cat: 'KOREAN', tone: 'red' },
  { initial: 'GW', name: '고투웤', eng: 'GO TO WOK', stores: '50+', cat: 'WORK MEAL', tone: 'red' },
  { initial: 'HB', name: '홍콩분식', eng: 'HONGKONG BUNSIK', stores: '80+', cat: 'STREET', tone: 'redDeep' },
  { initial: 'SS', name: '백종원의 쌈밥집', eng: "PAIK'S SSAMBAB", stores: '30+', cat: 'KOREAN', tone: 'cream' },
  { initial: 'BG', name: '본가', eng: 'BONGA', stores: '120+', cat: 'BBQ', tone: 'navy' },
  { initial: 'IS', name: '인생설렁탕', eng: 'INSAENG SEOLLEONGTANG', stores: '60+', cat: 'SOUP', tone: 'red' },
  { initial: 'MO', name: '막이오름', eng: 'MAKIEAOREUM', stores: '20+', cat: 'KOREAN', tone: 'cream' },
  { initial: 'YD', name: '연돈볼카츠', eng: 'YEONDON BOLKATSU', stores: '40+', cat: 'PORK CUTLET', tone: 'red' },
  { initial: 'DB', name: '돌배기집', eng: 'DOLBAEGI', stores: '30+', cat: 'BBQ', tone: 'red' },
  { initial: 'MJ', name: '미정국수 0410', eng: 'MIJEONG GUKSU 0410', stores: '70+', cat: 'NOODLE', tone: 'cream' },
  { initial: 'SK', name: '성성식당', eng: 'SUNGSUNG SIKDANG', stores: '20+', cat: 'KOREAN', tone: 'red' },
]

export const verifiedModel = [
  '가이드',
  'TF 지원조직',
  'Forms',
  'CS 운영',
  'H/W 대응',
  'VCAT',
  '정기회의',
] as const

export const closingLine = '1,870 stores. On Beaverworks.'
export const closingTagline =
  '프로그램 교체 성공을 통해 — 비버웍스가 단순 프로그램 공급을 넘어 외식 프랜차이즈 IT 운영 사업으로 확장할 수 있음을 증명한 사례'
