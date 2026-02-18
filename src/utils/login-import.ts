export const normalizeLogin = (value: string): string => {
  const raw = value.trim().toLowerCase()
  if (!raw) return ''
  return raw.includes('@') ? raw.split('@')[0] : raw
}

export type LoginCandidate = {
  value: string
  line: number
  column: number
}

export const extractLoginCandidatesDetailedFromText = (content: string): LoginCandidate[] => {
  const lines = content.split(/\r?\n/)
  const candidates: LoginCandidate[] = []

  lines.forEach((lineContent, lineIndex) => {
    const cells = lineContent.split(/[;,]/)
    cells.forEach((cell, cellIndex) => {
      const value = String(cell || '').trim()
      if (!value) return
      const lowered = value.toLowerCase()
      if (lowered === 'login' || lowered === 'email') return
      candidates.push({
        value,
        line: lineIndex + 1,
        column: cellIndex + 1,
      })
    })
  })

  return candidates
}

export const extractLoginCandidatesFromText = (content: string): string[] => {
  return extractLoginCandidatesDetailedFromText(content).map((item) => item.value)
}

const extractCandidatesDetailedFromSheetRows = (rows: unknown[][]): LoginCandidate[] => {
  if (rows.length === 0) return []

  const headerRow = (rows[0] || []).map((cell) => String(cell || '').trim().toLowerCase())
  const loginColumnIndex = headerRow.findIndex((cell) => cell === 'login' || cell === 'email')
  const startRow = loginColumnIndex >= 0 ? 1 : 0

  if (loginColumnIndex >= 0) {
    return rows
      .slice(startRow)
      .map((row, rowIndex) => ({
        value: String(row[loginColumnIndex] || '').trim(),
        line: rowIndex + startRow + 1,
        column: loginColumnIndex + 1,
      }))
      .filter((item) => item.value.length > 0)
  }

  const candidates: LoginCandidate[] = []

  rows.slice(startRow).forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      const value = String(cell || '').trim()
      if (!value) return
      candidates.push({
        value,
        line: rowIndex + startRow + 1,
        column: cellIndex + 1,
      })
    })
  })

  return candidates
}

export const extractLoginCandidatesDetailedFromFile = async (file: File): Promise<LoginCandidate[]> => {
  const extension = file.name.split('.').pop()?.toLowerCase() || ''

  if (extension === 'csv' || extension === 'txt') {
    const content = await file.text()
    return extractLoginCandidatesDetailedFromText(content)
  }

  if (extension === 'xlsx' || extension === 'xls') {
    const xlsx = await import('xlsx')
    const buffer = await file.arrayBuffer()
    const workbook = xlsx.read(buffer, { type: 'array' })
    const firstSheetName = workbook.SheetNames[0]
    if (!firstSheetName) return []
    const sheet = workbook.Sheets[firstSheetName]
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, raw: false }) as unknown[][]
    return extractCandidatesDetailedFromSheetRows(rows)
  }

  throw new Error('Formato invalido. Use CSV, TXT, XLSX ou XLS.')
}

export const extractLoginCandidatesFromFile = async (file: File): Promise<string[]> => {
  return (await extractLoginCandidatesDetailedFromFile(file)).map((item) => item.value)
}

export const extractLoginsFromFile = async (file: File): Promise<string[]> => {
  const candidates = await extractLoginCandidatesFromFile(file)
  return candidates
    .map((value) => normalizeLogin(value))
    .filter(Boolean)
}
