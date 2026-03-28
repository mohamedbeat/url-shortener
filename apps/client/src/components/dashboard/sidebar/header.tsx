// components/dashboard/header.tsx
import { useState } from 'react'
import { Menu, Search, Bell, User, Bolt, CreditCard, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/useAuth'

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { logout, user } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">

      {/* Mobile sidebar trigger */}
      <Button variant="ghost" size="icon" className="lg:hidden">
        <SidebarTrigger
        >
          <Menu className="h-5 w-5" />

        </SidebarTrigger>
      </Button>

      {/* Search */}
      <div className="flex flex-1 items-center gap-4 md:gap-6">
        <form className="hidden flex-1 md:block md:max-w-sm">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
            />
          </div>
        </form>

        {/* Mobile search button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Right side icons */}
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
          </Button>

          <DropdownMenu>

            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <DropdownMenuTrigger
              >
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src={user?.picture} alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
            </Button>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                {/* <DropdownMenuLabel> <User /> My Account</DropdownMenuLabel> */}
                {/* <DropdownMenuSeparator /> */}
                <DropdownMenuItem><User /> Profile</DropdownMenuItem>
                <DropdownMenuItem><Bolt /> Settings</DropdownMenuItem>
                <DropdownMenuItem><CreditCard /> Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    logout()
                  }}
                  variant='destructive'
                >
                  <LogOut /> Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile search overlay */}
      {
        isSearchOpen && (
          <div className="absolute inset-x-0 top-14 border-b bg-background p-4 md:hidden">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-8"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
            </div>
          </div>
        )
      }
    </header >
  )
}
