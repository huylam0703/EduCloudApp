export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  STAFF: 'STAFF',
  MANAGER: 'MANAGER',
}

export const FILE_TYPES = ['PDF', 'DOCX', 'PPTX', 'XLSX', 'ZIP']

export const MAX_SIZES = {
  PDF: 50 * 1024 * 1024,
  DOCX: 30 * 1024 * 1024,
  PPTX: 100 * 1024 * 1024,
  XLSX: 50 * 1024 * 1024,
  ZIP: 200 * 1024 * 1024,
}

export const VISIBILITY = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
}

export const STORAGE_QUOTA = 5 * 1024 * 1024 * 1024

export const MAJORS = [
  { id: 'cntt', name: 'CNTT', code: 'CNTT' },
  { id: 'mmt', name: 'MMT', code: 'MMT' },
  { id: 'khdl', name: 'KHDL', code: 'KHDL' },
]

export const SEMESTERS = [
  { id: 'hk1', name: 'Học kỳ 1', code: 'HK1' },
  { id: 'hk2', name: 'Học kỳ 2', code: 'HK2' },
]

export const SUBJECTS = [
  { id: 'cc', name: 'Cloud Computing', majorId: 'cntt' },
  { id: 'ds', name: 'Cấu trúc dữ liệu', majorId: 'cntt' },
  { id: 'web', name: 'Lập trình Web', majorId: 'cntt' },
]
