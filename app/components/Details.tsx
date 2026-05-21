import { cn } from "~/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

// ✨ [BARU] Menyesuaikan warna badge untuk Dark Mode
const ScoreBadge = ({ score }: { score: number }) => {
  return (
      <div
          className={cn(
              "flex flex-row gap-1 items-center px-2.5 py-1 rounded-md border",
              score > 70
                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                  : score > 40
                      ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                      : "bg-red-500/10 border-red-500/20 text-red-400"
          )}
      >
        <p className="text-[10px] font-semibold tracking-wide uppercase">
          {score}/100 - {score > 70 ? "Strong" : score > 40 ? "Needs Work" : "Critical"}
        </p>
      </div>
  );
};

const CategoryHeader = ({ title, categoryScore }: { title: string; categoryScore: number }) => {
  return (
      <div className="flex flex-row gap-4 items-center py-1 w-full justify-between pr-2">
        <span className="text-sm font-semibold text-white">{title}</span>
        <ScoreBadge score={categoryScore} />
      </div>
  );
};

// ✨ [BARU] Menyesuaikan Card Tips dengan tema Dark Mode
const CategoryContent = ({ tips }: { tips: { type: "good" | "improve"; tip: string; explanation: string }[]; }) => {
  if (!tips || tips.length === 0) return <p className="text-gray-500 text-xs">No feedback available.</p>;

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-2 w-full">
        {tips.map((tip, index) => {
            const isGood = tip.type === "good";
            return (
                <div key={index} className={cn(
                    "p-3.5 rounded-lg flex flex-col gap-2 border transition-all",
                    isGood ? "bg-green-500/5 border-green-500/10" : "bg-red-500/5 border-red-500/10"
                )}>
                    <p className={cn(
                        "font-medium text-xs flex items-center gap-2",
                        isGood ? "text-green-400" : "text-red-400"
                    )}>
                        {isGood ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 shrink-0" />}
                        {tip.tip}
                    </p>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                        {tip.explanation}
                    </p>
                </div>
            )
        })}
      </div>
  );
};

const Details = ({ feedback }: { feedback: any }) => {
  // Cegah error jika feedback belum di-load
  if (!feedback) return null;

  return (
      <div className="flex flex-col gap-3 w-full">
        <Accordion allowMultiple={true} defaultOpen="tone-style">
          
          {feedback.toneAndStyle && (
              <AccordionItem id="tone-style" className="!bg-[#0A071A] !border-white/5 rounded-xl">
                <AccordionHeader itemId="tone-style">
                  <CategoryHeader title="Tone & Style" categoryScore={feedback.toneAndStyle.score || 0} />
                </AccordionHeader>
                <AccordionContent itemId="tone-style">
                  <CategoryContent tips={feedback.toneAndStyle.tips} />
                </AccordionContent>
              </AccordionItem>
          )}

          {feedback.content && (
              <AccordionItem id="content" className="!bg-[#0A071A] !border-white/5 rounded-xl">
                <AccordionHeader itemId="content">
                  <CategoryHeader title="Content & Impact" categoryScore={feedback.content.score || 0} />
                </AccordionHeader>
                <AccordionContent itemId="content">
                  <CategoryContent tips={feedback.content.tips} />
                </AccordionContent>
              </AccordionItem>
          )}

          {feedback.structure && (
              <AccordionItem id="structure" className="!bg-[#0A071A] !border-white/5 rounded-xl">
                <AccordionHeader itemId="structure">
                  <CategoryHeader title="Structure & Parsing" categoryScore={feedback.structure.score || 0} />
                </AccordionHeader>
                <AccordionContent itemId="structure">
                  <CategoryContent tips={feedback.structure.tips} />
                </AccordionContent>
              </AccordionItem>
          )}

          {feedback.skills && (
              <AccordionItem id="skills" className="!bg-[#0A071A] !border-white/5 rounded-xl">
                <AccordionHeader itemId="skills">
                  <CategoryHeader title="Skills & Keywords" categoryScore={feedback.skills.score || 0} />
                </AccordionHeader>
                <AccordionContent itemId="skills">
                  <CategoryContent tips={feedback.skills.tips} />
                </AccordionContent>
              </AccordionItem>
          )}
          
        </Accordion>
      </div>
  );
};

export default Details;