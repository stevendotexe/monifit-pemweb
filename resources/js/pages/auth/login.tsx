import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout 
            title="Log in to your account" 
            description="Enter your email and password below to log in"
        >
            <Head title="Log in" />
            <main className="flex items-center justify-center w-full min-h-screen py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 w-[95%] min-w-[80vw] max-w-[1400px] min-h-[600px] rounded-lg overflow-hidden shadow-lg">
                    <div className="flex flex-col justify-center items-center p-8 bg-background">
                        <h1 className="text-3xl font-bold mb-6">Login</h1>
                        <form onSubmit={submit} className="w-full max-w-[500px]">
                            <div className="flex flex-col mb-4">
                                <Label htmlFor="email" className="text-lg mb-2">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoFocus
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full h-10 px-3 rounded-lg border border-input focus:border-primary focus:outline-none transition-colors"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="flex flex-col mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <Label htmlFor="password" className="text-lg">Password</Label>
                                    {canResetPassword && (
                                        <TextLink href={route('password.request')} className="text-sm text-primary hover:underline">
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
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

                            <div className="flex items-center space-x-3 mb-6">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onClick={() => setData('remember', !data.remember)}
                                />
                                <Label htmlFor="remember">Remember me</Label>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full h-12 text-lg font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                Login
                            </Button>

                            <p className="mt-4 text-center text-sm text-muted-foreground">
                                Don't have an account?{' '}
                                <TextLink href={route('register')} className="text-primary hover:underline">
                                    Register
                                </TextLink>
                            </p>
                        </form>
                    </div>

                    <div className="hidden md:flex flex-col justify-center items-center p-8 text-center text-white bg-gradient-to-br from-primary to-secondary">
                        <h1 className="text-4xl font-bold mb-4">Welcome Back to MoniFit!</h1>
                        <p className="text-xl mb-6">Good to see you again</p>
                        <p className="text-sm">
                            Don't have an account?{' '}
                            <TextLink href={route('register')} className="text-white hover:underline">
                                Register
                            </TextLink>
                        </p>
                    </div>
                </div>
            </main>
            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
