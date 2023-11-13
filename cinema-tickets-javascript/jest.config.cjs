const base = {
    testEnvironment: 'node',
};

module.exports = {
    projects: [
        {
            displayName: 'unit',
            ...base,
            resetModules: true,
            testMatch: ['<rootDir>/**/*.test.js'],
        },
        {
            displayName: 'coverage',
            ...base,
            coverageDirectory: 'coverage',
            coveragePathIgnorePatterns: ['node_modules', 'src/thirdparty'],
            resetModules: true,
            testMatch: ['<rootDir>/**/*.test.js'],
        },
    ],
};
