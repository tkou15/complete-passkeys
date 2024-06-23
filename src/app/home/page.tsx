import Login from '@/components/login';
import Register from '@/components/register';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Passkeys
      </h1>
      <div className="flex flex-row items-center w-full p-24">
        <div className="basis-1/3">
          <Register></Register>
        </div>
        <div className="basis-1/3">
          <Login></Login>
        </div>
        <div className="basis-1/3">
          <Login></Login>
        </div>
      </div>
    </main>
  );
}
