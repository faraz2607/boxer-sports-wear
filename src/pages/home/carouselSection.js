// Carousel.js
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CarouselSection = () => {
  return (<div className='grid grid-cols-1 md:grid-cols-2 pb-4 md:pb-8 gap-4 md:gap-8'>
    <TextContainer className="flex-shrink-0 w-1/2 p-8"/>
    <Carousel />
    </div>
  )
};
export default CarouselSection;

const TextContainer = () => {
  return (
    <div class="bg-green-35 p-4 md:p-8 rounded-lg shadow-md order-last md:order-first">
    <h1 class="text-xl md:text-3xl font-bold mb-3 md:mb-6">Unleash Your Style, Embrace the Comfort!</h1>

    <p class="text-md md:text-lg mb-2 md:mb-4">
        <span class="font-bold">Ignite Your Potential in Every Stride: </span>
        Experience comfort and performance with Boxer Wear's meticulously crafted pants and lowers designed for optimal style and movement.
    </p>

    <p class="text-md md:text-lg mb-2 md:mb-4">
        <span class="font-bold">Precision Fit, Effortless Style: </span>
        Our pants and lowers offer a tailored fit that accentuates your natural contours, ensuring you move with confidence and style.
    </p>

    <p class="text-md md:text-lg ">
        <span class="font-bold">Versatile Designs for Every Occasion: </span>
        From workouts to casual outings, Boxer Wear's versatile collection of pants and lowers effortlessly combines fashion with functionality, catering to your diverse lifestyle.
    </p>
</div>

  );
};

const Carousel = () => {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1, // Display only one image at a time
    slidesToScroll: 1,
    autoplay: true, // Auto-play slides
    autoplaySpeed: 5000, // Set the speed for auto-play in milliseconds (adjust as needed)
  };

  return (
    <Slider {...settings}>
      {/* Carousel Item 1 */}
      <div>
        <div className="relative">
          <img src="/images/boxer-tag-slide-1.jpeg" alt="Slide 1" className="w-full h-60 md:h-96" /> 
          <div className="absolute top-0 left-0 p-4">
            {/* <h3 className="text-xl font-bold">Catchy Phrase 1</h3>
            <p>Additional description or details.</p> */}
          </div>
        </div>
      </div>

      {/* Carousel Item 2 */}
      <div>
        <div className="relative">
          <img src="/images/white-lower-slide-2.jpeg" alt="Slide 2" className="w-full h-60 md:h-96" /> 
          <div className="absolute top-0 left-0 text-white p-4">
            {/* <h3 className="text-xl font-bold">Catchy Phrase 2</h3>
            <p>Additional description or details.</p> */}
          </div>
        </div>
      </div>

      {/* Carousel Item 3 */}
      <div>
        <div className="relative">
          <img src="/images/black-lower-slide-3.jpeg" alt="Slide 3" className="w-full h-60 md:h-96" /> 
          <div className="absolute top-0 left-0 text-white p-4">
            {/* <h3 className="text-xl font-bold">Catchy Phrase 3</h3>
            <p>Additional description or details.</p> */}
          </div>
        </div>
      </div>

      {/* Add more items as needed */}
    </Slider>
  );
};
