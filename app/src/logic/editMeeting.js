//@ts-nocheck
import { validate, errors } from 'com'

function editMeeting(meetingId, title, address,location,date,description,image) {

    validate.text(meetingId, 'meetingId', true)
    validate.text(title, 'title')
    validate.text(address, 'address')
    validate.coords(location, 'coords')
    validate.date(date, 'date')
    validate.text(description, 'description')
    validate.url(image, 'image')

    // const [, payloadB64] = sessionStorage.token.split('.')
    // const payloadJSON = atob(payloadB64)

    // const payload = JSON.parse(payloadJSON)

    // const { sub: userId } = payload

    const meeting = { title, address, location, date, description, image }

    const json = JSON.stringify(meeting)

    return fetch(`${import.meta.env.VITE_API_URL}/meetings/edit/${meetingId}`, {
        method: 'PUT',
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

export default editMeeting