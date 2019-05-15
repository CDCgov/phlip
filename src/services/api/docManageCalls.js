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
    method: 'put',
    path: ({ docId }) => `/docs/${docId}`
  },
  {
    name: 'deleteDoc',
    method: 'delete',
    path: ({ docId }) => `/docs/${docId}`
  },
  {
    name: 'getDocumentsByProjectJurisdiction',
    method: 'get',
    path: ({ projectId, jurisdictionId }) => `/docs/projects/${projectId}/jurisdictions/${jurisdictionId}`
  },
  {
    name:'bulkDeleteDoc',
    method: 'post',
    path:  () => `/docs/bulkDelete`
  },
  {
    name:'bulkUpdateDoc',
    method: 'post',
    path:  () => `/docs/bulkUpdate`
  },
  {
    name:'cleanProject',
    method: 'put',
    path:  ({ projectId }) => `/docs/cleanProjectList/${projectId}`
  }

]

export default docManageCalls
