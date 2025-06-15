import { type BreadcrumbItem, type SharedData, type User } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { parseISO, format } from 'date-fns';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';

type PageProps<T = unknown> = {
    user: User;
    bmr: number | null;
} & T;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    name: string;
    email: string;
    gender: string;
    birth_date: Date | undefined; // Updated type for DatePicker
    weight_kg: string;
    height_cm: string;
};

export default function Profile({ user, bmr }: PageProps<{ user: User; bmr: number | null }>) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful, transform } = useForm<ProfileForm>({
        name: auth.user.name,
        email: auth.user.email,
        gender: auth.user.gender || '',
        birth_date: auth.user.birth_date ? parseISO(auth.user.birth_date) : undefined, // Convert string to Date object
        weight_kg: String(auth.user.weight_kg || ''),
        height_cm: String(auth.user.height_cm || ''),
    });

    // Transform date back to string before submitting to backend
    transform((data) => ({
        ...data,
        birth_date: data.birth_date ? format(data.birth_date, 'yyyy-MM-dd') : null,
    }));

    const mustVerifyEmail = !!auth.user.must_verify_email;
    const status = usePage().props.status as string | undefined;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your name and email address" />

                    {bmr ? (
                        <div className="mb-6 rounded-lg border bg-primary/10 p-4 text-center">
                            <p className="text-sm text-muted-foreground">Estimated Daily Calorie Needs (BMR)</p>
                            <p className="text-3xl font-bold text-primary">{Math.round(bmr)} kcal</p>
                        </div>
                    ) : (
                        <div className="mb-6 rounded-lg border bg-muted p-4 text-center">
                            <p className="text-sm text-muted-foreground">
                                Complete your personal data (gender, birth date, weight, and height) to see your estimated daily calorie needs.
                            </p>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="-mt-4 text-sm text-muted-foreground">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>
                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div>
                            <Label htmlFor="gender">Gender</Label>
                            <Select value={data.gender} onValueChange={(value) => setData('gender', value)}>
                                <SelectTrigger id="gender" className="w-full mt-1">
                                    <SelectValue placeholder="Select a gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.gender} className="mt-2" />
                        </div>

                        <div>
                            <Label>Birth Date</Label>
                            <DatePicker
                                date={data.birth_date}
                                setDate={(date) => setData('birth_date', date)}
                            />
                            <InputError message={errors.birth_date} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="weight_kg">Weight (kg)</Label>
                            <Input
                                id="weight_kg"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.weight_kg || ''}
                                onChange={(e) => setData('weight_kg', e.target.value)}
                            />
                            <InputError message={errors.weight_kg} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="height_cm">Height (cm)</Label>
                            <Input
                                id="height_cm"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.height_cm || ''}
                                onChange={(e) => setData('height_cm', e.target.value)}
                            />
                            <InputError message={errors.height_cm} className="mt-2" />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>
                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
