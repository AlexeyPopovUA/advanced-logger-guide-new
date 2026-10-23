import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

export type SeoMeta = {
    name?: string
    property?: string
    content: string
}

export type SeoJsonLd = "home" | "tech-article"

export type SeoProps = {
    title: string
    description?: string
    lang?: string
    meta?: SeoMeta[]
    pathname?: string
    jsonLd?: SeoJsonLd
    datePublished?: string
}

const OG_IMAGE_PATH = "/og-image.png"
const OG_IMAGE_WIDTH = 1200
const OG_IMAGE_HEIGHT = 630
const OG_IMAGE_ALT =
    "Advanced Logger, an isomorphic TypeScript logging library for Node.js and browsers"

const LIBRARY_REPOSITORY = "https://github.com/AlexeyPopovUA/advanced-logger"
const LIBRARY_NPM = "https://www.npmjs.com/package/advanced-logger"
const LIBRARY_LICENSE = "https://opensource.org/licenses/MIT"
const LIBRARY_DESCRIPTION =
    "Extendable isomorphic TypeScript logging library for Node.js and browsers. Batches arbitrary log objects and ships them with pluggable strategies and services."

const normalizeSiteUrl = (siteUrl: string) => siteUrl.replace(/\/$/, "")

const buildCanonicalUrl = (siteUrl: string, pathname: string) => {
    const base = normalizeSiteUrl(siteUrl)
    if (pathname === "/" || pathname === "") {
        return `${base}/`
    }
    const path = pathname.startsWith("/") ? pathname : `/${pathname}`
    return `${base}${path.endsWith("/") ? path : `${path}/`}`
}

const person = (name: string) => ({
    "@type": "Person",
    name,
})

const imageObject = (url: string) => ({
    "@type": "ImageObject",
    url,
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
})

type JsonLdInput = {
    kind: SeoJsonLd
    siteTitle: string
    siteUrl: string
    authorName: string
    description: string
    headline: string
    canonicalUrl?: string
    imageUrl?: string
    datePublished?: string
}

const buildJsonLd = ({
    kind,
    siteTitle,
    siteUrl,
    authorName,
    description,
    headline,
    canonicalUrl,
    imageUrl,
    datePublished,
}: JsonLdInput) => {
    const siteRoot = `${siteUrl}/`

    if (kind === "home") {
        return {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebSite",
                    "@id": `${siteRoot}#website`,
                    name: siteTitle,
                    url: siteRoot,
                    description,
                    inLanguage: "en",
                    ...(imageUrl ? { image: imageUrl } : {}),
                    publisher: person(authorName),
                },
                {
                    "@type": "SoftwareSourceCode",
                    "@id": `${LIBRARY_REPOSITORY}#source`,
                    name: "advanced-logger",
                    description: LIBRARY_DESCRIPTION,
                    codeRepository: LIBRARY_REPOSITORY,
                    programmingLanguage: "TypeScript",
                    runtimePlatform: "Node.js and browsers",
                    license: LIBRARY_LICENSE,
                    url: LIBRARY_NPM,
                    author: person(authorName),
                },
            ],
        }
    }

    return {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline,
        description,
        inLanguage: "en",
        ...(canonicalUrl
            ? {
                  url: canonicalUrl,
                  mainEntityOfPage: {
                      "@type": "WebPage",
                      "@id": canonicalUrl,
                  },
              }
            : {}),
        ...(imageUrl ? { image: imageObject(imageUrl) } : {}),
        ...(datePublished ? { datePublished } : {}),
        author: person(authorName),
        publisher: {
            "@type": "Organization",
            name: siteTitle,
            url: siteRoot,
            ...(imageUrl ? { logo: imageObject(imageUrl) } : {}),
        },
    }
}

export const SeoHead: React.FC<SeoProps> = ({
    description = "",
    lang = "en",
    meta = [],
    pathname,
    title,
    jsonLd,
    datePublished,
}) => {
    const { site } = useStaticQuery(graphql`
        query SeoSiteMetadata {
            site {
                siteMetadata {
                    title
                    description
                    siteUrl
                    author {
                        name
                    }
                }
            }
        }
    `)

    const metaDescription = description || site.siteMetadata.description
    const siteTitle = site.siteMetadata?.title || "Advanced Logger"
    const pageTitle = site.siteMetadata?.title
        ? `${title} | ${site.siteMetadata.title}`
        : title
    const siteUrl = site.siteMetadata.siteUrl
        ? normalizeSiteUrl(site.siteMetadata.siteUrl)
        : undefined
    const canonicalUrl =
        pathname && siteUrl ? buildCanonicalUrl(siteUrl, pathname) : undefined
    const imageUrl = siteUrl ? `${siteUrl}${OG_IMAGE_PATH}` : undefined
    const authorName = site.siteMetadata?.author?.name || "Oleksii Popov"

    const defaultMeta: SeoMeta[] = [
        { name: "description", content: metaDescription },
        { property: "og:title", content: pageTitle },
        { property: "og:description", content: metaDescription },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: siteTitle },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: pageTitle },
        { name: "twitter:description", content: metaDescription },
    ]

    if (canonicalUrl) {
        defaultMeta.push({ property: "og:url", content: canonicalUrl })
    }

    if (imageUrl) {
        defaultMeta.push(
            { property: "og:image", content: imageUrl },
            { property: "og:image:width", content: String(OG_IMAGE_WIDTH) },
            { property: "og:image:height", content: String(OG_IMAGE_HEIGHT) },
            { property: "og:image:alt", content: OG_IMAGE_ALT },
            { name: "twitter:image", content: imageUrl },
            { name: "twitter:image:alt", content: OG_IMAGE_ALT },
        )
    }

    const jsonLdData = jsonLd
        ? buildJsonLd({
              kind: jsonLd,
              siteTitle,
              siteUrl: siteUrl || "https://www.advancedlogger.com",
              authorName,
              description: metaDescription,
              headline: title,
              canonicalUrl,
              imageUrl,
              datePublished,
          })
        : null

    return (
        <>
            <html lang={lang} />
            <title>{pageTitle}</title>
            {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}
            {[...defaultMeta, ...meta].map(entry => {
                const key = entry.name || entry.property
                if (entry.name) {
                    return (
                        <meta
                            key={key}
                            name={entry.name}
                            content={entry.content}
                        />
                    )
                }
                return (
                    <meta
                        key={key}
                        property={entry.property}
                        content={entry.content}
                    />
                )
            })}
            {jsonLdData ? (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLdData).replace(
                            /</g,
                            "\\u003c",
                        ),
                    }}
                />
            ) : null}
        </>
    )
}
