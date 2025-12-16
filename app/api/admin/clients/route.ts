import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Middleware pour vérifier si admin
async function checkAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session.user;
}

// GET - Liste des clients
export async function GET(request: NextRequest) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const status = searchParams.get("status"); // active, inactive
  const organizationId = searchParams.get("organizationId");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Prisma.UserWhereInput = {
    role: "CLIENT",
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(status === "active" && {
      subscriptions: {
        some: { status: "ACTIVE" },
      },
    }),
    ...(status === "inactive" && {
      subscriptions: {
        none: { status: "ACTIVE" },
      },
    }),
    ...(organizationId && {
      organizationId: organizationId,
    }),
    ...(organizationId === "none" && {
      organizationId: null,
    }),
  };

  const [clients, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        subscriptions: {
          where: { status: "ACTIVE" },
          include: {
            items: {
              include: { offer: true },
            },
          },
        },
        _count: {
          select: { 
            invoices: true,
            tickets: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({
    clients,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

