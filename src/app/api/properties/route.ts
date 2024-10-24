import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const formData = await request.formData(); // Extract data from the request

    // Manually map the formData values to an object
    const data = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        price: formData.get('price') as string,
        latitude: formData.get('latitude') as string,
        longitude: formData.get('longitude') as string,
        checkInTime: formData.get('checkInTime') as string,
        checkOutTime: formData.get('checkOutTime') as string,
        address: formData.get('address') as string,
        city: formData.get('city') as string,
        country: formData.get('country') as string,
        features: formData.getAll('features[]'),
        houseRules: formData.getAll('houseRules[]'),
        services: formData.getAll('services[]'),
        imageUrls: formData.getAll('imageUrls[]'), 
      };

    // Add property to Firestore
    const docRef = await firestore.collection('properties').add({
      ...data,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('Error adding property:', error);
    return NextResponse.json({ success: false, error: 'Error adding property' }, { status: 500 });
  }
}
