"use server"

// =============================================================================
// SENDGRID EMAIL INTEGRATION - CONFIGURED
// =============================================================================
import sgMail from "@sendgrid/mail"
import { createClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid"

// SendGrid Configuration
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

const EMAIL_FROM = process.env.EMAIL_FROM || "neochargeforyou@gmail.com"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://neochargee.vercel.app"

// =============================================================================
// SENDGRID EMAIL FUNCTIONS
// =============================================================================

export async function sendVerificationEmail(userId: string, email: string, name: string) {
  try {
    const supabase = createClient()

    // Generate verification token
    const token = uuidv4()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours from now

    // Save verification token to database
    const { error } = await supabase.from("email_verifications").insert([
      {
        user_id: userId,
        email,
        token,
        expires_at: expiresAt.toISOString(),
      },
    ])

    if (error) {
      console.error("Error saving verification token:", error)
      return { success: false, error: "Failed to generate verification token" }
    }

    const verificationLink = `${APP_URL}/verify-email?token=${token}`

    // SendGrid email configuration
    const msg = {
      to: email,
      from: {
        email: EMAIL_FROM,
        name: "NeoCharge",
      },
      subject: "Verify your email address - NeoCharge",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email - NeoCharge</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
            <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #3b82f6;">
              <h1 style="color: #3b82f6; margin: 0; font-size: 28px;">NeoCharge</h1>
              <p style="color: #666; margin: 5px 0 0 0;">Virtual Top-Up Made Easy</p>
            </div>
            
            <div style="padding: 30px 0;">
              <h2 style="color: #333; margin-bottom: 20px;">Welcome to NeoCharge!</h2>
              <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">Hello ${name},</p>
              <p style="color: #555; line-height: 1.6; margin-bottom: 30px;">
                Thank you for signing up for NeoCharge! We're excited to have you on board. 
                To get started, please verify your email address by clicking the button below:
              </p>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${verificationLink}" 
                   style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          font-weight: bold; 
                          font-size: 16px; 
                          display: inline-block;
                          box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">
                  Verify Email Address
                </a>
              </div>
              
              <p style="color: #555; line-height: 1.6; margin-bottom: 15px;">
                If the button doesn't work, you can also copy and paste the following link into your browser:
              </p>
              <p style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; word-break: break-all; font-family: monospace; font-size: 14px;">
                ${verificationLink}
              </p>
              
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 0 5px 5px 0;">
                <p style="color: #92400e; margin: 0; font-weight: bold;">⏰ Important:</p>
                <p style="color: #92400e; margin: 5px 0 0 0;">This verification link will expire in 24 hours.</p>
              </div>
              
              <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
                If you didn't create an account with NeoCharge, you can safely ignore this email.
              </p>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding: 20px 0; text-align: center;">
              <p style="color: #666; margin: 0; font-size: 14px;">
                Best regards,<br>
                <strong>The NeoCharge Team</strong>
              </p>
              <p style="color: #999; margin: 10px 0 0 0; font-size: 12px;">
                © 2024 NeoCharge. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    // Send email via SendGrid
    await sgMail.send(msg)
    console.log(`Verification email sent successfully to ${email}`)

    return { success: true }
  } catch (error) {
    console.error("Error sending verification email:", error)
    return { success: false, error: "Failed to send verification email" }
  }
}

export async function sendPasswordResetEmail(email: string) {
  try {
    const supabase = createClient()

    // Find user by email
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, first_name, last_name")
      .eq("email", email)
      .single()

    if (userError || !user) {
      return { success: true } // Don't reveal if email exists
    }

    // Generate reset token
    const token = uuidv4()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // 1 hour from now

    // Save reset token to database
    const { error } = await supabase.from("password_resets").insert([
      {
        user_id: user.id,
        token,
        expires_at: expiresAt.toISOString(),
      },
    ])

    if (error) {
      console.error("Error saving reset token:", error)
      return { success: false, error: "Failed to generate reset token" }
    }

    const resetLink = `${APP_URL}/reset-password?token=${token}`

    // SendGrid email configuration
    const msg = {
      to: email,
      from: {
        email: EMAIL_FROM,
        name: "NeoCharge",
      },
      subject: "Reset your password - NeoCharge",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password - NeoCharge</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
            <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #3b82f6;">
              <h1 style="color: #3b82f6; margin: 0; font-size: 28px;">NeoCharge</h1>
              <p style="color: #666; margin: 5px 0 0 0;">Virtual Top-Up Made Easy</p>
            </div>
            
            <div style="padding: 30px 0;">
              <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
              <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">Hello ${user.first_name} ${user.last_name},</p>
              <p style="color: #555; line-height: 1.6; margin-bottom: 30px;">
                We received a request to reset your password for your NeoCharge account. 
                Click the button below to create a new password:
              </p>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${resetLink}" 
                   style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          font-weight: bold; 
                          font-size: 16px; 
                          display: inline-block;
                          box-shadow: 0 4px 6px rgba(220, 38, 38, 0.3);">
                  Reset Password
                </a>
              </div>
              
              <p style="color: #555; line-height: 1.6; margin-bottom: 15px;">
                If the button doesn't work, you can also copy and paste the following link into your browser:
              </p>
              <p style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; word-break: break-all; font-family: monospace; font-size: 14px;">
                ${resetLink}
              </p>
              
              <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 0 5px 5px 0;">
                <p style="color: #dc2626; margin: 0; font-weight: bold;">⚠️ Security Notice:</p>
                <p style="color: #dc2626; margin: 5px 0 0 0;">This reset link will expire in 1 hour for your security.</p>
              </div>
              
              <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding: 20px 0; text-align: center;">
              <p style="color: #666; margin: 0; font-size: 14px;">
                Best regards,<br>
                <strong>The NeoCharge Team</strong>
              </p>
              <p style="color: #999; margin: 10px 0 0 0; font-size: 12px;">
                © 2024 NeoCharge. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    // Send email via SendGrid
    await sgMail.send(msg)
    console.log(`Password reset email sent successfully to ${email}`)

    return { success: true }
  } catch (error) {
    console.error("Error sending password reset email:", error)
    return { success: false, error: "Failed to send password reset email" }
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const msg = {
      to: email,
      from: {
        email: EMAIL_FROM,
        name: "NeoCharge",
      },
      subject: "Welcome to NeoCharge! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to NeoCharge</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
            <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #3b82f6;">
              <h1 style="color: #3b82f6; margin: 0; font-size: 28px;">🎉 Welcome to NeoCharge!</h1>
              <p style="color: #666; margin: 5px 0 0 0;">Your Virtual Top-Up Journey Starts Here</p>
            </div>
            
            <div style="padding: 30px 0;">
              <h2 style="color: #333; margin-bottom: 20px;">Hello ${name}! 👋</h2>
              <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
                Congratulations! Your NeoCharge account is now active and ready to use. 
                You can now enjoy seamless virtual top-ups for:
              </p>
              
              <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 20px; border-radius: 10px; margin: 20px 0;">
                <ul style="color: #0369a1; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">📱 <strong>Airtime</strong> - All major networks</li>
                  <li style="margin-bottom: 8px;">📊 <strong>Data Bundles</strong> - Affordable data plans</li>
                  <li style="margin-bottom: 8px;">⚡ <strong>Electricity Bills</strong> - Quick meter top-ups</li>
                  <li style="margin-bottom: 8px;">📺 <strong>TV Subscriptions</strong> - DStv, GOtv, and more</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${APP_URL}/dashboard" 
                   style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          font-weight: bold; 
                          font-size: 16px; 
                          display: inline-block;
                          box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                  Start Using NeoCharge
                </a>
              </div>
              
              <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0; border-radius: 0 5px 5px 0;">
                <p style="color: #15803d; margin: 0; font-weight: bold;">💡 Pro Tip:</p>
                <p style="color: #15803d; margin: 5px 0 0 0;">Fund your wallet first to enjoy instant transactions!</p>
              </div>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding: 20px 0; text-align: center;">
              <p style="color: #666; margin: 0; font-size: 14px;">
                Need help? Contact us at <a href="mailto:${EMAIL_FROM}" style="color: #3b82f6;">${EMAIL_FROM}</a>
              </p>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">
                Best regards,<br>
                <strong>The NeoCharge Team</strong>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    await sgMail.send(msg)
    console.log(`Welcome email sent successfully to ${email}`)
    return { success: true }
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return { success: false, error: "Failed to send welcome email" }
  }
}

export async function sendTransactionConfirmation(email: string, name: string, transaction: any) {
  try {
    const msg = {
      to: email,
      from: {
        email: EMAIL_FROM,
        name: "NeoCharge",
      },
      subject: `Transaction Confirmation - ₦${transaction.amount}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Transaction Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
            <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #3b82f6;">
              <h1 style="color: #3b82f6; margin: 0; font-size: 28px;">Transaction Successful ✅</h1>
            </div>
            
            <div style="padding: 30px 0;">
              <h2 style="color: #333; margin-bottom: 20px;">Hello ${name},</h2>
              <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
                Your transaction has been processed successfully!
              </p>
              
              <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #333; margin: 0 0 15px 0;">Transaction Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Amount:</td>
                    <td style="padding: 8px 0; color: #333;">₦${transaction.amount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Service:</td>
                    <td style="padding: 8px 0; color: #333;">${transaction.description}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Reference:</td>
                    <td style="padding: 8px 0; color: #333;">${transaction.reference}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Date:</td>
                    <td style="padding: 8px 0; color: #333;">${new Date().toLocaleString()}</td>
                  </tr>
                </table>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${APP_URL}/dashboard/transactions" 
                   style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); 
                          color: white; 
                          padding: 12px 25px; 
                          text-decoration: none; 
                          border-radius: 6px; 
                          font-weight: bold; 
                          display: inline-block;">
                  View Transaction History
                </a>
              </div>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding: 20px 0; text-align: center;">
              <p style="color: #666; margin: 0; font-size: 14px;">
                Thank you for using NeoCharge!
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    await sgMail.send(msg)
    console.log(`Transaction confirmation email sent to ${email}`)
    return { success: true }
  } catch (error) {
    console.error("Error sending transaction confirmation:", error)
    return { success: false, error: "Failed to send transaction confirmation" }
  }
}

// Verify email token (unchanged)
export async function verifyEmailToken(token: string) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("email_verifications").select("*").eq("token", token).single()

    if (error || !data) {
      return { success: false, error: "Invalid or expired verification token" }
    }

    if (new Date(data.expires_at) < new Date()) {
      return { success: false, error: "Verification token has expired" }
    }

    const { error: updateError } = await supabase.from("users").update({ email_verified: true }).eq("id", data.user_id)

    if (updateError) {
      console.error("Error updating user verification status:", updateError)
      return { success: false, error: "Failed to verify email" }
    }

    await supabase.from("email_verifications").delete().eq("token", token)

    return { success: true }
  } catch (error) {
    console.error("Error verifying email token:", error)
    return { success: false, error: "An error occurred while verifying your email" }
  }
}
