import jwt from 'jsonwebtoken';

export const login = async (req, res, next) => {
  try {
    const token = jwt.sign(
      {
        userId: 'placeholder'
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({ token: token, userId: 'placeholder' });
    return;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};