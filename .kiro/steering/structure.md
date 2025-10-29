# Project Structure

## Directory Organization

```
cese-kiro/
├── .git/                    # Git repository
├── .kiro/                   # Kiro IDE configuration
├── .qoder/                  # Legacy tooling configuration
├── docs/                    # Documentation and prompts
│   ├── A#项目初始化/         # Project initialization docs
│   ├── B#前端/              # Frontend documentation
│   ├── C#后端/              # Backend documentation (planned)
│   ├── D#数据库/            # Database documentation (planned)
│   ├── E#测试/              # Testing documentation (planned)
│   └── F#部署/              # Deployment documentation (planned)
├── frontend/                # React frontend application
│   ├── public/              # Static assets
│   ├── src/                 # Source code
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components (planned)
│   │   ├── services/        # API service layer (planned)
│   │   └── utils/           # Utility functions (planned)
│   ├── package.json         # Dependencies and scripts
│   └── tsconfig.json        # TypeScript configuration
└── README.md               # Project documentation
```

## Documentation Conventions

### Prompt Templates
- Located in `docs/` with Chinese folder names using `#` prefix
- Follow six-element structure: 任务目标, AI的角色, 我的角色, 关键信息, 行为规则, 交付格式
- Template file: `docs/上下文工程六要素提示词模板.md`

### Naming Patterns
- Documentation folders: `[Letter]#[Category]` (e.g., `B#前端`)
- Prompt files: `[ID]-提示词-[Description].md` (e.g., `B001-提示词-前端页面.md`)
- Bilingual README files: `README.md` (Chinese), `README_EN.md` (English)

## Code Organization

### Frontend Structure
- **Components**: Reusable UI components in `src/components/`
- **Pages**: Route-level components in `src/pages/`
- **Services**: API integration in `src/services/`
- **Utils**: Helper functions in `src/utils/`
- **Styling**: CSS modules and styled-components

### Configuration Files
- **TypeScript**: Strict mode enabled, React JSX transform
- **Package Management**: npm with lock file
- **Linting**: ESLint with React and Prettier configs
- **Testing**: Jest with React Testing Library

## Development Workflow
- Use Chinese for documentation and user-facing content
- Use English for code comments and technical documentation
- Follow React functional component patterns with hooks
- Maintain TypeScript strict typing throughout