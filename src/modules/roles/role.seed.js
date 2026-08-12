import Role from "./role.model.js";
import { ROLE_CODES } from "./role.constants.js";

export const seedRoles = async () => {
  const roles = [
    {
      name: "Platform User",
      code: ROLE_CODES.USER,
      description: "Default Tranzoop platform user",
    },
    {
      name: "Tranzoop Admin",
      code: ROLE_CODES.TRANZOOP_ADMIN,
      description: "Tranzoop platform administrator",
    },
    {
      name: "Tranzoop Staff",
      code: ROLE_CODES.TRANZOOP_STAFF,
      description: "Tranzoop platform staff member",
    },
    {
      name: "ERP Customer",
      code: ROLE_CODES.ERP_CUSTOMER,
      description: "Customer with ERP access",
    },
    {
      name: "Service Provider",
      code: ROLE_CODES.SERVICE_PROVIDER,
      description: "Service provider",
    },
  ];

  for (const role of roles) {
    await Role.updateOne(
      { code: role.code },
      { $setOnInsert: role },
      { upsert: true }
    );
  }

  console.log("Roles initialized");
};