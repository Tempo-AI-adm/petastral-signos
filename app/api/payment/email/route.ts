import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://signopet.com.br'

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const { email, pet_nome, report_id } = await req.json()

    if (!email || !pet_nome || !report_id) {
      return NextResponse.json({ error: 'Campos obrigatórios: email, pet_nome, report_id' }, { status: 400 })
    }

    const laudoUrl = `${BASE_URL}/laudo/${report_id}`
    const whatsappText = encodeURIComponent(`Olha o laudo astral do(a) ${pet_nome}! 🐾 ${laudoUrl}`)
    const whatsappUrl = `https://wa.me/?text=${whatsappText}`

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Laudo de ${pet_nome} pronto!</title>
</head>
<body style="margin:0;padding:0;background:#f9f5ff;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f5ff;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed,#a855f7);padding:40px 32px;text-align:center;">
              <p style="margin:0 0 8px;color:#e9d5ff;font-size:14px;letter-spacing:1px;text-transform:uppercase;">SignoPet ✨</p>
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;">O laudo de ${pet_nome} está pronto!</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;text-align:center;">
              <p style="margin:0 0 32px;color:#4b5563;font-size:16px;line-height:1.6;">
                Clique no botão abaixo para acessar o laudo completo e descobrir o que os astros dizem sobre ${pet_nome}. 🌟
              </p>

              <!-- Primary CTA -->
              <a href="${laudoUrl}"
                 style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;padding:14px 36px;border-radius:8px;margin-bottom:16px;">
                Ver laudo completo 🐾
              </a>

              <br />

              <!-- Secondary CTA -->
              <a href="${whatsappUrl}"
                 style="display:inline-block;background:#25d366;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 28px;border-radius:8px;margin-top:8px;">
                Compartilhar no WhatsApp 💬
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;border-top:1px solid #f3f4f6;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                Você está recebendo este email porque realizou um pagamento no SignoPet.<br />
                © ${new Date().getFullYear()} SignoPet. Todos os direitos reservados.
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

    const { data, error } = await resend.emails.send({
      from: 'SignoPet <noreply@signopet.com.br>',
      to: email,
      subject: `O laudo completo de ${pet_nome} está pronto! 🐾`,
      html,
    })

    if (error) {
      console.error('[email] erro ao enviar:', error)
      return NextResponse.json({ error: 'Falha ao enviar email' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, id: data?.id })

  } catch (err) {
    console.error('[email] erro interno:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
