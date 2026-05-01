import { NextRequest, NextResponse } from 'next/server';
import { MovebankStudy } from '../../../../types/movebank';
import { MovebankService } from '../../../../services/movebank';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const apiToken = process.env.MOVE_BANK_API_TOKEN;

    const service = new MovebankService(apiToken);
    const studies = await service.getPublicStudies(limit);

    return NextResponse.json(studies);
  } catch (error: any) {
    console.error('Failed to fetch studies:', error.message);
    return NextResponse.json([]);
  }
}
