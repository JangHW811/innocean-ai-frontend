#!/bin/bash

# 개발 서버 배포 스크립트
# 사용법: chmod +x deploy-dev.sh && ./deploy-dev.sh

set -e

ENV_TYPE="development"
APP_NAME="innocean-ai-frontend-dev"
DEFAULT_PORT=3001
ENV_FILE=".env.development"

echo "🚀 [개발] Next.js 앱 배포를 시작합니다..."

# 현재 디렉토리 확인
if [ ! -f "package.json" ]; then
    echo "❌ package.json 파일을 찾을 수 없습니다. 프로젝트 디렉토리에서 실행해주세요."
    exit 1
fi

# Node.js 버전 확인
if ! command -v node &> /dev/null; then
    echo "❌ Node.js가 설치되어 있지 않습니다."
    echo "Node.js 18 이상을 설치해주세요: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18 이상이 필요합니다. 현재 버전: $(node -v)"
    exit 1
fi

echo "✅ Node.js 버전: $(node -v)"

# Yarn 설치 확인
if ! command -v yarn &> /dev/null; then
    echo "📦 Yarn을 설치합니다..."
    sudo npm install -g yarn
fi

echo "✅ Yarn 버전: $(yarn -v)"

# 환경 변수 파일 확인
echo "🔍 현재 디렉토리: $(pwd)"
echo "🔍 ${ENV_FILE} 파일 존재 여부 확인 중..."

if [ -f ${ENV_FILE} ]; then
    echo "✅ ${ENV_FILE} 파일이 이미 존재합니다."
    echo "📄 파일 내용:"
    cat ${ENV_FILE}
    echo ""
elif [ -f .env ]; then
    echo "⚠️  .env 파일은 존재하지만 ${ENV_FILE} 파일이 없습니다."
    echo "📄 .env 파일 내용:"
    cat .env
    echo ""
    echo "🔧 ${ENV_FILE} 파일을 생성합니다..."
    cat > ${ENV_FILE} << EOF
# 개발 서버 설정
NEXT_PUBLIC_API_URL=http://3.38.141.170:8000
NODE_ENV=development
PORT=${DEFAULT_PORT}
EOF
    echo "✅ ${ENV_FILE} 파일을 생성했습니다."
else
    echo "⚠️  ${ENV_FILE} 파일이 없습니다. 생성합니다..."
    cat > ${ENV_FILE} << EOF
# 개발 서버 설정
NEXT_PUBLIC_API_URL=http://3.38.141.170:8000
NODE_ENV=development
PORT=${DEFAULT_PORT}
EOF
    echo "✅ ${ENV_FILE} 파일을 생성했습니다."
    echo "⚠️  필요시 ${ENV_FILE} 파일을 수정해주세요."
fi

# 의존성 설치
echo "📦 의존성을 설치합니다..."
yarn install --frozen-lockfile

# 이전 빌드 삭제
if [ -d ".next" ]; then
    echo "🗑️  이전 빌드를 삭제합니다..."
    rm -rf .next
fi

# 빌드
echo "🔨 프로젝트를 빌드합니다..."
NODE_OPTIONS=--max-old-space-size=4096 yarn build

echo "✅ 빌드가 완료되었습니다!"

# PM2 설치 확인
if ! command -v pm2 &> /dev/null; then
    echo "📦 PM2를 설치합니다..."
    npm install -g pm2
fi

# PM2로 앱 시작/재시작
echo "🚀 앱을 시작합니다..."
# .env 파일에서 환경변수 로드
if [ -f ${ENV_FILE} ]; then
    export $(grep -v '^#' ${ENV_FILE} | xargs)
fi

if pm2 list | grep -q "${APP_NAME}"; then
    echo "🔄 기존 앱을 재시작합니다..."
    pm2 delete ${APP_NAME} 2>/dev/null || true
fi

echo "✨ 새로 앱을 시작합니다..."
pm2 start npm --name "${APP_NAME}" -- start
pm2 save
pm2 startup 2>/dev/null || echo "⚠️  pm2 startup은 수동으로 실행해주세요: sudo pm2 startup"

echo ""
echo "✅ [개발] 배포가 완료되었습니다!"
echo ""
echo "📊 유용한 명령어:"
echo "  - 상태 확인: pm2 status"
echo "  - 로그 확인: pm2 logs ${APP_NAME}"
echo "  - 재시작: pm2 restart ${APP_NAME}"
echo "  - 중지: pm2 stop ${APP_NAME}"
echo ""
# .env 파일에서 PORT 읽기
PORT=$(grep "^PORT=" ${ENV_FILE} 2>/dev/null | cut -d'=' -f2 || echo "${DEFAULT_PORT}")
echo "🌐 [개발] 앱 접속: http://$(curl -s ifconfig.me || echo 'your-ec2-ip'):${PORT}"


