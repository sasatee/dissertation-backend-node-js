const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Admin = require('../models/Admin');
const { registerAdmin,loginAdmin } = require('../controllers/admin');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
describe('Admin Controller', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Admin.deleteMany({});
  });

  describe('registerAdmin', () => {
    it('should register a new admin', async () => {
      const req = {
        body: {
          email: 'admin@example.com',
          password: 'password123',
          userName: 'adminUser',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await registerAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith({ message: 'Admin registered successfully' });

      const admin = await Admin.findOne({ email: 'admin@example.com' });
      expect(admin).toBeTruthy();
      expect(admin.email).toBe('admin@example.com');
    });

    it('should return an error if admin already exists', async () => {
      const existingAdmin = new Admin({
        email: 'admin@example.com',
        password: 'password123',
        userName: 'adminUser',
      });
      await existingAdmin.save();

      const req = {
        body: {
          email: 'admin@example.com',
          password: 'password123',
          userName: 'adminUser',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await registerAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: 'Admin already exists' });
    });

    it('should return a server error on exception', async () => {
      const req = {
        body: {
          email: 'admin@example.com',
          password: 'password123',
          userName: 'adminUser',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest.spyOn(Admin.prototype, 'save').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      await registerAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('loginAdmin', () => {
    it('should login an existing admin', async () => {
      const admin = new Admin({
        email: 'admin@example.com',
        password: 'password123',
        userName: 'adminUser',
      });
      await admin.save();

      const req = {
        body: {
          email: 'admin@example.com',
          password: 'password123',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest.spyOn(admin, 'comparePassword').mockResolvedValueOnce(true);
      jest.spyOn(jwt, 'sign').mockReturnValueOnce('fake-jwt-token');

      await loginAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith({ token: 'fake-jwt-token' });
    });

    it('should return an error if admin does not exist', async () => {
      const req = {
        body: {
          email: 'nonexistent@example.com',
          password: 'password123',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await loginAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should return an error if password does not match', async () => {
      const admin = new Admin({
        email: 'admin@example.com',
        password: 'password123',
        userName: 'adminUser',
      });
      await admin.save();

      const req = {
        body: {
          email: 'admin@example.com',
          password: 'wrongpassword',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest.spyOn(admin, 'comparePassword').mockResolvedValueOnce(false);

      await loginAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should return a server error on exception', async () => {
      const req = {
        body: {
          email: 'admin@example.com',
          password: 'password123',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest.spyOn(Admin, 'findOne').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      await loginAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });
});