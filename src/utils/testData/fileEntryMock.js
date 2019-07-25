export class Reader {
  hasRead = false
  
  constructor(entries) {
    this.entries = entries
  }
  
  readEntries = (scb, fcb) => {
    scb(!this.hasRead ? this.entries : [])
    this.hasRead = true
  }
}

export const getFileReader = arrayBufferOutput => {
  return class FileReader {
    constructor() {}
    readAsArrayBuffer = () => {
      this.onload({ target: { result: arrayBufferOutput, readyState: 2 } })
    }
    onload = () => {}
  }
}

export class File {
  constructor(name, size) {
    this.name = name
    this.size = size
  }
  
  slice() {
    return ''
  }
}

export class FileEntry {
  constructor(name, type, children, size) {
    this.type = type
    this.children = children
    this.File = new File(name, size)
  }
  
  get isFile() {
    return this.type === 'file'
  }
  
  get isDirectory() {
    return this.type === 'dir'
  }
  
  file = cb => {
    cb(this.File)
  }
  
  createReader = () => new Reader(this.children)
}

export class DataTransferItem {
  name = ''
  type = ''
  items = []
  
  constructor(name, itemType, items, size, valid) {
    this.name = name
    this.type = itemType
    this.items = items
    this.fileEntry = new FileEntry(name, itemType, items, size, valid)
  }
  
  webkitGetAsEntry() {
    return this.fileEntry
  }
}
