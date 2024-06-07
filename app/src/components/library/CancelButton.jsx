import RoundButton from './RoundButton'

function CancelButton(props) {
    return <RoundButton className="cancel-button font-semibold bg-[#F4C84B]" onClick={props.onClick}>{props.children || 'Cancel'}</RoundButton>
}

export default CancelButton