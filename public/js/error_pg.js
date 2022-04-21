window.onload = async function(){
  const re = await fetch('https://api.thecatapi.com/v1/images/search', {
    method: 'GET',
    headers : {
      'Content-Type' : 'application/json'
    }
  })

  const data = await re.json()
  document.querySelector('#err-img').src = data[0].url
}
