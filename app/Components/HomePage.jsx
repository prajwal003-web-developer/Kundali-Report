"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import useKundaliStores from "../Stores/KundaliStores";
import { useRouter } from "next/navigation";


const indiaStates = [
  { name: "Andhra Pradesh", lat: 15.9129, lon: 79.74 },
  { name: "Arunachal Pradesh", lat: 28.218, lon: 94.7278 },
  { name: "Assam", lat: 26.2006, lon: 92.9376 },
  { name: "Bihar", lat: 25.0961, lon: 85.3131 },
  { name: "Chhattisgarh", lat: 21.2787, lon: 81.8661 },
  { name: "Goa", lat: 15.2993, lon: 74.124 },
  { name: "Gujarat", lat: 22.2587, lon: 71.1924 },
  { name: "Haryana", lat: 29.0588, lon: 76.0856 },
  { name: "Himachal Pradesh", lat: 31.1048, lon: 77.1734 },
  { name: "Jharkhand", lat: 23.6102, lon: 85.2799 },
  { name: "Karnataka", lat: 15.3173, lon: 75.7139 },
  { name: "Kerala", lat: 10.8505, lon: 76.2711 },
  { name: "Madhya Pradesh", lat: 22.9734, lon: 78.6569 },
  { name: "Maharashtra", lat: 19.7515, lon: 75.7139 },
  { name: "Manipur", lat: 24.6637, lon: 93.9063 },
  { name: "Meghalaya", lat: 25.467, lon: 91.3662 },
  { name: "Mizoram", lat: 23.1645, lon: 92.9376 },
  { name: "Nagaland", lat: 26.1584, lon: 94.5624 },
  { name: "Odisha", lat: 20.9517, lon: 85.0985 },
  { name: "Punjab", lat: 31.1471, lon: 75.3412 },
  { name: "Rajasthan", lat: 27.0238, lon: 74.2179 },
  { name: "Sikkim", lat: 27.533, lon: 88.5122 },
  { name: "Tamil Nadu", lat: 11.1271, lon: 78.6569 },
  { name: "Telangana", lat: 18.1124, lon: 79.0193 },
  { name: "Tripura", lat: 23.9408, lon: 91.9882 },
  { name: "Uttar Pradesh", lat: 26.8467, lon: 80.9462 },
  { name: "Uttarakhand", lat: 30.0668, lon: 79.0193 },
  { name: "West Bengal", lat: 22.9868, lon: 87.855 },

  // Union Territories
  { name: "Andaman and Nicobar Islands", lat: 11.7401, lon: 92.6586 },
  { name: "Chandigarh", lat: 30.7333, lon: 76.7794 },
  {
    name: "Dadra and Nagar Haveli and Daman and Diu",
    lat: 20.1809,
    lon: 73.0169,
  },
  { name: "Delhi", lat: 28.7041, lon: 77.1025 },
  { name: "Jammu and Kashmir", lat: 33.7782, lon: 76.5762 },
  { name: "Ladakh", lat: 34.1526, lon: 77.577 },
  { name: "Lakshadweep", lat: 10.5667, lon: 72.6417 },
  { name: "Puducherry", lat: 11.9416, lon: 79.8083 },
];

const nepalDistricts = [
  { name: "Achham", lat: 29.0396, lon: 81.2519 },
  { name: "Arghakhanchi", lat: 27.9942, lon: 83.187 },
  { name: "Baglung", lat: 28.2719, lon: 83.589 },
  { name: "Baitadi", lat: 29.5333, lon: 80.55 },
  { name: "Bajhang", lat: 29.791, lon: 81.2526 },
  { name: "Bajura", lat: 29.42, lon: 81.475 },
  { name: "Banke", lat: 28.05, lon: 81.6167 },
  { name: "Bara", lat: 27.1, lon: 85.05 },
  { name: "Bardiya", lat: 28.3, lon: 81.3667 },
  { name: "Bhaktapur", lat: 27.671, lon: 85.4298 },
  { name: "Bhojpur", lat: 27.1667, lon: 87.05 },
  { name: "Chitwan", lat: 27.5291, lon: 84.3542 },
  { name: "Dadeldhura", lat: 29.3, lon: 80.5833 },
  { name: "Dailekh", lat: 28.8333, lon: 81.7333 },
  { name: "Dang", lat: 28.0, lon: 82.4833 },
  { name: "Darchula", lat: 29.85, lon: 80.55 },
  { name: "Dhading", lat: 27.8667, lon: 84.9167 },
  { name: "Dhankuta", lat: 26.9833, lon: 87.3333 },
  { name: "Dhanusha", lat: 26.8333, lon: 86.0 },
  { name: "Dolakha", lat: 27.6667, lon: 86.0833 },
  { name: "Dolpa", lat: 29.0, lon: 83.0 },
  { name: "Doti", lat: 29.2667, lon: 80.9333 },
  { name: "Gorkha", lat: 28.0, lon: 84.6333 },
  { name: "Gulmi", lat: 28.0833, lon: 83.25 },
  { name: "Humla", lat: 29.9667, lon: 81.8333 },
  { name: "Ilam", lat: 26.9167, lon: 87.9333 },
  { name: "Jajarkot", lat: 28.7, lon: 82.2 },
  { name: "Jhapa", lat: 26.5833, lon: 87.9 },
  { name: "Jumla", lat: 29.2667, lon: 82.1833 },
  { name: "Kailali", lat: 28.7, lon: 80.8 },
  { name: "Kalikot", lat: 29.1, lon: 81.7 },
  { name: "Kanchanpur", lat: 28.8333, lon: 80.3333 },
  { name: "Kapilvastu", lat: 27.5333, lon: 83.05 },
  { name: "Kaski", lat: 28.2639, lon: 83.9721 },
  { name: "Kathmandu", lat: 27.7172, lon: 85.324 },
  { name: "Kavrepalanchok", lat: 27.6167, lon: 85.55 },
  { name: "Khotang", lat: 27.2, lon: 86.7833 },
  { name: "Lalitpur", lat: 27.6644, lon: 85.3188 },
  { name: "Lamjung", lat: 28.2167, lon: 84.3667 },
  { name: "Mahottari", lat: 26.6667, lon: 85.8333 },
  { name: "Makwanpur", lat: 27.4333, lon: 85.0333 },
  { name: "Manang", lat: 28.6667, lon: 84.0167 },
  { name: "Morang", lat: 26.6667, lon: 87.5 },
  { name: "Mugu", lat: 29.6, lon: 82.1 },
  { name: "Mustang", lat: 28.9985, lon: 83.8473 },
  { name: "Myagdi", lat: 28.3333, lon: 83.5667 },
  { name: "Nawalpur", lat: 27.65, lon: 84.1 },
  { name: "Nuwakot", lat: 27.9167, lon: 85.15 },
  { name: "Okhaldhunga", lat: 27.3167, lon: 86.5 },
  { name: "Palpa", lat: 27.8667, lon: 83.55 },
  { name: "Panchthar", lat: 27.1, lon: 87.8167 },
  { name: "Parasi", lat: 27.5167, lon: 83.75 },
  { name: "Parbat", lat: 28.2333, lon: 83.7 },
  { name: "Parsa", lat: 27.0, lon: 84.8667 },
  { name: "Pyuthan", lat: 28.1, lon: 82.8667 },
  { name: "Ramechhap", lat: 27.3333, lon: 86.0833 },
  { name: "Rasuwa", lat: 28.1667, lon: 85.3333 },
  { name: "Rautahat", lat: 26.9833, lon: 85.2667 },
  { name: "Rolpa", lat: 28.4, lon: 82.5 },
  { name: "Rukum East", lat: 28.6, lon: 82.6 },
  { name: "Rukum West", lat: 28.6, lon: 82.4 },
  { name: "Rupandehi", lat: 27.5, lon: 83.45 },
  { name: "Salyan", lat: 28.3833, lon: 82.1833 },
  { name: "Sankhuwasabha", lat: 27.5833, lon: 87.1667 },
  { name: "Saptari", lat: 26.6, lon: 86.75 },
  { name: "Sarlahi", lat: 27.0, lon: 85.5667 },
  { name: "Sindhuli", lat: 27.25, lon: 85.9667 },
  { name: "Sindhupalchok", lat: 27.9167, lon: 85.6833 },
  { name: "Siraha", lat: 26.65, lon: 86.2 },
  { name: "Solukhumbu", lat: 27.6667, lon: 86.75 },
  { name: "Sunsari", lat: 26.6, lon: 87.1667 },
  { name: "Surkhet", lat: 28.6, lon: 81.6333 },
  { name: "Syangja", lat: 28.0833, lon: 83.8667 },
  { name: "Tanahun", lat: 27.9333, lon: 84.25 },
  { name: "Taplejung", lat: 27.35, lon: 87.6667 },
  { name: "Terhathum", lat: 27.1333, lon: 87.55 },
  { name: "Udayapur", lat: 26.85, lon: 86.7 },
];

const HomePage = () => {
  const [form, setForm] = useState({
    name: "",
    gender: "Male",
    dob: "",
    dobType: "AD",
    time: "",
    ampm: "AM",
    country: "",
    region: "",
    lat: "",
    lon: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegionChange = (e) => {
    const value = e.target.value;
    let selected;

    if (form.country === "India") {
      selected = indiaStates.find((s) => s.name === value);
    } else {
      selected = nepalDistricts.find((d) => d.name === value);
    }

    setForm({
      ...form,
      region: value,
      lat: selected?.lat || "",
      lon: selected?.lon || "",
    });
  };


  const navigate = useRouter()

  const {AddKundaliDatas , KundaliDatas} = useKundaliStores()
  const handleSubmit = async (e) => {
    e.preventDefault();
    const length = KundaliDatas.length
    AddKundaliDatas(form)

    let dataString = localStorage.getItem('Kundalis')

    let data = dataString? JSON.parse(dataString):[] 

    data = [...data,form]

    setForm({
    name: "",
    gender: "Male",
    dob: "",
    dobType: "AD",
    time: "",
    ampm: "AM",
    country: "",
    region: "",
    lat: "",
    lon: "",
  })

    localStorage.setItem("Kundalis",JSON.stringify(data))

   

    navigate.push(`/display/${length+1}`)

    
  };

  const regions = form.country === "India" ? indiaStates : nepalDistricts;

  return (
    <div className="min-h-[85dvh] bg-gray-50 flex justify-center items-start p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white border border-gray-200 rounded-2xl p-7 flex flex-col gap-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-gray-900">
          Create New Kundali
        </h2>

        {/* Name */}
        <input
          required
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full h-11 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 text-sm"
        />

        {/* Gender */}
        <div className="flex gap-2">
          {["Male", "Female", "Other"].map((g) => (
            <button
              type="button"
              key={g}
              onClick={() => setForm({ ...form, gender: g })}
              className={`flex-1 h-10 rounded-lg text-sm font-medium transition border
            ${
              form.gender === g
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
            }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* DOB */}
        <div className="flex gap-2">
          <input
            type="text"
            name="dob"
            placeholder="YYYY-MM-DD"
            value={form.dob}
            onChange={handleChange}
            required
            className="flex-1 h-11 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 text-sm"
          />

          <select
            name="dobType"
            value={form.dobType}
            onChange={handleChange}
            required
            className="h-11 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          >
            <option value="AD">AD</option>
            <option value="BS">BS</option>
          </select>
        </div>

        {/* Time */}
        <div className="flex gap-2">
          <input
            type="text"
            name="time"
            placeholder="HH-MM"
            value={form.time}
            onChange={handleChange}
            required
            className="flex-1 h-11 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 text-sm"
          />

          <select
            name="ampm"
            value={form.ampm}
            onChange={handleChange}
            required
            className="h-11 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          >
            <option>AM</option>
            <option>PM</option>
          </select>
        </div>

        {/* Country */}
        <select
          name="country"
          value={form.country}
          onChange={handleChange}
          required
          className="h-11 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
        >
          <option value="">Select Country</option>
          <option value="India">India</option>
          <option value="Nepal">Nepal</option>
        </select>

        {/* Region */}
        {form.country && (
          <select
            required
            value={form.region}
            onChange={handleRegionChange}
            className="h-11 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          >
            <option value="">
              {form.country === "India" ? "Select State" : "Select District"}
            </option>

            {regions.map((r) => (
              <option key={r.name} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        )}

        {/* Lat Long */}
        <div className="flex gap-2">
          <input
            required
            type="text"
            value={form.lat}
            placeholder="Latitude"
            readOnly
            className="flex-1 h-11 px-3 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-500"
          />
          <input
            type="text"
            value={form.lon}
            placeholder="Longitude"
            readOnly
            className="flex-1 h-11 px-3 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`h-11 rounded-lg text-sm font-medium transition
        ${
          loading
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-gray-900 text-white hover:bg-black"
        }`}
        >
          {loading ? "Generating..." : "Generate Kundali"}
        </button>
      </form>
    </div>
  );
};

export default HomePage;
