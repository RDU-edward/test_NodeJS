const db = require("../config/db");

const Property = {
  createProperty: async (
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
    files,
    address_lat,
    address_long,
  ) => {
    const fileData = files ? JSON.stringify(files) : null;
    console.log(fileData);
    try {
      const [result] = await db.execute(
        "Call createProperty(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
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
          fileData,
          address_lat,
          address_long,
        ],
      );
      return { success: true, message: "Property Inserted" };
    } catch (error) {
      console.log(error);
    }
  },

  updateProperty: async (
    property_id,
    {
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
      files,
      address_lat,
      address_long,
    },
  ) => {
    try {
      // Ensure photos is an array
      // const fileData =
      //   files && Array.isArray(files) ? JSON.stringify(files) : null;
      console.log(files);

      const fileData = files ? JSON.stringify(files) : null;
      console.log(fileData, "asdfs");

      const [result] = await db.execute(
        "CALL updateProperty(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          property_id,
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
          fileData,
          address_lat,
          address_long,
        ],
      );

      // Optionally return the updated property object
      return { success: true, message: "Property Updated", property_id };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getPropertyById: async (id) => {
    const [rows] = await db.execute("Call getPropertyById(?)", [id]);
    return rows;
  },

  // getPropertyByManagerId
  getAllAvailableProperties: async () => {
    try {
      const [rows] = await db.execute("Call getAllAvailableProperties");
      return rows[0];
    } catch (error) {
      console.log(error);
    }
  },

  // getPropertyByManagerId
  getAllPropertyManagerId: async (id) => {
    try {
      const [rows] = await db.execute("Call getAllPropertyByManagerId(?)", [
        id,
      ]);
      return rows[0];
    } catch (error) {
      console.log(error);
    }
  },

  // updateProperty: async (id) => {
  //   const [result] = await
  // }
};

module.exports = Property;
