module.exports = {
    preset: 'ts-jest',
    transformIgnorePatterns: ['/node_modules\/(?!vexflow)(.*)'],
    transform: {
        "^.+\\.(ts|tsx)?$": "ts-jest",
        "^.+\\.(js|jsx)$": "babel-jest",
    },
};