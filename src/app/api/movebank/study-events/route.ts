import { NextRequest, NextResponse } from 'next/server';
import { MovebankService } from '../../../../services/movebank';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studyId = searchParams.get('studyId');
    const limit = parseInt(searchParams.get('limit') || '2000');
    
    if (!studyId) {
      return NextResponse.json([]);
    }

    const apiToken = process.env.MOVE_BANK_API_TOKEN;
    const service = new MovebankService(apiToken);
    
    const events = await service.getStudyEvents(parseInt(studyId), limit);
    return NextResponse.json(events);
  } catch (error: any) {
    console.error('Failed to fetch study events:', error.message);
    return NextResponse.json([]);
  }
}
