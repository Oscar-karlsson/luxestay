import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/clerk-sdk-node';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        // Fetch user data from Clerk
        const user = await clerkClient.users.getUser(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Extract only necessary fields
        const hostData = {
            firstName: user.firstName || 'Unknown',
            lastName: user.lastName || '',
            profileImageUrl: user.imageUrl || '/profile.png',
        };

        return NextResponse.json(hostData);
    } catch (error) {
        console.error('Error fetching host data:', error);
        return NextResponse.json({ error: 'Failed to fetch host data' }, { status: 500 });
    }
}