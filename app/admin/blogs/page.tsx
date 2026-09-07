import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listBlogsAdmin } from "@/lib/data/admin";
import { deleteBlog } from "@/app/actions/admin";
import {
  ActionButton,
  ButtonLink,
  Card,
  CardHeader,
  EmptyState,
  PageHeader,
  Table,
  Td,
  Th,
  Tr,
} from "@/components/admin/ui";
import { IconArticle, IconPlus, IconTrash } from "@/components/admin/icons";

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default async function AdminBlogsPage() {
  await requireAdmin();
  const posts = await listBlogsAdmin();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog / CMS"
        description="Long-form content for the public site — buying guides, artisan stories and care tips."
        actions={
          <ButtonLink href="/admin/blogs/new" variant="brand" size="md">
            <IconPlus className="h-4 w-4" />
            New post
          </ButtonLink>
        }
      />

      <Card>
        <CardHeader title="All posts" description={`${posts.length} published or drafted`} />
        {posts.length === 0 ? (
          <EmptyState
            icon={<IconArticle className="h-5 w-5" />}
            title="No blog posts yet"
            description="Write your first post to start building organic search traffic."
            action={
              <ButtonLink href="/admin/blogs/new" variant="brand" size="md">
                <IconPlus className="h-4 w-4" />
                New post
              </ButtonLink>
            }
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Title</Th>
                <Th className="hidden sm:table-cell">Author</Th>
                <Th className="hidden sm:table-cell">Published</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <Tr key={p.id}>
                  <Td>
                    <Link
                      href={`/admin/blogs/${p.id}/edit`}
                      className="font-medium text-clay-900 transition hover:text-saffron-700"
                    >
                      {p.title}
                    </Link>
                    {p.excerpt && (
                      <p className="mt-0.5 line-clamp-1 max-w-md text-xs text-clay-400">{p.excerpt}</p>
                    )}
                  </Td>
                  <Td className="hidden text-clay-600 sm:table-cell">{p.author ?? "—"}</Td>
                  <Td className="hidden whitespace-nowrap text-clay-600 sm:table-cell">
                    {dateFmt.format(new Date(p.published_at))}
                  </Td>
                  <Td>
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/blogs/${p.id}/edit`}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-clay-600 transition hover:bg-clay-100 hover:text-clay-900"
                      >
                        Edit
                      </Link>
                      <ActionButton
                        action={deleteBlog}
                        fields={{ id: p.id }}
                        variant="ghost"
                        size="icon"
                        title={`Delete "${p.title}"`}
                        className="hover:bg-rose-50 hover:text-rose-600"
                      >
                        <IconTrash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </ActionButton>
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
