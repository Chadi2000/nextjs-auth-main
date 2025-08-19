import React, { FunctionComponent, ReactNode } from "react";
import { MdClose } from "react-icons/md";

interface Props{
    isOpen: boolean
    onClose:() =>void
    title: string
    titleClassName?: string
    children: ReactNode
}

const PopUp : FunctionComponent<Props> =({
    isOpen,
    onClose,
    title,
    titleClassName,
    children
}) =>{
  if (!isOpen) return null;

  return (
    <div className="fixed bg-gray-500 inset-0 z-50 flex items-center justify-center bg-dblackk bg-opacity-40 ">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg relative ">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-4xl"
        >
          <MdClose size={24} className="text-gray-500 hover:text-gray-700 cursor-pointer" />
        </button>
        {title && <h2 className={`text-lg font-bold mb-4 flex items-center justify-center capitalize ${titleClassName}`}>{title}</h2>}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default PopUp;
