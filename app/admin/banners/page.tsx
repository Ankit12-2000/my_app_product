import { requireAdmin } from "@/lib/auth";
import { listBannersAdmin } from "@/lib/data/admin";
import { createBanner, deleteBanner } from "@/app/actions/admin";
import { Thumb } from "@/components/Thumb";
import {
  ActionButton,
  Button,
  Card,
  CardHeader,
  EmptyState,
  Field,
  PageHeader,
  inputClass,
} from "@/components/admin/ui";
import { IconImage, IconPlus, IconTrash } from "@/components/admin/icons";

export default async function AdminBannersPage() {
  await requireAdmin();
  const banners = await listBannersAdmin();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Homepage Banners"
        description="The rotating hero slides on the public homepage, shown in sort order."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader title="Live banners" description={`${banners.length} in rotation`} />
          {banners.length === 0 ? (
            <EmptyState
              icon={<IconImage className="h-5 w-5" />}
              title="No banners yet"
              description="Add your first banner using the form to fill the homepage hero."
            />
          ) : (
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              {banners.map((b, i) => (
                <div
                  key={b.id}
                  className="group overflow-hidden rounded-xl border border-clay-200/70 bg-white transition hover:border-clay-300 hover:shadow-[0_4px_12px_rgba(var(--shadow-tint),0.07)]"
                >
                  <div className="relative aspect-[3/1] bg-clay-100">
                    <Thumb
                      src={b.image_url}
                      alt={b.title}
                      seed={b.id}
                      icon={null}
                      fill
                      sizes="400px"
                      className="object-cover"
                    />
                    <span className="absolute left-2 top-2 rounded bg-clay-900/75 px-1.5 py-0.5 text-[10px] font-bold text-white tabular backdrop-blur-sm">
                      #{i + 1}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-2 p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-clay-900">{b.title}</p>
                      {b.subtitle && (
                        <p className="truncate text-xs text-clay-500">{b.subtitle}</p>
                      )}
                    </div>
                    <ActionButton
                      action={deleteBanner}
                      fields={{ id: b.id }}
                      variant="ghost"
                      size="icon"
                      title={`Delete "${b.title}"`}
                      confirm={`Remove the “${b.title}” banner from the homepage?`}
                      className="shrink-0 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <IconTrash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </ActionButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="h-fit lg:sticky lg:top-[76px]">
          <CardHeader title="Add banner" description="Appears immediately on the homepage." />
          <form action={createBanner} className="space-y-4 p-5">
            <Field label="Title" required>
              <input name="title" placeholder="Handcrafted marble moortis" required className={inputClass} />
            </Field>
            <Field label="Subtitle">
              <input name="subtitle" placeholder="Direct from Jaipur artisans" className={inputClass} />
            </Field>
            <Field label="Image URL" required hint="Use a wide 3:1 image for the best fit.">
              <input name="image_url" placeholder="https://…" required className={inputClass} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Link URL">
                <input name="link_url" placeholder="/search" className={inputClass} />
              </Field>
              <Field label="Sort order">
                <input name="sort_order" type="number" defaultValue={0} className={inputClass} />
              </Field>
            </div>
            <Button variant="brand" size="md" className="w-full justify-center">
              <IconPlus className="h-4 w-4" />
              Add banner
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
