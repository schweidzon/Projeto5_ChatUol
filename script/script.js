const mobileMenu = document.querySelector('.menu');
const chat = document.querySelector('.chat');
const chooseName = document.querySelector('.chooseName');
const container = document.querySelector('.container');
const contacts = document.querySelector('.contacts');
const shadow = document.querySelector('.shadow');
const sendingMessatoTo = document.querySelector('.sendingMessageTo');
const loading = document.querySelector('.loading');
const nameSelect = document.querySelector('.name');
let user, selectedPerson, selectedPrivacy;

function sendName() {
    user = document.querySelector('.user').value;  
    if(user === "" ) {
        alert('Escolha um nome de usuário');
        return;
    }
    const name = {name: user};
    const sendName = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", name);
    sendName.then(sendNameSuccess);
    sendName.catch(sendNameErro);  
    loading.classList.remove('hidden');
    nameSelect.classList.add('hidden');

    sendingMessatoTo.innerHTML = `Enviando para Todos (Público)`;
    getMessages();
    getParticipants();
}

nameSelect.addEventListener('keypress', function(e) {
    if(e.keyCode === 13) {
        sendName();
    }
})

function sendNameSuccess(response) {

    if(response.status === 200) {
        setTimeout(() => {
            container.classList.remove('hidden');
            chooseName.classList.add('hidden');   
        }, 1200)
    }
}

function sendNameErro(erro) {
    if (erro.response.status === 400) {
        alert('Nome de usuário já cadastrado, escolha outro nome.');
        window.location.reload();
    }
}



function userStatus() {
    if ( user !== undefined) {
        const name = {name: user};
        const status = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', name);
        status.then(userStatusSuccess);
        status.catch(userStatusErro);
    }
}

function userStatusSuccess(response) {
    if(response.status === 200) {
        console.log('mandando status');
    }
}

function userStatusErro(erro) {
    if(erro.status === 400) {
        console.log('não esta mandando status');
    }
}

setInterval(userStatus, 5000);
  
function getMessages() {
    if (user !== undefined) {
        const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');  
        promise.then(renderMessages); 
        promise.catch(getMessagesErro);
        console.log('pegando mensagens');
        
    }
}  

setInterval(getMessages, 2000);

function renderMessages(response) {   

    chat.innerHTML = "";
    const resultado = response.data;
    
   
    
  for(let i = 0; i < resultado.length; i++) {    
    
     if(resultado[i].type === 'status') {
         chat.innerHTML += `
             <div class="status">
                 <div class="time">(${resultado[i].time})</div>
                 <div class="from">${resultado[i].from}:</div>
                 <div class="text">${resultado[i].text}</div>                
             </div> 
         `
         const el=  document.querySelector('.status:last-of-type').scrollIntoView();
       
      
       
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
         const el=  document.querySelector('.message:last-of-type').scrollIntoView();
        
         
     
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
            const el=  document.querySelector('.private_message:last-of-type').scrollIntoView();
     }
  }
  
}

function getMessagesErro(erro) {
    if(erro.response.status === 400) {
        alert('Erro ao recuperar mensagens');
        window.location.reload()
    }
}

function getParticipants() {    
    const participantsResponse = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    participantsResponse.then(renderParticipants);
    console.log('pegando participantes');
}

function renderParticipants(response) {

    if(response.status === 200) {
        contacts.innerHTML = `
            <div class="menuItem selected" onclick="selectContact(this) ">
                <ion-icon name="person-circle"></ion-icon>
                <p data-identifier="participant">Todos</p>
                <div class="check"><ion-icon name="checkmark-outline"></ion-icon></div>
            </div>        
         `   
        const participants = response.data;   

        for(let i =0 ; i < participants.length; i++) {
            contacts.innerHTML += `
                <div class="menuItem" onclick="selectContact(this) ">
                    <ion-icon name="person-circle"></ion-icon>
                    <p data-identifier="participant">${participants[i].name}</p>
                    <div class="check"><ion-icon name="checkmark-outline"></ion-icon></div>
                </div>        
            `
        }
    }
}

setInterval(getParticipants, 10000);

function sendMessage() {

    const message = document.querySelector('.mensagem').value;   
    let mensagem;

    if(message === '') {       
        return;
    }

    if(selectedPerson!== undefined && selectedPrivacy !== undefined && selectedPrivacy.innerHTML === 'Reservadamente') {
        selectedPrivacy = 'private_message';

    } else if (selectedPerson!== undefined && selectedPrivacy !== undefined && selectedPrivacy.innerHTML === 'Público') {
        selectedPrivacy = 'message';
    }

    console.log(selectedPrivacy)
    console.log(selectedPerson)

    if( selectedPerson !== undefined && selectedPrivacy === undefined) {
        mensagem = {from: user, to: selectedPerson.innerHTML, text:message , type: 'message'};
        
    } else if (selectedPerson !== undefined && selectedPrivacy !== undefined) {
        mensagem = {from: user, to: selectedPerson.innerHTML, text:message , type: selectedPrivacy};
        if (selectedPerson.innerHTML === 'Todos' && selectedPrivacy === 'private_message') {
            alert('Você não pode mandar mensagem Reservadamente para Todos')
            document.querySelector('.mensagem').value = "";
            return
        }
       
    } else if ( selectedPerson === undefined && selectedPrivacy !== undefined) {
        mensagem = {from: user, to: 'Todos', text:message , type: selectedPrivacy};  
        if (selectedPrivacy.innerHTML=== 'Reservadamente') {
            alert('Você não pode mandar mensagem Reservadamente para Todos')
            document.querySelector('.mensagem').value = "";
            return
        }
    } else if (selectedPerson === undefined && selectedPrivacy === undefined) {
        mensagem = {from: user, to: 'Todos', text:message , type: 'message'}; 
    }

    
   
    const sendMessages = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagem);
    sendMessages.then(sendMessagesSucess);
    sendMessages.catch(sendMessagesErro);

    document.querySelector('.mensagem').value = "";
}

function sendMessagesSucess(response) {
    if(response.status === 200) {
        getMessages();
        console.log('pegando msg depois de mandar');
        
    }
}

function sendMessagesErro(erro) {
    if (erro.response.status === 400) {
        alert('Você não está mais na sala, por favor digite novamente seu nome');
        window.location.reload();

    }
}

function selectContact(contact) {
    let selectPerson = document.querySelector('.contacts .selected');  
    
    if(selectPerson !== null) {
        selectPerson.classList.remove('selected');    
          
    }  

    contact.classList.add('selected') 
    selectedPerson = document.querySelector('.contacts .selected p');  
    console.log(selectedPerson.innerHTML);

    if(selectedPerson !== undefined && selectedPrivacy === undefined) {
        sendingMessatoTo.innerHTML = `Enviando para ${selectedPerson.innerHTML} (Público)`;
        
    } else if (selectedPerson === undefined && selectedPrivacy !== undefined) {
         if( selectedPrivacy === 'message') {
            sendingMessatoTo.innerHTML = `Enviando para ${selectedPerson.innerHTML} (Público)`;
        } else if(selectedPrivacy === 'private_message') {
            sendingMessatoTo.innerHTML = `Enviando para ${selectedPerson.innerHTML} (Reservadamente)`;
        }
      
    } else if (selectedPerson !== undefined && selectedPrivacy !== undefined){
        if( selectedPrivacy === 'message') {
            sendingMessatoTo.innerHTML = `Enviando para ${selectedPerson.innerHTML} (Público)`;
        } else if(selectedPrivacy === 'private_message') {
            sendingMessatoTo.innerHTML = `Enviando para ${selectedPerson.innerHTML} (Reservadamente)`;
        }
       

    }

   
  
}

function choosePrivacy(privacy) {
    
    let selectPrivacy = document.querySelector('.privacy .selected');      
    
    if(selectPrivacy !== null) {
        selectPrivacy.classList.remove('selected');         
       
    }  
   
    privacy.classList.add('selected');   
    selectedPrivacy = document.querySelector('.privacy .selected p');  
    console.log(selectedPerson);
    console.log(selectedPrivacy);

    if(selectedPerson === undefined && selectedPrivacy !== undefined ) {
        sendingMessatoTo.innerHTML = `Enviando para Todos (${selectedPrivacy.innerHTML})`;
    } else if( selectedPerson!== undefined && selectedPrivacy!== undefined) {

        sendingMessatoTo.innerHTML = `Enviando para ${selectedPerson.innerHTML} (${selectedPrivacy.innerHTML})`;
    }

    
}

const message = document.querySelector('.mensagem');

message.addEventListener('keypress', function(e)  {
    if(e.keyCode === 13) {
        sendMessage();
    }
}) 


function openMenu() {        
    mobileMenu.classList.remove('hidden');
    mobileMenu.classList.add('openMenu');
    shadow.classList.remove('hidden');
}

function closeMenu() {
    if(!mobileMenu.classList.contains('openMenu')){
        return;
    }   
     mobileMenu.classList.remove('openMenu');
     shadow.classList.add('hidden');
}










