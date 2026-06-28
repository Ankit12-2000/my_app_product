import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getBlogAdmin } from "@/lib/data/admin";
import { updateBlog } from "@/app/actions/admin";
import { BlogForm } from "@/components/admin/BlogForm";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const post = await getBlogAdmin(id);
  if (!post) notFound();

  return (
    <div className="max-w-3xl space-y-4">
      <Link href="/admin/blogs" className="text-sm text-saffron-700 hover:underline">← Back to blog</Link>
      <h1 className="text-2xl font-bold">Edit blog post</h1>
      <div className="rounded-2xl border border-clay-100 bg-white p-6">
        <BlogForm action={updateBlog} post={post} submitLabel="Save changes" />
      </div>
    </div>
  );
}
