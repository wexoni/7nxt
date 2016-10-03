#CRUD Application using Hapi.js and MongoDB

##Intro
Application does not have UI. All communication is done using cURL or Postman.

##Endpoints:
Please ensure before sending data to server, that you have X-Authentication property in header of your reqeust. That header must have the following value: **letmein**

**GET**

GET --> localhost:XXXX/entities

GET --> localhost:XXXX/entities/_id

**POST / PATCH**

POST --> localhost:XXXX/entities

PATCH --> localhost:XXXX/entities/_id


Both POST and PATCH use the following JSON:
{
  "application": "I am awesome Application",
  "name": "Just a simple name",
  "access": {
    "apps": [
      "Hello",
      "World"
    ],
    "contexts": [
      "Hi",
      "Berlin"
    ]
  },
  "token": "15ffb169-c905-4694-90b5-cd4783b7950e",
  "_id": "99f19ad0-8947-11e6-8ed4-5710b9440656"
}


JSON is validated for presence, and in the case of array value, it is also validate for uniqueness.





