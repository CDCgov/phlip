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
    DONE = 2
  
    constructor() {}
    readAsArrayBuffer = () => arrayBufferOutput
    onload = () => {}
  }
}

export class File {
  constructor(name, size, blob) {
    this.name = name
    this.size = size
    this.blob = blob
  }
  
  slice() {
    return this.blob
  }
}

export class FileEntry {
  constructor(name, type, children, size, valid) {
    this.type = type
    this.children = children
    this.File = new File(name, size, valid)
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
  
  constructor(name, itemType, items) {
    this.name = name
    this.type = itemType
    this.items = items
  }
  
  webkitGetAsEntry() {
    return new FileEntry(this.name, this.type, this.items)
  }
}
