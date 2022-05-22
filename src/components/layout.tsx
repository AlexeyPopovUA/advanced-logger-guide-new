import * as React from "react";
import { Link } from "gatsby";

import Footer from "./footer";
import Header from "./header";

const Layout = ({ location, title, children }) => {
    // @ts-ignore
    const rootPath = `${__PATH_PREFIX__}/`;
    const isRootPath = location.pathname === rootPath;
    let header;

    if (isRootPath) {
        header = (
            <h1 className="main-heading">
                <Link to="/">{title}</Link>
            </h1>
        );
    } else {
        header = (
            <Link className="header-link-home" to="/">
                {title}
            </Link>
        );
    }

    return (
        <div className="global-wrapper font-sans tracking-normal leading-normal " data-is-root-path={isRootPath}>
            <Header header={header} />
            <div className="container mx-auto">
                <div className="flex flex-row flex-wrap py-4">
                    <div className="container w-full md:max-w-3xl mx-auto pt-20">
                        <div className="w-full px-4 md:px-6 text-xl text-gray-800 leading-normal">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Layout;
