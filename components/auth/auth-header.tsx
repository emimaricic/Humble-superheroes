import { cn } from "@/lib/utils";
import Link from "next/link";

interface AuthHeaderProps {
  title: string;
  description: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  description,
}) => {
  return (
    <div>
      <Link
        href={"/auth"}
        className={cn(
          "mb-[30px] flex items-center gap-x-2 md:mb-[48px] lg:mb-[54px]",
        )}
      >
        <h1 className="text-lg font-normal md:text-3xl">
          e<b className="font-semibold">Jam</b>
        </h1>
      </Link>
      <div className="mb-6 space-y-1 md:mb-8 md:space-y-3 lg:mb-[64px]">
        <h2 className="text-lg md:text-2xl">{title}</h2>
        <p className="text-sm text-muted-foreground md:text-base">
          {description}
        </p>
      </div>
    </div>
  );
};
