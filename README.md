# 앱티튜드(Apptitude) 서버

Express + Sequelize 기반 API 서버. 로컬은 SQLite, development/production은 MySQL을 사용한다.

## 요구 사항

- Node.js 22 이상
- npm

## 설치

```bash
npm install
cp .env.example .env
```

`.env`의 필수 값을 채운다. `.env`는 커밋하지 않는다(추적 제외).

## 실행

```bash
npm start        # local (SQLite)
npm run start:dev  # development (MySQL)
npm run start:prod # production (MySQL)
```

서버는 `--env-file-if-exists=.env`로 환경변수를 읽는다. 필수 환경변수가 없으면 부팅 즉시 실패한다.

- API 문서: `http://localhost:3001/api-docs`
- 기본 포트: 3001

## 환경변수

| 이름 | 필수 환경 | 설명 |
| --- | --- | --- |
| `JWT_SECRET` | 전체 | JWT 서명 키 (16자 이상) |
| `CRYPTO_SEED_KEY` | 전체 | 초대 링크 암호화 키 (16자 이상) |
| `KAKAO_REST_API_KEY` | 전체 | 카카오 로그인 REST API 키 |
| `DB_HOST` | development, production | MySQL 호스트 |
| `DB_PORT` | 선택 | MySQL 포트 (기본 3306) |
| `DB_NAME` | development, production | 데이터베이스 이름 |
| `DB_USER` | development, production | 데이터베이스 사용자 |
| `DB_PASSWORD` | development, production | 데이터베이스 비밀번호 |

운영 배포에서는 저장소 밖에서 주입한다(systemd 예시).

```ini
[Service]
EnvironmentFile=/opt/apptitude/.env
ExecStart=/usr/bin/node --env-file-if-exists=/opt/apptitude/.env server.js
```

## 테스트

```bash
npm test     # Jest + supertest (SQLite)
npm run lint # ESLint
```

테스트는 `tests/setup.js`에서 결정적 환경값을 주입하고, `tests/characterization`이 모든 마운트 엔드포인트의 응답 기준선을 고정한다.

## 디렉토리

```
routes/        라우터 + 컨트롤러(HTTP 계층)
services/      비즈니스 로직 + 영속화
models/        Sequelize 모델
types/dto/     요청 DTO + Joi 검증
middleware/    인증, 예외, 트랜잭션, CORS, rate limit
config/        환경변수 검증, 로거, Swagger
docs/swagger/  OpenAPI YAML
docs/agents/   에이전트 워크플로 설정
```

## 보안

- 비밀값은 환경변수로만 주입한다. 코드/저장소에 하드코딩하지 않는다.
- 과거 커밋에 노출된 값은 폐기 대상이다. 교체 절차는 `docs/secret-rotation.md` 참고.
