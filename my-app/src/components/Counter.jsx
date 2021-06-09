import React, { useState, useEffect, useReducer, setState } from "react";

const APP_COUNT = "APP_COUNT";
const OPERATION_INIT = "INIT";
const OPERATION_ADD = "ADD";
const OPERATION_SUBTRACT = "SUBTRACT";


const isNil = (value) => value === null || value === undefined;


//Counter with two items in state
const Counter1 = () => {
    const [count, setCount] = useState(0);
    const [lastAction, setLastAction] = useState("Initialized");

    const countRef = React.useRef();

    const add = () => {
        setCount(count+1);
        setLastAction("Added")
    }

    const subtract = () => {
        setCount(count-1);
        setLastAction("Subtracted")
    }

    useEffect(() => {
        countRef.current = count;
    }, [count]);

    useEffect(() => {
        const storedCount = localStorage.getItem(APP_COUNT);
        setCount(!isNil(storedCount) ? parseInt(storedCount) : -1);
        return (() => {
            localStorage.setItem(APP_COUNT, countRef.current);
        });
    }, [])
    return (
        <>
            <div>{`CURRENT COUNT: ${count}`}</div>
            <div>{`LAST Action: ${lastAction}`}</div>
            <div><button onClick={add}>Add</button></div>
            <div><button onClick={subtract}>Subtract</button></div>
        </>
    )
}

const reducer = (state, action) => {
    switch (action.type) {
        case OPERATION_ADD:
            return {
                ...state,
                count: state.count + 1,
                lastAction: "Added"
            };

        case OPERATION_SUBTRACT:
            return {
                ...state,
                count: state.count - 1,
                lastAction: "Subtracted"
            };

        case OPERATION_INIT:
            return {
                ...state,
                count: action.storedCount,
                lastAction: "Initialized from localStorage"
            };
        
        default:
            return state;
    }
}

//counter with useReducer
const Counter2 = () => {
    const [{count, lastAction}, dispatch] = useReducer(reducer, {count: -1, lastAction: "Initialized"});

    const countRef = React.useRef();

    const add = () => {
        dispatch({type: OPERATION_ADD});
    }

    const subtract = () => {
        dispatch({type: OPERATION_SUBTRACT});
    }

    useEffect(() => {
        countRef.current = count;
    }, [count]);

    useEffect(() => {
        const storedCount = localStorage.getItem(APP_COUNT);
        dispatch({type: OPERATION_INIT, storedCount: !isNil(storedCount) ? parseInt(storedCount) : -1});
        return (() => {
            localStorage.setItem(APP_COUNT, countRef.current);
        });
    }, [])
    return (
        <>
            <div>{`CURRENT COUNT: ${count}`}</div>
            <div>{`LAST ACTION: ${lastAction}`}</div>
            <div><button onClick={add}>Add</button></div>
            <div><button onClick={subtract}>Subtract</button></div>
        </>
    )
}

//Counter as class
class Counter3 extends React.Component {

    constructor() {
        super();
        this.state = {
            count: -1,
            lastAction: "Initialized"
        }
        this.add = this.add.bind(this);
    }

    add() {
        this.setState({count: this.state.count + 1, lastAction: "Added"});
    }

    subtract = () => {
        this.setState((currentState, props) => {
            return {count: currentState.count - 1, lastAction: "Subtracted1"};
        });
    }

    componentDidMount() {
        const storedCount = localStorage.getItem(APP_COUNT);
        this.setState({count: !isNil(storedCount) ? parseInt(storedCount) : -1, lastAction: "Initialized from localStorage"});
    }

    componentWillUnmount() {
        localStorage.setItem(APP_COUNT, this.state.count);
    }

    render () {
        return(
            <>
                <div>{`CURRENT COUNT: ${this.state.count}`}</div>
                <div>{`LAST ACTION: ${this.state.lastAction}`}</div>
                <div><button onClick={this.add}>Add</button></div>
                <div><button onClick={this.subtract}>Subtract</button></div>
            </>
        );
    }
}

export default Counter3;
