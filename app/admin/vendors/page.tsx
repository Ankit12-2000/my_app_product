import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listAllShops } from "@/lib/data/admin";
import { setShopApproval, setShopFeatured } from "@/app/actions/admin";
import { VendorForm } from "@/components/admin/VendorForm";
import { Thumb } from "@/components/Thumb";
import { isRealImage } from "@/lib/images";
import {
  ActionButton,
  Avatar,
  Badge,
  Card,
  CardHeader,
  EmptyState,
  PageHeader,
  Table,
  Td,
  Th,
  Tr,
} from "@/components/admin/ui";
import { IconCheck, IconStar, IconStore, IconUndo } from "@/components/admin/icons";

export default async function AdminVendorsPage() {
  await requireAdmin();
  const shops = await listAllShops();

  const approved = shops.filter((s) => s.is_approved).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendors"
        description="Create new vendors, approve shops to make them public, and feature the best ones."
      />

      <VendorForm />

      <Card>
        <CardHeader
          title="All vendors"
          description={`${shops.length} total · ${approved} approved · ${shops.length - approved} pending`}
        />
        {shops.length === 0 ? (
          <EmptyState
            icon={<IconStore className="h-5 w-5" />}
            title="No vendors yet"
            description="Create your first vendor with the form above."
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Shop</Th>
                <Th className="hidden sm:table-cell">Location</Th>
                <Th>Status</Th>
                <Th className="w-16 text-center">Featured</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {shops.map((s) => (
                <Tr key={s.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      {isRealImage(s.logo_url) ? (
                        <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-clay-100 ring-1 ring-clay-200/70">
                          <Thumb
                            src={s.logo_url}
                            alt={s.name}
                            seed={s.slug}
                            width={36}
                            height={36}
                            className="h-9 w-9 object-cover"
                          />
                        </span>
                      ) : (
                        <Avatar name={s.name} />
                      )}
                      <div className="min-w-0">
                        <Link
                          href={`/admin/vendors/${s.id}`}
                          className="block truncate font-medium text-clay-900 transition hover:text-saffron-700"
                        >
                          {s.name}
                        </Link>
                        <span className="block truncate text-xs text-clay-400">
                          {s.phone ?? s.email ?? "No contact"}
                        </span>
                      </div>
                    </div>
                  </Td>
                  <Td className="hidden text-clay-600 sm:table-cell">
                    {[s.city, s.state].filter(Boolean).join(", ") || "—"}
                  </Td>
                  <Td>
                    <Badge tone={s.is_approved ? "success" : "warning"} dot>
                      {s.is_approved ? "Approved" : "Pending"}
                    </Badge>
                  </Td>
                  <Td className="text-center">
                    <ActionButton
                      action={setShopFeatured}
                      fields={{ id: s.id, featured: (!s.is_featured).toString() }}
                      variant="ghost"
                      size="icon"
                      title={s.is_featured ? "Remove from featured" : "Mark as featured"}
                      className={s.is_featured ? "text-saffron-500 hover:text-saffron-600" : "text-clay-300"}
                    >
                      <IconStar className="h-[18px] w-[18px]" filled={s.is_featured} />
                      <span className="sr-only">{s.is_featured ? "Unfeature" : "Feature"}</span>
                    </ActionButton>
                  </Td>
                  <Td>
                    <div className="flex items-center justify-end gap-1.5">
                      <ActionButton
                        action={setShopApproval}
                        fields={{ id: s.id, approve: (!s.is_approved).toString() }}
                        variant={s.is_approved ? "secondary" : "success"}
                      >
                        {s.is_approved ? (
                          <IconUndo className="h-3.5 w-3.5" />
                        ) : (
                          <IconCheck className="h-3.5 w-3.5" />
                        )}
                        {s.is_approved ? "Unapprove" : "Approve"}
                      </ActionButton>
                      <Link
                        href={`/admin/vendors/${s.id}`}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-clay-500 transition hover:bg-clay-100 hover:text-clay-900"
                      >
                        Detail
                      </Link>
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
