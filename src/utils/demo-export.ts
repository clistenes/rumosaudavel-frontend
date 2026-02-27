type CsvRow = Record<string, string | number | boolean | null | undefined>

const normalizeCell = (value: CsvRow[string]) => {
  if (value === null || value === undefined) return ''
  const raw = String(value)
  if (raw.includes('"') || raw.includes(';') || raw.includes('\n')) {
    return `"${raw.replace(/"/g, '""')}"`
  }
  return raw
}

export const exportCsv = (filename: string, rows: CsvRow[]) => {
  if (typeof window === 'undefined') return
  if (!rows.length) return

  const headers = Object.keys(rows[0])
  const csv = [
    headers.join(';'),
    ...rows.map((row) => headers.map((header) => normalizeCell(row[header])).join(';')),
  ].join('\n')

  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
