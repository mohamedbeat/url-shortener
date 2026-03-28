// components/app-sidebar.tsx
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar
} from '@/components/ui/sidebar';
import { Link } from '@tanstack/react-router';
import {
  ChevronDown,
  CreditCard,
  FolderGit2,
  Globe, LayoutDashboard,
  Link2,
  QrCode,
  Settings,
  Shield,
  Users,
  Zap
} from 'lucide-react';
import { SideBarFooter } from './SideBareFooter';
import { SideBarThemeToggler } from './SideBarThemeToggler';
import { useLocation } from '@tanstack/react-router';

const mainNavigation = [
  {
    title: 'Overview',
    url: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview of your links'
  },
  {
    title: 'My Links',
    url: '/dashboard/links',
    icon: Link2,
    badge: '24',
    description: 'Manage your shortened URLs'
  },
  // {
  //   title: 'Analytics',
  //   url: '/dashboard/analytics',
  //   icon: BarChart3,
  //   description: 'Track link performance'
  // },
  {
    title: 'QR Codes',
    url: '/dashboard/qr-codes',
    icon: QrCode,
    badge: 'New',
    description: 'Generate and manage QR codes'
  },
  {
    title: 'Campaigns',
    url: '/dashboard/campaigns',
    icon: FolderGit2,
    description: 'Organize links into campaigns'
  },
]

const toolsNavigation = [
  {
    title: 'Bulk Shorten',
    url: '/dashboard/bulk',
    icon: Zap,
    description: 'Shorten multiple URLs at once'
  },
  {
    title: 'Custom Domains',
    url: '/dashboard/domains',
    icon: Globe,
    badge: 'Pro',
    description: 'Use your own domain'
  },
  {
    title: 'Team',
    url: '/dashboard/team',
    icon: Users,
    description: 'Manage team members'
  },
  {
    title: 'API Access',
    url: '/dashboard/api',
    icon: Shield,
    description: 'Developer API keys'
  },
]

const settingsNavigation = [
  {
    title: 'Billing',
    url: '/dashboard/billing',
    icon: CreditCard,
    description: 'Plans and payments'
  },
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: Settings,
    description: 'Account preferences'
  },
]

interface AppSidebarProps {
  user?: {
    name: string
    email: string
    plan?: 'free' | 'pro' | 'business'
    avatar?: string
  }
}

export function AppSidebar({

}: AppSidebarProps) {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'
  const location = useLocation()

  const normalizePathname = (path: string) => {
    if (path !== '/' && path.endsWith('/')) return path.slice(0, -1)
    return path
  }

  const pathname = normalizePathname(location.pathname)

  const isNavItemActive = (itemUrl: string) => {
    const normalizedItemUrl = normalizePathname(itemUrl)

    // Avoid "Overview" being active on every dashboard sub-route.
    if (normalizedItemUrl === '/dashboard') return pathname === normalizedItemUrl

    return pathname === normalizedItemUrl || pathname.startsWith(`${normalizedItemUrl}/`)
  }

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      {/* Header with logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to="/">

              <SidebarMenuButton size="lg" >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Link2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">ShortLink</span>
                  <span className="truncate text-xs text-muted-foreground">
                    URL Shortener
                  </span>
                </div>

              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Content */}
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>

                  <Link to={item.url} className="cursor-pointer">
                    <SidebarMenuButton
                      tooltip={item.description}
                      isActive={isNavItemActive(item.url)}
                      className="cursor-pointer"
                    >
                      <item.icon />
                      <span>{item.title}</span>

                    </SidebarMenuButton>
                  </Link>
                  {item.badge && !isCollapsed && (
                    <SidebarMenuBadge>
                      {item.badge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tools Navigation with Collapsible */}
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <CollapsibleTrigger className={"cursor-pointer flex flex-row items-center justify-between"}>
              <SidebarGroupLabel >
                Tools
              </SidebarGroupLabel>
              <div>
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {toolsNavigation.map((item) => (
                    <SidebarMenuItem key={item.title}>

                      <Link to={item.url}>
                        <SidebarMenuButton
                          className='cursor-pointer'
                          tooltip={item.description}
                          isActive={isNavItemActive(item.url)}
                        >
                          <item.icon />
                          <span>{item.title}</span>

                        </SidebarMenuButton>
                      </Link>
                      {item.badge && !isCollapsed && (
                        <SidebarMenuBadge className="bg-primary/10 text-primary">
                          {item.badge}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Settings Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>

                  <Link to={item.url}>
                    <SidebarMenuButton
                      className='cursor-pointer'
                      tooltip={item.description}
                      isActive={isNavItemActive(item.url)}
                    >
                      <item.icon />
                      <span>{item.title}</span>

                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SideBarThemeToggler />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


      </SidebarContent>

      {/* Footer with User Profile */}

      <SidebarSeparator className={"ml-0"} />
      <SideBarFooter />
      <SidebarRail />
    </Sidebar>
  )
}
