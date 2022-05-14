import * as React from "react";
import { PageProps, graphql } from "gatsby";

import Layout from "../components/layout";
import Seo from "../components/seo";

type Context = {
    id: string;
};

type DataProps = {
    markdownRemark: {
        id: string;
        excerpt: string;
        html: string;
        frontmatter: {
            date: string;
            title: string;
            description: string;
        }
    }
    site: {
        siteMetadata: {
            title: string;
        }
    }
}

const Template: React.FC<PageProps<DataProps, Context>> = ({ data, location }) => {
    const post = data.markdownRemark;
    const siteTitle = data.site.siteMetadata.title;

    return (
        <Layout location={location} title={siteTitle}>
            <Seo
                title={post.frontmatter.title}
                description={post.frontmatter.description || post.excerpt}
            />
            <article
                className="blog-post"
                itemScope
                itemType="http://schema.org/Article"
            >
                <header>
                    <h1 itemProp="headline">{post.frontmatter.title}</h1>
                </header>
                <div
                    dangerouslySetInnerHTML={{ __html: post.html }}
                />
                <hr />
                <footer>
                    <>nothing</>
                </footer>
            </article>
        </Layout>
    )
}

export default Template;

export const pageQuery = graphql`
query ($id: String!) {
    markdownRemark(id: {eq: $id}) {
        id
        excerpt(pruneLength: 160)
        html
        frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            description
        }
    }
    site {
        siteMetadata {
            title
        }
    }
}
`;
