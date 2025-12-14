#!/bin/bash

# Amazon Linux 2023 초기 설정 스크립트
# EC2 SSH 연결 후 실행: chmod +x amazon-linux-2023-setup.sh && ./amazon-linux-2023-setup.sh

set -e

echo "🔧 Amazon Linux 2023 초기 설정을 시작합니다..."
echo ""

# 시스템 업데이트
echo "📦 시스템을 업데이트합니다..."
sudo dnf update -y

# Node.js 설치 (Node.js 20 LTS)
echo "📦 Node.js를 설치합니다..."
# Amazon Linux 2023는 dnf를 사용합니다 (yum이 아니라)
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# Node.js 버전 확인
echo ""
echo "✅ Node.js 버전 확인:"
node -v
npm -v

# Yarn 설치
echo ""
echo "📦 Yarn을 설치합니다..."
sudo npm install -g yarn
echo "✅ Yarn 버전: $(yarn -v)"

# PM2 설치 (프로세스 관리자)
echo ""
echo "📦 PM2를 설치합니다..."
sudo npm install -g pm2
echo "✅ PM2 버전: $(pm2 -v)"

# Git 설치 확인 및 설치
if ! command -v git &> /dev/null; then
    echo ""
    echo "📦 Git을 설치합니다..."
    sudo dnf install -y git
fi

# 방화벽 설정 확인
echo ""
echo "🔥 방화벽 설정을 확인합니다..."
echo "⚠️  AWS Security Group에서 포트 3000을 열어야 합니다!"
echo "   - EC2 콘솔 → Security Groups → 인바운드 규칙 → 포트 3000 추가"

# 포트 확인 (firewalld가 설치되어 있는지 확인)
if command -v firewall-cmd &> /dev/null; then
    echo "📋 firewalld가 설치되어 있습니다."
    echo "   포트를 열려면: sudo firewall-cmd --permanent --add-port=3000/tcp && sudo firewall-cmd --reload"
else
    echo "📋 firewalld가 설치되어 있지 않습니다."
    echo "   Amazon Linux 2023는 기본적으로 Security Group으로 방화벽을 관리합니다."
fi

echo ""
echo "✅ 초기 설정이 완료되었습니다!"
echo ""
echo "다음 단계:"
echo "1. 코드를 업로드하세요 (Git 클론 또는 SCP)"
echo "2. cd ~/projects/innocean-ai-frontend  (또는 프로젝트 디렉토리)"
echo "3. ./deploy.sh 실행"
echo ""
echo "📌 유용한 정보:"
echo "   - Node.js: $(node -v)"
echo "   - npm: $(npm -v)"
echo "   - Yarn: $(yarn -v)"
echo "   - PM2: $(pm2 -v)"
