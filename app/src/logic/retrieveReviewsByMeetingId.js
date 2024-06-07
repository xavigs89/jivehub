import { validate, errors } from 'com'

function retrieveReviewsByMeetingId(meetingId) {
    validate.text(meetingId, 'meetingId', true)
    validate.token(sessionStorage.token)

    return fetch(`${import.meta.env.VITE_API_URL}/reviews/${meetingId}`, {
        headers: {
            'Authorization': `Bearer ${sessionStorage.token}`
        }
    })
    .then(res => {
        if (res.status === 200) {
            return res.json()
        } else {
            return res.json().then(body => {
                const { error, message } = body

                const constructor = errors[error]

                throw new constructor(message)
            })
        }
    })
}

export default retrieveReviewsByMeetingId