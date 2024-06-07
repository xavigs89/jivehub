import { validate, errors } from 'com'

function registerUser(name, email, password, confirmedPassword) {
    validate.text(name, 'name')
    validate.email(email)
    validate.password(password)
    validate.password(confirmedPassword)

    if (password !== confirmedPassword) throw new CredentialsError('passwords do not match')

    const user = { name, email, password, confirmedPassword }

    const json = JSON.stringify(user)

    return fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: json
    })
        .then(res => {
            if (res.status === 201) return

            return res.json()
                .then(body => {
                    const { error, message } = body

                    const constructor = errors[error]

                    throw new constructor(message)
                })
        })
}

export default registerUser