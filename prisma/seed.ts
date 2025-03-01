import {
    DiscountType,
    PrismaClient,
    ProcessStatus,
    ResetFrequency,
    Status,
    TransactionType,
} from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { saltAndHashPassword } from "../src/utils/password.util";

const prisma = new PrismaClient();

async function main() {
    // Seed roles
    await prisma.role.createMany({
        data: [
            { name: "customer", description: "Regular user" },
            { name: "admin_wisata", description: "Admin wisata" },
            { name: "admin_system", description: "System admin" },
        ],
        skipDuplicates: true,
    });

    interface UserSeedData {
        id: string;
        full_name: string;
        gender: "m" | "f";
        birthdate: Date;
        domicile: string;
        email: string;
        phone_number: string;
        password_hash: string;
        pin: string;
        status: Status;
        picture: string;
        profile_completed_at: Date | null;
        created_at: Date;
        updated_at: Date;
    }

    // Data Users
    const usersData: UserSeedData[] = [
        {
            id: uuidv4(),
            full_name: "Budi Santoso",
            gender: "m",
            birthdate: new Date("1990-05-20"),
            domicile: "Surabaya",
            email: "budi.santoso@example.com",
            phone_number: "081234567891",
            password_hash: "password123",
            pin: "123456",
            status: Status.active,
            picture: "https://picsum.photos/300",
            profile_completed_at: new Date(),
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            id: uuidv4(),
            full_name: "Siti Aminah",
            gender: "f",
            birthdate: new Date("1997-09-10"),
            domicile: "Yogyakarta",
            email: "siti.aminah@example.com",
            phone_number: "082198765432",
            password_hash: "password123",
            pin: "123456",
            status: Status.active,
            picture: "https://picsum.photos/300",
            profile_completed_at: new Date(),
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            id: uuidv4(),
            full_name: "Doni Prasetyo",
            gender: "m",
            birthdate: new Date("1993-11-15"),
            domicile: "Semarang",
            email: "doni.prasetyo@example.com",
            phone_number: "081312345678",
            password_hash: "password123",
            pin: "123456",
            status: Status.active,
            picture: "https://picsum.photos/300",
            profile_completed_at: null,
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            id: uuidv4(),
            full_name: "Linda Pertiwi",
            gender: "f",
            birthdate: new Date("1995-04-05"),
            domicile: "Bali",
            email: "linda.pertiwi@example.com",
            phone_number: "081256789012",
            password_hash: "password123",
            pin: "123456",
            status: Status.active,
            picture: "https://picsum.photos/300",
            profile_completed_at: null,
            created_at: new Date(),
            updated_at: new Date(),
        },
    ];

    // Hash password dan PIN
    const usersWithHashedData = await Promise.all(
        usersData.map(async (user) => ({
            ...user,
            password_hash: await saltAndHashPassword(user.password_hash),
            pin: await saltAndHashPassword(user.pin),
        }))
    );

    await prisma.user.createMany({
        data: usersWithHashedData,
        skipDuplicates: true,
    });

    // Ambil role IDs
    const roles = await prisma.role.findMany();
    const roleMap = Object.fromEntries(roles.map((r) => [r.name, r.id]));

    // Assign roles ke users
    await prisma.userRole.createMany({
        data: [
            {
                user_id: usersData[0].id,
                role_id: roleMap["customer"],
                created_at: new Date(),
            },
            {
                user_id: usersData[1].id,
                role_id: roleMap["admin_wisata"],
                created_at: new Date(),
            },
            {
                user_id: usersData[2].id,
                role_id: roleMap["admin_system"],
                created_at: new Date(),
            },
            {
                user_id: usersData[3].id,
                role_id: roleMap["customer"],
                created_at: new Date(),
            },
        ],
        skipDuplicates: true,
    });

    // Seed OAuthAccount
    await prisma.oAuthAccount.createMany({
        data: [
            {
                id: uuidv4(),
                user_id: usersData[0].id,
                provider: "email",
                provider_id: usersData[0].id,
                refresh_token: null,
                access_token: null,
                expires_at: null,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ],
        skipDuplicates: true,
    });

    // Seed Session
    await prisma.session.createMany({
        data: [
            {
                id: uuidv4(),
                user_id: usersData[0].id,
                refresh_token: uuidv4(),
                user_agent: "Mozilla/5.0", // Ganti sesuai kebutuhan
                ip_address: "127.0.0.1", // Ganti sesuai kebutuhan
                expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
                created_at: new Date(),
            },
        ],
        skipDuplicates: true,
    });

    // Seed VerificationToken
    await prisma.verificationToken.createMany({
        data: [
            {
                id: uuidv4(),
                user_id: usersData[0].id,
                email: usersData[0].email,
                token: uuidv4(),
                type: "email_verification",
                expires: new Date(Date.now() + 1000 * 60 * 30),
                created_at: new Date(),
            },
        ],
        skipDuplicates: true,
    });

    const user = await prisma.user.findFirst();
    if (!user) {
        throw new Error("Tidak ada user yang tersedia untuk membuat tour.");
    }

    // Seeder untuk Tour
    const tours = await prisma.tour.createMany({
        data: [
            {
                id: uuidv4(),
                name: "Taman Wisata Alam Mangrove",
                email: "mangrove@example.com",
                phone_number: "081234567890",
                description:
                    "Wisata alam dengan ekosistem mangrove yang indah.",
                location: "Jakarta Utara",
                latitude: -6.1185,
                longitude: 106.9034,
                category: "alam",
                status: ProcessStatus.approved,
                rating: 4.7,
                review_count: 25,
                picture: [
                    "https://picsum.photos/200/300",
                    "https://picsum.photos/200/300",
                ],
                created_by: user.id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: "Waterboom PIK",
                email: "waterboom@example.com",
                phone_number: "081298765432",
                description: "Waterpark dengan berbagai wahana air seru.",
                location: "Jakarta Utara",
                latitude: -6.118,
                longitude: 106.9,
                category: "hiburan",
                status: ProcessStatus.approved,
                rating: 4.5,
                review_count: 40,
                picture: [
                    "https://picsum.photos/200/300",
                    "https://picsum.photos/200/300",
                ],
                created_by: user.id,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ],
        skipDuplicates: true,
    });

    // Seeder untuk FacilityType
    const facilityTypes = await prisma.facilityType.createMany({
        data: [
            { name: "Toilet", description: "Fasilitas toilet umum" },
            { name: "Mushola", description: "Tempat ibadah" },
            { name: "Parkir", description: "Area parkir kendaraan" },
            { name: "Kolam Renang", description: "Fasilitas berenang" },
        ],
        skipDuplicates: true,
    });

    // Ambil salah satu tour yang tersedia
    const tour = await prisma.tour.findFirst();
    if (!tour) {
        throw new Error(
            "Tidak ada tour yang tersedia untuk membuat fasilitas."
        );
    }

    // Ambil semua FacilityType untuk referensi
    const facilityTypeList = await prisma.facilityType.findMany();

    // Seeder untuk Facility
    const facilities = await prisma.facility.createMany({
        data: [
            {
                id: uuidv4(),
                tour_id: tour.id,
                facility_type_id: facilityTypeList[0].id,
                name: "Toilet Umum A",
                barcode: "FAC-001",
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                tour_id: tour.id,
                facility_type_id: facilityTypeList[1].id,
                name: "Mushola Selatan",
                barcode: "FAC-002",
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ],
        skipDuplicates: true,
    });

    // Ambil facility yang baru dibuat
    const facilityList = await prisma.facility.findMany();

    // Seeder untuk FacilityPricing
    await prisma.facilityPricing.createMany({
        data: [
            {
                id: uuidv4(),
                facility_id: facilityList[0].id,
                price: 2000,
                currency: "IDR",
                start_date: new Date(),
                end_date: null,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                facility_id: facilityList[1].id,
                price: 5000,
                currency: "IDR",
                start_date: new Date(),
                end_date: null,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ],
        skipDuplicates: true,
    });

    // Seeder untuk Employee
    const employees = await prisma.employee.createMany({
        data: [
            {
                id: uuidv4(),
                tour_id: tour.id,
                full_name: "Budi Santoso",
                phone: "081212345678",
                status: Status.active,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                tour_id: tour.id,
                full_name: "Siti Aminah",
                phone: "081298765432",
                status: Status.active,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ],
        skipDuplicates: true,
    });

    // Ambil employee yang baru dibuat
    const employeeList = await prisma.employee.findMany();

    // Seeder untuk FacilityEmployee
    await prisma.facilityEmployee.createMany({
        data: [
            {
                id: uuidv4(),
                facility_id: facilityList[0].id,
                employee_id: employeeList[0].id,
                position: "Petugas Kebersihan",
                start_date: new Date(),
                end_date: null,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                facility_id: facilityList[1].id,
                employee_id: employeeList[1].id,
                position: "Penjaga Mushola",
                start_date: new Date(),
                end_date: null,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ],
        skipDuplicates: true,
    });

    const facility = await prisma.facility.findFirst();

    if (!tour || !facility || !user) {
        throw new Error(
            "Pastikan ada data tour, facility, dan user sebelum menjalankan seeder."
        );
    }

    // Seeder untuk Promotion
    const promotion = await prisma.promotion.create({
        data: {
            id: uuidv4(),
            tour_id: tour.id,
            name: "Diskon 10% Weekend",
            description:
                "Nikmati diskon 10% untuk setiap pembelian tiket di akhir pekan!",
            discount_type: DiscountType.percentage,
            discount_value: 10.0,
            max_discount: 20000,
            min_spend: 50000,
            quota: 100,
            used_quota: 0,
            start_date: new Date(),
            end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
    });

    // Seeder untuk Voucher
    const voucher = await prisma.voucher.create({
        data: {
            id: uuidv4(),
            facility_id: facility.id,
            code: "VOUCHER123",
            name: "Voucher Parkir Gratis",
            description: "Dapatkan parkir gratis untuk 1 jam pertama.",
            discount_type: DiscountType.fixed,
            discount_value: 5000,
            max_discount: 5000,
            min_spend: 0,
            quota: 50,
            used_quota: 0,
            user_id: null,
            start_date: new Date(),
            end_date: new Date(new Date().setMonth(new Date().getMonth() + 2)),
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
    });

    // Seeder untuk UserPromotion (Menghubungkan User dengan Promotion)
    await prisma.userPromotion.create({
        data: {
            id: uuidv4(),
            user_id: user.id,
            promotion_id: promotion.id,
            is_used: false,
            used_at: null,
            created_at: new Date(),
        },
    });

    // Seeder untuk UserVoucher (Menghubungkan User dengan Voucher)
    await prisma.userVoucher.create({
        data: {
            id: uuidv4(),
            user_id: user.id,
            voucher_id: voucher.id,
            is_used: false,
            used_at: null,
            created_at: new Date(),
        },
    });

    const adminRole = await prisma.role.findFirst({
        where: { name: "admin_system" },
    });

    if (!adminRole) {
        throw new Error("Role admin_system tidak ditemukan.");
    }

    const admin = await prisma.user.findFirst({
        where: {
            roles: {
                some: {
                    role_id: adminRole.id,
                },
            },
        },
    });

    if (!admin) {
        throw new Error(
            `${admin}`
            // "Pastikan ada data user dan admin sebelum menjalankan seeder."
        );
    }

    // Seeder untuk CoinSetting
    const coinSetting = await prisma.coinSetting.create({
        data: {
            id: uuidv4(),
            price_per_coin: 1000,
            min_purchase: 10,
            max_purchase: 10000,
            created_at: new Date(),
            updated_at: new Date(),
        },
    });

    // Seeder untuk CoinTopup
    const coinTopup = await prisma.coinTopup.create({
        data: {
            id: uuidv4(),
            user_id: user.id,
            payment_ref: `PAY-${uuidv4()}`,
            amount: 100,
            price_total: 100000,
            payment_status: ProcessStatus.success,
            payment_method: "bank_transfer",
            created_at: new Date(),
            updated_at: new Date(),
        },
    });

    // Seeder untuk UserCoin
    const userCoin = await prisma.userCoin.upsert({
        where: { user_id: user.id },
        update: { balance: 500 },
        create: {
            id: uuidv4(),
            user_id: user.id,
            balance: 500,
            last_reset_at: null,
            created_at: new Date(),
            updated_at: new Date(),
        },
    });

    // Seeder untuk CoinTransaction
    await prisma.coinTransaction.create({
        data: {
            id: uuidv4(),
            user_id: user.id,
            transaction_type: TransactionType.topup,
            amount: 100,
            price_total: 100000,
            related_id: coinTopup.id,
            created_at: new Date(),
        },
    });

    // Seeder untuk CoinReset
    await prisma.coinReset.create({
        data: {
            id: uuidv4(),
            admin_id: admin.id,
            user_id: user.id,
            previous_balance: 500,
            reset_reason: "Reset tahunan",
            reset_at: new Date(),
        },
    });

    // Seeder untuk CoinResetRule
    await prisma.coinResetRule.create({
        data: {
            id: uuidv4(),
            reset_enabled: true,
            reset_date: new Date(
                new Date().setFullYear(new Date().getFullYear() + 1)
            ),
            reset_time: new Date(),
            reset_frequency: ResetFrequency.yearly,
            reset_admin_id: admin.id,
            last_updated_at: new Date(),
        },
    });
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
