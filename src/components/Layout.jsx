import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({navbar=true, children}) =>{
    return (
    <>
   { navbar && <Navbar />}
    <div className="container mt-3">
       {children}
        </div>
        <Footer/>
        </>
        );
}

export default Layout;