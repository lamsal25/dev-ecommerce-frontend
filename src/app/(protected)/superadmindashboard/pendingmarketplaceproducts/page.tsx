
import { getMarketPlaceProductByUser, getUnApprovedMarketplaceProducts } from "@/app/(protected)/actions/product";
import { PendingDataTable } from "./components/pendingdatatable";

export const dynamic = 'force-dynamic'

export default async function Page() {
  const response = await getUnApprovedMarketplaceProducts();
  const data = response.data || [];
  console.log("Pending Marketplace Products Data:", data);



  return (
    <div className="container mx-auto space-y-8">
      <h2 className="text-xl">
        Manage MarketPlaceProduct <span className="text-primary">Here.</span>
      </h2>
      <PendingDataTable data={data} />
    </div>
  );
}