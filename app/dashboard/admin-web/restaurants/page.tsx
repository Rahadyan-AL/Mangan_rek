import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { pendingRestaurants } from "@/lib/admin-web-restaurants";

export default function Page() {
	return (
		<main className="min-h-screen bg-background p-6 text-foreground md:p-10">
			<Card className="border border-border">
				<CardHeader className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
					<div>
						<CardTitle className="text-2xl">Restaurants Management</CardTitle>
						<CardDescription>
							Kelola daftar resto, status verifikasi, dan detail akun.
						</CardDescription>
					</div>
					<Link href="/dashboard/admin-web" className="text-sm text-primary hover:underline">
						Kembali ke overview
					</Link>
				</CardHeader>
				<CardContent className="space-y-4">
					{pendingRestaurants.map((item) => (
						<div
							key={item.id}
							className="flex flex-col gap-3 rounded-lg border border-border/60 bg-background px-4 py-3 md:flex-row md:items-center md:justify-between"
						>
							<div>
								<p className="font-semibold text-foreground">{item.restaurantName}</p>
								<p className="text-sm text-muted-foreground">
									{item.ownerName} · {item.category}
								</p>
							</div>
							<div className="flex items-center gap-3">
								<span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
									{item.status}
								</span>
								<Button size="sm" variant="outline" asChild>
									<Link href={`/dashboard/admin-web/restaurants-detail?restaurantId=${item.id}`}>Detail</Link>
								</Button>
							</div>
						</div>
					))}
				</CardContent>
			</Card>
		</main>
	);
}
