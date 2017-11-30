const sortList = (list, sortBy, direction) => {
  return (
    direction === 'asc'
      ? list.sort((a, b) => (a[sortBy] < b[sortBy] ? -1 : 1))
      : list.sort((a, b) => (b[sortBy] < a[sortBy] ? -1 : 1))
  )
}

export default sortList