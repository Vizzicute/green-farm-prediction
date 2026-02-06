import nodemailer from "nodemailer";
import { adminGetSettingsByCategory } from "../../settings/action";
import { EmailSettings } from "@/schema/settings";

const emailParams = await adminGetSettingsByCategory("email");
const emailSettings = JSON.parse(emailParams!.value) as EmailSettings;

export const transporter = nodemailer.createTransport({
    host: emailSettings.smtpHost,
    port: Number(emailSettings.smtpPort),
    secure: true,
    auth: {
        user: emailSettings.smtpUser,
        pass: emailSettings.smtpPass,
    },
});