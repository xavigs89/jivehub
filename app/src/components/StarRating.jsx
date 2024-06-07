
function StarRating({ value, setRate }) {
    const stars = [1, 2, 3, 4, 5]

    const handleClick = (star) => {
        setRate(star)
    }

    return (
        <div>
            {stars.map(star => (
                <span
                    key={star}
                    className={`text-3xl ${star <= value ? "text-yellow-500" : "text-gray-400"}`}
                    onClick={() => handleClick(star)}
                >
                    ★
                </span>
            ))}
        </div>
    )
}

export default StarRating