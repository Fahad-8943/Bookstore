import React from 'react'
import AdminHeader from "../components/AdminHeader";
import Sidebar from "../components/Sidebar";

function Settings() {
  return (
    <div>
      <AdminHeader />
      <div className="md:grid md:grid-cols-6">
        <div className="col-span-1">
          <Sidebar></Sidebar>
        </div>
        <div className="col-span-5">
          <h1>settings content</h1>
        </div>
      </div>
    </div>
  )
}

export default Settings