const input = document.querySelector('#message_input'),
    receiverId = document.querySelector('#receiver-id'),
    sendButton = document.querySelector('.send-button'),
    receiverUsername = window.location.pathname.split('@')[window.location.pathname.split('@').length - 1],
    fileUploadForm = document.querySelector('#file-upload-form'),
    fileInput = document.querySelector('#file-input'),
    fileCaption = document.querySelector('#file-caption'),
    typingIndicator = document.querySelector('#typing-status');

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

const fileMessageWidget = (message) => `
    
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

const sendTypingStatus = (socket, code='typing') => {
    if (socket.readyState === WebSocket.OPEN) {

        socket.send(JSON.stringify({
            'type': 'status',
            'code': code,
        }));
    }
}

const sendFile = (socket, file) => {
    if (socket.readyState === WebSocket.OPEN) {
        const reader = new FileReader();

        reader.onload = (event) => {
            const fileData = event.target.result;
            // socket.send(JSON.stringify({
            //     'type': 'file',
            //     'fileName': file.name,
            //     'fileType': file.type,
            //     'fileData': fileData.split(',')[1]
            // }));
        };

        reader.onerror = (error) => {
            console.error('Xatolik faylni o\'qishda:', error);
        };

        reader.readAsDataURL(file);
    }
};


const SocketConnect = () => {

    const socket = new WebSocket('ws://' + window.location.host + `/ws/chat/${receiverId.getAttribute('data-id')}/`)

    socket.onmessage = function (e) {
        let lastMessage,
            lastText,
            lastTextCreatedTime,
            jsonMessage = JSON.parse(e.data)

        console.log(jsonMessage);

        if (jsonMessage.type == 'text') {
            let messages = document.querySelector('.messages'),
                jsonMessageCreatedTime = jsonMessage.created_at.split(':')

            if (messages.children.length > 0) {
                lastMessage = messages.children[messages.children.length - 1]
                lastText = lastMessage.querySelector('.col').children[lastMessage.querySelector('.col').children.length - 1]
                lastTextCreatedTime = lastText.querySelector('.created-at').innerHTML.split(':')
            }

            if (lastMessage == null) {
                messages.innerHTML += messageWidget(jsonMessage)
            } else if (lastMessage.getAttribute('data-sender-id') != jsonMessage.sender.id || lastMessage.getAttribute('data-sender-id') == jsonMessage.sender.id && jsonMessageCreatedTime[1] - lastTextCreatedTime[1] > 3 || jsonMessageCreatedTime[0] != lastTextCreatedTime[0]) {
                messages.innerHTML += messageWidget(jsonMessage)
            } else {
                lastMessage.querySelector('.col').innerHTML += textWidget(jsonMessage)
            }

            scroll()
        } else if (jsonMessage.type == 'connection') {
            console.log(`Connection ${jsonMessage.id} ${receiverId.getAttribute('data-id')}`);
        } else if (jsonMessage.type == 'status' && jsonMessage.user_id == receiverId.getAttribute('data-id')) {            
            if (jsonMessage.code == 'typing') {
                typingIndicator.style.display  = 'inline';
            } else if (jsonMessage.code == '') {
                typingIndicator.style.display  = 'none';
            }
        }

    };


    socket.onclose = function (e) {
        console.error('Chat socket closed unexpectedly');
        setTimeout(function () {
            SocketConnect()
        }, 2000);
    };


    input.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            sendTypingStatus(socket, '')
            return sendMessage(socket)
        } else {
            return sendTypingStatus(socket)
        }
    })

    sendButton.addEventListener('click', (e) => sendMessage(socket))


    fileUploadForm.addEventListener('submit', (e) => {
        e.preventDefault()

        const file = fileInput.files[0];
        const caption = fileCaption.value;

        return sendFile(socket, file)
    });

}



SocketConnect()
scroll()