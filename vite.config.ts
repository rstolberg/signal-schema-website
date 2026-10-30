import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { readdirSync, readFileSync, existsSync } from 'fs'
import { parseWork, sortWorks } from './scripts/works/parse.mjs'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

// `virtual:works` exports every Markdown file in content/works, parsed and sorted.
function worksContent() {
  const dir = path.resolve(__dirname, 'content/works')
  const id = '\0virtual:works'
  return {
    name: 'works-content',
    resolveId: (s) => (s === 'virtual:works' ? id : undefined),
    load(s) {
      if (s !== id) return
      this.addWatchFile(dir)
      const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.md')) : []
      const works = files.map((f) => {
        this.addWatchFile(path.join(dir, f))
        return parseWork(readFileSync(path.join(dir, f), 'utf8'), f.replace(/\.md$/, ''))
      })
      return `export default ${JSON.stringify(sortWorks(works))}`
    },
    handleHotUpdate({ file, server }) {
      if (!file.startsWith(dir)) return
      const mod = server.moduleGraph.getModuleById(id)
      if (mod) server.moduleGraph.invalidateModule(mod)
      server.ws.send({ type: 'full-reload' })
    },
  }
}

export default defineConfig({
  publicDir: 'static',
  plugins: [
    figmaAssetResolver(),
    worksContent(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
