import { FC, Fragment } from "react"

interface PopupFormProps {
  isExpanded: boolean
}

/**
 * Create a Form-container 
 */
export const PopupForm: FC<PopupFormProps> = ({ children, isExpanded }) => {
  return (
    <Fragment>
      {isExpanded ? (
        <div className="absolute flex h-screen w-full animate-popupinout items-center justify-center bg-gray-50 bg-opacity-50 shadow-xl backdrop-blur-sm transition-all">
          <div className="z-50 h-fit w-[400px] rounded-lg bg-gray-200">
            {children}
          </div>
        </div>
        ) : null
      }
    </Fragment>
  )
}

interface ContainerProps {
  className: string;
}

export const Container: FC<ContainerProps> = ({ children, className }) => (
  <div className={`h-screen w-full bg-gray-50 ${ className }`}>
      {children}
  </div>
)

interface BoxProps {
  className: String;
}

export const Box: FC<BoxProps> = ({ className, children}) => (
  <div className={`flex flex-col rounded-lg bg-gray-200 shadow-xl ${className}`}>
    {children}
  </div>
)