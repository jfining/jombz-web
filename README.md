# ayy it's jombz dot com boi

This repo is a nodejs application for random asks of the 902 crew.

## 902 Quotes

The first module is a web GUI for managing the quotes available to the 902 Quotes Alexa Skill.

`GET /902quotes` - The nodejs application renders the list of quotes that are maintained in a local copy named according to config.QUOTES_KEY.

`POST /902quotes` - The list of quotes are first persisted locally to config.QUOTES_KEY. Next, the quotes file is uploaded to S3 according to the config.QUOTES_BUCKET setting. Lastly, the router redirects you to `GET /902quotes`.

