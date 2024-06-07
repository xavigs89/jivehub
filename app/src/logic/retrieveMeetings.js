import { validate, errors } from 'com'

function retrieveMeetings() {
    validate.token(sessionStorage.token)
    return fetch(`${import.meta.env.VITE_API_URL}/meetings`, {
        headers: {
            'Authorization': `Bearer ${sessionStorage.token}`
        }
    })

        .then(res => {
            if (res.status === 200)
                return res.json()
                

            return res.json()
                .then(body => {
                    const { error, message } = body

                    const constructor = errors[error]

                    throw new constructor(message)
                })    
        })

      
}

export default retrieveMeetings



  //para filtrar meetings por fecha mas cercana y que no se muestren los meetings creados por el usuario logueado
        // .then(meetings => {
        //     const filteredMeetings = meetings.filter(meeting => meeting.creator !== sessionStorage.userId)

        //     filteredMeetings.sort((a, b) => new Date(a.date) - new Date(b.date))

        //     return filteredMeetings
        // })