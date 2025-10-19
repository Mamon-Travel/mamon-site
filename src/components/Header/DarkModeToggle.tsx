'use client';

import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Sayfa yüklendiğinde mevcut temayı kontrol et
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="group relative flex items-center justify-center rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      aria-label={isDarkMode ? 'Light mode\'a geç' : 'Dark mode\'a geç'}
    >
      {/* Güneş İkonu (Light Mode) */}
      <SunIcon
        className={`h-5 w-5 transition-all duration-300 ${
          isDarkMode
            ? 'rotate-90 scale-0 opacity-0'
            : 'rotate-0 scale-100 opacity-100'
        } absolute text-amber-500`}
      />

      {/* Ay İkonu (Dark Mode) */}
      <MoonIcon
        className={`h-5 w-5 transition-all duration-300 ${
          isDarkMode
            ? 'rotate-0 scale-100 opacity-100'
            : '-rotate-90 scale-0 opacity-0'
        } absolute text-blue-500 dark:text-blue-400`}
      />

      {/* Placeholder for maintaining size */}
      <div className="h-5 w-5 opacity-0">
        <SunIcon className="h-5 w-5" />
      </div>
    </button>
  );
}

