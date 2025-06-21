import React from "react";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top App Bar */}
      <header className="bg-gradient-to-br from-indigo-600 to-indigo-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
          <h1 className="text-white text-lg font-semibold flex-grow">
            Excel Analytics Dashboard
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-slate-50 py-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
