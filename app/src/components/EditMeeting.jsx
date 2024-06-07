import { logger } from '../utils'
import { useContext } from '../context'

import logic from '../logic'
import CancelButton from './library/CancelButton'
import SubmitButton from './library/SubmitButton'
import moment from 'moment'

function EditMeeting({meeting, onMeetingEdited, onCancelClick}) {

    const { showFeedback } = useContext()

    const handleSubmit = event => {
        event.preventDefault()

        const form = event.target

        const title = form.title.value
        const address = form.address.value
        const coordinates = form.location.value

        const [longitude, latitude] = coordinates.split(',').map(coord => parseFloat(coord.trim()))

        const location = [longitude, latitude]
        const date = form.date.value
        const description = form.description.value
        const image = form.image.value

        logger.debug('EditMeeting -> handleSubmit')

        try {
            logic.editMeeting(meeting.id, title, address, location, date, description, image)
                .then(() => {
                    form.reset()
                    onMeetingEdited()
                })
                .catch(error => showFeedback(error), 'error')
        } catch (error) {
            showFeedback(error)
        }
    }

    const handleCancelClick = () => onCancelClick()

    logger.debug('EditMeeting -> render')
//#F4C84B
    return <section className="h-screen w-screen fixed top-0 left-0 flex justify-center items-center flex-col bg-black bg-opacity-70 py-8 px-4 border-rounded xl "
    >
        <div className='w-[90%] flex flex-col border p-4 rounded-xl bg-[#249D8C] transition-opacity duration-500 opacity-100'>
        <form onSubmit={handleSubmit} className="flex flex-col items-center" >
            <label className="text-center font-semibold"  >Title</label>
            <input className="w-full h-[30px] rounded-md text-center" id="title" defaultValue={meeting.title} name="title" type="text" />

            <label className="mt-2 text-center font-semibold" >Address</label>
            <input className="w-full h-[30px] rounded-md text-center" id="address" defaultValue={meeting.address}  name="address" type="text" />

            <label className="mt-2 text-center font-semibold" >Location</label>
            <input className="w-full h-[30px] rounded-md text-center" id="location" defaultValue={`${meeting.location.latitude}, ${meeting.location.longitude}`} name="location" type="text" />

            <label className="mt-2 text-center font-semibold" >Date</label>
            <input className="w-full h-[30px] rounded-md text-center" id="date" defaultValue={meeting.date ? moment(meeting.date).format('YYYY-MM-DDTHH:mm') : ''} name="date" type="datetime-local" min="2024-03-30T00:00" max="2025-12-31T23:59" />

            <label className="mt-2 text-center font-semibold" >Description</label>
            <input className="w-full h-[30px] rounded-md text-center" id="description" defaultValue={meeting.description} name="description" type="text" />

            <label className="mt-2 text-center font-semibold" >Image</label>
            <input className="w-full h-[30px] rounded-md text-center" id="image" defaultValue={meeting.image} name="image" type="url" />

            <SubmitButton type="submit" className="font-semibold py-2 px-4 rounded w-full mt-4" >Save Changes</SubmitButton>

        </form>
        <CancelButton onClick={handleCancelClick} />

        </div>

    </section>
}

export default EditMeeting