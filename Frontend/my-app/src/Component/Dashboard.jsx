import React from 'react';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white p-4 shadow">
        <nav className="flex justify-between items-center">
          <a href="#" className="text-lg font-bold">Dashboard</a>
          <a href="#logout" className="text-lg font-bold text-red-600">Logout</a>
        </nav>
      </header>
      <main className="p-4">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, User!</p>
        <section className="mt-4">
          <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
          <ul className="mt-2">
            <li className="flex justify-between items-center bg-white shadow p-4 rounded-lg mt-2">
              <p>Order #1234</p>
              <p>$100</p>
            </li>
            <li className="flex justify-between items-center bg-white shadow p-4 rounded-lg mt-2">
              <p>Order #1235</p>
              <p>$200</p>
            </li>
            <li className="flex justify-between items-center bg-white shadow p-4 rounded-lg mt-2">
              <p>Order #1236</p>
              <p>$300</p>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
