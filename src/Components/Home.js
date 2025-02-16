import React from 'react'
import { useRef,useState, useEffect } from 'react';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import {  ChevronLeft, ChevronRight } from 'lucide-react';
import logo from '../assets/logo.png';
import img1 from '../assets/img1.jpeg';  
import img2 from '../assets/img2.jpeg';
import img3 from '../assets/img3.jpeg';
import ContactForm from './ContactForm';

function Home() {
    const aboutRef = useRef(null);
    const contactRef = useRef(null);
    const homeRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const carouselImages = [img1, img2, img3];

    const scrollToSection = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, []);

  return (
        
    <div className="min-h-screen bg-gray-50">
 
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-sm z-50">
        
        <div className="max-w-7xl mx-auto px-4">
           <div className="flex justify-between items-center h-16">
             <div className="flex items-center">
               <img 
                 src={logo}
                 alt="OrganicLife Logo" 
                 className="h-20 w-auto"
               />
             </div>

              <div className="flex items-center space-x-8">
               <button
                 onClick={() => scrollToSection(homeRef)}
                 className="text-gray-700 hover:text-green-700"
               >
                 Home
               </button>
               <button
                 onClick={() => scrollToSection(aboutRef)}
                 className="text-gray-700 hover:text-green-700"
               >
                 About
               </button>
               <button
                 onClick={() => scrollToSection(contactRef)}
                 className="text-gray-700 hover:text-green-700"
               >
                 Contact
               </button>
               <a
                 href="/login"
                 className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
               >
                 Join Now
               </a>
             </div>
           </div>
         </div>
    </nav>

    <div className="pt-16">
        <section 
            ref={homeRef} 
            className="relative min-h-[600px] overflow-hidden"
        >
            {carouselImages.map((image, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                                currentSlide === index ? 'opacity-100' : 'opacity-0'
                            }`}
                            style={{
                                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2)), url(${image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                />
            ))}

            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent" />

            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors z-10"
            >
                <ChevronLeft size={24} className="text-gray-800" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors z-10"
            >
                <ChevronRight size={24} className="text-gray-800" />
            </button>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {carouselImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                            currentSlide === index ? 'bg-green-600' : 'bg-white/60'
                        }`}
                    />
                ))}
            </div>

            <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
                <div className="w-full md:w-1/2 space-y-6 py-20">
                    <div className="mb-8">
                        <img 
                            src={logo}
                            alt="OrganicLife Logo" 
                            className="h-20 w-auto"
                        />
                    </div>
                    <h1 className="text-5xl font-bold text-green-900">
                        Fresh Organic Products for a Healthier You
                    </h1>
                    <p className="text-xl text-gray-600">
                        Welcome to Green Growth, an initiative by Peerumade Development Society. 
                        Join us in our journey to promote organic living, support local farmers, 
                        and foster sustainable development in our community.
                    </p>
                    <div className="flex space-x-4">
                        <a
                            href="/login"
                            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 inline-flex items-center space-x-2 transform hover:scale-105 transition duration-200"
                        >
                            <span>Start Shopping</span>
                            <ArrowRight size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <section ref={aboutRef} className="bg-white py-16">

              <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 text-center">About Us</h2>
                <div className="prose lg:prose-lg mx-auto">
                  <p className="text-lg text-gray-600 mb-6">
                  Peerumade Development Society was founded with a simple mission: to promote organic farming, 
                  support local farmers, and foster sustainable development in our community.
                  </p>
                  <p className="text-lg text-gray-600 mb-8">
                  Since our establishment, we've dedicated ourselves to improving the livelihood of farmers 
                  while providing consumers with access to healthy, organic produce through our Green Growth initiative.
                  </p>
                  <h3 className="text-xl font-semibold mb-4">Our Values</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Customer satisfaction is our top priority",
                      "Quality products at competitive prices",
                      "Fast and reliable delivery",
                      "Transparent business practices"
                    ].map((value, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <p className="text-gray-600">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
        </section>

        <section ref={contactRef} className="bg-gray-50 py-16">

              <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-3xl font-bold mb-12 text-center">Contact Us</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Phone className="text-blue-600" size={24} />
                      <div>
                        <h3 className="font-semibold">Phone</h3>
                        <p>+91 9087654321</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Mail className="text-blue-600" size={24} />
                      <div>
                        <h3 className="font-semibold">Email</h3>
                        <p>support@pds.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <MapPin className="text-blue-600" size={24} />
                      <div>
                        <h3 className="font-semibold">Address</h3>
                        <p>Peerumade, Idukki, Kerala</p>
                      </div>
                    </div>
                  </div>
                  {/* <form className="space-y-4 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Send us a message</h3>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full p-2 border rounded-lg"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full p-2 border rounded-lg"
                    />
                    <textarea
                      placeholder="Your Message"
                      rows={4}
                      className="w-full p-2 border rounded-lg"
                    ></textarea>
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                      Send Message
                    </button>
                  </form> */}
                  <ContactForm />
                </div>
              </div>          
        </section>
    </div>
    <footer className="bg-gray-800 text-white py-6 mt-auto">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center">
      <p className="text-sm text-gray-300">
        &copy; {new Date().getFullYear()} Green Growth, Peerumade Development Society. All rights reserved.
      </p>
      <p className="text-xs text-gray-400 mt-1">
        The content on this site is protected by copyright law and may not be reproduced without permission.
      </p>
    </div>
  </div>
</footer>

</div>
  );

}

export default Home
