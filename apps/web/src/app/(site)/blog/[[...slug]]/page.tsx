import Link from "next/link";

import defaultMdxComponents from "fumadocs-ui/mdx";

import { blogSource } from "@/lib/source";
import "../blog.css";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function BlogPage(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;

  if (!params.slug || params.slug.length === 0) {
    const posts = blogSource.getPages();

    return (
      <div className="mx-auto max-w-[800px] px-6 py-[120px_24px_80px]">
        <div className="mb-16">
          <span className="category-tag mb-4 inline-flex">BLOG</span>
          <h1 className="m-0 mb-4 font-bold font-mono text-[#fafafa] text-[clamp(28px,4vw,40px)] leading-[1.15] tracking-[-0.02em]">
            Insights & Updates
          </h1>
          <p className="m-0 text-[#71717a] text-[16px] leading-[1.6]">
            Technical deep dives on stealth automation, bot detection, and building for scale.
          </p>
        </div>

        <div className="blog-divider" />

        <div className="flex flex-col gap-3">
          {posts.map((post) => {
            const frontmatter = post.data._exports.frontmatter as {
              date?: string;
              category?: string;
              author?: string;
            };
            return (
              <Link
                key={post.url}
                href={post.url}
                className="blog-card flex flex-col gap-3 rounded-lg p-[32px_24px] no-underline"
              >
                <div className="flex items-center gap-3 font-mono text-[#52525b] text-[11px]">
                  {frontmatter.category && <span className="category-tag">{frontmatter.category}</span>}
                  {frontmatter.date && (
                    <time className="font-mono text-[#52525b] text-[11px] tracking-[0.02em]">
                      {formatDate(frontmatter.date)}
                    </time>
                  )}
                </div>
                <h2 className="m-0 font-mono font-semibold text-[#fafafa] text-[20px] leading-[1.3] tracking-[-0.01em]">
                  {post.data.title}
                </h2>
                <p className="m-0 text-[#71717a] text-[14px] leading-[1.6]">{post.data.description}</p>
                <div className="mt-1 flex items-center gap-2">
                  {frontmatter.author && (
                    <span className="font-mono text-[#52525b] text-[11px]">{frontmatter.author}</span>
                  )}
                  <span className="ml-auto font-mono text-[#52525b] text-[11px] transition-colors duration-200">
                    Read more →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  const page = blogSource.getPage(params.slug);

  if (!page) {
    return (
      <div className="mx-auto max-w-[800px] px-6 py-[120px_24px_80px]">
        <h1 className="m-0 mb-4 font-bold font-mono text-[#fafafa] text-[clamp(28px,4vw,40px)] leading-[1.15] tracking-[-0.02em]">
          Post not found
        </h1>
        <Link
          href="/blog"
          className="inline-block font-mono text-[#52525b] text-[13px] no-underline hover:text-[#fafafa]"
        >
          ← Back to blog
        </Link>
      </div>
    );
  }

  const MDX = page.data.body;
  const frontmatter = page.data._exports.frontmatter as {
    date?: string;
    category?: string;
    author?: string;
  };

  return (
    <div className="mx-auto max-w-[800px] px-6 py-[120px_24px_80px]">
      <Link
        href="/blog"
        className="inline-block font-mono text-[#52525b] text-[13px] no-underline hover:text-[#fafafa]"
      >
        ← Back to blog
      </Link>

      <div className="blog-post-header">
        <div className="mb-4 flex items-center gap-3">
          {frontmatter.category && <span className="category-tag">{frontmatter.category}</span>}
          {frontmatter.date && (
            <time className="font-mono text-[#52525b] text-[11px] tracking-[0.02em]">
              {formatDate(frontmatter.date)}
            </time>
          )}
        </div>
        <h1 className="m-0 mb-4 font-bold font-mono text-[#fafafa] text-[clamp(28px,4vw,40px)] leading-[1.15] tracking-[-0.02em]">
          {page.data.title}
        </h1>
        <p className="m-0 mb-4 text-[#71717a] text-[16px] leading-[1.6]">{page.data.description}</p>
        {frontmatter.author && <span className="font-mono text-[#52525b] text-[12px]">By {frontmatter.author}</span>}
      </div>

      <article className="blog-article text-[#d4d4d8] text-[16px] leading-[1.8]">
        <MDX components={{ ...defaultMdxComponents }} />
      </article>
    </div>
  );
}

export function generateStaticParams() {
  return blogSource.generateParams();
}
