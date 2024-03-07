let requests = [],
    requestsContainer = document.querySelector('#requests-container'),
    dropdownButton = document.querySelector('.dropdown-button')

const requestWidget = (request) => `
<div class="request" id="${request.id}">
    <img src="${request._from.avatar}" alt="">

    <div class="info">
        <div class="full-name">${request._from.first_name} ${request._from.last_name}</div>
        <div class="username">@${request._from.username}</div>
    </div>
    
    <div class="row">
        <div class="confirm">✅️</div>
        <div class="reject" >❌️</div>
    </div>
</div>
`

const confirmFriendRequest = async (id) => {
    let response = await fetch(window.location.origin + `/api/confirm-request/${id}/`)
    
    if (response.status == 200) {
        requests = requests.filter(e => e.id != id)

        return render()
    }
}


const cancelFriendRequest = async (id) => {
    let response = await fetch(window.location.origin + `/api/cancel-request/${id}/`)
    
    if (response.status == 200) {
        requests = requests.filter(e => e.id != id)

        return render()
    }
}


const render = () => {
    requestsContainer.innerHTML = ''

    requests.forEach(request => {
        requestsContainer.innerHTML += requestWidget(request)
    });


    requestsContainer.querySelectorAll('.confirm').forEach(btn => {
        btn.addEventListener('click', (e) => confirmFriendRequest(btn.parentElement.parentElement.id))
    })


    requestsContainer.querySelectorAll('.reject').forEach(btn => {
        btn.addEventListener('click', (e) => cancelFriendRequest(btn.parentElement.parentElement.id))
    })


    if (requests.length != 0 && !dropdownButton.classList.contains('notify')) {
        dropdownButton.classList.add('notify')
    } else if (requests.length == 0 && dropdownButton.classList.contains('notify')) {
        dropdownButton.classList.remove('notify')
    }
}

const request = async () => {

    let response = await fetch(window.location.origin + '/api/friend-requests/')
    requests = await response.json()
    
    return render()
}

request()