import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';


const FinalHeroSection = ({ img }) => {
  const navigate = useNavigate();
  return (
    <section className="relative w-full h-[60vh] overflow-hidden px-6 md:px-20">
      <img
        src={img}
        alt="Hero Elegance"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="relative z-10 flex flex-col justify-center h-full text-white bg-gradient-to-r from-black/40 to-transparent p-6 md:p-12 max-w-2xl">
        <h2 className="text-4xl font-semibold">Effortless Elegance</h2>
        <p className="mt-3 text-base">
          Crafted with care for the confident soul. Embrace modern silhouettes that elevate your everyday style.
        </p>
        <Button
          onClick={() => navigate("/collection")}
          className="mt-6 px-6 py-3 text-base font-medium bg-white text-black hover:bg-gray-100 transition-all">
          Explore the Collections
        </Button>
      </div>
    </section>
  )
}

export default FinalHeroSection