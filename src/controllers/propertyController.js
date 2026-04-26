const Property = require("../models/propertyModel");
const upload = require("../utils/uploadMiddleware");

exports.createProperty = [
  upload.array("files"),
  async (req, res) => {
    try {
      const {
        manager_id,
        property_title,
        address,
        property_type,
        monthly_price,
        bedrooms,
        bathrooms,
        description,
        availability,
      } = req.body;
      // const filePaths = req.files ? req.files.map((photo) => photo.path) : [];
      const filePaths = req.files
        ? req.files.map((photo) => "uploads/" + photo.filename)
        : [];
      console.log(req.files);

      console.log(filePaths);

      const property = await Property.createProperty(
        manager_id,
        property_title,
        address,
        property_type,
        monthly_price,
        bedrooms,
        bathrooms,
        description,
        availability,
        filePaths,
      );

      res.status(201).json(property);
    } catch (error) {
      console.log(error);

      res.status(500).json({ error });
    }
  },
];

exports.getAllAvailableProperties = async (req, res) => {
  try {
    const properties = await Property.getAllAvailableProperties();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPropertyManagerId = async (req, res) => {
  try {
    const properties = await Property.getAllPropertyManagerId(req.params.id);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const [result] = await Property.getPropertyById(req.params.id);
    res.json(result);
    console.log(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
