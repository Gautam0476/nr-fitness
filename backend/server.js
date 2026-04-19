const crypto = require('crypto');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.set('strictQuery', true);

function buildMongoUri() {
  const rawUri = process.env.MONGO_URI;

  if (!rawUri) {
    throw new Error('MONGO_URI is missing in backend/.env');
  }

  const dbName = process.env.DB_NAME || 'myy_app';
  const [baseUri, queryString] = rawUri.split('?');

  if (!baseUri.startsWith('mongodb://') && !baseUri.startsWith('mongodb+srv://')) {
    throw new Error('Invalid MONGO_URI format: expected mongodb:// or mongodb+srv://');
  }

  const schemeSeparatorIndex = baseUri.indexOf('://');
  const firstPathSlashIndex = baseUri.indexOf('/', schemeSeparatorIndex + 3);

  if (firstPathSlashIndex === -1) {
    return `${baseUri}/${dbName}${queryString ? `?${queryString}` : ''}`;
  }

  const pathPart = baseUri.slice(firstPathSlashIndex);

  if (pathPart === '' || pathPart === '/') {
    return `${baseUri.slice(0, firstPathSlashIndex)}/${dbName}${queryString ? `?${queryString}` : ''}`;
  }

  return rawUri;
}

async function connectDatabase() {
  try {
    await mongoose.connect(buildMongoUri(), {
      serverSelectionTimeoutMS: 10000
    });
    console.log('Database Connected Successfully!');
  } catch (err) {
    console.error('DB Connection Error:', err.message);
    process.exit(1);
  }
}

function normalizeEmail(email = '') {
  return email.trim().toLowerCase();
}

function isValidEmail(email = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function normalizePhone(phone = '') {
  return phone.replace(/\D/g, '');
}

function isValidPhone(phone = '') {
  const digits = normalizePhone(phone);
  return digits.length >= 10 && digits.length <= 12;
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function getMissingFields(payload, fields) {
  return fields.filter((field) => !String(payload[field] || '').trim());
}

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, trim: true, default: '' },
    formType: { type: String, required: true, trim: true },
    source: { type: String, required: true, trim: true }
  },
  {
    timestamps: true,
    collection: 'inquiries'
  }
);

const membershipSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    plan: { type: String, required: true, trim: true },
    comments: { type: String, trim: true, default: '' },
    source: { type: String, required: true, trim: true, default: 'membership_registration' }
  },
  {
    timestamps: true,
    collection: 'membership_registrations'
  }
);

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true }
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

const Inquiry = mongoose.model('Inquiry', inquirySchema);
const MembershipRegistration = mongoose.model('MembershipRegistration', membershipSchema);
const User = mongoose.model('User', userSchema);

app.get('/api/health', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.status(200).json({
      ok: true,
      database: mongoose.connection.name,
      state: mongoose.connection.readyState
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.post('/api/submit-form', async (req, res) => {
  try {
    const payload = {
      name: String(req.body.name || '').trim(),
      email: normalizeEmail(req.body.email),
      phone: String(req.body.phone || '').trim(),
      message: String(req.body.message || '').trim(),
      formType: String(req.body.formType || '').trim(),
      source: 'free_trial'
    };

    const missingFields = getMissingFields(payload, ['name', 'email', 'phone', 'formType']);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Invalid details: ${missingFields.join(', ')} is required.`
      });
    }

    if (!isValidEmail(payload.email) || !isValidPhone(payload.phone)) {
      return res.status(400).json({
        error: 'Invalid details: please enter a valid email and phone number.'
      });
    }

    const savedInquiry = await Inquiry.create(payload);
    console.log('Free trial saved:', savedInquiry._id.toString());

    return res.status(201).json({
      message: 'Free trial saved successfully!',
      id: savedInquiry._id
    });
  } catch (err) {
    console.error('Form save error:', err);
    return res.status(500).json({ error: 'Failed to save form data' });
  }
});

app.post('/api/register-membership', async (req, res) => {
  try {
    const payload = {
      name: String(req.body.name || '').trim(),
      email: normalizeEmail(req.body.email),
      phone: String(req.body.phone || '').trim(),
      plan: String(req.body.plan || '').trim(),
      comments: String(req.body.comments || '').trim(),
      source: 'membership_registration'
    };

    const missingFields = getMissingFields(payload, ['name', 'email', 'phone', 'plan']);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Invalid details: ${missingFields.join(', ')} is required.`
      });
    }

    if (!isValidEmail(payload.email) || !isValidPhone(payload.phone)) {
      return res.status(400).json({
        error: 'Invalid details: please enter a valid email and phone number.'
      });
    }

    const savedRegistration = await MembershipRegistration.create(payload);
    console.log('Membership registration saved:', savedRegistration._id.toString());

    return res.status(201).json({
      message: 'Registration completed successfully!',
      id: savedRegistration._id
    });
  } catch (err) {
    console.error('Membership registration error:', err);
    return res.status(500).json({ error: 'Failed to save registration data' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const fullName = String(req.body.fullName || '').trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');

    const missingFields = getMissingFields({ fullName, email, password }, ['fullName', 'email', 'password']);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Invalid details: ${missingFields.join(', ')} is required.`
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid details: please enter a valid email address.' });
    }

    if (password.trim().length < 6) {
      return res.status(400).json({ error: 'Invalid details: password must be at least 6 characters.' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ error: 'Account already exists with this email.' });
    }

    const user = await User.create({
      fullName,
      email,
      passwordHash: hashPassword(password)
    });

    console.log('User signup saved in users collection:', user._id.toString());

    return res.status(201).json({
      message: 'Account created successfully!',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Failed to create account' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');

    const missingFields = getMissingFields({ email, password }, ['email', 'password']);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Invalid details: ${missingFields.join(', ')} is required.`
      });
    }

    const user = await User.findOne({ email });

    if (!user || user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    return res.status(200).json({
      message: 'Login successful!',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Failed to login' });
  }
});

const PORT = process.env.PORT || 5000;

connectDatabase().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
