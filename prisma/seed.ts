import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  await prisma.$connect()

  const farmerPwd     = bcrypt.hashSync('farmer123', 10)
  const buyerPwd      = bcrypt.hashSync('buyer123', 10)
  const transportPwd  = bcrypt.hashSync('transport123', 10)

  // Create users
  const farmer1 = await prisma.user.create({ data: {
    name: 'Rajesh Kumar',
    email: 'rajesh@agrotrace.in',
    password: farmerPwd,
    role: 'FARMER' as any,
    phone: '9898989898',
    location: 'Nashik'
  }})

  const farmer2 = await prisma.user.create({ data: {
    name: 'Gurpreet Singh',
    email: 'gurpreet@agrotrace.in',
    password: farmerPwd,
    role: 'FARMER' as any,
    phone: '9818181818',
    location: 'Amritsar'
  }})

  const buyer = await prisma.user.create({ data: {
    name: 'Anand Traders Mumbai',
    email: 'anand@agrotrace.in',
    password: buyerPwd,
    role: 'BUYER' as any,
    phone: '02212345678',
    location: 'Mumbai'
  }})

  const buyer2 = await prisma.user.create({ data: {
    name: 'Prashant Yadav',
    email: 'prashant@agrotrace.in',
    password: buyerPwd,
    role: 'BUYER' as any,
    phone: '9900990099',
    location: 'Pune'
  }})

  const transporter = await prisma.user.create({ data: {
    name: 'FastMove Logistics',
    email: 'fastmove@agrotrace.in',
    password: transportPwd,
    role: 'TRANSPORTER' as any,
    phone: '08012345678',
    location: 'Pan-India'
  }})

  // Create batches
  const batch1 = await prisma.batch.create({ data: {
    batchCode: 'TMT-2026-0001',
    cropType: 'Tomatoes',
    variety: 'Hybrid',
    quantityKg: 500,
    pricePerKg: 18,
    farmLocation: 'Nashik',
    harvestDate: new Date('2026-03-01'),
    status: 'AVAILABLE' as any,
    farmerId: farmer1.id
  }})

  const batch2 = await prisma.batch.create({ data: {
    batchCode: 'WHT-2026-0001',
    cropType: 'Wheat',
    variety: 'Punjab Wheat',
    quantityKg: 1200,
    pricePerKg: 24,
    farmLocation: 'Amritsar',
    harvestDate: new Date('2026-02-15'),
    status: 'IN_TRANSIT' as any,
    farmerId: farmer2.id
  }})

  const batch3 = await prisma.batch.create({ data: {
    batchCode: 'MNG-2026-0001',
    cropType: 'Alphonso Mangoes',
    variety: 'Alphonso',
    quantityKg: 300,
    pricePerKg: 85,
    farmLocation: 'Ratnagiri',
    harvestDate: new Date('2026-04-10'),
    status: 'AVAILABLE' as any,
    farmerId: farmer1.id
  }})

  // Shipment events for WHT-2026-0001
  await prisma.shipmentEvent.createMany({ data: [
    {
      batchId: batch2.id,
      actorId: farmer2.id,
      eventType: 'BATCH_CREATED',
      locationName: 'Amritsar Farm',
      lat: 31.6340,
      lon: 74.8723,
      timestamp: new Date('2026-02-15T08:00:00Z')
    },
    {
      batchId: batch2.id,
      actorId: transporter.id,
      eventType: 'PICKUP',
      locationName: 'Amritsar Mandi',
      lat: 31.6200,
      lon: 74.8765,
      timestamp: new Date('2026-02-15T12:00:00Z'),
      vehicleId: 'TRK-FAST-001'
    },
    {
      batchId: batch2.id,
      actorId: transporter.id,
      eventType: 'CHECKPOINT_PASSED',
      locationName: 'Ambala Checkpoint',
      lat: 30.3782,
      lon: 76.7767,
      timestamp: new Date('2026-02-16T03:30:00Z'),
      temperature: 22.5,
      humidity: 58
    },
    {
      batchId: batch2.id,
      actorId: transporter.id,
      eventType: 'CHECKPOINT_PASSED',
      locationName: 'Delhi Border',
      lat: 28.7041,
      lon: 77.1025,
      timestamp: new Date('2026-02-16T10:20:00Z'),
      temperature: 28.1,
      humidity: 62
    },
    {
      batchId: batch2.id,
      actorId: transporter.id,
      eventType: 'WAREHOUSE_ENTRY',
      locationName: 'Delhi Cold Storage',
      lat: 28.6139,
      lon: 77.2090,
      timestamp: new Date('2026-02-16T12:00:00Z')
    }
  ]})

  // Shipment events for TMT-2026-0001
  await prisma.shipmentEvent.createMany({ data: [
    {
      batchId: batch1.id,
      actorId: farmer1.id,
      eventType: 'BATCH_CREATED',
      locationName: 'Nashik Farm',
      lat: 19.9975,
      lon: 73.7898,
      timestamp: new Date('2026-03-01T07:00:00Z')
    },
    {
      batchId: batch1.id,
      actorId: transporter.id,
      eventType: 'PICKUP',
      locationName: 'Nashik Mandi',
      lat: 20.0059,
      lon: 73.7791,
      timestamp: new Date('2026-03-01T11:30:00Z')
    }
  ]})

  // Order: Anand Traders buys 200kg of WHT-2026-0001
  await prisma.order.create({ data: {
    batchId: batch2.id,
    buyerId: buyer.id,
    quantityOrdered: 200,
    pricePerKg: 24,
    totalAmount: 200 * 24,
    status: 'CONFIRMED' as any
  }})

  console.log('Seeding completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
