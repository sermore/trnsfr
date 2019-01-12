# trnsfr
A simple file sharing tool.

## Getting Started

It's a Node.js web application which permits the creation of **public** links with a unique path in the form of `/tranfers/unique-id`. Each link permits the download of a zip content.
The zip content is given by a list of glob patterns applied to the server's local file system.
Moreover it is possible to send one or more emails containing the above described link, with the addition of a subject and a message body.

### Admin section

The application has an admin section `/admin/transfers` protected by a basic authentication scheme, which permits the management of records containing the details for each public, unique, published path.

Each record is composed by the following fields:
- **unique-id**, automatically generated unique identifier which is used to build the public link path `/transfers/unqiue-id`;
- **Glob patterns**, a list of glob patterns, which, applied to the server's local file system, identify the content of the zip being downloaded;
- **Emails**, a list of email recipients; For each recipient an email will be sent with the specified subject, message body and download link;
- **Subject**, subject of the email;
- **Message**, message body of the email, except the download link which will be added at the bottom;
- **Enabled**, a flag to enable of disable the public link;
- **Enabled until**, a timestamp which permits to disable the link after the timestamp exiration;
- **Dwnlds**, number of times the content has been downloaded;
- **Last Dwnld**, last download timestamp;
- **Actions**, possible actions are the creation of a new record, the modification or deletion of an existing record and the download of the zip;


## Installation

The installation can follow standard node.js installation guidelines.
The file `environment.js` / `environment.prod.js` contains all the needed information in order to run the application in development or production modes.
environment content:
- **baseUrl**, path of the application, i.e. http://your-server/trsnsfr
- **dataFile**, path of the json file used to store the records, this location needs to have read/write permissions for the user who runs the application;
- **users**, list of accounts used for basic authentication
- **realm**, basic authentication realm,
- **publicUrl**, public url of the server, needed to create links inside email body;
- **from**, email sender address
- **smtpConfig**, smtp server configuration


Find below a basic systemd service configuration:
~~~
[Unit]
Description=Transfer Web Application
After=network.target

[Service]
User=trnsfr
Group=trnsfr
WorkingDirectory=/home/trnsfr/trnsfr
Environment=NODE_ENV=production
Environment=PORT=7654
Environment=USERS_ADMIN_PASSWORD=XXXX
Environment=PUBLIC_URL=http://your-public-server-address
Environment="EMAIL_FROM=Email sender <trnsfr@your-domain>"
Environment=SMTP_HOST=email-server
Environment=SMTP_PORT=465
Environment=SMTP_SECURE=true
Environment=SMTP_AUTH_USER=XXXX
Environment=SMTP_AUTH_PASS=XXXX
ExecStart=/path-to-node/node /path-to-application/bin/www
SuccessExitStatus=143
Restart=on-failure

[Install]
WantedBy=multi-user.target
~~~


