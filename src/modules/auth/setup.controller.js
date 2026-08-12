import User from "../users/user.model.js";
import Role from "../roles/role.model.js";
import { hashPassword } from "../../shared/password.js";

export const createInitialAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, password } = req.body;

    // Validate required fields
    if (!firstName || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "firstName, email, mobile and password are required",
      });
    }

    // Find TRANZOOP_ADMIN role
    const adminRole = await Role.findOne({
      code: "TRANZOOP_ADMIN",
    });

    if (!adminRole) {
      return res.status(500).json({
        success: false,
        message: "TRANZOOP_ADMIN role not found",
      });
    }

    // Make sure an Admin does not already exist
    const existingAdmin = await User.findOne({
      roleId: adminRole._id,
    });

    if (existingAdmin) {
      return res.status(403).json({
        success: false,
        message: "Tranzoop Admin already exists",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedMobile = mobile.trim();

    // Check email
    const existingEmail = await User.findOne({
      email: normalizedEmail,
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Check mobile
    const existingMobile = await User.findOne({
      mobile: normalizedMobile,
    });

    if (existingMobile) {
      return res.status(409).json({
        success: false,
        message: "Mobile number already registered",
      });
    }

    // Hash password before storing
    const hashedPassword = await hashPassword(password);

    // Create Admin
    const admin = await User.create({
      firstName: firstName.trim(),
      lastName: lastName?.trim() || "",
      email: normalizedEmail,
      mobile: normalizedMobile,
      password: hashedPassword,
      roleId: adminRole._id,
      status: "ACTIVE",
      approvedAt: new Date(),
      approvedBy: null,
    });

    return res.status(201).json({
      success: true,
      message: "Tranzoop Admin created successfully",
      data: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        mobile: admin.mobile,
        role: "TRANZOOP_ADMIN",
        status: admin.status,
      },
    });
  } catch (error) {
    console.error("Create initial admin error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create Tranzoop Admin",
    });
  }
};
