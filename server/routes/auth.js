// GET LOGGED IN USER (Protected Route)
router.get('/me', verifyToken, async (req, res) => {
  try {
    // req.user.userId comes from the middleware!
    const user = await User.findById(req.user.userId).select('-password'); // '-password' hides the hash
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
});