import { NextResponse } from 'next/server';

import { askGemini } from '@/utils/s3-fuse';

export const dynamic = 'force-dynamic';

export async function POST(req: Request){

  const { user, system="" } = await req.json();

  const text = await askGemini({ user, system });

  return NextResponse.json({ ok:true, text });

}

