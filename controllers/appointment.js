    const { StatusCodes } = require("http-status-codes");
    const { BadRequestError, NotFoundError } = require("../errors/not-found");
    const Appointment = require("../models/Appointment")
    const Doctor = require("../models/Doctor")
    const mongoose = require("mongoose")


    //get all Appointment
    const getAllAppointments = async (req, res) => {

          req.body = req.user.userId;
          
          const appointment = await Appointment.find( ).sort("createdAt");
          res.status(StatusCodes.OK).json({ appointment, count: appointment.length });
    };



    // get by id
    const getAppointment = async (req, res) => {
          const {
            user: { userId },
            params: { id: AppointmentId },
          } = req;

          const appointment = await Appointment.findOne({ _id: AppointmentId});
            if (!appointment) {
              throw new NotFoundError(`No Appointments found with the id ${AppointmentId} `);
            }
              res.status(StatusCodes.OK).json({ appointment });
    };



        const createAppointment = async (req, res) => {
          try {
            const { userId } = req.user;
            const { doctorId } = req.body;
            console.log(req.user)

                // Check if doctorId is a valid ObjectId
                if (!mongoose.Types.ObjectId.isValid(doctorId)) {
                  return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid doctor ID" });
                }



                // Validate that the doctorId exists in the database
                const doctor = await Doctor.findById(doctorId);
                if (!doctor) {
                  return res.status(StatusCodes.NOT_FOUND).json({ error: "Doctor not found" });
                }




                // If doctor is found, create the appointment
                const appointment = await Appointment.create({
                  ...req.body,
                  createdBy: userId,
                  userId: userId,
                });

            // Add the appointment ID to the doctor's appointments array and save
            doctor.appointments.push(appointment._id);
            await doctor.save();

            res.status(StatusCodes.CREATED).json({ appointment });
          } catch (err) {
            console.error(`Error creating appointment: `, err);
            res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
          }
        };


        //patch
        const updateAppointment = async (req, res) => {
          const {
            body: { createdAt, reason },
            user: { userId },
            params: { id: AppointmentId },
          } = req;

        //console.log(req.user)

          if (reason === "" ) {
            throw new BadRequestError("reason fields cannot be empty ");
          }

          const appointment = await Appointment.findByIdAndUpdate(
            { _id: AppointmentId, createdBy: userId },
            req.body,
            { new: true, runValidators: true }
          );
          if (!appointment) {
            throw new NotFoundError(`No Appointment with id ${AppointmentId}`);
          }
          res.status(StatusCodes.OK).json({ appointment });
        };



        //delete Appointment
        const deleteAppointment = async (req, res) => {
          const {
            user: { userId },
            params: { id: AppointmentId },
          } = req;
          //console.log(req.user.userId)

          const appointment = await Appointment.findByIdAndRemove({
            _id: AppointmentId,
            createdBy: userId,
          });
          if (!appointment) {
            throw new NotFoundError(`No Appointment id ${AppointmentId}`);
          }
          res.status(StatusCodes.OK).json({ msg: "successfully delete" });
        };
      
        

    module.exports = {
      getAllAppointments,
      getAppointment,
      createAppointment,
      updateAppointment,
      deleteAppointment,
    };



