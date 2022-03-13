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
get data: POST -> / -> with {namespace:String} -> receive {success:Boolean, data:String}
set data: POST -> / -> with {namespace:String, data:String} -> receive {success:Boolean}
```

## Run

```sh
$ npm install
$ npm start
```

default settings is that if you don't specify the storage, it will use fileDB at './server/db.json'.  
if you want to use mongoDB, you need to specify the 'config.json' file or set a json in environment variable 'MongoDB_CONFIG'  
example:

```json
{
    "uri": "mongodb+srv://......",
    "db": "dbName",
    "collection": "collectionName"
}
```

save the file as 'config.json' in root folder or set an environment variable named 'MongoDB_CONFIG' which contains such string.
