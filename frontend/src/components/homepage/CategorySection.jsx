import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const CategorySection = ({ categories }) => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.25});

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);


  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        
      }}
      className="px-6 md:px-20"
      >
      <h2 className="text-2xl font-semibold text-center mb-8">Find Your Look</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((item, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-xl group will-change-transform"
            onClick={() => navigate(item.link)}
          >
            {/* Wrap image in motion div or add GPU smoothing */}
            <div className="transition-transform duration-500 ease-in-out group-hover:scale-105 transform-gpu">
              <img
                src={item.image}
                alt={item.label}
                className="w-full h-80 object-cover"
              />
            </div>

            <div className="absolute inset-0 bg-black/40 flex items-end justify-center pb-4">
              <Button
                variant="secondary"
                className="bg-white text-black hover:bg-gray-100"
                onClick={() => navigate(item.link)}
              >
                {item.label}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  )
}

export default CategorySection