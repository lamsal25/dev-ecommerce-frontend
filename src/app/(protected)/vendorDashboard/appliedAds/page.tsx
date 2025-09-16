
import AdsTableContent from './AdsTableContent'
  

export default function AppliedAdsTable() {
  return (
    <div className="w-full">
      <h2 className="text-3xl text-primary my-6 font-medium">
        Applied <span className="text-secondary">Advertisements</span>
      </h2>

         <AdsTableContent />
    
    </div>
  )
}
