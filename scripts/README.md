# 脚本使用说明

本目录包含项目的所有自动化脚本，按照功能和项目类型进行分类。

## 📁 脚本分类

### 前端脚本（front-*）

#### front-start.sh

启动前端开发服务器

```bash
./scripts/front-start.sh
```

**功能**:

- 检查 Node.js 环境
- 自动安装依赖（如果需要）
- 启动开发服务器（端口 3100）

#### front-build.sh

构建前端生产版本

```bash
./scripts/front-build.sh
```

**功能**:

- 清理旧的构建产物
- 安装依赖
- 运行代码检查（ESLint + TypeScript + Prettier）
- 运行测试
- 构建生产版本
- 分析构建产物

#### front-test.sh

运行前端测试

```bash
# 单次运行
./scripts/front-test.sh

# 监听模式
./scripts/front-test.sh --watch

# 生成覆盖率报告
./scripts/front-test.sh --coverage

# 更新快照
./scripts/front-test.sh --update
```

**选项**:

- `--watch`: 监听模式，文件变化时自动重新运行
- `--coverage`: 生成测试覆盖率报告
- `--update`: 更新测试快照

### 后端脚本（back-*）

> 待实现，后端开发时添加

### 通用脚本

#### check-all.sh

检查所有代码质量

```bash
./scripts/check-all.sh
```

**功能**:

- 前端代码检查（ESLint + TypeScript + Prettier）
- 后端代码检查（待实现）

#### deploy-docker.sh

Docker 部署脚本

```bash
# 部署到生产环境
./scripts/deploy-docker.sh production

# 部署到开发环境
./scripts/deploy-docker.sh development

# 部署到预发布环境
./scripts/deploy-docker.sh staging
```

**功能**:

- 拉取最新代码
- 安装依赖
- 运行测试和代码检查
- 构建项目
- 构建 Docker 镜像
- 启动容器
- 健康检查

## 🚀 快速开始

### 开发流程

```bash
# 1. 启动前端开发服务器
./scripts/front-start.sh

# 2. 在另一个终端运行测试（可选）
./scripts/front-test.sh --watch

# 3. 代码检查
./scripts/check-all.sh
```

### 构建和部署

```bash
# 1. 构建前端
./scripts/front-build.sh

# 2. 部署到生产环境
./scripts/deploy-docker.sh production
```

## 📝 脚本命名规范

- **前端脚本**: `front-*.sh`
- **后端脚本**: `back-*.sh`
- **通用脚本**: 不加前缀

## 🔧 脚本特性

### 路径自动处理

所有脚本都会自动处理路径问题，可以从任何位置运行：

```bash
# 从项目根目录运行
./scripts/front-start.sh

# 从 scripts 目录运行
cd scripts
./front-start.sh

# 从其他目录运行
/path/to/project/scripts/front-start.sh
```

### 错误处理

所有脚本都使用 `set -e`，遇到错误会立即停止执行。

### 环境变量

前端脚本会自动设置以下环境变量：

- `PORT=3100`: 开发服务器端口
- `REACT_APP_API_BASE_URL=http://localhost:8080/api`: API 地址
- `REACT_APP_APP_TITLE="上下文工程六要素小工具"`: 应用标题

## 🛠️ 维护指南

### 添加新脚本

1. 创建脚本文件，按照命名规范命名
2. 添加脚本头部注释说明用途
3. 使用 `set -e` 启用错误处理
4. 使用以下代码获取项目根目录：

```bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"
```

5. 添加执行权限：`chmod +x scripts/your-script.sh`
6. 更新本 README 文档

### 修改现有脚本

1. 确保修改后脚本仍能从任何位置运行
2. 测试所有功能是否正常
3. 更新相关文档

## 📊 脚本清单

| 脚本名称 | 类型 | 用途 | 状态 |
|---------|------|------|------|
| front-start.sh | 前端 | 启动开发服务器 | ✅ |
| front-build.sh | 前端 | 构建生产版本 | ✅ |
| front-test.sh | 前端 | 运行测试 | ✅ |
| check-all.sh | 通用 | 代码质量检查 | ✅ |
| deploy-docker.sh | 通用 | Docker 部署 | ✅ |
| back-start.sh | 后端 | 启动后端服务 | 🚧 待实现 |
| back-build.sh | 后端 | 构建后端 | 🚧 待实现 |
| back-test.sh | 后端 | 后端测试 | 🚧 待实现 |

## 🐛 故障排查

### 权限问题

如果遇到权限错误：

```bash
chmod +x scripts/*.sh
```

### 路径问题

确保从项目根目录或 scripts 目录运行脚本。

### Node.js 版本

前端脚本需要 Node.js 18+：

```bash
node -v  # 应该显示 v18.x.x 或更高
```

### Docker 问题

部署脚本需要 Docker 和 Docker Compose：

```bash
docker --version
docker-compose --version
```

## 📚 相关文档

- [部署文档](../README_DEPLOYMENT.md)
- [测试指南](../docs/B#前端/B009-测试与部署指南.md)
- [性能优化指南](../docs/B#前端/B010-性能优化指南.md)

---

**最后更新**: 2024年
**维护者**: 开发团队
