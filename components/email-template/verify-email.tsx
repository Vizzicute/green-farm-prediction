import { env } from "@/schema/env";
import React from "react";

export function EmailVerificationTemplate({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) {
  // Inline styles are used because many email clients strip external styles.
  const bg = "#f6f9fc";
  const cardBg = "#ffffff";
  const brand = "#16a34a"; // green

  return (
    <html>
      <body style={{ backgroundColor: bg, margin: 0, padding: 0 }}>
        {/* Preheader: small text shown in inbox preview */}
        <div
          style={{
            display: "none",
            fontSize: 1,
            color: bg,
            lineHeight: "1px",
            maxHeight: 0,
            maxWidth: 0,
            opacity: 0,
            overflow: "hidden",
          }}
        >
          Verify your email for Green Farm Prediction — use the code to complete
          sign up.
        </div>

        <table
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          role="presentation"
          style={{
            fontFamily:
              "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
            WebkitFontSmoothing: "antialiased",
          }}
        >
          <tbody>
            <tr>
              <td align="center" style={{ padding: "32px 16px" }}>
                <table
                  width="600"
                  cellPadding={0}
                  cellSpacing={0}
                  role="presentation"
                  style={{ maxWidth: 600, width: "100%" }}
                >
                  <tbody>
                    <tr>
                      <td style={{ padding: "12px 24px", textAlign: "center" }}>
                        <div
                          style={{
                            display: "inline-block",
                            borderRadius: 8,
                            background: cardBg,
                            padding: 20,
                            width: "100%",
                            boxShadow: "0 6px 18px rgba(16,24,40,0.08)",
                          }}
                        >
                          <div
                            style={{ textAlign: "center", paddingBottom: 8 }}
                          >
                            {/* Simple inline SVG logo */}
                            <svg
                              width="48"
                              height="48"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ marginBottom: 8 }}
                            >
                              <rect
                                width="24"
                                height="24"
                                rx="6"
                                fill={brand}
                              />
                              <path
                                d="M7 13.5l3 3 7-9"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <h1
                              style={{
                                fontSize: 20,
                                margin: "6px 0 0",
                                color: "#0f172a",
                              }}
                            >
                              Verify your email
                            </h1>
                            <p
                              style={{
                                margin: "8px 0 0",
                                color: "#475569",
                                fontSize: 14,
                              }}
                            >
                              One more step to secure your Green Farm Prediction
                              account.
                            </p>
                          </div>

                          <div style={{ marginTop: 20, textAlign: "center" }}>
                            <p
                              style={{
                                margin: 0,
                                color: "#0f172a",
                                fontSize: 14,
                              }}
                            >
                              Hello {email},
                            </p>
                            <p
                              style={{
                                margin: "8px 0 16px",
                                color: "#475569",
                                fontSize: 14,
                              }}
                            >
                              Enter the following verification code to complete
                              sign up. This code will expire in a few minutes.
                            </p>

                            <div
                              style={{
                                display: "inline-block",
                                padding: "14px 18px",
                                borderRadius: 8,
                                background: "#f1f5f9",
                                marginBottom: 12,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 28,
                                  letterSpacing: 4,
                                  fontWeight: 700,
                                  color: "#0f172a",
                                  fontFamily:
                                    "Courier, 'Courier New', monospace",
                                }}
                              >
                                {otp}
                              </span>
                            </div>

                            <div style={{ marginTop: 6 }}>
                              <a
                                href={`${env.NEXT_PUBLIC_APP_URL}/verify-request?email=${email}`}
                                style={{
                                  display: "inline-block",
                                  textDecoration: "none",
                                  background: brand,
                                  color: "white",
                                  padding: "10px 18px",
                                  borderRadius: 8,
                                  fontWeight: 600,
                                  fontSize: 14,
                                }}
                              >
                                Verify
                              </a>
                            </div>

                            <p
                              style={{
                                marginTop: 18,
                                fontSize: 13,
                                color: "#64748b",
                              }}
                            >
                              Can’t use the button? Copy and paste this code
                              into the app: <br />
                              <strong style={{ wordBreak: "break-all" }}>
                                {otp}
                              </strong>
                            </p>
                          </div>

                          <hr
                            style={{
                              border: "none",
                              borderTop: "1px solid #eef2f7",
                              margin: "20px 0",
                            }}
                          />

                          <p
                            style={{
                              margin: 0,
                              color: "#94a3b8",
                              fontSize: 12,
                            }}
                          >
                            If you didn't request this, you can safely ignore
                            this email — no changes were made to your account.
                          </p>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td style={{ padding: "12px 24px", textAlign: "center" }}>
                        <p
                          style={{ margin: 0, color: "#94a3b8", fontSize: 12 }}
                        >
                          Green Farm Prediction
                        </p>
                        <p
                          style={{
                            margin: "4px 0 0",
                            color: "#94a3b8",
                            fontSize: 12,
                          }}
                        >
                          If you have questions, reply to this email.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
