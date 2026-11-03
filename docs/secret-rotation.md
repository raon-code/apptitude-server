# 비밀정보 교체 체크리스트

과거 커밋에 아래 값이 평문으로 포함되어 있었다. 저장소 히스토리는 재작성하지 않았으므로, 노출된 값은 **교체로만 무력화**할 수 있다.

## 완료

- `JWT_SECRET`: 새 값으로 교체. 기존 액세스/리프레시 토큰은 모두 무효.
- `CRYPTO_SEED_KEY`: 새 값으로 교체. 서버에서 복호화를 사용하지 않아 기존 데이터 영향 없음.
- `KAKAO_REST_API_KEY`: 코드에서 제거하고 환경변수로 전환.

## 남은 작업 (접근 권한 필요)

1. 카카오 개발자 콘솔에서 기존 REST API 키 폐기 후 새 키 발급 → 배포 환경변수 `KAKAO_REST_API_KEY` 갱신.
2. MySQL `apptitude` 사용자 비밀번호 교체:
   - development/production 각각 새 비밀번호 설정
   - 배포 환경변수 `DB_PASSWORD` 갱신
3. 배포 환경(systemd `EnvironmentFile` 등)에 새 값 주입 후 재기동.
4. 교체 후 `git grep`으로 저장소 내 잔존 값이 없는지 확인.

## 하지 않은 것

- git 히스토리 재작성(`filter-repo` 등): force-push로 모든 클론이 깨지고 GitHub 캐시/포크에 잔존해 신뢰할 수 없음.
- 저장소에 남은 과거 값은 이미 공개된 것으로 간주한다.
