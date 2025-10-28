
function Button(props) {
    return (
        <row gap={4} backgroundColor="gray">
            <text text={props.prefix}/>
            <text text={props.text}/>
        </row>
    )
}

function App() {
    return (
        <column>
            <text>Counter</text>
            <Button prefix="+" text="Increment" />
            <Button prefix="-" text="Decrement" />
        </column>
    )
}