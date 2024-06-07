function RoundButton(props) {
    return <button className={`rounded-[5px]  my-[10px] p-2 ${props.className}`} type={props.type} onClick={props.onClick}>{props.children || 'Button'}</button>
}

export default RoundButton