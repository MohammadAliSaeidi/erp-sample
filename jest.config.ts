import nextJest from "next/jest";

const createJestConfig = nextJest({
	dir: "./", // path to your Next.js app
});

const customJestConfig = {
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

	// Better defaults for your structure
	testMatch: ["**/?(*.)+(spec|test).(ts|tsx)"],
	testPathIgnorePatterns: ["/node_modules/", "/.next/"],

	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
		// optional: if you import from app/features directly with aliases, add them too:
		"^@app/(.*)$": "<rootDir>/app/$1",
		"^@features/(.*)$": "<rootDir>/features/$1",

		// optional: style mocks if you import css modules in tests
		"\\.(css|less|scss|sass)$": "identity-obj-proxy",
	},

	// optional but common for Next/RTL
	clearMocks: true,
};

export default createJestConfig(customJestConfig);
