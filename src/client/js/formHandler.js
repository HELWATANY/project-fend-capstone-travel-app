import { asyncGet, asyncPost } from './utils.js'

async function handleSubmit(event) {
    event.preventDefault()

    // check what text was put into the form field
    let text = document.getElementById('name').value
    let formValidation = Client.validateForm(text)

    if (!formValidation.valid) {
        alert(formValidation.errorMsg)
        return
    }

    console.log("::: Form Submitted :::")
    // fetch('http://localhost:3000/test')
    // .then(res => res.json())
    // .then(function(res) {
    //     document.getElementById('results').innerHTML = res.message
    // })

    let res = await asyncGet('http://localhost:3000/test')
    let analysis = await asyncPost('http://localhost:3000/sentiment-analysis', {text})

    console.log(analysis)

    if (analysis) {
        for (let [key, value] of Object.entries(analysis)) {
            if (typeof value === 'number') {
                value = (value * 100).toFixed(2) + '%'
            }

            if (document.getElementById(key)) {
                document.getElementById(key).innerHTML = value
            }
        }
    }

    // document.getElementById('results').innerHTML = res.message
}

export { handleSubmit }
