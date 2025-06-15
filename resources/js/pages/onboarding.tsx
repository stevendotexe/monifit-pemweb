import { useForm } from '@inertiajs/react';
import MinimalLayout from '@/layouts/minimal-layout';
import { FaMale, FaFemale } from 'react-icons/fa';
import { useState } from 'react';

export default function Onboarding() {
    const { data, setData, post, processing, errors } = useForm({
        gender: '',
        birth_date: '',
        weight_kg: '',
        height_cm: '',
    });
    const [step, setStep] = useState(1);
    const [fade, setFade] = useState<'in' | 'out'>('in');

    function nextStep(e?: React.FormEvent) {
        if (e) e.preventDefault();
        setFade('out');
        setTimeout(() => {
            setStep((s) => s + 1);
            setFade('in');
        }, 300);
    }
    function prevStep() {
        setFade('out');
        setTimeout(() => {
            setStep((s) => s - 1);
            setFade('in');
        }, 300);
    }
    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/onboarding');
    }

    return (
        <MinimalLayout>
            <div className="max-w-md w-full bg-white dark:bg-background p-8 rounded-xl shadow">
                <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h1>
                <form onSubmit={submit} className="flex flex-col gap-6">
                    <div className={`transition-opacity duration-300 ${fade === 'in' ? 'opacity-100' : 'opacity-0'}`} key={step}>
                        {step === 1 && (
                            <div className="flex flex-col items-center gap-6">
                                <h2 className="text-xl font-semibold">What is your biological gender?</h2>
                                <div className="flex gap-8 mt-2 justify-center">
                                    <button
                                        type="button"
                                        className={`flex flex-col items-center gap-2 p-6 rounded-lg border-2 hover:border-primary transition-colors cursor-pointer ${data.gender === 'male' ? 'border-primary bg-primary text-primary-foreground' : ''}`}
                                        onClick={() => setData('gender', 'male')}
                                    >
                                        <FaMale className="w-12 h-12" />
                                        <span className="font-medium">Male</span>
                                    </button>
                                    <button
                                        type="button"
                                        className={`flex flex-col items-center gap-2 p-6 rounded-lg border-2 hover:border-primary transition-colors cursor-pointer ${data.gender === 'female' ? 'border-primary bg-primary text-primary-foreground' : ''}`}
                                        onClick={() => setData('gender', 'female')}
                                    >
                                        <FaFemale className="w-12 h-12" />
                                        <span className="font-medium">Female</span>
                                    </button>
                                </div>
                                {errors.gender && <div className="text-red-500 text-sm">{errors.gender}</div>}
                                <button type="button" className="bg-primary text-white rounded p-2 mt-4 w-full" onClick={nextStep} disabled={!data.gender}>Next</button>
                            </div>
                        )}
                        {step === 2 && (
                            <div className="flex flex-col items-center gap-6">
                                <h2 className="text-xl font-semibold">When is your birth date?</h2>
                                <input type="date" value={data.birth_date} onChange={e => setData('birth_date', e.target.value)} className="w-full border rounded p-2" />
                                {errors.birth_date && <div className="text-red-500 text-sm">{errors.birth_date}</div>}
                                <div className="flex w-full gap-2">
                                    <button type="button" className="bg-muted text-foreground rounded p-2 w-1/2" onClick={prevStep}>Back</button>
                                    <button type="button" className="bg-primary text-white rounded p-2 w-1/2" onClick={nextStep} disabled={!data.birth_date}>Next</button>
                                </div>
                            </div>
                        )}
                        {step === 3 && (
                            <div className="flex flex-col items-center gap-6">
                                <h2 className="text-xl font-semibold">What is your weight?</h2>
                                <input type="number" value={data.weight_kg} onChange={e => setData('weight_kg', e.target.value)} className="w-full border rounded p-2" placeholder="Enter weight in kg" />
                                {errors.weight_kg && <div className="text-red-500 text-sm">{errors.weight_kg}</div>}
                                <div className="flex w-full gap-2">
                                    <button type="button" className="bg-muted text-foreground rounded p-2 w-1/2" onClick={prevStep}>Back</button>
                                    <button type="button" className="bg-primary text-white rounded p-2 w-1/2" onClick={nextStep} disabled={!data.weight_kg}>Next</button>
                                </div>
                            </div>
                        )}
                        {step === 4 && (
                            <div className="flex flex-col items-center gap-6">
                                <h2 className="text-xl font-semibold">What is your height?</h2>
                                <input type="number" value={data.height_cm} onChange={e => setData('height_cm', e.target.value)} className="w-full border rounded p-2" placeholder="Enter height in cm" />
                                {errors.height_cm && <div className="text-red-500 text-sm">{errors.height_cm}</div>}
                                <div className="flex w-full gap-2">
                                    <button type="button" className="bg-muted text-foreground rounded p-2 w-1/2" onClick={prevStep}>Back</button>
                                    <button type="submit" className="bg-primary text-white rounded p-2 w-1/2" disabled={!data.height_cm || processing}>Submit</button>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </MinimalLayout>
    );
} 