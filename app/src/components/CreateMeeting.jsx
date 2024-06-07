import { logger } from '../utils'

import logic from '../logic'
import SubmitButton from './library/SubmitButton'
import CancelButton from './library/CancelButton'

import { useContext } from '../context'

function CreateMeeting({ onMeetingCreated, onCancelClick }) {

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

        try {
            logic.createMeeting(title, address, location, date, description, image)
                .then(() => {
                    form.reset()

                    onMeetingCreated()
                })
                .catch(error => showFeedback(error))
        } catch (error) {
            showFeedback(error)
        }
    }

    const handleCancelClick = () => onCancelClick()

    logger.debug('CreateMeeting -> render')

    return <section className="h-screen w-screen fixed top-0 left-0 flex justify-center items-center flex-col bg-black bg-opacity-70 py-8 px-4 border-rounded xl">

        <div className='w-[90%] flex flex-col border p-4 rounded-xl bg-[#249D8C] transition-opacity duration-500 opacity-100'>
            <form onSubmit={handleSubmit} className="flex flex-col items-center" >
                <label className="text-center font-semibold">Title</label>
                <input className="w-full h-[30px] rounded-md text-center" id="title" name="title" type="text" />

                <label className="mt-2 text-center font-semibold " >Address</label>
                <input className="w-full h-[30px] rounded-md text-center" id="address" name="address" type="text" />

                <label className="mt-2 text-lg font-semibold" >Location</label>
                <input className="w-full h-[30px] rounded-md text-center" id="location" name="location" type="text"  />

                <label className="mt-2 text-lg font-semibold" >Date</label>
                <input className="w-full h-[30px] rounded-md text-center" id="date" name="date" type="datetime-local" min="2024-03-30T00:00" max="2025-12-31T23:59" />

                <label className="mt-2 text-lg font-semibold" >Description</label>
                <input className="w-full h-[30px] rounded-md text-center" id="description" name="description" type="text" />

                <label className="mt-2 text-lg font-semibold" >Image</label>
                <input className="w-full h-[30px] rounded-md text-center" id="image" name="image" type="url" />

                <SubmitButton type="submit" className="font-semibold py-2 px-4 rounded w-full mt-4" >Create Meeting</SubmitButton>

            </form>
            <CancelButton onClick={handleCancelClick} />
        </div>

    </section>
}

export default CreateMeeting
