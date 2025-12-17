import { ReactNode } from "react";

interface type{
    children: ReactNode
}
const Container = ({ children }: type) =>{
    return(
        <div className="max-w-[85%] mx-auto px-4 sm:px-6 lg:px-8">
            {children}
        </div>
    )
}
export default Container;