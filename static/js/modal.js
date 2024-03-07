

let modals = document.querySelectorAll('.modal-wrapper'),
    openButtons = document.querySelectorAll('.open-modal'),
    closeButtons = document.querySelectorAll('.modal-wrapper .close')


openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        modals.forEach(modal => {
            if (modal.getAttribute('data-modal-id') == btn.getAttribute('data-target-id')) {
                
                if (modal.classList.contains('d-none')) {
                    modal.classList.remove('d-none')
                }
            }
        })
    })
});



closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.target.parentElement.parentElement.classList.add('d-none')
    })
});






let targets = document.querySelectorAll('.image-modal-target'),
    imageModals = document.querySelectorAll('.image-modal')

if (imageModals.length != 0){
    let imageModal = imageModals[0] 

    targets.forEach(btn => {
        btn.addEventListener('click', () => {
            imageModal.querySelector('#current-image').setAttribute('src', btn.querySelector('img').getAttribute('src'))
            imageModal.classList.remove('d-none')

        })
    });

    imageModal.addEventListener('click', (e) => {
        if (e.target.id != 'current-image') {
            imageModal.classList.add('d-none')
        }
    })
}
