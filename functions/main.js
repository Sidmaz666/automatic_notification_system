import mongoose from 'mongoose'
import NotificationModel from './NotificatonModel.js'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const db_uri = process.env.DB_URI

export async function save_notification(req,res){

  let isRes = false 

  if(req.body.time !== ""){
	isRes = true
    	const name = req.body.name
    	const email = req.body.email
    	const days = req.body.selected_days
    	const time = req.body.time
    	const message = req.body.message
    	const userData = { 
		email,
	  	name,
	  	days,
	  	time,
	  	message
   	 }	 

	await mongoose.connect(db_uri,{useNewUrlParser: true, useUnifiedTopology: true})
      	.then(async () => {
 		await new NotificationModel(userData).save()
	}).catch((err) => {
		console.log(`Error : ${err}`)
	})
    	
  } 	

  res.json({ message : isRes })

}


export async function fetch_notifications(req,res){
	 mongoose.connect(db_uri,{useNewUrlParser: true, useUnifiedTopology: true})
      	.then(async () => {
	
	   NotificationModel.find({}, async (err,item) => {
	    		const items = await item
			res.render('index', { items })
	  })

	})
}

export async function delete_notification(req,res){
    const id = req.body.id

	 mongoose.connect(db_uri,{useNewUrlParser: true, useUnifiedTopology: true})
      	.then(async () => {
	  
	  NotificationModel.findByIdAndRemove({ _id : `${id}` } , (err) => {
	    if(!err){
	      res.json({ message : true })
	    }
	  })

	})

}

export async function cornJob(){

	mongoose.connect(db_uri,{useNewUrlParser: true, useUnifiedTopology: true})
      	.then(() => {

	   NotificationModel.find({}, (err,items) => {

		const all_items = items

		 const addZeroBefore = (n) => {
		     return (n < 10 ? '0' : '') + n;
		  }

	    	for(let x in all_items){	      	

		 const user_id = items[x]._id + Date.now()
		 const user_set_time = items[x].time
		 const user_set_name = items[x].name
		 const user_set_email = items[x].email
		 const user_set_day = items[x].days
		 const user_set_message = items[x].message

		  const set_timezone = "Asia/Calcutta"
		  const today = new Date(new Date().toLocaleString("en-US", {timeZone: set_timezone }).toString())
		  const current_time = addZeroBefore(today.getHours()) + ":" + addZeroBefore(today.getMinutes()) + ":" + addZeroBefore(today.getSeconds())

		  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		
		  console.log({today,current_time,user_set_time, timezone , set_timezone})
		  
		  const dayList = ["sunday","monday","tuesday","wednesday ","thursday","friday","saturday"]
		  const current_day = dayList[today.getDay()]


		  for(let y in user_set_day){
		    
		    const user_day = user_set_day[y]

		    const isDayMatched = user_day == user_set_day ? true : false
		    
		    if(isDayMatched == true){
	
		      const isTimeMatched = user_set_time == current_time ? true : false

 		      if(isTimeMatched == true){
			
			send_mail(user_set_email,user_set_name,user_set_message)
			break
			

		      }
		    }
		  }
	    	}
	    })
	})
    setTimeout(function(){cornJob()},1000)
}

 	async function send_mail(email,name,message){
	
	    try{
	    console.log(`Send Mail ${email} , ${name} ${message}`)
	      const transporter = nodemailer.createTransport({
    		service: 'gmail',
 	 	         auth: {
        		 user: process.env.EMAIL,
       			 pass: process.env.PASS
    			}
		});

		const mailOptions = {
		  from: `Automated Notification System <${process.env.EMAIL}>`, 
   		  to: email, 
 		  subject: 'Automated Notification', 
  		  html: `<h1>Hello ${name}, ${message}</h1>`,
		  text: `Hello ${name}, ${message}`
		}

		transporter.sendMail(mailOptions, function (err, info) {
  		  if(err)
        		console.log(err)
    		else
        		console.log(info);
		})

	    } catch(error){
	      console.log({error})
	    }
	    return
	    }


