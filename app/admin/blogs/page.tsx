import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listBlogsAdmin } from "@/lib/data/admin";
import { deleteBlog } from "@/app/actions/admin";

export default async function AdminBlogsPage() {
  await requireAdmin();
  const posts = await listBlogsAdmin();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog / CMS</h1>
        <Link href="/admin/blogs/new" className="rounded-full bg-saffron-600 px-4 py-2 text-sm font-semibold text-white hover:bg-saffron-700">
          + New post
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-clay-100 bg-white">
        {posts.length === 0 ? (
          <p className="p-8 text-center text-clay-700">No blog posts yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-clay-50 text-left text-clay-700">
              <tr>
                <th className="px-4 py-2 font-medium">Title</th>
                <th className="hidden px-4 py-2 font-medium sm:table-cell">Author</th>
                <th className="hidden px-4 py-2 font-medium sm:table-cell">Date</th>
                <th className="px-4 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-t border-clay-100 hover:bg-clay-50">
                  <td className="px-4 py-3 font-medium text-clay-900">{p.title}</td>
                  <td className="hidden px-4 py-3 text-clay-700 sm:table-cell">{p.author ?? "—"}</td>
                  <td className="hidden px-4 py-3 text-clay-700 sm:table-cell">
                    {new Date(p.published_at).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/blogs/${p.id}/edit`} className="text-xs font-medium text-saffron-700 hover:underline">
                        Edit
                      </Link>
                      <form action={deleteBlog}>
                        <input type="hidden" name="id" value={p.id} />
                        <button className="text-xs font-medium text-red-600 hover:underline">Delete</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
