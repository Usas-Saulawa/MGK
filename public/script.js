const formEl = document.querySelector('.form')


formEl.addEventListener('submit', e => {
    e.preventDefault()

    const jambNo = document.querySelector('#jambNo').value

    const url = 'http://localhost:5000/ug/login'
    const formData = new FormData(formEl)
    const data = Object.fromEntries(formData)


    fetch(url, {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })
        .catch(error => console.log(error))
    e.target.jambNo.value = ''
    e.target.password.value = ''

    localStorage.setItem('jambNo', jambNo)
    console.log(jambNo)
})
