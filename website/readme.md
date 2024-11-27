# spotify oauth2 flow

## requirements

- docker
- make
- sqlite

## setup

- go to the [spotify developer dashboard](https://developer.spotify.com/dashboard) and create an app
    - website: `http://localhost:8000`
    - redirect uri: `http://localhost:8000/auth/callback`
    - apis: web api, web playback sdk

```bash
cp .env.example .env
# update client id and secret from developer dashboard
```

## run

```bash
make up
```

## test auth flow

```bash
curl http://localhost:8000/auth/login                                                                                22:11:23
# {"auth_url":"https://accounts.spotify.com/authorize?client_id=abcd1234&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fauth%2Fcallback"}%
```

- follow link in browser and authorize app
- check sqlite db for user session id

```bash
cd backend
sqlite spotify.db
sqlite> .tables
# user usersession
sqlite> select * from usersession;
```

| id | user_id | access_token | refresh_token | token_expires_at | created_at |
| --- | --- | --- | --- | --- | --- |
|1|1|abcd1234|abcd1234|2024-11-26 11:03:09.327418|2024-11-26 10:03:09.327634|
|2|1|abcd1234|abcd1234|2024-11-26 11:03:09.327418|2024-11-26 10:03:09.327634|

- test session id is valid

```bash
curl -H "X-Session-ID: 2" http://localhost:8000/spotify/me
# {"display_name":"Will","external_urls":{"spotify":"https://open.spotify.com/user/dsvj4c6772cqodl2i4q3196jb"},"followers":{"href":null,"total":4},"href":"https://api.spotify.com/v1/users/dsvj4c6772cqodl2i4q3196jb","id":"dsvj4c6772cqodl2i4q3196jb","images":[{"height":300,"url":"https://scontent-iad3-2.xx.fbcdn.net/v/t1.30497-1/84628273_176159830277856_972693363922829312_n.jpg?stp=c379.0.1290.1290a_dst-jpg_s320x320_tt6&_nc_cat=1&ccb=1-7&_nc_sid=7565cd&_nc_ohc=VvqJoWhsWNkQ7kNvgG0D3_j&_nc_zt=24&_nc_ht=scontent-iad3-2.xx&edm=AP4hL3IEAAAA&_nc_gid=AXMZB78eq54gcH7qGgKyh-F&oh=00_AYAGE_d0-FhjUb4A0CjGnodFvWDNsJzDIpZjlOyyvsqzFQ&oe=676E0019","width":300},{"height":64,"url":"https://scontent-iad3-2.xx.fbcdn.net/v/t1.30497-1/84628273_176159830277856_972693363922829312_n.jpg?stp=c379.0.1290.1290a_cp0_dst-jpg_s50x50_tt6&_nc_cat=1&ccb=1-7&_nc_sid=7565cd&_nc_ohc=VvqJoWhsWNkQ7kNvgG0D3_j&_nc_zt=24&_nc_ht=scontent-iad3-2.xx&edm=AP4hL3IEAAAA&_nc_gid=AXMZB78eq54gcH7qGgKyh-F&oh=00_AYCOOgV9SLCYsJClcLUHy6bBR39-EOeo-pPKSsiZQLq7bA&oe=676E0019","width":64}],"type":"user","uri":"spotify:user:dsvj4c6772cqodl2i4q3196jb"}%
```

## references

- [spotipy-dev/spotipy: A light weight Python library for the Spotify Web API](https://github.com/spotipy-dev/spotipy)
- [Home | Spotify for Developers](https://developer.spotify.com/)
