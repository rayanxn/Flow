import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="font-serif text-4xl text-text">Page not found</h1>
        <p className="mt-2 text-text-secondary">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
