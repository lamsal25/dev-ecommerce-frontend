"use client"

import { updateRefundStatus } from "@/app/(protected)/actions/refund";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MdCancel } from "react-icons/md";
import { useState, useTransition } from "react";

interface RefundDeclineProps {
  id: string; // Refund request ID
}

export default function RefundDecline({ id }: RefundDeclineProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [adminNotes, setAdminNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [_, startTransition] = useTransition();

  const handleDecline = () => {
    startTransition(async () => {
      setLoading(true);
      const response = await updateRefundStatus(Number(id), { 
        status: "rejected",
      });
      setLoading(false);
      setIsOpen(false);

      if (!response.error) {
        alert("Refund request has been declined successfully");
      } else {
        alert(`Failed to decline refund: ${response.error}`);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <span className="flex text-red-500 cursor-pointer select-none items-center gap-1 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:text-accent-foreground">
          <MdCancel className="text-lg"/>
          <p>Decline Refund</p>
        </span>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Refund Decline</DialogTitle>
          <DialogDescription>
            Are you sure you want to decline this refund request? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 mt-4">
          <label htmlFor="adminNotes" className="text-sm font-medium">
            Optional Notes (reason for decline)
          </label>
          <textarea
            id="adminNotes"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Enter notes for the customer..."
            className="w-full border rounded-md p-2"
            rows={3}
          />
        </div>

        <Button onClick={handleDecline} disabled={loading} className="mt-4">
          {loading ? "Declining..." : "Yes, Decline"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
