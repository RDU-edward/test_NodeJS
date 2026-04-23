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
    files,
  ) => {
    const fileData = files ? JSON.stringify(files) : null;
    console.log(fileData);

    const [result] = await db.execute(
      "Call createProperty(?,?,?,?,?,?,?,?,?,?)",
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
        fileData,
      ],
    );
    return { success: true, message: "Property Inserted" };
  },

  getPropertyById: async (id) => {
    const [rows] = await db.execute(
      "Select * FROM node_property WHERE id = ?",
      [id],
    );

    return rows;
  },

  getAllProperty: async () => {
    try {
      const [rows] = await db.execute("Select * from node_property");
      return rows;
    } catch (error) {
      console.log(error);
    }
  },

  // updateProperty: async (id) => {
  //   const [result] = await
  // }
};

module.exports = Property;
