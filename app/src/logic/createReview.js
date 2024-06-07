//@ts-nocheck
import { validate, errors } from 'com'

function createReview(userId, rate, comment, meetingId) {
    
    validate.text(userId, 'userId', true)
    validate.rating(rate, 'rating')
    if(comment)
        validate.text(comment, 'comment')
    validate.text(meetingId, 'meetingId', true)

    validate.token(sessionStorage.token)

    const review = { userId, rate, comment, meetingId }

    const json = JSON.stringify(review)

    return fetch(`${import.meta.env.VITE_API_URL}/reviews`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${sessionStorage.token}`,
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

export default createReview