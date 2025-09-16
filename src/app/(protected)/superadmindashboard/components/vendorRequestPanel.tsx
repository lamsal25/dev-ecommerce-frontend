'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'

type Vendor = {
  id: number
  shop_name: string
  phone_number: string
  address: string
  user: number
}

export default function VendorRequestPanel() {
  const [vendors, setVendors] = useState<Vendor[]>([])

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vendors/pending/`, {
          withCredentials: true,
        })
        setVendors(res.data)
      } catch (err) {
        toast.error('Failed to load vendors.')
      }
    }

    fetchVendors()
  }, [])

  const approve = async (id: number) => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vendors/approve/${id}/`, {}, {
        withCredentials: true,
      })
      setVendors((prev) => prev.filter((v) => v.id !== id))
      toast.success('Vendor approved')
    } catch {
      toast.error('Failed to approve vendor')
    }
  }

  return (
    <div className="space-y-4">
        
      {vendors.map((vendor) => (
        <div key={vendor.id} className="border p-4 rounded-md shadow-sm flex justify-between">
       
          <div>
            <h4 className="font-bold">{vendor.shop_name}</h4>
            <p>{vendor.phone_number}</p>
            <p>{vendor.address}</p>
          </div>
          <Button onClick={() => approve(vendor.id)}>Approve</Button>
        </div>
      ))}
    </div>
  )
}
