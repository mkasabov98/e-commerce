import transporter from "../config/nodemailer";

interface OrderItem {
    name: string;
    quantity: number;
    priceAtPurchase: number;
}

export const sendWelcomeEmail = async (to: string): Promise<void> => {
    await transporter.sendMail({
        from: `"Shop" <${process.env.GMAIL_USER}>`,
        to,
        subject: "Welcome to Shop!",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">
                <h2 style="margin: 0 0 8px; color: #1a1a1a;">Welcome aboard!</h2>
                <p style="margin: 0 0 24px; color: #555; line-height: 1.6;">
                    Your account has been created successfully. You can now browse products,
                    save addresses, and place orders.
                </p>
                <p style="margin: 0; color: #999; font-size: 13px;">
                    If you didn't create this account, you can safely ignore this email.
                </p>
            </div>
        `,
    });
};

export const sendOrderShippedEmail = async (to: string, orderId: number): Promise<void> => {
    await transporter.sendMail({
        from: `"Shop" <${process.env.GMAIL_USER}>`,
        to,
        subject: `Order #${orderId} Shipped`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">
                <h2 style="margin: 0 0 8px; color: #1a1a1a;">Your order is on its way!</h2>
                <div style="background: #f9f9f9; border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
                    <p style="margin: 0 0 4px; font-size: 13px; color: #999;">Order</p>
                    <p style="margin: 0; font-weight: bold; color: #1a1a1a;">#${orderId}</p>
                </div>
                <p style="margin: 0 0 24px; color: #555; line-height: 1.6;">
                    Your order has been shipped and is on its way to you.
                </p>
                <p style="margin: 0; color: #999; font-size: 13px;">
                    You'll receive another email once your order has been moved to status delivered delivered (approximately 3 minutes).
                </p>
            </div>
        `,
    });
};

export const sendOrderDeliveredEmail = async (to: string, orderId: number): Promise<void> => {
    await transporter.sendMail({
        from: `"Shop" <${process.env.GMAIL_USER}>`,
        to,
        subject: `Order #${orderId} Delivered`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">
                <h2 style="margin: 0 0 8px; color: #1a1a1a;">Your order has been delivered!</h2>
                <div style="background: #f9f9f9; border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
                    <p style="margin: 0 0 4px; font-size: 13px; color: #999;">Order</p>
                    <p style="margin: 0; font-weight: bold; color: #1a1a1a;">#${orderId}</p>
                </div>
                <p style="margin: 0 0 24px; color: #555; line-height: 1.6;">
                    Your order has been delivered. We hope you enjoy your purchase!
                </p>
                <p style="margin: 0; color: #999; font-size: 13px;">
                    If you'd like to leave a review, visit the product page.
                </p>
            </div>
        `,
    });
};

export const sendOrderConfirmationEmail = async (
    to: string,
    orderId: number,
    items: OrderItem[],
    total: number,
    shippingAddress: string
): Promise<void> => {
    const itemRows = items
        .map(
            (item) => `
            <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #1a1a1a;">${item.name}</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #555; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #555; text-align: right;">$${(item.priceAtPurchase * item.quantity).toFixed(2)}</td>
            </tr>`
        )
        .join("");

    await transporter.sendMail({
        from: `"Shop" <${process.env.GMAIL_USER}>`,
        to,
        subject: `Order #${orderId} Confirmed`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">
                <h2 style="margin: 0 0 4px; color: #1a1a1a;">Order Confirmed</h2>
                <p style="margin: 0 0 24px; color: #555;">Your payment was successful. Here's a summary of your order.</p>

                <div style="background: #f9f9f9; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px;">
                    <p style="margin: 0 0 4px; font-size: 13px; color: #999;">Order</p>
                    <p style="margin: 0; font-weight: bold; color: #1a1a1a;">#${orderId}</p>
                </div>

                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="text-align: left; padding-bottom: 10px; color: #999; font-size: 12px; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #f0f0f0;">Product</th>
                            <th style="text-align: center; padding-bottom: 10px; color: #999; font-size: 12px; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #f0f0f0;">Qty</th>
                            <th style="text-align: right; padding-bottom: 10px; color: #999; font-size: 12px; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #f0f0f0;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemRows}
                    </tbody>
                </table>

                <div style="margin-top: 16px; text-align: right;">
                    <span style="font-size: 16px; font-weight: bold; color: #1a1a1a;">Total: $${Number(total).toFixed(2)}</span>
                </div>

                <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
                    <p style="margin: 0 0 4px; font-size: 13px; color: #999;">Shipping to</p>
                    <p style="margin: 0; color: #1a1a1a;">${shippingAddress}</p>
                </div>

                <p style="margin: 32px 0 0; color: #999; font-size: 12px;">
                    You will receive a shipping confirmation email in approximately 3 minutes,
                    followed by a delivery confirmation in approximately 3 more minutes.
                </p>
            </div>
        `,
    });
};
