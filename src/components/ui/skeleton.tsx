import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div className={cn("animate-pulse rounded-lg bg-muted/60", className)} />
    );
}

export function QuizSkeleton() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-2xl space-y-6">
            <Skeleton className="h-4 w-48 mx-auto" />
            <Skeleton className="h-2 w-full" />
            <div className="rounded-xl border p-6 space-y-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-7 w-full" />
                <Skeleton className="h-5 w-3/4" />
            </div>
            <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
            </div>
        </div>
    );
}

export function CardGridSkeleton({ count = 10 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="rounded-xl border p-5 space-y-3">
                    <Skeleton className="h-14 w-14 rounded-xl mx-auto" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                    <Skeleton className="h-3 w-16 mx-auto" />
                </div>
            ))}
        </div>
    );
}

export function LeaderboardSkeleton() {
    return (
        <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                </div>
            ))}
        </div>
    );
}

export function ProfileSkeleton() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-2xl space-y-6">
            <div className="text-center space-y-3">
                <Skeleton className="h-20 w-20 rounded-full mx-auto" />
                <Skeleton className="h-6 w-40 mx-auto" />
                <Skeleton className="h-4 w-24 mx-auto" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="rounded-xl border p-4 space-y-2">
                        <Skeleton className="h-8 w-16 mx-auto" />
                        <Skeleton className="h-3 w-12 mx-auto" />
                    </div>
                ))}
            </div>
        </div>
    );
}
