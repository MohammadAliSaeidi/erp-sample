import { PrismaClient } from "@/app/generated/prisma/client";
import { PermissionsArray } from "@/features/auth/domain/types/permission.type";
import { hash } from "@/features/shared/lib/utils/hash/hash";
import { PrismaPg } from "@prisma/adapter-pg";

const DEMO_PREFIX = "zzz-dev-"; 

async function main() {
	const adapter = new PrismaPg({
		connectionString: process.env.DATABASE_URL!,
	});

	const prisma = new PrismaClient({ adapter });

	console.log("🌱 Starting simple & forgiving seed...");

	try {
		// STORE (use slug as natural key)
		const store = await prisma.store.upsert({
			where: { slug: `${DEMO_PREFIX}hq` },
			update: {
				name: `${DEMO_PREFIX} Headquarter (updated)`,
			},
			create: {
				slug: `${DEMO_PREFIX}hq`,
				name: `${DEMO_PREFIX} Headquarter`,
				address: {
					create: {
						street: "DEV 999 Test Street",
						city: "Seedville",
						state: "XX",
						zipCode: "00000",
					},
				},
			},
		});

		console.log(`Store: ${store.name} (${store.id})`);

		const catNames = [
			"Electronics",
			"Peripherals",
			"Accessories",
			"Consumables",
		];

		await Promise.all(
			catNames.map((name) =>
				prisma.category.upsert({
					where: {
						storeId_name: {
							storeId: store.id,
							name,
						},
						// storeId: store.id,
						// name: name,
					},
					update: {},
					create: {
						name,
						storeId: store.id,
					},
				}),
			),
		);

		console.log(`→ ${catNames.length} categories`);

		// Permissions
		await Promise.all(
			PermissionsArray.map((key) =>
				prisma.permission.upsert({
					where: { key },
					update: {},
					create: { key },
				}),
			),
		);

		console.log(`→ ${PermissionsArray.length} permissions`);

		// ROLES
		const adminRole = await prisma.role.upsert({
			where: {
				storeId_name: {
					storeId: store.id,
					name: "Admin",
				},
			},
			update: {},
			create: {
				name: "Admin",
				storeId: store.id,
				grantsAll: true,
			},
		});

		// Give admin everything (safe to re-run)
		await prisma.role.update({
			where: { id: adminRole.id },
			data: {
				rolePermissions: {
					deleteMany: {},
					create: PermissionsArray.map((key) => ({
						permission: { connect: { key } },
					})),
				},
			},
		});

		console.log("→ Admin role ready");

		// You can add 1–2 more roles later the same way

		const hashedPassword = await hash("1234");

		// USERS (very visible usernames)
		await prisma.storeUser.upsert({
			where: {
				storeId_username: {
					storeId: store.id,
					username: `${DEMO_PREFIX}admin`,
				},
			},
			update: {},
			create: {
				name: "Development Admin",
				username: `${DEMO_PREFIX}admin`,
				password: hashedPassword,
				roleId: adminRole.id,
				storeId: store.id,
			},
		});

		console.log("→ Development admin user created");

		console.log("\nSeed finished – safe to run again");
	} catch (e) {
		console.error("Seed failed", e);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

main();
