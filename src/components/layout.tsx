import * as React from "react";
import { Link } from "gatsby";

import Footer from "./footer";
import NavMenu from "./nav-menu";

import "./layout.scss";

const Layout = ({ location, title, children }) => (
    <>
        <NavMenu header={<Link className="header-link-home" to="/">{title}</Link>} location={location} />
        <article
            className="global-wrapper font-sans tracking-normal leading-normal"
            itemScope
            itemType="https://schema.org/Article"
        >
            <div className="container mx-auto">
                <div className="flex flex-row flex-wrap py-4">
                    <div className="container w-full mx-auto pt-20">
                        <div className="article-content w-full px-4 md:px-6 text-xl text-gray-800 leading-normal">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </article>
        <Footer />
    </>
);

export default Layout;
