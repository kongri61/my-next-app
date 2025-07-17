import { NextResponse } from 'next/server'
import { getProperties } from '@/lib/notion'

export async function GET() {
  try {
    const properties = await getProperties()
    return NextResponse.json(properties)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: '매물 데이터를 가져오는데 실패했습니다.' },
      { status: 500 }
    )
  }
} 