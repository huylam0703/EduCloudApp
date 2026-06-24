import api from './api'

export const activityLogService = {
  getAllLogs: async (page = 0, size = 10) => {
    const { data } = await api.get(
      `/activity-log/all?page=${page}&size=${size}`
    )

    return data.result
  },
}