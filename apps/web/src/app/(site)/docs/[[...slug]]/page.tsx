import defaultMdxComponents from "fumadocs-ui/mdx";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";

import { source } from "@/lib/source";

function ExternalLink(props: React.ComponentPropsWithoutRef<"a">) {
  if (props.href?.startsWith("http")) {
    return (
      <a {...props} target="_blank" rel="noreferrer noopener">
        {props.children}
      </a>
    );
  }
  return <a {...props}>{props.children}</a>;
}

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) {
    return (
      <DocsPage>
        <DocsTitle>Not Found</DocsTitle>
        <DocsBody>
          <p>The requested page could not be found.</p>
        </DocsBody>
      </DocsPage>
    );
  }

  const MDX = page.data.body;

  return (
    <DocsPage>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents, a: ExternalLink }} />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) {
    return { title: "Not Found" };
  }

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
