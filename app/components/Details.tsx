import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
  return (
      <div
          className={cn(
              "flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]",
              score > 69
                  ? "bg-badge-green"
                  : score > 39
                      ? "bg-badge-yellow"
                      : "bg-badge-red"
          )}
      >
        <img
            src={score > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
            alt="score"
            className="size-4"
        />
        <p
            className={cn(
                "text-sm font-medium",
                score > 69
                    ? "text-badge-green-text"
                    : score > 39
                        ? "text-badge-yellow-text"
                        : "text-badge-red-text"
            )}
        >
          {score}/100
        </p>
      </div>
  );
};

const CategoryHeader = ({
                          title,
                          categoryScore,
                        }: {
  title: string;
  categoryScore: number;
}) => {
  return (
      <div className="flex flex-row gap-4 items-center py-2">
        <p className="text-2xl font-semibold">{title}</p>
        <ScoreBadge score={categoryScore} />
      </div>
  );
};

const CategoryContent = ({ tips }: { tips: { type: "good" | "improve"; tip: string; explanation: string }[]; }) => {
  return (
      <div className="flex flex-col gap-4 sm:gap-6 w-full">
        <div className="bg-gray-50/50 backdrop-blur-sm border border-gray-100 w-full rounded-2xl p-3 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {tips.map((tip, index) => (
              <div className="flex flex-row gap-2 sm:gap-3 items-start" key={index}>
                <img src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"} alt="icon" className="w-4 h-4 sm:w-5 sm:h-5 mt-1 flex-shrink-0" />
                {/* Perkecil font untuk judul tip pendek */}
                <p className="text-sm sm:text-lg text-gray-600 font-medium leading-snug">{tip.tip}</p>
              </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:gap-4 w-full">
          {tips.map((tip, index) => (
              <div key={index + tip.tip} className={cn(
                  "flex flex-col gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl p-3 sm:p-5 transition-transform hover:-translate-y-1",
                  tip.type === "good" ? "bg-green-50/80 border border-green-200 text-green-800" : "bg-yellow-50/80 border border-yellow-200 text-yellow-800"
              )}>
                <div className="flex flex-row gap-2 sm:gap-3 items-start sm:items-center mb-1">
                  <img src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"} alt="icon" className="w-4 h-4 sm:w-6 sm:h-6 mt-0.5 sm:mt-0" />
                  <p className="text-base sm:text-xl font-bold leading-tight">{tip.tip}</p>
                </div>
                {/* Perkecil font untuk paragraf deskripsi */}
                <p className="text-xs sm:text-base opacity-90 leading-relaxed ml-6 sm:ml-9">{tip.explanation}</p>
              </div>
          ))}
        </div>
      </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
      <div className="flex flex-col gap-4 w-full">
        <Accordion>
          <AccordionItem id="tone-style" className="">
            <AccordionHeader itemId="tone-style">
              <CategoryHeader
                  title="Tone & Style"
                  categoryScore={feedback.toneAndStyle.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="tone-style">
              <CategoryContent tips={feedback.toneAndStyle.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="content" className="">
            <AccordionHeader itemId="content">
              <CategoryHeader
                  title="Content"
                  categoryScore={feedback.content.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="content">
              <CategoryContent tips={feedback.content.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="structure" className="">
            <AccordionHeader itemId="structure">
              <CategoryHeader
                  title="Structure"
                  categoryScore={feedback.structure.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="structure">
              <CategoryContent tips={feedback.structure.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="skills" className="">
            <AccordionHeader itemId="skills">
              <CategoryHeader
                  title="Skills"
                  categoryScore={feedback.skills.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="skills">
              <CategoryContent tips={feedback.skills.tips} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
  );
};

export default Details;