import { validate, errors } from 'com';

function removeMeeting(meetingId) {
    validate.text(meetingId, 'meetingId', true)
    validate.token(sessionStorage.token)

    // const json = JSON.stringify(meeting)

    return fetch(`${import.meta.env.VITE_API_URL}/meetings/${meetingId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${sessionStorage.token}`,
        }
    })
    .then(res => {
        if (res.status === 200)
            return res.json()

            .then(body => {
                const { error, message } = body

                const constructor = errors[error]

                throw new constructor(message)
            })
})
}

export default removeMeeting;