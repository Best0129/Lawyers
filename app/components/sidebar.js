'use client';

import Link from 'next/link';
import { Home, List, Menu } from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-gray-900 text-white p-4 h-screen transition-all duration-300 flex flex-col`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white mb-4 p-2 hover:bg-gray-700 rounded focus:outline-none"
        aria-label="Toggle Sidebar"
      >
        <Menu /> 
      </button>

      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded transition-colors"
            >
              <Home size={20} />
              {isOpen && <span>หน้าหลัก</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/list_1"
              className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded transition-colors"
            >
              <List size={20} />
              {isOpen && <span>บัญชีที่ 1</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/list_2"
              className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded transition-colors"
            >
              <List size={20} />
              {isOpen && <span>บัญชีที่ 2</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
