
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
        <div className="bg-green-5 px-4">
            <div className="container mx-auto ">
                <HeroSection />
                <CarouselSection />
            </div>
        </div>
        <div className="bg-green-15 px-4">
            <div className="container mx-auto ">
                <Catalogue />
                {/* <Home /> */}
            </div>
        </div>
        <Footer />
        </>
    )
}

export default Index;