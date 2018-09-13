const docManageCalls = [
  {
    name: 'upload',
    method: 'post',
    path: () => '/doc/upload',
    headers: ({ tokenObj }) => ({ Authorization: `Bearer ${tokenObj.token}` })
  }
]

export default docManageCalls