
let name = null;

function chooseName () {
  name = prompt("Qual seu lindo nome?")
  const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants",{"name": name})
  promise.then(processingSuccess); 
  promise.catch(processingError);
  
}

function searchingMessage(){
   const message = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages")
   message.then(
   function (response){
     for (let i=0; i < response.data.length; i++){
       creatingMessageOnscreen(response.data[i])
     }
   }); 
  }

function sending (){
   const text = document.querySelector("#campo-de-texto").value
   sendingMessages(text)
};
  
function sendingMessages(text){
  const send= axios.post("https://mock-api.driven.com.br/api/v4/uol/messages",
  {
    from:name,
    to:"Todos",
    text:text,
    type:"message"
  })
  send.then(searchingMessage)
  send.catch(window.location.reload)
}
function searchingParticipants(){
 const participants = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants")
}

function processingSuccess(response) { 
  setInterval(function checarStatus(){
    axios.post("https://mock-api.driven.com.br/api/v4/uol/status", {"name": name})
  }, 5000)
}

function processingError(error) {
  const statusCode = error.response.status;
	console.log(statusCode);
  if(statusCode == 400){
  name = prompt("Nome já usado. Escolha outro nome")
  const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants",{"name": name})
  promise.then(processingSuccess); 
  promise.catch(processingError);
  }
}

function reload(){
  setInterval(searchingMessage, 3000)
}

function creatingMessageOnscreen(message){
  if(message.type =="private_message" && message.to !== name){
    return
  }
  const comunication = document.createElement("div")
  comunication.setAttribute("data-identifier","message");
  comunication.classList.add("message")
  const hour = `<span class= "time">(${message.time})</span> `
  let space = document.querySelector(".available-space")
  if(message.type == "status"){
    comunication.innerHTML =`${hour}&nbsp;<span class="name">${message.from}</span>&nbsp;${message.text}`
    comunication.classList.add("grey-message")
  }
  else if(message.type == "private_message"){
    comunication.innerHTML =`${hour}&nbsp;<span class="name">${message.from}</span>&nbsp;reservadamente&nbsp;para&nbsp;<span class="name">${message.to}</span>:&nbsp; ${message.text}`
    comunication.classList.add("pink-message")
  }
  else if (message.type == "message"){
    comunication.innerHTML =`${hour}&nbsp;<span class="name">${message.from}</span>&nbsp;para&nbsp;<span class="name"> ${message.to}</span>:&nbsp; ${message.text}`
    comunication.classList.add("white-message")
  }
  space.appendChild(comunication)
  comunication.scrollIntoView()
}

reload()
chooseName()
searchingParticipants()