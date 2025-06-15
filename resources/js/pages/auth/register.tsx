import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout 
            title="Create an account" 
            description="Enter your details below to create your account"
        >
            <Head title="Register" />
            <main className="flex items-center justify-center min-h-screen py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 w-[95%] min-w-[80vw] max-w-[1400px] min-h-[600px] rounded-lg overflow-hidden shadow-lg">
                    <div className="flex flex-col justify-center items-center p-8 bg-background">
                        <h1 className="text-3xl font-bold mb-6">Register</h1>
                        <form onSubmit={submit} className="w-full max-w-[500px]">
                            <div className="flex flex-col mb-4">
                                <Label htmlFor="name" className="text-lg mb-2">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full h-10 px-3 rounded-lg border border-input focus:border-primary focus:outline-none transition-colors"
                                    placeholder="Full name"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="flex flex-col mb-4">
                                <Label htmlFor="email" className="text-lg mb-2">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full h-10 px-3 rounded-lg border border-input focus:border-primary focus:outline-none transition-colors"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="flex flex-col mb-4">
                                <Label htmlFor="password" className="text-lg mb-2">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full h-10 px-3 rounded-lg border border-input focus:border-primary focus:outline-none transition-colors"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex flex-col mb-6">
                                <Label htmlFor="password_confirmation" className="text-lg mb-2">Confirm Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full h-10 px-3 rounded-lg border border-input focus:border-primary focus:outline-none transition-colors"
                                    placeholder="Confirm password"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full h-12 text-lg font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                Register
                            </Button>

                            <p className="mt-4 text-center text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <TextLink href={route('login')} className="text-primary hover:underline">
                                    Login
                                </TextLink>
                            </p>
                        </form>
                    </div>

                    <div className="hidden md:flex flex-col justify-center items-center p-8 text-center text-white bg-gradient-to-br from-primary to-secondary">
                        <h1 className="text-4xl font-bold mb-4">Welcome to MoniFit</h1>
                        <p className="text-xl mb-6">Track your daily nutrition intake</p>
                        <p className="text-sm">
                            Already have an account?{' '}
                            <TextLink href={route('login')} className="text-white hover:underline">
                                Login
                            </TextLink>
                        </p>
                    </div>
                </div>
            </main>
        </AuthLayout>
    );
}
