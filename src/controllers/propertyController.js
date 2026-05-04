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
        floor_area,
        lot_size,
        year_built,
        amenities,
        address_lat,
        address_long,
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
        floor_area,
        lot_size,
        year_built,
        amenities,
        filePaths,
        address_lat,
        address_long,
      );

      res.status(201).json(property);
    } catch (error) {
      console.log(error);

      res.status(500).json({ error });
    }
  },
];

exports.updateProperty = [
  upload.array("files"),
  async (req, res) => {
    try {
      const propertyId = req.params.id;
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
        floor_area,
        lot_size,
        year_built,
        amenities,
        existingFiles,
        address_lat,
        address_long,
      } = req.body;

      // Parse existing files safely
      let oldFiles = [];
      if (existingFiles) {
        try {
          oldFiles =
            typeof existingFiles === "string"
              ? JSON.parse(existingFiles)
              : existingFiles;
        } catch {
          oldFiles = [];
        }
      }

      // Map newly uploaded files
      const newFiles =
        req.files?.map((file) => "uploads/" + file.filename) || [];

      // Merge files
      const allFiles = [...oldFiles, ...newFiles];

      // Update property
      const updatedProperty = await Property.updateProperty(propertyId, {
        manager_id,
        property_title,
        address,
        property_type,
        monthly_price,
        bedrooms,
        bathrooms,
        description,
        availability,
        floor_area,
        lot_size,
        year_built,
        amenities,
        files: allFiles, // use 'files' if your model expects an array
        address_lat,
        address_long,
      });

      res.status(200).json(updatedProperty);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update property" });
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
