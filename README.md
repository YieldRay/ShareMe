# ShareMe!

An online service just like <https://note.ms/>  
It is compatible with note.ms's principal function

## Architecture

```
                fetch/post data --->                   get/set data --->
 front-end                                  back-end                      database
           <--- send staic file, send data              <--- send data
```

## Database

support MongoDB & Deta_Base & save_as_file

## Fetch data via POST

here use form field "t" to make it compatible with note.ms

```
get data: POST -> /:namespace  -> success 200&data, fail 400/405
set data: POST -> /:namespace  -> with data=string -> success 200, fail 400/500
application/x-www-form-urlencoded  t=string
application/json                   {"t":"string"}
```

## Interact using curl

example

```sh
# Get data in namespace 'test', no need to specify as POST
$ curl 127.0.0.1/test
# Set data to namespace 'test', use t=...
$ curl -d t=some_text_to_be_stored 127.0.0.1/test
```

note.ms supports getting data via curl but not setting data

## Run

```sh
$ npm install
$ npm start
```

default settings is that if you don't specify the storage, it will use fileDB at "./.datebase.json".  
if you want to use a database, you need to specify the ".env" file or set environment variable like:  
example:

```js
MONGO_DB_URI=mongodb+srv://username:password@server
MONGO_DB_NAME=shareme_db
MONGO_DB_COLLECTION=shareme
PROJECT_KEY=fill_this_only_if_you_use_Deta_Base
BASE_NAME=fill_this_only_if_you_use_Deta_Base
```

save the file as ".env" in root folder for develop,  
or set them as environment variables for official service,  
fill all field that mongoDB needed for using mongoDB,  
otherwise we fallback to Deta base using PROJECT_KEY (get it from Deta),  
if you forget to set BASE_NAME, it will be "ShareMe" by default,  
and if no database is correct configured, will store data to "./.datebase.json"

## Deploy to Deta

For deploying to Deta, you do not need to do anything with environment variables,  
as Deta will automatically use Data Base as its database,  
but if you specify MONGO_DB_URI, it will use MongoDB intead

the default BASE_NAME will be "ShareMe", but if do not like it, just specify BASE_NAME in environment variables

[![Deploy](https://button.deta.dev/1/svg)](https://go.deta.dev/deploy?repo=https%3A%2F%2Fgithub.com%2FYieldRay%2FShareMe)
