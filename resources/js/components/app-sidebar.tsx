import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, BoxIcon, CrownIcon, TagIcon, UserIcon, UsersIcon, ListOrderedIcon, NotepadText,  } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as products } from '@/routes/products';
import { index as pos} from '@/routes/pos';
import { index as discounts} from '@/routes/discounts';
import { index as users} from '@/routes/users';
import { index as customers} from '@/routes/customers';
import { index as orders} from '@/routes/orders';
import type { NavItem } from '@/types';
import AppLogoIcon from './app-logo-icon';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        roles:['admin']
    },
    {
        title: 'Products',
        href: products(),
        icon: BoxIcon,
        roles:['admin']
    },
    {
        title: 'Discounts',
        href: discounts(),
        icon: TagIcon,
        roles:['admin']
    },
    {
        title: 'Users',
        href: users(),
        icon: UserIcon,
        roles:['admin']
    },
    {
        title: 'Pos',
        href: pos(),
        icon: CrownIcon,
        roles:['cashier']
    },
    {
        title: 'Customer',
        href: customers(),
        icon: UsersIcon,
        roles:['admin']
    },
    {
        title: 'Order',
        href: orders(),
        icon: NotepadText,
        roles:['admin','cashier']
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const props = usePage().props
    const userRole = props.auth.user?.role;

    // 2. Filter menu sesuai role user yang sedang login
    const filteredMainNavItems = mainNavItems.filter((item) => {
        // Jika menu tidak membatasi role, izinkan tampil
        if (!item.roles || item.roles.length === 0) {
            return true;
        }

        // Cek apakah role user termasuk dalam daftar roles menu tersebut
        return userRole ? item.roles.includes(userRole) : false;
    });

     const filteredFooterNavItems = footerNavItems.filter((item) => {
        // Jika menu tidak membatasi role, izinkan tampil
        if (!item.roles || item.roles.length === 0) {
            return true;
        }

        // Cek apakah role user termasuk dalam daftar roles menu tersebut
        return userRole ? item.roles.includes(userRole) : false;
    });
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogoIcon />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredMainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={filteredFooterNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
