import { requireAdmin } from "@/lib/auth";
import { listCategoriesAdmin, listMaterialsAdmin } from "@/lib/data/admin";
import {
  createCategory,
  createMaterial,
  deleteCategory,
  deleteMaterial,
} from "@/app/actions/admin";

export default async function TaxonomyPage() {
  await requireAdmin();
  const [categories, materials] = await Promise.all([
    listCategoriesAdmin(),
    listMaterialsAdmin(),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Categories &amp; Materials</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Categories */}
        <section className="rounded-2xl border border-clay-100 bg-white p-5">
          <h2 className="font-bold">Categories ({categories.length})</h2>
          <ul className="mt-3 divide-y divide-clay-100">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-clay-700">/{c.slug}</p>
                </div>
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={c.id} />
                  <button className="text-xs font-medium text-red-600 hover:underline">Delete</button>
                </form>
              </li>
            ))}
          </ul>
          <form action={createCategory} className="mt-4 space-y-2 border-t border-clay-100 pt-4">
            <input name="name" placeholder="Category name *" required
              className="w-full rounded-lg border border-clay-100 px-3 py-2 text-sm outline-none focus:border-saffron-400" />
            <input name="description" placeholder="Description"
              className="w-full rounded-lg border border-clay-100 px-3 py-2 text-sm outline-none focus:border-saffron-400" />
            <input name="image_url" placeholder="Image URL"
              className="w-full rounded-lg border border-clay-100 px-3 py-2 text-sm outline-none focus:border-saffron-400" />
            <button className="rounded-full bg-saffron-600 px-4 py-2 text-sm font-semibold text-white hover:bg-saffron-700">
              Add category
            </button>
          </form>
        </section>

        {/* Materials */}
        <section className="rounded-2xl border border-clay-100 bg-white p-5">
          <h2 className="font-bold">Materials ({materials.length})</h2>
          <ul className="mt-3 divide-y divide-clay-100">
            {materials.map((m) => (
              <li key={m.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-clay-700">/{m.slug}</p>
                </div>
                <form action={deleteMaterial}>
                  <input type="hidden" name="id" value={m.id} />
                  <button className="text-xs font-medium text-red-600 hover:underline">Delete</button>
                </form>
              </li>
            ))}
          </ul>
          <form action={createMaterial} className="mt-4 flex gap-2 border-t border-clay-100 pt-4">
            <input name="name" placeholder="Material name *" required
              className="flex-1 rounded-lg border border-clay-100 px-3 py-2 text-sm outline-none focus:border-saffron-400" />
            <button className="rounded-full bg-saffron-600 px-4 py-2 text-sm font-semibold text-white hover:bg-saffron-700">
              Add
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
