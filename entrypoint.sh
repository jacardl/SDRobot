#!/bin/bash

set -e

# 定义日志颜色和函数
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"; }
error() { echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"; }
warn() { echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"; }

# 定义项目路径
PROJECT_ROOT="/home/devbox/project"
FRONTEND_DIR="$PROJECT_ROOT"
BACKEND_DIR="$PROJECT_ROOT/server"

# 清理缓存和构建文件
clean_project() {
    local dir=$1
    local name=$2
    log "Cleaning $name project..."
    #cd "$dir"
    #rm -rf node_modules dist package-lock.json .vite
    npm cache clean --force
    log "$name project cleaned"
}

# 安装依赖
install_dependencies() {
    local dir=$1
    local name=$2
    log "Installing $name dependencies..."
    cd "$dir"
    npm install
    if [ $? -ne 0 ]; then
        error "$name dependencies installation failed"
        exit 1
    fi
}

# 构建项目
build_project() {
    local dir=$1
    local name=$2
    log "Building $name project..."
    cd "$dir"
    npm run build
    if [ $? -ne 0 ]; then
        error "$name build failed"
        exit 1
    fi
}

# 启动服务
start_service() {
    local dir=$1
    local name=$2
    local command=$3
    cd "$dir"
    log "Starting $name service..."
    npm run $command &
    sleep 5
}

# 主函数
main() {
    log "Starting deployment process..."
    
    # 前端
    log "Processing frontend..."
    clean_project "$FRONTEND_DIR" "Frontend"
    install_dependencies "$FRONTEND_DIR" "Frontend"
    build_project "$FRONTEND_DIR" "Frontend"
    
    # 后端
    log "Processing backend..."
    clean_project "$BACKEND_DIR" "Backend"
    install_dependencies "$BACKEND_DIR" "Backend"
    build_project "$BACKEND_DIR" "Backend"
    
    # 启动服务
    log "Starting services..."
    start_service "$BACKEND_DIR" "Backend" "dev"
    start_service "$FRONTEND_DIR" "Frontend" "dev"
    
    log "All services started successfully!"
    wait
}

# 清理函数
cleanup() {
    log "Shutting down services..."
    pkill -P $$
    exit 0
}

# 注册清理函数
trap cleanup SIGINT SIGTERM

# 检查必要工具
if ! command -v node &> /dev/null; then
    error "Node.js is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    error "npm is not installed"
    exit 1
fi

# 运行主函数
main