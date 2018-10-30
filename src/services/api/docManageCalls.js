const docManageCalls = [
  {
    name: 'verifyUpload',
    method: 'post',
    path: () => '/docs/verifyUpload'
  },
  {
    name: 'upload',
    method: 'post',
    path: () => '/docs/upload',
    headers: () => ({ 'Content-Type': 'multipart/form-data' })
  },
  {
    name: 'getDocs',
    method: 'get',
    path: () => '/docs'
  },
  {
    name: 'extractInfo',
    method: 'post',
    path: () => '/docs/upload/extractInfo',
    headers: () => ({ 'Content-Type': 'multipart/form-data' })
  }
]

export default docManageCalls