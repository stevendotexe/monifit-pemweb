import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { LandingNavbar } from '@/components/layout/LandingNavbar';
import { toast, Toaster } from "sonner";
import { FaMale, FaFemale } from 'react-icons/fa';
import React, { useState } from 'react';

const BMI_CATEGORIES = [
  { label: 'Underweight', min: 0, max: 18.5, color: 'bg-blue-400', description: 'Your BMI is below the healthy range. Being underweight may increase your risk of health problems. Consider consulting a healthcare provider for advice.' },
  { label: 'Normal', min: 18.5, max: 24.9, color: 'bg-green-500', description: 'Your BMI is within the healthy range. Maintain your current lifestyle to keep up your good health!' },
  { label: 'Overweight', min: 25, max: 29.9, color: 'bg-yellow-400', description: 'Your BMI is above the healthy range. Consider adopting a healthier diet and increasing physical activity.' },
  { label: 'Obesity', min: 29.9, max: 100, color: 'bg-gradient-to-r from-red-400 to-red-800', description: 'Your BMI is well above the healthy range. This may increase your risk of serious health conditions. Please consult a healthcare provider for guidance.' },
];

const CHILD_BMI_CATEGORIES = [
  { label: 'Underweight', min: 0, max: 19, color: 'bg-blue-400', description: 'Your BMI is below the healthy range for your age. Please consult a healthcare provider for advice.' },
  { label: 'Healthy Weight', min: 19.1, max: 27, color: 'bg-green-500', description: 'Your BMI is within the healthy range for your age.' },
  { label: 'Overweight', min: 25, max: 30, color: 'bg-yellow-400', description: 'Your BMI is above the healthy range for your age. Consider healthy habits and consult a healthcare provider.' },
  { label: 'Obese', min: 30, max: 100, color: 'bg-red-500', description: 'Your BMI is well above the healthy range for your age. Please consult a healthcare provider for guidance.' },
];

function getBMICategory(bmi: number) {
  return BMI_CATEGORIES.find(cat => bmi >= cat.min && bmi < cat.max)?.label || '';
}

function getBMIDescription(bmi: number) {
  return BMI_CATEGORIES.find(cat => bmi >= cat.min && bmi < cat.max)?.description || '';
}

function getChildBMICategory(bmi: number) {
  return CHILD_BMI_CATEGORIES.find(cat => bmi >= cat.min && bmi < cat.max)?.label || '';
}

function getChildBMIDescription(bmi: number) {
  return CHILD_BMI_CATEGORIES.find(cat => bmi >= cat.min && bmi < cat.max)?.description || '';
}

function getChildBarWidth(cat: {min: number, max: number}) {
  // Bar covers BMI 19 to 30 (11 units)
  const min = 19, max = 30;
  return ((Math.min(cat.max, max) - Math.max(cat.min, min)) / (max - min)) * 100;
}

function getChildPointerPosition(bmi: number) {
  const min = 19, max = 30;
  const clamped = Math.max(min, Math.min(max, bmi));
  return ((clamped - min) / (max - min)) * 100;
}

export default function BMITest() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [showBMIResult, setShowBMIResult] = useState(false);

  // Calculate pointer position (0-100%)
  const getPointerPosition = (bmi: number) => {
    // Clamp BMI between 12 and 40 for bar
    const min = 12, max = 40;
    const clamped = Math.max(min, Math.min(max, bmi));
    return ((clamped - min) / (max - min)) * 100;
  };

  return (
    <>
      <Head title="Monifit - BMI Test" />
      <Toaster />
      <LandingNavbar />
      <div className="">
        {/* Step 1: Intro */}
        <div className='container mx-auto px-4 flex flex-col items-center justify-center min-h-[80vh] transition-opacity duration-500' id="questionBody1">
          <h1 className="font-bold text-5xl text-center">Body Mass Index</h1>
          <p className="muted text-center mt-4">Body Mass Index is a calculation that uses height and weight to estimate body fat. </p>
          <Button onClick={() => {
            const qb = document.getElementById("questionBody1");
            const qb2 = document.getElementById("questionBody2");
            if(qb && qb2){
              qb.style.opacity = "0";
              qb2.style.display = "flex";
              qb2.style.opacity = "0";
              setTimeout(() => {
                qb.style.display = "none";
                qb2.style.opacity = "1";
              }, 500);
            }
          }} size="lg" className="mt-3 w-full sm:w-auto cursor-pointer transition-colors">
            Start Test
            <ArrowRight className='w-5 h-5 ml-2'></ArrowRight>
          </Button>
        </div>

        {/* Step 2: Weight */}
        <div className='container mx-auto px-4 flex-col items-center justify-center min-h-[80vh] transition-opacity duration-500 hidden' id="questionBody2">
          <h1 className="font-bold text-5xl text-center">What's your weight?</h1>
          <p className="muted text-center mt-4">Enter your weight in kilograms (kg)</p>
          <input 
            name="weight input"
            type="number"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            className="mt-4 w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter weight in kg"
          />
          <Button onClick={() => {
            const weightInput = document.querySelector('input[name="weight input"]') as HTMLInputElement;
            if (!weightInput.value) {
              toast.error("Weight Required", {
                description: "Please enter your weight to continue.",
              });
              return;
            }
            setWeight(weightInput.value);
            const qb = document.getElementById("questionBody2");
            const qb2 = document.getElementById("questionBody3");
            if(qb && qb2){
              qb.style.opacity = "0";
              qb2.style.display = "flex";
              qb2.style.opacity = "0";
              setTimeout(() => {
                qb.style.display = "none";
                qb2.style.opacity = "1";
              }, 500);
            }
          }} size="lg" className="mt-3 w-full sm:w-auto cursor-pointer transition-colors">
            Next
            <ArrowRight className='w-5 h-5 ml-2'></ArrowRight>
          </Button>
        </div>

        {/* Step 3: Height */}
        <div className='container mx-auto px-4 flex-col items-center justify-center min-h-[80vh] transition-opacity duration-500 hidden' id="questionBody3">
          <h1 className="font-bold text-5xl text-center">What about your height?</h1>
          <p className="muted text-center mt-4">Enter your height in centimeters (cm)</p>
          <input 
            name="height input"
            type="number"
            value={height}
            onChange={e => setHeight(e.target.value)}
            className="mt-4 w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter height in cm"
          />
          <Button onClick={() => {
            const heightInput = document.querySelector('input[name="height input"]') as HTMLInputElement;
            if (!heightInput.value) {
              toast.error("Height Required", {
                description: "Please enter your height to continue.",
              });
              return;
            }
            setHeight(heightInput.value);

            const h = parseFloat(heightInput.value) / 100;
            const w = parseFloat(weight);
            if (h && w) setBmi(w / (h * h));
            const qb = document.getElementById("questionBody3");
            const qb2 = document.getElementById("questionBody4");
            if(qb && qb2){
              qb.style.opacity = "0";
              qb2.style.display = "flex";
              qb2.style.opacity = "0";
              setTimeout(() => {
                qb.style.display = "none";
                qb2.style.opacity = "1";
              }, 500);
            }
          }} size="lg" className="mt-3 w-full sm:w-auto cursor-pointer transition-colors">
            Next
            <ArrowRight className='w-5 h-5 ml-2'></ArrowRight>
          </Button>
        </div>

        {/* Step 4: Gender Pick */}
        <div className='container mx-auto px-4 flex-col items-center justify-center min-h-[80vh] transition-opacity duration-500 hidden' id="questionBody4">
          <h1 className="font-bold text-5xl text-center">What is your biological gender?</h1>
          <div className="flex gap-8 mt-8 justify-center">
            <button
              name="gender-male"
              className={`flex flex-col items-center gap-2 p-6 rounded-lg border-2 hover:border-primary transition-colors cursor-pointer ${gender === 'male' ? 'border-primary bg-primary text-primary-foreground' : ''}`}
              onClick={() => setGender('male')}
            >
              <FaMale className="w-12 h-12" />
              <span className="font-medium">Male</span>
            </button>
            <button 
              name="gender-female"
              className={`flex flex-col items-center gap-2 p-6 rounded-lg border-2 hover:border-primary transition-colors cursor-pointer ${gender === 'female' ? 'border-primary bg-primary text-primary-foreground' : ''}`}
              onClick={() => setGender('female')}
            >
              <FaFemale className="w-12 h-12" />
              <span className="font-medium">Female</span>
            </button>
          </div>
          <Button onClick={() => {
            const maleBtn = document.querySelector('[name="gender-male"]');
            const femaleBtn = document.querySelector('[name="gender-female"]');
            const isMaleSelected = maleBtn?.classList.contains('border-primary');
            const isFemaleSelected = femaleBtn?.classList.contains('border-primary');
            if (!isMaleSelected && !isFemaleSelected) {
              toast.error("Gender Required", {
                description: "Please select your gender to continue.",
              });
              return;
            }
            setGender(isMaleSelected ? 'male' : 'female');
            const qb = document.getElementById("questionBody4");
            const qb2 = document.getElementById("questionBody5");
            if(qb && qb2){
              qb.style.opacity = "0";
              qb2.style.display = "flex";
              qb2.style.opacity = "0";
              setTimeout(() => {
                qb.style.display = "none";
                qb2.style.opacity = "1";
              }, 500);
            }
          }} size="lg" className="mt-3 w-full sm:w-auto cursor-pointer transition-colors">
            Next
            <ArrowRight className='w-5 h-5 ml-2'></ArrowRight>
          </Button>
        </div>

        {/* Step 5: Age */}
        <div className='container mx-auto px-4 flex-col items-center justify-center min-h-[80vh] transition-opacity duration-500 hidden' id="questionBody5">
          <h1 className="font-bold text-5xl text-center">How old are you?</h1>
          <p className="muted text-center mt-4">Enter your age in years</p>
          <input 
            name="age input"
            type="number"
            value={age}
            onChange={e => setAge(e.target.value)}
            className="mt-4 w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter your age"
          />
          <Button onClick={() => {
            const ageInput = document.querySelector('input[name="age input"]') as HTMLInputElement;
            if (!ageInput.value) {
              toast.error("Age Required", {
                description: "Please enter your age to continue.",
              });
              return;
            }
            setAge(ageInput.value);
            setShowBMIResult(true);
            const qb = document.getElementById("questionBody5");
            const qb2 = document.getElementById("bmiResultSection");
            if(qb && qb2){
              qb.style.opacity = "0";
              qb2.style.display = "flex";
              qb2.style.opacity = "0";
              setTimeout(() => {
                qb.style.display = "none";
                qb2.style.opacity = "1";
              }, 500);
            }
          }} size="lg" className="mt-3 w-full sm:w-auto cursor-pointer transition-colors">
            Next
            <ArrowRight className='w-5 h-5 ml-2'></ArrowRight>
          </Button>
        </div>

        {/* Step 6: BMI Result */}
        <div className='container mx-auto px-4 pt-30 flex-col items-center justify-center min-h-[80vh] transition-opacity duration-500 hidden' id="bmiResultSection">
          {bmi && showBMIResult && (
            <div className="w-full max-w-xl flex flex-col items-center mt-8">
              <h1 className="font-bold text-4xl text-center mb-6">Your BMI Result</h1>
              {Number(age) >= 2 && Number(age) <= 20 ? (
                <>
                  <div className="relative w-full max-w-lg h-16 flex flex-col items-center">
                    {/* Child/Teen BMI Bar */}
                    <div className="w-full h-6 rounded-full flex overflow-hidden">
                      {CHILD_BMI_CATEGORIES.map((cat, idx) => (
                        <div
                          key={cat.label}
                          className={`${cat.color} h-full`}
                          style={{ width: `${getChildBarWidth(cat)}%` }}
                        />
                      ))}
                    </div>
                    {/* Pointer */}
                    <div
                      className="absolute left-0 -top-4 flex flex-col items-center"
                      style={{ left: `calc(${getChildPointerPosition(bmi)}% - 10px)` }}
                    >
                      <span className="text-xs mb-1 font-semibold">{bmi.toFixed(1)}</span>
                      <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-primary" />
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <div className="text-2xl font-bold">{getChildBMICategory(bmi)}</div>
                    <div className="text-lg mt-2">BMI: <span className="font-semibold">{bmi.toFixed(1)}</span></div>
                    <div className="mt-4 text-base text-muted-foreground max-w-lg mx-auto">{getChildBMIDescription(bmi)}</div>
                    <div className="mt-2 text-base text-muted-foreground">Age: {age}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative w-full max-w-lg h-16 flex flex-col items-center">
                    {/* BMI Bar */}
                    <div className="w-full h-6 rounded-full flex overflow-hidden">
                      {BMI_CATEGORIES.map((cat, idx) => (
                        <div
                          key={cat.label}
                          className={`${cat.color} h-full`}
                          style={{ width: `${((cat.max - cat.min) / (40 - 12)) * 100}%` }}
                        />
                      ))}
                    </div>
                    {/* Pointer */}
                    <div
                      className="absolute left-0 -top-4 flex flex-col items-center"
                      style={{ left: `calc(${getPointerPosition(bmi)}% - 10px)` }}
                    >
                      <span className="text-xs mb-1 font-semibold">{bmi.toFixed(1)}</span>
                      <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-primary" />
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <div className="text-2xl font-bold">{getBMICategory(bmi)}</div>
                    <div className="text-lg mt-2">BMI: <span className="font-semibold">{bmi.toFixed(1)}</span></div>
                    <div className="mt-4 text-base text-muted-foreground max-w-lg mx-auto">{getBMIDescription(bmi)}</div>
                    <div className="mt-2 text-base text-muted-foreground">Age: {age}</div>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="flex-1 flex flex-col items-center mt-10">
            <h2 className="font-bold text-3xl">Start your healthy journey with an account </h2>
            <Link href={route('register')} className="mt-4 block">
                <Button size="lg" className="w-full sm:w-auto cursor-pointer transition-colors">
                    Register an account
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}