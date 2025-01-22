const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");


router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ message: "User Already Exists" }); // 400: Bad Request
    }


    const hashPassword = await bcrypt.hash(password, 10);


    const user = new User({ email, username, password: hashPassword });
    await user.save();

    res.status(200).json({ message: "Sign Up Successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: "User not found. Please Sign Up First" });
    }

    
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(200).json({ message: "Password is not correct" });
    }

    
    const { password: userPassword, ...others } = user._doc;
    res.status(200).json({ user: others }); // Return user without password
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
