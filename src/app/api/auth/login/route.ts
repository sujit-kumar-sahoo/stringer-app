import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    // Validate input
    if (!username || !password) {
      return NextResponse.json({
        success: false,
        message: 'Username and password are required'
      }, { status: 400 });
    }

    // TODO: Replace this with your actual authentication logic
    // This is just a placeholder - you'll need to integrate with your auth service
    
    // Example: Call your authentication service/database
    // const authResult = await authenticateUser(username, password);
    
    // Placeholder authentication logic
    if (username === 'demo' && password === 'password') {
      // Generate or retrieve actual JWT token here
      const accessToken = 'your-jwt-token-here'; // Replace with actual token generation
      
      return NextResponse.json({
        success: true,
        data: {
          access_token: accessToken,
          user: {
            username: username,
            // Add other user data as needed
          }
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials'
      }, { status: 401 });
    }

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({
    message: 'This endpoint only accepts POST requests'
  }, { status: 405 });
}