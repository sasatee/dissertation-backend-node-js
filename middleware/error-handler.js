


// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const { object } = require('joi')
const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    //set default
    statusCode:err.StatusCodes || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.message || "Something went wrong. Try again later!"

  }

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }


  if (err.name === "ValidationError") {
    //console.log(Object.values(err.error))
    customError.err = Object.values(err.errors)
      .map((item) => item.message.replace(/\+/g, ""));
      customError.msg = customError.err.join(", "); 
    customError.statusCode = 400;
}




  if(err.code && err.code === 11000){
    customError.msg = `${Object.keys(err.keyValue)} already existed!!!, Please enter another ${Object.keys(err.keyValue)}`
    customError.statusCode = 400;
  }



  if(err.name === "CastError" ){
    customError.msg = `No item found with id : ${err.value}`
    customError.statusCode = 404;
  }

  
    //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
    return res.status(customError.statusCode).json({msg:customError.msg})
}

module.exports = errorHandlerMiddleware
