import { FunctionComponent } from "react"

interface Props {
  Icon?: React.ElementType
  name?: string
  type: string
  placeholder?: string
  readonly?: boolean
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: FunctionComponent<Props> = ({
  Icon,
  name ='',
  type,
  placeholder,
  readonly=false,
  value,
  onChange
}) => {
  return (
    <div className="flex items-center relative cursor-pointer w-full ">
      <input
        value={value}
        readOnly={readonly}
        type={type}
        name={name}
        className="pr-10 border px-6 py-2 rounded-md w-full focus:outline-none"
        placeholder={placeholder}
        onChange={onChange}
      />
      {Icon && <Icon className="absolute top-1/2 right-2 h-5 w-5 transform -translate-y-1/2" />}
    </div>
  )
}

export default Input
