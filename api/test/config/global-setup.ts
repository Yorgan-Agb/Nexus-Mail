import { execSync } from "node:child_process";
import { after, before, beforeEach, type TestContext } from "node:test";
import { prisma } from "../../src/models/index.ts";
import { app } from "../../src/app.ts";
import "dotenv/config";
import type { Server } from "node:http";

let server: Server;

const config = {
  port: process.env.PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
};

before(() => {
  execSync(`docker rm -f nexus-test 2>/dev/null || true`);

  execSync(`
    docker run                            \
      -d                                  \
      --name nexus-test                    \
      -p ${config.port}:5432                        \
      -e POSTGRES_USER=${config.user}          \
      -e POSTGRES_PASSWORD=${config.password}      \
      -e POSTGRES_DB=${config.database}            \
    postgres:18
  `);

  execSync(`sleep 1`);

  execSync(`npx prisma migrate deploy`);

  server = app.listen(process.env.PORT);
});

beforeEach(async (t) => {
  (t as TestContext).mock.method(console, "info", () => {});

  await truncateTables();
});

after(async () => {
  await prisma.$disconnect();

  execSync(`docker rm -f nexus-test`);

  server.close();
});

async function truncateTables() {
  await prisma.$executeRawUnsafe(`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'TRUNCATE TABLE "' || r.tablename || '" RESTART IDENTITY CASCADE';
      END LOOP;
    END $$;
  `);
}
