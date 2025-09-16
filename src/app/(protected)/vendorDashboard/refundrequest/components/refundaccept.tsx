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
import { MdCheckCircle } from "react-icons/md";
import { useState, useTransition } from "react";

interface RefundAcceptProps {
  id: string; // Refund request ID
}

export default function RefundAccept({ id }: RefundAcceptProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [_, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  const handleAccept = () => {
    startTransition(async () => {
      setLoading(true);
      const response = await updateRefundStatus(Number(id), { status: "approved" });
      setLoading(false);
      setIsOpen(false);

      if (!response.error) {
        alert(`Refund request has been accepted successfully`);
      } else {
        alert(`Failed to accept refund: ${response.error}`);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <span className="flex text-green-500 cursor-pointer select-none items-center gap-1 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:text-accent-foreground">
          <MdCheckCircle className="text-lg"/>
          <p>Accept Refund</p>
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Refund Acceptance</DialogTitle>
          <DialogDescription>
            Are you sure you want to accept this refund request? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <Button onClick={handleAccept} disabled={loading}>
          {loading ? "Accepting..." : "Yes, Accept"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
