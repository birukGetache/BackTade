
module.exports.refreshToken = (req, res) => {
    const refreshToken = req.cookies.refresh_token;
  
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token missing or invalid' });
    }
  
    // Verify refresh token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Refresh token is not valid' });
      }
  
      // Generate new access token
      const newAccessToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // Set the new access token in the cookies
      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: true,  // Enable in production (over HTTPS)
        maxAge: 3600000,  // 1 hour
        sameSite: 'Strict',
      });
  
      res.json({ message: 'Access token refreshed' });
    });
  };
  