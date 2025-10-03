"use client"
import Image from "next/image";
import Button from "../components/Button";
import { useRouter, useSearchParams } from "next/navigation";

const SuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams?.get("email");
  const displayEmail = emailParam || "your email";

  return (
    <div className="h-full flex justify-center p-4">
      <div className="max-w-sm w-full rounded-2xl p-8 flex flex-col items-center text-center">
        <div className="w-56 h-56 mb-6 relative bg-[#FEE2654D] p-10 rounded-2xl">
          <Image
            src="/images/SuccessImg.png"
            alt="Check your inbox"
            height={188}
            width={200}
            className="object-contain rounded-2xl"
            priority
          />
        </div>

        <h1 className="text-2xl font-semibold text-[#C4CDCA] mb-2">Check your Inbox</h1>
        <p className="text-sm text-[#B3BEBA] mb-8">
          We have just emailed you the instructions and a reset password link to {displayEmail}. It might take a few minutes to arrive.
        </p>

        <Button
          type="button"
          className="w-full font-semibold"
          variant="primary"
          size="md"
          onClick={() => router.push("/login")}
        >
          Back to sign in
        </Button>
      </div>
    </div>
  );
};

export default SuccessPage;


