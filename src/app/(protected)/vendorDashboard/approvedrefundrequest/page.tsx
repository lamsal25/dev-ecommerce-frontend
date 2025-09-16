import { getApprovedRefundRequestByVendor, getRefundRequestByVendor } from "../../actions/refund";
import { ApprovedRefundsDataTable } from "./components/approvedrefundatatable";


export const dynamic = 'force-dynamic';

export default async function Page() {
    const response = await getApprovedRefundRequestByVendor()
    const data = response.data
    console.log(data)
    const dataArray = Array.isArray(data) ? data : [data];

  
  

  return (
    <div className="container mx-auto space-y-8">
        <h2 className="text-xl">Refund<span className="text-primary"> Requests</span></h2>
            <ApprovedRefundsDataTable data={dataArray}/>
    </div>  
  )
  
  ;
}
