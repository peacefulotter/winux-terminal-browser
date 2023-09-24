
import { ChangeEventHandler, Dispatch, KeyboardEventHandler, SetStateAction, useEffect, useRef } from "react"
import { useTerminal } from "@/context/TerminalContext";
import BaseCommandLine from "./BaseCommandLine";


export default function CommandLine() {

    const { cmd, path, actions, setCmd } = useTerminal()

    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.focus();
        }
    }, []);

    const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      	setCmd(e.target.value)
    }
  
    const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (Object.keys(actions).includes(e.key)) {
            e.preventDefault()
            e.stopPropagation()
            actions[e.key]()
        }
    }
  
    return (
      	<BaseCommandLine path={path}> 
            <input 
                ref={ref}
                className='bg-transparent text-foreground outline-none w-full' 
                type='text' 
                value={cmd} 
                onChange={onChange}
                onKeyDown={onKeyDown} />
        </BaseCommandLine>
    )
}
  