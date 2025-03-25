# Trip  planner tech challenge

Present repo contains an express application that complies with received requirements. 

Application secrets should be placed in a `.env` file in project root. Please see `.env.example` for details. A working `.env` file will also be provided separately.
Tests can be run with `npm test`.
Application server can be  started locally with `npm start` and is reachable at `http://localhost:3000`.

This application implements a REST api endpoint `GET /api/v1/trips`. Endpoint is authenticated with a JWT token that must be provided as a bearer token in `Authorization` request header.
Token may be obtained with a request to `POST /api/v1/login`. In a production application, some kind of credentials should be provided to ths endpoint; in this situation, no user management was implemented, so ANY request to `POST /api/v1/login` returns a valid token that lasts for 1h. Please note, this is just to demonstrate how authentication should work.
Endpoint `GET /api/v1/trips` is powered by the external api provided. Alas, no documentation for the api was provided, so I am assuming that response of the given endpoint may vary in time even if the same parameters are provided. This implies that response cannot be cached and a real-time request must be performed for every `GET /api/v1/trips` request received. Please note that automated tests stub requests to this external api for result consistency.

Usage example:

```
curl --location --request POST 'localhost:3000/api/v1/login'
```

Response:

```
{
    "token": "<omitted>",
    "userId": "placeholder"
}
```

```
curl --location 'localhost:3000/api/v1/trips?origin=SYD&destination=MEL&sort_by=fastest' \
--header 'Authorization: Bearer <omitted>'
```

response:

```
{
    "message": "Fetched trips successfully.",
    "trips": [
        {
            "origin": "SYD",
            "destination": "MEL",
            "cost": 5149,
            "duration": 13,
            "type": "flight",
            "id": "16eb3de4-0a89-48b7-9436-9905a7154b08",
            "display_name": "from SYD to MEL by flight"
        },
        {
            "origin": "SYD",
            "destination": "MEL",
            "cost": 6695,
            "duration": 17,
            "type": "train",
            "id": "9f715bbc-bcf2-4033-96f5-47212b167aba",
            "display_name": "from SYD to MEL by train"
        },
        {
            "origin": "SYD",
            "destination": "MEL",
            "cost": 4035,
            "duration": 32,
            "type": "flight",
            "id": "df1d5d9c-9876-4d35-811e-4229f4ac62f8",
            "display_name": "from SYD to MEL by flight"
        },
        {
            "origin": "SYD",
            "destination": "MEL",
            "cost": 1098,
            "duration": 42,
            "type": "flight",
            "id": "b38e8a99-fb05-4752-892d-46454b8dc746",
            "display_name": "from SYD to MEL by flight"
        }
    ]
}
```