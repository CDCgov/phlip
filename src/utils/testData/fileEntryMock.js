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

export class FileEntry {
  constructor(name, type, children) {
    this.name = name
    this.type = type
    this.children = children
  }
  
  get isFile() {
    return this.type === 'file'
  }
  
  get isDirectory() {
    return this.type === 'dir'
  }
  
  file = cb => {
    cb({ name: this.name })
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
