import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-white">
      <h1 className="text-7xl font-bold tracking-tight text-neutral-900">404</h1>
      <p className="mt-4 text-lg text-neutral-600">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white shadow transition-colors hover:bg-neutral-800"
      >
        Back to Home
      </Link>
    </div>
  );
}
