const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

type PageNode = {
    fields: {
        slug: string
    };
    frontmatter: {
        title: string;
        template: string;
        date: string;
    };
    id: string;
}

exports.createPages = async ({ graphql, actions, reporter }) => {
    const { createPage } = actions;

    // Get all markdown blog posts sorted by date
    const result = await graphql(
        `
            query AllPages {
                allMarkdownRemark {
                    nodes {
                        fields {
                            slug
                        }
                        frontmatter {
                            title
                            template
                            date
                        }
                        id
                    }
                }
            }
        `
    )

    if (result.errors) {
        reporter.panicOnBuild(
            `There was an error loading your blog posts`,
            result.errors
        );
        return;
    }

    const posts = result.data.allMarkdownRemark.nodes as PageNode[];

    // Create pages
    // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.ts)
    // `context` is available in the template as a prop and as a variable in GraphQL

    if (posts.length > 0) {
        posts.forEach((post) => {
            createPage({
                path: post.fields.slug,
                component: path.resolve(`./src/templates/${post.frontmatter.template}.tsx`),
                context: {
                    id: post.id
                }
            });
        })
    }
}

exports.onCreateNode = ({ node, actions, getNode }) => {
    const { createNodeField } = actions;

    if (node.internal.type === `MarkdownRemark`) {
        const value = createFilePath({ node, getNode });

        createNodeField({
            name: `slug`,
            node,
            value,
        });
    }
}

exports.createSchemaCustomization = ({ actions }) => {
    const { createTypes } = actions;

    // Explicitly define the siteMetadata {} object
    // This way those will always be defined even if removed from gatsby-config.ts

    // Also explicitly define the Markdown frontmatter
    // This way the "MarkdownRemark" queries will return `null` even when no
    // blog posts are stored inside "content/blog" instead of returning an error
    createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
    }

    type Fields {
      slug: String
    }
  `)
}
