# Patient Record System for LFI Dental Clinic using Next.js

This is a project I've been building to learn more about the following technologies:

- [React.js](https://beta.reactjs.org/)/[Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [tRPC](https://trpc.io/)
- [Zod](https://github.com/colinhacks/zod)
- [Next Auth](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)

![Dashboard](https://i.imgur.com/U8VWs7y.png)
![Add Patient page](https://i.imgur.com/yX9Kwd9.png)

Anyone is free to inspect, copy, and modify the code that is published here. The files under `public/assets/` are assets provided by my fellow students at [Quezon City University](https://qcu.edu.ph/). Separate appropriate licenses apply to those works.

Special thanks to our beneficiaries at LFI Dental Clinic for their extensive guidance on how to build appropriate forms and user interface (UI) elements for this project.

The overall UI design for this project was created by Ms. [Marichelle Casbadillo](https://www.facebook.com/chelle.19casbadillo). The LFI Dental Clinic logo should be credited to Mr. [Mike Gester Sabuga](https://www.facebook.com/r.mikegester).

## Setup

This project uses MySQL for the database, and Node.js with NPM or Yarn for project management.

Run the following command to pull down the project dependencies:

```sh
$ yarn install # or npm install
```

Install your favorite distribution of MySQL or MariaDB, then create a `.env` file using the `.env.example` template.

```sh
$ cp .env.example .env
$ vi .env # remember to press :wq to quit!
```

Run the following command to apply the database schema to your database:

```sh
$ yarn run prisma db push # or npx prisma db push
```

Run the project with the following command:

```sh
$ yarn run dev
```

Register a user with the following command:

```sh
$ curl \
    -X POST \
    -H "Content-Type: application/json" \
    --data '{ "username": "admin", "password": "admin" }' \
    http://localhost:3000/api/register
```

This will create a user with the username and password `admin`. Make sure to use the correct base URL.

## License

```
Copyright 2023 Angelo Geulin

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
