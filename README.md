# 빽다방 1,870 Rollout — V3 Interactive Whitepaper

다크 네이비 + 네온 옐로 톤의 인터랙티브 포트폴리오 웹사이트.
**Vite + React 19 + TypeScript + Tailwind v4 + GSAP + Lenis + Spline**.

## 빠른 시작

```bash
npm install        # (이미 완료됨)
npm run dev        # 로컬 개발 서버 (http://localhost:5173)
npm run build      # 프로덕션 빌드 (dist/)
npm run preview    # 빌드 결과 미리보기
```

## 환경변수

`.env.example` → `.env.local` 복사 후 값 채우기.

| 변수 | 설명 | 필수 |
|---|---|---|
| `VITE_SPLINE_URL` | Spline 3D scene URL (`https://prod.spline.design/<hash>/scene.splinecode`) | 선택 (없으면 글로우 오브 폴백) |

## Spline 3D 마스코트 후보 (사용자 선택)

| 후보 | URL | 비고 |
|---|---|---|
| GENKUB Greeting Robot | https://community.spline.design/file/8cfb6748-f3dd-44dd-89fb-f46c7ab4186e | 영상 ② Zain 포트폴리오와 가장 유사 |
| Coffee Cup | https://community.spline.design/file/ca3bfcce-8c7f-47d4-bfef-92e201945e81 | 빽다방 정체성 |
| Reactive Orb | https://community.spline.design/file/306ca2a5-d1ab-46ac-a27c-198575c82db0 | 가장 가벼운 폴백 |

선택 후 Spline에서 **Remix → Export → Code → Web** 패널의 URL 복사 → `.env.local`에 넣기.

## 섹션 구조 (PDF 23장 → 풀스크롤)

1. **Hero** — 1,870 임팩트 + 흐르는 마키 + 3D 마스코트 자리 + floating chips
2. **Stats** — 1,870 / 6+13 / 8M / 80%+ 카운터 애니메이션
3. **Timeline** — 4단계 (기준 미흡 → 환경 이슈 → 운영 병목 → 반복 이슈)
4. **Operating Model** — 비버 운영 허브 + 7가지 운영 원칙
5. **Call Center** — 응대율 추이 + 월별 설치 막대 차트
6. **Partners** — 협력사 12개 막대 + 우수 3사 재배분 + 6가지 현장 난이도
7. **Showcase** — 재사용 가능한 7가지 운영 자산
8. **Brand Expansion** — 더본 외식 브랜드 다음 타겟 (1,000개소)
9. **Footer** — `1,870 stores. On Beaverworks.` 클로징

## 배포 (Vercel)

```bash
npm i -g vercel    # 1회만
vercel             # 첫 배포 — Vercel 계정 로그인 안내 따라가기
vercel --prod      # 프로덕션 배포
```

배포 후 URL: `https://baekdabang-rollout-v3-<해시>.vercel.app`

## 카톡 공유 시 안내문 권장

> 카톡 인앱 브라우저는 WebGL 일부 제한이 있어 3D 효과가 줄어들 수 있습니다.
> **외부 브라우저(크롬/사파리)로 열어주세요** — 우측 상단 ⋮ 또는 ⓘ 메뉴.

## 라이선스

- 코드: 비공개
- Spline community 모델: 각 작성자 라이선스 확인 필요
- 빽다방 IP (로고/캐릭터): 더본코리아 사용 승인 별도 필요

---

**Made with: React 19 · Vite 8 · Tailwind v4 · GSAP · Lenis · Spline**
