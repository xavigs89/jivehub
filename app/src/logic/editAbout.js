//@ts-nocheck
import { validate, errors } from 'com'

function editAbout(userId, description) {
    validate.text(userId, 'userId', true)
    validate.text(description, 'description')


const about = { userId, description }

const json = JSON.stringify(about)

return fetch(`${import.meta.env.VITE_API_URL}/users/about/${userId}`, {
    method: 'PATCH',
    headers: {
        'Authorization': `Bearer ${sessionStorage.token}`,
        'Content-Type': 'application/json'
},
body: json
})

    .then(res => {
        if (res.status === 200) return

        return res.json()
            .then(body => {
                const { error, message } = body

                const constructor = errors[error]

                throw new constructor(message)
            })
    })

}
export default editAbout