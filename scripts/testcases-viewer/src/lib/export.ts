// Xuất test cases ra CSV và Excel (.xlsx).
//
// .xlsx được dựng thủ công (zip + Office Open XML) thay vì dùng thư viện như SheetJS:
// thư viện nặng ~900 KB, làm phình bundle.html vốn phải mở được offline bằng file://.
// Zip ghi ở chế độ STORE (không nén) để tránh phụ thuộc CompressionStream — file to hơn
// nhưng với vài trăm test case vẫn chỉ cỡ vài trăm KB.

import type { TestCase } from './parser'

export const EXPORT_COLUMNS = [
  'TC ID',
  'REQ ID',
  'Module',
  'Risk Level',
  'Test Scenario',
  'Pre-Condition',
  'Test Steps',
  'Test Data',
  'Expected Result',
  'Priority',
  'Automation',
  'Auto Type',
  'Tags',
] as const

// Độ rộng cột trong Excel (đơn vị ký tự), khớp thứ tự EXPORT_COLUMNS
const COLUMN_WIDTHS = [20, 16, 10, 10, 42, 26, 52, 26, 52, 10, 12, 10, 20]

// Bỏ markdown inline và đổi <br> thành xuống dòng thật để đọc được trong Excel/CSV
function cellText(raw: string): string {
  return raw
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/`/g, '')
    .replace(/\*\*/g, '')
    .trim()
}

function rowOf(tc: TestCase): string[] {
  return [
    tc.id,
    tc.reqIds.join(', '),
    tc.module,
    tc.risk,
    cellText(tc.title),
    cellText(tc.preCondition),
    cellText(tc.steps),
    cellText(tc.testData),
    cellText(tc.expected),
    tc.priority,
    tc.automatable,
    tc.autoType,
    tc.tags.join(' '),
  ]
}

function timestamp(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  // Có giây để xuất nhiều lần với bộ lọc khác nhau trong cùng một phút không bị trùng tên
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
}

function download(fileName: string, blob: Blob): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

// ---------------------------------------------------------------- CSV

export function exportCsv(cases: TestCase[], baseName: string): void {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`
  const lines = [
    EXPORT_COLUMNS.map(escape).join(','),
    ...cases.map((tc) => rowOf(tc).map(escape).join(',')),
  ]
  // BOM UTF-8 để Excel trên Windows đọc đúng tiếng Việt thay vì ra ký tự lỗi
  const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' })
  download(`${baseName}_${timestamp()}.csv`, blob)
}

// ---------------------------------------------------------------- ZIP (store-only)

const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[i] = c >>> 0
  }
  return t
})()

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

interface ZipEntry {
  name: string
  data: Uint8Array
  crc: number
}

function zip(files: { name: string; content: string }[]): Blob {
  const enc = new TextEncoder()
  const entries: ZipEntry[] = files.map((f) => {
    const data = enc.encode(f.content)
    return { name: f.name, data, crc: crc32(data) }
  })

  const nameBytes = entries.map((e) => enc.encode(e.name))
  const localSize = entries.reduce((s, e, i) => s + 30 + nameBytes[i].length + e.data.length, 0)
  const centralSize = entries.reduce((s, _, i) => s + 46 + nameBytes[i].length, 0)

  const buf = new ArrayBuffer(localSize + centralSize + 22)
  const view = new DataView(buf)
  const out = new Uint8Array(buf)
  let off = 0
  const offsets: number[] = []

  entries.forEach((e, i) => {
    offsets.push(off)
    view.setUint32(off, 0x04034b50, true)
    view.setUint16(off + 4, 20, true) // version needed
    view.setUint16(off + 6, 0x0800, true) // flag: tên file mã hoá UTF-8
    view.setUint16(off + 8, 0, true) // method: store
    view.setUint16(off + 10, 0, true) // mod time
    view.setUint16(off + 12, 0x2821, true) // mod date (2000-01-01)
    view.setUint32(off + 14, e.crc, true)
    view.setUint32(off + 18, e.data.length, true)
    view.setUint32(off + 22, e.data.length, true)
    view.setUint16(off + 26, nameBytes[i].length, true)
    view.setUint16(off + 28, 0, true) // extra len
    off += 30
    out.set(nameBytes[i], off)
    off += nameBytes[i].length
    out.set(e.data, off)
    off += e.data.length
  })

  const centralStart = off
  entries.forEach((e, i) => {
    view.setUint32(off, 0x02014b50, true)
    view.setUint16(off + 4, 20, true) // version made by
    view.setUint16(off + 6, 20, true) // version needed
    view.setUint16(off + 8, 0x0800, true)
    view.setUint16(off + 10, 0, true)
    view.setUint16(off + 12, 0, true)
    view.setUint16(off + 14, 0x2821, true)
    view.setUint32(off + 16, e.crc, true)
    view.setUint32(off + 20, e.data.length, true)
    view.setUint32(off + 24, e.data.length, true)
    view.setUint16(off + 28, nameBytes[i].length, true)
    view.setUint16(off + 30, 0, true) // extra
    view.setUint16(off + 32, 0, true) // comment
    view.setUint16(off + 34, 0, true) // disk number
    view.setUint16(off + 36, 0, true) // internal attrs
    view.setUint32(off + 38, 0, true) // external attrs
    view.setUint32(off + 42, offsets[i], true)
    off += 46
    out.set(nameBytes[i], off)
    off += nameBytes[i].length
  })

  view.setUint32(off, 0x06054b50, true)
  view.setUint16(off + 4, 0, true)
  view.setUint16(off + 6, 0, true)
  view.setUint16(off + 8, entries.length, true)
  view.setUint16(off + 10, entries.length, true)
  view.setUint32(off + 12, centralSize, true)
  view.setUint32(off + 16, centralStart, true)
  view.setUint16(off + 20, 0, true)

  return new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

// ---------------------------------------------------------------- XLSX

// XML 1.0 chỉ cho phép tab, LF, CR và các ký tự từ 0x20 trở lên.
// Còn sót ký tự điều khiển khác là Excel báo file hỏng và từ chối mở.
function stripInvalidXmlChars(s: string): string {
  let out = ''
  for (const ch of s) {
    const code = ch.codePointAt(0)!
    if (code === 9 || code === 10 || code === 13 || code >= 32) out += ch
  }
  return out
}

function xmlEscape(s: string): string {
  return stripInvalidXmlChars(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function colLetter(index: number): string {
  let n = index + 1
  let s = ''
  while (n > 0) {
    const r = (n - 1) % 26
    s = String.fromCharCode(65 + r) + s
    n = Math.floor((n - 1) / 26)
  }
  return s
}

function sheetXml(rows: string[][]): string {
  const lastCol = colLetter(EXPORT_COLUMNS.length - 1)
  const body = rows
    .map((cells, r) => {
      const rowNum = r + 1
      const style = r === 0 ? 1 : 2
      const tds = cells
        .map((v, c) =>
          v === ''
            ? `<c r="${colLetter(c)}${rowNum}" s="${style}"/>`
            : `<c r="${colLetter(c)}${rowNum}" s="${style}" t="inlineStr"><is><t xml:space="preserve">${xmlEscape(v)}</t></is></c>`,
        )
        .join('')
      return `<row r="${rowNum}"${r === 0 ? ' ht="22" customHeight="1"' : ''}>${tds}</row>`
    })
    .join('')

  const cols = COLUMN_WIDTHS.map(
    (w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`,
  ).join('')

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="15"/><cols>${cols}</cols><sheetData>${body}</sheetData><autoFilter ref="A1:${lastCol}${rows.length}"/></worksheet>`
}

const STYLES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF2F7A29"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`

// Tên sheet Excel: tối đa 31 ký tự, không chứa : \ / ? * [ ]
function sheetName(raw: string, taken: Set<string>): string {
  let name = raw.replace(/^Nhóm\s+/i, '').replace(/[:\\/?*[\]]/g, '-').trim() || 'Sheet'
  if (name.length > 31) name = name.slice(0, 30).trim() + '…'
  let candidate = name
  let n = 2
  while (taken.has(candidate.toLowerCase())) {
    const suffix = ` (${n++})`
    candidate = name.slice(0, 31 - suffix.length) + suffix
  }
  taken.add(candidate.toLowerCase())
  return candidate
}

export function exportXlsx(cases: TestCase[], baseName: string): void {
  const header = [...EXPORT_COLUMNS] as string[]

  // Sheet đầu gồm toàn bộ, sau đó mỗi nhóm một sheet để tra cứu theo module
  const groups = [...new Set(cases.map((tc) => tc.group))].filter(Boolean)
  const taken = new Set<string>()
  const sheets: { name: string; rows: string[][] }[] = [
    { name: sheetName('Tổng hợp', taken), rows: [header, ...cases.map(rowOf)] },
  ]
  if (groups.length > 1) {
    for (const g of groups) {
      const rows = cases.filter((tc) => tc.group === g).map(rowOf)
      sheets.push({ name: sheetName(g, taken), rows: [header, ...rows] })
    }
  }

  const files = [
    {
      name: '[Content_Types].xml',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${sheets
        .map(
          (_, i) =>
            `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`,
        )
        .join('')}</Types>`,
    },
    {
      name: '_rels/.rels',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    },
    {
      name: 'xl/workbook.xml',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheets
        .map((s, i) => `<sheet name="${xmlEscape(s.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`)
        .join('')}</sheets></workbook>`,
    },
    {
      name: 'xl/_rels/workbook.xml.rels',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets
        .map(
          (_, i) =>
            `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`,
        )
        .join('')}<Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
    },
    { name: 'xl/styles.xml', content: STYLES_XML },
    ...sheets.map((s, i) => ({
      name: `xl/worksheets/sheet${i + 1}.xml`,
      content: sheetXml(s.rows),
    })),
  ]

  download(`${baseName}_${timestamp()}.xlsx`, zip(files))
}
