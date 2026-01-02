

import { Outlet } from "react-router-dom";
import Footer from "./components/footer/Footer";
import HomeAppBar from "./modules/navbar/HomeAppBar";

const Layout = ({ navLinks }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <HomeAppBar navLinks={navLinks} />
            <div className="flex-1 flex items-center justify-center">
                <div className="w-[95%] min-h-[460px]  my-2 mx-auto">
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Layout;
