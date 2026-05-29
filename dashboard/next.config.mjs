import createMDX from "@next/mdx"

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  // See https://lucide.dev/guide/packages/lucide-react#nextjs-example
  transpilePackages: ["lucide-react"],

  // See https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirects-in-nextconfigjs
  async redirects() {
    return [
      // ⚠️ Important:
      // Always list more specific static paths before dynamic ones like "/:lang"
      // to prevent Next.js from incorrectly matching static routes as dynamic parameters.
      // For example, if "/:lang" comes before "/docs", Next.js may treat "docs" as a language.
      {
        source: "/docs",
        destination: "/docs/overview/introduction",
        permanent: true,
      },
      // Auth was removed, so locale roots redirect straight to the home page.
      // Explicit /en and /ar paths so /applications etc. are not matched as ":lang".
      {
        source: "/en",
        destination: "/en/applications",
        permanent: false,
      },
      {
        source: "/ar",
        destination: "/ar/applications",
        permanent: false,
      },
      {
        source: "/:lang/apps/email",
        destination: "/:lang/apps/email/inbox",
        permanent: true,
      },
    ]
  },
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)
