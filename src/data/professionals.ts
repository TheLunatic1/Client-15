
import pro1Img from "../assets/section images/tradie-1.png";
import pro2Img from "../assets/section images/tradie-2.png";
import pro3Img from "../assets/section images/jamie-street-qWYvQMIJyfE-unsplash.jpg";
import pro4Img from "../assets/section images/tradie-3.png";
import pro5Img from "../assets/section images/david-clode-h7D3RSePhnc-unsplash.jpg";
import pro6Img from "../assets/section images/andriyko-podilnyk-VehdYPKnX8Y-unsplash.jpg";
import pro7Img from "../assets/section images/imgi_5_fecar.png";
import pro8Img from "../assets/section images/imgi_57_image-1738135596812.png";
import pro9Img from "../assets/section images/imgi_58_image-1738134664644.png";
import pro10Img from "../assets/section images/imgi_16_professional_tradie.png";
import pro11Img from "../assets/section images/kiros-amin-IrtBO4xp6NI-unsplash.jpg";
import pro12Img from "../assets/section images/imgi_62_image-1738134768994.png";
import pro13Img from "../assets/section images/imgi_56_image-1748337345038.png";
import pro14Img from "../assets/section images/hero-tradie.jpg";
import pro15Img from "../assets/section images/marco-xu-ToUPBCO62Lw-unsplash.jpg";
import pro16Img from "../assets/section images/imgi_6_carpentor.png";

export interface Professional {
  id: number;
  name: string;
  category: string;
  location: string;
  suburb: string;
  description: string;
  image: string;
  rating: string;
  reviews: number;
  tags: string[];
  experience: string;
  contactEmail: string;
  contactPhone: string;
  logo?: string;
  services?: string[];
  serviceAreas?: string[];
  gallery?: string[];
  website?: string;
}

export const professionals: Professional[] = [
  {
    id: 1,
    name: "Tassie Plumb Co.",
    category: "PLUMBER",
    location: "Sandy Bay, Hobart Area",
    suburb: "Sandy Bay, TAS",
    description: "Expert plumbing services for residential and commercial properties across Australia. We handle everything from leaky taps to full bathroom renovations.",
    image: pro1Img,
    rating: "4.9",
    reviews: 124,
    tags: ["Residential", "Emergency Service", "Licensed"],
    experience: "10+ Years",
    contactEmail: "contact@tassieplumb.com.au",
    contactPhone: "0412 345 678",
    logo: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=200&h=200&fit=crop",
    services: ["Residential Plumbing", "Emergency Repairs", "Hot Water Systems", "Gas Fitting", "Blocked Drains", "Bathroom Renovations"],
    serviceAreas: ["Hobart", "Sandy Bay", "Kingston", "Glenorchy", "Eastern Shore"],
    gallery: [pro1Img, "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=800", "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800"],
    website: "www.tassieplumb.com.au"
  },
  {
    id: 2,
    name: "Spark Pro Electrical",
    category: "ELECTRICIAN",
    location: "Glenorchy, Hobart Area",
    suburb: "Glenorchy, TAS",
    description: "Certified electricians providing safe and reliable electrical solutions for your home and business. Available for 24/7 emergency call-outs.",
    image: pro2Img,
    rating: "4.8",
    reviews: 86,
    tags: ["Certified", "Maintenance", "Solar"],
    experience: "5+ Years",
    contactEmail: "info@sparkpro.com.au",
    contactPhone: "0422 111 222",
    logo: "https://images.unsplash.com/photo-1621905252507-b35220adcfba?q=80&w=200&h=200&fit=crop",
    services: ["Electrical Repairs", "Switchboard Upgrades", "LED Lighting", "Solar Panel Installation", "Data & TV Cabling"],
    serviceAreas: ["Hobart", "Glenorchy", "Moonah", "Claremont", "New Norfolk"],
    gallery: [pro2Img, "https://images.unsplash.com/photo-1558403194-611308249627?q=80&w=800", "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=800"]
  },
  {
    id: 3,
    name: "Hobart Snap Photography",
    category: "PHOTOGRAPHER",
    location: "Bellerive, Hobart Area",
    suburb: "Bellerive, TAS",
    description: "Capturing your special moments with professional photography services. Specializing in weddings, portraits, and commercial real estate photography.",
    image: pro3Img,
    rating: "5.0",
    reviews: 42,
    tags: ["Events", "Portraits", "Real Estate"],
    experience: "3+ Years",
    contactEmail: "hello@hobartsnap.com.au",
    contactPhone: "0433 999 888"
  },
  {
    id: 4,
    name: "Green Thumb Gardens",
    category: "LANDSCAPER",
    location: "Kingston, Hobart Area",
    suburb: "Kingston, TAS",
    description: "Complete garden maintenance and landscaping services. From lawn mowing to hardscaping and garden design.",
    image: pro4Img,
    rating: "4.7",
    reviews: 215,
    tags: ["Landscaping", "Maintenance", "Design"],
    experience: "10+ Years",
    contactEmail: "service@greenthumb.com.au",
    contactPhone: "0444 555 666"
  },
  {
    id: 5,
    name: "Lawn Master",
    category: "GARDENER",
    location: "Moonah, Hobart Area",
    suburb: "Moonah, TAS",
    description: "Professional lawn care services. We specialize in regular maintenance, fertilization, and weed control for a perfect lawn.",
    image: pro5Img,
    rating: "4.9",
    reviews: 156,
    tags: ["Mowing", "Residential", "Weed Control"],
    experience: "5+ Years",
    contactEmail: "lawnmaster@example.com",
    contactPhone: "0455 444 333"
  },
  {
    id: 6,
    name: "Sparkle n Shine",
    category: "CLEANER",
    location: "Howrah, Hobart Area",
    suburb: "Howrah, TAS",
    description: "Premium domestic and commercial cleaning services. Eco-friendly products used for a spotless and fresh environment.",
    image: pro6Img,
    rating: "4.6",
    reviews: 312,
    tags: ["Domestic", "Deep Clean", "Commercial"],
    experience: "1+ Year",
    contactEmail: "sparkle@example.com",
    contactPhone: "0466 777 888"
  },
  {
    id: 7,
    name: "Auto Shine",
    category: "CAR DETAILER",
    location: "Rosny Park, Hobart Area",
    suburb: "Rosny Park, TAS",
    description: "Mobile car detailing services brought to your doorstep. We provide ceramic coating, paint correction, and interior detailing.",
    image: pro7Img,
    rating: "5.0",
    reviews: 64,
    tags: ["Mobile", "Interior", "Ceramic Coating"],
    experience: "5+ Years",
    contactEmail: "autoshine@example.com",
    contactPhone: "0477 888 999"
  },
  {
    id: 8,
    name: "Pressure Pro",
    category: "PRESSURE WASHING",
    location: "New Norfolk, Hobart Area",
    suburb: "New Norfolk, TAS",
    description: "High-pressure cleaning services for all surfaces. Revitalize your driveway, deck, or roof with our professional equipment.",
    image: pro8Img,
    rating: "4.8",
    reviews: 48,
    tags: ["Driveways", "Walls", "Roofs"],
    experience: "3+ Years",
    contactEmail: "pressurepro@example.com",
    contactPhone: "0488 999 000"
  },
  {
    id: 9,
    name: "Fresh Carpet",
    category: "CARPET CLEANER",
    location: "Claremont, Hobart Area",
    suburb: "Claremont, TAS",
    description: "Advanced carpet and upholstery steam cleaning. We remove tough stains and allergens, making your home healthier.",
    image: pro9Img,
    rating: "4.9",
    reviews: 110,
    tags: ["Steam Clean", "Stain Removal", "Upholstery"],
    experience: "5+ Years",
    contactEmail: "freshcarpet@example.com",
    contactPhone: "0499 000 111"
  },
  {
    id: 10,
    name: "Tom's Handyman",
    category: "HANDYMAN",
    location: "Glenorchy, Hobart Area",
    suburb: "Glenorchy, TAS",
    description: "Reliable handyman for all those small jobs around the house. Flat-pack assembly, minor repairs, and more.",
    image: pro10Img,
    rating: "5.0",
    reviews: 124,
    tags: ["Repairs", "Assembly", "Fast"],
    experience: "10+ Years",
    contactEmail: "tom@handyman.com",
    contactPhone: "0411 222 333"
  },
  {
    id: 11,
    name: "Pristine Auto Detail",
    category: "CAR DETAILER",
    location: "Rosny, Hobart Area",
    suburb: "Rosny, TAS",
    description: "Premium auto detailing for luxury and everyday vehicles. We take pride in every detail.",
    image: pro11Img,
    rating: "4.9",
    reviews: 42,
    tags: ["Luxury", "Detailing", "Mobile"],
    experience: "5+ Years",
    contactEmail: "pristine@auto.com",
    contactPhone: "0422 333 444"
  },
  {
    id: 12,
    name: "PowerWash Professionals",
    category: "PRESSURE WASHING",
    location: "Kingston, Hobart Area",
    suburb: "Kingston, TAS",
    description: "Industrial strength pressure washing for commercial and residential clients.",
    image: pro12Img,
    rating: "5.0",
    reviews: 38,
    tags: ["Commercial", "Industrial", "Decks"],
    experience: "5+ Years",
    contactEmail: "power@wash.com",
    contactPhone: "0433 444 555"
  },
  {
    id: 13,
    name: "Fresh Carpets & Rugs",
    category: "CARPET CLEANER",
    location: "Howrah, Hobart Area",
    suburb: "Howrah, TAS",
    description: "Specialized cleaning for delicate rugs and heavy-duty carpets. Stain protection included.",
    image: pro13Img,
    rating: "4.8",
    reviews: 54,
    tags: ["Rugs", "Stain Protection", "Fast Drying"],
    experience: "3+ Years",
    contactEmail: "fresh@carpets.com",
    contactPhone: "0444 555 666"
  },
  {
    id: 14,
    name: "Quality Builder Co.",
    category: "BUILDER",
    location: "Devonport Region",
    suburb: "Devonport, TAS",
    description: "New builds, extensions, and renovations. Quality craftsmanship guaranteed.",
    image: pro14Img,
    rating: "5.0",
    reviews: 110,
    tags: ["Renovations", "New Builds", "Extensions"],
    experience: "10+ Years",
    contactEmail: "quality@builds.com",
    contactPhone: "0455 666 777"
  },
  {
    id: 15,
    name: "Roof Guard Tassie",
    category: "ROOFER",
    location: "Burnie Region",
    suburb: "Burnie, TAS",
    description: "Roof repairs, cleaning, and restoration. Protect your home from the elements.",
    image: pro15Img,
    rating: "5.0",
    reviews: 42,
    tags: ["Repairs", "Restoration", "Gutter Cleaning"],
    experience: "10+ Years",
    contactEmail: "roof@guard.com",
    contactPhone: "0466 777 888"
  },
  {
    id: 16,
    name: "Smooth Plastering",
    category: "PLASTERER",
    location: "Hobart Region",
    suburb: "Hobart, TAS",
    description: "Expert plastering for new homes and renovations. Perfect finish every time.",
    image: pro16Img,
    rating: "5.0",
    reviews: 65,
    tags: ["Plastering", "Cornices", "Repairs"],
    experience: "5+ Years",
    contactEmail: "smooth@plaster.com",
    contactPhone: "0477 888 999"
  }
];
