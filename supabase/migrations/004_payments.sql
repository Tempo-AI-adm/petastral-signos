CREATE TABLE payments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_data      jsonb NOT NULL,
  email         text NOT NULL,
  status        text NOT NULL DEFAULT 'pending',
  mp_payment_id text,
  mp_qr_code    text,
  mp_qr_code_base64 text,
  mp_ticket_url text,
  report_unlocked boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
