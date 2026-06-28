import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/data/queries";
import { Thumb } from "@/components/Thumb";

export const metadata: Metadata = { title: "Blog" };

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">Blog</h1>
      <p className="mt-1 text-clay-700">Guides & stories about murti, materials and traditions.</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group overflow-hidden rounded-2xl border border-clay-100 bg-white transition hover:shadow-lg"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-clay-100">
              <Thumb src={post.cover_url} alt={post.title} seed={post.slug} icon="📖" fill className="object-cover" />
            </div>
            <div className="p-4">
              <p className="text-xs text-clay-700">
                {new Date(post.published_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}
              </p>
              <h2 className="mt-1 font-semibold group-hover:text-saffron-700">{post.title}</h2>
              {post.excerpt && <p className="clamp-2 mt-1 text-sm text-clay-700">{post.excerpt}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
