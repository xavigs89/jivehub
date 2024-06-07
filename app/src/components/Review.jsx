//@ts-nocheck
import { logger } from '../utils'
import StarRating from './StarRating'
import moment from 'moment'

function Review({ review }) {

    logger.debug('Review -> render')

    return <article className="text-wrap max-w-sm mx-4 overflow-auto flex p-1 border rounded-xl shadow-md bg-white mt-4">

        <div className="col-span-1 pr-4 text-black font-semibold">

            <p className="text-left font-semibold mbp text-xs">
                {review.author.name}</p>

                <StarRating value={review.rate} />

            <p>{review.comment}</p>

            <time>{moment(review.date).format('Do MMMM YYYY, h:mm a')}</time>

        </div>

    </article>

}
export default Review