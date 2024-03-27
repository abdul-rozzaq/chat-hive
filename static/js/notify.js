const notifications = document.querySelector('.notifications'),
    receiver = document.querySelector('#receiver-id')


const notifyAudio = document.querySelector('#notifyAudio')

const notifyWidget = (message) => `
    
        <img src="${message.sender.avatar}" alt="">

        <div class="col">
            <div class="sender-username">@${message.sender.username}</div>
            <div class="msg-text">
                ${message.text}
            </div>
        </div>
`


const Connect = () => {
    const socket = new WebSocket('ws://' + window.location.host + `/ws/notify/`)
    console.log('Socket connected');

    socket.onclose = function (e) {
        console.log('Chat socket closed');
        setTimeout(() => {
            console.log('Reconnecting ...');
            Connect()
        }, 2000);
    };

    socket.onmessage = function (e) {
        let message = JSON.parse(e.data);
        
        
        if (receiver == null || receiver.getAttribute('data-id') != message.sender.id) {
            const newNotify = document.createElement('a')
            newNotify.classList.add('notification')
            newNotify.setAttribute('href', `/chat/@${message.sender.username}`)
            newNotify.innerHTML = notifyWidget(message)
            notifications.appendChild(newNotify)
        }
        notifyAudio.play();
    };
}

Connect();



