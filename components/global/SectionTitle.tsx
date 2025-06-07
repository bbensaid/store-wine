import { Separator } from "@/components/ui/separator";

function SectionTitle({ text }: { text: string }) {
  return (
    <div>
      <h2 className="text-xl font-medium tracking-wider capitalize mb-2 text-[#8B0015]">
        {text}
      </h2>
      <Separator />
    </div>
  );
}
export default SectionTitle;
