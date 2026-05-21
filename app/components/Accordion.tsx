import type React from "react";
import { useContext, useState, type ReactNode, createContext } from "react";
import { cn } from "~/lib/utils";

// ... (KODE CONTEXT TETAP SAMA SEPERTI ASLI) ...
interface AccordionContextType {
    activeItems: string[]
    toggleItem: (id: string) => void
    isItemActive: (id: string) => boolean
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined)

const useAccordion = () => {
    const context = useContext(AccordionContext)
    if(!context) throw new Error("Accordion components must be used within an Accordion")
    return context
}

interface AccordionProps {
    children: ReactNode
    defaultOpen?: string
    allowMultiple?: boolean
    className?: string
}

export const Accordion: React.FC<AccordionProps> = ({ children, defaultOpen, allowMultiple = false, className = "" }) => {
    const [activeItems, setActiveItems] = useState<string[]>(defaultOpen ? [defaultOpen] : [])
    const toggleItem = (id: string) => {
        setActiveItems((prev) => {
            if(allowMultiple) return prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
            else return prev.includes(id) ? [] : [id]
        })
    }
    const isItemActive = (id: string) => activeItems.includes(id)

    return (
        <AccordionContext.Provider value={{activeItems, toggleItem, isItemActive}}>
            <div className={`space-y-3 ${className}`}>{children}</div>
        </AccordionContext.Provider>
    )
}
// ... (AKHIR KODE CONTEXT) ...

interface AccordionItemProps {
    id: string
    children: ReactNode
    className?: string
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ id, children, className = "" }) => {
    return (
        // Disesuaikan untuk dark mode (background card, border gelap, rounded corners)
        <div className={`overflow-hidden border border-[#2A2A40] bg-[#151525] rounded-xl shadow-sm ${className}`}>
            {children}
        </div>
    )
}

interface AccordionHeaderProps {
    itemId: string
    children: ReactNode
    className?: string
    icon?: ReactNode
    iconPosition?: "left" | "right"
}

export const AccordionHeader: React.FC<AccordionHeaderProps> = ({
    itemId, children, className = "", icon, iconPosition = "right",
}) => {
    const {toggleItem, isItemActive} = useAccordion()
    const isActive = isItemActive(itemId)

    const defaultIcon = (
         <svg
            className={cn("w-5 h-5 transition-transform duration-200", { "rotate-180": isActive })}
            fill="none"
            stroke="#98A2B3"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    )

    return (
        <button
            onClick={() => toggleItem(itemId)}
            className={`w-full px-5 py-4 text-left focus:outline-none transition-colors duration-200 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] text-white ${className}`}
        >
            <div className="flex items-center space-x-3 w-full">
                {iconPosition === "left" && (icon || defaultIcon)}
                <div className="flex-1 font-medium">{children}</div>
            </div>
            {iconPosition === "right" && (icon || defaultIcon)}
        </button>
    )
}

interface AccordionContentProps {
    itemId: string
    children: ReactNode
    className?: string
}

export const AccordionContent: React.FC<AccordionContentProps> = ({ itemId, children, className = "" }) => {
    const {isItemActive} = useAccordion()
    const isActive = isItemActive(itemId)

    return (
        <div className={`overflow-hidden transition-all duration-300 ease-in-out border-t border-[#2A2A40]/50 ${isActive ? "max-h-fit opacity-100" : "max-h-0 opacity-0 border-transparent"} ${className}`}>
            {/* Teks di dalam content diubah agar terlihat terang di atas latar gelap */}
            <div className="px-5 py-4 text-gray-300 leading-relaxed">
                {children}
            </div>
        </div>
    )
}