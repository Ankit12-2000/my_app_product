import Link from "next/link";
import { notFound } from "next/navigation";
import { requireVendorShop } from "@/lib/auth";
import { getQuotation } from "@/lib/data/vendor";
import { QuotationBuilder } from "@/components/vendor/QuotationBuilder";

export default async function QuotationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { shop } = await requireVendorShop();
  const { id } = await params;
  const quotation = await getQuotation(shop.id, id);
  if (!quotation) notFound();

  return (
    <div className="space-y-5">
      <Link
        href="/vendor/quotations"
        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-saffron-700 transition hover:bg-saffron-50 print:hidden"
      >
        ← Back to quotations
      </Link>
      <QuotationBuilder quotation={quotation} shop={shop} />
    </div>
  );
}
