import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from "lucide-react";



const HeroBanner = ({ slides,className }) => {
    const [index, setIndex] = useState(0);
    const navigate = useNavigate()

    const next = () => setIndex((prev) => (prev + 1) % slides.length);
    const prev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 2200);

        return () => clearInterval(interval); // Clear on unmount
    }, []);

    return (
        <section className={`relative w-full overflow-hidden ${className}`} >
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 w-full h-full"
                >
                    <img
                        src={slides[index].image}
                        alt="Slide"
                        className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10" />
                    <div className="relative z-20 flex flex-col items-start justify-center h-full px-6 md:px-20 text-white max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            {slides[index].heading}
                            {slides[index].subheading && (
                                <span className="italic font-light text-green-300">
                                    {" " + slides[index].subheading}
                                </span>
                            )}
                        </h1>
                        <p className="mt-4 text-lg">{slides[index].description}</p>
                        <Button
                            onClick={() => navigate("/collection")}
                            className="mt-6 px-6 py-3 text-base font-medium bg-white text-black hover:bg-gray-100 transition-all"
                        >
                            Explore the Collections
                        </Button>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Optional Manual Controls */}
            <div className="absolute z-30 inset-y-0 left-0 flex items-center">
                <button onClick={prev} className="p-3 bg-black/30 hover:bg-black/50 text-white">
                    <ChevronLeft size={24} />
                </button>
            </div>
            <div className="absolute z-30 inset-y-0 right-0 flex items-center">
                <button onClick={next} className="p-3 bg-black/30 hover:bg-black/50 text-white">
                    <ChevronRight size={24} />
                </button>
            </div>
        </section>
    )
}

export default HeroBanner