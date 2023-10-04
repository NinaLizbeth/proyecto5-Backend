const User = require('../models/user.models');
const generateToken = require('../helpers/generateToken');
const encrypt = require('../helpers/encrypt');

export const obtenerUsuarios = async (req, res) => {
  res.status(200).json({ message: "Estos son todos los usuarios" });
};

export const crearUsuario = async (req, res) => {
  const usuario = req.body;
  const emailToLowerCase = usuario.email.toLowerCase();
  const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!regexPassword.test(usuario.password)) {
    return res
      .status(400)
      .json({
        message:
          "Su contraseña debe tener al menos 8 carácteres y contener una minúscula, una mayúscula y un número",
      });
  }
  const encryptedPassword = encrypt(password);
  const user = new User({
    ...usuario,
    email: emailToLowerCase,
    password: encryptedPassword,
  });
  try {
    const newUser = await user.save();
    const token = generateToken(newUser);
    res.status(201).json({
      message: "User created successfully",
      token,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
