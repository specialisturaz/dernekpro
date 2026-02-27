export default function MaintenancePage({ message }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center px-6 max-w-lg">
        <div className="mb-8">
          <svg
            className="w-24 h-24 mx-auto text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Bakım Çalışması
        </h1>

        <p className="text-gray-600 text-lg mb-6">
          {message ||
            "Sitemiz şu anda bakım çalışması nedeniyle geçici olarak hizmet dışıdır. Kısa süre içinde tekrar hizmetinizde olacağız."}
        </p>

        <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-200">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          Çalışmalar devam ediyor...
        </div>
      </div>
    </div>
  );
}
