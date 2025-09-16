
import { getMarketPlaceProductByUser } from "@/app/(protected)/actions/product";
import { MarketDataTable } from "./components/marketdatatable";

export const dynamic = 'force-dynamic'

export default async function Page() {
  const response = await getMarketPlaceProductByUser();
  const data = response.data || [];
  console.log("Marketplace Products Data:", data);

  return (
    <div className="container mx-auto space-y-8">
      <h2 className="text-xl">
        Manage MarketPlaceProduct <span className="text-primary">Here.</span>
      </h2>
      <MarketDataTable data={data} />
    </div>
  );
}