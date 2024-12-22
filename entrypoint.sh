#!/bin/bash

# 设置错误时退出
set -e

# 定义日志颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 输出带颜色的日志
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# 检查 node 和 npm 是否安装
if ! command -v node &> /dev/null; then
    error "Node.js is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    error "npm is not installed"
    exit 1
fi

# 定义项目路径
PROJECT_ROOT="/home/devbox/project"
FRONTEND_DIR="$PROJECT_ROOT"
BACKEND_DIR="$PROJECT_ROOT/server"

# 安装依赖
install_dependencies() {
    local dir=$1
    local name=$2
    
    log "Installing $name dependencies..."
    cd "$dir"
    if [ ! -d "node_modules" ]; then
        npm install
    else
        log "$name node_modules already exists"
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
    
    # 等待几秒确保服务启动
    sleep 5
    
    # 检查服务是否成功启动
    if [ $? -eq 0 ]; then
        log "$name service started successfully"
    else
        error "$name service failed to start"
        exit 1
    fi
}

# 主函数
main() {
    log "Starting services..."
    
    # 安装依赖
    install_dependencies "$BACKEND_DIR" "Backend"
    install_dependencies "$FRONTEND_DIR" "Frontend"
    
    # 启动后端服务
    start_service "$BACKEND_DIR" "Backend" "dev"
    
    # 启动前端服务
    start_service "$FRONTEND_DIR" "Frontend" "dev"
    
    log "All services started successfully!"
    
    # 保持脚本运行
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

# 运行主函数
main

