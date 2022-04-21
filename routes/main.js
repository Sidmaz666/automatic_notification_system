import express from 'express'
import { fetch_notifications }  from '../functions/main.js'

const router = express.Router()

router.get('/', (req,res) => {
    fetch_notifications(req,res)
})


router.use('/*' , express.static('public/html/error.html'))

export default router
