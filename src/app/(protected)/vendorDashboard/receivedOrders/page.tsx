
import ReceivedOrdersTableContent from './ReceivedOrderTableContent'
 
export default function ReceivedOrdersTable() {
  return (
    <div className="w-full p-4 md:p-6">
      <h2 className="text-3xl text-primary my-6 font-medium">
        Received <span className="text-secondary">Orders</span>
      </h2>

         <ReceivedOrdersTableContent />
     
    </div>
  )
}
