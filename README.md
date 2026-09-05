# South America · Vision Thru the Bible

Nuxt 홈페이지와 Firestore 기반 운영툴입니다.

## 로컬 실행

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 3000
```

- 홈페이지: `http://127.0.0.1:3000/`
- 운영툴: `http://127.0.0.1:3000/admin`
- Firebase가 설정되지 않아도 홈페이지는 기본 이미지와 문구로 열립니다. 운영툴은 연결 전까지 로그인을 허용하지 않습니다.

## 운영툴

사이드바에서 **메인 비주얼**과 **선교사 소개**를 선택합니다. 사진 업로드, 한국어/영어/스페인어/포르투갈어 문구, 미리보기를 지원합니다. 메인 비주얼은 16:9, 소개 사진은 3:4로 표시하며, 메인 문구는 좌측/중앙/우측 정렬을 선택할 수 있습니다.

사진은 JPG/PNG/WebP, 최대 4MB까지 업로드할 수 있습니다. 서버에서 실제 이미지인지 확인하고 메타데이터를 제거한 WebP로 변환합니다. 사진을 올린 후 **변경사항 저장**을 눌러야 홈페이지에 반영됩니다. 동시에 다른 창에서 저장하면 덮어쓰지 않고 최신 내용을 다시 불러오도록 안내합니다.

## 최근 소식지

사이드바 **최근 소식지**(`/admin/newsletters`)에서 작성·수정·공개·숨김·삭제를 관리하고, **국가 관리**(`/admin/countries`)에서 국가 옵션을 추가합니다. 삭제는 휴지통 이동이며 숨김 상태로 복원할 수 있습니다.

작성 화면은 제목·요약·서식 있는 본문, 4개 언어, 썸네일, PDF 첨부를 지원합니다. 한국어 제목은 필수이고 공개할 때 본문도 필요합니다. 비어 있는 번역은 한국어로 표시합니다. 공개한 글만 홈페이지 최근 소식지와 `/newsletter`에 나타납니다. 게시글 주소는 `/newsletter/{id}`입니다. 예전 `/newsletter/write` 주소는 관리자 작성 화면으로 이동합니다. 기존 브라우저 localStorage의 글이나 하드코딩된 예시 글은 실제 게시물로 자동 이전하지 않습니다.

PDF는 한 글당 1개, 최대 500MiB입니다. 진행률과 일시정지·이어 올리기를 지원합니다. 먼저 제목을 입력하고 파일을 선택하세요. PDF 업로드 완료 후 **공개 저장** 또는 **숨김 저장**해야 첨부가 확정됩니다. 숨김·삭제하면 게시글 및 PDF 다운로드 주소도 차단됩니다. PDF 교체·휴지통 이동 시 원본 파일은 보존합니다.

**개인 Google Drive 저장은 가능하며 서버 어댑터를 구현했습니다. 실제 계정 연결과 실파일 검증은 아직 필요합니다.** OAuth 소유자 계정, 전용 비공개 폴더, Vercel 설정과 제한은 [Google Drive PDF 연결 문서](docs/google-drive-pdfs.md)에 정리했습니다. Drive 설정 없이도 글은 저장할 수 있습니다. 에뮬레이터에서 PDF는 테스트용 로컬 디렉터리에 저장됩니다.

## 문의 메일

홈페이지 문의 폼은 서버 SMTP를 통해 `visionthruthebible@gmail.com`으로 전송합니다. 문의자의 이메일은 답장 주소로 설정되며, 이름·이메일·문의 유형·문의 내용을 메일 본문에 포함합니다. 입력 길이와 형식을 서버에서 다시 검사하고 IP별로 15분에 5회까지 접수합니다.

로컬 `.env`와 Vercel 서버 환경변수에 `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`를 설정해야 합니다. Gmail을 발신 계정으로 사용하면 일반 계정 비밀번호 대신 앱 비밀번호를 사용하세요. 발신 계정 정보는 클라이언트 코드나 Git에 넣지 않습니다.

## Firebase 서버 연결

실제 프로젝트 ID는 `southamerica-b7adf`입니다. Firestore의 `(default)` 데이터베이스와 Firebase Storage 버킷이 필요합니다. 데이터베이스/버킷의 저장 지역은 생성 전에 결정해야 합니다.

`.env.example`의 값을 `.env`에 추가합니다. 기존 SMTP 설정 등은 유지하세요. 다음 중 한 가지 인증 방법을 사용합니다.

- 로컬: `GOOGLE_APPLICATION_CREDENTIALS`에 Git에서 제외된 서비스 계정 JSON 파일의 절대 경로 지정
- 서버: `FIREBASE_CLIENT_EMAIL`과 `FIREBASE_PRIVATE_KEY` 또는 `FIREBASE_SERVICE_ACCOUNT_KEY` 설정

두 환경 모두 `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`이 필요합니다. 비밀키는 `NUXT_PUBLIC_` 변수나 클라이언트 코드에 넣지 마세요. `.secrets/`, `.env`, 서비스 계정 파일은 Git에서 제외됩니다.

Vercel의 `south-america` 프로젝트에도 서버용 변수를 등록한 뒤 다시 배포해야 적용됩니다. `ADMIN_ORIGIN`을 설정한다면 접속할 사이트의 정확한 origin(프로토콜과 도메인, 끝 슬래시 없음)을 사용합니다. Preview와 Production 도메인이 다르면 환경별로 구분하세요.

```sh
firebase deploy --only firestore:rules,storage --project southamerica-b7adf
```

기본 규칙은 Firestore와 Storage에 대한 클라이언트 직접 접근을 모두 차단합니다. 홈페이지는 검증된 공개 콘텐츠 API만 사용하고, 로그인/저장/업로드는 서버의 Firebase Admin SDK를 통해 처리합니다. 서비스 계정에는 이 작업에 필요한 Firestore 데이터와 해당 Storage 버킷 권한만 부여하는 것을 권장합니다.

## 마스터 계정 생성

연결 설정 후 일회용 환경변수로 계정을 만듭니다. 비밀번호를 명령 이력이나 소스에 기록하지 않도록 입력받습니다.

```sh
read -s 'ADMIN_BOOTSTRAP_PASSWORD?초기 비밀번호: '
export ADMIN_BOOTSTRAP_PASSWORD
ADMIN_BOOTSTRAP_USERNAME=admin01 npm run admin:seed
unset ADMIN_BOOTSTRAP_PASSWORD
```

위 입력 명령은 macOS 기본 zsh 기준입니다. 스크립트는 `adminAccounts/admin01` 문서와 초기 `siteContent/home`을 생성합니다. 기존 계정의 비밀번호나 기존 콘텐츠는 덮어쓰지 않습니다. 비밀번호는 salt가 있는 scrypt 해시로만 저장합니다. 초기 비밀번호는 임시 사용 후 교체해야 하며, 현재 화면에는 계정/비밀번호 관리 기능이 포함되어 있지 않습니다.

세션은 8시간 동안 유효한 HttpOnly/SameSite 쿠키를 사용합니다. 서버에는 세션 토큰의 해시만 저장하며 운영 HTTPS 환경에서는 Secure 쿠키를 사용합니다. 계정의 `active`를 false로 변경하거나 `sessionVersion`을 증가시키면 기존 세션을 차단할 수 있습니다. 로그인 시도는 아이디와 IP별로 15분당 10회 제한됩니다.

만료 세션과 로그인 제한 문서의 자동 정리를 원한다면 Firestore에서 `adminSessions.expiresAt`, `adminLoginLimits.resetAt` 필드에 TTL을 설정하세요. TTL 삭제 시점과 무관하게 서버에서 만료 여부를 검사합니다. 저장하지 않은 업로드와 교체된 사진은 자동 삭제하지 않으므로, 운영 중 Storage 사용량을 점검해주세요.

## 검증

```sh
npm test
npm run build
```

통합 테스트는 실제 프로젝트에서 실행되지 않도록 `demo-` 프로젝트와 로컬 에뮬레이터만 허용합니다. Java 21 이상과 Firebase CLI가 필요합니다.

```sh
firebase emulators:start --only firestore,storage --project demo-south-america
```

별도 터미널에서 서버와 테스트를 같은 환경으로 실행합니다.

```sh
export FIREBASE_PROJECT_ID=demo-south-america
export FIREBASE_STORAGE_BUCKET=demo-south-america.firebasestorage.app
export FIRESTORE_EMULATOR_HOST=127.0.0.1:8080
export FIREBASE_STORAGE_EMULATOR_HOST=127.0.0.1:9199
npm run build
HOST=127.0.0.1 PORT=3100 node .output/server/index.mjs
# 같은 환경을 적용한 별도 터미널
TEST_BASE_URL=http://127.0.0.1:3100 npm test
```

테스트에서는 권한 없는 요청, 비밀번호 검증, CSRF, 세션 만료/취소, 저장 충돌, 공개 콘텐츠 반영, 이미지 검증/업로드, 국가 추가, HTML 정제, 소식지 상태 전환, 6MiB 이상 PDF 분할 전송·재개·다운로드 해시 일치·부분 다운로드를 확인합니다. 운영툴에서 에뮬레이터 연결 여부를 표시하며, 테스트 데이터는 실제 Firebase에 저장되지 않습니다. 외부 서비스가 없는 `npm test`에서는 에뮬레이터 통합 테스트를 건너뜁니다.

2026-08-31 의존성 감사에서 호환되는 업데이트를 적용한 후 critical은 0건, high 1건과 moderate 6건이 남았습니다. 기존 Nodemailer의 major 업그레이드 및 Firebase Admin SDK의 하위 의존성 정리가 필요합니다. 자동 제안된 Firebase Admin 구버전 다운그레이드는 적용하지 않았습니다. 이번 검증은 실제 Firebase/Google Drive 인증 또는 운영 배포 성공을 의미하지 않습니다.
