const mobileMenu = document.querySelector('.menu')
const chat = document.querySelector('.chat')
const chooseName = document.querySelector('.chooseName')
const container = document.querySelector('.container')
const contacts = document.querySelector('.contacts')
const shadow = document.querySelector('.shadow')
const sendingMessatoTo = document.querySelector('.sendingMessageTo')
const loading = document.querySelector('.loading')
const nameSelect = document.querySelector('.name')
let user, contactsList, selectedPerson, selectedPrivacy;


function sendName() {
    user = document.querySelector('.user').value  
    const name = {name: user}
    const sendName = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", name)
    loading.classList.remove('hidden')
    nameSelect.classList.add('hidden')
    sendName.catch(error)  

    setTimeout(() => {
        container.classList.remove('hidden')
        chooseName.classList.add('hidden')   
    }, 3000)


    setInterval(userStatus, 5000) 

    function getMessages() {
        if (user !== undefined) {
            setInterval(() => {                
                const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages') 
                promise.then(renderMessages) 
                console.log('pegando mensagens')
            }, 3000)
            const respostaParticipantes = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants')
            respostaParticipantes.then(getParticipants)
            setInterval(() => {
                const respostaParticipantes = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants')
                respostaParticipantes.then(getParticipants)
            }, 10000)
        }
        
    }
    getMessages();
}


function error(erro) {
    if (erro.response.status === 400) {
        alert('Nome de usuário já cadastrado, escolha outro nome.')
        window.location.reload();
    }
}

function userStatus() {
    const name = {name: user}
    const status = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', name)
}

function renderMessages(resposta) {   

    chat.innerHTML = ""
    const resultado = resposta.data
    
  for(let i = 0; i < resultado.length; i++) {    
  
     if(resultado[i].type === 'status') {
         chat.innerHTML += `
             <div class="status">
                 <div class="time">(${resultado[i].time})</div>
                 <div class="from">${resultado[i].from}:</div>
                 <div class="text">${resultado[i].text}</div>                
             </div> 
         `
        let el=  document.querySelector('.status:last-of-type').scrollIntoView();
       
     } else if ( resultado[i].type === 'message') {
         chat.innerHTML += `
             <div class="message">
                 <div class="time">(${resultado[i].time})</div>
                 <div class="from">${resultado[i].from}</div>
                 <p>para</p>
                 <div class="to">${resultado[i].to}:</div>
                 <div class="text">${resultado[i].text}</div>                
             </div>    
         ` 
         let el=  document.querySelector('.message:last-of-type').scrollIntoView();
     
     } else if (resultado[i].type === 'private_message' && resultado[i].to === user ||resultado[i].type === 'private_message' && resultado[i].from === user ) {
         chat.innerHTML += `
             <div class="private_message">
                 <div class="time">(${resultado[i].time})</div>
                 <div class="from">${resultado[i].from}</div>
                 <p>reservadamente para</p>
                 <div class="to">${resultado[i].to}:</div>
                 <div class="text">${resultado[i].text}</div>                
             </div>   
         ` 
         let el=  document.querySelector('.private_message:last-of-type').scrollIntoView();
         
     }
  }
}

function getParticipants(resposta) {    
    contacts.innerHTML = `
        <div class="menuItem selected" onclick="selectContact(this) ">
            <ion-icon name="person-circle"></ion-icon>
            <p data-identifier="participant">Todos</p>
            <div class="check"><ion-icon name="checkmark-outline"></ion-icon></div>
        </div>        
    `   
    const participants = resposta.data   

    for(let i =0 ; i < participants.length; i++) {
        contacts.innerHTML += `
            <div class="menuItem" onclick="selectContact(this) ">
                 <ion-icon name="person-circle"></ion-icon>
                 <p data-identifier="participant">${participants[i].name}</p>
                 <div class="check"><ion-icon name="checkmark-outline"></ion-icon></div>
            </div>        
        `
    }
    contactsList = document.querySelectorAll('.contacts .menuItem p')
    
}

function selectContact(contact) {
    let selectPerson = document.querySelector('.contacts .selected')  
    
    if(selectPerson !== null) {
        selectPerson.classList.remove('selected')    
          
    }  

    contact.classList.add('selected') 
    selectedPerson = document.querySelector('.contacts .selected p')  
    console.log(selectedPerson.innerHTML)

    if(selectedPerson!== undefined && selectedPrivacy!== undefined) {
        sendingMessatoTo.innerHTML = `Enviando para ${selectedPerson.innerHTML} (${selectedPrivacy.innerHTML})`
    }
  
}

function choosePrivacy(privacy) {
    
    let selectPrivacy = document.querySelector('.privacy .selected')      
    
    if(selectPrivacy !== null) {
        selectPrivacy.classList.remove('selected')         
       
    }  
   
    privacy.classList.add('selected')   
    selectedPrivacy = document.querySelector('.privacy .selected p')  
    console.log(selectedPerson)
    console.log(selectedPrivacy)

    if(selectedPerson!== undefined && selectedPrivacy!== undefined) {
        sendingMessatoTo.innerHTML = `Enviando para ${selectedPerson.innerHTML} (${selectedPrivacy.innerHTML})`
    }

}


function sendMessage() {

    const message = document.querySelector('.mensagem').value   
    let mensagem;

    if(message === '') {       
        return
    }

    if(selectedPerson!== undefined && selectedPrivacy !== undefined && selectedPrivacy.innerHTML === 'Reservadamente') {
        selectedPrivacy = 'private_message'

    } else if (selectedPerson!== undefined && selectedPrivacy !== undefined && selectedPrivacy.innerHTML === 'Público') {
        selectedPrivacy = 'message'
    }

    if( selectedPerson !== undefined && selectedPrivacy === undefined) {
        mensagem = {from: user, to: selectedPerson.innerHTML, text:message , type: 'message'};
        
    } else if (selectedPerson !== undefined && selectedPrivacy !== undefined) {
        mensagem = {from: user, to: selectedPerson.innerHTML, text:message , type: selectedPrivacy};
       
    } else if ( selectedPerson === undefined) {
        mensagem = {from: user, to: 'Todos', text:message , type: 'message'};      
    }

   
    const sendMessages = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagem)
    sendMessages.catch(loginError)

    document.querySelector('.mensagem').value = ""
    
}

function loginError(erro) {
    if (erro.response.status === 400) {
        alert('Você não está mais na sala, por favor digite novamente seu nome')
        window.location.reload();
        }

}

function openMenu(item) {        
    mobileMenu.classList.remove('hidden')
    mobileMenu.classList.add('openMenu')
    shadow.classList.remove('hidden')
}

function closeMenu() {
    if(!mobileMenu.classList.contains('openMenu')){
        return
    }   
        mobileMenu.classList.remove('openMenu')
        shadow.classList.add('hidden')
    
}










