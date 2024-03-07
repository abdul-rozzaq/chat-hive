let users = []

const newFriends = document.querySelector('#new-friends'),
    input = document.querySelector('.modal #search'),
    widget = (user) => `
        <a class="chat" href="user-profile/@${user.username}">
            <img src="${user.avatar}" alt="">
            <div class="col">
                <div class="full-name">${user.first_name} ${user.last_name}</div>
                <div class="username">@${user.username}</div>
            </div>
        </a>
    `
const renderUsers = (qs) => {
    newFriends.innerHTML = ''

    qs.forEach(element => {
        newFriends.innerHTML += widget(element)
    });
}

const loadUsers = async () => {
    const response = await fetch('/api/users/')
    users = await response.json()

    return renderUsers(users)
}

input.addEventListener('keyup', (e) => {
    let newQs = users.filter(user => `${user.first_name} ${user.last_name}`.toLowerCase().includes(e.target.value.toLowerCase()) || user.username.toLowerCase().includes(e.target.value.toLowerCase))
    return renderUsers(newQs)
})

loadUsers()