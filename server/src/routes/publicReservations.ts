import bcrypt from 'bcryptjs'
import { Router } from 'express'
import { prisma } from '../lib/prisma.js'

export const publicReservationsRouter = Router()

publicReservationsRouter.post('/lookup', async (req, res) => {
  const reservationNumber = String(req.body?.reservationNumber ?? '').trim()
  const confirmationCode = String(req.body?.confirmationCode ?? '').trim()

  if (!reservationNumber || !confirmationCode) {
    res.status(400).json({ message: '予約番号と確認キーを入力してください' })
    return
  }

  const reservation = await prisma.reservation.findUnique({
    where: { reservationNumber },
    include: {
      items: {
        include: { reservationType: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  })

  if (!reservation) {
    res.status(404).json({ message: '予約が見つかりません' })
    return
  }

  const isValid = await bcrypt.compare(confirmationCode, reservation.confirmationCodeHash)

  if (!isValid) {
    res.status(401).json({ message: '確認キーが正しくありません' })
    return
  }

  res.json(reservation)
})

publicReservationsRouter.post('/cancel', async (req, res) => {
  const reservationNumber = String(req.body?.reservationNumber ?? '').trim()
  const confirmationCode = String(req.body?.confirmationCode ?? '').trim()

  if (!reservationNumber || !confirmationCode) {
    res.status(400).json({ message: '予約番号と確認キーを入力してください' })
    return
  }

  const reservation = await prisma.reservation.findUnique({
    where: { reservationNumber },
  })

  if (!reservation) {
    res.status(404).json({ message: '予約が見つかりません' })
    return
  }

  const isValid = await bcrypt.compare(confirmationCode, reservation.confirmationCodeHash)

  if (!isValid) {
    res.status(401).json({ message: '確認キーが正しくありません' })
    return
  }

  const cancelledReservation = await prisma.reservation.update({
    where: { id: reservation.id },
    data: {
      status: 'cancelled',
      cancellationLogs: {
        create: {
          cancelledBy: 'user',
          note: 'confirmation portal',
        },
      },
    },
    include: {
      items: {
        include: { reservationType: true },
        orderBy: { sortOrder: 'asc' },
      },
      cancellationLogs: true,
    },
  })

  await prisma.adminNotification.create({
    data: {
      type: 'reservation_cancelled',
      title: '利用者による予約キャンセル',
      body: `${cancelledReservation.fullName} / ${cancelledReservation.preferredDate.toISOString().slice(0, 10)} の予約がキャンセルされました`,
    },
  })

  const siteContent = await prisma.siteContent.findUnique({
    where: { id: 'home' },
  })

  res.json({
    reservation: cancelledReservation,
    fireStationPhone: siteContent?.fireStationPhone ?? '',
  })
})
