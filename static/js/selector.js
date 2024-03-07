let tabs = document.querySelectorAll('.tab'), 
    pages = document.querySelectorAll('.tab-page'),
    url = new URL(window.location),
    tabName = url.searchParams.get('tab')

if (tabName != null) {
    tabs.forEach(tab => {
        if (tab.getAttribute('href').includes(tabName)) {
            tab.classList.add('active')
        }
    })

    pages.forEach(page => {
        if (page.getAttribute('data-tab-id') == tabName) {
            page.classList.add('active')
        }
    })
} else {
    tabs[0].classList.add('active')
    pages[0].classList.add('active')
}
