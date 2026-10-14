// Nhúng logo + favicon từ public/ thành data URI để bundle.html tự chứa hoàn toàn.
// Chạy lại script này mỗi khi thay logo hoặc favicon: pnpm run embed-assets
//
// Ghi ra 2 nơi:
//   - src/lib/assets.ts  → LOGO_DATA_URI dùng trong App.tsx
//   - index.html         → thẻ <link rel="icon"> chứa favicon dạng data URI

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const LOGO = 'public/Profile AnhTester 200px-border-radius.png'
const FAVICON = 'public/favicon.ico'

const read = (rel) => {
  const abs = path.join(root, rel)
  if (!fs.existsSync(abs)) {
    console.error(`Không tìm thấy: ${rel}`)
    process.exit(1)
  }
  return fs.readFileSync(abs).toString('base64')
}

const logo = read(LOGO)
const favicon = read(FAVICON)

const assetsPath = path.join(root, 'src/lib/assets.ts')
fs.writeFileSync(
  assetsPath,
  `// FILE ĐƯỢC SINH TỰ ĐỘNG — không sửa tay. Chạy: pnpm run embed-assets
// Nguồn: ${LOGO}, ${FAVICON}

export const LOGO_DATA_URI = 'data:image/png;base64,${logo}'

export const FAVICON_DATA_URI = 'data:image/x-icon;base64,${favicon}'
`,
)

const htmlPath = path.join(root, 'index.html')
let html = fs.readFileSync(htmlPath, 'utf8')
const iconTag = `<link rel="icon" type="image/x-icon" href="data:image/x-icon;base64,${favicon}" />`
html = html.match(/<link rel="icon"[^>]*>/)
  ? html.replace(/<link rel="icon"[^>]*>/, iconTag)
  : html.replace('<title>', `${iconTag}\n    <title>`)
fs.writeFileSync(htmlPath, html)

const kb = (n) => `${(n / 1024).toFixed(1)} KB`
console.log(`src/lib/assets.ts  ${kb(fs.statSync(assetsPath).size)}  (logo ${kb(logo.length)} base64)`)
console.log(`index.html         ${kb(fs.statSync(htmlPath).size)}  (favicon ${kb(favicon.length)} base64)`)
