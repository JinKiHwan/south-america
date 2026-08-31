# 소식지 PDF와 Google Drive

검토일: 2026-08-31. **개인 Google Drive의 여유 공간에 PDF를 저장하는 방식은 가능합니다.** Firebase 서비스 계정만으로 개인 Drive의 저장 용량을 사용하는 방식은 적합하지 않습니다. 용량을 가진 Google 계정의 OAuth 동의와 서버용 갱신 토큰이 필요합니다.

## 현재 구현

- 글·국가·첨부 메타데이터: Firestore. 썸네일: Firebase Storage.
- PDF: 연결한 Google 계정의 비공개 전용 Drive 폴더. 공유 권한을 추가하지 않습니다.
- 한 글에 PDF 1개, 최대 500MiB. 브라우저가 파일 전체를 메모리에 올리지 않고 작은 조각의 해시로 동일 파일을 확인합니다.
- 관리자 인증 후 3MiB씩 서버를 거쳐 Drive resumable upload에 전송합니다. 진행률, 일시정지, 동일 파일 재선택 후 이어 올리기를 지원합니다. 각 요청이 Vercel의 4.5MB 요청 제한보다 작습니다.
- Google 토큰과 업로드 세션 URL은 서버에만 있습니다. 브라우저에는 자체 업로드 ID와 진행 상태만 반환합니다.
- 방문자가 다운로드할 때 서버가 글의 공개 상태를 확인하고 비공개 Drive 파일을 스트리밍합니다. `Range` 요청도 지원합니다. 숨김·삭제한 글은 같은 다운로드 URL로 다시 요청해도 404를 반환합니다. 이미 완료된 다운로드를 회수하거나 이미 시작된 전송을 중단하는 기능은 아닙니다.
- 삭제는 휴지통 이동입니다. 복원할 수 있으며 Drive 원본도 보존합니다. 교체·미첨부 PDF와 업로드 기록은 자동 삭제하지 않습니다.

**실제 Drive 업로드는 아직 검증하지 않았습니다.** 로컬 에뮬레이터에서는 `.data/newsletter-pdfs`에 저장하며 화면에 테스트 모드라고 표시합니다. 운영 환경에서 Drive 설정이 없으면 PDF 업로드만 비활성화되고 글 작성은 가능합니다.

## 실제 계정 연결에 필요한 설정

1. 소유자 Google 계정으로 사용할 Google Cloud 프로젝트에서 Drive API를 활성화합니다.
2. OAuth 동의 화면과 OAuth 클라이언트를 구성합니다. 범위는 `https://www.googleapis.com/auth/drive.file`로 제한합니다. 모든 개인 파일을 읽는 `drive` 범위는 필요하지 않습니다.
3. 그 클라이언트로 소유자가 동의하고 `access_type=offline`을 요청해 refresh token을 발급받습니다. 실제 연결 작업에서는 state 검증과 등록된 redirect URI를 사용해야 합니다. 현재 운영툴에 OAuth 연결 버튼이나 콜백은 구현되어 있지 않습니다.
4. 같은 OAuth 앱의 인증으로 전용 비공개 폴더를 생성합니다. `drive.file`은 앱이 생성하거나 사용자가 앱에 허용한 파일만 접근하므로, 임의의 기존 폴더 ID만 넣으면 실패할 수 있습니다. Google Picker로 기존 폴더 접근을 허용하는 방법도 있지만 현재 구현 범위에는 포함하지 않았습니다.
5. 로컬 `.env` 및 Vercel 서버 환경변수에 아래 네 값을 등록하고 서버를 재시작/재배포합니다. 채팅, Git, 클라이언트 코드에 토큰을 넣지 않습니다.

```dotenv
GOOGLE_DRIVE_CLIENT_ID=
GOOGLE_DRIVE_CLIENT_SECRET=
GOOGLE_DRIVE_REFRESH_TOKEN=
GOOGLE_DRIVE_PDF_FOLDER_ID=
```

개인 Google 계정용 External OAuth 앱이 Testing 상태이면 Drive 범위의 refresh token은 일반적으로 7일 후 만료됩니다. 장기 운영 전 게시 상태와 계정 유형에 맞는 Google 요구 사항을 확인해야 합니다. Production 상태여도 사용자가 권한을 취소하거나 Google 정책에 의해 토큰이 만료되면 재연결이 필요합니다.

Firebase 서버 인증은 위 OAuth와 별개입니다. Firestore/Storage 및 관리자 계정 설정도 먼저 완료되어야 합니다. `configured: true`는 환경변수 존재 여부이며 연결 상태를 실제로 검사한 결과는 아닙니다.

## 운영 전 확인할 사항

- 5TB는 저장 공간입니다. 무제한 다운로드·API 요청·대역폭을 보장하지 않습니다. Drive 사용 한도와 Vercel 전송량/함수 사용료를 함께 확인해야 합니다.
- Nitro의 Vercel 어댑터는 스트리밍 응답을 지원합니다. Vercel 함수 실행 시간은 300초로 설정했습니다. 배포 플랜에서 이를 허용하는지 확인하세요. Drive 다운로드 요청 자체는 280초 후 중단됩니다. 느린 연결의 대용량 다운로드는 시간 제한에 걸릴 수 있으므로 실제 배포 환경에서 100MB와 500MB 파일로 전송·중단·재개를 검증해야 합니다.
- 업로드 세션의 유효 기간은 Google 기준 1주일이며 앱은 6일로 제한합니다. 완료된 첨부에는 이 만료 제한을 적용하지 않습니다. `newsletterUploads` 전체에 만료 TTL을 설정하면 정상 첨부의 다운로드가 깨질 수 있습니다.
- 폴더를 공개 공유하거나 Drive에서 직접 파일을 수정하지 마세요. 다운로드 크기 등은 업로드 당시 메타데이터를 사용합니다.
- PDF는 확장자, 크기, 서명 헤더를 검사하지만 악성코드 검사나 문서 내용 검증은 하지 않습니다. 신뢰할 수 있는 관리자만 업로드하고 공개 전 문서를 확인해야 합니다. 서버는 첨부 다운로드와 `nosniff` 헤더를 사용합니다.
- 공개 소식지 목록은 본문을 제외한 메타데이터를 조회합니다. 게시물이 많아지면 서버 페이지네이션과 검색 인덱스를 추가할 수 있습니다.

## 검증 범위

로컬 통합 테스트는 국가 중복 방지, 권한·CSRF, 저장 충돌, XSS 제거, 6MiB 이상 PDF 분할 전송, 이어 올리기, 전체 파일 해시 일치, 부분 다운로드, 다른 글의 첨부 차용 차단, 공개·숨김·휴지통·복원을 확인합니다. Drive HTTP 어댑터는 모의 응답으로도 검사합니다. 개인 계정 OAuth와 실제 Drive/Vercel 대용량 전송은 연결 후 별도 검증 대상입니다.

## 근거

- [Drive 대용량·재개 업로드](https://developers.google.com/workspace/drive/api/guides/manage-uploads)
- [Drive 최소 권한 범위](https://developers.google.com/workspace/drive/api/guides/api-specific-auth)
- [서비스 계정의 저장 공간 제한](https://developers.google.com/workspace/drive/api/guides/handle-errors#storagequotaexceeded)
- [Drive 다운로드 및 Range](https://developers.google.com/workspace/drive/api/guides/manage-downloads)
- [OAuth refresh token 만료](https://developers.google.com/identity/protocols/oauth2#expiration)
- [Vercel 함수 제한](https://vercel.com/docs/functions/limitations)
