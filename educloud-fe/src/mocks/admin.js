export const mockAdminStats = {
  totalUsers: 1243,
  totalDocuments: 8924,
  totalStorage: 26306674688,
  uploadsToday: 18,
  downloadsToday: 234,
  deletedToday: 3,
  uploadByDay: [
    { day: 'T2', count: 12 },
    { day: 'T3', count: 18 },
    { day: 'T4', count: 15 },
    { day: 'T5', count: 22 },
    { day: 'T6', count: 19 },
    { day: 'T7', count: 8 },
    { day: 'CN', count: 18 },
  ],
  majorDistribution: [
    { name: 'CNTT', value: 45 },
    { name: 'MMT', value: 30 },
    { name: 'KHDL', value: 25 },
  ],
}

export const mockUsers = [
  { id: '1', firstName: 'Nguyễn', lastName: 'Văn A', email: 'a@edu.vn', username: 'nguyenvana', roles: [{ name: 'USER' }], status: 'ACTIVE', storageUsed: 1073741824, createdAt: '2024-01-15' },
  { id: '2', firstName: 'Admin', lastName: 'System', email: 'admin@edu.vn', username: 'admin', roles: [{ name: 'ADMIN' }], status: 'ACTIVE', storageUsed: 524288000, createdAt: '2024-01-01' },
  { id: '3', firstName: 'Trần', lastName: 'B', email: 'b@edu.vn', username: 'tranb', roles: [{ name: 'USER' }], status: 'BLOCKED', storageUsed: 0, createdAt: '2024-06-20' },
]

export const mockActivityLogs = [
  { id: '1', user: 'nguyenvana', action: 'UPLOAD_DOCUMENT', entity: 'document', detail: 'Cloud.pdf', ip: '192.168.1.1', time: '2025-05-30T10:00:00' },
  { id: '2', user: 'tranb', action: 'DOWNLOAD_DOCUMENT', entity: 'document', detail: 'Lab.zip', ip: '192.168.1.2', time: '2025-05-30T09:30:00' },
  { id: '3', user: 'admin', action: 'DELETE_DOCUMENT', entity: 'document', detail: 'spam.pdf', ip: '10.0.0.1', time: '2025-05-29T15:00:00' },
  { id: '4', user: 'nguyenvana', action: 'CREATE_FOLDER', entity: 'folder', detail: 'Lab', ip: '192.168.1.1', time: '2025-05-28T11:00:00' },
]
