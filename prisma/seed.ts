import {
    DiscountType,
    PrismaClient,
    ProcessStatus,
    ResetFrequency,
    Status,
    TransactionType,
    VerificationTokenType,
} from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import {
    ROLE_BASE_MAP,
    UserRoleType as userRole,
} from "../src/shared/types/common.type";
import {
    AddAFewMonthsFromNow,
    addAFewYearsFromNow,
} from "../src/utils/dateTimeManipulation.util";
import { generateVerifyCode } from "../src/utils/token.util";
import { hashValue } from "../src/utils/password.util";

const prisma = new PrismaClient();

const roleBase = ROLE_BASE_MAP;

async function main() {
    // Seed roles
    await prisma.role.createMany({
        data: [
            { name: roleBase.CUSTOMER, description: "Regular user" },
            { name: roleBase.ADMIN, description: "Tour Admin" },
            { name: roleBase.DEV, description: "Developer or System Admin" },
        ],
        skipDuplicates: true,
    });

    interface UserSeedData {
        id: string;
        fullName: string;
        gender: "m" | "f";
        birthdate: Date;
        domicile: string;
        email: string;
        phoneNumber: string;
        passwordHash: string;
        pin: string;
        status: Status;
        picture: string;
        profileCompletedAt: number | null;
        createdAt: number;
        updatedAt: number;
    }
    const date: number = Date.now();
    // Data Users
    const usersData: UserSeedData[] = [
        {
            id: uuidv4(),
            fullName: "Budi Santoso",
            gender: "m",
            birthdate: new Date(),
            domicile: "Surabaya",
            email: "budi.santoso@example.com",
            phoneNumber: "081234567891",
            passwordHash: "password123",
            pin: "123456",
            status: Status.ACTIVE,
            picture: "https://picsum.photos/300",
            profileCompletedAt: date,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        },
        {
            id: uuidv4(),
            fullName: "Siti Aminah",
            gender: "f",
            birthdate: new Date(),
            domicile: "Yogyakarta",
            email: "siti.aminah@example.com",
            phoneNumber: "082198765432",
            passwordHash: "password123",
            pin: "123456",
            status: Status.ACTIVE,
            picture: "https://picsum.photos/300",
            profileCompletedAt: Date.now(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
        },
        {
            id: uuidv4(),
            fullName: "Doni Prasetyo",
            gender: "m",
            birthdate: new Date(),
            domicile: "Semarang",
            email: "doni.prasetyo@example.com",
            phoneNumber: "081312345678",
            passwordHash: "password123",
            pin: "123456",
            status: Status.ACTIVE,
            picture: "https://picsum.photos/300",
            profileCompletedAt: null,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        },
        {
            id: uuidv4(),
            fullName: "Linda Pertiwi",
            gender: "f",
            birthdate: new Date(),
            domicile: "Bali",
            email: "linda.pertiwi@example.com",
            phoneNumber: "081256789012",
            passwordHash: "password123",
            pin: "123456",
            status: Status.ACTIVE,
            picture: "https://picsum.photos/300",
            profileCompletedAt: null,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        },
    ];

    // Hash password dan PIN
    const usersWithHashedData = await Promise.all(
        usersData.map(async (user) => ({
            ...user,
            passwordHash: await hashValue(user.passwordHash),
            pin: await hashValue(user.pin),
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
                userId: usersData[0].id,
                roleId: roleMap[roleBase.CUSTOMER],
                createdAt: Date.now(),
            },
            {
                userId: usersData[1].id,
                roleId: roleMap[roleBase.ADMIN],
                createdAt: Date.now(),
            },
            {
                userId: usersData[2].id,
                roleId: roleMap[roleBase.DEV],
                createdAt: Date.now(),
            },
            {
                userId: usersData[3].id,
                roleId: roleMap[roleBase.CUSTOMER],
                createdAt: Date.now(),
            },
        ],
        skipDuplicates: true,
    });

    // Seed OAuthAccount
    await prisma.oAuthAccount.createMany({
        data: [
            {
                id: uuidv4(),
                userId: usersData[0].id,
                provider: "email",
                providerId: usersData[0].id,
                refreshToken: null,
                accessToken: null,
                expiresAt: null,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            },
        ],
        skipDuplicates: true,
    });

    // Seed Session
    await prisma.session.createMany({
        data: [
            {
                id: uuidv4(),
                userId: usersData[0].id,
                refreshToken: uuidv4(),
                userAgent: "Mozilla/5.0",
                ipAddress: "127.0.0.1",
                expiresAt: Date.now() + 1000 * 60 * 60 * 24,
                createdAt: Date.now(),
            },
        ],
        skipDuplicates: true,
    });

    // Seed VerificationToken
    await prisma.verificationToken.createMany({
        data: [
            {
                id: uuidv4(),
                userId: usersData[0].id,
                email: usersData[0].email,
                token: await hashValue(generateVerifyCode()),
                type: VerificationTokenType.EMAIL_VERIFICATION,
                isUsed: true,
                expires: Date.now() + 1000 * 60 * 30,
                createdAt: Date.now(),
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
                phoneNumber: "081234567890",
                description:
                    "Wisata alam dengan ekosistem mangrove yang indah.",
                location: "Jakarta Utara",
                latitude: -6.1185,
                longitude: 106.9034,
                category: "alam",
                status: ProcessStatus.APPROVED,
                rating: 4.7,
                reviewCount: 25,
                picture: [
                    "https://picsum.photos/200/300",
                    "https://picsum.photos/200/300",
                ],
                createdBy: user.id,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            },
            {
                id: uuidv4(),
                name: "Waterboom PIK",
                email: "waterboom@example.com",
                phoneNumber: "081298765432",
                description: "Waterpark dengan berbagai wahana air seru.",
                location: "Jakarta Utara",
                latitude: -6.118,
                longitude: 106.9,
                category: "hiburan",
                status: ProcessStatus.APPROVED,
                rating: 4.5,
                reviewCount: 40,
                picture: [
                    "https://picsum.photos/200/300",
                    "https://picsum.photos/200/300",
                ],
                createdBy: user.id,
                createdAt: Date.now(),
                updatedAt: Date.now(),
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
                tourId: tour.id,
                facilityTypeId: facilityTypeList[0].id,
                name: "Toilet Umum A",
                barcode: "FAC-001",
                isActive: true,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            },
            {
                id: uuidv4(),
                tourId: tour.id,
                facilityTypeId: facilityTypeList[1].id,
                name: "Mushola Selatan",
                barcode: "FAC-002",
                isActive: true,
                createdAt: Date.now(),
                updatedAt: Date.now(),
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
                facilityId: facilityList[0].id,
                price: 2000,
                currency: "IDR",
                startDate: Date.now(),
                endDate: null,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            },
            {
                id: uuidv4(),
                facilityId: facilityList[1].id,
                price: 5000,
                currency: "IDR",
                startDate: Date.now(),
                endDate: null,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            },
        ],
        skipDuplicates: true,
    });

    // Seeder untuk Employee
    const employees = await prisma.employee.createMany({
        data: [
            {
                id: uuidv4(),
                tourId: tour.id,
                fullName: "Budi Santoso",
                phone: "081212345678",
                status: Status.ACTIVE,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            },
            {
                id: uuidv4(),
                tourId: tour.id,
                fullName: "Siti Aminah",
                phone: "081298765432",
                status: Status.ACTIVE,
                createdAt: Date.now(),
                updatedAt: Date.now(),
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
                facilityId: facilityList[0].id,
                employeeId: employeeList[0].id,
                position: "Petugas Kebersihan",
                startDate: Date.now(),
                endDate: null,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            },
            {
                id: uuidv4(),
                facilityId: facilityList[1].id,
                employeeId: employeeList[1].id,
                position: "Penjaga Mushola",
                startDate: Date.now(),
                endDate: null,
                createdAt: Date.now(),
                updatedAt: Date.now(),
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
            tourId: tour.id,
            name: "Diskon 10% Weekend",
            description:
                "Nikmati diskon 10% untuk setiap pembelian tiket di akhir pekan!",
            discountType: DiscountType.PERCENTAGE,
            discountValue: 10.0,
            maxDiscount: 20000,
            minSpend: 50000,
            quota: 100,
            usedQuota: 0,
            startDate: Date.now(),
            endDate: AddAFewMonthsFromNow(1),
            isActive: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        },
    });

    // Seeder untuk Voucher
    const voucher = await prisma.voucher.create({
        data: {
            id: uuidv4(),
            facilityId: facility.id,
            code: "VOUCHER123",
            name: "Voucher Parkir Gratis",
            description: "Dapatkan parkir gratis untuk 1 jam pertama.",
            discountType: DiscountType.FIXED,
            discountValue: 5000,
            maxDiscount: 5000,
            minSpend: 0,
            quota: 50,
            usedQuota: 0,
            userId: null,
            startDate: Date.now(),
            endDate: AddAFewMonthsFromNow(2),
            isActive: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        },
    });

    // Seeder untuk UserPromotion (Menghubungkan User dengan Promotion)
    await prisma.userPromotion.create({
        data: {
            id: uuidv4(),
            userId: user.id,
            promotionId: promotion.id,
            isUsed: false,
            usedAt: null,
            createdAt: Date.now(),
        },
    });

    // Seeder untuk UserVoucher (Menghubungkan User dengan Voucher)
    await prisma.userVoucher.create({
        data: {
            id: uuidv4(),
            userId: user.id,
            voucherId: voucher.id,
            isUsed: false,
            usedAt: null,
            createdAt: Date.now(),
        },
    });

    const adminRole = await prisma.role.findFirst({
        where: { name: roleBase.DEV },
    });

    if (!adminRole) {
        throw new Error("Role dev tidak ditemukan.");
    }

    const admin = await prisma.user.findFirst({
        where: {
            roles: {
                some: {
                    roleId: adminRole.id,
                },
            },
        },
    });

    if (!admin) {
        throw new Error(`${admin}`);
    }

    // Seeder untuk CoinSetting
    const coinSetting = await prisma.coinSetting.create({
        data: {
            id: uuidv4(),
            pricePerCoin: 1000,
            minPurchase: 10,
            maxPurchase: 10000,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        },
    });

    // Seeder untuk CoinTopup
    const coinTopup = await prisma.coinTopup.create({
        data: {
            id: uuidv4(),
            userId: user.id,
            paymentRef: `PAY-${uuidv4()}`,
            amount: 100,
            priceTotal: 100000,
            paymentStatus: ProcessStatus.SUCCESS,
            paymentMethod: "bank_transfer",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        },
    });

    // Seeder untuk UserCoin
    const userCoin = await prisma.userCoin.upsert({
        where: { userId: user.id },
        update: { balance: 500 },
        create: {
            id: uuidv4(),
            userId: user.id,
            balance: 500,
            lastResetAt: null,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        },
    });

    // Seeder untuk CoinTransaction
    await prisma.coinTransaction.create({
        data: {
            id: uuidv4(),
            userId: user.id,
            transactionType: TransactionType.TOPUP,
            amount: 100,
            priceTotal: 100000,
            relatedId: coinTopup.id,
            createdAt: Date.now(),
        },
    });

    // Seeder untuk CoinReset
    await prisma.coinReset.create({
        data: {
            id: uuidv4(),
            adminId: admin.id,
            userId: user.id,
            previousBalance: 500,
            resetReason: "Reset tahunan",
            resetAt: Date.now(),
        },
    });

    // Seeder untuk CoinResetRule
    await prisma.coinResetRule.create({
        data: {
            id: uuidv4(),
            resetEnabled: true,
            resetDate: addAFewYearsFromNow(1),
            resetTime: Date.now(),
            resetFrequency: ResetFrequency.YEARLY,
            resetAdminId: admin.id,
            lastUpdatedAt: Date.now(),
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
