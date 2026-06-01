import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getPendingRestaurantById } from "@/lib/admin-web-restaurants";

type RestaurantDetailPageProps = {
	searchParams?: {
		restaurantId?: string;
	};
};

export default function Page({ searchParams }: RestaurantDetailPageProps) {
	const restaurantId = searchParams?.restaurantId ?? "";
	const restaurant = getPendingRestaurantById(restaurantId);

	if (!restaurant) {
		notFound();
	}

	return (
		<main className="min-h-screen bg-background px-6 py-8 text-foreground md:px-10 md:py-10">
			<div className="mx-auto w-full max-w-5xl space-y-6">
				<div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
					<div>
						<p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
							Pending Restaurant Detail
						</p>
						<h1 className="mt-2 text-3xl font-semibold">
							{restaurant.restaurantName}
						</h1>
						<p className="mt-1 text-sm text-muted-foreground">
							Detail lengkap data restoran yang masih menunggu approval.
						</p>
					</div>

					<div className="flex flex-wrap gap-3">
						<Button variant="outline" asChild>
							<Link href="/dashboard/admin-web/restaurants">Kembali</Link>
						</Button>
						<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
							Approve Restaurant
						</Button>
					</div>
				</div>

				<div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
					<Card className="border border-border">
						<CardHeader>
							<CardTitle>Data Registrasi</CardTitle>
							<CardDescription>
								Data ini disamakan dengan form daftar pemilik resto.
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4 sm:grid-cols-2">
							<DetailField label="Nama Pemilik" value={restaurant.ownerName} />
							<DetailField label="Email" value={restaurant.email} />
							<DetailField label="Password" value={restaurant.password} />
							<DetailField label="Nama Restoran" value={restaurant.restaurantName} />
							<DetailField label="Kategori" value={restaurant.category} />
							<DetailField label="Status" value={restaurant.status} />
							<DetailField label="Latitude" value={restaurant.latitude} />
							<DetailField label="Longitude" value={restaurant.longitude} />
							<DetailField
								label="Alamat Restoran"
								value={restaurant.address}
								className="sm:col-span-2"
							/>
							<DetailField
								label="Foto Legalitas"
								value={restaurant.legalPhoto}
								className="sm:col-span-2"
							/>
						</CardContent>
					</Card>

					<Card className="border border-border">
						<CardHeader>
							<CardTitle>Ringkasan</CardTitle>
							<CardDescription>
								Informasi singkat untuk review cepat.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3 text-sm">
							<div className="rounded-xl border border-border/60 bg-background p-4">
								<p className="text-xs uppercase tracking-wide text-muted-foreground">
									Approval state
								</p>
								<p className="mt-1 font-semibold text-foreground">{restaurant.status}</p>
							</div>
							<div className="rounded-xl border border-border/60 bg-background p-4">
								<p className="text-xs uppercase tracking-wide text-muted-foreground">
									Lokasi
								</p>
								<p className="mt-1 font-semibold text-foreground">{restaurant.address}</p>
								<p className="mt-1 text-muted-foreground">
									{restaurant.latitude}, {restaurant.longitude}
								</p>
							</div>
							<div className="rounded-xl border border-border/60 bg-background p-4">
								<p className="text-xs uppercase tracking-wide text-muted-foreground">
									Legalitas
								</p>
								<p className="mt-1 wrap-break-word text-muted-foreground">
									{restaurant.legalPhoto}
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</main>
	);
}

function DetailField({
	label,
	value,
	className = "",
}: {
	label: string;
	value: string;
	className?: string;
}) {
	return (
		<div className={`space-y-1 rounded-xl border border-border/60 bg-background p-4 ${className}`}>
			<p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
			<p className="wrap-break-word text-sm font-medium text-foreground">{value}</p>
		</div>
	);
}
