const { useState } = React

function Button(props) {
    return (
        <row gap={4} backgroundColor="gray">
            <text text={props.prefix}/>
            <text text={props.text}/>
        </row>
    )
}

function App() {
    const [v, setV] = useState(0)

    return (
        <column>
            <text>Counter</text>
            <text>{v}</text>
            <Button prefix="+" text="Increment" />
            <Button prefix="-" text="Decrement" />
        </column>
    )
}