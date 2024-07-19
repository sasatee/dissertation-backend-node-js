// const mongoose = require('mongoose');
// const { MongoMemoryServer } = require('mongodb-memory-server');
// const Admin = require('../models/Admin');
// const { registerAdmin,loginAdmin } = require('../controllers/admin');
// const { StatusCodes } = require('http-status-codes');
// const jwt = require('jsonwebtoken');
// describe('Admin Controller', () => {
//   let mongoServer;

//   beforeAll(async () => {
//     mongoServer = await MongoMemoryServer.create();
//     await mongoose.connect(mongoServer.getUri(), {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//   });

//   afterAll(async () => {
//     await mongoose.disconnect();
//     await mongoServer.stop();
//   });

//   beforeEach(async () => {
//     await Admin.deleteMany({});
//   });

//   describe('registerAdmin', () => {
//     it('should register a new admin', async () => {
//       const req = {
//         body: {
//           email: 'admin@example.com',
//           password: 'password123',
//           userName: 'adminUser',
//         },
//       };

//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };

//       await registerAdmin(req, res);

//       expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
//       expect(res.json).toHaveBeenCalledWith({ message: 'Admin registered successfully' });

//       const admin = await Admin.findOne({ email: 'admin@example.com' });
//       expect(admin).toBeTruthy();
//       expect(admin.email).toBe('admin@example.com');
//     });

//     it('should return an error if admin already exists', async () => {
//       const existingAdmin = new Admin({
//         email: 'admin@example.com',
//         password: 'password123',
//         userName: 'adminUser',
//       });
//       await existingAdmin.save();

//       const req = {
//         body: {
//           email: 'admin@example.com',
//           password: 'password123',
//           userName: 'adminUser',
//         },
//       };

//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };

//       await registerAdmin(req, res);

//       expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
//       expect(res.json).toHaveBeenCalledWith({ message: 'Admin already exists' });
//     });

//     it('should return a server error on exception', async () => {
//       const req = {
//         body: {
//           email: 'admin@example.com',
//           password: 'password123',
//           userName: 'adminUser',
//         },
//       };

//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };

//       jest.spyOn(Admin.prototype, 'save').mockImplementationOnce(() => {
//         throw new Error('Database error');
//       });

//       await registerAdmin(req, res);

//       expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
//       expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
//     });
//   });

//   describe('loginAdmin', () => {
//     it('should login an existing admin', async () => {
//       const admin = new Admin({
//         email: 'admin@example.com',
//         password: 'password123',
//         userName: 'adminUser',
//       });
//       await admin.save();

//       const req = {
//         body: {
//           email: 'admin@example.com',
//           password: 'password123',
//         },
//       };

//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };

//       jest.spyOn(admin, 'comparePassword').mockResolvedValueOnce(true);
//       jest.spyOn(jwt, 'sign').mockReturnValueOnce('fake-jwt-token');

//       await loginAdmin(req, res);

//       expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
//       expect(res.json).toHaveBeenCalledWith({ token: 'fake-jwt-token' });
//     });

//     it('should return an error if admin does not exist', async () => {
//       const req = {
//         body: {
//           email: 'nonexistent@example.com',
//           password: 'password123',
//         },
//       };

//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };

//       await loginAdmin(req, res);

//       expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
//       expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
//     });

//     it('should return an error if password does not match', async () => {
//       const admin = new Admin({
//         email: 'admin@example.com',
//         password: 'password123',
//         userName: 'adminUser',
//       });
//       await admin.save();

//       const req = {
//         body: {
//           email: 'admin@example.com',
//           password: 'wrongpassword',
//         },
//       };

//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };

//       jest.spyOn(admin, 'comparePassword').mockResolvedValueOnce(false);

//       await loginAdmin(req, res);

//       expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
//       expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
//     });

//     it('should return a server error on exception', async () => {
//       const req = {
//         body: {
//           email: 'admin@example.com',
//           password: 'password123',
//         },
//       };

//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };

//       jest.spyOn(Admin, 'findOne').mockImplementationOnce(() => {
//         throw new Error('Database error');
//       });

//       await loginAdmin(req, res);

//       expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
//       expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
//     });
//   });
// });











// const mongoose = require('mongoose');
// const { MongoMemoryServer } = require('mongodb-memory-server');
// const Doctor = require('../models/Doctor');
// const { getAllDoctors, getDoctorById, updateDoctor } = require('../controllers/doctor');
// const { StatusCodes } = require('http-status-codes');

// describe('Doctor Controller', () => {
//   let mongoServer;

//   beforeAll(async () => {
//     mongoServer = await MongoMemoryServer.create();
//     await mongoose.connect(mongoServer.getUri(), {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//   });

//   afterAll(async () => {
//     await mongoose.disconnect();
//     await mongoServer.stop();
//   });

//   beforeEach(async () => {
//     await Doctor.deleteMany({});
//   });

//   describe('getAllDoctors', () => {
//     it('should return all doctors', async () => {
//       const doctorsData = [
//         { name: 'Doctor One', email: 'doctor1@example.com', specialization: 'Cardiology', price: 100 },
//         { name: 'Doctor Two', email: 'doctor2@example.com', specialization: 'Neurology', price: 150 },
//       ];
//       await Doctor.insertMany(doctorsData);

//       const req = {};
//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };

//       await getAllDoctors(req, res);

//       expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
//       expect(res.json).toHaveBeenCalledWith({
//         doctors: expect.any(Array),
//         count: doctorsData.length,
//       });
//     });

//     it('should handle server errors', async () => {
//       jest.spyOn(Doctor, 'find').mockImplementationOnce(() => {
//         throw new Error('Database error');
//       });

//       const req = {};
//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };

//       await getAllDoctors(req, res);

//       expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
//       expect(res.json).toHaveBeenCalledWith({ msg: 'unauthentication error' });
//     });
//   });

//   describe('getDoctorById', () => {
//     it('should return a doctor by ID', async () => {
//       const doctor = new Doctor({ name: 'Doctor One', email: 'doctor1@example.com', specialization: 'Cardiology', price: 100 });
//       await doctor.save();

//       const req = { params: { id: doctor._id } };
//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };

//       await getDoctorById(req, res);

//       expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
//       expect(res.json).toHaveBeenCalledWith({ doctor: expect.any(Object) });
//     });

//     it('should return 404 if doctor not found', async () => {
//       const req = { params: { id: new mongoose.Types.ObjectId() } };
//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };

//       await getDoctorById(req, res);

//       expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
//       expect(res.json).toHaveBeenCalledWith({ msg: 'Doctor not found' });
//     });

//     it('should handle server errors', async () => {
//       jest.spyOn(Doctor, 'findById').mockImplementationOnce(() => {
//         throw new Error('Database error');
//       });

//       const req = { params: { id: new mongoose.Types.ObjectId() } };
//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };

//       await getDoctorById(req, res);

//       expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
//       expect(res.json).toHaveBeenCalledWith({ msg: 'Server error' });
//     });
//   });

//   describe('updateDoctor', () => {
//     it('should update a doctor profile', async () => {
//       const doctor = new Doctor({ firstName: 'Doctor One', email: 'doctor1@example.com', specialization: 'Cardiology', price: 100 });
//       await doctor.save();

//       const req = {
//         params: { id: doctor._id },
//         body: { firstName: 'Updated Doctor One', price: 200 },
//       };
//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };

//       await updateDoctor(req, res);

//       expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
//       expect(res.json).toHaveBeenCalledWith({ doctor: expect.any(Object) });

//       const updatedDoctor = await Doctor.findById(doctor._id);
//       console.log(updatedDoctor); // Debug statement
//       expect(updatedDoctor.firstName).toBe('Updated Doctor One');
//       expect(updatedDoctor.price).toBe(200);
//     });

//     it('should return 404 if doctor not found', async () => {
//       const req = {
//         params: { id: new mongoose.Types.ObjectId() },
//         body: { name: 'Updated Doctor One', price: 200 },
//       };
//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };

//       await updateDoctor(req, res);

//       expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
//       expect(res.json).toHaveBeenCalledWith({ msg: `No doctor found with id ${req.params.id}` });
//     });

//     it('should handle server errors', async () => {
//       jest.spyOn(Doctor, 'findOneAndUpdate').mockImplementationOnce(() => {
//         throw new Error('Database error');
//       });

//       const req = {
//         params: { id: new mongoose.Types.ObjectId() },
//         body: { name: 'Updated Doctor One', price: 200 },
//       };
//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };

//       await updateDoctor(req, res);

//       expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
//       expect(res.json).toHaveBeenCalledWith({ msg: 'Server error', error: 'Database error' });
//     });
//   });
// });







const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const { register, login } = require('../controllers/auth');
const { StatusCodes } = require('http-status-codes');
const sendEmail = require('../util/email');

jest.mock('../util/email'); // Mock the sendEmail function

describe('Auth Controller', () => {
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
    await User.deleteMany({});
    await Doctor.deleteMany({});
  });

  describe('register', () => {
    it('should register a new user and send verification email', async () => {
      const req = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'Password123!',
          isDoctor: false,
          gender: 'male',
          profilePicture: 'http://example.com/profile.jpg',
        },
        protocol: 'http',
        get: jest.fn().mockReturnValue('localhost:3000'),
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        user: expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          isDoctor: false,
          profilePicture: 'http://example.com/profile.jpg',
        }),
        message: 'Verification email sent. Please check your inbox.',
      }));
      expect(sendEmail).toHaveBeenCalled();
    });

    it('should return an error if email already exists', async () => {
      const existingUser = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
        isDoctor: false,
        gender: 'male',
        profilePicture: 'http://example.com/profile.jpg',
      });
      await existingUser.save();

      const req = {
        body: {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'Password123!',
          isDoctor: false,
          gender: 'female',
          profilePicture: 'http://example.com/profile.jpg',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Email already exists' });
    });
  });

  describe('login', () => {
    it('should login an existing user', async () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123!', 
        isDoctor: false,
        gender: 'male',
        profilePicture: 'http://example.com/profile.jpg',
      });
      await user.save();

      const req = {
        body: {
          email: 'john.doe@example.com',
          password: 'Password123!',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        user: expect.objectContaining({
          userId: user._id,
          firstname: 'John',
          lastname: 'Doe',
          gender: 'male',
          isDoctor: false,
          profilePicture: 'http://example.com/profile.jpg',
        }),
        token: expect.any(String),
      }));
    });

    it('should return an error for invalid credentials', async () => {
      const req = {
        body: {
          email: 'john.doe@example.com',
          password: 'WrongPassword!',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid Credentials, please verify email again ' });
    });

    it('should return an error if user does not exist', async () => {
      const req = {
        body: {
          email: 'userdoesnotexist@example.com',
          password: 'Password123!',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid Credentials, please verify email again ' });
    });
  });
});
