const Sidebar = () => {
    return (
      <aside className="w-64 bg-gray-800 text-white p-4 h-screen">
        <nav>
          <ul className="space-y-2">
            <li>
              <a href="#" className="block p-2 hover:bg-gray-700 rounded">Home</a>
            </li>
            <li>
              <a href="#" className="block p-2 hover:bg-gray-700 rounded">Profile</a>
            </li>
            <li>
              <a href="#" className="block p-2 hover:bg-gray-700 rounded">Settings</a>
            </li>
            <li>
              <a href="#" className="block p-2 hover:bg-gray-700 rounded">Logout</a>
            </li>
          </ul>
        </nav>
      </aside>
    );
  };
  
  export default Sidebar;