const express = require('express')
const app = express()

app.use(express.static('./dist/'))
app.use('/', express.static('./dist/index.html'))
app.use('*', express.static('./dist/index.html'))
app.listen(5200, '0.0.0.0')
