import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  parseMarkdownFile,
  type ParsedFile,
  type TestCase,
  PRIORITY_ORDER,
  RISK_ORDER,
  compareTcId,
  compareText,
} from '@/lib/parser'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LOGO_DATA_URI } from '@/lib/assets'
import { exportCsv, exportXlsx } from '@/lib/export'

interface RawFile {
  name: string
  content: string
}

const STORAGE_KEY = 'tc-report-ui.files.v1'

// ---------- Render inline markdown tối giản (`code`, **bold**, <br>) ----------
function MdText({ text, className = '' }: { text: string; className?: string }) {
  const normalized = text.replace(/<br\s*\/?>/gi, '\n')
  const parts = normalized.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean)
  return (
    <span className={`whitespace-pre-wrap break-words ${className}`}>
      {parts.map((p, i) => {
        if (p.startsWith('`') && p.endsWith('`')) {
          return (
            <code
              key={i}
              className="rounded bg-slate-100 px-1 py-px font-mono text-[0.86em] text-brand-800 border border-slate-200"
            >
              {p.slice(1, -1)}
            </code>
          )
        }
        if (p.startsWith('**') && p.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold">
              {p.slice(2, -2)}
            </strong>
          )
        }
        return <span key={i}>{p}</span>
      })}
    </span>
  )
}

// ---------- Badge màu theo giá trị ----------
const PRIORITY_STYLE: Record<string, string> = {
  critical: 'bg-red-50 text-red-700 border-red-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  medium: 'bg-sky-50 text-sky-700 border-sky-200',
  low: 'bg-slate-100 text-slate-600 border-slate-200',
}
const RISK_STYLE: Record<string, string> = {
  high: 'bg-red-50 text-red-700 border-red-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-slate-100 text-slate-600 border-slate-200',
}
const AUTO_STYLE: Record<string, string> = {
  yes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  partial: 'bg-amber-50 text-amber-700 border-amber-200',
  no: 'bg-rose-50 text-rose-700 border-rose-200',
}

function Pill({ value, styles }: { value: string; styles: Record<string, string> }) {
  if (!value) return <span className="text-slate-300">—</span>
  const cls = styles[value.toLowerCase()] ?? 'bg-slate-100 text-slate-600 border-slate-200'
  return (
    <span className={`inline-block rounded-sm border px-1.5 py-0.5 text-[11px] font-medium leading-none ${cls}`}>
      {value}
    </span>
  )
}

// ---------- App ----------
type SortKey = 'id' | 'title' | 'priority' | 'risk' | 'group'

export default function App() {
  const [rawFiles, setRawFiles] = useState<RawFile[]>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY)
      return s ? (JSON.parse(s) as RawFile[]) : []
    } catch {
      return []
    }
  })
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<Set<string>>(new Set())
  const [autoFilter, setAutoFilter] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<string>('') // "file::group" hoặc "file::" (cả file)
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'id', dir: 1 })
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rawFiles))
    } catch {
      /* file quá lớn cho localStorage — bỏ qua, chỉ mất persistence */
    }
  }, [rawFiles])

  const parsedFiles: ParsedFile[] = useMemo(
    () => rawFiles.map((f) => parseMarkdownFile(f.name, f.content)),
    [rawFiles],
  )
  const allCases: TestCase[] = useMemo(() => parsedFiles.flatMap((f) => f.testCases), [parsedFiles])

  const allTags = useMemo(() => {
    const s = new Set<string>()
    allCases.forEach((tc) => tc.tags.forEach((t) => s.add(t)))
    return [...s].sort()
  }, [allCases])

  // ---------- Import ----------
  const importFiles = useCallback(async (fileList: FileList | File[]) => {
    const incoming: RawFile[] = []
    for (const f of Array.from(fileList)) {
      if (!/\.(md|markdown|txt)$/i.test(f.name)) continue
      incoming.push({ name: f.name, content: await f.text() })
    }
    if (!incoming.length) return
    setRawFiles((prev) => {
      const names = new Set(incoming.map((f) => f.name))
      return [...prev.filter((f) => !names.has(f.name)), ...incoming]
    })
    setSelectedGroup('')
  }, [])

  useEffect(() => {
    const onDrop = (e: DragEvent) => {
      e.preventDefault()
      setDragging(false)
      if (e.dataTransfer?.files?.length) importFiles(e.dataTransfer.files)
    }
    const onDragOver = (e: DragEvent) => {
      e.preventDefault()
      setDragging(true)
    }
    const onDragLeave = (e: DragEvent) => {
      if (!e.relatedTarget) setDragging(false)
    }
    window.addEventListener('drop', onDrop)
    window.addEventListener('dragover', onDragOver)
    window.addEventListener('dragleave', onDragLeave)
    return () => {
      window.removeEventListener('drop', onDrop)
      window.removeEventListener('dragover', onDragOver)
      window.removeEventListener('dragleave', onDragLeave)
    }
  }, [importFiles])

  // ---------- Lọc + sắp xếp ----------
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let rows = allCases
    if (selectedGroup) {
      const [file, group] = selectedGroup.split('::')
      rows = rows.filter((tc) => tc.sourceFile === file && (group === '' || tc.group === group))
    }
    if (priorityFilter.size) {
      rows = rows.filter((tc) => priorityFilter.has(tc.priority.toLowerCase()))
    }
    if (autoFilter) {
      rows = rows.filter((tc) => tc.automatable.toLowerCase() === autoFilter)
    }
    if (tagFilter) {
      rows = rows.filter((tc) => tc.tags.includes(tagFilter))
    }
    if (q) {
      rows = rows.filter((tc) =>
        [tc.id, tc.reqIds.join(' '), tc.title, tc.steps, tc.expected, tc.testData, tc.preCondition, tc.tags.join(' ')]
          .join(' ')
          .toLowerCase()
          .includes(q),
      )
    }
    const dir = sort.dir
    // Mọi cột đều tie-break bằng TC ID để thứ tự không đổi giữa các lần render.
    // Dấu * chỉ áp lên phép so sánh chính, KHÔNG áp lên tie-break — nếu không, các dòng
    // cùng giá trị sẽ đảo ngược theo hướng sort và trông như sort sai.
    const primary = (a: TestCase, b: TestCase): number => {
      switch (sort.key) {
        case 'id':
          return compareTcId(a.id, b.id)
        case 'title':
          return compareText(a.title, b.title)
        case 'group':
          return compareText(a.group, b.group)
        case 'priority':
          return (PRIORITY_ORDER[a.priority.toLowerCase()] ?? 9) - (PRIORITY_ORDER[b.priority.toLowerCase()] ?? 9)
        case 'risk':
          return (RISK_ORDER[a.risk.toLowerCase()] ?? 9) - (RISK_ORDER[b.risk.toLowerCase()] ?? 9)
      }
    }
    const sorted = [...rows]
    sorted.sort((a, b) => dir * primary(a, b) || compareTcId(a.id, b.id))
    return sorted
  }, [allCases, selectedGroup, priorityFilter, autoFilter, tagFilter, search, sort])

  const stats = useMemo(() => {
    const byP: Record<string, number> = {}
    filtered.forEach((tc) => {
      const p = tc.priority.toLowerCase() || 'khác'
      byP[p] = (byP[p] ?? 0) + 1
    })
    return byP
  }, [filtered])

  // Tên file xuất ra: bám theo file .md đang xem nếu chỉ có một, để dễ đối chiếu nguồn
  const exportBaseName = useMemo(() => {
    const selectedFile = selectedGroup.split('::')[0]
    const source = selectedFile || (rawFiles.length === 1 ? rawFiles[0].name : '')
    return source ? source.replace(/\.(md|markdown|txt)$/i, '') : 'test_cases'
  }, [selectedGroup, rawFiles])

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }))

  const sortIcon = (key: SortKey) => (sort.key !== key ? '↕' : sort.dir === 1 ? '↑' : '↓')

  const toggleExpand = (id: string) =>
    setExpanded((prev) => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })

  const removeFile = (name: string) => {
    setRawFiles((prev) => prev.filter((f) => f.name !== name))
    if (selectedGroup.startsWith(name + '::')) setSelectedGroup('')
  }

  // ---------- UI ----------
  return (
    // Khoá chiều cao ở viewport: chỉ vùng bảng được cuộn, còn top bar / sidebar / toolbar lọc đứng yên
    <div
      className="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-800"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >
      {/* Top bar */}
      <header className="z-20 shrink-0 border-b border-slate-700 bg-slate-900 text-slate-100">
        <div className="flex items-center gap-3 px-4 py-2.5">
          <img src={LOGO_DATA_URI} alt="Anh Tester" className="h-8 w-8 rounded-md" />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide">Test Cases Viewer</div>
            <div className="text-[11px] text-slate-400">Import file Markdown → tra cứu test cases</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.markdown,.txt"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) importFiles(e.target.files)
                e.target.value = ''
              }}
            />
            <Button
              size="sm"
              className="h-8 rounded-sm bg-brand-500 text-slate-900 hover:bg-brand-400"
              onClick={() => fileInputRef.current?.click()}
            >
              + Import file .md
            </Button>
            {rawFiles.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 rounded-sm border-slate-600 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white"
                onClick={() => {
                  setRawFiles([])
                  setSelectedGroup('')
                }}
              >
                Xoá tất cả
              </Button>
            )}
          </div>
        </div>
      </header>

      {dragging && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-brand-900/40">
          <div className="rounded-md border-2 border-dashed border-brand-300 bg-white px-10 py-8 text-lg font-semibold text-brand-800 shadow-xl">
            Thả file .md vào đây để import
          </div>
        </div>
      )}

      {rawFiles.length === 0 ? (
        /* ---------- Empty state ---------- */
        <div className="mx-auto mt-16 w-full max-w-xl overflow-y-auto px-4">
          <div
            className="cursor-pointer rounded-md border-2 border-dashed border-slate-300 bg-white px-8 py-14 text-center hover:border-brand-400 hover:bg-brand-50/30"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-sm bg-slate-900 font-mono text-lg font-bold text-teal-400">
              .md
            </div>
            <div className="text-base font-semibold text-slate-700">Kéo thả hoặc bấm để chọn file test cases</div>
            <p className="mt-2 text-sm text-slate-500">
              Hỗ trợ file Markdown chứa bảng test case có cột <code className="font-mono text-brand-700">TC ID</code>{' '}
              (output của <code className="font-mono text-brand-700">/generate-testcases-from-requirements</code>).
              Có thể import nhiều file — mỗi file là một module.
            </p>
          </div>
          <p className="mt-4 text-center text-xs text-slate-400">
            Dữ liệu chỉ xử lý trong trình duyệt của bạn, không gửi đi đâu cả. File đã import được nhớ lại cho lần mở sau.
          </p>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1">
          {/* ---------- Sidebar modules ---------- */}
          <aside className="w-64 shrink-0 overflow-y-auto border-r border-slate-200 bg-white">
            <div className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Modules
            </div>
            <button
              className={`block w-full px-3 py-1.5 text-left text-[13px] ${
                selectedGroup === '' ? 'bg-brand-50 font-semibold text-brand-800' : 'text-slate-600 hover:bg-slate-50'
              }`}
              onClick={() => setSelectedGroup('')}
            >
              Tất cả <span className="float-right font-mono text-xs text-slate-400">{allCases.length}</span>
            </button>
            {parsedFiles.map((pf) => {
              const groups = [...new Set(pf.testCases.map((tc) => tc.group))]
              const fileKey = pf.fileName + '::'
              return (
                <div key={pf.fileName} className="mt-1 border-t border-slate-100 pt-1">
                  <div className="group flex items-start justify-between gap-1 px-3 py-1">
                    <button
                      className={`min-w-0 flex-1 text-left text-[13px] font-semibold leading-snug ${
                        selectedGroup === fileKey ? 'text-brand-800' : 'text-slate-700 hover:text-brand-700'
                      }`}
                      title={pf.docTitle}
                      onClick={() => setSelectedGroup(fileKey)}
                    >
                      {pf.docTitle.replace(/^Manual Test Cases\s*[—-]\s*/i, '')}
                      <span className="ml-1.5 font-mono text-xs font-normal text-slate-400">
                        {pf.testCases.length}
                      </span>
                    </button>
                    <button
                      className="invisible mt-0.5 rounded px-1 font-mono text-xs text-slate-400 hover:bg-red-50 hover:text-red-600 group-hover:visible"
                      title={`Gỡ file ${pf.fileName}`}
                      onClick={() => removeFile(pf.fileName)}
                    >
                      ✕
                    </button>
                  </div>
                  {groups.map((g) => {
                    const key = pf.fileName + '::' + g
                    const count = pf.testCases.filter((tc) => tc.group === g).length
                    return (
                      <button
                        key={key}
                        className={`block w-full py-1 pl-6 pr-3 text-left text-[12.5px] leading-snug ${
                          selectedGroup === key
                            ? 'bg-brand-50 font-medium text-brand-800'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                        }`}
                        onClick={() => setSelectedGroup(key)}
                      >
                        {g || '(không nhóm)'}
                        <span className="float-right font-mono text-xs text-slate-400">{count}</span>
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </aside>

          {/* ---------- Main ---------- */}
          <main className="flex min-w-0 flex-1 flex-col px-4 py-3">
            {/* Toolbar */}
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo TC ID, REQ, nội dung steps, test data…"
                className="h-8 w-72 rounded-sm border-slate-300 bg-white text-[13px]"
              />
              {['Critical', 'High', 'Medium', 'Low'].map((p) => {
                const active = priorityFilter.has(p.toLowerCase())
                return (
                  <button
                    key={p}
                    className={`rounded-sm border px-2 py-1 text-[12px] font-medium leading-none ${
                      active
                        ? PRIORITY_STYLE[p.toLowerCase()] + ' ring-1 ring-current'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                    }`}
                    onClick={() =>
                      setPriorityFilter((prev) => {
                        const n = new Set(prev)
                        const k = p.toLowerCase()
                        if (n.has(k)) n.delete(k)
                        else n.add(k)
                        return n
                      })
                    }
                  >
                    {p}
                  </button>
                )
              })}
              <select
                value={autoFilter}
                onChange={(e) => setAutoFilter(e.target.value)}
                className="h-7 rounded-sm border border-slate-200 bg-white px-1.5 text-[12px] text-slate-600"
              >
                <option value="">Automation: tất cả</option>
                <option value="yes">Yes</option>
                <option value="partial">Partial</option>
                <option value="no">No</option>
              </select>
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="h-7 max-w-44 rounded-sm border border-slate-200 bg-white px-1.5 text-[12px] text-slate-600"
              >
                <option value="">Tag: tất cả</option>
                {allTags.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-1">
                <button
                  disabled={filtered.length === 0}
                  onClick={() => exportCsv(filtered, exportBaseName)}
                  title={`Xuất ${filtered.length} test case đang hiển thị ra file CSV (UTF-8)`}
                  className="rounded-sm border border-slate-200 bg-white px-2 py-1 text-[12px] font-medium leading-none text-slate-600 hover:border-brand-400 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
                >
                  ↓ CSV
                </button>
                <button
                  disabled={filtered.length === 0}
                  onClick={() => exportXlsx(filtered, exportBaseName)}
                  title={`Xuất ${filtered.length} test case đang hiển thị ra file Excel — mỗi nhóm một sheet`}
                  className="rounded-sm border border-slate-200 bg-white px-2 py-1 text-[12px] font-medium leading-none text-slate-600 hover:border-brand-400 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
                >
                  ↓ Excel
                </button>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-[12px] text-slate-500">
                <span className="font-mono font-semibold text-slate-700">{filtered.length}</span> TC
                {(['critical', 'high', 'medium', 'low'] as const).map(
                  (p) =>
                    (stats[p] ?? 0) > 0 && (
                      <span key={p} className={`rounded-sm border px-1.5 py-0.5 leading-none ${PRIORITY_STYLE[p]}`}>
                        {p.charAt(0).toUpperCase() + p.slice(1)} {stats[p]}
                      </span>
                    ),
                )}
              </div>
            </div>

            {/* Table */}
            <div className="mt-3 min-h-0 flex-1 overflow-auto rounded-sm border border-slate-200 bg-white">
              {/* border-separate thay cho border-collapse: sticky thead làm mất viền khi dùng border-collapse */}
              <table className="w-full min-w-[1180px] border-separate border-spacing-0 text-[13px]">
                <thead>
                  <tr className="text-left text-[11.5px] uppercase tracking-wide text-slate-500 [&>th]:sticky [&>th]:top-0 [&>th]:z-10 [&>th]:border-b [&>th]:border-slate-200 [&>th]:bg-slate-100">
                    <th className="w-8 px-2 py-2"></th>
                    <th
                      className="cursor-pointer whitespace-nowrap px-2 py-2 hover:text-slate-800"
                      onClick={() => toggleSort('id')}
                    >
                      TC ID <span className="text-slate-400">{sortIcon('id')}</span>
                    </th>
                    <th className="w-32 px-2 py-2">REQ</th>
                    <th
                      className="w-[38%] cursor-pointer px-2 py-2 hover:text-slate-800"
                      onClick={() => toggleSort('title')}
                    >
                      Test Scenario <span className="text-slate-400">{sortIcon('title')}</span>
                    </th>
                    <th
                      className="cursor-pointer whitespace-nowrap px-2 py-2 hover:text-slate-800"
                      onClick={() => toggleSort('group')}
                    >
                      Nhóm <span className="text-slate-400">{sortIcon('group')}</span>
                    </th>
                    <th
                      className="cursor-pointer whitespace-nowrap px-2 py-2 hover:text-slate-800"
                      onClick={() => toggleSort('priority')}
                    >
                      Priority <span className="text-slate-400">{sortIcon('priority')}</span>
                    </th>
                    <th
                      className="cursor-pointer whitespace-nowrap px-2 py-2 hover:text-slate-800"
                      onClick={() => toggleSort('risk')}
                    >
                      Risk <span className="text-slate-400">{sortIcon('risk')}</span>
                    </th>
                    <th className="whitespace-nowrap px-2 py-2">Auto</th>
                    <th className="px-2 py-2">Tags</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-10 text-center text-slate-400">
                        Không có test case nào khớp bộ lọc hiện tại.
                      </td>
                    </tr>
                  )}
                  {filtered.map((tc) => (
                    <CaseRow
                      key={tc.uid}
                      tc={tc}
                      open={expanded.has(tc.uid)}
                      onToggle={() => toggleExpand(tc.uid)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      )}
    </div>
  )
}

function CaseRow({ tc, open, onToggle }: { tc: TestCase; open: boolean; onToggle: () => void }) {
  return (
    <>
      <tr
        className={`cursor-pointer align-top hover:bg-brand-50/40 [&>td]:border-b [&>td]:border-slate-100 ${
          open ? 'bg-brand-50/60' : ''
        }`}
        onClick={onToggle}
      >
        <td className="px-2 py-1.5 text-center font-mono text-xs text-slate-400">{open ? '▾' : '▸'}</td>
        <td className="whitespace-nowrap px-2 py-1.5 font-mono text-[12px] font-semibold text-slate-700">{tc.id}</td>
        <td className="px-2 py-1.5">
          {tc.reqIds.map((r) => (
            <span
              key={r}
              className="mb-0.5 mr-1 inline-block whitespace-nowrap rounded-sm bg-slate-100 px-1 py-0.5 font-mono text-[10.5px] leading-none text-slate-600"
            >
              {r}
            </span>
          ))}
        </td>
        <td className="px-2 py-1.5 leading-snug">
          <MdText text={tc.title} />
        </td>
        <td className="w-40 px-2 py-1.5 text-[12px] leading-snug text-slate-500">{tc.group}</td>
        <td className="whitespace-nowrap px-2 py-1.5">
          <Pill value={tc.priority} styles={PRIORITY_STYLE} />
        </td>
        <td className="whitespace-nowrap px-2 py-1.5">
          <Pill value={tc.risk} styles={RISK_STYLE} />
        </td>
        <td className="whitespace-nowrap px-2 py-1.5">
          <Pill value={tc.automatable} styles={AUTO_STYLE} />
          {tc.autoType && tc.autoType.toLowerCase() !== 'n/a' && (
            <span className="ml-1 font-mono text-[10.5px] text-slate-400">{tc.autoType}</span>
          )}
        </td>
        <td className="max-w-52 px-2 py-1.5">
          {tc.tags.map((t) => (
            <span
              key={t}
              className="mb-0.5 mr-1 inline-block rounded-sm border border-slate-200 px-1 py-0.5 font-mono text-[10.5px] leading-none text-slate-500"
            >
              {t}
            </span>
          ))}
        </td>
      </tr>
      {open && (
        <tr className="bg-slate-50/70 [&>td]:border-b [&>td]:border-slate-200">
          <td></td>
          <td colSpan={8} className="px-2 pb-3 pt-1">
            <div className="grid gap-3 text-[12.5px] leading-relaxed md:grid-cols-2">
              <div className="rounded-sm border border-slate-200 bg-white p-2.5">
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-brand-700">Test Steps</div>
                <MdText text={tc.steps} />
              </div>
              <div className="rounded-sm border border-slate-200 bg-white p-2.5">
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-brand-700">
                  Expected Result
                </div>
                <MdText text={tc.expected} />
              </div>
              <div className="rounded-sm border border-slate-200 bg-white p-2.5">
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Pre-Condition
                </div>
                <MdText text={tc.preCondition} />
              </div>
              <div className="rounded-sm border border-slate-200 bg-white p-2.5">
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Test Data</div>
                <MdText text={tc.testData} />
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
