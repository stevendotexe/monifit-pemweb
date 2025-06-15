import MinimalLayout from '@/layouts/minimal-layout';

export default function LogoPhilosophy() {
  return (
    <MinimalLayout>
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Logo Philosophy</h1>
        <img src="/images/logowhite.png" alt="MoniFit Logo" className="mx-auto mb-6 w-40 h-auto" />
        <p className="mb-4">
          The MoniFit logo is a golden circle, representing wholeness, unity, and the journey toward a balanced life. Above the "i" in MoniFit, an orange fruit is placed, symbolizing health, vitality, and a fresh start. The orange is a universal symbol of wellness and energy, reflecting our commitment to helping you live your healthiest life.
        </p>
        <p>
          The combination of the golden circle and the orange fruit embodies our mission: to support your pursuit of health and balance, every day.
        </p>
      </div>
    </MinimalLayout>
  );
} 