import { requireAdmin } from "@/lib/auth";
import { listBannersAdmin } from "@/lib/data/admin";
import { createBanner, deleteBanner } from "@/app/actions/admin";
import { Thumb } from "@/components/Thumb";

export default async function AdminBannersPage() {
  await requireAdmin();
  const banners = await listBannersAdmin();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Homepage Banners</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        {banners.map((b) => (
          <div key={b.id} className="overflow-hidden rounded-2xl border border-clay-100 bg-white">
            <div className="relative aspect-[3/1] bg-clay-100">
              <Thumb src={b.image_url} alt={b.title} seed={b.id} icon="🖼️" fill sizes="400px" className="object-cover" />
            </div>
            <div className="flex items-center justify-between p-3">
              <div>
                <p className="font-medium">{b.title}</p>
                {b.subtitle && <p className="text-xs text-clay-700">{b.subtitle}</p>}
              </div>
              <form action={deleteBanner}>
                <input type="hidden" name="id" value={b.id} />
                <button className="text-xs font-medium text-red-600 hover:underline">Delete</button>
              </form>
            </div>
          </div>
        ))}
        {banners.length === 0 && <p className="text-clay-700">No banners yet.</p>}
      </div>

      <section className="max-w-xl rounded-2xl border border-clay-100 bg-white p-5">
        <h2 className="font-bold">Add banner</h2>
        <form action={createBanner} className="mt-3 space-y-2">
          <input name="title" placeholder="Title *" required
            className="w-full rounded-lg border border-clay-100 px-3 py-2 text-sm outline-none focus:border-saffron-400" />
          <input name="subtitle" placeholder="Subtitle"
            className="w-full rounded-lg border border-clay-100 px-3 py-2 text-sm outline-none focus:border-saffron-400" />
          <input name="image_url" placeholder="Image URL *" required
            className="w-full rounded-lg border border-clay-100 px-3 py-2 text-sm outline-none focus:border-saffron-400" />
          <div className="grid grid-cols-2 gap-2">
            <input name="link_url" placeholder="Link URL (e.g. /search)"
              className="rounded-lg border border-clay-100 px-3 py-2 text-sm outline-none focus:border-saffron-400" />
            <input name="sort_order" type="number" defaultValue={0} placeholder="Sort order"
              className="rounded-lg border border-clay-100 px-3 py-2 text-sm outline-none focus:border-saffron-400" />
          </div>
          <button className="rounded-full bg-saffron-600 px-4 py-2 text-sm font-semibold text-white hover:bg-saffron-700">
            Add banner
          </button>
        </form>
      </section>
    </div>
  );
}
