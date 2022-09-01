# Lab

```sh
curl https://raw.githubusercontent.com/swagger-api/swagger-samples/master/java/inflector-dropwizard/src/main/swagger/swagger.yaml | jexp '.tags'
```

Error:

extension .io"
 not supported

Example:

 ```sh
 jexp '.tags.filter(p=> p.externalDocs).map(p=> {name:p.name,desc:p.externalDocs.description})' ./data/swagger.yaml  -o json -b
 ```

 Result:

 ```json
 [
  {
    "name": "pet",
    "desc": "Find out more"
  },
  {
    "name": "user",
    "desc": "Find out more about our store"
  }
]
 ```
 