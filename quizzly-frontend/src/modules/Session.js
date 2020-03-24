var Session = module.exports = {
  user: {

  },
  isPinLogin: true,
  isAdmin: function() {
    return this.user.role == 'admin';
  }
}
