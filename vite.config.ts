import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import monkey, { cdn } from 'vite-plugin-monkey'

export default defineConfig({
  plugins: [
    solidPlugin(),
    monkey({
      entry: 'src/index.tsx',
      userscript: {
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'npm/vite-plugin-monkey',
        match: ['https://www.statejobsny.com/*', 'https://statejobs.ny.gov/*'],
      },
      // build: {
      //   externalResource: {
      //     '@nysds/styles/dist/nysds-full.min.css': cdn.jsdelivr(),
      //   },
      // },
    }),
  ],
})
