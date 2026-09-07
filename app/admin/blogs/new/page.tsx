import { requireAdmin } from "@/lib/auth";
import { createBlog } from "@/app/actions/admin";
import { BlogForm } from "@/components/admin/BlogForm";
import { PageHeader } from "@/components/admin/ui";

export default async function NewBlogPage() {
  await requireAdmin();
  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title="New blog post"
        description="Write once — it goes live on the public blog as soon as you publish."
        backHref="/admin/blogs"
        backLabel="Back to blog"
      />
      <BlogForm action={createBlog} submitLabel="Publish post" />
    </div>
  );
}
