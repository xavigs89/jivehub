import RoundButton from './RoundButton'

function SubmitButton(props) {
    return <RoundButton className="submit-button w-full mt-4 font-semibold bg-[#F4C84B]" type={props.type}>{props.children || 'Submit'}</RoundButton>
}

export default SubmitButton