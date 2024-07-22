import mongoose from "mongoose";
import fs from "fs";
import Client from "../models/ClientModel.js";

// Controller for adding a new client
export const addClient = async (req, res) => {
  const { name, location } = req.body;
  console.log(name);
  console.log(req.file);
  try {
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    if (!location) {
      return res.status(400).json({ error: "Location is required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const image = req.file.filename;

    const newClient = await Client.create({ name, image, location });

    res.status(200).json(newClient);
  } catch (error) {
    console.error(error);
    const imagePath = `public/images/${req.file.filename}`;
    fs.unlinkSync(imagePath);
    res
      .status(500)
      .json({ error: "Internal Server Error", msg: error.message });
  }
};

// Controller for editing a client
export const editClient = async (req, res) => {
  const id = req.body.id;
  const { name, location } = req.body;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid client ID" });
    }

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    if (!location) {
      return res.status(400).json({ error: "Location is required" });
    }

    const existingClient = await Client.findById(id);

    if (!existingClient) {
      return res.status(404).json({ error: "Client not found" });
    }

    let updatedImage = existingClient.image;
    if (req.file) {
      const imagePath = `public/images/${existingClient.image}`;
      fs.unlinkSync(imagePath);
      updatedImage = req.file.filename;
    }

    const updatedClientData = {
      name: name || existingClient.name,
      location: location || existingClient.location,
      image: updatedImage,
    };

    const updatedClient = await Client.findByIdAndUpdate(
      id,
      updatedClientData,
      {
        new: true,
      }
    );

    res.status(200).json(updatedClient);
  } catch (error) {
    console.error(error);
    const imagePath = `public/images/${req.file.filename}`;
    fs.unlinkSync(imagePath);
    res
      .status(500)
      .json({ error: "Internal Server Error", msg: error.message });
  }
};

// Controller for deleting a client
export const deleteClient = async (req, res) => {
  const id = req.body.id;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid client ID" });
    }

    const client = await Client.findOne({ _id: id });

    const deletedClient = await Client.findByIdAndDelete(id);

    if (!deletedClient) {
      return res.status(404).json({ error: "Client not found" });
    }

    const imagePath = `public/images/${client.image}`;
    fs.unlinkSync(imagePath);

    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", msg: error.message });
  }
};

// Controller for getting all clients
export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();

    const clientCount = clients.length;

    return res.status(200).json({ clients, clientCount });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", msg: error.message });
  }
};
