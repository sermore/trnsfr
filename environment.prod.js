const environment = {
    baseUrl: "/trnsf",
    dataFile: "./data.json",

    users: {
        admin: process.env.USERS_ADMIN_PASSWORD
    },
    realm: "transf43",

    publicUrl: process.env.PUBLIC_URL,
    from: process.env.EMAIL_FROM,
    smtpConfig: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE,
        auth: {
            user: process.env.SMTP_AUTH_USER,
            pass: process.env.SMTP_AUTH_PASS,
        }
    }
};

module.exports = environment;
