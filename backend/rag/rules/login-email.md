# Login Page — Email Rules

- Use `input type="email"` with proper HTML5 validation
- Show an inline error message below the email field if the format is invalid (e.g. "Please enter a valid email address")
- Placeholder text must be exactly: `Email address`
- Include a "Forgot password?" link below the password field, right-aligned
- Submit button text must be exactly: `Sign in`
- No external libraries — inline styles only
- Use CSS variables from the global stylesheet:
  - `var(--accent)` for buttons and links
  - `var(--text)` for labels and input text
  - `var(--bg)` for the page/card background
  - `var(--border)` for input borders
