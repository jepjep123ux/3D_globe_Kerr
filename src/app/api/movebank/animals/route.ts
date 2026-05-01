import { NextRequest, NextResponse } from 'next/server';
import { MovebankService } from '../../../../services/movebank';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studyId = searchParams.get('studyId');
    
    if (!studyId) {
      return NextResponse.json([]);
    }

    const apiToken = process.env.MOVE_BANK_API_TOKEN;
    const service = new MovebankService(apiToken);
    const animals = await service.getAnimalsInStudy(parseInt(studyId));
    return NextResponse.json(animals);
  } catch (error: any) {
    console.error('Failed to fetch animals:', error.message);
    return NextResponse.json([]);
  }
}
