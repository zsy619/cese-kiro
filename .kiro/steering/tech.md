# Technology Stack

## Frontend
- **React 18+** with TypeScript
- **Ant Design** for UI components
- **Monaco Editor** for Markdown editing
- **React Router** for navigation
- **Axios** for HTTP requests
- **Styled Components** for styling
- **Create React App** as build system

## Backend (Planned)
- **Hertz** (ByteDance Go HTTP framework)
- **Go 1.20+**
- **GORM** for database ORM
- **JWT** for authentication
- **Swagger** for API documentation

## Database (Planned)
- **MySQL 8.0+**

## AI Integration (Planned)
- **Ollama** for local model runtime
- **DeepSeek** model for AI features

## Development Commands

### Frontend Development
```bash
cd frontend
npm install          # Install dependencies
npm start           # Start dev server (default port 3000)
npm run build       # Build for production
npm test            # Run tests
```

### Project Structure Commands
```bash
# Clone and setup
git clone https://github.com/zsy619/cese-kiro.git
cd cese-kiro

# Frontend only (current state)
cd frontend && npm install && npm start
```

## Build System
- Uses Create React App with TypeScript template
- ESLint and Prettier for code quality
- Jest for testing framework
- Default development port: 3000 (configurable to 3100 per docs)