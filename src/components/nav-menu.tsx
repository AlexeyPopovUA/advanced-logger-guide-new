import * as React from "react";
import { useState } from "react";
import { graphql, Link, useStaticQuery } from "gatsby";

type HeaderQuesryResponse = {
    allMarkdownRemark: {
        nodes: Array<{
            fields: {
                slug: string;
            }
            frontmatter: {
                title: string;
            }
            id: string;
        }>
    }
    site: {
        siteMetadata: {
            title: string;
        }
    }
}

export default (props: { location }) => {
    const data: HeaderQuesryResponse = useStaticQuery(graphql`
    query HeaderQuery {
        allMarkdownRemark(filter: {fields: {slug: {nin: ["/404/", "/"]}}}) {
            nodes {
                fields {
                    slug
                }
                frontmatter {
                    title
                }
                id
            }
        }
        site {
            siteMetadata {
                title
            }
        }
    }
    `);

    const [hiddenMenu, setHiddenMenu] = useState(true);

    const onMenuClick = () => {
        setHiddenMenu(!hiddenMenu);
    }

    return (
        <nav
            className="flex justify-between flex-wrap bg-gray-700 px-6 fixed w-full z-10 top-0">

            {/*Website title*/}
            <div className="block flex-shrink-0 mr-6 px-4 py-2 text-2xl text-white no-underline hover:text-white">
                <Link className="header-link-home" to="/">{data.site.siteMetadata.title}</Link>
            </div>

            {/*Menu icon*/}
            <div className="block lg:hidden py-3" onClick={onMenuClick}>
                <button id="nav-toggle"
                        className="flex items-center px-3 border rounded text-gray-500 border-gray-600 hover:text-white hover:border-white">
                    <svg className="fill-current h-8 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <title>Menu</title>
                        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                    </svg>
                </button>
            </div>

            {/*Menu items*/}
            <div className={`w-full flex-grow lg:flex lg:items-center lg:w-auto lg:block pt-6 lg:pt-0 ${hiddenMenu ? "hidden" : ""}`} id="nav-content">
                <ul className="list-reset lg:flex justify-end flex-1 items-center">
                    {data.allMarkdownRemark.nodes.map(node => (
                        <li key={node.id} className="mr-0.75">
                            <Link
                                className={`inline-block ${node.fields.slug !== location.pathname ? "text-gray-400 hover:text-gray-100" : "text-gray-100" } no-underline py-4 px-4`}
                                to={node.fields.slug}>{node.frontmatter.title}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};
