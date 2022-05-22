import * as React from "react";
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
}

export default (props: { header: string }) => {
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
    }
  `);

    return (
        <nav
            className="global-header flex items-center justify-between flex-wrap bg-gray-800 p-6 fixed w-full z-10 top-0">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <a className="text-white no-underline hover:text-white hover:no-underline" href="#">
                    <span className="text-2xl pl-2"><i className="em em-grinning"></i>{props.header}</span>
                </a>
            </div>

            <div className="block lg:hidden">
                <button id="nav-toggle"
                        className="flex items-center px-3 py-2 border rounded text-gray-500 border-gray-600 hover:text-white hover:border-white">
                    <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <title>Menu</title>
                        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                    </svg>
                </button>
            </div>

            <div className="w-full flex-grow lg:flex lg:items-center lg:w-auto hidden lg:block pt-6 lg:pt-0"
                 id="nav-content">
                <ul className="list-reset lg:flex justify-end flex-1 items-center">
                    {data.allMarkdownRemark.nodes.map(node => (
                        <li key={node.id} className="mr-0.75">
                            <Link
                                className="inline-block text-gray-600 no-underline hover:text-gray-200 hover:text-underline py-2 px-4"
                                to={node.fields.slug}>{node.frontmatter.title}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};