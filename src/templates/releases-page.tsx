import * as React from "react";
import { graphql, PageProps } from "gatsby";
import { parse } from "marked";

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

class Template extends React.Component<PageProps<DataProps, Context>, { releasesContent: string }> {
    constructor(props) {
        super(props);

        this.state = {
            releasesContent: ""
        };
    }

    async componentDidMount() {
        const resp = await fetchReleases();

        this.setState({
            releasesContent: parse(resp)
        });
    }

    render() {
        let { data, location } = this.props;
        const post = data.markdownRemark;

        return (
            <Layout location={location}>
                <Seo
                    title={post.frontmatter.title}
                    description={post.frontmatter.description}
                />
                <h1 itemProp="headline"
                    className="font-bold font-sans break-normal text-gray-900 pt-6 pb-2 text-3xl md:text-4xl">{post.frontmatter.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: this.state.releasesContent }} />
            </Layout>
        );
    }
}

const fetchReleases = async () => {
    try {
        const response = await fetch("https://raw.githubusercontent.com/AlexeyPopovUA/advanced-logger/master/CHANGELOG.md");
        return response.text();
    } catch (e) {
        console.error(e);
    }

    return "";
};

export default Template;

export const pageQuery = graphql`
query ($id: String!) {
    markdownRemark(id: {eq: $id}) {
        id
        html
        frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            description
        }
    }
}
`;
