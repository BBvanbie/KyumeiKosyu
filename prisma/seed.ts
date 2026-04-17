import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { PrismaClient } from '../generated/prisma/client'

const connectionString = process.env.DATABASE_URL ?? process.env.DATABASE_POOL_URL ?? ''
const adapter = new PrismaPg({ connectionString })

const prisma = new PrismaClient({ adapter })

async function main() {
  const username = process.env.ADMIN_USERNAME ?? 'admin'
  const password = process.env.ADMIN_PASSWORD ?? 'Change123'
  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash },
    create: {
      username,
      passwordHash,
    },
  })

  await prisma.bookingSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      monthlyLimit: 10,
      weeklyLimit: 3,
      dailyLimit: 2,
      maxConsecutiveOpenDays: 5,
    },
  })

  await upsertSiteContent()

  const reservationTypes = [
    {
      sortOrder: 1,
      name: '普通（新規）',
      description: '普通救命講習の新規受講',
      durationMinutes: 180,
      textbookFee: 0,
      isActive: true,
    },
    {
      sortOrder: 2,
      name: '普通（再講習）',
      description: '普通救命講習の再講習',
      durationMinutes: 120,
      textbookFee: 0,
      isActive: true,
    },
    {
      sortOrder: 3,
      name: '普通（電子学習室短縮）',
      description: '電子学習室短縮対応の普通救命講習',
      durationMinutes: 90,
      textbookFee: 0,
      isActive: true,
    },
    {
      sortOrder: 4,
      name: '普通（英語版）',
      description: '英語版の普通救命講習',
      durationMinutes: 180,
      textbookFee: 0,
      isActive: true,
    },
    {
      sortOrder: 5,
      name: '上級（新規）',
      description: '上級救命講習の新規受講',
      durationMinutes: 480,
      textbookFee: 0,
      isActive: true,
    },
    {
      sortOrder: 6,
      name: '上級（再講習）',
      description: '上級救命講習の再講習',
      durationMinutes: 300,
      textbookFee: 0,
      isActive: true,
    },
    {
      sortOrder: 7,
      name: '上級（電子学習室短縮）',
      description: '電子学習室短縮対応の上級救命講習',
      durationMinutes: 240,
      textbookFee: 0,
      isActive: true,
    },
  ]

  for (const type of reservationTypes) {
    await prisma.reservationType.upsert({
      where: { sortOrder: type.sortOrder },
      update: type,
      create: type,
    })
  }
}

async function upsertSiteContent() {
  const client = new pg.Client({ connectionString })
  await client.connect()

  try {
    await client.query(
      `
        insert into "SiteContent"
          ("id", "heroTitle", "heroDescription", "guideTitle", "guideBody", "fireStationPhone", "createdAt", "updatedAt")
        values
          ($1, $2, $3, $4, $5, $6, now(), now())
        on conflict ("id") do update set
          "heroTitle" = excluded."heroTitle",
          "heroDescription" = excluded."heroDescription",
          "guideTitle" = excluded."guideTitle",
          "guideBody" = excluded."guideBody",
          "fireStationPhone" = excluded."fireStationPhone",
          "updatedAt" = now()
      `,
      [
        'home',
        '予約したい講習日を選び、そのまま予約手続きへ進めます。',
        '救命講習の団体予約をオンラインで受け付けています。希望日を選択し、必要事項を入力して送信してください。',
        'ご利用案内',
        '予約送信後、消防署からのお電話で受付確定となります。英語版講習や予約不可日がある場合は、画面内の案内をご確認ください。',
        '03-0000-0000',
      ]
    )
  } finally {
    await client.end()
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
