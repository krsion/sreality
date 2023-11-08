import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { ListingDTO } from '../../types/listing'

const prisma = new PrismaClient()


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ listings: ListingDTO[], totalPages: number }>
) {
  const page = Number(req.query.page) || 1;
  const pageSize = 12;
  const skip = (page - 1) * pageSize;

  const listings = await prisma.listings.findMany({
    skip,
    take: pageSize,
  });

  const totalListings = await prisma.listings.count();
  const totalPages = Math.ceil(totalListings / pageSize);

  res.status(200).json({ listings, totalPages });
}