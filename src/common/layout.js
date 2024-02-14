// UNUSED file - need to modify code, then we can use this for a common layout on all pages.
import Header from "./components/header"
import Footer from "./components/footer"

const Layout = ({page}) => {
    console.log(page, "Hiiii")
    return (
        <>
        <Header />
        {page}
        <Footer />
        </>
    )
}

export default  Layout;