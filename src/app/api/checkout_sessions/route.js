import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { getUserSession } from '@/lib/core/session'

export async function POST() {
    try {
        const user = await getUserSession();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized. Please login first.' },
                { status: 401 }
            );
        }

        const userId = user.id || user._id;
        const headersList = await headers()
        const origin = headersList.get('origin')

        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
            client_reference_id: userId.toString(),
            metadata: {
                userId: userId.toString()
            },
            line_items: [
                {
                    // Provide the exact Price ID (for example, price_1234) of the product you want to sell
                    price: 'price_1TlAw9Alomi13zcXPf0hFXSd',
                    quantity: 1,
                },
            ],
            mode: 'subscription', // Matching their subscription setting
            success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/payment`,
        });

        return NextResponse.json({ url: session.url });
    } catch (err) {
        console.error("Stripe checkout session creation error:", err);
        return NextResponse.json(
            { error: err.message },
            { status: err.statusCode || 500 }
        )
    }
}
