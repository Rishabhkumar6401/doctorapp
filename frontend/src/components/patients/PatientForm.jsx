import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import axios from 'axios';
import { Search } from 'lucide-react';
import "react-toastify/dist/ReactToastify.css";
import { fetchPatients, checkPatientByPhone, setIsNewEntry } from "../../store/patient";
import { useLocation } from 'react-router-dom';
import { fetchDoctors } from '../../store/doctor';
import { fetchCategories } from '../../store/categories';
import { addPatient } from '../../store/patient';
import {  fetchSubcategoryDetail } from '../../store/subcategories';
import { placeOrder } from '../../store/order';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronsUpDown } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const PatientForm = () => {
    const dispatch = useDispatch();
     const navigate = useNavigate();
    const { patients, phoneNo, isNewEntry } = useSelector((state) => state.patient);
    const { doctors} = useSelector((state) => state.doctors);
    const { categories} = useSelector((state) => state.categories);
    const { status, error } = useSelector((state) => state.order);
    const { subcategory, loading} = useSelector((state) => state.subcategory);
    const orderDetails = useSelector((state) => state.order.orderDetails);
    const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermC, setSearchTermC] = useState("");
 
    const [openC, setOpenC] = React.useState(false)
  const [valueC, setValueC] = React.useState("")
 
    const [openS, setOpenS] = React.useState(false)
  const [valueS, setValueS] = React.useState("")
  const [searchTermS, setSearchTermS] = useState("");
 
  
    const location = useLocation();
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [formData, setFormData] = useState({
    phoneNo: "",
    name: "",
    age: "",
    address: "",
    referredBy: "",
    category: "",
    subcategory: "",
    fees: "",
    discount: "",
    finalPayment: "",
    paymentMode:"",
    referralFee:""
  });
  const selectedPatient = location.state?.patient;
  const NewphoneNo= location.state?.phoneNo;
  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTermC.toLowerCase())
  );

  const filteredSubcategoriesNew = filteredSubcategories.filter((subcategory) =>
    subcategory.name.toLowerCase().includes(searchTermS.toLowerCase())
  );


  useEffect(() => {
    dispatch(fetchDoctors());
    dispatch(fetchCategories()); 
   
    
  }, []);
  useEffect(() => {
   
    console.log(isNewEntry )
   
    
  }, [NewphoneNo ]);
 
  
  useEffect(() => {
    if (status === 'success') {
      // dispatch(resetOrderState()); // Reset the order state after navigating
      navigate('/print-report', { state: { orderDetails: orderDetails } });
    }
  }, [status, navigate, dispatch]);

  useEffect(() => {
    const fetchSubcategoriesByCategory = async () => {
      if (!formData.category) {
        setFilteredSubcategories([]);
        return;
      }
  
      try {
        const response = await axios.get(
          `http://localhost:5000/api/subcategory?category=${formData.category}`
        );
        setFilteredSubcategories(response.data.subcategories); // Update with actual key from API response
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };
  
    fetchSubcategoriesByCategory();
  }, [valueC]);
  useEffect(() => {
   
  
    if (valueS) {
      dispatch(fetchSubcategoryDetail(valueS));
    }
  }, [valueS]);

  useEffect(() => {
    if (subcategory) {
      setFormData((prevState) => ({
        ...prevState,
        fees: subcategory.price || '',
        finalPayment: subcategory.price || '',
        referralFee:subcategory.referralFee || ''
      }));
    }
  }, [subcategory]);

  

  


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === "fees" || name === "discount") {
      const fees = name === "fees" ? parseFloat(value) || 0 : parseFloat(formData.fees) || 0;
      const discount = name === "discount" ? parseFloat(value) || 0 : parseFloat(formData.discount) || 0;
      const final = fees -  discount;
      setFormData((prev) => ({
        ...prev,
        finalPayment: final.toFixed(2)
      }));
    }

    if (name === "phoneNo" && value.length === 10) {
      dispatch(checkPatientByPhone(value)).then((action) => {
        if (action.payload.isNew === false) {
          dispatch(setIsNewEntry(false));  // If patient exists, set isNewEntry to false
        } else {
          dispatch(setIsNewEntry(true));   // If patient is new, set isNewEntry to true
        }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if required fields are filled
    if (!formData.phoneNo || !formData.name || !formData.age  || !formData.address || !formData.category || !formData.fees || !formData.finalPayment
     ) {
      console.log(formData.referredBy)
      toast.error("Please fill in all required fields");
      return;
    }
  
    // First, handle adding new patient if isNewEntry is true
    if (isNewEntry) {
      const patientData = {
        phoneNo: formData.phoneNo,
        name: formData.name,
        age: formData.age,
        address: formData.address,
      };
  
      // Dispatch action to add new patient
      await dispatch(addPatient(patientData));
  
      // After adding the patient, place the order
      dispatch(placeOrder(formData));
      
    } else {
      // If it's not a new entry, simply place the order
      dispatch(placeOrder(formData));
    }
  };
  
  useEffect(() => {
    console.log(selectedPatient)
    // Check if selectedPatient is available
    if (selectedPatient) {
      // If selectedPatient exists, fill the form with its data
      setFormData({
        phoneNo: selectedPatient.phoneNo || "",
        name: selectedPatient.name || "",
        age: selectedPatient.age || "",
        address: selectedPatient.address || "",
        referredBy: selectedPatient.referredBy || "",
        category: selectedPatient.category || "",
        subcategory: selectedPatient.subcategory || "",
        fees: selectedPatient.fees || "",
        discount: selectedPatient.discount || "",
        finalPayment: selectedPatient.finalPayment || "",
        
      });
    } else if (patients.length === 1) {
      // If no selectedPatient, but only one patient in the list, auto-fill the form with the first patient data
      const patient = patients[0]; // Get the first patient directly
      setFormData({
        phoneNo: patient.phoneNo || "",
        name: "",
        age: "",
        address: "",
        referredBy:  "",
        category: "",
        subcategory: "",
        fees: "",
        discount: "",
        finalPayment:  "",
        
        

      });
    } else if (patients.length === 0) {
      console.log("dsf")
      // If no patients, reset the form to blank
      setFormData({
        phoneNo: NewphoneNo || "",
        name: "",
        age: "",
        address: "",
        referredBy: "",
        category: "",
        subcategory: "",
        fees: "",
        discount: "",
        finalPayment: "",
        paymentMode:"",
        referralFee :""
      });
    }
    else if (!selectedPatient) {
      setFormData({
        phoneNo:  NewphoneNo || "",
        name: "",
        age: "",
        address: "",
        referredBy: "",
        category: "",
        subcategory: "",
        fees: "",
        discount: "",
        finalPayment: "",
        paymentMode:"",
        referralFee :""
      });
    }
  }, [patients, phoneNo, selectedPatient]); // Added selectedPatient as a dependency
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row mt-14"> {/* Reduced the top margin from mt-16 to mt-4 */}
     <div className="flex flex-col items-center md:w-1/2 p-8">
        <div className="h-full flex items-center justify-center md:mb-80">
          <div className="text-center text-black">
            <img src="./src/assets/p2.svg" alt="Patient" className="w-[25rem] h-[25rem] mb-4" />
            <h1 className="text-4xl font-bold mb-4">Welcome to Our Healthcare Center</h1>
            <p className="text-xl">Your health is our priority</p>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
      <div className="flex flex-col md:w-1/2 p-16 bg-white mx-4 md:mx-8 rounded-lg shadow-sm">
       
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Form fields for phone and name */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleInputChange}
                 pattern="^\d{10}$"
                placeholder="Enter Your Phone Number"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter Your Name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Form fields for age and address */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Age *
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Enter Your Age"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter Your Address"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                required
              />
            </div>
          </div>
          {/* Additional form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Form fields for referredBy and category */}
            <div>
      <label htmlFor="referredBy" className="block text-sm font-medium text-gray-700">
        Referred By
      </label>
      <Popover open={open} onOpenChange={setOpen} className="">
  <PopoverTrigger asChild>
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center"
    >
      <span className="text-left">
      {formData.referredBy === 0
          ? "None"
          : formData.referredBy
          ? doctors.find((doctor) => doctor._id === formData.referredBy)?.name
          : "Select Doctor..."}
      </span>
      <ChevronsUpDown className="opacity-50" />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-full p-0">
    <Command>
      <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500  w-5 h-5" />
        <input
          type="text"
          placeholder="Search doctor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-9 w-full px-10 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
        />
      </div>
      <CommandList>
      <CommandItem
          value="none" // Make sure the value for "None" is a specific string
          onSelect={() => {
            setValue(0); // Set to "none" instead of an empty string
            handleInputChange({
              target: { name: "referredBy", value: 0 }, // Clear the referredBy field
            });
            setOpen(false); // Close the popover
          }}
        >
          None
        </CommandItem>
        {filteredDoctors.length === 0 ? (
          <CommandEmpty>No doctor found.</CommandEmpty>
        ) : (
          <CommandGroup>
            {filteredDoctors.map((doctor) => (
              <CommandItem
                key={doctor._id}
                value={doctor._id}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue); // Toggle value
                  handleInputChange({
                    target: { name: "referredBy", value: currentValue },
                  }); // Update form data
                  setOpen(false);
                }}
              >
                {doctor.name}
                <Check
                  className={`ml-auto ${
                    value === doctor._id ? "opacity-100" : "opacity-0"
                  }`}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>

    </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <Popover open={openC} onOpenChange={setOpenC} className="">
  <PopoverTrigger asChild>
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={openC}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center"
    >
      <span className="text-left">
        {valueC ? valueC : "Select Category..."}
      </span>
      <ChevronsUpDown className="opacity-50" />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-full p-0">
    <Command>
      <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500  w-5 h-5" />
        <input
          type="text"
          placeholder=" Search category..."
          value={searchTermC}
          onChange={(e) => setSearchTermC(e.target.value)}
          className="h-9 w-full px-10 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
        />
      </div>
      <CommandList>
        {filteredCategories.length === 0 ? (
          <CommandEmpty>No category found.</CommandEmpty>
        ) : (
          <CommandGroup>
            {filteredCategories.map((category) => (
              <CommandItem
                key={category._id}
                value={category.name}  // Use category name as the value
                onSelect={(currentValue) => {
                  setValueC(currentValue === valueC ? "" : currentValue); // Toggle value
                  handleInputChange({
                    target: { name: "category", value: currentValue },
                  }); // Update form data
                  setOpenC(false);
                }}
              >
                {category.name}
                <Check
                  className={`ml-auto ${valueC === category.name ? "opacity-100" : "opacity-0"}`} // Compare with category name
                />
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>




      </div>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Form fields for subcategory and fees */}
            <div>
        <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
          Subcategory
        </label>
        <Popover open={openS} onOpenChange={setOpenS} className="">
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={openS}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center"
        >
          <span className="text-left">
            {formData.subcategory
              ? filteredSubcategories.find((subcategory) => subcategory._id === formData.subcategory)?.name
              : "Select Subcategory..."}
          </span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500  w-5 h-5" />
            <input
              type="text"
              placeholder=" Search subcategory..."
              value={searchTermS}
              onChange={(e) => setSearchTermS(e.target.value)}
              className="h-9 w-full px-10 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            />
          </div>
          <CommandList>
            {filteredSubcategoriesNew.length === 0 ? (
              <CommandEmpty>No subcategory found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredSubcategoriesNew.map((subcategory) => (
                  <CommandItem
                    key={subcategory._id}
                    value={subcategory._id}
                    onSelect={(currentValue) => {
                      setValueS(currentValue === valueS ? "" : currentValue); 
                      handleInputChange({
                        target: { name: "subcategory", value: currentValue },
                      });
                      setOpenS(false);
                    }}
                  >
                    {subcategory.name}
                    <Check
                      className={`ml-auto ${
                        valueS === subcategory._id ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
      </div>
            <div>
              <label htmlFor="fees" className="block text-sm font-medium text-gray-700">
                Fees
              </label>
              <input
                type="number"
                id="fees"
                name="fees"
                value={formData.fees}
                onChange={handleInputChange}
                placeholder="Enter Fees"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Form fields for discount and finalPayment */}
            <div>
              <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
                Discount
              </label>
              <input
                type="number"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                placeholder="Enter Discount"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
               
              />
            </div>
            
            <div>
              <label htmlFor="finalPayment" className="block text-sm font-medium text-gray-700">
                Final Payment
              </label>
              <input
                type="number"
                id="finalPayment"
                name="finalPayment"
                value={formData.finalPayment}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                required
              />
            </div>
            <div>
  <label htmlFor="finalPayment" className="block text-sm font-medium text-gray-700">
    Payment Mode
  </label>
  <select
    id="finalPayment"
    name="finalPayment"
    value={formData.paymentMode}
    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
    required
  >
    <option value="">Select Payment Mode</option>
    <option value="Online">Online</option>
    <option value="Cash">Cash</option>
  </select>
</div>

          </div>
         
  
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
  
     
    </div>
  );
  
};

export default PatientForm;
