# ShareMe!

an online service just like <https://note.ms/>

## Architecture

```
                fetch/post data --->                   get/set data --->
 front-end                                  back-end                      database
           <--- send staic file, send data              <--- send data
```

## Database

support fileDB & mongoDB

## Fetch data via POST

```
get data: POST -> /:namespace  -> success 200&data, fail 400/405
set data: POST -> /:namespace  -> with data=string -> success 200, fail 400/500
application/x-www-form-urlencoded : data=string
application/json : {"data": "string"}
```

## Run

```sh
$ npm install
$ npm start
```

default settings is that if you don't specify the storage, it will use fileDB at "./.datebase.json".  
if you want to use mongoDB, you need to specify the ".env" file or set environment variable like:
example:

```js
MONGO_DB_URI=mongodb+srv://username:password@server
MONGO_DB_NAME=shareme_db
MONGO_DB_COLLECTION=shareme
PROJECT_KEY=fill_this_only_if_you_use_Deta_Base
BASE_NAME=fill_this_only_if_you_use_Deta_Base
```

save the file as ".env" in root folder or set them as environment variables  
we use MongoDB as primary database, but if want to use Deta Base for database  
but do not deploy this service to deta, you can leave MONGO_DB_URI in blank and  
set correct PROJECT_KEY in environment variables  
if you forget to set BASE_NAME, it will be "ShareMe" by default

## Deploy to Deta

You do not need to do anything with environment variables, as Deta will automatically  
use Data Base as its database, but if you specify MONGO_DB_URI, it will use MongoDB rather than Deta Base

the default BASE_NAME will be "ShareMe", but if do not like it, just specify BASE_NAME in environment variables  

[![Deploy](https://button.deta.dev/1/svg)](https://go.deta.dev/deploy?repo=https%3A%2F%2Fgithub.com%2FYieldRay%2FShareMe)
