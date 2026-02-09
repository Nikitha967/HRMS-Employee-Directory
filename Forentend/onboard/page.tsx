"use client";
import { useSearchParams } from "next/navigation";

import React, { useState,useEffect } from 'react';
import {
    User,
    Briefcase,
    CreditCard,
    Users,
    FileText,
    ChevronRight,
    ChevronLeft,
    UploadCloud,
    CheckCircle2,
    Save,
    Camera
} from 'lucide-react';

type FormDataType = {
  firstName: string;
  lastName: string;
  email: string;
  empId: string;
  department: string;
  designation: string;
  manager: string;
  joiningDate: string;
   phone: string,
};

const API_URL = "http://localhost:8081/api/employees";

export default function OnboardingWizard() {
    const [currentStep, setCurrentStep] = useState(1);
const [apiError, setApiError] = useState("");

   const [formData, setFormData] = useState<FormDataType>({
  firstName: "",
  lastName: "",
  email: "",
  empId: "EMP-" + Math.floor(Math.random() * 10000),
  department: "",
  designation: "",
  manager: "",
  joiningDate: "",
   phone: "",
   
});

const searchParams = useSearchParams();
const editId = searchParams.get("id"); // DB id
const isEditMode =Boolean(editId);

useEffect(() => {
  if (!editId) return;

  fetch(`http://localhost:8081/api/employees/${editId}`)
    .then((res) => res.json())
    .then((emp) => {
      setFormData({
        firstName: emp.firstName || "",
        lastName: emp.lastName || "",
        email: emp.email || "",
        empId: emp.employeeCode || "",
        department: emp.department || "",
        designation: emp.designation || "",
        manager: emp.manager || "",
        joiningDate: emp.joiningDate || "",
        phone: emp.phone || "",
      });
    })
    .catch((err) => console.error(err));
}, [editId]);

const [errors, setErrors] = useState<{
  email?: string;
  phone?: string;
}>({});
const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;

  if (name === "email") {
  setApiError("");
}
setFormData(prev => ({
    ...prev,
    [name]: value
  }));

  setErrors(prev => ({
    ...prev,
    [name]: undefined
  }));
};
const validateForm = () => {
  const newErrors: { email?: string; phone?: string } = {};

  // Email validation
  if (!formData.email) {
    newErrors.email = "Email is required";
  } else if (!formData.email.endsWith("@whitewhalesoft.in")) {
    newErrors.email = "Email must end with @whitewhalesoft.in";
  }

  // Phone validation
  if (!formData.phone) {
    newErrors.phone = "Phone number is required";
  } else if (!/^\d{10}$/.test(formData.phone)) {
    newErrors.phone = "Phone number must be 10 digits";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
    const STEPS = [
        { id: 1, title: 'Personal Details', icon: User, desc: 'Basic info & contact' },
        { id: 2, title: 'Professional', icon: Briefcase, desc: 'Role, Dept & Manager' },
        { id: 3, title: 'Financial & Salary', icon: CreditCard, desc: 'CTC, Bank & Tax' },
        { id: 4, title: 'Family & Nominee', icon: Users, desc: 'Dependents info' },
        { id: 5, title: 'Documents', icon: FileText, desc: 'Upload IDs & Docs' },
    ];

   const handleNext = () => {
  // run validation step 1
  if (currentStep === 1) {
    if (!validateForm()) {
      return; // stop  if error
    }
  }

  setCurrentStep(prev => Math.min(prev + 1, 5));
};
 const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Header / Progress Bar */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => window.location.href = '/dashboard/employees/directory'}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <ChevronLeft size={24} className="text-slate-500" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Onboard New Employee</h1>
                                <p className="text-slate-500 text-sm font-medium">Create a master record in the system database.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => window.location.href = '/dashboard/employees/directory'}
                                className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => alert('Draft Saved Successfully!')}
                                className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-900/10"
                            >
                                Save Draft
                            </button>
                        </div>
                    </div>

                    {/* Steps Indicator */}
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 rounded-full"></div>
                        <div className="absolute top-1/2 left-0 h-1 bg-blue-600 -z-10 rounded-full transition-all duration-500" style={{ width: `${((currentStep - 1) / 4) * 100}%` }}></div>

                        {STEPS.map((step) => {
                            const isActive = currentStep >= step.id;
                            const isCurrent = currentStep === step.id;
                            return (
                                <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2 cursor-pointer" onClick={() => setCurrentStep(step.id)}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white border-slate-200 text-slate-300'}`}>
                                        <step.icon size={18} />
                                    </div>
                                    <div className={`text-xs font-bold uppercase tracking-wider transition-colors ${isCurrent ? 'text-blue-600' : 'text-slate-400'}`}>
                                        {step.title}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <div className="max-w-3xl mx-auto mt-12 px-6">

                {/* STEP 1: PERSONAL */}
                {currentStep === 1 && (
                    <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                <User className="text-blue-500" /> Personal Details
                            </h2>

                            {/* Profile Image Upload */}
                            <div className="flex items-center gap-6 mb-8 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 relative overflow-hidden group cursor-pointer hover:bg-slate-300 transition-colors">
                                    <Camera size={24} />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">
                                        Upload
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Profile Photo</h4>
                                    <p className="text-sm text-slate-500 mb-3">Accepts .jpg, .png. Max 2MB.</p>
                                    <label className="cursor-pointer px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-colors">
                                        Choose File
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && alert(`Photo "${e.target.files[0].name}" selected!`)} />
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">First Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. Alexandra"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Last Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. Morgan"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address <span className="text-red-500">*</span></label>
                                    
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"placeholder="alex@whitewhalesoft.in"
                                  />{apiError && (<p className="mt-1 text-sm text-red-600 font-medium">{apiError}</p>)}
                                  {errors.email && (<p className="mt-1 text-sm text-red-600"> {errors.email}</p>)}

                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Phone Number</label>
                                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" placeholder="+1 (555) 000-0000" name="phone"value={formData.phone}onChange={handleChange} />
                                {errors.phone && (<p className="mt-1 text-sm text-red-600">{errors.phone}</p>)}

                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Date of Birth</label>
                                    <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Gender</label>
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500">
                                        <option>Select...</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Non-binary</option>
                                        <option>Prefer not to say</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Current Address</label>
                                    <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Full street address..." />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: PROFESSIONAL */}
                {currentStep === 2 && (
                    <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                <Briefcase className="text-purple-500" /> Role & Designation
                            </h2>

                           <div className="grid grid-cols-2 gap-6">

  {/* Date of Joining */}
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
      Date of Joining
    </label>
    <input
      type="date"
      name="joiningDate"
      value={formData.joiningDate}
      onChange={handleChange}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
    />
  </div>

  {/* Department */}
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
      Department
    </label>
    <select
      name="department"
      value={formData.department}
      onChange={handleChange}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
    >
      <option value="">Select</option>
      <option value="Engineering">Engineering</option>
      <option value="Product">Product</option>
      <option value="Marketing">Marketing</option>
      <option value="HR">HR / People</option>
    </select>
  </div>

  {/* Designation */}
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
      Designation
    </label>
    <input
      type="text"
      name="designation"
      value={formData.designation}
      onChange={handleChange}
      placeholder="Senior Developer"
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
    />
  </div>

  {/* Reporting Manager */}
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
      Reporting Manager
    </label>
    <input
      type="text"
      name="manager"
      value={formData.manager}
      onChange={handleChange}
      placeholder="Manager Name"
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
    />
  </div>

</div>

                        </div>
                    </div>
                )}

                {/* STEP 3: FINANCIAL */}
                {currentStep === 3 && (
                    <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                <CreditCard className="text-emerald-500" /> Salary Structure (CTC)
                            </h2>

                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mb-6 flex items-start gap-4">
                                <div className="p-2 bg-white rounded-lg shadow-sm border border-emerald-100 text-emerald-600">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Auto-Calculation Active</h4>
                                    <p className="text-sm text-slate-600">Enter the Annual CTC. The system will automatically split Basic (40%), HRA (20%), and Special Allowances.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Annual CTC (Cost to Company)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                                        <input type="number" className="w-full pl-10 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-black text-slate-900 text-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="12,00,000" />
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 col-span-2 my-2"></div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Bank Name</label>
                                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. HDFC Bank" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">IFSC Code</label>
                                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" placeholder="HDFC0001234" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Account Number</label>
                                    <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" placeholder="XXXX-XXXX-XXXX" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 4: FAMILY */}
                {currentStep === 4 && (
                    <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                <Users className="text-pink-500" /> Family & Nominee
                            </h2>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nominee Name (For PF/Insurance)</label>
                                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Relationship</label>
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500">
                                        <option>Spouse</option>
                                        <option>Parent</option>
                                        <option>Child</option>
                                        <option>Sibling</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nominee Contact</label>
                                    <input type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 5: DOCUMENTS */}
                {currentStep === 5 && (
                    <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                <FileText className="text-orange-500" /> Document Repository
                            </h2>

                            <div className="space-y-4">
                                {[
                                    { label: 'Aadhar Card', desc: 'Front & Back Scan', required: true },
                                    { label: 'PAN Card', desc: 'Required for Tax', required: true },
                                    { label: 'Offer Letter', desc: 'Signed Copy', required: false },
                                    { label: 'Bank Cheque', desc: 'Cancelled Cheque', required: true },
                                ].map((doc, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 hover:bg-blue-50/30 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                                                <UploadCloud className="text-slate-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                                    {doc.label}
                                                    {doc.required && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full">REQUIRED</span>}
                                                </h4>
                                                <p className="text-xs text-slate-500">{doc.desc}</p>
                                            </div>
                                        </div>
                                        <label className="cursor-pointer px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors">
                                            Browse
                                            <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && alert(`File "${e.target.files[0].name}" selected for ${doc.label}`)} />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 mb-20">
                    <button
                        onClick={handlePrev}
                        disabled={currentStep === 1}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-white border border-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                    >
                        <ChevronLeft size={18} /> Previous
                    </button>

                    {currentStep < 5 ? (
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-blue-600 transition-colors shadow-xl hover:shadow-2xl hover:-translate-y-1"
                        >
                            Next Step <ChevronRight size={18} />
                        </button>
                        
                    ) : ( <button
                            type="button" // prevent default form submission
                            className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                             onClick={async () => {
                             // Clear any previous API error
                            setApiError("");
                            // Frontend validation (email & phone)
                            if (!validateForm()) {
                                setCurrentStep(1);
                                return;}
                                // Prepare payload
                                const payload = {
                                    firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      employeeCode: formData.empId,
      department: formData.department,
      designation: formData.designation,
      manager: formData.manager,
      joiningDate: formData.joiningDate,
      userId: 1,
      employmentStatus: "ACTIVE",
      phone:formData.phone, 
    };

    try {
      const res = await fetch(
  isEditMode
    ? `${API_URL}/${editId}`
    : API_URL,
  {
    method: isEditMode ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }
);


      if (!res.ok) {
        // Show exact backend message if any
        const errorMsg = await res.text();
        setApiError(errorMsg || "Failed to add employee.");
        return;
      }

      // Success
    alert(isEditMode ? "Employee updated successfully!" : "Employee added successfully!");

      window.location.href = "/dashboard/employees/directory";
    } catch (error) {
      // Only log in console, no generic alert
      console.error("Submit Error:", error);
    }
  }}
>
  <Save size={18} /> Submit
</button>


                        
                     

                    )}
                </div>

            </div>
        </div>
    );
}
