const EmailTemplate = require('email-templates');
const createTransport = require('nodemailer').createTransport;
const helpers = require('./helpers');
const environment = helpers.requireEnvironment();

function sendEmail(transfer) {
    const transport = createTransport(environment.smtpConfig);
    const env = process.env.NODE_ENV || 'development';
    const email = new EmailTemplate({
        message: {
            from: environment.from
        },
        // uncomment below to send emails in development/test env:
        send: true,
        transport: transport,
        subjectPrefix: env === 'production' ? false : `[${env.toUpperCase()}] `,
        views: {
            options: {
                extension: 'hbs'
            }
        }
    });

    for (let i = 0; i < transfer.emails.length; i++) {
        const to = transfer.emails[i];
        console.log(`send email to ${to}`);
        email.send({
            template: 'standard',
            message: {
                to: to
            },
            locals: {
                transfer: transfer,
                link: `${environment.publicUrl}/transfers/${transfer.id}`,
            }
        })
            .then(console.log)
            .catch(console.error);
    }
}

module.exports = sendEmail;