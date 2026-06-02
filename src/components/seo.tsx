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
    pathname?: string;
};

const normalizeSiteUrl = (siteUrl: string) => siteUrl.replace(/\/$/, "");

const buildCanonicalUrl = (siteUrl: string, pathname: string) => {
    const base = normalizeSiteUrl(siteUrl);
    if (pathname === "/" || pathname === "") {
        return `${base}/`;
    }
    const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
    return `${base}${path.endsWith("/") ? path : `${path}/`}`;
};

export const SeoHead: React.FC<SeoProps> = ({
    description = "",
    lang = "en",
    meta = [],
    pathname,
    title,
}) => {
    const { site } = useStaticQuery(
        graphql`
            query SeoSiteMetadata {
                site {
                    siteMetadata {
                        title
                        description
                        siteUrl
                    }
                }
            }
        `
    );

    const metaDescription = description || site.siteMetadata.description;
    const defaultTitle = site.siteMetadata?.title;
    const pageTitle = defaultTitle ? `${title} | ${defaultTitle}` : title;
    const canonicalUrl =
        pathname && site.siteMetadata.siteUrl
            ? buildCanonicalUrl(site.siteMetadata.siteUrl, pathname)
            : undefined;

    const defaultMeta: SeoMeta[] = [
        { name: "description", content: metaDescription },
        { property: "og:title", content: pageTitle },
        { property: "og:description", content: metaDescription },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: pageTitle },
        { name: "twitter:description", content: metaDescription },
    ];

    if (canonicalUrl) {
        defaultMeta.push({ property: "og:url", content: canonicalUrl });
    }

    return (
        <>
            <html lang={lang} />
            <title>{pageTitle}</title>
            {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}
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
