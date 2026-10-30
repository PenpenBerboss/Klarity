import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-2">Page non trouvée (404)</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">La page que vous recherchez n&apos;existe pas ou a été déplacée.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Retourner à l&apos;accueil
      </Link>
    </div>
  );
}
