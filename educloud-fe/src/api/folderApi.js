import axiosClient from '@/lib/apiClient.js'

export const folderApi = {
    getAll: async () => await axiosClient.get('/folder/getAll'),
    getDetail: (folderId) => axiosClient.get(`/folder/getDetail/${folderId}`),
    createFolder: (folderName, parentFolderId = null) =>
        axiosClient.post('/folder/create', {
            folderName,
            parentFolderId,
        }),
}