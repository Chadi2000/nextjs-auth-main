import React, { FunctionComponent, ReactNode } from "react"

interface Props {
  name: string
  children?: ReactNode
}

const CardBox: FunctionComponent<Props> = ({
  name = '',
  children,
}) => {
  return (
    <div className="flex flex-col w-full bg-white rounded-2xl">
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <span className="text-[18px] font-light w-full">{name}</span>
      </div>
      <div className="px-4 py-2 my-3">
        {children}
      </div>
    </div>
  )
}

export default CardBox
