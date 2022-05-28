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
}

const Template: React.FC<PageProps<DataProps, Context>> = ({ data, location }) => {
    const post = data.markdownRemark;

    return (
        <Layout location={location}>
            <Seo
                title={post.frontmatter.title}
                description={post.frontmatter.description || post.excerpt}
            />
            <h1 itemProp="headline"
                className="font-bold font-sans break-normal text-gray-900 pt-6 pb-2 text-3xl md:text-4xl">{post.frontmatter.title}</h1>
            <p className="text-sm md:text-base font-normal text-gray-600">{post.frontmatter.date}</p>
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </Layout>
    );
};

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
}
`;
