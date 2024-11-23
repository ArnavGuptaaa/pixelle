import dotenv from "dotenv";
import handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";
import * as nodemailer from "nodemailer";

// Load environment variables
dotenv.config({ path: "./src/config/.env" });

export async function sendWelcomeEmail(username, email) {
	const __dirname = path.resolve();
	const filePath = path.join(
		__dirname,
		"..",
		"backend",
		"src",
		"emails",
		"welcomeEmail.html"
	);

	const source = fs.readFileSync(filePath, "utf-8");
	const template = handlebars.compile(source);

	const replacements = {
		username: username,
		year: new Date().getFullYear(),
	};

	const htmlToSend = template(replacements);

	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_APP_SPECIFIC_PASSWORD,
		},
	});

	const mailOptions = {
		from: '"noreply@yourdomain.com" <noreply@yourdomain.com>',
		to: email,
		subject: "Welcome to Pixelle!",
		html: htmlToSend,
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log("Email sent: " + info.response);
		}
	});
}
