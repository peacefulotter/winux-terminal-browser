
import { ChangeEventHandler, KeyboardEventHandler, useEffect, useMemo, useRef, useState } from "react"
import { useTerminal } from "@/context/TerminalContext";
import BaseCommandLine from "./BaseCommandLine";
import FixedCommandLine from "./FixedCommandLine";


export default function CommandLine() {

    const { state, actions, setCmd } = useTerminal()

    const [disabled, setDisabled] = useState(false)
    const [data, setData] = useState({cmd: '', path: ''})

    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (ref.current)
            ref.current.focus();
    }, []);

    useEffect( () => {
        if (!disabled)
            setData(state)
    }, [state, disabled] )

    const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setCmd(e.target.value)
    }
  
    const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (!Object.keys(actions).includes(e.key)) return
        
        e.preventDefault()
        e.stopPropagation()
        setDisabled(true)
        actions[e.key]().then(disabled => {            
            setDisabled(disabled)
            setTimeout( 
                () => !disabled && ref.current && ref.current.focus(), 
                10
            )
        })
    }
    
    return (
        <BaseCommandLine path={data.path}> 
            <input 
                disabled={disabled}
                ref={ref}
                className='bg-transparent text-foreground outline-none w-full' 
                type='text' 
                value={data.cmd} 
                onChange={onChange}
                onKeyDown={onKeyDown} />
        </BaseCommandLine>
    )
}
  