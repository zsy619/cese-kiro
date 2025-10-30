import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3100',
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
        supportFile: 'cypress/support/e2e.ts',
        videosFolder: 'cypress/videos',
        screenshotsFolder: 'cypress/screenshots',
        viewportWidth: 1280,
        viewportHeight: 720,
        video: false,
        screenshotOnRunFailure: true
    },
    component: {
        devServer: {
            framework: 'react',
            bundler: 'webpack'
        },
        specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
        supportFile: 'cypress/support/component.ts'
    }
});
