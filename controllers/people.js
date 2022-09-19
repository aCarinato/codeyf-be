export const getPeople = (req, res) => {
  try {
    res.json({ message: 'Hello from the server!' });
  } catch (err) {
    console.log(err);
  }
};
