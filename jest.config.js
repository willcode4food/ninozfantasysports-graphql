module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '.(ts)': '<rootDir>/node_modules/ts-jest',
    },
    testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts)$',
    moduleFileExtensions: ['ts', 'js'],
    coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    collectCoverage: true,
}
