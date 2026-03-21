import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const demoSeller = {
  name: "Demo Seller",
  email: "seller@aura.local",
  password: "demo-seeded-account",
};

const picsum = (id) => `https://picsum.photos/id/${id}/1200/800`;

const imageSet = (ids) => ids.map((id) => ({ imageUrl: picsum(id) }));

const vehiclePayloads = [
  {
    title: "Toyota Corolla Altis 1.8 G",
    price: 1850000,
    brand: "Toyota",
    model: "Corolla Altis",
    year: 2021,
    mileage: 28500,
    location: "Karachi",
    description: "Single owner sedan, dealer maintained, excellent fuel average.",
    status: "APPROVED",
    approvedAt: new Date(),
    images: imageSet([1071, 1072, 1070]),
  },
  {
    title: "Honda Civic Oriel 1.8 i-VTEC",
    price: 2490000,
    brand: "Honda",
    model: "Civic",
    year: 2022,
    mileage: 19000,
    location: "Lahore",
    description: "Top variant, push start, cruise control, spotless interior.",
    status: "APPROVED",
    approvedAt: new Date(),
    images: imageSet([1073, 1074, 1076]),
  },
  {
    title: "Suzuki Wagon R VXL",
    price: 1230000,
    brand: "Suzuki",
    model: "Wagon R",
    year: 2020,
    mileage: 42000,
    location: "Islamabad",
    description: "Economical city car with chilled AC and Android panel.",
    status: "APPROVED",
    approvedAt: new Date(),
    images: imageSet([1077, 1078, 1079]),
  },
  {
    title: "Kia Sportage AWD",
    price: 5890000,
    brand: "Kia",
    model: "Sportage",
    year: 2023,
    mileage: 8400,
    location: "Rawalpindi",
    description: "Like new SUV, panoramic roof, full service history.",
    status: "APPROVED",
    approvedAt: new Date(),
    images: imageSet([1081, 1082, 1083]),
  },
  {
    title: "Hyundai Elantra GLS",
    price: 3990000,
    brand: "Hyundai",
    model: "Elantra",
    year: 2022,
    mileage: 17500,
    location: "Faisalabad",
    description: "Family sedan in immaculate condition with complete documents.",
    status: "APPROVED",
    approvedAt: new Date(),
    images: imageSet([1084, 1080, 1069]),
  },
  {
    title: "MG HS Essence",
    price: 6120000,
    brand: "MG",
    model: "HS",
    year: 2023,
    mileage: 9600,
    location: "Karachi",
    description: "Premium crossover with adaptive cruise and lane assist.",
    status: "APPROVED",
    approvedAt: new Date(),
    images: imageSet([1068, 1067, 1066]),
  },
  {
    title: "Toyota Yaris ATIV X CVT",
    price: 3340000,
    brand: "Toyota",
    model: "Yaris",
    year: 2022,
    mileage: 24600,
    location: "Lahore",
    description: "Comfortable city sedan, smooth CVT transmission, neat body.",
    status: "APPROVED",
    approvedAt: new Date(),
    images: imageSet([1065, 1064, 1063]),
  },
  {
    title: "Changan Alsvin Lumiere",
    price: 2890000,
    brand: "Changan",
    model: "Alsvin",
    year: 2023,
    mileage: 11200,
    location: "Multan",
    description: "Feature-packed compact sedan with sunroof and cruise control.",
    status: "APPROVED",
    approvedAt: new Date(),
    images: imageSet([1062, 1061, 1060]),
  },
  {
    title: "Peugeot 2008 Active",
    price: 7150000,
    brand: "Peugeot",
    model: "2008",
    year: 2024,
    mileage: 3800,
    location: "Islamabad",
    description: "Imported crossover feel with modern cabin and strong road grip.",
    status: "APPROVED",
    approvedAt: new Date(),
    images: imageSet([1059, 1058, 1057]),
  },
  {
    title: "Honda BR-V i-VTEC S",
    price: 4860000,
    brand: "Honda",
    model: "BR-V",
    year: 2022,
    mileage: 22800,
    location: "Peshawar",
    description: "7-seater family SUV, smooth suspension, first owner.",
    status: "APPROVED",
    approvedAt: new Date(),
    images: imageSet([1056, 1055, 1054]),
  },
  {
    title: "Suzuki Swift GLX CVT",
    price: 4510000,
    brand: "Suzuki",
    model: "Swift",
    year: 2024,
    mileage: 4200,
    location: "Sialkot",
    description: "Practically new hatchback with excellent fuel economy.",
    status: "APPROVED",
    approvedAt: new Date(),
    images: imageSet([1053, 1052, 1051]),
  },
  {
    title: "Kia Stonic EX+",
    price: 5680000,
    brand: "Kia",
    model: "Stonic",
    year: 2023,
    mileage: 9800,
    location: "Gujranwala",
    description: "Compact crossover, factory paint, full authorized maintenance.",
    status: "APPROVED",
    approvedAt: new Date(),
    images: imageSet([1050, 1049, 1048]),
  },
  {
    title: "Hyundai Tucson GLS AWD",
    price: 8420000,
    brand: "Hyundai",
    model: "Tucson",
    year: 2024,
    mileage: 6500,
    location: "Rawalpindi",
    description: "Low mileage premium SUV, digital cluster, radar package.",
    status: "APPROVED",
    approvedAt: new Date(),
    images: imageSet([1047, 1046, 1045]),
  },
  {
    title: "DFSK Glory 580 Pro",
    price: 4780000,
    brand: "DFSK",
    model: "Glory 580",
    year: 2021,
    mileage: 31700,
    location: "Quetta",
    description: "Spacious 7-seater, leather interior, smooth turbo performance.",
    status: "APPROVED",
    approvedAt: new Date(),
    images: imageSet([1044, 1043, 1042]),
  },
  {
    title: "Toyota Revo V 2.8",
    price: 13600000,
    brand: "Toyota",
    model: "Hilux Revo",
    year: 2023,
    mileage: 14800,
    location: "Karachi",
    description: "Powerful pickup with 4x4 mode and pristine interior.",
    status: "APPROVED",
    approvedAt: new Date(),
    images: imageSet([1041, 1040, 1039]),
  },
];

async function main() {
  const seller = await prisma.user.upsert({
    where: { email: demoSeller.email },
    update: {
      name: demoSeller.name,
      password: demoSeller.password,
    },
    create: {
      name: demoSeller.name,
      email: demoSeller.email,
      password: demoSeller.password,
      role: "USER",
    },
    select: { id: true, email: true },
  });

  await prisma.image.deleteMany({ where: { vehicle: { userId: seller.id } } });
  await prisma.vehicle.deleteMany({ where: { userId: seller.id } });

  for (const payload of vehiclePayloads) {
    const { images, ...vehicleData } = payload;

    await prisma.vehicle.create({
      data: {
        ...vehicleData,
        userId: seller.id,
        images: {
          create: images,
        },
      },
    });
  }

  const insertedCount = await prisma.vehicle.count({ where: { userId: seller.id } });

  console.log("Dummy vehicles seeded successfully.");
  console.log(`seller=${seller.email}`);
  console.log(`vehicles=${insertedCount}`);
}

main()
  .catch((error) => {
    console.error("Failed to seed dummy vehicles.");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
