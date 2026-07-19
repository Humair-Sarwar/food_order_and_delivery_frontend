import { CategoriesSection } from "./CategoriesSection"
import { FAQSection } from "./FAQSection"
import { FeaturesSection } from "./FeaturesSection"
import { HeroSlider } from "./HeroSlider"
import { ServiceCoverage } from "./ServiceCoverage"
import { TextScroll } from "./TextScroll"


const Home = () => {
  return (
    <>
      <HeroSlider/>
      <TextScroll/>
      <CategoriesSection/>
      <ServiceCoverage/>
      <FeaturesSection/>
      <FAQSection/>
    </>
  )
}

export default Home
