

// Header.js
import React from 'react';

const Header = () => {
  return (
    <header className="bg-green-25 p-4">
      <div className="container mx-auto text-center md:flex md:justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold md:text-start">Boxer Sports Wear</h1>
        </div>
        <nav>
          <ul className="flex justify-center space-x-4 mt-2 md:mt-0 font-bold">
            <li><a href="#" className="">Home</a></li>
            {/* <li><a href="#about" className="">About</a></li> */}
            <li><a href="#contact" className="">Contact us</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
