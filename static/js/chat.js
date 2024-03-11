const input = document.querySelector('#message_input'),
    receiverId = document.querySelector('#receiver-id'),
    sendButton = document.querySelector('.send-button'),
    receiverUsername = window.location.pathname.split('@')[window.location.pathname.split('@').length - 1]

let messages = document.querySelector('.messages')


const messageWidget = (message) => `
    <div class="message ${message.receiver == receiverId.getAttribute('data-id') ? 'sended' : ''}" data-sender-id="${message.sender.id}">
        <img src="${window.location.origin + message.sender.avatar}" alt="" class="creator-avatar">
        <div class="col">
            <div class="text">
                ${message.text}
                <div class="created-at">${message.created_at}</div>
            </div>
        </div>
    </div>
`

const textWidget = (message) => `
    <div class="text">
        ${message.text}
        <div class="created-at">${message.created_at}</div>
    </div>
`

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


const SocketConnect = () => {

    const socket = new WebSocket('ws://' + window.location.host + `/ws/chat/${receiverId.getAttribute('data-id')}/`)

    socket.onmessage = function (e) {
        let lastMessage,
            lastText,
            lastTextCreatedTime,
            jsonMessage = JSON.parse(e.data)
            

        let messages = document.querySelector('.messages'),
            jsonMessageCreatedTime = jsonMessage.created_at.split(':')

        if (messages.children.length > 0) {
            lastMessage = messages.children[messages.children.length - 1]
            lastText = lastMessage.querySelector('.col').children[lastMessage.querySelector('.col').children.length - 1]
            lastTextCreatedTime = lastText.querySelector('.created-at').innerHTML.split(':')
        }

        if (lastMessage == null) {
            messages.innerHTML += messageWidget(jsonMessage)
        } else if (lastMessage.getAttribute('data-sender-id') != jsonMessage.sender.id || lastMessage.getAttribute('data-sender-id') == jsonMessage.sender.id && jsonMessageCreatedTime[1] - lastTextCreatedTime[1] > 3) {
            messages.innerHTML += messageWidget(jsonMessage)
        } else {
            lastMessage.querySelector('.col').innerHTML += textWidget(jsonMessage)
        }

        scroll()
    };


    socket.onclose = function (e) {
        console.error('Chat socket closed unexpectedly');
        setTimeout(function () {
            SocketConnect()
        }, 2000);
    };


    input.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            return sendMessage(socket)
        }
    })

    sendButton.addEventListener('click', (e) => sendMessage(socket))

}



SocketConnect()
scroll()