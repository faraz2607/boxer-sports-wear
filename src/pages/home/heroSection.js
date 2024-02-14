// HeroSection.js
import React from 'react';

const HeroSection = () => {
  return (
    <section className="text-dark-25 h-56 md:h-64 flex flex-col justify-center items-center" >
      <div className="container mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4">Welcome to Boxer Sports Wear</h1>
        <p className="text-md md:text-lg mb-4 md:mb-8">Explore the amazing catalogue and get best deal from us.</p>
        <a href='#catalogue'>
        <button className="bg-dark-15 text-green-5 py-2 px-6 rounded-full font-bold hover:bg-dark-35 transition duration-300">
          Go to Catalogue
        </button>
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
