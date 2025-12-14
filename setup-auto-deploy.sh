#!/bin/bash

# EC2에서 자동 배포 설정 스크립트
# EC2 SSH 연결 후 실행

set -e

PROJECT_DIR="$HOME/innocean-ai-frontend"
BRANCH="dev"  # 배포할 브랜치명

echo "🚀 자동 배포를 설정합니다..."
echo ""

# 프로젝트 디렉토리로 이동
cd "$PROJECT_DIR"

# 자동 배포 스크립트 생성
cat > "$HOME/auto-deploy.sh" << 'EOF'
#!/bin/bash
set -e

PROJECT_DIR="$HOME/innocean-ai-frontend"
BRANCH="dev"

echo "🔄 자동 배포 체크 시작: $(date)"

cd "$PROJECT_DIR"

# 원격 저장소에서 최신 정보 가져오기
git fetch origin

# 현재 브랜치와 원격 브랜치 비교
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/$BRANCH)

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "📥 새로운 변경사항 발견! 배포를 시작합니다..."
    git pull origin $BRANCH
    cd "$PROJECT_DIR"
    chmod +x deploy.sh
    ./deploy.sh
    echo "✅ 배포 완료: $(date)"
else
    echo "✓ 최신 상태입니다. 배포할 변경사항이 없습니다."
fi
EOF

chmod +x "$HOME/auto-deploy.sh"

echo "✅ 자동 배포 스크립트 생성 완료: $HOME/auto-deploy.sh"
echo ""

# Crontab에 추가
echo "📅 Crontab에 자동 배포 작업 추가 중..."
(crontab -l 2>/dev/null | grep -v "auto-deploy.sh"; echo "*/5 * * * * $HOME/auto-deploy.sh >> $HOME/auto-deploy.log 2>&1") | crontab -

echo "✅ 자동 배포 설정 완료!"
echo ""
echo "설정 내용:"
echo "  - 5분마다 자동으로 Git 체크"
echo "  - 변경사항이 있으면 자동 배포"
echo "  - 로그 파일: $HOME/auto-deploy.log"
echo ""
echo "수동 실행: $HOME/auto-deploy.sh"
echo "로그 확인: tail -f $HOME/auto-deploy.log"
echo "Crontab 확인: crontab -l"
