// app/verify-otp/[token]/page.tsx
import OTPForm from "@/components/otp-form";

interface PageProps {
  params: {
    token: string;
  };
}

export default async function VerifyOTPPage({ params }: PageProps) {
  const {token}= params
  return (
    <OTPForm token={token} />
  );
}