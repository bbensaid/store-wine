import { Separator } from "@/components/ui/separator";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

function SectionTitle({ text }: { text: string }) {
  return (
    <div>
      <h2
        className={`${cinzel.className} text-xl sm:text-2xl text-primary tracking-[.1em] font-bold mb-2`}
      >
        {text}
      </h2>
      <Separator className="mb-8" />
    </div>
  );
}

export default SectionTitle;
