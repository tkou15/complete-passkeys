import Footer from '@/components/footer';
import Login from '@/components/login';
import Register from '@/components/register';
import RegisterOptions from '@/components/register-options';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 lg:p-24">
      <h1 className="mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white text-center">
        Passkeys
      </h1>
      <div className="flex flex-col lg:flex-row items-center w-full gap-4 p-4 sm:p-8 md:p-12 lg:p-24">
        <div className="w-full lg:basis-1/3">
          <Register />
        </div>
        <div className="w-full lg:basis-1/3">
          <Login />
        </div>
        <div className="w-full lg:basis-1/3">
          <Login />
        </div>
      </div>
      <div className="w-full max-w-4xl">
        <RegisterOptions />
      </div>
    </main>
  );
}
