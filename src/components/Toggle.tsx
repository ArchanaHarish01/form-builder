"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function Toggle() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null
    return (
        <div className="fixed bottom-4 right-4 z-50">
            {theme === "dark" ? (
                <button
                    onClick={() => setTheme("light")}
                    className="p-3 rounded-full bg-gray-800 hover:bg-yellow-100 transition-colors duration-300 flex items-center justify-center shadow-lg"
                >
                    <Sun className="text-yellow-400 transition-all duration-300 transform scale-100 rotate-0 hover:scale-110 hover:rotate-12" />
                </button>
            ) : (
                <button
                    onClick={() => setTheme("dark")}
                    className="p-3 rounded-full bg-yellow-100 hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center shadow-lg hover:*:text-white"
                >
                    <Moon className="text-yellow-400 transition-all duration-300 transform scale-100 rotate-0 hover:scale-110 hover:-rotate-12 " />
                </button>
            )}
        </div>
    )
}
