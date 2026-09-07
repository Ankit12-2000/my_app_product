import { requireAdmin } from "@/lib/auth";
import { listCategoriesAdmin, listMaterialsAdmin } from "@/lib/data/admin";
import { createMaterial, deleteCategory, deleteMaterial } from "@/app/actions/admin";
import { CategoryForm } from "@/components/admin/CategoryForm";
import {
  ActionButton,
  Button,
  Card,
  CardHeader,
  PageHeader,
  inputClass,
} from "@/components/admin/ui";
import { IconPlus, IconTrash } from "@/components/admin/icons";

function TaxonomyRow({
  name,
  slug,
  id,
  action,
}: {
  name: string;
  slug: string;
  id: string;
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <li className="group flex items-center justify-between gap-3 px-5 py-2.5 transition-colors hover:bg-clay-50/70">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-clay-900">{name}</p>
        <p className="truncate font-mono text-xs text-clay-400">/{slug}</p>
      </div>
      <ActionButton
        action={action}
        fields={{ id }}
        variant="ghost"
        size="icon"
        title={`Delete ${name}`}
        className="opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100 hover:bg-rose-50 hover:text-rose-600"
      >
        <IconTrash className="h-4 w-4" />
        <span className="sr-only">Delete {name}</span>
      </ActionButton>
    </li>
  );
}

export default async function TaxonomyPage() {
  await requireAdmin();
  const [categories, materials] = await Promise.all([listCategoriesAdmin(), listMaterialsAdmin()]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories & Materials"
        description="The taxonomy vendors pick from when listing a product. Changes apply across the whole catalogue."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader title="Categories" description={`${categories.length} in use`} />
          {categories.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-clay-500">No categories yet.</p>
          ) : (
            <ul className="divide-y divide-clay-100">
              {categories.map((c) => (
                <TaxonomyRow key={c.id} id={c.id} name={c.name} slug={c.slug} action={deleteCategory} />
              ))}
            </ul>
          )}
          <div className="mt-auto border-t border-clay-200/70 bg-clay-50/50 p-5">
            <CategoryForm />
          </div>
        </Card>

        <Card className="flex flex-col">
          <CardHeader title="Materials" description={`${materials.length} in use`} />
          {materials.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-clay-500">No materials yet.</p>
          ) : (
            <ul className="divide-y divide-clay-100">
              {materials.map((m) => (
                <TaxonomyRow key={m.id} id={m.id} name={m.name} slug={m.slug} action={deleteMaterial} />
              ))}
            </ul>
          )}
          <div className="mt-auto border-t border-clay-200/70 bg-clay-50/50 p-5">
            <p className="mb-2 text-xs font-semibold text-clay-600">Add a material</p>
            <form action={createMaterial} className="flex gap-2">
              <input
                name="name"
                placeholder="e.g. White Makrana Marble"
                required
                className={inputClass}
              />
              <Button variant="brand" size="md" className="shrink-0">
                <IconPlus className="h-4 w-4" />
                Add
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
