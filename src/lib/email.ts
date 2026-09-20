// src/lib/email.ts
'use server'

import { Resend } from 'resend'
import type { Order, OrderItem } from './types'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
const REPLY_TO = process.env.RESEND_REPLY_TO || 'Nosta@manila.com'

// ============================================
// SHARED STYLES
// ============================================
const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center; border-bottom: 1px solid #eeeeee;">
              <h1 style="font-family: Georgia, serif; font-style: italic; font-size: 32px; font-weight: 900; color: #000000; margin: 0; letter-spacing: -0.5px;">
                NostalManila
              </h1>
              <p style="font-size: 10px; font-weight: 700; color: #999999; text-transform: uppercase; letter-spacing: 3px; margin: 8px 0 0 0;">
                Proudly Filipino
              </p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #fafafa; border-top: 1px solid #eeeeee; text-align: center;">
              <p style="font-size: 11px; color: #999999; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 2px;">
                Need help?
              </p>
              <p style="font-size: 13px; color: #666666; margin: 0 0 20px 0;">
                Email us at <a href="mailto:${REPLY_TO}" style="color: #000000; text-decoration: underline;">${REPLY_TO}</a>
              </p>
              <p style="font-size: 11px; color: #bbbbbb; margin: 0;">
                © ${new Date().getFullYear()} NostalManila. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

// ============================================
// SHARED COMPONENTS
// ============================================
const orderSummary = (order: Order, items: OrderItem[]) => {
  const formatPrice = (p: number) =>
    '₱' + Number(p).toLocaleString('en-PH')

  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td width="60" valign="top">
              <img src="${item.product_image || ''}" alt="${item.product_name}" width="60" style="display: block; width: 60px; height: 60px; object-fit: contain; background: #fafafa;" />
            </td>
            <td style="padding-left: 16px;" valign="middle">
              <p style="font-size: 13px; font-weight: 700; color: #000000; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 1px;">
                ${item.product_name}
              </p>
              <p style="font-size: 11px; color: #999999; margin: 0; text-transform: uppercase; letter-spacing: 1px;">
                Size: ${item.size} × ${item.quantity}
              </p>
            </td>
            <td align="right" valign="middle" style="font-size: 13px; font-weight: 700; color: #000000; white-space: nowrap;">
              ${formatPrice(item.subtotal)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `
    )
    .join('')

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
      ${itemsHtml}
    </table>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: #fafafa; padding: 16px;">
      <tr>
        <td style="font-size: 12px; color: #666666; padding: 6px 0; text-transform: uppercase; letter-spacing: 1px;">
          Subtotal
        </td>
        <td align="right" style="font-size: 12px; color: #000000; padding: 6px 0; font-weight: 700;">
          ${formatPrice(order.subtotal)}
        </td>
      </tr>
      <tr>
        <td style="font-size: 12px; color: #666666; padding: 6px 0; text-transform: uppercase; letter-spacing: 1px;">
          Shipping
        </td>
        <td align="right" style="font-size: 12px; color: #000000; padding: 6px 0; font-weight: 700;">
          ${Number(order.shipping_fee) === 0 ? 'FREE' : formatPrice(order.shipping_fee)}
        </td>
      </tr>
      <tr>
        <td style="font-size: 14px; color: #000000; padding: 12px 0 0 0; border-top: 1px solid #e5e5e5; text-transform: uppercase; letter-spacing: 2px; font-weight: 900;">
          Total
        </td>
        <td align="right" style="font-size: 18px; color: #000000; padding: 12px 0 0 0; border-top: 1px solid #e5e5e5; font-weight: 900;">
          ${formatPrice(order.total)}
        </td>
      </tr>
    </table>
  `
}

const ctaButton = (text: string, url: string) => `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0;">
    <tr>
      <td style="background-color: #000000; padding: 16px 32px;">
        <a href="${url}" style="color: #ffffff; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; text-decoration: none; display: inline-block;">
          ${text} →
        </a>
      </td>
    </tr>
  </table>
`

// ============================================
// EMAIL: ORDER CONFIRMED
// ============================================
export async function sendOrderConfirmedEmail(
  order: Order,
  items: OrderItem[]
) {
  const content = `
    <p style="font-size: 11px; font-weight: 700; color: #999999; text-transform: uppercase; letter-spacing: 3px; margin: 0 0 12px 0;">
      Order Confirmed
    </p>
    <h2 style="font-family: Georgia, serif; font-style: italic; font-size: 28px; color: #000000; margin: 0 0 20px 0; line-height: 1.2;">
      Salamat, ${order.customer_name.split(' ')[0]}!
    </h2>
    <p style="font-size: 15px; line-height: 1.6; color: #333333; margin: 0 0 24px 0;">
      Natanggap na namin ang order mo at kinukumpirma na namin ito. We'll start preparing your items right away.
    </p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: #fafafa; padding: 16px; margin-bottom: 24px;">
      <tr>
        <td style="font-size: 11px; color: #999999; text-transform: uppercase; letter-spacing: 2px; padding-bottom: 4px;">
          Order Number
        </td>
      </tr>
      <tr>
        <td style="font-family: 'Courier New', monospace; font-size: 20px; font-weight: 900; color: #000000; letter-spacing: 2px;">
          ${order.order_number}
        </td>
      </tr>
    </table>

    <p style="font-size: 11px; font-weight: 700; color: #999999; text-transform: uppercase; letter-spacing: 2px; margin: 24px 0 12px 0;">
      Order Summary
    </p>
    ${orderSummary(order, items)}

    <p style="font-size: 11px; font-weight: 700; color: #999999; text-transform: uppercase; letter-spacing: 2px; margin: 24px 0 12px 0;">
      Shipping Address
    </p>
    <p style="font-size: 14px; line-height: 1.6; color: #333333; margin: 0 0 24px 0; padding: 16px; background: #fafafa;">
      <strong>${order.customer_name}</strong><br />
      ${order.shipping_address}<br />
      ${order.customer_phone}
    </p>

    ${ctaButton('View Order', `https://nostalmanila.com/order/${order.order_number}`)}

    <p style="font-size: 13px; color: #666666; line-height: 1.6; margin: 24px 0 0 0;">
      Salamat sa pag-order! We'll notify you agad pag na-ship na yung order mo.
    </p>
  `

  try {
    const result = await resend.emails.send({
      from: `NostalManila <${FROM_EMAIL}>`,
      to: order.customer_email,
      replyTo: REPLY_TO,
      subject: `Order Confirmed — ${order.order_number}`,
      html: emailWrapper(content),
    })

    return { success: true, id: result.data?.id }
  } catch (err) {
    console.error('Email send error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

// ============================================
// EMAIL: ORDER SHIPPED
// ============================================
export async function sendOrderShippedEmail(
  order: Order,
  items: OrderItem[]
) {
  const content = `
    <p style="font-size: 11px; font-weight: 700; color: #999999; text-transform: uppercase; letter-spacing: 3px; margin: 0 0 12px 0;">
      On the way
    </p>
    <h2 style="font-family: Georgia, serif; font-style: italic; font-size: 28px; color: #000000; margin: 0 0 20px 0; line-height: 1.2;">
      Naka-ship na! 📦
    </h2>
    <p style="font-size: 15px; line-height: 1.6; color: #333333; margin: 0 0 24px 0;">
      Magandang balita, ${order.customer_name.split(' ')[0]}! Naka-ship na ang order mo. Expect mo na darating within a few days.
    </p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: #fafafa; padding: 16px; margin-bottom: 24px;">
      <tr>
        <td style="font-size: 11px; color: #999999; text-transform: uppercase; letter-spacing: 2px; padding-bottom: 4px;">
          Order Number
        </td>
      </tr>
      <tr>
        <td style="font-family: 'Courier New', monospace; font-size: 20px; font-weight: 900; color: #000000; letter-spacing: 2px;">
          ${order.order_number}
        </td>
      </tr>
    </table>

    <p style="font-size: 11px; font-weight: 700; color: #999999; text-transform: uppercase; letter-spacing: 2px; margin: 24px 0 12px 0;">
      Delivering to
    </p>
    <p style="font-size: 14px; line-height: 1.6; color: #333333; margin: 0 0 24px 0; padding: 16px; background: #fafafa;">
      <strong>${order.customer_name}</strong><br />
      ${order.shipping_address}<br />
      ${order.customer_phone}
    </p>

    <p style="font-size: 13px; color: #666666; line-height: 1.6; margin: 24px 0 0 0;">
      Please prepare yung payment kung COD. Salamat!
    </p>
  `

  try {
    const result = await resend.emails.send({
      from: `NostalManila <${FROM_EMAIL}>`,
      to: order.customer_email,
      replyTo: REPLY_TO,
      subject: `Order Shipped — ${order.order_number}`,
      html: emailWrapper(content),
    })

    return { success: true, id: result.data?.id }
  } catch (err) {
    console.error('Email send error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

// ============================================
// EMAIL: ORDER DELIVERED
// ============================================
export async function sendOrderDeliveredEmail(
  order: Order,
  items: OrderItem[]
) {
  const content = `
    <p style="font-size: 11px; font-weight: 700; color: #999999; text-transform: uppercase; letter-spacing: 3px; margin: 0 0 12px 0;">
      Delivered
    </p>
    <h2 style="font-family: Georgia, serif; font-style: italic; font-size: 28px; color: #000000; margin: 0 0 20px 0; line-height: 1.2;">
      Na-deliver na! 🎉
    </h2>
    <p style="font-size: 15px; line-height: 1.6; color: #333333; margin: 0 0 24px 0;">
      Sana nagustuhan mo yung order mo, ${order.customer_name.split(' ')[0]}! Thank you for supporting NostalManila.
    </p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: #fafafa; padding: 16px; margin-bottom: 24px;">
      <tr>
        <td style="font-size: 11px; color: #999999; text-transform: uppercase; letter-spacing: 2px; padding-bottom: 4px;">
          Order Number
        </td>
      </tr>
      <tr>
        <td style="font-family: 'Courier New', monospace; font-size: 20px; font-weight: 900; color: #000000; letter-spacing: 2px;">
          ${order.order_number}
        </td>
      </tr>
    </table>

    <p style="font-size: 13px; color: #666666; line-height: 1.6; margin: 24px 0 0 0;">
      May feedback ka? Reply ka lang sa email na 'to. We'd love to hear from you!
    </p>
  `

  try {
    const result = await resend.emails.send({
      from: `NostalManila <${FROM_EMAIL}>`,
      to: order.customer_email,
      replyTo: REPLY_TO,
      subject: `Order Delivered — ${order.order_number}`,
      html: emailWrapper(content),
    })

    return { success: true, id: result.data?.id }
  } catch (err) {
    console.error('Email send error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

// ============================================
// EMAIL: ORDER CANCELLED
// ============================================
export async function sendOrderCancelledEmail(
  order: Order,
  items: OrderItem[]
) {
  const content = `
    <p style="font-size: 11px; font-weight: 700; color: #999999; text-transform: uppercase; letter-spacing: 3px; margin: 0 0 12px 0;">
      Order Cancelled
    </p>
    <h2 style="font-family: Georgia, serif; font-style: italic; font-size: 28px; color: #000000; margin: 0 0 20px 0; line-height: 1.2;">
      Na-cancel ang order
    </h2>
    <p style="font-size: 15px; line-height: 1.6; color: #333333; margin: 0 0 24px 0;">
      Kumusta ${order.customer_name.split(' ')[0]}, na-cancel na yung order mo. Kung may questions ka, reply ka lang sa email na 'to.
    </p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: #fafafa; padding: 16px; margin-bottom: 24px;">
      <tr>
        <td style="font-size: 11px; color: #999999; text-transform: uppercase; letter-spacing: 2px; padding-bottom: 4px;">
          Order Number
        </td>
      </tr>
      <tr>
        <td style="font-family: 'Courier New', monospace; font-size: 20px; font-weight: 900; color: #000000; letter-spacing: 2px;">
          ${order.order_number}
        </td>
      </tr>
    </table>
  `

  try {
    const result = await resend.emails.send({
      from: `NostalManila <${FROM_EMAIL}>`,
      to: order.customer_email,
      replyTo: REPLY_TO,
      subject: `Order Cancelled — ${order.order_number}`,
      html: emailWrapper(content),
    })

    return { success: true, id: result.data?.id }
  } catch (err) {
    console.error('Email send error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}