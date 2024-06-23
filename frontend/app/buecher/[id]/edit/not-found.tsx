import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <main className="d-flex h-100 flex-column align-items-center justify-content-center gap-2">
      <FaceFrownIcon className="w-25 text-dark" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>Kunde nicht gefunden</p>
      <Link
        href="/buecher"
        className="mt-4 rounded- bg-danger  px-4 py-2 text-sm text-white"
      >
        Go Back
      </Link>
    </main>
  );
}
