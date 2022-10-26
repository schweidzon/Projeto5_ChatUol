const mobileMenu = document.querySelector('.menu')
const chat = document.querySelector('.chat')
const chooseName = document.querySelector('.chooseName')
const container = document.querySelector('.container')
const contacts = document.querySelector('.contacts')
let user;



function sendName() {
    container.classList.remove('hidden')
    chooseName.classList.add('hidden')    
    user = document.querySelector('.user').value         
    
    if (user !== undefined) {
        setInterval(() => {
            const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages') 
            promise.then(render) 
            const respostaParticipantes = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants')
            respostaParticipantes.then(getParticipants)
            console.log('mandando')
        }, 3000)
    }
}

function render(resposta) {
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
        
        } else if (resultado[i].type === 'private_message' && resultado[i].to === user) {
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
    contacts.innerHTML = ""
    const participants = resposta.data   

    for(let i =0 ; i < participants.length; i++) {
        contacts.innerHTML += `
            <div class="menuItem" onclick="selectContact(this)">
                 <ion-icon name="person-circle"></ion-icon>
                 <p>${participants[i].name}</p>
                 <div class="check"><ion-icon name="checkmark-outline"></ion-icon></div>
            </div>        
        `
    }
}

function openMenu(item) {        
    mobileMenu.classList.add('openMenu')
}

function closeMenu() {
    if(!mobileMenu.classList.contains('openMenu')){
        return
    }   
        mobileMenu.classList.remove('openMenu')
    
}

function selectContact(contact) {
    let selectedPerson = document.querySelector('.contacts .selected')  
    //let selectedPrivacy = document.querySelector('.privacy .selected')   
    
    if(selectedPerson !== null) {
        selectedPerson.classList.remove('selected')         
       
    }  
    /* NÃO SEI SE VAI AINDA 
     if (selectedPerson !== null && selectedPrivacy !== null) {
        setTimeout(() => {
            mobileMenu.classList.remove('openMenu')
        }, 300)
    }

    */

    contact.classList.add('selected') 
   
  
}

function choosePrivacy(privacy) {
    let selectedPerson = document.querySelector('.contacts .selected')  
    let selectedPrivacy = document.querySelector('.privacy .selected')      
    
    if(selectedPrivacy !== null) {
        selectedPrivacy.classList.remove('selected')         
       
    }  

    /*  NÃO SEI SE VAI AINDA
     if (selectedPerson !== null && selectedPrivacy !== null) {
        setTimeout(() => {

            mobileMenu.classList.remove('openMenu')
        }, 300)
    }
    */

   
    privacy.classList.add('selected')   

}





