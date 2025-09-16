"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { MdDeleteOutline } from "react-icons/md";
import { useState, useTransition } from 'react'
import { deleteMarketPlaceProduct } from "@/app/(protected)/actions/product";

export default function MarketPlaceDelete({id}:{
    id:string,
 }) {
    const [isOpen,setIsOpen]= useState<boolean>(false)
    const [_,startTransition]= useTransition()
    const handleDelete=()=>{
        startTransition(async()=>{
            const response= await deleteMarketPlaceProduct(id)
            setIsOpen(false)
        })
    }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} >
    <DialogTrigger asChild>
        <span className="flex text-red-500 cursor-default select-none items-center gap-1 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
           <MdDeleteOutline className="text-lg"/>
          <p>Delete</p>
        </span>
      </DialogTrigger>    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete
          and remove your data from our servers.
        </DialogDescription>
      </DialogHeader>
      <Button onClick={handleDelete}>Yes</Button>
    </DialogContent>
  </Dialog>
  )
}
