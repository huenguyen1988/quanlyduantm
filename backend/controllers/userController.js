const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Log = require('../models/log');

// Đăng ký
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email đã tồn tại' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    // Log if has actor (admin creating user)
    if (req.user) {
      await Log.create({
        action: 'create',
        module: 'user',
        actorId: req.user.userId,
        actorName: req.user.name || '',
        targetId: user._id,
        targetName: user.name,
        targetEmail: user.email,
        details: { role }
      });
    }
    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Sai email hoặc mật khẩu' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Sai email hoặc mật khẩu' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy danh sách user (chỉ admin)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật user
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }

    // Check if email is being changed and if new email is already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email đã tồn tại' });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (role) user.role = role;
    
    await user.save();
    // Log update
    if (req.user) {
      await Log.create({
        action: 'update',
        module: 'user',
        actorId: req.user.userId,
        actorName: req.user.name || '',
        targetId: user._id,
        targetName: user.name,
        targetEmail: user.email,
        details: { name: !!name, email: !!email, role: !!role }
      });
    }
    res.json({ message: 'Cập nhật thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa user theo id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    if (req.user) {
      await Log.create({
        action: 'delete',
        module: 'user',
        actorId: req.user.userId,
        actorName: req.user.name || '',
        targetId: user._id,
        targetName: user.name,
        targetEmail: user.email
      });
    }
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 

// Đổi mật khẩu (user tự đổi)
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Thiếu thông tin mật khẩu' });
    }
    const userId = req.user && req.user.userId ? req.user.userId : null;
    if (!userId) return res.status(401).json({ error: 'Không xác thực' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Mật khẩu cũ không đúng' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};