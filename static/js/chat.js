const input = document.querySelector('#message_input'),
    receiverId = document.querySelector('#receiver-id'),
    sendButton = document.querySelector('.send-button'),
    messages = document.querySelector('.messages'),
    receiverUsername = window.location.pathname.split('@')[window.location.pathname.split('@').length - 1]

const messageWidget = (message) => {

    console.log(message);

    return `
    <div class="message ${message.receiver == receiverId.getAttribute('data-id') ? 'sended' : ''}">
        <img src="${window.location.origin + message.sender.avatar}" alt="" class="creator-avatar">
        <div class="text">
            ${message.text}
            <div class="created-at">${message.created_at}</div>
        </div>
    </div>
`}
const scroll = () => {
    return messages.scrollTo(0, messages.scrollHeight)
}

const sendMessage = (socket) => {
    if (socket.readyState === WebSocket.OPEN) {

        if (input.value.trim() != '') {
            socket.send(JSON.stringify({
                'type': 'text',
                'message': input.value.trim(),
            }));
            input.value = '';
        }
    }
}


const Connect = () => {

    const socket = new WebSocket('ws://' + window.location.host + `/ws/chat/${receiverId.getAttribute('data-id')}/`)


    socket.onmessage = function (e) {
        let jsonData = JSON.parse(e.data);

        messages.innerHTML += messageWidget(jsonData)

        scroll()
    };


    socket.onclose = function (e) {
        console.error('Chat socket closed unexpectedly');
        setTimeout(function () {
            Connect()
        }, 2000);
    };



    input.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            return sendMessage(socket)
        }
    })

    sendButton.addEventListener('click', (e) => sendMessage(socket))

}



Connect()
scroll()