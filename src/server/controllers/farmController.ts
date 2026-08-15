import { Request, Response } from 'express';
import Farm from '../models/Farm';

export const getFarmProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const farm = await Farm.findOne({ userId } as any);
    res.json({ farm });
  } catch (error) {
    console.error('Error fetching farm:', error);
    res.status(500).json({ error: 'Failed to fetch farm profile' });
  }
};

export const updateFarmProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { name, location, totalAreaInAcres } = req.body;
    
    let farm = await Farm.findOne({ userId } as any);
    
    if (farm) {
      if (name) farm.name = name;
      if (location) {
        farm.location = {
            ...farm.location,
            ...location
        };
      }
      if (totalAreaInAcres !== undefined) farm.totalAreaInAcres = totalAreaInAcres;
      await farm.save();
    } else {
      farm = new Farm({
        userId,
        name: name || 'My Farm',
        location: location || {},
        totalAreaInAcres: totalAreaInAcres || 0,
        fields: []
      });
      await farm.save();
    }
    
    res.json({ farm });
  } catch (error) {
    console.error('Error updating farm:', error);
    res.status(500).json({ error: 'Failed to update farm profile' });
  }
};
