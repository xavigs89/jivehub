
import Review from './Review'

function ReviewsList({ reviews }) {
    return (
        <div>
            <ul className="mb-100px">
                {reviews && reviews.map(review => (
                    <Review 
                    key={review.id} 
                    review={review} />
                ))}
            </ul>
        </div>
    )
}

export default ReviewsList