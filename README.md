# CRUD-API

### Notes for work ###
1. To install, create a `.env` file in the src folder with example
 ```bash
 PORT = 4000
```
Please note that the ".env" file must be in the same directory where the file "package.json".

And run the command
 ```bash
- npm install
```
Check your node version. Need 22.x.x version (22.14.0 or upper).

2.  Beginning of work.
Starting the program.
- Start for development. The application is run in development mode using nodemon:
 ```bash
- npm run start:dev
```
- Start for prodaction:
 ```bash
- npm run start:prod
```
- Start with a load balancer:
 ```bash
- npm run start:multi
```
- Start test. Will run 5 scenarios:
 ```bash
- npm run test
```

3. During check.
For easier verification, I leave examples for work. The number one at the end of the endpoint represents the existing user ID.

- GET
Returns a list of existing or existing users with the code 200
OK.

`http://localhost:4000/api/users`
`http://localhost:4000/api/users/1`

- POST
Will create a new user with the code 201
Created

`http://localhost:4000/api/users`
```
{
  "username": "Alex Bodnar",
  "age": 27,
  "hobbies": ["IT", "science", "Node"]
}
```
- PUT.
You can change both all data and individual parts.
Below are two working examples
 `http://localhost:4000/api/users/1`
```
 {
  "username": "Alex Smitt",
  "age": 28,
  "hobbies": ["IT", "science", "Node", "React"]
}
```
```
 {
  "username": "Lev",
  "hobbies": ["Game", "science", "sport"]
}
```
- DELETE
Delete and if successful return 204
No Content
`http://localhost:4000/api/users/1`