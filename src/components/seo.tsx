import * as React from "react";
import { useStaticQuery, graphql } from "gatsby";

export type SeoMeta = {
    name?: string;
    property?: string;
    content: string;
};

export type SeoProps = {
    title: string;
    description?: string;
    lang?: string;
    meta?: SeoMeta[];
};

export const SeoHead: React.FC<SeoProps> = ({
    description = "",
    lang = "en",
    meta = [],
    title,
}) => {
    const { site } = useStaticQuery(
        graphql`
            query SeoSiteMetadata {
                site {
                    siteMetadata {
                        title
                        description
                    }
                }
            }
        `
    );

    const metaDescription = description || site.siteMetadata.description;
    const defaultTitle = site.siteMetadata?.title;
    const pageTitle = defaultTitle ? `${title} | ${defaultTitle}` : title;

    const defaultMeta: SeoMeta[] = [
        { name: "description", content: metaDescription },
        { property: "og:title", content: title },
        { property: "og:description", content: metaDescription },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: metaDescription },
    ];

    return (
        <>
            <html lang={lang} />
            <title>{pageTitle}</title>
            {[...defaultMeta, ...meta].map((entry) => {
                const key = entry.name || entry.property;
                if (entry.name) {
                    return <meta key={key} name={entry.name} content={entry.content} />;
                }
                return (
                    <meta key={key} property={entry.property} content={entry.content} />
                );
            })}
        </>
    );
};
