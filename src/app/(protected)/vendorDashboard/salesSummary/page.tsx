import SalesData from "./SalesData";

export default function salesSummaryTable() {
    return (
        <div className="w-full p-4 md:p-6">
            {/* <h2 className="text-3xl text-primary my-6 font-medium">
                Sales <span className="text-secondary">Overview</span>
            </h2> */}
            <SalesData />

        </div>
    )
}
