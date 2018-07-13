####_lighthouse Server API with basic blog functionality

# Project ist still in pre-alpha state!

### Auth structure
```
{
    "auth": [100, "login", "password"],
    "lang": "en_US",
	"exec": [...]
}
```

### Post commands

## Create post -- postCreate
```
{
	"exec": [
		[
			"postCreate",
			[],
			{
				"title": "Hello World", 
				"content": "Create light for a inteligent future.", 
				"url": "hello-world", 
				"media": "http://some.media/url",
				"author": {"surname": "Test", "lastname": "Testowski", "username": "tester"}
			}
		]
	]
}
```
## Remove post -- postRemove
```
{
	"exec": [
		[
			"postRemove",
			[],
			{"url": "hello-world", id: "5b491226c7c9653e38369fa0"}
		]
	]
}
```
## List all posts -- postList
```
{
	"exec": [
		[
			"postList"
		]
	]
}
```