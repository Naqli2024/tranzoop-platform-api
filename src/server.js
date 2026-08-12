import app from "./app.js";
import { connectDatabase, env } from "./config/index.js";
import { seedRoles } from "./modules/roles/role.seed.js";

const startServer = async () => {
  await connectDatabase();
  await seedRoles();

  app.listen(env.PORT, () => {
    console.log(
      `Tranzoop Platform API running on port ${env.PORT}`
    );
  });
};

startServer();