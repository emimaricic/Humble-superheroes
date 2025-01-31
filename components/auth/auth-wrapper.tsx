import Image from "next/image";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative mx-auto flex h-full max-w-[1772px] items-center px-5 py-[40px] md:gap-4 lg:gap-[80px]">
      <div className="absolute inset-0 md:hidden">
        <Image
          src={"/images/auth-bg.png"}
          fill
          alt="bg-image"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#101214E5]" />
      </div>
      <ScrollArea className="h-full w-full max-w-[582px] pr-4">
        {children}
      </ScrollArea>
      <div className="relative hidden h-full flex-1 overflow-hidden rounded-[40px] md:block">
        <Image src={"/images/auth-bg.png"} fill alt="bg-image" />
        <div className="absolute bottom-[40px] z-10 w-full space-y-4 px-[36px] xl:px-[70px]">
          <div className={cn("flex items-center gap-x-2")}>
            <h1 className="text-lg font-normal md:text-3xl">
              e<b className="font-semibold">Jam</b>
            </h1>
          </div>
          <p className="w-full text-3xl font-semibold xl:text-[64px] xl:leading-[72px]">
            Build your superheroes
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthWrapper;
