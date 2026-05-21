import { cn } from "~/lib/utils";

const ScoreBadge = ({ score = 0 }: { score: number }) => {
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

export default ScoreBadge;