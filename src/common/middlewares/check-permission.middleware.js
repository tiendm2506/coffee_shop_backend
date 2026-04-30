const checkPermission = (req, res, next) => {
  try {

    next()
  } catch (error) {
    next(error)
  }
}