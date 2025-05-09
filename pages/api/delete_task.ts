import { NextApiRequest, NextApiResponse } from 'next';
import { delete_task } from '@/lib/db';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { taskID } = req.body;
    
    if (!taskID) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const success = await delete_task(taskID);
  
    return res.status(200).json({ message: 'Task deleted successfully', success });
  } catch (error) {
    console.error('Error in deleting task API:', error);
    return res.status(500).json({ message: 'Failed to delete task', error: (error as Error).message });
  }
}