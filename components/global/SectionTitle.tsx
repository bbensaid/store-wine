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
        className={`${cinzel.className} text-xl sm:text-2xl tracking-[.1em] font-medium mb-6`}
      >
        {text}
      </h2>
      <Separator />
    </div>
  );
}

export default SectionTitle;
