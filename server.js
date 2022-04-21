import express from 'express'
import  handleMain from './routes/main.js'
import  handleApi from './routes/api.js'
import { cornJob  } from './functions/main.js'
 

const server = express()
const port = process.env.PORT || 8080


const backlog = () => {
    console.log(`Running at http://localhost:${port}`)
    cornJob()
}

server.use(express.static('public'))
server.set('view engine','ejs')

server.use('/', handleMain)
server.use('/api', handleApi)

server.listen(port, backlog)
