import * as React from "react";

import Footer from "./footer";
import NavMenu from "./nav-menu";

import "./layout.scss";

const Layout = ({ location, children }) => (
    <>
        <NavMenu location={location} />
        <article className="font-sans container mx-auto pt-12">
            <div className="article-content px-4 text-xl text-gray-800">
                {children}
            </div>
        </article>
        <Footer />
    </>
);

export default Layout;
