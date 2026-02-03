import { NextResponse } from 'next/server';
import { buildClientSearchIndex } from '@/lib/search-index';

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    const searchIndex = buildClientSearchIndex();
    return NextResponse.json(searchIndex);
  } catch (error) {
    console.error('Error building search index:', error);
    return NextResponse.json({ error: 'Failed to build search index' }, { status: 500 });
  }
}
