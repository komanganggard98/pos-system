import { cn } from "@/lib/utils";

type InputWithIconType = {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; 
    InputComponent: React.ComponentType<React.ComponentProps<"input">>;
    position?: "left" | "right";
    className?: string
}
export default function InputWithIcon({
    icon: Icon, 
    InputComponent, 
    position = "left",
    className
}: InputWithIconType) {
    return (
        <div className={cn('relative', className)}>
            {Icon && (
                <div className={`pointer-events-none absolute inset-y-0 ${position === "left" ? "left-0" : "right-0"} flex items-center pl-3`}>
                    <Icon className="h-5 w-5 text-gray-400" />
                </div>
            )}

            <InputComponent className={position === "left" ? "pl-10" : "pr-10"} />
        </div>
    );
}
