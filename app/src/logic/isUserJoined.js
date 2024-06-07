import { validate, errors } from "com"

function isUserJoined(meeting) {
    try {
        validate.token(sessionStorage.token)

    const [, payloadB64] = sessionStorage.token.split('.')
    const payloadJSON = atob(payloadB64)

    const payload = JSON.parse(payloadJSON)

    const { sub: userId } = payload

        return meeting.attendees.some(attendee => attendee.id === userId)
    } catch (error) {
        console.error("Error:", error)
        return false
    }
}

export default isUserJoined
