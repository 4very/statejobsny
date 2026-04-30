import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import monkey from 'vite-plugin-monkey'

export default defineConfig({
  plugins: [
    solidPlugin(),
    monkey({
      entry: 'src/index.tsx',
      userscript: {
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'npm/vite-plugin-monkey',
        match: ['https://www.statejobsny.com/*', 'https://statejobs.ny.gov/*'],
        grant: ['GM.getValue', 'GM.setValue'],
        downloadURL:
          'https://github.com/4very/statejobsny/releases/download/latest/statejobsny.user.js',
      },
      build: {
        autoGrant: false,
      },
      // build: {
      //   externalResource: {
      //     '@nysds/styles/dist/nysds-full.min.css': cdn.jsdelivr(),
      //   },
      // },
    }),
  ],

  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
