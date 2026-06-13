/** @type {import('jest').Config} */
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(t|j)sx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          module: 'commonjs',
          esModuleInterop: true,
          isolatedModules: true,
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/test-utils$': '<rootDir>/test-utils',
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|scss|sass|less)$': '<rootDir>/test-utils/styleMock.cjs',
    '\\.(png|jpe?g|gif|webp|svg|ttf|woff2?)$': '<rootDir>/test-utils/fileMock.cjs',
  },
};

