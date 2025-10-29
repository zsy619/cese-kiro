# Context Engineering Six Elements (CESE)

<div align="center">

# Context Engineering Six Elements Tool

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/zsy619/cese-kiro.svg)](https://github.com/zsy619/cese-kiro/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/zsy619/cese-kiro.svg)](https://github.com/zsy619/cese-kiro/issues)

An intelligent prompt generation tool based on Context Engineering Six Elements theory

English | [简体中文](./README.md)

</div>

## 📖 Introduction

**Context Engineering Six Elements (CESE)** is a tool designed to help users build high-quality AI prompts. Based on context engineering theory, this tool generates professional and precise prompt templates through structured input of six core elements.

### Core Features

- **🎯 Six Elements Structured Input**: Guide users to systematically build prompts based on task goals, role definitions, key information, behavior rules, delivery format, and example references
- **📝 Intelligent Prompt Generation**: Automatically generate structured and professional prompts based on user input
- **💾 Theme Management System**: Support creating, saving, editing, and managing multiple prompt themes for easy reuse and iteration
- **🤖 Local AI Integration**: Integrate Ollama + DeepSeek local large models to provide intelligent optimization suggestions and content completion
- **📊 History Tracking**: Save generation history, support version comparison and rollback
- **🔄 Template Import/Export**: Support Markdown format template import and export for easy sharing and collaboration

### Six Elements Explained

1. **Task Goal**: Define the specific task to be completed
2. **AI Role**: Define the professional role that AI plays
3. **User Role**: Describe the user's identity and position
4. **Key Information**: Provide core information and constraints related to the task
5. **Behavior Rules**: Specify AI's behavior guidelines and output requirements
6. **Delivery Format**: Clarify the format and structure of the final output

## 🚀 Tech Stack

### Frontend
- **React 18+**: Modern frontend framework
- **TypeScript**: Type-safe development experience
- **Ant Design / Material-UI**: Elegant UI component library
- **React Router**: Route management
- **Axios**: HTTP request library
- **Monaco Editor**: Code editor (for Markdown editing)

### Backend
- **Hertz**: High-performance Go HTTP framework open-sourced by ByteDance
- **Go 1.20+**: Efficient backend language
- **GORM**: Go ORM library
- **JWT**: User authentication
- **Swagger**: API documentation

### Database
- **MySQL 8.0+**: Relational database

### AI Integration
- **Ollama**: Local large model runtime environment
- **DeepSeek**: High-performance open-source large model

## 📦 Quick Start

### Method 1: Source Code Startup (Recommended for Development)

#### Prerequisites
- Node.js 18+ 
- Go 1.20+
- MySQL 8.0+
- Ollama (optional, for AI features)

#### 1. Clone the Project
```bash
git clone https://github.com/zsy619/cese-kiro.git
cd cese-kiro
```

#### 2. Configure Database
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE cese_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Exit MySQL
exit
```

#### 3. Start Backend Service
```bash
cd backend

# Install dependencies
go mod download

# Copy configuration file
cp config.example.yaml config.yaml

# Edit configuration file, fill in database connection information
# vim config.yaml

# Run database migration
go run cmd/migrate/main.go

# Start service
go run cmd/server/main.go
```

Backend service will start at `http://localhost:8080`

#### 4. Start Frontend Service
```bash
# Open a new terminal
cd frontend

# Install dependencies
npm install
# or use yarn
yarn install

# Start development server
npm run dev
# or
yarn dev
```

Frontend service will start at `http://localhost:3000`

#### 5. Configure Ollama (Optional)
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull DeepSeek model
ollama pull deepseek-coder

# Start Ollama service
ollama serve
```

### Method 2: Docker Startup (Recommended for Production)

#### Prerequisites
- Docker 20+
- Docker Compose 2+

#### 1. Clone the Project
```bash
git clone https://github.com/zsy619/cese-kiro.git
cd cese-kiro
```

#### 2. Configure Environment Variables
```bash
# Copy environment variable file
cp .env.example .env

# Edit environment variables (optional)
# vim .env
```

#### 3. Start All Services
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Service access addresses:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`
- API Documentation: `http://localhost:8080/swagger`

#### 4. Start Ollama (Optional)
```bash
# Run Ollama using Docker
docker run -d --name ollama \
  -p 11434:11434 \
  -v ollama:/root/.ollama \
  ollama/ollama

# Pull model
docker exec -it ollama ollama pull deepseek-coder
```

### Method 3: Cloud Function Deployment (Serverless)

#### Deploy to Alibaba Cloud Function Compute

##### 1. Install Serverless Devs
```bash
npm install -g @serverless-devs/s
```

##### 2. Configure Alibaba Cloud Account
```bash
s config add

# Enter AccessKey ID and AccessKey Secret as prompted
```

##### 3. Deploy Backend
```bash
cd backend

# Edit s.yaml configuration file
# vim s.yaml

# Deploy
s deploy
```

##### 4. Deploy Frontend to OSS
```bash
cd frontend

# Build production version
npm run build

# Upload to OSS
s deploy
```

#### Deploy to Tencent Cloud SCF

##### 1. Install Serverless Framework
```bash
npm install -g serverless
```

##### 2. Configure Tencent Cloud Account
```bash
serverless login
```

##### 3. Deploy
```bash
# Deploy backend
cd backend
serverless deploy

# Deploy frontend
cd frontend
npm run build
serverless deploy
```

#### Deploy to AWS Lambda

##### 1. Install AWS CLI and SAM CLI
```bash
# macOS
brew install aws-cli aws-sam-cli

# Configure AWS credentials
aws configure
```

##### 2. Deploy
```bash
# Build
sam build

# Deploy
sam deploy --guided
```

## 📚 User Guide

### Create Prompt Theme

1. Click the "New Theme" button
2. Fill in theme name and description
3. Fill in the six elements in sequence:
   - Task Goal: Describe the specific task to be completed
   - AI Role: Define AI's professional identity
   - User Role: Explain your identity
   - Key Information: List important background information
   - Behavior Rules: Set AI's behavior guidelines
   - Delivery Format: Specify output format
4. Click "Generate Prompt"
5. Preview and save

### Manage Themes

- **Edit**: Click the edit button on the theme card
- **Delete**: Click the delete button (supports batch deletion)
- **Export**: Export as Markdown file
- **Import**: Import theme from Markdown file

### AI Assistant Features

- **Smart Completion**: Get AI suggestions while typing
- **Content Optimization**: Click the optimize button to improve prompt quality
- **Example Generation**: Automatically generate examples based on theme

## 🗂️ Project Structure

```
cese-kiro/
├── frontend/                 # Frontend project
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   └── App.tsx          # Main application
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Backend project
│   ├── cmd/                 # Command line entry
│   ├── internal/            # Internal packages
│   │   ├── handler/         # HTTP handlers
│   │   ├── service/         # Business logic
│   │   ├── model/           # Data models
│   │   └── repository/      # Data access layer
│   ├── pkg/                 # Public packages
│   └── go.mod
├── docs/                    # Documentation
├── docker-compose.yml       # Docker orchestration
├── .env.example            # Environment variable example
└── README.md               # Project documentation
```

## 🔧 Configuration

### Backend Configuration (config.yaml)

```yaml
server:
  port: 8080
  mode: debug  # debug | release

database:
  host: localhost
  port: 3306
  username: root
  password: your_password
  database: cese_db
  charset: utf8mb4

ollama:
  enabled: true
  host: http://localhost:11434
  model: deepseek-coder
  timeout: 30s

jwt:
  secret: your_jwt_secret
  expire: 24h
```

### Frontend Configuration (.env)

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TITLE=Context Engineering Six Elements Tool
VITE_OLLAMA_ENABLED=true
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Hertz](https://github.com/cloudwego/hertz) - High-performance Go framework by ByteDance
- [Ollama](https://ollama.com/) - Local large model runtime environment
- [DeepSeek](https://www.deepseek.com/) - High-performance open-source large model
- [React](https://react.dev/) - Frontend framework

## 📮 Contact

- Project URL: [https://github.com/zsy619/cese-kiro](https://github.com/zsy619/cese-kiro)
- Issue Tracker: [Issues](https://github.com/zsy619/cese-kiro/issues)

## 🗺️ Roadmap

- [x] Basic six elements input functionality
- [x] Prompt generation and preview
- [x] Theme management system
- [ ] AI intelligent optimization suggestions
- [ ] Multi-language support
- [ ] Team collaboration features
- [ ] Prompt marketplace
- [ ] Browser extension

---

<div align="center">

**If this project helps you, please give it a ⭐️ Star!**

Made with ❤️ by [zsy619](https://github.com/zsy619)

</div>
