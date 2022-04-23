const sel_addBtn = document.getElementById('add-btn')
const sel_Modal = document.getElementById('add-modal')
const closeModalBtn = document.getElementById('closeModal-btn')
const sel_emailInp = document.getElementById('email-inp')
const sel_nameInp = document.getElementById('name-inp')
const sel_dayModal = document.getElementById('day-modal')
const sel_dayBtn = document.getElementById('day-btn')
const sel_message = document.getElementById('message')
const sel_saveBtn = document.getElementById('save-dayBtn')
const sel_subBtn = document.getElementById('submit-btn')
const sel_timeInp = document.getElementById('time-inp')
const sel_deleteBtn = document.querySelectorAll('.delete-notification')
const sel_timeDis = document.querySelectorAll('.time-dispaly')

let isEmailValidated = false 
let isNameValid = false 
let isDayValid = false
let isMessage = false
let selected_days = []

const hideModal = () => {
    sel_Modal.classList.toggle('hidden')
}

const hideDayModal = () => {
  sel_dayModal.classList.toggle('hidden')
}

const checkName = (name,x,elm) => {
  const name_len = name.length
  if(name_len < x){
    elm.style.borderColor = '#D5000090'
    isNameValid = false
  } else {
    elm.style.borderColor = '#21212190'
    isNameValid = true
    if(elm.id == "message"){
      isMessage = true
    }
  }
}

const checkEmail = (email) => {
  ex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i
  const checkE = ex.test(email)
  if(checkE){
    sel_emailInp.style.borderColor = '#21212190'
    isEmailValidated = true
  } else {
     sel_emailInp.style.borderColor = '#D5000090'
    isEmailValidated = false
  }
}

sel_addBtn.addEventListener('click', () => {
  hideModal()
})

closeModalBtn.addEventListener('click', () => {
  hideModal()
})

sel_emailInp.addEventListener('input', (e) => {
  checkEmail(e.target.value)
})

sel_nameInp.addEventListener('input', (e) =>{
  checkName(e.target.value,3,e.target)
})

sel_message.addEventListener('input', (e) =>{
  checkName(e.target.value,12,e.target)
})

sel_dayBtn.addEventListener('click', () => {
  hideDayModal()
})

const sel_allCheck = (x) => {
  if(x == false){
     document.querySelectorAll('ul > li:not(.first)').forEach((elm) => {
          elm.querySelector('input').checked = false
  })
  } else {
          document.querySelectorAll('ul > li:not(.first)').forEach((elm) => {
          elm.querySelector('input').checked = true
  })
  }
 }


document.querySelectorAll('ul > li > input')[0].addEventListener('click', (e) => { 
  if(e.target.checked == true){
    sel_allCheck()
  } else {
    sel_allCheck(false)
  }

})


sel_saveBtn.addEventListener('click', (e) => { 
  const days = []
    document.querySelectorAll('ul > li:not(.first)').forEach((elm) => {
        const elements = elm.querySelector('input')
        if(elements.checked){
          const day = elements.value
          days.push(day)
        }
      
      sel_dayBtn.textContent = days
      selected_days = days
  })
  
    hideDayModal()
  
    if(days.length == 0){
     sel_dayBtn.textContent = "Select Day" 
     isDayValid = false
    } else {
      isDayValid = true
    }
        
})

const submitForm = async () => {
  const checkTime = sel_timeInp.value == '' ? false : true
  if(isEmailValidated && isNameValid && isDayValid && isMessage && checkTime ){
    const email =  sel_emailInp.value
    const name = sel_nameInp.value
    const tim = new Date()
    const addZeroBefore = (n) => {
       return (n < 10 ? '0' : '') + n;
      }

    const sec = addZeroBefore(tim.getSeconds())
    const random = addZeroBefore(Math.floor(Math.random() * (50 - 0 + 1) + 0))
    const time =  sel_timeInp.value + ":" + sec + "+" + random 
    const message = sel_message.value
	
    const data = {
		email,
      		name,
      		selected_days,
      		time,
      		message
      }

    fetch('/api/save_notification', {
      method : 'POST',
      headers : {
	'Content-Type' : 'application/json'
      },
      body : JSON.stringify(data)
    }).then((res) => {
      return res.json()
    }).then((data) => {
     
      if(data.message){
	window.location = '/'
      } else {
	  sel_Modal.querySelectorAll('div')[0].style.borderTop = "2px solid #FF5252"
      }

    })

  } else {
    sel_Modal.querySelectorAll('div')[0].style.borderTop = "2px solid #FF5252"
  }
}

sel_subBtn.addEventListener('click', () => {
  submitForm()
})



sel_deleteBtn.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const id = e.target.parentElement.getAttribute('data-id')
    const c_div = document.createElement('div')
    const i_div = document.createElement('div')
    const s_div = document.createElement('div')

   const c_yBtn =  document.createElement('button')
   const c_nBtn =  document.createElement('button')
   const c_span = document.createElement('span')

    i_div.setAttribute('class', 'p-2 bg-white text-gray-600 rounded-md flex flex-col text-xl pl-3 pr-3')
    c_span.setAttribute('class', 'pb-2 font-semibold')
    c_yBtn.setAttribute('class', 'pl-2 pr-2 p-1 flex text-gray-300 bg-gray-900 hover:bg-opacity-90 rounded-lg')
    c_nBtn.setAttribute('class', 'pl-2 pr-2 p-1 flex text-white font-semibold bg-gray-600 bg-opacity-60 hover:bg-opacity-50 rounded-lg')
    s_div.setAttribute('class', 'flex space-x-3')

    c_span.textContent = "Are your Sure?"
    c_yBtn.textContent = "Yes"
    c_nBtn.textContent = "No"
	
    i_div.append(c_span)
    i_div.append(s_div)
    s_div.append(c_yBtn)
    s_div.append(c_nBtn)

    c_div.setAttribute('class', 'flex justify-center items-center absolute inset-0 bg-black bg-opacity-80 w-screen h-screen backdrop-blur')
    document.body.append(c_div)
    c_div.append(i_div)
    
      const data = { id : `${id}` }

    c_yBtn.addEventListener('click', (e) => {
      fetch('/api/remove', {
	method : 'POST',
	headers : {
	  'Content-Type' : 'application/json',
	},
	body :  JSON.stringify(data)
      })
	.then((res) => {
	return res.json()
      }).then((data) => {
	if(data.message ==  true){
		window.location = '/'
	}
      })
    })

    c_nBtn.addEventListener('click', (e) => {
      c_div.remove()
    })

})
})


