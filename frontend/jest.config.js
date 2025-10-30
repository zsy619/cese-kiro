module.exports = {
    // 测试环境
    testEnvironment: 'jsdom',

    // 模块路径映射
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js'
    },

    // 设置文件
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

    // 测试覆盖率配置
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/index.tsx',
        '!src/reportWebVitals.ts',
        '!src/setupTests.ts'
    ],

    // 覆盖率阈值
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: 50
        }
    },

    // 测试匹配模式
    testMatch: ['**/__tests__/**/*.{ts,tsx}', '**/*.{spec,test}.{ts,tsx}'],

    // 转换配置
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },

    // 忽略的路径
    testPathIgnorePatterns: ['/node_modules/', '/build/'],

    // 模块文件扩展名
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};
