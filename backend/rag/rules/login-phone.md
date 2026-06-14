# Login Page — Phone / OTP Rules

- Use `input type="tel"` for the phone number input
- Include a country code selector defaulting to `+98`
- The form has two steps managed entirely in component state (no page reload):
  - Step 1: user enters phone number → submit button text: `Send code`
  - Step 2: show a separate OTP input → submit button text: `Verify`
- Phone input placeholder must be exactly: `Phone number`
- No external libraries — inline styles only
- Use CSS variables from the global stylesheet:
  - `var(--accent)` for buttons and links
  - `var(--text)` for labels and input text
  - `var(--bg)` for the page/card background
  - `var(--border)` for input borders
