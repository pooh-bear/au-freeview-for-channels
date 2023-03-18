module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    modulePathIgnorePatterns: [
        '<rootDir>/dist/'
    ],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/index.ts',
        '!src/**/*.d.ts'
    ],
    coverageReporters: [
        'text',
        'lcov'
    ]
}