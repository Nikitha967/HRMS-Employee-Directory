"use client";

import React, { useState, useEffect } from "react";
import { Edit2, Trash2 } from 'lucide-react';
import { Edit3 } from 'lucide-react';
import {
  Search,
  MoreHorizontal,
  Mail,
  MessageSquare,
  Grid,
  List,
  UserPlus,
  Download,
  User
} from "lucide-react";

interface Employee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  department: string;
  designation: string;
  manager: string;
  email: string;
  joiningDate: string;
  employmentStatus: string;
  availability: string;
  image: string;
  color: string;
  phone:string;
  
}




const gradientColors: Record<string, string> = {
  purple: "from-purple-500/10 to-purple-500/5",
  blue: "from-blue-500/10 to-blue-500/5",
  pink: "from-pink-500/10 to-pink-500/5",
  emerald: "from-emerald-500/10 to-emerald-500/5",
  orange: "from-orange-500/10 to-orange-500/5",
  indigo: "from-indigo-500/10 to-indigo-500/5"
};



export default function EmployeeDirectory() {
  const [message, setMessage] = useState("");
const [messages, setMessages] = useState<string[]>([]);

   const [activeEmployee, setActiveEmployee] = useState<any>(null);
 const [selectedDept, setSelectedDept] = useState("All");
 const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
 const [activeProfile, setActiveProfile] = useState<Employee | null>(null);
  const [chatSession, setChatSession] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
useEffect(() => {
  fetch("http://localhost:8081/api/employees")
    .then((res) => res.json())
    .then((data) => {
      const mappedEmployees: Employee[] = data.map((emp: any) => ({
        id: emp.id ,
        employeeCode: emp.employeeCode,
        firstName: emp.firstName,
        lastName: emp.lastName,
        department: emp.department,
        designation: emp.designation,
        manager: emp.manager,
        email: emp.email,
        joiningDate: emp.joiningDate,
        employmentStatus: emp.employmentStatus || "ACTIVE",
        availability: "Online",
        image: `https://api.dicebear.com/7.x/initials/svg?seed=${emp.firstName}`,
        color: "purple",
        phone: emp.phone || "",
      }));

      setEmployees(mappedEmployees);
    })
    .catch((err) => console.error("Failed to fetch employees:", err));
}, []);
// Delete
const handleDelete = async (id: number) => {
  if (!confirm("Are you sure you want to delete this employee?")) return;

  try {
    const res = await fetch(
      `http://localhost:8081/api/employees/${id}`,
      { method: "DELETE" }
    );

    if (!res.ok) {
      const msg = await res.text();
      alert(msg || "Delete failed");
      return;
    }

    setEmployees(prev => prev.filter(emp => emp.id !== id));
  } catch (err) {
    console.error("Delete error:", err);
  }
};



 

  // Export CSV
const exportEmployees = () => {
  if (!employees || employees.length === 0) return;

  const headers = Object.keys(employees[0]).join(",");

  const rows = employees.map(emp =>
    Object.values(emp)
      .map(value => `"${value ?? ""}"`)
      .join(",")
  );

  const csvContent = [headers, ...rows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "employees.csv";
  link.click();

  URL.revokeObjectURL(url);
};


  // Status Badge component
  const StatusBadge = ({ text }: { text: string }) => {
    const styles: Record<string, string> = {
      Online: "bg-emerald-100 text-emerald-700 border-emerald-200",
      "In Meeting": "bg-amber-100 text-amber-700 border-amber-200",
      "Focus Time": "bg-purple-100 text-purple-700 border-purple-200",
      Offline: "bg-slate-100 text-slate-500 border-slate-200",
      "On Leave": "bg-red-100 text-red-700 border-red-200",
      "Until Monday": "bg-red-50 text-red-600 border-red-100"
    };
    const style = styles[text] || styles["Offline"];
    return (
      <span
        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style} flex items-center gap-1 w-fit`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full bg-current ${
            text === "Online" ? "animate-pulse" : ""
          }`}
        ></span>
        {text}
      </span>
    );
  };

const filteredEmployees = employees.filter((emp) => {
  const matchesSearch =
    `${emp.firstName} ${emp.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

  const matchesDepartment =
  selectedDept === "All" ||
  selectedDept === "People" ||
  emp.department === selectedDept;


  return matchesSearch && matchesDepartment;
});




  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Employee Directory
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Manage your workforce, view profiles, and connect across teams.
            <span className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
              {filteredEmployees.length} Total
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
           onClick={exportEmployees}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download size={18} /> Export
          </button>
          <button
            onClick={() =>
              (window.location.href = "/dashboard/employees/onboard")
            }
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg hover:scale-[1.02]"
          >
            <UserPlus size={18} /> Add Employee
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto flex-1">
          <div className="relative w-full max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
  type="text"
  placeholder="Search by name"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && filteredEmployees.length === 1) {
      setActiveProfile(filteredEmployees[0]);
    }
  }}
  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200"
/>



          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
           {['All', 'Design', 'Engineering', 'Product', 'Marketing', 'People'].map(dept => (
                            <button
                                key={dept}
                                onClick={() => setSelectedDept(dept)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${selectedDept === dept ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
                            >
                                {dept}
                            </button>
                        ))}



          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "grid"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "list"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            <List size={20} />
          </button>
        </div>
      </div>
     

      {/* Content */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEmployees.length === 0 && (
            <p className="col-span-full text-center text-slate-400 mt-4">
             
            </p>
          )}
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div
                className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-r ${
                  gradientColors[emp.color] || "from-slate-100 to-slate-50"
                }`}
              ></div>
              <div className="relative z-10 flex flex-col items-center text-center mt-4">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full p-1 bg-white shadow-lg overflow-hidden">
                    <img
                      src={emp.image}
                      alt= {emp.firstName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap">
                    <StatusBadge text={emp.employmentStatus} />

                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900">{emp.firstName + " "+emp.lastName}</h3>
               
               
              
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">
                   <div className="p-4 bg-slate-50 rounded-2xl text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase">Employee Code</p>
                  <p className="font-bold text-slate-900">{emp.employeeCode}</p>
                </div>
                  <div className="p-4 bg-slate-50 rounded-2xl text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase">JoinDate</p>
                  <p className="font-bold text-slate-900">{emp.joiningDate}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase">Department</p>
                  <p className="font-bold text-slate-900">{emp.department}</p>
                </div>
                 
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase">Email</p>
                  <p className="font-bold text-slate-900">{emp.email}</p>
                </div>
                
                <div className="p-4 bg-slate-50 rounded-2xl text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase">Contact Number</p>
                  <p className="font-bold text-slate-900">{emp.phone}</p>
                </div>
                <br />
                
                <div className="flex items-center gap-3 w-full border-t border-slate-100 pt-6">
                  <button
                    onClick={() => (window.location.href = `mailto:${emp.email}`)}
                    className="flex-1 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 font-bold text-sm transition-colors flex items-center justify-center gap-2"
                  > 
                    <Mail size={16} /> 
                  </button>
                  <button
                    onClick={() => setChatSession(emp)}
                    className="flex-1 py-2 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 font-bold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={16} /> 
                  </button>
                  <button
                    onClick={() => setActiveProfile(emp)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
                  > 
                    <User size={18} />
                  </button>
                  
                  <button
                  onClick={() => window.location.href = `/dashboard/employees/onboard?id=${emp.id}`}
                   className="flex-1 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-sm transition-colors flex items-center justify-center gap-2">
                   <Edit3 size={16} />
                   </button>
                   <button onClick={() => handleDelete(emp.id)}
                    className="flex-1 py-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 font-bold text-sm transition-colors flex items-center justify-center gap-2">
                    <Trash2 size={16} />
                    </button>


                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredEmployees.length === 0 && (
            <p className="text-center text-slate-400 mt-4">No employees found.</p>
          )}
          {filteredEmployees.length > 0 && (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wide">Name</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wide">Role</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wide">Department</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wide">Email</th>
                  
                  <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wide">Phone</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img src={emp.image} alt={emp.firstName + " "+emp.lastName}
                         className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900"> {emp.firstName} {emp.lastName}</p>
                        <p className="text-xs text-slate-400">{emp.joiningDate}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{emp.designation}</td>
                    <td className="px-6 py-4 text-slate-700">{emp.department}</td>
                    <td className="px-6 py-4 text-slate-700">{emp.email}</td>
                    <td className="px-6 py-4 text-slate-700">{emp.phone}</td>
                    
                    <td className="px-6 py-4">
                      <StatusBadge text={emp.employmentStatus} />

                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                    <a href={`mailto:${emp.email}`}><Mail size={16} /> </a>

 


                      <button
                        onClick={() => setChatSession(emp)}
                        className="p-2 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded-xl transition-colors"
                      >
                        <MessageSquare size={16} />
                      </button>
                      <button
                        onClick={() => setActiveProfile(emp)}
                        className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-xl transition-colors"
                      > 
                        <User size={16} />
                      </button>
                      <button
                  onClick={() => window.location.href = `/dashboard/employees/onboard?id=${emp.id}`}
                   className="flex-1 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-sm transition-colors flex items-center justify-center gap-2">
                   <Edit3 size={16} />
                   </button>
                   <button onClick={() => handleDelete(emp.id)}
                    className="flex-1 py-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 font-bold text-sm transition-colors flex items-center justify-center gap-2">
                    <Trash2 size={16} />
                    </button>
                       
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      

      {/* --- PROFILE MODAL --- */}
      {activeProfile && (
        <div className="fixed inset-0 bg-black/30 z-40 flex items-end justify-center">
          <div className="bg-white rounded-t-3xl w-full max-w-2xl p-6 relative">
            <button
              onClick={() => setActiveProfile(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900"
            >
              X
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full p-2 bg-white shadow-xl mb-4">
                <img
                  src={activeProfile.image}
                  alt={activeProfile.firstName +" "+activeProfile.lastName}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <h2 className="text-3xl font-black text-slate-900">
                {activeProfile.firstName +" "+activeProfile.lastName}
              </h2>
              <p className="text-lg font-medium text-slate-500 mb-6">
                {activeProfile.designation}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
                <div className="p-4 bg-slate-50 rounded-2xl text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase">
                    Department
                  </p>
                  <p className="font-bold text-slate-900">{activeProfile.department}</p>
                </div>
               
                <div className="p-4 bg-slate-50 rounded-2xl text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase">Manager</p>
                  <p className="font-bold text-slate-900">{activeProfile.manager}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase">Joined</p>
                  <p className="font-bold text-slate-900">{activeProfile.joiningDate}</p>
                </div>
               
                <div className="p-4 bg-slate-50 rounded-2xl text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase">Role</p>
                  <p className="font-bold text-slate-900">{activeProfile.designation}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase">Employee Code</p>
                  <p className="font-bold text-slate-900">{activeProfile.employeeCode}</p>
                </div>
                 <div className="p-4 bg-slate-50 rounded-2xl text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase">Email</p>
                  <p className="font-bold text-slate-900">{activeProfile.email}</p>
                </div>
                 <div className="p-4 bg-slate-50 rounded-2xl text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase">Contact Number</p>
                  <p className="font-bold text-slate-900">{activeProfile.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
        {activeEmployee && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="relative w-[420px] bg-white h-full p-6">

            <button
              onClick={() => setActiveEmployee(null)}
              className="absolute top-4 right-4 text-2xl font-bold"
            >
              ×
            </button>

            <h2 className="text-xl font-black">
              {activeEmployee.firstName} {activeEmployee.lastName}
            </h2>

            <p>{activeEmployee.department}</p>
          </div>
        </div>
      )}

      {/* --- CHAT WIDGET --- */}
      {chatSession && (
        <div className="fixed bottom-0 right-8 w-80 bg-white rounded-t-2xl shadow-2xl border border-slate-200 z-50 animate-in slide-in-from-bottom-10 duration-300">
          <div className="p-4 bg-slate-900 text-white rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={chatSession.image}
                  className="w-8 h-8 rounded-full border border-white/20"
                  alt=""
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-900"></div>
              </div>
              <div>
                <h4 className="font-bold text-sm">{chatSession.firstName + " "+chatSession.lastName}</h4>
                <p className="text-xs text-slate-400">Active now</p>
              </div>
            </div>
            <button
              onClick={() => setChatSession(null)}
              className="text-slate-400 hover:text-white"
            >
              <MoreHorizontal className="rotate-45" />
            </button>
          </div>

          <div className="h-64 p-4 bg-slate-50 overflow-y-auto flex flex-col gap-3">
            <div className="self-center text-xs text-slate-400 font-bold uppercase my-2">
              Today
            </div>
            <div className="self-start max-w-[80%] bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 text-sm text-slate-700">
              Hi {chatSession.firstName.split(" ")[0]}, do you have a minute to chat?
            </div>
            {/* Sending messages */}
            <div  > {messages.map((msg, index) => (<div key={index}
    className="self-end max-w-[80%] bg-blue-600 p-3 rounded-2xl rounded-br-sm shadow-md text-sm text-white"
  >
    {msg}
  </div>
))}

            </div>
          </div>

          <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input type="text"  placeholder="Type a message..." value={message}onChange={(e) => setMessage(e.target.value)}onKeyDown={(e) => {
               if (e.key === "Enter") {
              if (!message.trim()) return;
              setMessages([...messages, message]);
              setMessage("");
                          }
                         }}className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"/>

            <button
              onClick={() => {
              if (!message.trim()) return;
              setMessages([...messages, message]);
              setMessage("");
                       }}className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                <MessageSquare size={16} />
             </button>
          </div>
        </div>
        
      )}
     



    </div>
    
  );
}
