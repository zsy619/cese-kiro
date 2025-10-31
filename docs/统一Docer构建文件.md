## 任务目标

合并前后端Docker构建文件

## AI的角色

Docker部署专家，熟悉Dockerfile，docker-compose

## 我的角色

部署人员

## 关键信息

- 前端Dockerfile
  - 根目录 Dockerfile
  - 根目录 docker-compose.yml
  - 根目录 docker-compose.dev.yml
  - 根目录 docker-compose.staging.yml
- 后端Dockerfile
  - backend/Dockerfile
  - backend/docker-compose.yml

## 行为规则

- 合并前后端Dockerfile
- 合并前后端docker-compose.yml
- 合并前后端docker-compose.dev.yml
- 合并前后端docker-compose.staging.yml
- 完善根目录下nginx.conf文件，包括前后端
- 上述所有文件存储到 docker 目录下，完成之后删除其他文件

## 交付格式

各类docker文件
