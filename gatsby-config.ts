module.exports = {
    siteMetadata: {
        title: `Advanced Logger`,
        author: {
            name: `Oleksii Popov`,
            summary: `summary text`,
        },
        description: `Documentation for advanced-logger, an extendable isomorphic TypeScript logging library for Node.js and browsers.`,
        siteUrl: `https://www.advancedlogger.com`,
    },
    plugins: [
        {
            resolve: "gatsby-plugin-decap-cms",
            options: {
                enableIdentityWidget: false,
                customizeWebpackConfig: config => {
                    // Bundle Decap + React in cms.js instead of UMD script tags
                    // (React 19 has no official UMD; prebuilt decap UMD mismatches versions).
                    config.externals = []
                    config.plugins = config.plugins.filter(plugin => {
                        const name = plugin?.constructor?.name
                        return (
                            name !== "CopyPlugin" &&
                            name !== "HtmlWebpackTagsPlugin"
                        )
                    })
                },
            },
        },
        `gatsby-plugin-image`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/src/pages`,
                name: `pages`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/src/settings`,
                name: `settings`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
            },
        },
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                plugins: [
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            maxWidth: 630,
                        },
                    },
                    `gatsby-remark-prismjs`,
                    `gatsby-remark-copy-linked-files`,
                    `gatsby-remark-smartypants`,
                ],
            },
        },
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        {
            resolve: `gatsby-plugin-google-analytics`,
            options: {
                trackingId: `UA-127711409-4`,
            },
        },
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `Gatsby Starter Blog`,
                short_name: `GatsbyJS`,
                start_url: `/`,
                background_color: `#ffffff`,
                // This will impact how browsers show your PWA/website
                // https://css-tricks.com/meta-theme-color-and-trickery/
                // theme_color: `#663399`,
                display: `minimal-ui`,
                icon: `src/images/book.svg`, // This path is relative to the root of the site.
            },
        },
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.dev/offline
        // `gatsby-plugin-offline`,
        {
            resolve: `gatsby-plugin-postcss`,
        },
        `gatsby-plugin-sass`,
        {
            resolve: `gatsby-plugin-sitemap`,
            options: {
                excludes: [`/404/`, `/404.html`],
            },
        },
    ],
}
