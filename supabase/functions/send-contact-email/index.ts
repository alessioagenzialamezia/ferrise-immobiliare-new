import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, email, phone, subject, message, property_id } = await req.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get Resend API key from environment variables
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not found in environment variables')
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create email content
    const emailSubject = `🏠 Nuovo Contatto: ${subject}`
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
        .footer { background: #1f2937; color: white; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #1e40af; }
        .value { margin-top: 5px; padding: 8px; background: white; border-radius: 4px; border-left: 3px solid #3b82f6; }
        .message-box { background: white; padding: 15px; border-radius: 8px; border: 1px solid #d1d5db; margin-top: 10px; }
        .property-ref { background: #fef3c7; padding: 10px; border-radius: 6px; border-left: 4px solid #f59e0b; margin-top: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 24px;">📧 Nuovo Messaggio di Contatto</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Ferriseimmobiliare.it</p>
        </div>
        
        <div class="content">
            <div class="field">
                <div class="label">👤 Nome Completo:</div>
                <div class="value">${name}</div>
            </div>
            
            <div class="field">
                <div class="label">📧 Email:</div>
                <div class="value"><a href="mailto:${email}" style="color: #1e40af; text-decoration: none;">${email}</a></div>
            </div>
            
            ${phone ? `
            <div class="field">
                <div class="label">📱 Telefono:</div>
                <div class="value"><a href="tel:${phone}" style="color: #1e40af; text-decoration: none;">${phone}</a></div>
            </div>
            ` : ''}
            
            <div class="field">
                <div class="label">📋 Oggetto:</div>
                <div class="value">${subject}</div>
            </div>
            
            <div class="field">
                <div class="label">💬 Messaggio:</div>
                <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
            </div>
            
            ${property_id ? `
            <div class="property-ref">
                <strong>🏠 Riferimento Proprietà:</strong> ${property_id}
            </div>
            ` : ''}
        </div>
        
        <div class="footer">
            <p style="margin: 0;">Messaggio inviato automaticamente dal sito <strong>Ferriseimmobiliare.it</strong></p>
            <p style="margin: 5px 0 0 0; opacity: 0.8;">📅 ${new Date().toLocaleString('it-IT', { 
              timeZone: 'Europe/Rome',
              year: 'numeric',
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
        </div>
    </div>
</body>
</html>
    `

    // Send email using Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Sito Web <noreply@ferriseimmobiliare.it>', // Dovrai configurare il dominio
        to: ['alessioferrisecasaemutui@gmail.com'],
        subject: emailSubject,
        html: emailHtml,
        // Fallback text version
        text: `
Nuovo messaggio di contatto ricevuto dal sito web:

DETTAGLI CONTATTO:
- Nome: ${name}
- Email: ${email}
- Telefono: ${phone || 'Non fornito'}
- Oggetto: ${subject}

MESSAGGIO:
${message}

${property_id ? `\nRIFERIMENTO PROPRIETÀ: ${property_id}` : ''}

---
Messaggio inviato automaticamente dal sito Ferriseimmobiliare.it
Data: ${new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' })}
        `.trim()
      })
    })

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text()
      console.error('Resend API error:', errorData)
      throw new Error(`Resend API error: ${resendResponse.status}`)
    }

    const resendData = await resendResponse.json()
    console.log('Email sent successfully via Resend:', resendData.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        emailId: resendData.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send email',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})