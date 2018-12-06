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
  },
  {
    name: 'getDocumentContents',
    method: 'get',
    path: ({ docId }) => `/docs/${docId}/contents`
  },
  {
    name: 'updateDoc',
    method: 'post',
    path: () =>'/docs/update'
  }
]

export default docManageCalls