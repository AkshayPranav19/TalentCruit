import React from 'react';
import { assets } from '../assets/assets';

const Navbar = () => {
  return (
    <div className="flex justify-between items-center px-4 sm:px-4 py-3 border-b border-gray-200 bg-white" relative transition-all>

      <div className="flex items-center gap-4">
        <img className="h-[60px]" src={assets.logo} alt="Logo" />
      </div>
      
      <div>
        <p className="text-right font-medium text-gray-700">Welcome TalentCruit Admin!</p>
      </div>
      
    </div>
  );
};

export default Navbar;
