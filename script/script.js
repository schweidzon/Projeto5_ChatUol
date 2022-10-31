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

// Função para mandar o nome do usuário para o servidor. Além disso, ela executa as funções de pegar mensagem e pegar participantes do servidos e colocar na tela.

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

// Função para, quando apertar ENTER, o nome do usuário ser enviado para o servidor.

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

// Função para mandar para o servidor o status que o usuário está ativo, para o mesmo não desconectar.

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

// Função de status sendo executada a cada 5 segundos

setInterval(userStatus, 5000);

// Função para pegar as mensagens no servidos e chamar a função de mostrar na tela, no caso de sucesso.
  
function getMessages() {
    if (user !== undefined) {
        const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');  
        promise.then(renderMessages); 
        promise.catch(getMessagesErro);
        console.log('pegando mensagens');
        
    }
}  

// A cada 2 segundos, pegas as mensagens no servidos.

setInterval(getMessages, 2000);

// Função que recebe as mensagens do servidor, trata elas e renderiza na tela de acordo com o tipo de mensagem.

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
        window.location.reload();
    }
}

// Função para pegar os participantes ativos do servidos e chamar a função de colocar eles na tela;

function getParticipants() {    
    const participantsResponse = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    participantsResponse.then(renderParticipants);
    console.log('pegando participantes');
}

// Função que recebe os participantes ativos e renderiza na tela;

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

// Pega os participantes a cada 10 segundos;

setInterval(getParticipants, 10000);

// Função de mandar mensagem para o serivdor;

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

    if( selectedPerson !== undefined && selectedPrivacy === undefined) {
        mensagem = {from: user, to: selectedPerson.innerHTML, text:message , type: 'message'};
    } else if (selectedPerson !== undefined && selectedPrivacy !== undefined) {
        mensagem = {from: user, to: selectedPerson.innerHTML, text:message , type: selectedPrivacy};
        if (selectedPerson.innerHTML === 'Todos' && selectedPrivacy === 'private_message') {
            alert('Você não pode mandar mensagem Reservadamente para Todos');
            document.querySelector('.mensagem').value = "";
            return;
        }
       
    } else if ( selectedPerson === undefined && selectedPrivacy !== undefined) {
        mensagem = {from: user, to: 'Todos', text:message , type: selectedPrivacy};  
        if (selectedPrivacy.innerHTML=== 'Reservadamente') {
            alert('Você não pode mandar mensagem Reservadamente para Todos');
            document.querySelector('.mensagem').value = "";
            return;
        }
    } else if (selectedPerson === undefined && selectedPrivacy === undefined) {
        mensagem = {from: user, to: 'Todos', text:message , type: 'message'}; 
    }

    
   
    const sendMessages = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagem);
    sendMessages.then(sendMessagesSucess);
    sendMessages.catch(sendMessagesErro);

    document.querySelector('.mensagem').value = "";
}

// Função que chama a função de pegar mensagens do servidor quando mandamos uma mensagem;

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

// Função para selecionar os contatos e colocar eles na tela do menu mobile;

function selectContact(contact) {
    let selectPerson = document.querySelector('.contacts .selected');  
    
    if(selectPerson !== null) {
        selectPerson.classList.remove('selected');    
          
    }  

    contact.classList.add('selected'); 
    selectedPerson = document.querySelector('.contacts .selected p');  
    
    if(selectedPerson !== undefined && selectedPrivacy === undefined) {
        sendingMessatoTo.innerHTML = `Enviando para ${selectedPerson.innerHTML} (Público)`;

    } else if (selectedPerson === undefined && selectedPrivacy !== undefined) {
         if( selectedPrivacy === 'message' || selectedPrivacy.innerHTML === 'Público') {
            sendingMessatoTo.innerHTML = `Enviando para ${selectedPerson.innerHTML} (Público)`;
            
        } else if(selectedPrivacy === 'private_message' || selectedPrivacy.innerHTML === 'Reservadamente') {
            sendingMessatoTo.innerHTML = `Enviando para ${selectedPerson.innerHTML} (Reservadamente)`;
            
        }
      
    } else if (selectedPerson !== undefined && selectedPrivacy !== undefined){
        if( selectedPrivacy === 'message' || selectedPrivacy.innerHTML === 'Público') {
            sendingMessatoTo.innerHTML = `Enviando para ${selectedPerson.innerHTML} (Público)`;
            
        } else if(selectedPrivacy === 'private_message' || selectedPrivacy.innerHTML === 'Reservadamente') {
            sendingMessatoTo.innerHTML = `Enviando para ${selectedPerson.innerHTML} (Reservadamente)`;
            
        }
    }
}

// Função para escolher a tipo de mensagem a ser enviada (privada ou pública);

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

// Função para mandar a mensagem para o servidor e depois pegar as mensagens quando apertar ENTER;

message.addEventListener('keypress', function(e)  {
    if(e.keyCode === 13) {
        sendMessage();
    }
}) 

// Função para abrir o menu mobile;

function openMenu() {        
    mobileMenu.classList.remove('hidden');
    mobileMenu.classList.add('openMenu');
    shadow.classList.remove('hidden');
}

// Função para fechar o menu mobile quando clicar na parte escura;

function closeMenu() {
    if(!mobileMenu.classList.contains('openMenu')){
        return;
    }   
     mobileMenu.classList.remove('openMenu');
     shadow.classList.add('hidden');
}










