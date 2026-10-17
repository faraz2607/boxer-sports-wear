
import Footer from "../../common/components/footer";
import Header from "../../common/components/header";
import CarouselSection from "./carouselSection";
import Catalogue from "./catalogue";
import HeroSection from "./heroSection";
// import Layout from "../../common/layout" //--> to use common layout need to modify it.

const Index = () => {
    return (
        <>
        {/* <Layout page={<Home />}/> */}
        <Header />
        <main id="top">
            <div className="page-container">
                <div className="hero-feature-grid">
                    <HeroSection />
                    <CarouselSection />
                </div>
            </div>
            <div className="catalogue-wrap">
                <div className="page-container">
                <Catalogue />
                </div>
            </div>
        </main>
        <Footer />
        </>
    )
}

export default Index;
