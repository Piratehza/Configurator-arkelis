import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Stats du dashboard admin
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Stats globales
  const [
    totalClients,
    activeSubscriptions,
    pendingInvoices,
    openTickets,
    monthlyRevenue,
    recentClients,
    recentActivities,
  ] = await Promise.all([
    // Nombre total de clients
    prisma.user.count({
      where: { role: "CLIENT" },
    }),

    // Abonnements actifs
    prisma.subscription.count({
      where: { status: "ACTIVE" },
    }),

    // Factures en attente
    prisma.invoice.count({
      where: { status: { in: ["PENDING", "OVERDUE"] } },
    }),

    // Tickets ouverts
    prisma.supportTicket.count({
      where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
    }),

    // Revenu mensuel (abonnements actifs)
    prisma.subscription.aggregate({
      where: { status: "ACTIVE" },
      _sum: { totalMonthly: true },
    }),

    // 5 derniers clients
    prisma.user.findMany({
      where: { role: "CLIENT" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        createdAt: true,
        subscriptions: {
          where: { status: "ACTIVE" },
          select: { totalMonthly: true },
        },
      },
    }),

    // 10 dernières activités (logs)
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    }),
  ]);

  // Notifications non lues pour l'admin
  const unreadNotifications = await prisma.notification.findMany({
    where: {
      userId: session.user.id,
      isRead: false,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return NextResponse.json({
    stats: {
      totalClients,
      activeSubscriptions,
      pendingInvoices,
      openTickets,
      monthlyRevenue: monthlyRevenue._sum.totalMonthly || 0,
    },
    recentClients,
    recentActivities,
    unreadNotifications,
  });
}


