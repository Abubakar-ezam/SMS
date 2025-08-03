import React from "react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "students", label: "Students"},
    { id: "classes", label: "Classes"},
    { id: "enrollments", label: "Enrollments" },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">SMS Dashboard</h1>
      </div>
      <nav className="mt-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center w-full px-4 py-3 hover:bg-gray-700 transition-colors ${
                  activeTab === item.id ? "bg-blue-600" : ""
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
