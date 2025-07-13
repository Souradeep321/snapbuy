import home1 from "../../assets/home/homeImg1.webp";
import home2 from "../../assets/home/homeImg2.webp";
import men2 from "../../assets/men/men2.webp";
import uni1 from "../../assets/women/women1.webp";
import HeroBanner from "../../components/homepage/HeroBanner";
import CategorySection from "../../components/homepage/CategorySection";
import TrendingProducts from "../../components/homepage/TrendingProducts";
import FinalHeroSection from "../../components/homepage/FinalHeroSection";



const categories = [
  { label: "Men", image: men2, link: "/mens" },
  { label: "Women", image: home2, link: "/womens" },
  { label: "Collection", image: uni1, link: "/collection" },
];

const slides = [
  {
    image: home1,
    heading: "Timeless Fashion",
    subheading: "Conscious Choices.",
    description:
      "Sustainably designed, effortlessly worn. Our pieces are made with premium materials and wearable style that stands the test of time.",
  },
  {
    image: home2,
    heading: "Effortless Elegance",
    subheading: "",
    description:
      "Crafted with care for the confident soul. Embrace modern silhouettes that elevate your everyday style.",
  },
  {
    image: uni1, // <-- Your new image path
    heading: "Redefine Your Style",
    subheading: "With Confidence.",
    description:
      "Bold designs for bold women. Discover clothing that speaks your style and elevates your presence.",
  },
];

const HomePage = () => {

  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center gap-6  max-w-7xl mx-auto h-full">
      <HeroBanner slides={slides} className={"h-[85vh]"} />

      {/* Categories */}
      <CategorySection categories={categories} />

      {/* Wear the Moment */}
      <section className="px-6 md:px-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Wear the Moment.</h2>
        <p className="italic text-gray-500 text-lg">Own the Look.</p>
      </section>
      {/* Trending Now */}
      <TrendingProducts />


      {/* Final Hero Section */}
      <FinalHeroSection img={home1} />

    </div>
  );
};

export default HomePage;
