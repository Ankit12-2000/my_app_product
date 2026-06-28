import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createBlog } from "@/app/actions/admin";
import { BlogForm } from "@/components/admin/BlogForm";

export default async function NewBlogPage() {
  await requireAdmin();
  return (
    <div className="max-w-3xl space-y-4">
      <Link href="/admin/blogs" className="text-sm text-saffron-700 hover:underline">← Back to blog</Link>
      <h1 className="text-2xl font-bold">New blog post</h1>
      <div className="rounded-2xl border border-clay-100 bg-white p-6">
        <BlogForm action={createBlog} submitLabel="Publish post" />
      </div>
    </div>
  );
}
