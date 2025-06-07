export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Web
            </h1>
            <p className="hidden md:block text-gray-600 dark:text-gray-300">
              Static Frontend Demo
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
