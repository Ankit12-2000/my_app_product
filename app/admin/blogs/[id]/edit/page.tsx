import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getBlogAdmin } from "@/lib/data/admin";
import { updateBlog } from "@/app/actions/admin";
import { BlogForm } from "@/components/admin/BlogForm";
import { PageHeader } from "@/components/admin/ui";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const post = await getBlogAdmin(id);
  if (!post) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title="Edit blog post"
        description={post.title}
        backHref="/admin/blogs"
        backLabel="Back to blog"
      />
      <BlogForm action={updateBlog} post={post} submitLabel="Save changes" />
    </div>
  );
}
