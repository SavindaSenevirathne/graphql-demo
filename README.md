# GraphQL Demo

## Structure
- `src`    - Contain source files.
- `prisma` - Contains prisma related files and sqlite database file.

## Installation
- Clone the repo.
- Run `npm install` to install dependencies.
- Run `npm run start` to start the application.
- Navigate to `localhost:4000` in your browser.

### Prisma Related
- `npx init` - To initialize prisma config files. (I have already done it).
- `npx prisma migrate dev --name "name"` - To generate migrations.
- `npx prisma studio` - GUI to view the database.