# API Documentation

- **/register (Method Type: POST)**: This endpoint expects a json body containing the user email
and password to register *{ "email": "<user's email>, "password": "<user's password>" }*. The
function of this endpoint as the name implies is to register the user i.e add the username and an
encryption of the their password to the database.
*Note: This endpoint makes validation of only the format of email address supplied and not the domain*
## Illustration:
	lq-mcdonald@lqmcdonald-HP-EliteBook-840-G3:~/Documents/E-Commerce-Website$ curl -XPOST -H "Content-Type: application/json" -d '{ "email": "mcdonald@Email.com", "password": "flexible164214" }' "0.0.0.0:5000/api/register" -v; echo ""
	Note: Unnecessary use of -X or --request, POST is already inferred.
	\*   Trying 0.0.0.0:5000...
	\* Connected to 0.0.0.0 (127.0.0.1) port 5000 (#0)
	> POST /api/register HTTP/1.1
	> Host: 0.0.0.0:5000
	> User-Agent: curl/7.85.0
	> Accept: */*
	> Content-Type: application/json
	> Content-Length: 63
	> 
	\* Mark bundle as not supporting multiuse
	< HTTP/1.1 201 Created
	< X-Powered-By: Express
	< Content-Type: application/json; charset=utf-8
	< Content-Length: 126
	< ETag: W/"7e-AqpQuu51cw2EEOt9AGwL/OV/WoE"
	< Date: Wed, 27 Mar 2024 12:55:22 GMT
	< Connection: keep-alive
	< Keep-Alive: timeout=5
	< 
	\* Connection #0 to host 0.0.0.0 left intact
	{"id":"6604173abbdae28299bb3f99","email":"mcdonald@Email.com","message":"mcdonald@Email.com has been registered successfully"}

- **/login (Method Type: POST)**: Authenticates the user credentials supplied in the *json* body and
generates a session token for the user. The session token is set in the headers and can be used to
authenticate the user in subsequent login and avoid the continuous need to send vital information.
## Illustration:
	lq-mcdonald@lqmcdonald-HP-EliteBook-840-G3:~/Documents/E-Commerce-Website$ curl -XPOST -H "Content-Type: application/json" -d '{ "email": "mcdonald@Email.com", "password": "flexible164214" }' "0.0.0.0:5000/api/login" -v; echo ""
	Note: Unnecessary use of -X or --request, POST is already inferred.
	\*   Trying 0.0.0.0:5000...
	\* Connected to 0.0.0.0 (127.0.0.1) port 5000 (#0)
	> POST /api/login HTTP/1.1
	> Host: 0.0.0.0:5000
	> User-Agent: curl/7.85.0
	> Accept: */*
	> Content-Type: application/json
	> Content-Length: 63
	> 
	\* Mark bundle as not supporting multiuse
	< HTTP/1.1 200 OK
	< X-Powered-By: Express
	< Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjA0MTczYWJiZGFlMjgyOTliYjNmOTkiLCJlbWFpbCI6Im1jZG9uYWxkQEVtYWlsLmNvbSIsImlhdCI6MTcxMTU0NDcxMCwiZXhwIjoxNzExNjMxMTEwfQ.W6gKi3q7ii1pk16bp5b2GzkGnUGBSs9I0XgJe0K3V1A
	< Content-Type: application/json; charset=utf-8
	< Content-Length: 30
	< ETag: W/"1e-DOWvfMhj05v4eN+mg6AlHJrIPp8"
	< Date: Wed, 27 Mar 2024 13:05:10 GMT
	< Connection: keep-alive
	< Keep-Alive: timeout=5
	< 
	\* Connection #0 to host 0.0.0.0 left intact
	{"message":"Login successful"}

- **/reset_password (Method Type GET)**: Generates and returns a reset password token which is used to reset the
user password.
## Illustration
	lq-mcdonald@lqmcdonald-HP-EliteBook-840-G3:~/Documents/E-Commerce-Website$ curl -XGET -H "Content-Type: application/json" -d '{ "email": "mcdonald@Email.com" }' "0.0.0.0:5000/api/reset_password" -v; echo ""
	\*   Trying 0.0.0.0:5000...
	\* Connected to 0.0.0.0 (127.0.0.1) port 5000 (#0)
	> GET /api/reset_password HTTP/1.1
	> Host: 0.0.0.0:5000
	> User-Agent: curl/7.85.0
	> Accept: */*
	> Content-Type: application/json
	> Content-Length: 33
	> 
	\* Mark bundle as not supporting multiuse
	< HTTP/1.1 200 OK
	< X-Powered-By: Express
	< Content-Type: application/json; charset=utf-8
	< Content-Length: 110
	< ETag: W/"6e-Wfvj9f+ttb+KSpuEZf2u4wCRQOk"
	< Date: Wed, 27 Mar 2024 13:43:32 GMT
	< Connection: keep-alive
	< Keep-Alive: timeout=5
	< 
	\* Connection #0 to host 0.0.0.0 left intact
	{"email":"mcdonald@Email.com","resetToken":"7c7f0b8615c6d1bb2259af2c3d3bb86d12f57f166f447658ab6d4f4f11ce58b0"}

- **/update_password (Method Type POST)**: From the information passed in the *json* body, this endpoint validates
the reset password token supplied and updates the user password to the one supplied.
*Note: Expected form of json body: { "email": "<EMAIL>", "resetToken": "<RESET TOKEN>", "newPassword": "<New Password>" }*
## Illustration:
	lq-mcdonald@lqmcdonald-HP-EliteBook-840-G3:~/Documents/E-Commerce-Website$ curl -XPATCH -H "Content-Type: application/json" -d '{ "email": "mcdonald@Email.com", "resetToken": "7c7f0b8615c6d1bb2259af2c3d3bb86d12f57f166f447658ab6d4f4f11ce58b0", "newPassword": "newFlexiblePassword164214" }' "0.0.0.0:5000/api/update_password" -v; echo ""
	\*   Trying 0.0.0.0:5000...
	\* Connected to 0.0.0.0 (127.0.0.1) port 5000 (#0)
	> PATCH /api/update_password HTTP/1.1
	> Host: 0.0.0.0:5000
	> User-Agent: curl/7.85.0
	> Accept: */*
	> Content-Type: application/json
	> Content-Length: 159
	> 
	\* Mark bundle as not supporting multiuse
	< HTTP/1.1 200 OK
	< X-Powered-By: Express
	< Content-Type: application/json; charset=utf-8
	< Content-Length: 43
	< ETag: W/"2b-BcqZXnJsIxPWaT5KqbeKFU83Xws"
	< Date: Wed, 27 Mar 2024 14:09:19 GMT
	< Connection: keep-alive
	< Keep-Alive: timeout=5
	< 
	\* Connection #0 to host 0.0.0.0 left intact
	{"message":"Password changed successfully"}

	lq-mcdonald@lqmcdonald-HP-EliteBook-840-G3:~/Documents/E-Commerce-Website$ curl -XPOST -H "Content-Type: application/json" -d '{ "email": "mcdonald@Email.com", "password": "flexible164214" }' "0.0.0.0:5000/api/login"; echo ""
	{"error":"Incorrect Password"}

	lq-mcdonald@lqmcdonald-HP-EliteBook-840-G3:~/Documents/E-Commerce-Website$ curl -XPOST -H "Content-Type: application/json" -d '{ "email": "mcdonald@Email.com", "password": "newFlexiblePassword164214" }' "0.0.0.0:5000/api/login" -v; echo ""
	Note: Unnecessary use of -X or --request, POST is already inferred.
	\*   Trying 0.0.0.0:5000...
	\* Connected to 0.0.0.0 (127.0.0.1) port 5000 (#0)
	> POST /api/login HTTP/1.1
	> Host: 0.0.0.0:5000
	> User-Agent: curl/7.85.0
	> Accept: */*
	> Content-Type: application/json
	> Content-Length: 74
	> 
	\* Mark bundle as not supporting multiuse
	< HTTP/1.1 200 OK
	< X-Powered-By: Express
	< Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjA0MTczYWJiZGFlMjgyOTliYjNmOTkiLCJlbWFpbCI6Im1jZG9uYWxkQEVtYWlsLmNvbSIsImlhdCI6MTcxMTU0ODc0MiwiZXhwIjoxNzExNjM1MTQyfQ.p69GYeqFSmAxd7_ia4DNAdP4loqBRSHJNKO7F7Pr4GU
	< Content-Type: application/json; charset=utf-8
	< Content-Length: 30
	< ETag: W/"1e-DOWvfMhj05v4eN+mg6AlHJrIPp8"
	< Date: Wed, 27 Mar 2024 14:12:22 GMT
	< Connection: keep-alive
	< Keep-Alive: timeout=5
	< 
	\* Connection #0 to host 0.0.0.0 left intact
	{"message":"Login successful"}

- **/logout (Method Type: POST)**: Invalidate the user's session token and nullifies its use via blacklisting

- **/products (Method Type: GET)**: Returns the list of products available in pages, 10 items per page.
By default, if no page number is supplied via the query parameter *page*, the first page is returned.
## Illustration:
	lq-mcdonald@lqmcdonald-HP-EliteBook-840-G3:~/Documents/E-Commerce-Website$ curl "0.0.0.0:5000/api/products"; echo ""
	[{"id":"65f91149722800702b7f6039","name":"T-shirt","price":"$20.99","category":"Apparel","quantity":100,"colors":["Black","White"],"sizes":["S","M","L"]},{"id":"65f91206722800702b7f603a","name":"Running Shoes","price":"$89.99","category":"Footwear","quantity":50,"colors":["Blue","Gray"],"sizes":[7,8,9]},{"id":"65f91739722800702b7f603b","name":"Smartphone","price":"$699.99","category":"Electronics","quantity":30,"colors":["Black"]},{"id":"65f91739722800702b7f603c","name":"Laptop","price":"$1199.99","category":"Electronics","quantity":20,"colors":["Silver"]},{"id":"65f91739722800702b7f603d","name":"Backpack","price":"$49.99","category":"Accessories","quantity":20,"colors":["Green","Blue","Black","Yello"]},{"id":"65f91739722800702b7f603e","name":"Sunglasses","price":"$29.99","category":"Accessories","quantity":120,"colors":["Black","Brown"]},{"id":"65f91739722800702b7f603f","name":"Watch","price":"$149.99","category":"Accessories","quantity":60,"colors":["Silver","Gold"]},{"id":"65f91739722800702b7f6040","name":"Hoodie","price":"$39.99","category":"Apparel","quantity":70,"colors":["Grey","Navy"],"sizes":["XS","S","M"]},{"id":"65f91739722800702b7f6041","name":"Sneakers","price":"$69.99","category":"Footwear","quantity":40,"colors":["White"],"sizes":[8,9,10]},{"id":"65f91739722800702b7f6042","name":"Portable Speaker","price":"$79.99","category":"Electronics","quantity":25,"colors":["Black","Red"]}]
	lq-mcdonald@lqmcdonald-HP-EliteBook-840-G3:~/Documents/E-Commerce-Website$ curl "0.0.0.0:5000/api/products?page=2"; echo ""
	[{"id":"65f96cd767fdfc4d76005495","name":"Deoderant","price":"$4.99","category":"Accessories","quantity":120,"colors":["Blue","Black","White","Pink"]},{"id":"65f96cd767fdfc4d76005496","name":"Hair Brush","price":"$0.99","category":"Accessories","quantity":75,"colors":["Brown","Black"]},{"id":"65f96cd767fdfc4d76005497","name":"Drum","price":"$35.99","category":"Utility","quantity":21},{"id":"65f96cd767fdfc4d76005498","name":"Cooking Gas","category":"Utility","quantity":16,"colors":["Sky Blue","Orange","Green"]},{"id":"65f96cd767fdfc4d76005499","name":"Electric cooker","price":"$29.99","category":"Electronics","quantity":77,"colors":["Silver","Black"]}]

- **/admin/products/add (Method Type: POST)**: Adds a new product to the database according to the
information supplied in the *json* body after successfully authenticating and authorizing the user.
## Illustration:
	lq-mcdonald@lqmcdonald-HP-EliteBook-840-G3:~/Documents/E-Commerce-Website$ curl -XPOST -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjAyYjRjNTQwMzY3NzNlZjFkODI2ZDUiLCJlbWFpbCI6ImFkbWluRW1haWxAYWRtaW4uY29tIiwiaWF0IjoxNzExNTc3OTM1LCJleHAiOjE3MTE2NjQzMzV9._7-fLbJu1tO7EnQp7TlCTKJqvZY9T47LQeBnEJcUOVU" -H "Content-Type: application/json" -d '{ "name": "PlayStation 6", "price": "$599.99", "quantity": 7, "description": "Have a good funtime in the comfort of your home with family and friends", "EDT": 1 }' "0.0.0.0:5000/api/admin/products/add" -v; echo ""
	Note: Unnecessary use of -X or --request, POST is already inferred.
	\*   Trying 0.0.0.0:5000...
	\* Connected to 0.0.0.0 (127.0.0.1) port 5000 (#0)
	> POST /api/admin/products/add HTTP/1.1
	> Host: 0.0.0.0:5000
	> User-Agent: curl/7.85.0
	> Accept: */*
	> Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjAyYjRjNTQwMzY3NzNlZjFkODI2ZDUiLCJlbWFpbCI6ImFkbWluRW1haWxAYWRtaW4uY29tIiwiaWF0IjoxNzExNTc3OTM1LCJleHAiOjE3MTE2NjQzMzV9._7-fLbJu1tO7EnQp7TlCTKJqvZY9T47LQeBnEJcUOVU
	> Content-Type: application/json
	> Content-Length: 162
	> 
	\* Mark bundle as not supporting multiuse
	< HTTP/1.1 201 Created
	< X-Powered-By: Express
	< Content-Type: application/json; charset=utf-8
	< Content-Length: 76
	< ETag: W/"4c-X3JNn4O15Zxwm7jNg4w4siDpkWE"
	< Date: Wed, 27 Mar 2024 22:27:11 GMT
	< Connection: keep-alive
	< Keep-Alive: timeout=5
	< 
	\* Connection #0 to host 0.0.0.0 left intact
	{"message":"New product added successfully","id":"66049d3f4e634d355316e9f2"}

	lq-mcdonald@lqmcdonald-HP-EliteBook-840-G3:~/Documents/E-Commerce-Website$ echo 'db.products.find({ name: 'PlayStation 6' })' | mongosh e_commerce_website
	e_commerce_website> db.products.find({ name: "PlayStation 6" })
	[
	  {
	    _id: ObjectId('66049d3f4e634d355316e9f2'),
	    name: 'PlayStation 6',
	    price: '$599.99',
	    quantity: 7,
	    description: 'Have a good funtime in the comfort of your home with family and friends',
	    EDT: 1
	  }
	]

- **/admin/products/:productId/remove (Method Type: DELETE)**: Removes a productcorresponding to the
supplied productId

- **/admin/products/:productId/edit (Method Type: PATCH)**: Updates the product with the information
supplied in the *json* *{ "name", "price", "quantity", "description", "EDT", "color", "sizes", "category" }* 
## Illustration:
	lq-mcdonald@lqmcdonald-HP-EliteBook-840-G3:~/Documents/E-Commerce-Website$ curl -XPATCH -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjAyYjRjNTQwMzY3NzNlZjFkODI2ZDUiLCJlbWFpbCI6ImFkbWluRW1haWxAYWRtaW4uY29tIiwiaWF0IjoxNzExNTc3OTM1LCJleHAiOjE3MTE2NjQzMzV9._7-fLbJu1tO7EnQp7TlCTKJqvZY9T47LQeBnEJcUOVU" -H "Content-Type: application/json" -d '{ "quantity": 10 }' "0.0.0.0:5000/api/admin/products/66049d3f4e634d355316e9f2/edit" -v; echo ""
	\*   Trying 0.0.0.0:5000...
	\* Connected to 0.0.0.0 (127.0.0.1) port 5000 (#0)
	> PATCH /api/admin/products/66049d3f4e634d355316e9f2/edit HTTP/1.1
	> Host: 0.0.0.0:5000
	> User-Agent: curl/7.85.0
	> Accept: */*
	> Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjAyYjRjNTQwMzY3NzNlZjFkODI2ZDUiLCJlbWFpbCI6ImFkbWluRW1haWxAYWRtaW4uY29tIiwiaWF0IjoxNzExNTc3OTM1LCJleHAiOjE3MTE2NjQzMzV9._7-fLbJu1tO7EnQp7TlCTKJqvZY9T47LQeBnEJcUOVU
	> Content-Type: application/json
	> Content-Length: 18
	> 
	\* Mark bundle as not supporting multiuse
	< HTTP/1.1 200 OK
	< X-Powered-By: Express
	< Content-Type: application/json; charset=utf-8
	< Content-Length: 39
	< ETag: W/"27-h/K1mAptFAmfB23fSnktPjgZNsw"
	< Date: Wed, 27 Mar 2024 22:31:54 GMT
	< Connection: keep-alive
	< Keep-Alive: timeout=5
	< 
	\* Connection #0 to host 0.0.0.0 left intact
	{"message":"Item updated successfully"}

	lq-mcdonald@lqmcdonald-HP-EliteBook-840-G3:~/Documents/E-Commerce-Website$ echo 'db.products.find({ name: "PlayStation 6" })' | mongosh e_commerce_website
	e_commerce_website> db.products.find({ name: "PlayStation 6" })
	[
	  {
	    _id: ObjectId('66049d3f4e634d355316e9f2'),
	    name: 'PlayStation 6',
	    price: '$599.99',
	    quantity: 10,
	    description: 'Have a good funtime in the comfort of your home with family and friends',
	    EDT: 1
	  }
	]

	lq-mcdonald@lqmcdonald-HP-EliteBook-840-G3:~/Documents/E-Commerce-Website$ curl -XPATCH -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjAyYjRjNTQwMzY3NzNlZjFkODI2ZDUiLCJlbWFpbCI6ImFkbWluRW1haWxAYWRtaW4uY29tIiwiaWF0IjoxNzExNTc3OTM1LCJleHAiOjE3MTE2NjQzMzV9._7-fLbJu1tO7EnQp7TlCTKJqvZY9T47LQeBnEJcUOVU" -H "Content-Type: application/json" -d '{ "quantity": 20 }' "0.0.0.0:5000/api/admin/products/66049d3f4e634d355316e9f2/edit" -v; echo ""
	\*   Trying 0.0.0.0:5000...
	\* Connected to 0.0.0.0 (127.0.0.1) port 5000 (#0)
	> PATCH /api/admin/products/66049d3f4e634d355316e9f2/edit HTTP/1.1
	> Host: 0.0.0.0:5000
	> User-Agent: curl/7.85.0
	> Accept: */*
	> Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjAyYjRjNTQwMzY3NzNlZjFkODI2ZDUiLCJlbWFpbCI6ImFkbWluRW1haWxAYWRtaW4uY29tIiwiaWF0IjoxNzExNTc3OTM1LCJleHAiOjE3MTE2NjQzMzV9._7-fLbJu1tO7EnQp7TlCTKJqvZY9T47LQeBnEJcUOVU
	> Content-Type: application/json
	> Content-Length: 18
	> 
	\* Mark bundle as not supporting multiuse
	< HTTP/1.1 200 OK
	< X-Powered-By: Express
	< Content-Type: application/json; charset=utf-8
	< Content-Length: 39
	< ETag: W/"27-h/K1mAptFAmfB23fSnktPjgZNsw"
	< Date: Thu, 28 Mar 2024 03:19:38 GMT
	< Connection: keep-alive
	< Keep-Alive: timeout=5
	< 
	\* Connection #0 to host 0.0.0.0 left intact
	{"message":"Item updated successfully"}

	lq-mcdonald@lqmcdonald-HP-EliteBook-840-G3:~/Documents/E-Commerce-Website$ echo 'db.products.find({ name: "PlayStation 6" })' | mongosh e_commerce_website
	ecommerce_website> db.products.find({ name: "PlayStation 6" })
	[
	  {
	    _id: ObjectId('66049d3f4e634d355316e9f2'),
	    name: 'PlayStation 6',
	    price: '$599.99',
	    quantity: 20,
	    description: 'Have a good funtime in the comfort of your home with family and friends',
	    EDT: 1
	  }
	]

- **/cart/add (Method Type: POST)**: Adds an item to the user's cart, information about the item
and quantity should be passed via query to the parameters *productName* and *qty*
*Form: http://0.0.0.0:5000/api/cart/add?productName=<NAME_OF_PRODUCT>&qty=<QUANTITY>*
## Illustration:
	lq-mcdonald@lqmcdonald-HP-EliteBook-840-G3:~/Documents/E-Commerce-Website$ curl -XPOST -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NWZjMjliMmMxNGJmODdlNDNmYjVmN2YiLCJlbWFpbCI6ImJvYkBkeWxhbi5jb20iLCJpYXQiOjE3MTEzNjg4NDksImV4cCI6MTcxMTQ1NTI0OX0.geTOYPJUVmQdF6mUHM8pf7Cj6axI_Y-bSNTGKCx8lqM" "0.0.0.0:5000/api/cart/add?productName=PlayStation+6&qty=2" -v; echo ""
	\*   Trying 0.0.0.0:5000...
	\* Connected to 0.0.0.0 (127.0.0.1) port 5000 (#0)
	> POST /api/cart/add?productName=PlayStation+6&qty=2 HTTP/1.1
	> Host: 0.0.0.0:5000
	> User-Agent: curl/7.85.0
	> Accept: */*
	> Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NWZjMjliMmMxNGJmODdlNDNmYjVmN2YiLCJlbWFpbCI6ImJvYkBkeWxhbi5jb20iLCJpYXQiOjE3MTEzNjg4NDksImV4cCI6MTcxMTQ1NTI0OX0.geTOYPJUVmQdF6mUHM8pf7Cj6axI_Y-bSNTGKCx8lqM
	> 
	\* Mark bundle as not supporting multiuse
	< HTTP/1.1 200 OK
	< X-Powered-By: Express
	< Set-Cookie: cart=%5B%7B%22id%22%3A%2266049d3f4e634d355316e9f2%22%2C%22name%22%3A%22PlayStation%206%22%2C%22price%22%3A%22%24599.99%22%2C%22EDT%22%3A1%2C%22qty%22%3A2%7D%5D; Path=/; Expires=Fri, 29 Mar 2024 03:40:30 GMT; HttpOnly
	< Content-Type: text/plain
	< Date: Thu, 28 Mar 2024 03:40:30 GMT
	< Connection: keep-alive
	< Keep-Alive: timeout=5
	< Transfer-Encoding: chunked
	< 
	\* Connection #0 to host 0.0.0.0 left intact
	Cart item added successfully

- **/cart (Method Type: GET)**: Retrieve and return the user cart information
## Illustration:
	lq-mcdonald@lqmcdonald-HP-EliteBook-840-G3:~/Documents/E-Commerce-Website$ curl -XGET -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NWZjMjliMmMxNGJmODdlNDNmYjVmN2YiLCJlbWFpbCI6ImJvYkBkeWxhbi5jb20iLCJpYXQiOjE3MTEzNjg4NDksImV4cCI6MTcxMTQ1NTI0OX0.geTOYPJUVmQdF6mUHM8pf7Cj6axI_Y-bSNTGKCx8lqM" -b "cart=%5B%7B%22id%22%3A%2266049d3f4e634d355316e9f2%22%2C%22name%22%3A%22PlayStation%206%22%2C%22price%22%3A%22%24599.99%22%2C%22EDT%22%3A1%2C%22qty%22%3A2%7D%5D" "0.0.0.0:5000/api/cart" -v; echo ""
	Note: Unnecessary use of -X or --request, GET is already inferred.
	\*   Trying 0.0.0.0:5000...
	\* Connected to 0.0.0.0 (127.0.0.1) port 5000 (#0)
	> GET /api/cart HTTP/1.1
	> Host: 0.0.0.0:5000
	> User-Agent: curl/7.85.0
	> Accept: */*
	> Cookie: cart=%5B%7B%22id%22%3A%2266049d3f4e634d355316e9f2%22%2C%22name%22%3A%22PlayStation%206%22%2C%22price%22%3A%22%24599.99%22%2C%22EDT%22%3A1%2C%22qty%22%3A2%7D%5D
	> Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NWZjMjliMmMxNGJmODdlNDNmYjVmN2YiLCJlbWFpbCI6ImJvYkBkeWxhbi5jb20iLCJpYXQiOjE3MTEzNjg4NDksImV4cCI6MTcxMTQ1NTI0OX0.geTOYPJUVmQdF6mUHM8pf7Cj6axI_Y-bSNTGKCx8lqM
	> 
	\* Mark bundle as not supporting multiuse
	< HTTP/1.1 200 OK
	< X-Powered-By: Express
	< Content-Type: application/json; charset=utf-8
	< Content-Length: 173
	< ETag: W/"ad-Xa83boxVGp2bgf1TsLTD09Mzy+A"
	< Date: Thu, 28 Mar 2024 04:45:29 GMT
	< Connection: keep-alive
	< Keep-Alive: timeout=5
	< 
	\* Connection #0 to host 0.0.0.0 left intact
	[{"id":"66049d3f4e634d355316e9f2","name":"PlayStation 6","price":"$599.99","EDT":"Fri Mar 29 2024 05:45:29 GMT+0100 (West Africa Standard Time)","qty":2,"total":"$1199.98"}]

- **/cart/remove (Method Type: DELETE)**: Removes an item from the users cart and updates the cart information.
## Illustration:
	lq-mcdonald@lqmcdonald-HP-EliteBook-840-G3:~/Documents/E-Commerce-Website$ curl -XDELETE -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NWZjMjliMmMxNGJmODdlNDNmYjVmN2YiLCJlbWFpbCI6ImJvYkBkeWxhbi5jb20iLCJpYXQiOjE3MTEzNjg4NDksImV4cCI6MTcxMTQ1NTI0OX0.geTOYPJUVmQdF6mUHM8pf7Cj6axI_Y-bSNTGKCx8lqM" -b "cart=%5B%7B%22id%22%3A%2265f96cd767fdfc4d76005491%22%2C%22name%22%3A%22Sandals%22%2C%22price%22%3A%22%247.99%22%2C%22qty%22%3A3%7D%5D" "0.0.0.0:5000/api/cart/remove?productName=Sandals" -v; echo ""
	\*   Trying 0.0.0.0:5000...
	\* Connected to 0.0.0.0 (127.0.0.1) port 5000 (#0)
	> DELETE /api/cart/remove?productName=Sandals HTTP/1.1
	> Host: 0.0.0.0:5000
	> User-Agent: curl/7.85.0
	> Accept: */*
	> Cookie: cart=%5B%7B%22id%22%3A%2265f96cd767fdfc4d76005491%22%2C%22name%22%3A%22Sandals%22%2C%22price%22%3A%22%247.99%22%2C%22qty%22%3A3%7D%5D
	> Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NWZjMjliMmMxNGJmODdlNDNmYjVmN2YiLCJlbWFpbCI6ImJvYkBkeWxhbi5jb20iLCJpYXQiOjE3MTEzNjg4NDksImV4cCI6MTcxMTQ1NTI0OX0.geTOYPJUVmQdF6mUHM8pf7Cj6axI_Y-bSNTGKCx8lqM
	> 
	\* Mark bundle as not supporting multiuse
	< HTTP/1.1 200 OK
	< X-Powered-By: Express
	< Set-Cookie: cart=%5B%5D; Path=/; Expires=Fri, 29 Mar 2024 11:52:41 GMT; HttpOnly
	< Content-Type: text/plain
	< Date: Thu, 28 Mar 2024 11:52:41 GMT
	< Connection: keep-alive
	< Keep-Alive: timeout=5
	< Transfer-Encoding: chunked
	< 
	\* Connection #0 to host 0.0.0.0 left intact
	Cart item removed successfully

- **/cart/update (Method Type: PATCH)**: Updates the items in a users cart.
## Illustration:
	lq-mcdonald@lqmcdonald-HP-EliteBook-840-G3:~/Documents/E-Commerce-Website$ curl -XPATCH -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NWZjMjliMmMxNGJmODdlNDNmYjVmN2YiLCJlbWFpbCI6ImJvYkBkeWxhbi5jb20iLCJpYXQiOjE3MTEzNjg4NDksImV4cCI6MTcxMTQ1NTI0OX0.geTOYPJUVmQdF6mUHM8pf7Cj6axI_Y-bSNTGKCx8lqM" -b "cart=%5B%7B%22id%22%3A%2265f96cd767fdfc4d76005491%22%2C%22name%22%3A%22Sandals%22%2C%22price%22%3A%22%247.99%22%2C%22qty%22%3A1%7D%5D" "0.0.0.0:5000/api/cart/update?productName=Sandals&qty=-3" -v; echo ""
	\*   Trying 0.0.0.0:5000...
	\* Connected to 0.0.0.0 (127.0.0.1) port 5000 (#0)
	> PATCH /api/cart/update?productName=Sandals&qty=-3 HTTP/1.1
	> Host: 0.0.0.0:5000
	> User-Agent: curl/7.85.0
	> Accept: */*
	> Cookie: cart=%5B%7B%22id%22%3A%2265f96cd767fdfc4d76005491%22%2C%22name%22%3A%22Sandals%22%2C%22price%22%3A%22%247.99%22%2C%22qty%22%3A1%7D%5D
	> Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NWZjMjliMmMxNGJmODdlNDNmYjVmN2YiLCJlbWFpbCI6ImJvYkBkeWxhbi5jb20iLCJpYXQiOjE3MTEzNjg4NDksImV4cCI6MTcxMTQ1NTI0OX0.geTOYPJUVmQdF6mUHM8pf7Cj6axI_Y-bSNTGKCx8lqM
	> 
	\* Mark bundle as not supporting multiuse
	< HTTP/1.1 200 OK
	< X-Powered-By: Express
	< Set-Cookie: cart=%5B%5D; Path=/; Expires=Fri, 29 Mar 2024 12:13:52 GMT; HttpOnly
	< Content-Type: text/plain
	< Date: Thu, 28 Mar 2024 12:13:52 GMT
	< Connection: keep-alive
	< Keep-Alive: timeout=5
	< Transfer-Encoding: chunked
	< 
	\* Connection #0 to host 0.0.0.0 left intact
	Cart item updated successfully

- **/orders/checkout (GET)**: Checks out the items in a users cart, the callback attached to this
endpoint organizes the items in the user's cart and stores them in the databse, to be available to
the user via the */users/orders* endpoint

- **/user/orders (Method Type)**: Returns the order history of the currently authenticated user,
this endpoint has pagination functionality, hence the order history can be navigated by passing a
*page* in the query parameter

- **/admin/order (Method Type: GET)**: Provides a list of all user orders with pagination (10 orders by page).
A *page* query parameter can be used to skip orders
## Illustration
	lq-mcdonald@lqmcdonald-HP-EliteBook-840-G3:~/Documents/E-Commerce-Website$ curl -XGET -H "Content-Type: application/json" -d '{ "email": "adminEmail@admin.com", "password": "e-commerce-website18/03/24" }' -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjAyYjRjNTQwMzY3NzNlZjFkODI2ZDUiLCJlbWFpbCI6ImFkbWluRW1haWxAYWRtaW4uY29tIiwiaWF0IjoxNzExNjM1NzMxLCJleHAiOjE3MTE3MjIxMzF9.BNZTFjp2O1uLP_MNZJ6UGyV66gD7AIsfedvgcG-rfNY" "0.0.0.0:5000/api/admin/orders" -v; echo ""
	\*   Trying 0.0.0.0:5000...
	\* Connected to 0.0.0.0 (127.0.0.1) port 5000 (#0)
	> GET /api/admin/orders HTTP/1.1
	> Host: 0.0.0.0:5000
	> User-Agent: curl/7.85.0
	> Accept: */*
	> Content-Type: application/json
	> Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjAyYjRjNTQwMzY3NzNlZjFkODI2ZDUiLCJlbWFpbCI6ImFkbWluRW1haWxAYWRtaW4uY29tIiwiaWF0IjoxNzExNjM1NzMxLCJleHAiOjE3MTE3MjIxMzF9.BNZTFjp2O1uLP_MNZJ6UGyV66gD7AIsfedvgcG-rfNY
	> Content-Length: 77
	> 
	\* Mark bundle as not supporting multiuse
	< HTTP/1.1 200 OK
	< X-Powered-By: Express
	< Content-Type: application/json; charset=utf-8
	< Content-Length: 1711
	< ETag: W/"6af-UVdYetGnDRZhZt/amMpp2xmlwxQ"
	< Date: Thu, 28 Mar 2024 14:29:54 GMT
	< Connection: keep-alive
	< Keep-Alive: timeout=5
	< 
	[{"_id":"660563e89dd40962a5d77e55","item":"Sandals","units":4,"price":"$7.99","orderTime":"2024-03-28T12:34:48.400Z","deliveryTime":"1970-01-01T00:00:00.000Z","total":31.96},{"_id":"660563e89dd40962a5d77e56","item":"MiFi","units":1,"price":"$9.99","orderTime":"2024-03-28T12:34:48.400Z","deliveryTime":"2024-03-29T12:34:48.400Z","total":9.99},{"_id":"660564e9e5baf661f215bc5c","item":"Sandals","units":4,"price":"$7.99","orderTime":"2024-03-28T12:39:05.263Z","deliveryTime":"1970-01-01T00:00:00.000Z","total":31.96},{"_id":"660564e9e5baf661f215bc5d","item":"MiFi","units":1,"price":"$9.99","orderTime":"2024-03-28T12:39:05.263Z","deliveryTime":"2024-03-29T12:39:05.263Z","total":9.99},{"_id":"660565d247565937a1ffafc0","item":"Sandals","units":4,"price":"$7.99","orderTime":"2024-03-28T12:42:58.543Z","deliveryTime":"1970-01-01T00:00:00.000Z","total":31.96},{"_id":"660565d247565937a1ffafc1","item":"MiFi","units":1,"price":"$9.99","orderTime":"2024-03-28T12:42:58.543Z","deliveryTime":"2024-03-29T12:42:58.543Z","total":9.9* Connection #0 to host 0.0.0.0 left intact
	9},{"_id":"6605662afe8bbddb29fde73a","item":"Sandals","units":4,"price":"$7.99","orderTime":"2024-03-28T12:44:26.440Z","deliveryTime":"1970-01-01T00:00:00.000Z","total":31.96},{"_id":"6605662afe8bbddb29fde73b","item":"MiFi","units":1,"price":"$9.99","orderTime":"2024-03-28T12:44:26.440Z","deliveryTime":"2024-03-29T12:44:26.440Z","total":9.99},{"_id":"6605665e534ac0045922368a","item":"Sandals","units":4,"price":"$7.99","orderTime":"2024-03-28T12:45:18.764Z","deliveryTime":"1970-01-01T00:00:00.000Z","total":31.96},{"_id":"6605665e534ac0045922368b","item":"MiFi","units":1,"price":"$9.99","orderTime":"2024-03-28T12:45:18.764Z","deliveryTime":"2024-03-29T12:45:18.764Z","total":9.99}]

- **/admin/orders/:orderId (Method Type: GET)**: Returns the order information of the order
corresponding to the orderId passed
## Illustration
	lq-mcdonald@lqmcdonald-HP-EliteBook-840-G3:~/Documents/E-Commerce-Website$ curl -XGET -H "Content-Type: application/json" -d '{ "email": "adminEmail@admin.com", "password": "e-commerce-website18/03/24" }' -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjAyYjRjNTQwMzY3NzNlZjFkODI2ZDUiLCJlbWFpbCI6ImFkbWluRW1haWxAYWRtaW4uY29tIiwiaWF0IjoxNzExNjM1NzMxLCJleHAiOjE3MTE3MjIxMzF9.BNZTFjp2O1uLP_MNZJ6UGyV66gD7AIsfedvgcG-rfNY" "0.0.0.0:5000/api/admin/orders/660563e89dd40962a5d77e55" -v; echo ""
	\*   Trying 0.0.0.0:5000...
	\* Connected to 0.0.0.0 (127.0.0.1) port 5000 (#0)
	> GET /api/admin/orders/660563e89dd40962a5d77e55 HTTP/1.1
	> Host: 0.0.0.0:5000
	> User-Agent: curl/7.85.0
	> Accept: */*
	> Content-Type: application/json
	> Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjAyYjRjNTQwMzY3NzNlZjFkODI2ZDUiLCJlbWFpbCI6ImFkbWluRW1haWxAYWRtaW4uY29tIiwiaWF0IjoxNzExNjM1NzMxLCJleHAiOjE3MTE3MjIxMzF9.BNZTFjp2O1uLP_MNZJ6UGyV66gD7AIsfedvgcG-rfNY
	> Content-Length: 77
	> 
	\* Mark bundle as not supporting multiuse
	< HTTP/1.1 200 OK
	< X-Powered-By: Express
	< Content-Type: application/json; charset=utf-8
	< Content-Length: 172
	< ETag: W/"ac-zmp59hxpohq7n1d27rCL72CKWA8"
	< Date: Thu, 28 Mar 2024 14:33:08 GMT
	< Connection: keep-alive
	< Keep-Alive: timeout=5
	< 
	\* Connection #0 to host 0.0.0.0 left intact
	{"_id":"660563e89dd40962a5d77e55","item":"Sandals","units":4,"price":"$7.99","orderTime":"2024-03-28T12:34:48.400Z","deliveryTime":"1970-01-01T00:00:00.000Z","total":31.96}

- **/admin/orders/user/:email (Method Type: GET)**: Returns the order history information of the user
account belonging to the email passed
