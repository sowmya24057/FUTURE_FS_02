const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// GET all leads
router.get('/', async (req, res) => {
  const leads = await Lead.find().sort({ createdAt: -1 });
  res.json(leads);
});

// POST create new lead
router.post('/', async (req, res) => {
  const lead = new Lead(req.body);
  await lead.save();
  res.json(lead);
});

// PUT update a lead
router.put('/:id', async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(lead);
});

// DELETE a lead
router.delete('/:id', async (req, res) => {
  await Lead.findByIdAndDelete(req.params.id);
  res.json({ message: 'Lead deleted' });
});

module.exports = router;