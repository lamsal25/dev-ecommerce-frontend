import React, { useState, useTransition } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { FcAcceptDatabase } from "react-icons/fc";
import { MdDeleteOutline } from "react-icons/md";
import { approveMarketPlace } from '@/app/(protected)/actions/product';

export default function PendingAccept({id}:{id:any}) {
  const [isOpen,setIsOpen]= useState<boolean>(false)
      const [_,startTransition]= useTransition()
      const handleDelete=()=>{
          startTransition(async()=>{
              const response= await approveMarketPlace(id)
              setIsOpen(false)
          })
      }
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen} >
      <DialogTrigger asChild>
          <span className="flex text-green-500 cursor-default select-none items-center gap-1 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
             <FcAcceptDatabase/>
            <p>Accept</p>
          </span>
        </DialogTrigger>   <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
           This will accept the particular marketplace product.
          </DialogDescription>
        </DialogHeader>
        <Button onClick={handleDelete}>Yes</Button>
      </DialogContent>
    </Dialog>
    )
}
