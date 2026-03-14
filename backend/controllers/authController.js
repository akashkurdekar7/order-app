const User = require("../models/User");
const Order = require("../models/Order");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.registerUser = async (req, res) => {
  try {
    const {shopName, personName, aadhaar, location, phone, password} = req.body;

    const userExists = await User.findOne({phone}).select("+password");
    if (userExists) {
      return res.status(400).json({message: "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      shopName,
      personName,
      aadhaar,
      location,
      phone,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        shopName: user.shopName,
        personName: user.personName,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server error"});
  }
};

// LOGIN
// exports.loginUser = async (req, res) => {
//   try {
//     const {phone, password} = req.body;

//     // Hardcoded Admin Logic
//     if (phone === "9916390580" && password === "admin123") {
//       let adminUser = await User.findOne({phone: "9916390580"}).select(
//         "+password",
//       );
//       if (!adminUser) {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         adminUser = await User.create({
//           shopName: "Mane Traders",
//           personName: "Samarth Mane",
//           location: "Maratha Galli",
//           aadhaar: "123456789092",
//           phone: "9916390580",
//           password: hashedPassword,
//           role: "admin",
//         });
//       } else if (adminUser.role !== "admin") {
//         adminUser.role = "admin";
//         await adminUser.save();
//       }

//       const token = jwt.sign(
//         {id: adminUser._id, role: adminUser.role},
//         process.env.JWT_SECRET,
//         {expiresIn: "7d"},
//       );

//       return res.json({
//         message: "Admin login successful",
//         token,
//         user: {
//           _id: adminUser._id,
//           shopName: adminUser.shopName,
//           personName: adminUser.personName,
//           phone: adminUser.phone,
//           role: adminUser.role,
//         },
//       });
//     }

//     const user = await User.findOne({phone}).select("+password");
//     if (!user) {
//       return res.status(400).json({message: "Invalid credentials"});
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({message: "Invalid credentials"});
//     }

//     const token = jwt.sign(
//       {id: user._id, role: user.role},
//       process.env.JWT_SECRET,
//       {expiresIn: "7d"},
//     );

//     res.json({
//       message: "Login successful",
//       token,
//       user: {
//         _id: user._id,
//         shopName: user.shopName,
//         personName: user.personName,
//         phone: user.phone,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({message: "Server error"});
//   }
// };
exports.loginUser = async (req, res) => {
  try {
    const {phone, password} = req.body;

    /* ---------------- ADMIN LOGIN ---------------- */

    if (phone === "9916390580" && password === "admin123") {
      let adminUser = await User.findOne({phone: "9916390580"}).select(
        "+password",
      );

      if (!adminUser) {
        const hashedPassword = await bcrypt.hash(password, 10);

        adminUser = await User.create({
          shopName: "Mane Traders",
          personName: "Samarth Mane",
          location: "Maratha Galli",
          aadhaar: "123456789092",
          phone: "9916390580",
          password: hashedPassword,
          role: "admin",
        });
      } else if (adminUser.role !== "admin") {
        adminUser.role = "admin";
        await adminUser.save();
      }

      const token = jwt.sign(
        {id: adminUser._id, role: adminUser.role},
        process.env.JWT_SECRET,
        {expiresIn: "7d"},
      );

      return res.json({
        message: "Admin login successful",
        token,
        user: {
          _id: adminUser._id,
          shopName: adminUser.shopName,
          personName: adminUser.personName,
          phone: adminUser.phone,
          role: adminUser.role,
        },
      });
    }

    /* ---------------- HARD CODED USER LOGIN ---------------- */

    if (phone === "8867616139" && password === "akash123") {
      let normalUser = await User.findOne({phone: "8867616139"}).select(
        "+password",
      );

      if (!normalUser) {
        const hashedPassword = await bcrypt.hash(password, 10);

        normalUser = await User.create({
          shopName: "Akash",
          personName: "Demo User",
          location: "Bangalore",
          aadhaar: "111122223333",
          phone: "8867616139",
          password: hashedPassword,
          role: "user",
        });
      }

      const token = jwt.sign(
        {id: normalUser._id, role: normalUser.role},
        process.env.JWT_SECRET,
        {expiresIn: "7d"},
      );

      return res.json({
        message: "User login successful",
        token,
        user: {
          _id: normalUser._id,
          shopName: normalUser.shopName,
          personName: normalUser.personName,
          phone: normalUser.phone,
          role: normalUser.role,
        },
      });
    }

    /* ---------------- NORMAL DATABASE USER LOGIN ---------------- */

    const user = await User.findOne({phone}).select("+password");

    if (!user) {
      return res.status(400).json({message: "Invalid credentials"});
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({message: "Invalid credentials"});
    }

    const token = jwt.sign(
      {id: user._id, role: user.role},
      process.env.JWT_SECRET,
      {expiresIn: "7d"},
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        shopName: user.shopName,
        personName: user.personName,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server error"});
  }
};
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    user.shopName = req.body.shopName || user.shopName;
    user.personName = req.body.personName || user.personName;
    user.phone = req.body.phone || user.phone;
    user.location = req.body.location || user.location;

    if (req.file) {
      user.image = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      shopName: updatedUser.shopName,
      personName: updatedUser.personName,
      phone: updatedUser.phone,
      location: updatedUser.location,
      role: updatedUser.role,
      image: updatedUser.image,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server error"});
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({message: "Server error"});
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $match: {role: "user"},
      },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "user",
          as: "userOrders",
        },
      },
      {
        $project: {
          password: 0, // Exclude password
        },
      },
      {
        $addFields: {
          totalSales: {
            $sum: "$userOrders.totalAmount",
          },
          totalBalance: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$userOrders",
                    as: "order",
                    cond: {$eq: ["$$order.paymentStatus", "Pending"]},
                  },
                },
                as: "pendingOrder",
                in: "$$pendingOrder.totalAmount",
              },
            },
          },
          orderCount: {$size: "$userOrders"},
        },
      },
      {
        $project: {
          userOrders: 0, // Remove the full array after calculations to save bandwidth
        },
      },
    ]);
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server error"});
  }
};
