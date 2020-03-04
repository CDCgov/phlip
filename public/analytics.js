if (typeof window.enquire !== 'undefined') {
  window.enquire.register(window.CDC.Global.selectors.vp1, function () {
    window.s.prop49 = 1
  })
  window.enquire.register(window.CDC.Global.selectors.vp2, function () {
    window.s.prop49 = 2
  })
  window.enquire.register(window.CDC.Global.selectors.vp3, function () {
    window.s.prop49 = 3
  })
  window.enquire.register(window.CDC.Global.selectors.vp4, function () {
    window.s.prop49 = 4
  })
}

if (navigator.appVersion.indexOf('MSIE') >= 0) {
  document.write(unescape('%3C') + '\!-' + '-')
}