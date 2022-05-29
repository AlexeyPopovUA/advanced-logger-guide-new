import * as React from "react";
import {  graphql, PageProps } from "gatsby";
import { OutboundLink } from "gatsby-plugin-google-analytics";

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
            email: string;
            facebook: string;
            github: string;
            linkedin: string;
            twitter: string;
            webpage: string;
            author: string;
        }
    }
}

const Template: React.FC<PageProps<DataProps, Context>> = ({ data, location }) => {
    const post = data.markdownRemark;

    return (
        <Layout location={location}>
            <Seo
                title={post.frontmatter.title}
                description={post.frontmatter.description}
            />
            <h1 itemProp="headline"
                className="font-bold font-sans break-normal text-gray-900 pt-6 pb-2 text-3xl md:text-4xl">{post.frontmatter.title}</h1>
            <p className="text-sm md:text-base font-normal text-gray-600">{post.frontmatter.date}</p>
            <div className="flex flex-row py-2">
                <div className="flex-shrink-0 pr-2">Author:</div>
                <div className="flex-grow">{post.frontmatter.author}</div>
            </div>
            <div className="flex flex-row py-2">
                <div className="flex-shrink-0 w-40 pr-2">Webpage:</div>
                <div className="flex-grow"><OutboundLink href={post.frontmatter.webpage} className="underline text-blue-500">Click me :)</OutboundLink></div>
            </div>
            <div className="flex flex-row py-2">
                <div className="flex-shrink-0 w-40 pr-2">Email:</div>
                <div className="flex-grow"><OutboundLink href={`mailto:${post.frontmatter.email}`} className="underline text-blue-500">Send me an email</OutboundLink></div>
            </div>
            <div className="flex flex-row py-2">
                <div className="flex-shrink-0 w-40 pr-2">GitHub:</div>
                <div className="flex-grow"><OutboundLink href={post.frontmatter.github} className="underline text-blue-500">Link</OutboundLink></div>
            </div>
            <div className="flex flex-row py-2">
                <div className="flex-grow">You can find me also in social networks:</div>
            </div>
            <div className="flex flex-row py-2">
                <div className="flex-shrink-0 w-40 pr-2">Linkedin:</div>
                <div className="flex-grow"><OutboundLink href={post.frontmatter.linkedin} className="underline text-blue-500">Link</OutboundLink></div>
            </div>
            <div className="flex flex-row py-2">
                <div className="flex-shrink-0 w-40 pr-2">Facebook:</div>
                <div className="flex-grow"><OutboundLink href={post.frontmatter.facebook} className="underline text-blue-500">Link</OutboundLink></div>
            </div>
            <div className="flex flex-row py-2">
                <div className="flex-shrink-0 w-40 pr-2">Twitter:</div>
                <div className="flex-grow"><OutboundLink href={post.frontmatter.twitter} className="underline text-blue-500">Link</OutboundLink></div>
            </div>
        </Layout>
    )
}

export default Template;

export const pageQuery = graphql`
query ($id: String!) {
    markdownRemark(id: {eq: $id}) {
        id
        frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            description
            email
            facebook
            github
            linkedin
            twitter
            webpage
            author
        }
    }
}
`
