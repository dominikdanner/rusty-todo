import { FC, useState } from "react"

export const ModalPopup: FC = ({ children }) => {
  return (
    <div className="absolute flex h-screen w-full animate-popupinout items-center justify-center bg-gray-50 bg-opacity-50 shadow-xl backdrop-blur-sm transition-all">
      <div className="z-50 h-fit w-[400px] rounded-lg bg-gray-200">
        {children}
      </div>
    </div>
  )
}
