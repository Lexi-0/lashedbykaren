export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, hostel, room, service, addons, price, date, time, notes, bookingId } = req.body;

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  const html = `
    <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #FAF7F2; border-radius: 12px; overflow: hidden;">
      
      <!-- Header -->
      <div style="background: #2C2826; padding: 2rem 2.5rem;">
        <div style="font-family: Georgia, serif; font-size: 1.5rem; color: #FAF7F2; font-weight: 300;">
          Lash'd by <span style="color: #D4A5A0;">Karen</span>
        </div>
        <div style="font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(250,247,242,0.4); margin-top: 0.25rem;">
          New Booking Notification
        </div>
      </div>

      <!-- Body -->
      <div style="padding: 2rem 2.5rem;">
        <h2 style="font-family: Georgia, serif; font-weight: 300; font-size: 1.6rem; color: #2C2826; margin: 0 0 0.25rem;">
          New booking from <em style="color: #B07A75;">${name}</em>
        </h2>
        <p style="font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; color: #8E8680; margin: 0 0 2rem;">
          Booking ID: ${bookingId}
        </p>

        <!-- Details grid -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem;">
          ${row('Service', service)}
          ${row('Date', date)}
          ${row('Time', time)}
          ${addons ? row('Add-ons', addons) : ''}
          ${row('Total', `₦${Number(price).toLocaleString()}`)}
          <tr><td colspan="2" style="padding: 0.5rem 0;"><hr style="border: none; border-top: 1px solid #E8E0D8;"></td></tr>
          ${row('Phone', phone)}
          ${row('Hostel', hostel)}
          ${row('Room', room)}
          ${notes ? row('Notes', notes) : ''}
        </table>

        <div style="background: #F0EBE5; border-radius: 8px; padding: 1rem 1.25rem; font-size: 0.82rem; color: #8E8680;">
          Booked at ${new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
        </div>
      </div>

      <!-- Footer -->
      <div style="padding: 1.25rem 2.5rem; border-top: 1px solid #E8E0D8; font-size: 0.75rem; color: #8E8680;">
        Lash'd by Karen · Booking Management
      </div>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Lash\'d by Karen <onboarding@resend.dev>',
        to: 'opadijiayomipo@gmail.com',
        subject: `New Booking — ${name} · ${service} · ${date} at ${time}`,
        html
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Resend error:', err);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Notify error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

function row(label, value) {
  if (!value) return '';
  return `
    <tr>
      <td style="padding: 0.6rem 0; font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: #8E8680; width: 35%; vertical-align: top;">${label}</td>
      <td style="padding: 0.6rem 0; font-size: 0.9rem; color: #2C2826; font-weight: 400;">${value}</td>
    </tr>`;
}