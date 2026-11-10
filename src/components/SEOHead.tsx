import { useEffect } from "react";
import { useSite } from "@/store/siteStore";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!content) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}
function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!href) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}
function upsertScript(id: string, type: string, content: string) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!content) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = type;
    document.head.appendChild(el);
  }
  el.textContent = content;
}

function absolute(base: string, path: string) {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  return base.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
}

export function buildSchema(s: ReturnType<typeof useSite>) {
  const { seo, general, faqs } = s;
  const graph: Record<string, unknown>[] = [];
  if (seo.schemaEnabled) {
    graph.push({
      "@type": "LocalBusiness",
      "@id": seo.siteUrl + "#business",
      name: seo.businessName,
      url: seo.siteUrl,
      image: absolute(seo.siteUrl, seo.ogImage),
      telephone: general.phone,
      priceRange: seo.priceRange,
      description: seo.description,
      address: {
        "@type": "PostalAddress",
        addressLocality: seo.businessCity,
        addressRegion: seo.businessRegion,
        addressCountry: seo.businessCountry,
      },
      areaServed: { "@type": "Country", name: "Saudi Arabia" },
      sameAs: seo.twitterHandle ? [`https://x.com/${seo.twitterHandle.replace("@", "")}`] : undefined,
    });
    graph.push({
      "@type": "WebSite",
      "@id": seo.siteUrl + "#website",
      url: seo.siteUrl,
      name: seo.businessName,
      inLanguage: "ar",
    });
  }
  if (seo.faqSchemaEnabled && faqs.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  return graph.length ? { "@context": "https://schema.org", "@graph": graph } : null;
}

export function SEOHead() {
  const s = useSite();
  const { seo } = s;

  useEffect(() => {
    document.title = seo.title;
    document.documentElement.lang = "ar";
    upsertMeta("name", "description", seo.description);
    upsertMeta("name", "keywords", seo.keywords);
    upsertMeta("name", "robots", `${seo.robotsIndex ? "index" : "noindex"}, ${seo.robotsFollow ? "follow" : "nofollow"}`);
    upsertMeta("name", "google-site-verification", seo.googleVerification);
    upsertLink("canonical", seo.canonical);

    const ogImg = absolute(seo.siteUrl, seo.ogImage);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:locale", seo.locale);
    upsertMeta("property", "og:site_name", seo.businessName);
    upsertMeta("property", "og:title", seo.ogTitle || seo.title);
    upsertMeta("property", "og:description", seo.ogDescription || seo.description);
    upsertMeta("property", "og:url", seo.canonical || seo.siteUrl);
    upsertMeta("property", "og:image", ogImg);
    upsertMeta("name", "twitter:card", ogImg ? "summary_large_image" : "summary");
    upsertMeta("name", "twitter:site", seo.twitterHandle);
    upsertMeta("name", "twitter:title", seo.ogTitle || seo.title);
    upsertMeta("name", "twitter:description", seo.ogDescription || seo.description);
    upsertMeta("name", "twitter:image", ogImg);

    const schema = buildSchema(s);
    upsertScript("ld-json", "application/ld+json", schema ? JSON.stringify(schema) : "");

    // Google Analytics 4
    if (seo.gaId && !document.getElementById("ga4-src")) {
      const src = document.createElement("script");
      src.id = "ga4-src";
      src.async = true;
      src.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(seo.gaId)}`;
      document.head.appendChild(src);
      upsertScript(
        "ga4-init",
        "text/javascript",
        `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${seo.gaId}');`
      );
    }
    // Google Tag Manager (skip if already injected in index.html)
    const gtmAlreadyLoaded =
      !!document.getElementById("gtm-init") ||
      !!document.querySelector('script[src*="googletagmanager.com/gtm.js"]');
    if (seo.gtmId && !gtmAlreadyLoaded) {
      upsertScript(
        "gtm-init",
        "text/javascript",
        `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${seo.gtmId}');`
      );
    }

    // Custom head HTML (meta/link tags only — scripts are not executed via innerHTML)
    let custom = document.getElementById("custom-head");
    if (seo.customHeadHtml) {
      if (!custom) {
        custom = document.createElement("div");
        custom.id = "custom-head";
        custom.hidden = true;
        document.head.appendChild(custom);
      }
      custom.innerHTML = seo.customHeadHtml;
    } else {
      custom?.remove();
    }
  }, [s, seo]);

  return null;
}
