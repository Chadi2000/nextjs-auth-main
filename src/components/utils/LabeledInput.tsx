import { FunctionComponent } from "react"
import Input from "./Input"
import { CssVariable } from "next/dist/compiled/@next/font"

interface Props {
  label: string
  InputType: string
  placeholder?: string
  readonly?: boolean
  width?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
   Icon?: React.ElementType
  
}

const LabledInput: FunctionComponent<Props> = ({
  label,
  readonly=false,
  InputType,
  placeholder,
  width,
  value,
  onChange
  
}) => {
  return (
    <div className={`flex flex-col gap-1 w-full`} style={width ? { width } : {}}>
    <label className="text-sm font-light capitalize">
        {label}
    </label>
    <Input
        type={InputType}
        placeholder={placeholder}
        readonly={readonly} 
        value={value}
        onChange={onChange}
    />
    </div>

  )
}

export default LabledInput
