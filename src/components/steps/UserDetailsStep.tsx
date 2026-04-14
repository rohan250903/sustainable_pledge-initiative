import { useState } from 'react';
import { UserDetails } from '../../types';
import { User, Mail, Hash, Building2, ArrowRight } from 'lucide-react';

interface UserDetailsStepProps {
  data: UserDetails;
  onNext: (data: UserDetails) => void;
}

export default function UserDetailsStep({ data, onNext }: UserDetailsStepProps) {
  const [form, setForm] = useState<UserDetails>(data);
  const [errors, setErrors] = useState<Partial<UserDetails>>({});

  const validate = () => {
    const newErrors: Partial<UserDetails> = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Enter a valid email address';
    if (!form.rollNo.trim()) newErrors.rollNo = 'Roll number is required';
    if (!form.institution.trim()) newErrors.institution = 'Institution name is required';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onNext(form);
  };

  const handleChange = (field: keyof UserDetails, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (

  
      <div className="max-w-xl mx-auto">

    {/* 🌿 Pledge Section */}
    <div className="text-center mb-10 px-4">
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        Take the Pledge!
      </h1>

      <p className="text-gray-600 text-sm leading-relaxed">
        At Meghnad Saha Institute of Technology (MSIT), sustainability is in our nature. 
  MSIT is committed to being a positive force for the future of our environment—both 
  on campus and beyond—through education, research and adequate resource management. 
  However, creating a truly sustainable future requires collective action from students, 
  faculty, staff and communities across the world.
      </p>

      <p className="text-gray-600 text-sm leading-relaxed mt-4">
         We invite you to make a personal commitment by pledging to take small, everyday steps 
  that can add up to a big impact, contributing to a greener and more sustainable planet.
      </p>
    </div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Your Details</h2>
        <p className="text-gray-500 mt-1 text-sm">Tell us a bit about yourself to personalize your certificate</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="Enter your full name"
              className={`w-full pl-10 pr-4 py-3 rounded-lg border text-sm transition-colors ${
                errors.name
                  ? 'border-red-400 bg-red-50 focus:ring-red-300'
                  : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
              } focus:outline-none focus:ring-2`}
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              placeholder="you@example.com"
              className={`w-full pl-10 pr-4 py-3 rounded-lg border text-sm transition-colors ${
                errors.email
                  ? 'border-red-400 bg-red-50 focus:ring-red-300'
                  : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
              } focus:outline-none focus:ring-2`}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Location <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
  📍
</span>
            <input
              type="text"
              value={form.rollNo}
              onChange={e => handleChange('rollNo', e.target.value)}
              placeholder=""
              className={`w-full pl-10 pr-4 py-3 rounded-lg border text-sm transition-colors ${
                errors.rollNo
                  ? 'border-red-400 bg-red-50 focus:ring-red-300'
                  : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
              } focus:outline-none focus:ring-2`}
            />
          </div>
          {errors.rollNo && <p className="text-red-500 text-xs mt-1">{errors.rollNo}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Organisation <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={form.institution}
              onChange={e => handleChange('institution', e.target.value)}
              placeholder=""
              className={`w-full pl-10 pr-4 py-3 rounded-lg border text-sm transition-colors ${
                errors.institution
                  ? 'border-red-400 bg-red-50 focus:ring-red-300'
                  : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
              } focus:outline-none focus:ring-2`}
            />
          </div>
          {errors.institution && <p className="text-red-500 text-xs mt-1">{errors.institution}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mt-2 shadow-md hover:shadow-lg"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
