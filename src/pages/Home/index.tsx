import Hero from '../../components/home/Hero.tsx';
// import RequestedServices from '../../components/home/RequestedServices.tsx';
import HowItWorks from '../../components/home/HowItWorks.tsx';
//import TradeSlider from '../../components/home/TradeSlider.tsx';
import FindTradies from '../../components/home/FindTradies.tsx';
import ReviewedTradies from '../../components/home/ReviewedTradies.tsx';
import SkilledTradieCTA from '../../components/home/SkilledTradieCTA.tsx';
import BlogSection from '../../components/home/BlogSection.tsx';
//import MyLocalProCTA from '../../components/home/MyLocalProCTA.tsx';

const Home = () => {
  return (
    <div className="bg-white overflow-x-hidden">
      <Hero />
      <SkilledTradieCTA />
      {/* <RequestedServices /> */}
      <HowItWorks />
      {/* <TradeSlider /> */}
      <FindTradies />
      <ReviewedTradies />
      <BlogSection />
      {/* <MyLocalProCTA /> */}
    </div>
  );
};

export default Home;
