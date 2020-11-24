# You 5aw 1t Too?! Express API!

This is a express api for my You 5aw 1t Too alien and ufo sightings forum?!
There are two databases and two endpoints for both the categories and for the sightings. 

All endpoints follow CRUD:
In the project Category only utilizes Get and Get by ID - examples for both are provided
In the project Sightings only utilizes Get and Post - examples for both are provided

# Category

### Show all categories

* URL

/api/category

* Method:

GET

* URL Params

None

* DATA Params

None

* Success Response:
   * Code: 200
      * Content: {"id":1,"title":"Alien"}

* Error Response:
   * Code: 404 NOT FOUND  
      * Content; "error": {"message": "Category not found"}

### Get Specific Category

* URL

/api/category/id

* Method

GET

* URL Params

id=[integer]

* DATA Params

None

* Success Response: 
   * Code: 200
      * Content: {"id":1,"title":"Alien"}
* Error Response:
   * Code: 404 Not Found
      * Content: error: {message: `Category not found`}


# Sightings

### Show all sightings
* URL

/api/sightings

* Method

GET

* URL Params

None

* DATA Params

None

* Success Response: 
   * Code: 200
      * Content: {"id":2,"location_name":"Nevada","date_viewed":"2020-10-15T00:00:00.000Z","category":"UFO","content":"UFO hovers over Area 51 in Hiko, NV","username":"Brandon"}
* Error Response:
   * Code: 404 Not Found
      * Content: eerror: {message: `Sighting not found`}

### Post new sighting

* URL

/api/sightings

* Method

POST

* URL Params

None

* DATA Params

{location_name,date_viewed, category_id, content,username}

* Success Response: 
   * Code: 200
      * Content: {"id":2,"location_name":"Nevada","date_viewed":"2020-10-15T00:00:00.000Z","category":"UFO","content":"UFO hovers over Area 51 in Hiko, NV","username":"Brandon"}
* Error Response:
   * Code: 404 Not Found
      * Content: eerror: {message: `Sighting not found`}



[Live Version](https://y51t.smonetc.vercel.app/)
[Client Repo](https://github.com/smonetc/y51t-client)

Tech used: Express, Node, Postgresql,knex,Chai