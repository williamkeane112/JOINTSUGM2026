
import { CheckCircle2 } from "lucide-react";

interface Props {
  objectives: string[];
}

export default function LearningObjectives({ objectives }: Props) {
  if (objectives.length === 0) return null;

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-gray-800">
        Target pembelajaran
      </h4>

      <ul className="mt-2 space-y-2">
        {objectives.map((objective, index) => (
          <li
            key={`${index}-${objective}`}
            className="flex items-start gap-2 text-sm text-gray-600"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <span>{objective}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
