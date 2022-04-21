import express from 'express'
import { save_notification, delete_notification } from '../functions/main.js'

const router = express.Router()
router.use(express.json())

router.get('/', (req,res) => {
  res.json({ message : "Automatic Notification System API" })
})


router.post('/remove', (req,res) => {
    delete_notification(req,res)
})

router.post('/save_notification' , (req,res) => {
      save_notification(req,res)
})


router.use('/*' , express.static('public/html/error.html'))

export default router
