import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Settings, Utensils, LayoutDashboard, DollarSign, Store, User } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'My Foods',
        href: '/foods',
        icon: Utensils,
    },
    {
        title: 'Vendors',
        href: '/vendors',
        icon: Store,
    },
    {
        title: 'Profile',
        href: '/settings/profile',
        icon: User,
    },
    {
        title: 'History',
        href: '/data/history',
        icon: BookOpen,
    },
];

const footerNavItems: NavItem[] = [
    {
<<<<<<< HEAD
        title: 'Repository',
        href: 'https://github.com/stevendotexe/monifit-pemweb',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
=======
        title: 'Subscribe Today',
        href: route('subscribe'),
        icon: DollarSign,
>>>>>>> e00a381006c55203a40e6fda524906b0dd53c347
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
