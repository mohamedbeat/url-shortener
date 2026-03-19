import { useTheme } from "@/components/theme-provider"
import { SidebarMenuButton, } from "@/components/ui/sidebar"
import { MonitorSmartphone, Moon, SunDim } from "lucide-react"


export function SideBarThemeToggler() {
    const { theme, setTheme } = useTheme()

    const handleThemeToggle = () => {
        switch (theme) {
            case "light":
                setTheme("dark")
                break;
            case "dark":

                setTheme("system")
                break;
            case "system":
                setTheme("light")
                break;
        }
    }

    return (
        <SidebarMenuButton onClick={handleThemeToggle} className="cursor-pointer" >
            {theme === "light" && <SunDim />}
            {theme === "dark" && <Moon />}
            {theme === "system" && <MonitorSmartphone />}

            Change theme
        </SidebarMenuButton>

    )
}