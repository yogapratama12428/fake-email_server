import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

// const users = [
//   { email: "yoga.pratama.pangestu@gmail.com" },
//   {
//     email: "yoga.pratama@gmail.com",
//   },
// ];

// async..await is not allowed in global scope, must use a wrapper
// send mail with defined transport object
const kirim_email = async () => {
  const info = await transporter.sendMail({
    from: "yoga.pratama.pangestu@gmail.com", // sender address
    to: "yoga.pratama.pangestu@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  //   secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "yoga.pratama.pangestu@gmail.com",
    pass: "rsjzjyqxvkhiofwk",
  },
});

app.get("/api/hello", async (req, res) => {
  res.status(200).json({ msg: "hello" });
});

app.get("/api/user/", async (req, res) => {
  try {
    const user = await prisma.user.findMany({});
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ msg: "not found" });
  }
});

app.post("/api/user", async (req, res) => {
  const { email, nama } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        email,
        nama,
      },
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(401).json({ msg: "Not Found" });
  }
});

app.put("/api/user/:id", async (req, res) => {
  const { id } = req.params;
  const { nama, email } = req.body;

  try {
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        nama,
        email,
      },
    });

    res.status(201).json({ msg: "success" });
  } catch (error) {
    res.status(401).json({ msg: "failed" });
  }
});

app.delete("/api/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: {
        id,
      },
    });

    res.status(200).json({ msg: "success" });
  } catch (error) {
    res.status(401).json({ msg: "error" });
  }
});

app.post("/api/alarm", async (req, res) => {
  const data = [];
  try {
    const users = await prisma.user.findMany({});
    users.map((user) => data.push(user.email));

    const info = await transporter.sendMail({
      from: "yoga.pratama.pangestu@gmail.com", // sender address
      to: [data], // list of receivers
      subject: "ini Alarm ✔", // Subject line
      text: "aku cinta padamu dhea noviza sayanggku tipang tipang palang palang", // plain text body
      html: "<b>Hello world?</b>", // html body
    });

    console.log(data);
    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  } catch (error) {}
});

app.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
