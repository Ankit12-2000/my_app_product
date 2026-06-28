import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogBySlug } from "@/lib/data/queries";
import { Thumb } from "@/components/Thumb";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  return { title: post?.title ?? "Blog", description: post?.excerpt ?? undefined };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-sm text-clay-700">
        {new Date(post.published_at).toLocaleDateString("en-IN", { dateStyle: "long" })}
        {post.author && ` · ${post.author}`}
      </p>
      <h1 className="mt-2 text-3xl font-bold">{post.title}</h1>
      <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-clay-100">
        <Thumb src={post.cover_url} alt={post.title} seed={post.slug} icon="📖" fill className="object-cover" />
      </div>
      <div className="prose mt-6 max-w-none whitespace-pre-line text-clay-700">{post.body}</div>
    </article>
  );
}
