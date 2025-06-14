import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu";

export function LandingNavbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 background backdrop-blur-md border-b">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-8">
                    <Link href="/" className="text-2xl font-bold text-primary">
                        MoniFit
                    </Link>
                    <NavigationMenu>
                        <NavigationMenuList className="hidden md:flex space-x-6">
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    href="#features"
                                    className="muted hover:secondary hover:secondary px-3 py-2 rounded-md transition-colors"
                                >
                                    Features
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    href="#testimonials"
                                    className="muted hover:bg-primary hover:text-primary-foreground px-3 py-2 rounded-md transition-colors"
                                >
                                    Testimonials
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <div className="flex items-center space-x-4">
                    <Link href={route('login')} className="muted hover:bg-primary hover:text-primary-foreground px-3 py-2 rounded-md transition-colors">
                        Log in
                    </Link>
                    <Link href={route('register')}>
                        <Button>Get Started</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
} 