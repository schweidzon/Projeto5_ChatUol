const mobileMenu = document.querySelector('.menu')
const chat = document.querySelector('.chat')
const menuIcon = document.querySelector('.menuIcon')
let logo = document.querySelector('.logo')
const menuItens = document.querySelectorAll('.menuItem')
const nameButton = document.querySelector('.chooseName button')
const chooseName = document.querySelector('.chooseName')
const container = document.querySelector('.container')
console.log(nameButton)
 
function sendName() {
    container.classList.remove('hidden')
    chooseName.classList.add('hidden')

}



function openMenu(item) {  
        setTimeout(() => {
        mobileMenu.classList.add('openMenu')
        console.log(menuItens)
    }, 100)
    
}

function closeMenu() {
    if(!mobileMenu.classList.contains('openMenu')){
        return
    }   
        mobileMenu.classList.remove('openMenu')
    
}

function selectContact(contact) {
    let selectedPerson = document.querySelector('.contacts .selected')  
      
    
    if(selectedPerson !== null) {
        selectedPerson.classList.remove('selected')         
       
    }  
    

    contact.classList.add('selected') 
   
  
}

function choosePrivacy(privacy) {
    
    let selectedPrivacy = document.querySelector('.privacy .selected')      
    
    if(selectedPrivacy !== null) {
        selectedPrivacy.classList.remove('selected')         
       
    }  

   

   
    privacy.classList.add('selected')   

}





