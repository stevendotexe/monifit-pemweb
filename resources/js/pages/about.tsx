import MinimalLayout from '@/layouts/minimal-layout';
import { Link } from '@inertiajs/react';

export default function About() {
  return (
    <MinimalLayout>
      <div className="max-w-2xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-4">About MoniFit</h1>
        <p className="mb-6">
          MoniFit is dedicated to helping you achieve your health and fitness goals through smart tracking and a supportive community.
        </p>
        <h2 className="text-2xl font-semibold mb-2">Logo Philosophy</h2>
        <p className="mb-4">
          Our logo is a golden circle, with an orange above the "i" in MoniFit symbolizing health, vitality, and a fresh start. The circle represents wholeness and balance, which are at the core of our mission.
        </p>
        <Link href="/logo-philosophy" className="text-blue-600 underline">Read more about our logo philosophy</Link>
      </div>
    </MinimalLayout>
  );
} 