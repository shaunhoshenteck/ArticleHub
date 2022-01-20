const express = require("express");
let router = express.Router();
require("dotenv").config();

const { User } = require("../../models/user_model");
const { checkLoggedIn } = require("../../middleware/auth");
const { grantAccess } = require("../../middleware/roles");
const { contactMail, registerEmail } = require("../../config/email");

// Register
router.post("/register", async (req, res) => {
  try {
    console.log(User);
    // Check if email is taken
    if (await User.emailTaken(req.body.email)) {
      return res.status(400).json({ message: "Sorry, email is taken" });
    }

    const user = new User({
      email: req.body.email,
      password: req.body.password,
    });

    // generate token
    const token = user.generateToken();
    const doc = await user.save();

    // send email to user for verification
    const emailToken = user.generateRegisterToken();
    await registerEmail(doc.email, emailToken);

    res.cookie("x-access-token", token).status(200).send(getUserProps(doc));
  } catch (err) {
    res.status(400).json({ message: "Error", error: err });
  }
});

// Sign-in
router.post("/signin", async (req, res) => {
  try {
    // Find User
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "Bad email" });
    }

    // Compare Password
    const compare = await user.comparePassword(req.body.password);
    if (!compare) {
      return res.status(400).json({ message: "Bad password" });
    }

    // Generate Token
    const token = user.generateToken();

    // Response
    res.cookie("x-access-token", token).status(200).send(getUserProps(user));
  } catch (err) {
    res.status(400).json({ message: "Error", error: err });
  }
});

router.get(
  "/profile",
  checkLoggedIn,
  grantAccess("readOwn", "profile"),
  async (req, res) => {
    try {
      const permission = res.locals.permission;
      const user = await User.findById(req.user._id);
      if (!user) return res.status(400).json({ message: "User Not Found" });
      res.status(200).send(permission.filter(user._doc));
    } catch (err) {
      return res.status(400).send(err);
    }
  }
);

router.patch(
  "/profile",
  checkLoggedIn,
  grantAccess("updateOwn", "profile"),
  async (req, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $set: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            age: req.body.age,
          },
        },
        { new: true, useFindAndModify: false }
      );

      if (!user) return res.status(400).json({ message: "User not found" });

      res.status(200).json(getUserProps(user));
    } catch (err) {
      res.status(400).json({ message: "Problem updating", error: err });
    }
  }
);

router.get("/isauth", checkLoggedIn, async (req, res) => {
  res.status(200).send(getUserProps(req.user));
});

router.patch(
  "/update_email",
  checkLoggedIn,
  grantAccess("updateOwn", "profile"),
  async (req, res) => {
    try {
      if (await User.emailTaken(req.body.newemail)) {
        return res.status(400).json({ message: "Sorry, email already taken" });
      }

      const user = await User.findOneAndUpdate(
        { _id: req.user._id, email: req.body.email },
        { email: req.body.newemail },
        { new: true, useFindAndModify: false }
      );

      console.log(user.email);

      if (!user) return res.status(400).json({ message: "User not found" });

      const token = user.generateToken();
      res
        .cookie("x-access-token", token)
        .status(200)
        .send({ email: user.email });
    } catch (err) {
      res.status(400).json({ message: "Problem updating", error: err });
    }
  }
);

router.post("/contact", async (req, res) => {
  try {
    await contactMail(req.body);
    res.status(200).send("ok");
  } catch (err) {
    res.status(400).json({ message: "Sorry, Try again later", error: err });
  }
});

router.get("/verify", async (req, res) => {
  try {
    console.log(req.query.validation);
    const token = User.validateToken(req.query.validation);
    const user = await User.findById(token._id);
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.verified)
      return res.status(400).json({ message: "Already verified" });

    user.verified = true;
    await user.save();
    res.status(200).send(getUserProps(user));
  } catch (err) {
    res.status(400).send(err);
  }
});

router.patch(
  "/upload_avatar",
  checkLoggedIn,
  grantAccess("updateOwn", "profile"),
  async (req, res) => {
    try {
      if ((await User.findById(req.body._id)) === null) {
        return res.status(400).json({ message: "ID does not exist" });
      }

      const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        { avatar: req.body.avatar },
        { new: true, useFindAndModify: false }
      );

      res.status(200).send({ avatar: user.avatar });
    } catch (err) {
      res.status(400).json({ message: "Problem updating", error: err });
    }
  }
);

const getUserProps = (props) => {
  return {
    _id: props._id,
    email: props.email,
    firstname: props.firstname,
    lastname: props.lastname,
    age: props.age,
    role: props.role,
    verified: props.verified,
    avatar: props.avatar,
  };
};

module.exports = router;
